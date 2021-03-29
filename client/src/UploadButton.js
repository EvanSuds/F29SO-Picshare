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


    handleChange (e) {
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
                    self.props.onUpload(base64);
                    };
                reader.readAsDataURL(image);
                input.onchange = null;
                input.remove();
                };
            }

    render() {
      const { classes } = this.props;
        return (
            <div  >
              <label className={classes.button1} htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span" onClick={e => {
                  e.stopPropagation();
                  this.handleChange(e);
                }}>
                  Add an image
                </Button>
              </label>
            </div>
          );
    }

}
export default withStyles(styles, { withTheme: true })(UploadButton);
