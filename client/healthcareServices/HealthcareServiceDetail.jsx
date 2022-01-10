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

let defaultService = {
  resourceType: 'HealthcareService'
}

Session.setDefault('HealthcareService.Current', defaultService)


//====================================================================================
// MAIN COMPONENT

export function HealthcareServiceDetail(props){

  let classes = useStyles();

  let { 
    children, 
    healthcareService,
    ...otherProps 
  } = props;

  let activeHealthcareService = defaultService;

  activeHealthcareService = useTracker(function(){
    return Session.get('HealthcareService.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('HealthcareService.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }


  return(
    <div className='HealthcareServiceDetails'>

        <Grid container spacing={3}>
        <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Name</InputAdornment>
              <Input
                id="nameInput"
                name="nameInput"
                className={classes.input}
                placeholder="St. Elsewhere Hospital"              
                value={get(activeHealthcareService, 'name')}
                onChange={updateField.bind(this, 'name')}
                fullWidth              
              />       
            </FormControl>      
          </Grid>
          <Grid item xs={6}> 
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Category</InputAdornment>
              <Input
                id="categoryInput"
                name="categoryInput"
                className={classes.input}
                value={FhirUtilities.pluckCodeableConcept(get(activeHealthcareService, 'category[0]'))}
                onChange={updateField.bind(this, 'category')}
                fullWidth              
              />       
            </FormControl>      
          </Grid>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Type</InputAdornment>
              <Input
                id="typeInput"
                name="typeInput"
                className={classes.input}
                // placeholder=""              
                value={get(activeHealthcareService, 'type')}
                onChange={updateField.bind(this, 'type')}
                fullWidth              
              />          
            </FormControl>            
          </Grid>
          <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Specialty</InputAdornment>
              <Input
                id="specialtyInput"
                name="specialtyInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={FhirUtilities.pluckCodeableConcept(get(activeHealthcareService, 'specialty[0]'))}
                onChange={updateField.bind(this, 'specialty')}
                fullWidth           
                multiline   
              />
            </FormControl>
                             
          </Grid>
        </Grid>
    </div>
  );
}

HealthcareServiceDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  healthcareServiceId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  healthcareService: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
export default HealthcareServiceDetail;