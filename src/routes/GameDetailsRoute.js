import React, { useState, useEffect } from 'react';
import { Button, Container, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import firebase from '../utils/firebase';
import getGame from '../use_cases/getGame';
import getQuestions from '../use_cases/getQuestions';
import { EditableQuestion } from '../view_components/EditableQuestion';
import saveQuestion from '../use_cases/saveQuestion';
import CenteredContainer from '../view_components/CenteredContainer';

const GameDetailsRoute = (props) => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');

  const navigate = useNavigate();

  const handleDeleteGame = async () => {
    if (gameId && game) {
      try {
        const db = firebase.firestore();
        await deleteDoc(doc(db, 'games', gameId));
        navigate('/games');
      } catch (error) {
        console.error('刪除遊戲時發生錯誤', error);
      }
    }
  };

  const handleUpdateName = async () => {
    if (gameId && editedName.trim() !== '') {
      try {
        const db = firebase.firestore();
        await updateDoc(doc(db, 'games', gameId), { name: editedName });
        setGame((prevGame) => ({ ...prevGame, name: editedName }));
      } catch (error) {
        console.error('更新遊戲名稱時發生錯誤', error);
      }
    }
  };

  const handleResetName = () => {
    setEditedName(game.name);
  };

  useEffect(() => {
    if (gameId && game === null) {
      getGame(gameId)
        .then((game) => {
          setGame(game);
          return game;
        })
        .then((game) => getQuestions({ gameId: game.id }))
        .then(setQuestions);
    }

    if (editMode && game) {
      setEditedName(game.name);
    }
  }, [gameId, game, editMode]);

  if (game) {
    return (
      <CenteredContainer maxWidth={500}>
        <h1 className="mb-4">
          {editMode ? (
            <InputGroup size="lg">
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <InputGroupAddon addonType="append">
                <Button onClick={handleResetName} color="secondary" outline>
                  重置
                </Button>
                <Button onClick={handleUpdateName} color="primary" outline>
                  更改課程名稱
                </Button>
              </InputGroupAddon>
            </InputGroup>
          ) : (
            game.name
          )}
        </h1>
        <Container>
          {questions.length > 0 ? (
            <Link to={`/lobby/${gameId}`}>
              <Button color="success" size="lg">
                開始課程
              </Button>
            </Link>
          ) : null}
          <br />
          <br />
          {editMode ? (
            <Button
              onClick={() => {
                setEditMode(false);
                window.location.reload(); // Reload the page when ending editing mode
              }}
              color="primary"
              outline={editMode}
            >
              結束編輯
            </Button>
          ) : (
            <Button color="primary" onClick={() => setEditMode(true)}>
              編輯課程
            </Button>
            
          )}
          
          <br />
          <br />
          
          <Button onClick={handleDeleteGame} color="danger" style={{ marginBottom: 20 }} outline>
            刪除課程
          </Button>
        </Container>
        {editMode && (
          <Container>
            {questions.map((question) => (
              <EditableQuestion key={question.id} question={question} game={gameId} />
            ))}
            <Container>
              <Button
                onClick={() => {
                  saveQuestion({ gameId: gameId, order: questions.length + 1 }).then((newQn) =>
                    setQuestions(questions.concat([newQn]))
                  );
                }}
              >
                新增題目
              </Button>
              <br />
              <br />
            </Container>
          </Container>
        )}
      </CenteredContainer>
    );
  } else {
    return <CenteredContainer maxWidth={500}>載入中...</CenteredContainer>;
  }
};

export default GameDetailsRoute;