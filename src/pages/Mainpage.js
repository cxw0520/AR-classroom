//import React from "react";
import { Grid, Container, Button } from 'semantic-ui-react'
import React, { useState } from 'react';
import styles from './styles.module.css'
import RwdYoutube from '../component/RwdYoutube';
import firebase from '../utils/firebase';
import { Link } from 'react-router-dom';

function Mainpage(){
    const [user, setUser] = useState(null);
    
    React.useEffect(() =>{
        firebase.auth().onAuthStateChanged((currentUser) =>{
        setUser(currentUser);
        })
    })

    return (
        <Container style={{ width: "100%", height: "100vh" }}>
        
            <Grid centered style={{ marginTop: "100px" }}>
                <div style={{ fontWeight: "bold", fontSize: 60, color: "#152544" }}>Avatar</div>
            </Grid>
            <Grid centered style={{ marginTop: "60px" }}>
                <div style={{ fontWeight: "bold", fontSize: 60, color: "#152544" }}>Classroom</div>
            </Grid>
            <Grid centered style={{ marginTop: "60px" }}>
                <div style={{fontSize: 30}}>為您提供一個全新</div>
            </Grid>
            <Grid centered style={{ marginTop: "40px" }}>
                <div style={{fontSize: 30}}>教學測驗模式</div>
            </Grid>
            <Grid centered style={{ marginTop: "40px" }}>
                <div style={{fontSize: 30}}>請搭配 webcam 使用</div>
            </Grid>
            {user ? (
                <></>
            ) : (
                <Grid centered style={{ marginTop: "40px" }}>
                    <Button color='positive' size='large' as={Link} to ="/signin">立即註冊/登入</Button>
                </Grid>
            )}
            <Grid centered style={{ marginTop: "40px" }}>
                <Grid.Column width={12}>
                    <RwdYoutube
                        src="https://www.youtube.com/embed/tiz7wmd3hVI?si=ahy36OFD6OKGsMiv;autoplay=1&mute=1"//need to mute and autoplay
                        controls
                        width="100%"
                    /> 
                </Grid.Column>
            </Grid>
            <br/>
            <Grid style={{ marginTop: "120px" }} >
                
                <Grid.Column floated='left' width={10}>
                    <div className={styles.small_note}>製作人名單</div>
                    <div className={styles.small_note}>吳承軒&nbsp;陳苡銜&nbsp;褚帛諭&nbsp;洪麒祥</div>
                </Grid.Column>
                <Grid.Column floated='right' width={6}>
                    <div className={styles.small_note} style={{textAlign: "right"}}>In Memory of</div>
                    <div className={styles.small_note} style={{textAlign: "right"}}>洪麒祥</div>
                </Grid.Column>
            </Grid>
            
        </Container>
    );
};


export default Mainpage;