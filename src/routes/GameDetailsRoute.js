import React, { useState, useEffect } from 'react'
import { Button, Container } from 'reactstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import getGame from '../use_cases/getGame';
import getQuestions from '../use_cases/getQuestions';
import { EditableQuestion } from '../view_components/EditableQuestion';
import saveQuestion from '../use_cases/saveQuestion';
import CenteredContainer from '../view_components/CenteredContainer';
import { doc, deleteDoc } from "firebase/firestore";
import firebase from "../utils/firebase";


const GameDetailsRoute = props => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();
  const handleDeleteGame = async () => {
    if (gameId && game) {
      try {
        const db = firebase.firestore();        
        await deleteDoc(doc(db, "games", gameId));        
        navigate('/games');
      } catch (error) {
        console.error('刪除遊戲時發生錯誤', error);
        // 在錯誤處理方面，你可以根據需要採取進一步的措施
      }
    }
  };

  useEffect(() => {
    if (gameId && game === null) {
      getGame(gameId)
        .then(game => {
          setGame(game);
          return game;
        })
        .then(game => getQuestions({ gameId: game.id }))
        .then(setQuestions);
    }
  }, [gameId, game]);

  if (game) {
    return (
      
      <CenteredContainer maxWidth={500}>
        <h1 className="mb-4">{game.name}</h1>
        <Container>
          {questions.length > 0
            ? <Link to={`/lobby/${gameId}`}>
                <Button color="success" size="lg">
                  開始課程
                </Button>
              </Link>
            : null
          } 
        </Container>
        {questions.map(question => <EditableQuestion key={question.id} question={question}/>)}
        <Container>
          <Button
            onClick={() => {
              saveQuestion({ gameId: gameId, order: questions.length + 1 })
                .then(newQn => setQuestions(questions.concat([newQn])))
            }}
          >
            新增題目
          </Button>
          <br/><br/>
          <Button
            style={{marginBottom:20}}
            onClick={handleDeleteGame}
            color="danger"
          >
            刪除遊戲
          </Button>
        </Container>
            
      </CenteredContainer>
    );
  } else {
    return (<CenteredContainer maxWidth={500}>Loading...</CenteredContainer>)
  }
}

export default GameDetailsRoute
