import { 
  Grid, 
  Container,
  Button,
  Typography,
  TextField,
  DatePicker,
  Box,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';


import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import { get, set } from 'lodash';
// import { setFlagsFromString } from 'v8';

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
  label: {
    paddingBottom: '10px'
  }
}));





function MeasureDetail(props){

  let classes = useStyles();


  let { 
    children, 
    measure,
    ...otherProps 
  } = props;




  function renderDatePicker(displayDatePicker, effectiveDateTime){
    //console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
  }
  function setHint(text){
    if(props.showHints !== false){
      return text;
    } else {
      return '';
    }
  }


  let inputStyle = {
    marginTop: '20px'
  }

  return(
    <div className='MeasureDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Title</InputAdornment>
              <Input
                id="titleInput"
                name="titleInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(measure, 'title')}
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
                value={get(measure, 'publisher')}
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
                value={get(measure, 'version')}
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
                value={get(measure, 'identifier[0].value')}
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
                value={get(measure, 'status')}
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
                value={get(measure, 'description')}
                //onChange={handleFhirEndpointChange}
                fullWidth           
                multiline   
              />
            </FormControl>
                             
          </Grid>
          <Grid item xs={6} style={{paddingLeft: '40px'}}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Editor</InputAdornment>
              <Input
                id="editorInput"
                name="editorInput"
                className={classes.input}            
                value={get(measure, 'editor[0].name')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Reviewer</InputAdornment>
              <Input
                id="reviewerInput"
                name="reviewerInput"
                className={classes.input}
                value={get(measure, 'reviewer[0].name')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Endorser</InputAdornment>
              <Input
                id="endorserInput"
                name="endorserInput"
                className={classes.input}         
                value={get(measure, 'endorser[0].name')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Last Edited</InputAdornment>
              <Input
                id="editedDateInput"
                name="editedDateInput"
                className={classes.input}
                placeholder="YYYY-MM-DD"              
                value={moment(get(measure, 'date')).format("YYYY-MM-DD")}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Last Reviewed</InputAdornment>
              <Input
                id="reviewedDateInput"
                name="reviewedDateInput"
                className={classes.input}
                placeholder="YYYY-MM-DD"              
                value={moment(get(measure, 'lastReviewDate')).format("YYYY-MM-DD")}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Approved On</InputAdornment>
              <Input
                id="approvedDateInput"
                name="approvedDateInput"
                className={classes.input}
                placeholder="YYYY-MM-DD"                   
                value={moment(get(measure, 'approvedDate')).format("YYYY-MM-DD")}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
                   
          </Grid>
        </Grid>
    </div>
  );
}

MeasureDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  measureId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  measure: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
ReactMixin(MeasureDetail.prototype, ReactMeteorData);
export default MeasureDetail;