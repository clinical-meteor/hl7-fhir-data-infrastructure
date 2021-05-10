import { 
  Grid, 
  Container,
  Button,
  Typography,
  DatePicker,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';


import React from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import { get, set } from 'lodash';



//===============================================================================================================
// Theming  


import { ThemeProvider, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  button: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: theme.buttonText,
    height: 48,
    padding: '0 30px',
  },
  input: {
    marginBottom: '20px'
  },
  compactInput: {
    marginBottom: '10px'
  },
  label: {
    paddingBottom: '10px'
  }
}));


//===============================================================================================================
// Main Component

function ListDetail(props){

  let classes = useStyles();

  let { 
    children, 
    list,
    ...otherProps 
  } = props;


  let renderElements = [];

  let approvedOnDate = '';
  if(get(list, 'approvedDate')){
    approvedOnDate = moment(get(list, 'approvedDate')).format("YYYY-MM-DD")
  }
  let lastEditedDate = '';
  if(get(list, 'date')){
    lastEditedDate = moment(get(list, 'date')).format("YYYY-MM-DD")
  }
  let lastReviewDate = '';
  if(get(list, 'lastReviewDate')){
    lastReviewDate = moment(get(list, 'lastReviewDate')).format("YYYY-MM-DD")
  }

  return(
    <div className='ListDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Title</InputAdornment>
              <Input
                id="titleInput"
                name="titleInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(list, 'title')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>   
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Publisher</InputAdornment>
              <Input
                id="publisherInput"
                name="publisherInput"
                className={classes.input}
                value={get(list, 'publisher')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>      
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Version</InputAdornment>
              <Input
                id="versionInput"
                name="versionInput"
                className={classes.input}
                placeholder="2020.2"              
                value={get(list, 'version')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />          
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={get(list, 'identifier[0].value')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Status</InputAdornment>
              <Input
                id="statusInput"
                name="statusInput"
                className={classes.input}
                placeholder="active"              
                value={get(list, 'status')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />    
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Description</InputAdornment>
              <Input
                id="descriptionInput"
                name="descriptionInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(list, 'description')}
                //onChange={handleFhirEndpointChange}
                fullWidth           
                multiline   
              />
            </FormControl>                             
          </Grid>          
        </Grid>
    </div>
  );
}

ListDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  listId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  list: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
ReactMixin(ListDetail.prototype, ReactMeteorData);
export default ListDetail;