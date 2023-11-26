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
        
        <Grid centered style={{ marginTop: "40px" }}>
            <div className={styles.hero_heading} style={{ fontWeight:"bold" }}>AR</div>
        </Grid>
        <Grid centered style={{ marginTop: "40px" }}>
            <div className={styles.hero_heading} style={{ fontWeight:"bold" }}>Classroom</div>
        </Grid>
        <Grid centered style={{ marginTop: "40px" }}>
            {user ? (
                <></>
            ) : (
            <Button color='positive' size='large' as={Link} to ="/signin">立即註冊/登入</Button>
            )}
        </Grid>
        <Grid centered style={{ marginTop: "40px" }}>
            <Grid.Column width={12}>
                <RwdYoutube
                    src="https://youtube.com/embed/LY_b0lxHX7o?feature=share;"
                    controls
                    width="100%"
                />
            </Grid.Column>
        </Grid>
        </Container>
    );
};


export default Mainpage;