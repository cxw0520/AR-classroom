import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from "react-router-dom"

import startNextQuestion from '../use_cases/startNextQuestion';
import { startTimer } from '../utils/calculateTimeLeft';
import CenteredContainer from '../view_components/CenteredContainer';

const SECONDS_TO_QUESTION = 3;

const PendingQuestionRoute = ({ parentUrl }) => {
  let { gameId } = useParams();
  const [ timeLeft, setTimeLeft ] = useState(SECONDS_TO_QUESTION);
  const [ nextQuestion, setNextQuestion ] = useState(null);

  useEffect(() => {
    if (gameId) {
      startTimer({ seconds: SECONDS_TO_QUESTION, intervalCallback: setTimeLeft, endedCallback: setTimeLeft });
      startNextQuestion(gameId).then(setNextQuestion);
    }
  }, [gameId])
  let url = "/host/" + gameId;
  return (
    <CenteredContainer verticalCentered={true}>
      <div style={{fontSize: 25}}>下一題...</div>
      <div className="display-1 mt-4">
        {Math.ceil(timeLeft)}
      </div>
      {timeLeft <= 0 && nextQuestion
        ? <Navigate to={`${url}/questions/current`} />
        : null
      }
    </CenteredContainer>
  )
}

export default PendingQuestionRoute