import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { Button, FormGroup, Label, Input, Form } from 'reactstrap';
import firebase from "../utils/firebase";

import addPlayer from '../use_cases/addPlayer';
import CenteredContainer from '../view_components/CenteredContainer';
import getGame from '../use_cases/getGame';



const JoinForm = ({ playerName, setPlayerName, joinGame }) => {
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const sanitizedInput = inputValue.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+/g, '');
    setPlayerName(sanitizedInput);
  };

  return (
    <Form onSubmit={e => {
      e.preventDefault();
      joinGame();
    }}>
      <FormGroup>
        <Label>輸入你的暱稱:</Label>
        <Input
          value={playerName}
          onChange={handleInputChange}
          pattern="[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+"
          title="English, symble, numbers only"
          placeholder='只限輸入英文、符號、數字'
        />
      </FormGroup>
      <Button color="primary" type="submit">加入房間</Button>
    </Form>
  )
}

const JoinRoute = () => {
  let { gameId } = useParams();
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [game, setGame] = useState(null);
  let playUrl = "";

  useEffect(() => {
    if (playerId) {
      const db = firebase.firestore();
      const sidCollection = db.collection('SID'); 

      sidCollection.doc(playerId).set({
        name: playerName,
        id: playerId
      })
      .then(() => {
        console.log("Player data stored in Firestore!");
      })
      .catch(error => {
        console.error("Error storing player data: ", error);
      });
    }
  }, [playerId, playerName]);

  useEffect(() => {
    if (gameId && game === null) {
      getGame(gameId).then(setGame);
    }
  }, [gameId, game])

  playUrl =  "?playUrl=/play/" + gameId + "/as/" + playerId;

  const redirectToPlay = () => {
    window.location.replace(`/Avatar-classroom/#/draw${playUrl}`);
  };

  return (
    <CenteredContainer maxWidth={500} verticalCentered>
      <h1>{game ? game.name : null}</h1>
      {playerId ? (
          redirectToPlay()
       ) : (
          <JoinForm
            playerName={playerName}
            setPlayerName={setPlayerName}
            joinGame={() => addPlayer({ name: playerName, gameId }).then(p => setPlayerId(p.id))}
          />
      )}
    </CenteredContainer>
  )
  
}

export default JoinRoute;