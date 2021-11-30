import './App.css';
import React, {useState} from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './Login';
import { BrowserRouter as Router,Switch, Route} from 'react-router-dom';



function App() {
  return (
    <div className="App">
    {!user ? (
      <Login/>
    ):(
      <div className="app_body">
        <Router>
          <Sidebar/>
          <Switch>
            <Route path="/rooms/:roomId">
              <Chat/>
            </Route>
            <Route path="/">
              <Chat/>
            </Route>              
          </Switch>            
        </Router>
      </div>
    )}
    </div>
  );
}

export default App;
