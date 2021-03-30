import React, {useState, useEffect}  from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar/NavBar';
import SideDrawer from './components/SideDrawer/SideDrawer';
import Backdrop from './components/Backdrop/Backdrop'
import './profile.css';
import {BrowserRouter , Switch, Route, Link, Redirect, withRouter, useHistory }from "react-router-dom";
import Axios from 'axios';
import { userInfo } from 'os';



const specialCharacterRegx = /[ !@#$%^&*()_+\-=[\]{}'"\\|,./]/;
const illegalCharacterRegx = /[<>;:?]/;
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
var Username, Fname, Lname, CommEmail, user, PostID, userId = ""; // Variables which can be used to update users details

 //credintials for get, using axios
 Axios.defaults.withCredentials = true;
class Profile extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    usersPostArray: [], // An array to store the users post information
    usersInfoArray: [], // An array to store the users information when fetched from the db
    keywords: '',
    users: [],
    followedUserIds: [],
    fans: []
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


getUserInfo() {
  Axios.post('http://localhost:3001/users', {
            username: user
        }).then((response) => {
          if(response){
            this.setState({
              usersInfoArray: response.data, // Store the information in the users info array
            });
          } else {
            console.log("no response")
          }
        });
  Axios.post('http://localhost:3001/myposts', {
          username: user
      }).then((response) => {
        console.log(response.data);
        if(response){
          this.setState({
          usersPostArray: response.data,
          });
        } else {
            console.log("no response")
            }
          });
}

componentDidMount() { // Runs after the first render
    Axios.get('http://localhost:3001/checklogin').then((response)=> {
    if(response.data.loggedIn === true){
      user = response.data.user[0].username
      userId = response.data.user[0].userID
      this.getUserInfo();
      this.getFollowedUsers();
      this.getFans(); // Fetch the users info and posts by calling function
    }
    });
}

checkValidity(e) { // Method to check if user first name and surname are valid
    var count = 0;
    specialCharacterRegx.test(e) ? count-- : count++;
    illegalCharacterRegx.test(e) ? count-- : count++;
    return count === 2;
}

checkEmailValidity(e) { // check if email is valid
  var count = 0;
  emailRegex.test(e) ? count-- : count++;
  return count === 1;
}

handleSubmit(event) { // Handle POST
    event.preventDefault();
    Axios.post('/update', { //Send to backend express nodejs server
      username : Username,
      fname : Fname,
      lname : Lname,
      commEmail : CommEmail,
    });
      this.getUserInfo();
      window.location.reload();
}

handleUploadImage (e, info, i, isAvatar=true) {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';
        input.accept = 'image/*';
        document.body.appendChild(input);
        input.click();

        const self = this;

        input.onchange = function () {
            const image = input.files[0];
            const reader = new FileReader();
            reader.onload = function () {
                const base64 = reader.result;
                Axios.post('http://localhost:3001/' + (isAvatar ? 'updateAvatar' : 'updateBackgroundImage') + '?profileID=' + info.profileID, {
                    img: base64
                }, {
                    'Content-Type': 'application/json'
                }).then((response) => {
                    if (response) {
                        const array = self.state.usersInfoArray;
                        if (isAvatar) {
                            info.Image = base64;
                        } else {
                            info.BackgroundImage = base64;
                        }
                        array[i] = info;
                        self.setState({
                            usersInfoArray: array
                        });
                    } else {
                        console.log("no response")
                    }
                });
            };
            reader.readAsDataURL(image);
            input.onchange = null;
            input.remove();
        }
    }

getFollowedUsers () {
            Axios.get('http://localhost:3001/getFollowedUsers?userId=' + userId).then((response) => {
                if (response) {
                    this.setState({
                        followedUserIds: response.data.map((user) => {
                          console.log(user.UserID);
                          return user.UserID
                        })
                    });
                } else {
                    console.log('no response');
                }
            });
        }

        getFans () {
            Axios.get('http://localhost:3001/getFans?userId=' + userId).then((response) => {
                if (response) {
                    this.setState({
                        fans: response.data
                    });
                } else {
                    console.log('no response');
                }
            });
        }

        searchUsers (keywords) {
        const self = this;
        Axios.post('http://localhost:3001/search_users', {
            name: keywords,
            userid : userId
        }).then((response) => {
            if (response) {
                self.setState({
                    users: response.data
                });
            } else {
                console.log('no response');
            }
        });
  }

follow (id) {
        const self = this;
        console.log(userId);
        console.log(id);
        if(userId != id) {
        Axios.post('http://localhost:3001/follow', {
            userId: userId,
            followUserId: id
        }).then((response) => {
            if (response) {
                const ids = this.state.followedUserIds;
                ids.push(id);
                self.setState({
                    followedUserIds: ids
                });
                self.getFans();
            } else {
                console.log('no response');
            }
        });
      }

    }

deleteImage(event) { // Handle POST
    event.preventDefault();
    var r = window.confirm("Are you sure you want to delete, this cannot be undone");
    if(r == true) {
      console.log(PostID);
      Axios.post('/deletepost', { //Send to backend express nodejs server
      postid : PostID
    });
      this.getUserInfo();
      window.location.reload();
    }
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
<div class = "profilePage" key = {i}>
         <div className="App">
                <Navbar drawerClickedHandler={this.drawerToggleClick} />
                {sideDrawer}
                {backdrop}
        </div>
        <br/>
        <div className = "square"
        title = "click to upload background image"
        style={{
          cursor: 'pointer',
          height: '300px',
          backgroundSize: '100% 100%',
          backgroundImage: info.backgroundImage ? `url(${info.backgroundImage})` : 'url("https://tomaszjanickiphoto.co.uk/wp-content/gallery/scotland/DSC_8286.jpg")'
          }}
          onClick={(e) => {
              this.handleUploadImage(e, info, i, false);
          }}
        >
          <span>
            <p>
              <img
                src = {info.image}
                alt = 'No Image set'
                style={{ width: '80px', height: '80px', display: 'inline-block', margin: '10px', fontSize: '14px', lineHeight: '80px', textAlign: 'center', cursor: 'pointer' }}
                onClick={e => {
                  e.stopPropagation();
                  this.handleUploadImage(e, info, i, true);
                }}
                />
              {info.fname} {info.lname} (@{Username})
                <span>
                <br/>
                    I have
                    <span style={{ color: 'red', fontWeight: 600, margin: '0 10px' }}>{this.state.fans.length}</span>
                    followers and
                    <span style={{ color: 'red', fontWeight: 600, margin: '0 10px' }}>{info.points}</span>
                    points
                </span>

            </p>
          </span>
        </div>
      <h3>My Account</h3>
      <p>View and edit your personal info below</p>
        <div className="searcher">
          <input defaultValue={this.state.keywords} placeholder="search other users" onChange={(e) => {
            this.setState({
              keywords: e.target.value
            });
          }}/>
          <button onClick={(e) => {
            if (this.state.keywords.trim()) {
              this.searchUsers(this.state.keywords.trim());
            }
            }}>search users</button>
          </div>
          <div className="user-list">
          {
            this.state.users.map((user) => {
            return (
            <div className="user">
            <span>{user.username}   </span>
            {
              this.state.followedUserIds.includes(user.userID)
              ?
              <button className="disabled">Followed</button>
              :
              <button onClick={(e) => {
                this.follow(user.userID);
              }}>Follow</button>
              }
              </div>
            );
          })
        }
      </div>
      <p>Login Email: {info.login_Email}</p>
      <div class = "form">
      <form>

          <div class = "form-entry">
            <div class = "row-label">
              <label htmlFor="fname">First name:</label>
            </div>
            <div class = "row-field">
              <input type="text" id="fname" name="fname" autoComplete="new-password" defaultValue = {info.fname} onChange={ (e) => {
                  Fname = e.target.value;
                }}/>
            </div>
          </div>

          <div class = "form-entry">
            <div class = "row-label">
              <label htmlFor="lname">Last name:</label>
            </div>
            <div class = "row-field">
              <input type="text" id="lname" name="lname" autoComplete="new-password" defaultValue = {info.lname} onChange={ (e) => {
                  Lname = e.target.value;
                }}/>
              </div>
            </div>

          <div class = "form-entry">
            <div class = "row-label">
              <label htmlFor="email">Contact Email: </label>
            </div>
            <div class = "row-field">
              <input type = "text" id="email" name="email" autoComplete="new-password" defaultValue = {info.comm_email}  onChange={ (e) => {
                  CommEmail = e.target.value;
                }}/>
              </div>
            </div>
          <br/>
            <div class = "form-entry">
              <input type="submit" value="Update Info" class = "submitbutton" onClick={(e) => {
                if(!(this.checkValidity(Fname) && this.checkValidity(Lname) && this.checkEmailValidity(CommEmail.toLowerCase)) || (!(Fname.length > 0) || !(Lname.length > 0) || !(CommEmail.length > 0))) {
                  alert("The fields must not be empty or contain illegal characters");
                }
                else {
                  alert("Successfully Updated");
                  this.handleSubmit(e);
                }
              }}/>
            </div>
      </form>
      </div>
      <div>
      <br/>
        <h3> My Posts (Most recent first)</h3>

        {this.state.usersPostArray.map(post => <div key = {post}> <img src = {post.Image} width = "200" height = "200" px></img> <h3>{post.PostDes}</h3> <br/>
      <input type="submit" value="Delete Image" class = "deletebutton" onClick={(e) => {
          PostID = post.PostID;
          this.deleteImage(e);
        }}/>
      <br/>
      <hr class="solid2"/>
      </div>)}
        <footer>
          © 2021 by Picshare
        </footer>
        </div>
</div>
    )
  })}
  </>
   );
  }
}
ReactDOM.render(
    <Profile/>,
    document.getElementById('root')
  );

export default withRouter(Profile);
