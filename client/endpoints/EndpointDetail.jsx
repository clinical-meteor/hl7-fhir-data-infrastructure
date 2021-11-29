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

let defaultEndpoint = {
  resourceType: 'Endpoint'
}

Session.setDefault('Endpoint.Current', defaultEndpoint)


//====================================================================================
// MAIN COMPONENT

export function EndpointDetail(props){

  let classes = useStyles();


  let { 
    children, 
    endpoint,
    ...otherProps 
  } = props;

  let activeEndpoint = defaultEndpoint;

  activeEndpoint = useTracker(function(){
    return Session.get('Endpoint.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('Endpoint.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }



  return(
    <div className='EndpointDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Name</InputAdornment>
              <Input
                id="nameInput"
                name="nameInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(activeEndpoint, 'name')}
                onChange={updateField.bind(this, 'name')}
                fullWidth              
              />       
            </FormControl>   
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Managing Organization</InputAdornment>
              <Input
                id="managingOrgInput"
                name="managingOrgInput"
                className={classes.input}
                value={get(activeEndpoint, 'managingOrganization.display')}
                onChange={updateField.bind(this, 'managingOrganization.display')}
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
                value={get(activeEndpoint, 'version')}
                onChange={updateField.bind(this, 'version')}
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
                value={get(activeEndpoint, 'identifier[0].value')}
                onChange={updateField.bind(this, 'identifier[0].value')}
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
                value={get(activeEndpoint, 'status')}
                onChange={updateField.bind(this, 'status')}
                fullWidth              
              />    
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Address</InputAdornment>
              <Input
                id="addressInput"
                name="addressInput"
                className={classes.input}
                placeholder="http://localhost:3000/baseR4/metadata"              
                value={get(activeEndpoint, 'address')}
                onChange={updateField.bind(this, 'address')}
                fullWidth              
              />       
            </FormControl>  
                             
          </Grid>

          
        </Grid>
    </div>
  );
}

EndpointDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  endpointId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  endpoint: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default EndpointDetail;