
import React from 'react';
import PropTypes from 'prop-types';


import { 
  Button,
  Card,
  Checkbox,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Select,
  MenuItem,
} from '@material-ui/core';

import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';

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

let defaultOrganization = {
  resourceType: 'Organization'
}

Session.setDefault('Organization.Current', defaultOrganization)


//====================================================================================
// MAIN COMPONENT


export function OrganizationDetail(props){
  logger.debug('OrganizationDetail', props)
  let classes = useStyles();

  let { 
    children, 
    organization,
    organizationId,
    ...otherProps 
  } = props;

  let activeOrganization = defaultOrganization;

  activeOrganization = useTracker(function(){
    return Session.get('Organization.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('Organization.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }


  return(
    <div className='MeasureDetails'>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Name</InputAdornment>
              <Input
                id="nameInput"
                name="nameInput"
                className={classes.input}
                placeholder="St. James Infirmary"              
                value={get(activeOrganization, 'name', '')}
                onChange={updateField.bind(this, 'name')}
                fullWidth              
              />       
            </FormControl>       
          </Grid>
          <Grid item xs={4}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="12345"              
                value={get(activeOrganization, 'identifier[0].value', '')}
                onChange={updateField.bind(this, 'identifier[0].value')}
                fullWidth              
              />          
            </FormControl>   
          </Grid>
          <Grid item xs={5}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Address</InputAdornment>
              <Input
                id="addressLineInput"
                name="addressLineInput"
                className={classes.input}
                placeholder="123 Main St"              
                value={get(activeOrganization, 'address[0].line[0]', '')}
                onChange={updateField.bind(this, 'address[0].line[0]')}
                fullWidth              
              />    
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>City</InputAdornment>
              <Input
                id="cityInput"
                name="cityInput"
                className={classes.input}
                placeholder="New Orleans"              
                value={get(activeOrganization, 'address[0].city', '')}
                onChange={updateField.bind(this, 'address[0].city')}
                fullWidth              
              />    
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>State</InputAdornment>
              <Input
                id="stateInput"
                name="stateInput"
                className={classes.input}
                placeholder="LI"              
                value={get(activeOrganization, 'address[0].state', '')}
                onChange={updateField.bind(this, 'address[0].state')}
                fullWidth              
              />    
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Postal Code</InputAdornment>
              <Input
                id="postalCodeInput"
                name="postalCodeInput"
                className={classes.input}
                placeholder="12345"              
                value={get(activeOrganization, 'address[0].postalCode', '')}
                onChange={updateField.bind(this, 'address[0].postalCode')}
                fullWidth              
              />    
            </FormControl>
          </Grid>                              

          {/* <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Description</InputAdornment>
              <Input
                id="descriptionInput"
                name="descriptionInput"
                className={classes.input}
                placeholder=""              
                value={get(activeOrganization, 'description', '')}
                onChange={updateField.bind(this, 'description')}
                fullWidth           
                multiline   
              />
            </FormControl>            
          </Grid> */}
        </Grid>
    </div>
  );
}


OrganizationDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  organizationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  organization: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

export default OrganizationDetail;