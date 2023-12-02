import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { Button, Row, Col, Alert, Spinner } from 'reactstrap';

import getPlayer from '../use_cases/getPlayer';
import addAnswer from '../use_cases/addAnswer';
import getGame from '../use_cases/getGame';
import CenteredContainer from '../view_components/CenteredContainer';


const SECONDS_TO_CHOOSE = 3;


const AnswerGrid = ({ recordAnswer, isAnswerDisabled }) => {
  return (
    <Row>
      {
        ['A', 'B', 'C', 'D'].map((ans) =>
          <Col sm={12} md={6} className="mb-4" key={ans}>
            <Button
              color='info'
              outline
              className="w-100 h-100"
              onClick={() => recordAnswer(ans)}
              disabled={isAnswerDisabled}>
                <strong>{ans}</strong>
            </Button>
          </Col>
        )
      }
    </Row>
  )
}

const PlayerRoute = () => {
  let { gameId, playerId } = useParams()
  const [currentGame, setCurrentGame] = useState();
  const [playerName, setPlayerName] = useState('')
  const [answer, setAnswer] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isAnswerDisabled, setIsAnswerDisabled] = useState(false);

  const handleGameChange = (game) => {
    if (game) {
      // workaround to clear answer
      setAnswer(null);
      setCurrentGame(game);
    }
  }

  useEffect(() => {
    if (gameId && playerId) {
      getGame(gameId, handleGameChange);
      getPlayer(playerId, { gameId })
        .then(player => setPlayerName(player.name))
    }
  }, [gameId, playerId])

  const recordAnswer = ans => {
    // playerName is for convenience later, though it feels a little like this knows more about the store than it should
    if (isAnswerDisabled) {
      // If answer selection is disabled, do nothing
      return;
    }
    setIsAnswerDisabled(true); // Disable answer selection
    addAnswer({ playerId, playerName, gameId, choice: ans })
      .then(answer => {
        setAnswer(answer);
        setTimeout(() => {
          setAnswer(null); // Clear the answer after the timeout
          setIsAnswerDisabled(false); // Enable answer selection after the timeout
        }, SECONDS_TO_CHOOSE * 1000);
      })
      .catch(e => {
        setErrorMessage(e);
        setTimeout(() => {
          setErrorMessage('');
          setIsAnswerDisabled(false); // Enable answer selection after an error
        }, 5000);
      });
    }

  switch (currentGame ? currentGame.state : null) {
    case 'pendingQuestion':
      return (
        <CenteredContainer maxWidth={500} verticalCentered={true}>
          <div>
            <a>準備回答下一題</a>
            <Spinner
              color="info"
              type="grow"
              size="sm"
            >
              Loading...
            </Spinner>
            <a>請看投影喔!</a>
          </div>
        </CenteredContainer>
      )
    case 'showingQuestion':
      return (
        <CenteredContainer maxWidth={500} verticalCentered={true}>
          <Row className="mb-4">
            <Col sm={12}>
              <h2>Hi {playerName}!</h2>
              <h3>請看投影選擇答案:</h3>
            </Col>
          </Row>
          <AnswerGrid 
            recordAnswer={recordAnswer} 
            isAnswerDisabled={isAnswerDisabled}
          />
          {errorMessage ? <Alert color="danger">{errorMessage}</Alert> : null}
          {answer && isAnswerDisabled ? (
            
            <Row className="mb-4">
              <Col sm={12}>
                <h2>你選了 {answer.choice}!</h2>                
              </Col>
            </Row>
          ) : (
            <></>
          )
          }
          
        </CenteredContainer>
      );
    case 'showingQuestionResults':
      return (
        <CenteredContainer maxWidth={500} verticalCentered={true}>
          <div>
            <a>顯示回答結果</a>
            <Spinner
              color="info"
              type="grow"
              size="sm"
            >
              Loading...
            </Spinner>
            <a>請看投影喔!</a>
          </div>
        </CenteredContainer>
      );

    default:
      return (
        <CenteredContainer maxWidth={500} verticalCentered={true}>
          <div>
            <a>等待課程開始</a>
            <Spinner
              color="info"
              type="grow"
              size="sm"
            >
              Loading...
            </Spinner>
            <a>開始後請看投影喔!</a>
          </div>
        </CenteredContainer>
      )
  }
}

export default PlayerRoute
