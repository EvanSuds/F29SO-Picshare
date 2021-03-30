import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import {withRouter, useHistory, BrowserRouter , Switch, Route, Link, Redirect} from "react-router-dom";
import PostDialog from './PostDialog';
import Post from './Post';
import Axios from 'axios';
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
    root: {
      backgroundColor: "red"
    },
    listClass: {
      display:'inline-block',
    },
    listClass2: {
        display:'inline-block',
        alignItems:'center',
     justify:'center',

      }
  });


class Newsfeed extends Component {

    constructor(props){
        super(props);
        this.addPost = this.addPost.bind(this);
        this.createPost = this.createPost.bind(this);

        this.state = {
            feedItems : [],
            currentText : "",
            user : ""

        }
    }

    createPostNoAdd(description, tags, file) {
        return <Post key={this.state.feedItems.length} description={description} tags={tags} file={file} user={this.state.user} toAdd = {false}/>;
    }

    createPost(description, tags, file) {
        return <Post key={this.state.feedItems.length} description={description} tags={tags} file={file} user={this.state.user} toAdd = {true}/>;
    }

    addPost(description, tags, image) {
        const newPost = this.createPost(description, tags, image);
        this.setState({
            feedItems : this.state.feedItems.concat([newPost])
        });
    }

    getPosts() {

      Axios.post('http://localhost:3001/allposts', {
          }).then((response) => {
            if(response){

              console.log(response.data);
              for(var i = 0; i < response.data.length; i++) {
                const newPost = this.createPostNoAdd(response.data[i].PostDes,response.data[i].Username,response.data[i].Image,response.data[i].latitude,response.data[i].longitude);
                this.setState({
                    feedItems : this.state.feedItems.concat([newPost])
                });

            }
            } else {
                console.log("no response")
                }
              });
    }

    componentDidMount() { // Runs after the first render
        Axios.get('http://localhost:3001/checklogin').then((response)=> {
        if(response.data.loggedIn === true){
          this.setState({
              user : response.data.user[0].username
          });
          console.log(response.data.user[0].username)

        }

        });
        this.getPosts();

    }

    render(){
        const { classes } = this.props;

        return (
            <Container className={classes.listClass}>
            <PostDialog onPostSubmit={this.addPost}></PostDialog>
            <List ref="feed"className={classes.listClass2} >
                {console.log("number of elements: " + this.state.feedItems.length)}
                {this.state.feedItems.reverse().map((item) =>
                {
                return item
                })
                }
            </List>
            </Container>


        );
    }
}

export default withStyles(styles, { withTheme: true })(Newsfeed);
