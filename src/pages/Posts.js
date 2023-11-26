import { Grid, Item, Image } from 'semantic-ui-react'
import Topics from '../component/Topics';
import React from 'react';
import firebase from "../utils/firebase";

function Posts(){
    const [posts, setPosts] = React.useState([]);
    React.useEffect(() =>{
        firebase
            .firestore().collection("posts")
            .get().then((collectionSnapshot) =>{
                const data = collectionSnapshot.docs.map(docSnapshot => {
                    return docSnapshot.data();
                })
                setPosts(data);
            })
    }, [])
    return(
        <Grid>
            <Grid.Row>
                <Grid.Column width={3}><Topics/></Grid.Column>
                <Grid.Column width={10}>
                    <Item.Group>
                        {posts.map(post => {
                            return <Item>
                                <Item.Image src={post.imageUrl} />
                                <Item.Meta>
                                    <Image src={post.author.photoURL} />
                                    
                                </Item.Meta>
                                <Item.Content>
                                    
                                    <Item.Header>{post.title}</Item.Header>
                                    <Item.Description>{post.content}</Item.Description>
                                </Item.Content>
                            </Item>
                        })}
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={3}>空白</Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default Posts;