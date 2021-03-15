import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter , Switch, Route, Link, Redirect, withRouter, useHistory }from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import Profile from "./profile";
import isLoggedIn from "./App";
import isRegi from "./App";
import RegiLanding from "./regiLanding"
import allnewsFeed from "./allNewsfeed"
import Explore from "./explore";


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter >
      
      <Route exact path="/"> <App />  </Route>
      
      <ProtectedRoute path="/profile" component={Profile} isAuth={isLoggedIn}/>
      <ProtectedRoute path="/regiLanding" component={RegiLanding} isAuth={isRegi}/>
      <Route path="/allNewsfeed" component={allnewsFeed}/>
      <ProtectedRoute path="/explore" component={Explore} isAuth={true}/>
      
      
  </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
