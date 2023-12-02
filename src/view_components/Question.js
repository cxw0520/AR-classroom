import React from 'react'
import { Card, CardBody, Row, Col, CardTitle, CardText } from 'reactstrap';



const Question = ({ question, className }) => (
  <div className={className}>
    <h2 className="mb-4" style={{fontSize: 24}}>{question.text}</h2>
    <Row>
      {
        ['A', 'B', 'C', 'D'].map((ans) =>
          <Col key={ans} sm={12} md={6} className="mb-4">
            <Card>
              <CardBody>
                <CardTitle><strong style={{fontSize: 20}}>{ans}</strong></CardTitle>
                <CardText style={{fontSize: 20}}>
                  {question[`answer${ans}`]}
                </CardText>
              </CardBody>
            </Card>
          </Col>
        )
      }
    </Row>
  </div>
)

export default Question
