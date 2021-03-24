import React from 'react';
import { withStyles } from "@material-ui/core/styles";

import Button from '@material-ui/core/Button';


const styles = theme => ({
  root: {
    backgroundColor: "red"
  },
  btnc: {
    borderStyle: 'dashed',
    borderColor: 'red',

  }
});

class UploadButton extends React.Component {

    constructor(props){

        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        const file = URL.createObjectURL(event.target.files[0]);
        this.props.onUpload(file);
    }

    render() {
      const { classes } = this.props;
        return (
            <div  >
              <input className={classes.buttonHidden}
                accept="image/*"
                id="contained-button-file"
                onChange={this.handleChange}
                type="file"
              />
              <label className={classes.button1} htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  Add an image
                </Button>
              </label>
            </div>
          );
    }

}
export default withStyles(styles, { withTheme: true })(UploadButton);
