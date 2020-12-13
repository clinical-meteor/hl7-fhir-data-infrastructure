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
  Checkbox,
  TextField
} from '@material-ui/core';


import React from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
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
  compactInput: {
    marginBottom: '10px'
  },
  label: {
    paddingBottom: '10px'
  }
}));





function ValueSetDetail(props){

  let classes = useStyles();


  let { 
    children, 
    valueSet,
    ...otherProps 
  } = props;




  let renderElements = [];
  let composeIncludes = get(valueSet, 'compose.include');

  if(Array.isArray(composeIncludes)){
    composeIncludes.forEach(function(includeSystem, includeSystemIndex){
      renderElements.push(<Grid item xs={12}>
        <TextField
          id={"includeSystem-" + includeSystemIndex}
          name={"includeSystem-" + includeSystemIndex}
          type='text'
          label='Group Code'
          value={get(includeSystem, 'system')}
          fullWidth          
          style={{marginTop: '20px'}}
        />

      </Grid>)

      let includeConcepts = get(includeSystem, 'concept');
      if(Array.isArray(includeConcepts)){
        includeConcepts.forEach(function(concept, index){          
          renderElements.push(<Grid item xs={3}>
            <TextField
              id={"concecptCode-" + get(concept, 'code')}
              name={"concecptCode-" + get(concept, 'code')}
              type='text'
              label={index === 0 ? 'Concept Code' : ''}
              value={get(concept, 'code')}
              fullWidth   
              InputLabelProps={index === 0 ? {shrink: true} : null }
              // style={index === 0 ? {marginBottom: '20px'} : null }
            />  

          </Grid>)
          renderElements.push(<Grid item xs={9}>
            <TextField
              id={"conceptDisplay-" + get(concept, 'code')}
              name={"conceptDisplay-" + get(concept, 'code')}
              type='text'
              label={index === 0 ? 'Concept Display' : ''}
              value={get(concept, 'display')}
              fullWidth   
              InputLabelProps={index === 0 ? {shrink: true} : null }
              // style={index === 0 ? {marginBottom: '20px'} : null }         
            />  
          </Grid>)

        })
      }
    })    
  }

  let approvedOnDate = '';
  if(get(valueSet, 'approvedDate')){
    approvedOnDate = moment(get(valueSet, 'approvedDate')).format("YYYY-MM-DD")
  }
  let lastEditedDate = '';
  if(get(valueSet, 'date')){
    lastEditedDate = moment(get(valueSet, 'date')).format("YYYY-MM-DD")
  }
  let lastReviewDate = '';
  if(get(valueSet, 'lastReviewDate')){
    lastReviewDate = moment(get(valueSet, 'lastReviewDate')).format("YYYY-MM-DD")
  }

  return(
    <div className='ValueSetDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              id="titleInput"
              name="titleInput"
              type='text'
              label='Title'
              value={get(valueSet, 'title')}
              fullWidth  
              InputLabelProps={{
                shrink: true,
              }}
              style={{marginBottom: '20px'}}        
            />
            <TextField
              id="publisherInput"
              name="publisherInput"
              type='text'
              label='Publisher'
              value={get(valueSet, 'publisher')}
              fullWidth   
              InputLabelProps={{
                shrink: true,
              }}
              style={{marginBottom: '20px'}}             
            />  
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="versionInput"
              name="versionInput"
              type='text'
              label='Version'
              value={get(valueSet, 'version')}
              fullWidth   
              InputLabelProps={{
                shrink: true,
              }}
              style={{marginBottom: '20px'}}             
            /> 
            <TextField
                id="identifierInput"
                name="identifierInput"
              type='text'
              label='Identifier'
              value={get(valueSet, 'identifier[0].value')}
              fullWidth   
              InputLabelProps={{
                shrink: true,
              }}
              style={{marginBottom: '20px'}}             
            /> 
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="statusInput"
              name="statusInput"
              type='text'
              label='Status'
              value={get(valueSet, 'status')}
              fullWidth   
              InputLabelProps={{
                shrink: true,
              }}
              style={{marginBottom: '20px'}}             
            /> 
          </Grid>
          <Grid item xs={12}>            
            <TextField
              id="descriptionInput"
              name="descriptionInput"
              type='text'
              label='Description'
              value={get(valueSet, 'description')}
              fullWidth   
              InputLabelProps={{
                shrink: true,
              }}                     
            />                          
          </Grid>

          { renderElements }
          
        </Grid>
    </div>
  );
}

ValueSetDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  valueSetId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  valueSet: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default ValueSetDetail;