import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import CardContent from '@material-ui/core/CardContent';
import Axios from 'axios';







var split = [];
var add = true;


class Post extends Component {
    constructor(props) {
      super(props);

      this.state = { description: props.description, key: props.key, file: props.file, tags : props.tags, user: props.user, id:0};
      console.log("Props file: " + props.file);
    }



    postPostInfo() {

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
      console.log("in component")
  
        this.postPostInfo();
          
          
          
          
        

      
    }







    
    render() {
      return (
      
        <ListItem key={this.state.key}>
            <Card>
                <CardContent>
                <img src={this.state.file} />
                <Typography>
                    User
                </Typography>
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

export default Post;