import { 
  Grid, 
  Button, 
  Container,
  Typography,
  DatePicker,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';


import React, { useState } from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import moment from 'moment';
import { get, set, cloneDeep } from 'lodash';

import { FhirUtilities } from '../../lib/FhirUtilities';
import { lookupReferenceName } from '../../lib/FhirDehydrator';


//====================================================================================
// STYLING

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

let defaultCodeSystem = {
  resourceType: 'CodeSystem'
}

Session.setDefault('CodeSystem.Current', defaultCodeSystem)


//====================================================================================
// MAIN COMPONENT

export function CodeSystemDetail(props){

  let { 
    children, 
    codeSystem,
    ...otherProps 
  } = props;

  let classes = useStyles();

  let activeCodeSystem = defaultCodeSystem;

  activeCodeSystem = useTracker(function(){
    return Session.get('CodeSystem.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('CodeSystem.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }


  return(
    <div className='CodeSystemDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Title</InputAdornment>
              <Input
                id="titleInput"
                name="titleInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(activeCodeSystem, 'title')}
                onChange={updateField.bind(this, 'title')}
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
                value={get(activeCodeSystem, 'version')}
                onChange={updateField.bind(this, 'version')}
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
                value={get(activeCodeSystem, 'status')}
                onChange={updateField.bind(this, 'status')}
                fullWidth              
              />    
            </FormControl>
          </Grid>

          <Grid item xs={6}>  
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Name</InputAdornment>
              <Input
                id="nameInput"
                name="nameInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(activeCodeSystem, 'name')}
                onChange={updateField.bind(this, 'name')}
                fullWidth              
              />       
            </FormControl>   
          </Grid>
          <Grid item xs={6}>  
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Publisher</InputAdornment>
              <Input
                id="publisherInput"
                name="publisherInput"
                className={classes.input}
                value={get(activeCodeSystem, 'publisher')}
                onChange={updateField.bind(this, 'publisher')}
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
                value={get(activeCodeSystem, 'description')}
                onChange={updateField.bind(this, 'description')}
                fullWidth           
                multiline   
              />
            </FormControl>            
          </Grid>
        </Grid>
    </div>
  );
}

CodeSystemDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  codeSystemId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  codeSystem: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
export default CodeSystemDetail;