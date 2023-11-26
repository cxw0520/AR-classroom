import firebase from "../utils/firebase";
import React from "react";
import { List } from "semantic-ui-react";
import 'firebase/firestore';
import { Link, useLocation } from "react-router-dom";

function MyMenu(){
    const location = useLocation;
    const menuItems = [
    {
        name: '我的課程',
        path: '/my/courses'
    },
    {
        name: '結果報表',
        path: '/my/pastResults' 
    },
    {
        name: '會員資料',
        path: '/my/settings'
    }]
    console.log(location);
    return (
        <List animated selection>
            {menuItems.map((menuItem) => {
                return (
                    <List.Item 
                        as={Link} 
                        to={menuItem.path} 
                        key={menuItem.name} 
                        active={menuItem.path === location.pathname }
                    >
                        {menuItem.name}
                    </List.Item>
                );
            })}
        </List>
            
    );
}

export default MyMenu;