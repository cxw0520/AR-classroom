import React, { useState } from 'react'
import { Link, Navigate } from "react-router-dom"
import { Button, Form, FormGroup, Label, Input, ListGroup, ListGroupItem } from 'reactstrap';

import CenteredContainer from '../view_components/CenteredContainer';
import styles from './styles.module.css'
import findGamesByShortCode from '../use_cases/findGamesByShortCode';


function JoinS(){
  const [games, setGames] = useState([]);
  const [shortCode, setShortCode] = useState('');

  if (games.length > 1) {
    return (
      <CenteredContainer maxWidth={500} verticalCentered={true}>
        <ListGroup>
          {
            games.map(game => (
              <Link key={game.id} to={`/join/${game.id}`}>
                <ListGroupItem
                  tag="button"
                  action
                >
                  {game.name}
                </ListGroupItem>
              </Link>
            ))
          }
        </ListGroup>
      </CenteredContainer>
    );
  }
  else if (games.length === 1) {
    return <Navigate to={`/join/${games[0].id}`} />;
  }
  else {
    return (
      <CenteredContainer maxWidth={500} verticalCentered={true}>
        <h1 className={styles.hero_heading}>Avatar Classroom</h1>
        <Form
          className="mb-5"
          onSubmit={(e) => {
            e.preventDefault();
            findGamesByShortCode(shortCode).then(setGames);
          }}
        >
          <FormGroup>
            <Label for="shortCode">房間代碼:</Label>
            <Input id="shortCode" type="number" value={shortCode} onChange={e => setShortCode(e.target.value)} />
          </FormGroup>
          <Button
            color="primary"
            disabled={!shortCode}
            type="submit"
          >
            加入房間
          </Button>
        </Form>
        
        <aside hidden>
          Want to create your own quiz?&nbsp;
          <Link to="/login">
            Sign Up
          </Link>
        </aside>
      </CenteredContainer>
    );
  }
}

export default JoinS;
