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

import { FhirUtilities } from '../../lib/FhirUtilities';
import { lookupReferenceName } from '../../lib/FhirDehydrator';


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

let defaultInsurancePlan = {
  resourceType: 'InsurancePlan'
}

Session.setDefault('InsurancePlan.Current', defaultInsurancePlan)


//====================================================================================
// MAIN COMPONENT


export function InsurancePlanDetail(props){

  let classes = useStyles();


  let { 
    children, 
    insurancePlan,
    ...otherProps 
  } = props;

  let activeInsurancePlan = defaultInsurancePlan;

  activeInsurancePlan = useTracker(function(){
    return Session.get('InsurancePlan.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('InsurancePlan.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }

  return(
    <div className='InsurancePlanDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Name</InputAdornment>
              <Input
                id="nameInput"
                name="nameInput"
                className={classes.input}
                placeholder="ACME Hospital"              
                value={get(activeInsurancePlan, 'name')}
                onChange={updateField.bind(this, 'name')}
                fullWidth              
              />       
            </FormControl>   
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Type</InputAdornment>
              <Input
                id="typeInput"
                name="typeInput"
                className={classes.input}
                value={FhirUtilities.pluckCodeableConcept(get(activeInsurancePlan, 'type[0]'))}
                onChange={updateField.bind(this, 'type')}
                fullWidth              
              />       
            </FormControl>      
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Verification</InputAdornment>
              <Input
                id="verificationStatusInput"
                name="verificationStatusInput"
                className={classes.input}
                placeholder="2020.2"              
                value={get(activeInsurancePlan, 'verificationStatus')}
                onChange={updateField.bind(this, 'verificationStatus')}
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
                value={get(activeInsurancePlan, 'identifier[0].value')}
                onChange={updateField.bind(this, 'identifier[0].value')}
                fullWidth              
              />
            </FormControl>      */}
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Status</InputAdornment>
              <Input
                id="statusInput"
                name="statusInput"
                className={classes.input}
                placeholder="active"              
                value={get(activeInsurancePlan, 'status')}
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
                value={get(activeInsurancePlan, 'description')}
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

InsurancePlanDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  insurancePlanId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  insurancePlan: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
export default InsurancePlanDetail;