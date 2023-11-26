import React, { useState, useEffect } from 'react'
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import getCurrentUserGames from '../use_cases/getCurrentUserGames';
import { Navigate } from 'react-router-dom';


const MyGamesRoute = () => {
  const [games, setGames] = useState([]);
  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    getCurrentUserGames().then(setGames);
  }, []);

  if (redirectUrl) {
    return <Navigate to={redirectUrl} />;
  } else {
    return (
      <Container style={{maxWidth: "500px"}}>
        <h1>我的課程</h1>
        <ListGroup>
          {
            games.map(game => (
              <ListGroupItem
                key={game.id}
                onClick={() => setRedirectUrl(`/games/${game.id}`)}
                tag="button"
                action
              >
                {game.name}
              </ListGroupItem>
            ))
          }
          <ListGroupItem
            onClick={() => setRedirectUrl('/games/create')}
            tag="button"
            color="info"
            action
          >
            創建新課程
          </ListGroupItem>
        </ListGroup>
      </Container>
    )
  }
}

export default MyGamesRoute
