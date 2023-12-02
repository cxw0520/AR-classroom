import React, { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom"
import { Button, Card, CardBody, Row, Col, CardTitle, CardText, Container } from 'reactstrap';

import getQuestion from '../use_cases/getQuestion';
import calculateQuestionResults from '../use_cases/calculateQuestionResults';
import countTotalQuestions from '../use_cases/countTotalQuestions';
import CenteredContainer from '../view_components/CenteredContainer';


const isCorrectChoice = (question, choice) => {
  return question.correctAnswer === choice;
}

const ResultBoard = ({ result, className, question }) => {
  return (
    <div className={className}>
      <h2 className="mb-4">{question ? question.text : null}</h2>
      <Row>
        {
          Object.entries(result).map(([answer, players]) => (
            <Col sm={12} md={6} className="mb-4">
              <Card
                color={isCorrectChoice(question, answer) ? 'success' : null}
                inverse={isCorrectChoice(question, answer) ? true : null}
              >
                <CardBody>
                  <CardTitle >
                    <strong className='mr-2' style={{fontSize: 20}}>{answer}</strong>
                    {isCorrectChoice(question, answer) ? '✔️' : '❌'}
                  </CardTitle>
                  <CardTitle>
                    <strong style={{fontSize: 17}}>
                      {question[`answer${answer}`]}
                    </strong>
                  </CardTitle>
                  <CardText style={{fontSize: 17}}>
                    {players.join(', ')}
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          ))
        }
      </Row>
    </div>
  )
}

const QuestionResultsRoute = ({ parentUrl }) => {
  let { gameId, questionId } = useParams()
  let [result, setResult] = useState({})
  let [question, setQuestion] = useState(null)
  let [totalQuestionCount, setTotalQuestionCount] = useState(null)

  useEffect(() => {
    if (gameId && questionId) {
      getQuestion(questionId, { gameId }).then(setQuestion);
      countTotalQuestions(gameId).then(setTotalQuestionCount);
      calculateQuestionResults(gameId, questionId).then(setResult);
    }
  }, [gameId, questionId])
  let url = "/host/" + gameId;
  return (
    <CenteredContainer verticalCentered={true}>
      <ResultBoard className="mb-4" result={result} question={question} />
      <Container>
        {question && question.order >= totalQuestionCount ?
          <Link to={`${url}/results/final`}>
            <Button color="primary">
              顯示課程最終結果
            </Button>
          </Link>
          :
          <Link to={`${url}/questions/pending`}>
            <Button color="primary">
              下一題
            </Button>
          </Link>
        }
      </Container>
    </CenteredContainer>
  )
}

export default QuestionResultsRoute

// no result, no question, start button
// no result, question, no buttons if time out, else show button if within time
// have result, show result, hide question, next button (clears result)
