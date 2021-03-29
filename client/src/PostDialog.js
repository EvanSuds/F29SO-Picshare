import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import UploadButton from './UploadButton';
import Axios from 'axios';
import { withStyles } from "@material-ui/core/styles";
import exifr from 'exifr';


const styles = theme => ({
    root: {
      backgroundColor: "red"
    },
    postImage: {

        height: 'auto',
        maxWidth:'36vh',
        maxHeight:'33vw',
        borderRadius: '0%',
    },
    postBox: {
        borderStyle: 'dotted',
        borderColor: 'red'

    }
  });

var user = "";
class PostDialog extends React.Component {

    constructor(props){
        super(props);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.resetState = this.resetState.bind(this);
        this.state = {
            open : false,
            description : "",
            tags : "",
            file : null
        };
    }

    handleClickOpen() {
        this.setState({
            open : true
        });
    }

    handleClose() {
        this.setState({
            open : false
        });
    }

    handleUpload(file) {
        this.setState({
          file: file
        });
    }

    handleDescriptionChange(event){
        this.setState({
            description : event.target.value
        });
    }

    handleTagsChange(event){
        this.setState({
            tags : event.target.value
        })
    }

    resetState(){
        this.setState({
            description : "",
            tags : "",
            file : null
        })
    }

    handlePost(){
        this.props.onPostSubmit(this.state.description, this.state.tags, this.state.file);
        console.log("File: " + this.state.file);
        this.processFile(this.state.file);
        this.resetState();
        this.handleClose();
    }

    async processFile(arg) {
        let url;
        if (arg instanceof Blob)
            url = URL.createObjectURL(arg);
        else
            url = arg;
        // original image loaded, extract thumb
        try {
            let { latitude, longitude } = await exifr.gps(url);
            console.log(longitude);
            console.log(latitude);

            Axios.post('http://localhost:3001/posts', {
                postLong: longitude,
                postLat: latitude
            }).then((response) => {
                if (response) {
                } else {
                    console.log("no response")
                }


            })
        }
        catch{
            console.log("No EXIF Data");
        }

    }

    render () {
        const { classes } = this.props;
        return (
            <div >
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                Add Post
            </Button>
          <Dialog  onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open}>
            <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
              Create a new post
            </DialogTitle>
            <DialogContent dividers>
            <UploadButton onUpload={this.handleUpload} />
            <img className={classes.postImage} src={this.state.file} />
            <form noValidate autoComplete="off">
                <TextField  id="description" label="Add a description." multiline onChange={this.handleDescriptionChange}/>
                <br></br>
                <TextField id="tags" label="Add a few tags!" multiline onChange={this.handleTagsChange}/>
            </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.handlePost} color="primary">
                Post
              </Button>
              <Button onClick={this.handleClose} color="secondary">
                Discard
              </Button>
            </DialogActions>
          </Dialog>
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true }) (PostDialog);
