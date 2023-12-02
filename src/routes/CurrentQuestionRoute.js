import React, { useState, useEffect } from 'react'
import { useParams, Link } from "react-router-dom"
import { Button } from 'reactstrap';

import showCurrentQuestion from '../use_cases/showCurrentQuestion'
import Question from '../view_components/Question'
import { startTimer } from '../utils/calculateTimeLeft';
import CenteredContainer from '../view_components/CenteredContainer';

const SECONDS_TO_QUESTION = 10;

const ShowResultsBtn = ({ isVisible, linkTo }) => {
  const handleBtnClick = () => {
    if (isVisible) {
      window.location.href = linkTo;
    }
  };

  return isVisible ? (
    <Button color="primary" onClick={handleBtnClick}>
      顯示回答結果
    </Button>
  ) : null;
};

const CurrentQuestionRoute = ({ parentUrl }) => {
  let { gameId } = useParams();
  const [question, setQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(SECONDS_TO_QUESTION);

  useEffect(() => {
    if (gameId) {
      startTimer({ seconds: SECONDS_TO_QUESTION, intervalCallback: setTimeLeft, endedCallback: setTimeLeft });
      showCurrentQuestion(gameId).then(setQuestion);
    }
  }, [gameId])
  //let url = "/host/" + gameId ;
  return (
    <CenteredContainer verticalCentered={true}>
      {question ?
          <div>
            <Question question={question} />
            <div className="mt-4">剩餘時間:</div>
            <div className="display-1">
              {Math.ceil(timeLeft)}
            </div>
            <ShowResultsBtn
              isVisible={timeLeft <= 0}
              linkTo={`https://cxw0520.github.io/AC-Three/?GID=${gameId}&QID=${question.id}`}
            />
          </div>
        : <div>請稍等...</div>
      }
    </CenteredContainer>
  )
}

export default CurrentQuestionRoute
