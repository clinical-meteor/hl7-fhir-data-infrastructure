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

import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import { get, set } from 'lodash';

import { FhirUtilities } from '../../lib/FhirUtilities';
import { lookupReferenceName } from '../../lib/FhirDehydrator';

//====================================================================================
// THEMING

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



//====================================================================================
// SESSION VARIABLES

let defaultValueSet = {
  resourceType: 'ValueSet'
}

Session.setDefault('ValueSet.Current', defaultValueSet)


//====================================================================================
// MAIN COMPONENT

export function ValueSetDetail(props){

  let classes = useStyles();

  let { 
    children, 
    valueSet,
    ...otherProps 
  } = props;


  let activeValueSet = defaultValueSet;

  activeValueSet = useTracker(function(){
    return Session.get('ValueSet.Current');
  }, []);

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('ValueSet.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }



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
  if(get(activeValueSet, 'approvedDate')){
    approvedOnDate = moment(get(activeValueSet, 'approvedDate')).format("YYYY-MM-DD")
  }
  let lastEditedDate = '';
  if(get(activeValueSet, 'date')){
    lastEditedDate = moment(get(activeValueSet, 'date')).format("YYYY-MM-DD")
  }
  let lastReviewDate = '';
  if(get(activeValueSet, 'lastReviewDate')){
    lastReviewDate = moment(get(activeValueSet, 'lastReviewDate')).format("YYYY-MM-DD")
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
              value={get(activeValueSet, 'title')}
              onChange={updateField.bind(this, 'title')}
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
              value={get(activeValueSet, 'publisher')}
              onChange={updateField.bind(this, 'publisher')}
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
              value={get(activeValueSet, 'version')}
              onChange={updateField.bind(this, 'version')}
              fullWidth   
              InputLabelProps={{
                shrink: true,
              }}
              style={{marginBottom: '20px'}}             
            /> 
            {/* <TextField
                id="identifierInput"
                name="identifierInput"
              type='text'
              label='Identifier'
              value={get(activeValueSet, 'identifier[0].value')}
              onChange={updateField.bind(this, 'identifier[0].value')}
              fullWidth   
              InputLabelProps={{
                shrink: true,
              }}
              style={{marginBottom: '20px'}}             
            />  */}
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="statusInput"
              name="statusInpactiveValueSetut"
              type='text'
              label='Status'
              value={get(activeValueSet, 'status')}
              onChange={updateField.bind(this, 'status')}
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
              value={get(activeValueSet, 'description')}
              onChange={updateField.bind(this, 'description')}
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