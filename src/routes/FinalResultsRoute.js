import React, { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom"
import { ListGroup, ListGroupItem, Badge, Button, Container } from 'reactstrap';
import calculateFinalResults from '../use_cases/calculateFinalResults';
import CenteredContainer from '../view_components/CenteredContainer';


// Compares two Arrays of playerName, score in terms of ascending score.
const sortScores = (a, b) => {
  const [, score1] = a;
  const [, score2] = b;

  if (score1 > score2) {
    return -1;
  }
  if (score1 < score2) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

const Leaderboard = ({ results }) => {
  let scores = Object.entries(results);
  scores.sort(sortScores);

  return (
    <ListGroup>
      {
        scores.slice(0, 5).map(([key, value], index) => {
          if (index <= 2) {
            return <ListGroupItem key={key} className="d-flex justify-content-between" style={{fontSize: 17}}>{key}<Badge className="ml-4 p-2" color="success">{value}</Badge></ListGroupItem>;
          } else {
            return <ListGroupItem key={key} className="d-flex justify-content-between">{key}<Badge className="ml-4 p-2">{value}</Badge></ListGroupItem>;
          }
        })
      }
    </ListGroup>

  );
}

const FinalResultsRoute = props => {
  let { gameId } = useParams()
  let [results, setResults] = useState({})
  
  useEffect(() => {
    if (gameId) {
      calculateFinalResults(gameId).then(setResults);
    }
  }, [gameId])
  
  return (
    <CenteredContainer verticalCentered={true} maxWidth={500}>
      <h1>
        課程結果
      </h1>
      <Leaderboard results={results} />
      <br/>
      <Container>
        <Link to={`/games`}>
          <Button color="primary"> 
            回題目列表
          </Button>
        </Link>
        
      </Container>
      <br/>
      <Container>
        <Link to={`/`}>
          <Button color="primary"> 
            回首頁
          </Button>
        </Link>
      </Container>
    </CenteredContainer>
    
  )
  
}

export default FinalResultsRoute
