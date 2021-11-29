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


import React from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import { get, set } from 'lodash';
// import { setFlagsFromString } from 'v8';

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

let defaultSearchParams = {
  resourceType: 'SearchParameter'
}

Session.setDefault('SearchParameter.Current', defaultSearchParams)


//====================================================================================
// MAIN COMPONENT

export function StructureDefinitionDetail(props){

  let classes = useStyles();

  let { 
    children, 
    searchParameter,
    ...otherProps 
  } = props;

  let activeSearchParameter = defaultSearchParams;

  activeSearchParameter = useTracker(function(){
    return Session.get('SearchParameter.Current');
  }, []);

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('SearchParameter.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }


  return(
    <div className='StructureDefinitionDetails'>

        <Grid container spacing={3}>
          <Grid item xs={8}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Publisher</InputAdornment>
              <Input
                id="publisherInput"
                name="publisherInput"
                className={classes.input}
                value={get(activeSearchParameter, 'publisher')}
                onChange={updateField.bind(this, 'publisher')}
                fullWidth              
              />       
            </FormControl>                         
          </Grid>
         
          <Grid item xs={2}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Version</InputAdornment>
              <Input
                id="versionInput"
                name="versionInput"
                className={classes.input}
                placeholder="2020.2"              
                value={get(activeSearchParameter, 'version')}
                onChange={updateField.bind(this, 'version')}
                fullWidth              
              />          
            </FormControl>
            {/* <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={get(activeSearchParameter, 'identifier[0].value')}
                onChange={updateField.bind(this, 'identifier[0].value')}
                fullWidth              
              />
            </FormControl>      */}
          </Grid>
          <Grid item xs={2}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Status</InputAdornment>
              <Input
                id="statusInput"
                name="statusInput"
                className={classes.input}
                placeholder="active"              
                value={get(activeSearchParameter, 'status')}
                onChange={updateField.bind(this, 'status')}
                fullWidth              
              />    
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Derived From</InputAdornment>
              <Input
                id="derivedFromInput"
                name="derivedFromInput"
                className={classes.input}
                placeholder="http://"              
                value={get(activeSearchParameter, 'derivedFrom')}
                onChange={updateField.bind(this, 'derivedFrom')}
                fullWidth           
                multiline   
              />
            </FormControl>
                             
          </Grid>
          <Grid item xs={12}>
            <FormControl style={{width: '100%'}}>
              <InputAdornment className={classes.label}>Description</InputAdornment>
              <Input
                id="descriptionInput"
                name="descriptionInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(activeSearchParameter, 'description')}
                onChange={updateField.bind(this, 'description')}
                fullWidth           
                multiline   
              />
            </FormControl>
                             
          </Grid>
          <Grid item xs={12}>
            <FormControl style={{width: '100%'}}>
              <InputAdornment className={classes.label}>Expression</InputAdornment>
              <Input
                id="expressionInput"
                name="expressionInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(activeSearchParameter, 'expression')}
                onChange={updateField.bind(this, 'expression')}
                fullWidth           
                multiline   
              />
            </FormControl>
                             
          </Grid>

          
        </Grid>
    </div>
  );
}

StructureDefinitionDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  structureDefinitionId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  structureDefinition: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
export default StructureDefinitionDetail;