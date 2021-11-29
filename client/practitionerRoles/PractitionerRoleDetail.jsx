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

let defaultPractitionerRole = {
  resourceType: 'PractitionerRole'
}

Session.setDefault('PractitionerRole.Current', defaultPractitionerRole)


//====================================================================================
// MAIN COMPONENT



export function PractitionerRoleDetail(props){

  let classes = useStyles();


  let { 
    children, 
    practitionerRole,
    ...otherProps 
  } = props;

  let activePractitionerRole = defaultPractitionerRole;

  activePractitionerRole = useTracker(function(){
    return Session.get('PractitionerRole.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('PractitionerRole.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }


  return(
    <div className='PractitionerRoleDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Title</InputAdornment>
              <Input
                id="specialtyInput"
                name="specialtyInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={FhirUtilities.pluckCodeableConcept(get(activePractitionerRole, 'specialty[0]')) }
                onChange={updateField.bind(this, 'specialty')}
                fullWidth              
              />       
            </FormControl>   
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Organization</InputAdornment>
              <Input
                id="organizationInput"
                name="organizationInput"
                className={classes.input}
                value={lookupReferenceName(FhirUtilities.pluckReference(get(activePractitionerRole, 'organization'))) }
                onChange={updateField.bind(this, 'organization')}
                fullWidth              
              />       
            </FormControl>      
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Code</InputAdornment>
              <Input
                id="codeInput"
                name="codeInput"
                className={classes.input}
                placeholder="2020.2"              
                value={FhirUtilities.pluckCodeableConcept(get(activePractitionerRole, 'code[0]'))}
                onChange={updateField.bind(this, 'code[0]')}
                fullWidth              
              />          
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="verificationStatusInput"
                name="verificationStatusInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={get(activePractitionerRole, 'verificationStatus')}
                onChange={updateField.bind(this, 'verificationStatus')}
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
                value={get(activePractitionerRole, 'status')}
                onChange={updateField.bind(this, 'status')}
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
                placeholder="Lorem ipsum."              
                value={get(activePractitionerRole, 'description')}
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

PractitionerRoleDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  practitionerRoleId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  practitionerRole: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
export default PractitionerRoleDetail;