import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import firebase from "./utils/firebase";

function Header(){
    const [user, setUser] = React.useState(null);
    React.useEffect(() => {
        firebase.auth().onAuthStateChanged((currentUser) => {
            setUser(currentUser)
        });
    }, []);
    return (
        <Menu size="large">
            <Menu.Item as={Link} to="/">
                Avatar Classroom
            </Menu.Item>
            
            <Menu.Menu position="right">
                {user ? (
                <>  
                    <Menu.Item as={Link} to ="/games">我的課程</Menu.Item>
                    <Menu.Item as={Link} to ="/join-s">學生連結</Menu.Item>
                    <Menu.Item as={Link} to ="/settings">設定</Menu.Item>
                    <Menu.Item 
                        onClick={() => firebase.auth().signOut()} 
                        as={Link} to ="/"
                    >
                        登出
                    </Menu.Item>
                </> 
                ) : (
                <>
                    <Menu.Item as={Link} to ="/join-s">學生連結</Menu.Item>
                    <Menu.Item as={Link} to ="/signin">註冊/登入</Menu.Item>
                </>
                )}
            </Menu.Menu>
            
        </Menu>
    );
}

export default Header;