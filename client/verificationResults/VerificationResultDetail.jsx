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
import { useTracker } from 'meteor/react-meteor-data';

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

let defaultVerification = {
    resourceType: 'VerificationResult'
  }
  
  Session.setDefault('VerificationResult.Current', defaultVerification)
  
//====================================================================================
// MAIN COMPONENT

export function VerificationResultDetail(props){

  let classes = useStyles();


  let { 
    children, 
    verificationResult,
    ...otherProps 
  } = props;

  let activeVerificationResult = defaultVerification;

  activeVerificationResult = useTracker(function(){
    return Session.get('VerificationResult.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('VerificationResult.Current', set(activeVerificationResult, path, event.currentTarget.value))    
  }







  return(
    <div className='VerificationResultDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Target</InputAdornment>
              <Input
                id="targetInput"
                name="targetInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(activeVerificationResult, 'target')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>   
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Validation Type</InputAdornment>
              <Input
                id="validationTypeInput"
                name="validationTypeInput"
                className={classes.input}
                value={FhirUtilities.pluckCodeableConcept(get(activeVerificationResult, 'validationType'))}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Validation Process</InputAdornment>
              <Input
                id="validationProcessInput"
                name="validationProcessInput"
                className={classes.input}
                value={FhirUtilities.pluckCodeableConcept(get(activeVerificationResult, 'validationProcess[0]'))}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>      
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Status Date</InputAdornment>
              <Input
                id="statusDateInput"
                name="statusDateInput"
                className={classes.input}
                placeholder="2020.2"              
                value={moment(get(activeVerificationResult, 'statusDate')).format("YYYY-MM-DD")}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />          
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Last Performed</InputAdornment>
              <Input
                id="lastPerformedInput"
                name="lastPerformedInput"
                className={classes.input}
                placeholder="2020.2"              
                value={moment(get(activeVerificationResult, 'lastPerformed')).format("YYYY-MM-DD")}
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
                value={get(activeVerificationResult, 'status')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />    
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Next Scheduled</InputAdornment>
              <Input
                id="nextScheduledInput"
                name="nextScheduledInput"
                className={classes.input}
                placeholder="2020.2"              
                value={moment(get(activeVerificationResult, 'nextScheduled')).format("YYYY-MM-DD")}
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
                value={get(activeVerificationResult, 'description')}
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

VerificationResultDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  verificationResultId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  verificationResult: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default VerificationResultDetail;