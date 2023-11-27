import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from "react-router-dom"
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import qrcode from "qrcode";
import getLobbyPlayers from '../use_cases/getLobbyPlayers';
import getGame from '../use_cases/getGame';
import CenteredContainer from '../view_components/CenteredContainer';
import styles from './HomeRoute/styles.module.css'
import { Grid, Modal } from 'semantic-ui-react';


const PlayerList = ({ players }) => {
  return (
    <ListGroup>
      {
        players.map(player => (
          <ListGroupItem key={player.id}>{player.name}</ListGroupItem>
        ))
      }
    </ListGroup>
  );
}


const QRCode = ({ imageSize }) => {
  const [qrcodeData, setQRCodeData] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const currentUrl = window.location.href;
  const QRUrl = currentUrl.replace("lobby", "join");

  useEffect(() => {
    const generateQRCode = async (url) => {
      try {
        const dataURL = await qrcode.toDataURL(url);
        setQRCodeData(dataURL);
      } catch (error) {
        console.error("QR code generation error:", error);
      }
    };

    generateQRCode(QRUrl);
  }, []);

  useEffect(() => {
    if (qrcodeData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = qrcodeData;

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [qrcodeData]);

  return (
    <div className="qr-code-container">
      <canvas ref={canvasRef} width={imageSize} height={imageSize} style={{ display: 'none' }}/>
      <img ref={imageRef} src={qrcodeData} alt="QR Code" className="qr-code-image" style={{ width: imageSize, height: imageSize }} />
    </div>
  );
};

const LobbyRoute = props => {
  let { gameId } = useParams();
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState(null);
  const joinUrl = `${window.location.origin}/AR-classroom/#/join-s/`;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (gameId) {
      getLobbyPlayers(gameId, setPlayers);
      getGame(gameId).then(setGame);
    }
  }, [gameId])

  return (
    <Grid>
      
      <Grid.Row centered columns={2}>
        
        <Grid.Column width={8}>
          <Grid.Row>
          <CenteredContainer verticalCentered={true} maxWidth={800}>
            
            <h2>
              加入遊戲請前往
              <br/>
              <a href={joinUrl} rel="noopener noreferrer" target="_blank">{joinUrl}</a> 
              <br/>
              並輸入房間代碼: 
            </h2>
          </CenteredContainer>
          </Grid.Row>
          <Grid.Row verticalAlign='middle'>
            <CenteredContainer verticalCentered={true} maxWidth={800}>
              <br/>
            <h1 className={styles.hero_heading} style={{fontSize:60}}>
              <strong>{game ? game.shortCode : "___"}</strong>
            </h1>
            </CenteredContainer>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={3}>
          <h2>
            或掃描 QR code&nbsp;
            <Button 
              outline
              color="dark"
              onClick={() => setIsModalOpen(true)}
            >
              放大
            </Button>
          </h2>
          <Modal basic open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Button
              close
              color='primary'
              onClick={() => setIsModalOpen(false)}
            ></Button>
            <CenteredContainer>
              <QRCode imageSize="700px"/>
            </CenteredContainer>
          </Modal>
          
          <QRCode />
        </Grid.Column>
        
      </Grid.Row>
      <Grid.Row centered columns={1}>
        <h1>等待玩家加入...</h1>
      </Grid.Row>
      <Grid.Row>
        <CenteredContainer verticalCentered={true} maxWidth={800}>
       
            <Link to={`/host/${gameId}/questions/pending`}>
              <Button color="primary">開始</Button>
            </Link>
          
        </CenteredContainer>
      </Grid.Row>
      <Grid.Row>
        <CenteredContainer verticalCentered={true} maxWidth={800}>
          
          <PlayerList players={players} />
          
        </CenteredContainer>
      </Grid.Row>
    </Grid>
  )
}

export default LobbyRoute
