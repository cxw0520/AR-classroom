import React, { useState, useEffect } from 'react'
import { Container, FormGroup, Label, Input, Button } from 'reactstrap';
import getCurrentUser from '../use_cases/getCurrentUser';
import createGame from '../use_cases/createGame';
import { Navigate } from 'react-router-dom';


const save = (gameAttributes, onCreate) => {
  return createGame(gameAttributes).then(onCreate);
}

const CreateGameRoute = props => {
  const [user, setUser] = useState(null);
  const [gameName, setGameName] = useState('');
  const [game, setGame] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  if (game) {
    return <Navigate to="/games" />;
  } else {
    return (
      <Container style={{maxWidth: "500px"}}>
        <h1>創建您的課程</h1>
        <FormGroup>
          <Label for="name">課程名稱:</Label>
          <Input id="name" name="name" value={gameName} onChange={e => setGameName(e.target.value)} />
        </FormGroup>
        <Button color="primary" onClick={() => save({ name: gameName, ownerId: user.id }, setGame)}>確認</Button>
      </Container>
    )
  }
}

export default CreateGameRoute
