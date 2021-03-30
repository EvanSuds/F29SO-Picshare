import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import CardContent from '@material-ui/core/CardContent';
import Axios from 'axios';

var split = [];
var add = true;

const styles = theme => ({
  root: {
    backgroundColor: "red"
  },
  imageFileCard: {

  },
  imgc12: {
    height: 'auto',
    maxWidth:'40vh',
    maxHeight:'30vh',
    borderRadius: '0%',


  }
});

class Post extends Component {
    constructor(props) {
      super(props);

      this.state = {
        description: props.description,
        key: props.key,
        file: props.file,
        tags : props.tags,
        user: props.user,
        id:0,
        toAdd: props.toAdd
      };
    }

    postPostInfo() {
      if(!this.state.toAdd) {
        console.log("Not adding to DB");
      }
      else {
      Axios.post('http://localhost:3001/posts', {
                username: this.state.user,
                description: this.state.description,
                img: this.state.file
            }).then((response) => {
              if(response){
                console.log(response)
                this.setState({id : response.data.insertId});
                this.parseTags();
              }else {
                console.log("no response")
              }
            })
          add = false;
          Axios.post('http://localhost:3001/updateScore', {
                    username: this.state.user
                }).then((response) => {
                  if(response){
                    console.log(response)
                  }else {
                    console.log("no response")
                  }
                })
        }
    }

    postPostTags() {
      console.log("intags")
      console.log(this.state.id)
      if(this.state.id != 0){
        Axios.post('http://localhost:3001/tags', {
                  tags: split,
                  id: this.state.id
              }).then((response) => {
                if(response){
                }else {
                  console.log("no response")
                }
              })
        }
    }

    parseTags(){

      split = this.state.tags.split(" ")
      console.log(split)
      this.postPostTags();


    }

    componentDidMount() { // Runs after the first render
      //Every time a post is created, the postPostInfo method is called
        this.postPostInfo();
    }

    render() {
          const { classes } = this.props;

          return (
            <ListItem key={this.state.key}>
                <Card className={classes.imageFileCard}>
                    <CardContent>
                    <img className={classes.imgc12} src={this.state.file } />
                    <Typography color="textSecondary" gutterBottom>
                        {this.state.description}
                    </Typography>
                    <br></br>
                    <Typography color="textSecondary" gutterBottom>
                        {this.state.tags}
                    </Typography>
                    </CardContent>
                </Card>

            </ListItem>
          );
        }
    }

    export default withStyles(styles, { withTheme: true })(Post);
