import React, {useState, useEffect}       from 'react';
import './App.css';
import Axios from 'axios';
import { resolve } from 'dns';
import PasswordStrength from "./passwordStrength";
import Button from "react-bootstrap/Button";
import {BrowserRouter , Switch, Route, Link, Redirect, withRouter, useHistory }from "react-router-dom";
import Profile from "./profile";
import ProtectedRoute from "./protectedRoute";
import up from "./upA.png"







function App(props) {



  const history = useHistory();

  const redirect = (path) => {

    history.push(path);
  };


  //username for registration
  const [UsernameReg, setUsernameReg] = useState('');

  //username for registration
  const [EmailReg, setEmailReg] = useState('');

  //password for registration
  const [PasswordReg, setPasswordReg] = useState('');

  //confirm password for registration
  const [ConPasswordReg, setConPasswordReg] = useState('');

  //username for login
  const [UsernameEmail, setUsernameEmail] = useState('');

  //password for login
  const [Password, setPassword] = useState('');

  const [passwordFocus, setPasswordFocus] = useState(false);

  const [passwordValid, setPasswordValid] = useState({
    minlength: null,
    number: null,
    specialChar: null,
    illegalChar: null
  });

//checks if a user is logged in
  const [isLoggedIn, setisLoggedIn] = useState(false);

  //checks if a user is logged in
  const [isRegi, setisRegi] = useState(false);


  //status of the feedback header at the bottom of the page
  const [status, setStatus] = useState('');


  //toggle for registration div
  const [show, setShow] = useState(false);



  //credintials for get, using axios
  Axios.defaults.withCredentials = true;



  const isNumber =/\d/;
  const specialCharacterRegx = /[ !@#$%^&*()_+\-=\[\]{}'"\\|,.\/]/;
  const illegalCharacterRegx = /[<>;:?]/;

  const checkValidity = password => {
    setPasswordValid({
      minlength: password.length >= 8 ? true : false,
      number: isNumber.test(password) ? true : false,
      specialChar: specialCharacterRegx.test(password) ? true : false,
      illegalChar: illegalCharacterRegx.test(password) ? false : true
    })
  }




  // register post method
  function register(){


    if(passwordValid.illegalChar === true && passwordValid.minlength === true && passwordValid.specialChar === true && passwordValid.number === true) {
      if(PasswordReg === ConPasswordReg){

        Axios.post('http://localhost:3001/register', {
        username: UsernameReg,
        password: PasswordReg,
        email: EmailReg

        }).then((response) => {
          console.log("this is regi response " +response)
          if(response.data.message){
            setStatus(response.data.message)
          }




        });
        setisRegi(true);
        setStatus("You have registered!");




      }
      else{
        setStatus("Passwords do not match");
      }

    }
    else {
      setStatus("Password is invalid");
    }
  };


  // login post method
  const login = () => {

    Axios.post('http://localhost:3001/login', {
      usernameEmail: UsernameEmail,
      password: Password,

  }).then((response) => {
    if(response.data.message){
      setStatus(response.data.message);
      setisLoggedIn(false);
    }
    else {
      //console.log(response);
      //setStatus(response.data[0].Username);
      setisLoggedIn(true);
      if(response.data[0].Username !=="" && response.data[0].password !== ""){
        redirect("/profile");
      }else {
        setStatus("Please enter a username and password");
      }






    }
  });
  };



// login post method
const refresh = ()=>{

  Axios.post('http://localhost:3001/refresh', {


}).then((response) => {
  console.log("refresh response" + response)
});
};


// login post method
const update = () => {

  Axios.post('http://localhost:3001/updateTable', {


}).then((response) => {
  console.log("update response" + response)
});
};


 // login post method
 const loginRegi =  ()=>{
  Axios.post('http://localhost:3001/login', {
    usernameEmail: UsernameReg,
    password: PasswordReg,

}).then((response) => {
  //console.log("details " + UsernameReg + PasswordReg)
  if(response.data.message){
    //console.log("login regis response " + response.data.message);
    setisLoggedIn(false);
  }else{
    //console.log("this is the login " + response);
    redirect("/regiLanding");
  }

});
};


const help = () => {
  setTimeout(update(), 5000)
  setTimeout(refresh(), 5000)
  setTimeout(loginRegi(),5000)
}




//on page loading check if cookie exist for user being logged  in
useEffect( ()=> {
    Axios.get('http://localhost:3001/checklogin').then((response)=> {
    if(response.data.loggedIn === true){
      //console.log(response);
      //setStatus(response.data.user[0].Username);
      setisLoggedIn(true);

    }

    });
  }, []);


 return (


  <div className="App">
    <div className="regi">
      <h1 className="headings">Picshare is a social media webpage with an emphasis on gaming.
        Earn points and top the leaderboards and explore topics of your choosing and follow people with similar interests.</h1>
    <br/>
      <h1 className="headings">Sign Up</h1>
      {/*input for registration username */}
      <input className="regiUN" type="text" placeholder="Username" onChange={(e) => {
        setUsernameReg(e.target.value);
      }}/>
      <input className="regiEmail" type="text" placeholder="Optional Email" onChange={(e) => {
        setEmailReg(e.target.value);
      }}/>
      {/*input for registration password */}
      <input className="regiP" type="text" onFocus={ () => setPasswordFocus(true)} onBlur={ () => setPasswordFocus(false)} placeholder="Password" onChange={(e) => {

        setPasswordReg(e.target.value);
        checkValidity(e.target.value);
      }} />

      {/*input for registration confirmation password */}
      <input className="conRegiP" type="text" placeholder="Confirm password" onChange={(e) => {
        setConPasswordReg(e.target.value);
      }} />

      {passwordFocus? <PasswordStrength validity={passwordValid}/>:null}

      {/* register button that calls register function */}
      <Button className="button" onClick={(e) => {
        register()
      }}>Sign up</Button>
      {//reveal status below regi form
       !show?
      <h2 className="headings">{status}</h2>:null
    }
    { isRegi?
    <Button onClick={help}> set up profile</Button>:null
    }
    </div>
    <br></br>
    {/*button for toggling open registration div */}

    { //reveal login form
      !show?
    //button for toggling open registration div

    <Button className="button2" onClick={()=> {
      setShow(!show)
      setStatus("")
    }}>
    Already a member? login </Button>:null
    }
    {
      show?<div className="login">

      <h1 className="headings">Login</h1>
      {/*input for login username*/}
      <input className="logUN" type="text" placeholder="Username or Email" onChange={(e) => {
        setUsernameEmail(e.target.value);
      }} />
      {/*input for login password */}
      <input className="logP" type="text" placeholder="Password" onChange={(e) => {
        setPassword(e.target.value);
      }}/>
      <Button className="button" onClick={ login }>Login</Button>
      <br></br>
      <Button className="button2" onClick={()=> {
        setShow(!show);
        setStatus("")}
        }> <img className="up" alt="hide" src={up} /> </Button>








</div>:null
  }
   {/* header for feedback of login or registration status */}

  { // reveal status below login form
  show?
    <h2 className="headings">{status}</h2>:null
    }
</div>


 );



}

export default App;
