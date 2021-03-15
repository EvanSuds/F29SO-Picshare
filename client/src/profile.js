import React, {useState, useEffect}  from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar/NavBar';
import SideDrawer from './components/SideDrawer/SideDrawer';
import Backdrop from './components/Backdrop/Backdrop'
import './profile.css';
import {BrowserRouter , Switch, Route, Link, Redirect, withRouter, useHistory }from "react-router-dom";
import Axios from 'axios';
import { userInfo } from 'os';


var Username, Fname, Lname, CommEmail, user = ""; // Variables which can be used to update users details

 //credintials for get, using axios
 Axios.defaults.withCredentials = true;
class Profile extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    
    usersInfoArray: [], // An array to store the users information when fetched from the db
  };
}

state = {
    sideDrawerOpen: false
};

drawerToggleClick = () => {
    this.setState((prevState) => {
        return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
};

backdropClick = () => {
    this.setState({ sideDrawerOpen: false });
};




/*getUserInfo() {
    fetch('/users')// Use of the fetch API
    .then((resp) => resp.json()) //Get the JSON response
    .then((data) => {
      this.setState({
        usersInfoArray: data, // Store the information in the users info array
      });
    });
}
*/
getUserInfo() {
  
  Axios.post('http://localhost:3001/users', {
            username: user
        }).then((response) => {
          if(response){
            this.setState({
              usersInfoArray: response.data, // Store the information in the users info array
            });
          }else {
            console.log("no response")
          }
          

        })
}

componentDidMount() { // Runs after the first render
    Axios.get('http://localhost:3001/checklogin').then((response)=> {
    if(response.data.loggedIn === true){
      user = response.data.user[0].Username
      //console.log(response.data.user[0].Username)
      this.getUserInfo(); // Fetch the users info by calling function
      
    }
    
    });
    
}


handleSubmit(event) { // Handle POST
    event.preventDefault();

    Axios.post('/update', { //Send to backend express nodejs server
      username : Username,
      fname : Fname,
      lname : Lname,
      commEmail : CommEmail
    });
      console.log("resp received");
      this.getUserInfo();
      window.location.reload();

}

render() {

    let backdrop;
        let sideDrawer;

        if (this.state.sideDrawerOpen) {
            sideDrawer = <SideDrawer />;
            backdrop = <Backdrop click={this.backdropClick} />
        }

return (
  <>{this.state.usersInfoArray.map((info, i)=> {
    Username = info.username
    return(

    <div class ="blackBar">
         <div className="App">
                <Navbar drawerClickedHandler={this.drawerToggleClick} />
                {sideDrawer}
                {backdrop}
                
                
        </div>
        
    <br/>
      <div class = "userInfo">
        <div class = "square">
          <span>
            <p>
              <img className="profileimg" src = {info.image} alt = "Loading..." width = "100" height = "100" />
              {info.fname} {info.lname}
              </p>
          </span>
        </div>
      <h3>My Account</h3>
      <p>View and edit your personal info below</p>
      <hr class="solid2"/>
      <p>Login Email:</p>
      <p>{info.login_email}</p>
      <div class = "form">
      <form>
          <div class = "form-entry">
            <label for="fname">First name:</label>
            <br/>
            <input type="text" id="fname" name="fname" defaultValue = {info.fname} size = "40" onChange={ (e) => {
              Fname = e.target.value;
            }}/>
          </div>
          <div class = "form-entry">
            <label for="lname" id="fname">Last name:</label>
            <br/>
            <input type="text" id="lname" name="lname" defaultValue = {info.lname} size = "40" onChange={ (e) => {
              Lname = e.target.value;
            }}/>
          </div>
          <br/>
          <div class = "form-entry">
            <label for="email">Contact Email: </label>
            <br/>
            <input type = "text" id="email" name="email" defaultValue = {info.comm_email} size = "100" onChange={ (e) => {
              CommEmail = e.target.value;
            }}/>
          </div>
            <br/>
            <input type="submit" value="Update Info" class = "button" onClick={(e) => {
              this.handleSubmit(e);
            }}/>
      </form>
      </div>
      </div>
    <footer>
      © 2021 by Picshare
    </footer>
    </div>
    )
  })}</>
   );
  }
}
ReactDOM.render(
    <Profile/>,
    document.getElementById('root')
  );

export default withRouter(Profile);