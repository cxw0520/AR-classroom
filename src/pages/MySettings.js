import { Header, Button, Segment, Modal, Input, Container } from 'semantic-ui-react'
//import React from 'react';
import firebase from "../utils/firebase";
import React from 'react';




function MySettings( { user } ){
    const [isNameModalOpen, setIsNameModalOpen] = React.useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
    const [displayName, setDisplayName] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');

    function onSubmitName(){
        setIsLoading(true)
        user.updateProfile({
            displayName,
        }).then(() =>{
            setDisplayName('');
            setIsNameModalOpen(false);
            setIsLoading(false);
        });
    }

    function onSubmitPassword(){
        setIsLoading(true);
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email, oldPassword
        );
        user.reauthenticateWithCredential(credential).then(() => {
            user.updatePassword(newPassword).then(() => {
                setIsPasswordModalOpen(false);
                setOldPassword('');
                setNewPassword('');
                setIsLoading(false);
            });
        })
        

    }

    return(
        <Container>
            <>
            <Header>我的檔案</Header>
            <Header size='small'>
                使用者名稱
                <Button floated='right' onClick={() => setIsNameModalOpen(true)}>
                    修改
                </Button>
            </Header>
            <Segment vertical>{user.displayName}</Segment>
            <Modal basic open={isNameModalOpen} size='mini'>
                <Modal.Header>修改使用者名稱</Modal.Header>
                <Modal.Content>
                    <Input 
                        placeholder="輸入新的使用者名稱" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                        fluid 
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setIsNameModalOpen(false)}>取消</Button>
                    <Button onClick={onSubmitName} loading={isLoading} >修改</Button>
                </Modal.Actions>
            </Modal>

            </>
            <>
                <Header size='small'>
                    修改密碼
                    <Button floated='right' onClick={() =>  setIsPasswordModalOpen(true)}>
                        修改
                    </Button>
                </Header>
                <Segment vertical>********</Segment>
                <Modal basic size='mini' open={isPasswordModalOpen}>
                    <Modal.Header>修改使用者密碼</Modal.Header>
                    <Modal.Content>
                        <Modal.Header size="small">目前密碼</Modal.Header>
                        <Input 
                            placeholder="輸入舊密碼" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)}
                            fluid 
                        />
                        <Header></Header>
                        <Modal.Header size="small">新密碼</Modal.Header>
                        <Input 
                            placeholder="輸入新密碼" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            fluid 
                        />
                    </Modal.Content>
                    
                    <Modal.Actions>
                    <Button onClick={() => setIsPasswordModalOpen(false)}>取消</Button>
                    <Button onClick={onSubmitPassword} loading={isLoading} >修改</Button>
                    </Modal.Actions>
                </Modal>
            </>
        </Container>
    )
}

export default MySettings;