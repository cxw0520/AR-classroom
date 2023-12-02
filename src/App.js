import React from 'react';
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase from './utils/firebase';

import JoinRoute from './routes/JoinRoute'
import PlayerRoute from './routes/PlayerRoute'
//import HomeRoute from './routes/HomeRoute/HomeRoute';
import LobbyRoute from './routes/LobbyRoute';
import LoginRoute from './routes/LoginRoute';
import MyGamesRoute from './routes/MyGamesRoute';
import CreateGameRoute from './routes/CreateGameRoute';
//import HostRoute from './routes/HostRoute';
import GameDetailsRoute from './routes/GameDetailsRoute';
//import FindGameRoute from './routes/FindGameRoute';

import PendingQuestionRoute from './routes/PendingQuestionRoute';
import QuestionResultsRoute from './routes/QuestionResultsRoute';
import FinalResultsRoute from './routes/FinalResultsRoute';
import CurrentQuestionRoute from './routes/CurrentQuestionRoute';

import Header from "./Header";
import Signin from './pages/Signin'
//import Posts from "./pages/Posts";
import Draw from "./pages/Draw";
import MySettings from './pages/MySettings';
import Mainpage from './pages/Mainpage';

import JoinS from './pages/JoinS';

function App() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() =>{
    firebase.auth().onAuthStateChanged((currentUser) =>{
      setUser(currentUser);
    })
  })
  return (
    <HashRouter>
      <Header/>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginRoute/>} key={LoginRoute.id}/>            
            <Route path="/" exact element={<Mainpage/>} key={Mainpage.id}/> 
            <Route path="/signin" exact element={<Signin />} key={Signin.id}/>
            <Route path="/join-s" exact element={<JoinS/>} />
            
            <Route path="/lobby/:gameId" element={<LobbyRoute />} key={LobbyRoute.id}/>
            <Route path="/play/:gameId/as/:playerId" element={<PlayerRoute />} key={PlayerRoute.id}/>
            <Route path="/join/:gameId" element={<JoinRoute />} key={JoinRoute.id}/>
            <Route path="/games/create" element={<CreateGameRoute />} key={CreateGameRoute.id}/>
            <Route path="/games/:gameId" element={<GameDetailsRoute />} key={GameDetailsRoute.id}/>
            <Route path="/games" exact element={<MyGamesRoute />} key={MyGamesRoute.id}/>
            
            <Route path="/draw" exact element={<Draw />} key={Draw.id}/>
            <Route path="/settings" exact element={<MySettings user={user}/>} key={MySettings.id}/>

            <Route path="/host/:gameId/questions/pending" element={<PendingQuestionRoute/>} key={PendingQuestionRoute.id}/>
            <Route path="/host/:gameId/questions/current" element={<CurrentQuestionRoute />} key={CurrentQuestionRoute.id}/>
            <Route path="/host/:gameId/results/final" element={<FinalResultsRoute />} key={FinalResultsRoute.id}/>
            <Route path="/host/:gameId/results/:questionId" element={<QuestionResultsRoute />} key={QuestionResultsRoute.id}/>
          </Routes>
        </div>
    </HashRouter>
  );
}

export default App;