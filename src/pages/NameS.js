//unused file
import React, { useState, useEffect } from "react";
import { Button, Form, Input, Row, Col } from "reactstrap";
import firebase from "../utils/firebase";
import { v4 } from "uuid";

import CenteredContainer from '../view_components/CenteredContainer';

let SID = null;

const App = () => {
    const [nickname, setNickname] = useState("");
    const [id, setId] = useState(v4());
    SID = id;
    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!/^[a-zA-Z0-9!@#$%^&*()-_+=<>?]+$/.test(nickname)) {
        alert("暱稱只能使用英文、符號、數字");
        return;
        }

        const url = "draw" + "?SID=" + SID;
        window.location.href = url;
    };
    useEffect(() => {
        const db = firebase.firestore();
        db.collection("SID").doc(id).set({
            name: nickname,
            ID: id,
        });
    }, [nickname, id])

    return (
        <CenteredContainer maxWidth={500} verticalCentered={true}>
        <div>
        <h1>輸入暱稱</h1>
        
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <Input
                    type="text"
                    placeholder="請輸入暱稱"
                    value={nickname}
                    onChange={handleNicknameChange}
                    />
                </Col> 
            </Row>
            
            <Button type="submit" color="primary">完成</Button>
        </Form>
        
        </div>
        </CenteredContainer>
    );
};

export default App;
