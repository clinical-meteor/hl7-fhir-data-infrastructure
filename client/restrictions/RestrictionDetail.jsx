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

let defaultRestriction = {
    resourceType: 'Restriction'
}
  
Session.setDefault('Restriction.Current', defaultRestriction)
  
  
//====================================================================================
// MAIN COMPONENT


function RestrictionDetail(props){

  let classes = useStyles();

  let { 
    children, 
    restriction,
    ...otherProps 
  } = props;

  let activeRestriction = defaultRestriction;

  activeRestriction = useTracker(function(){
    return Session.get('Restriction.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('Restriction.Current', set(activeRestriction, path, event.currentTarget.value))    
  }



  return(
    <div className='RestrictionDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Category</InputAdornment>
              <Input
                id="categoryInput"
                name="categoryInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(restriction, 'category')}
                onChange={ updateField.bind(this, 'category')}
                fullWidth              
              />       
            </FormControl>   
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Scope</InputAdornment>
              <Input
                id="scopeInput"
                name="scopeInput"
                className={classes.input}
                value={get(restriction, 'scope')}
                onChange={ updateField.bind(this, 'scope')}
                fullWidth              
              />       
            </FormControl>      
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>DateTime</InputAdornment>
              <Input
                id="dateTimeInput"
                name="dateTimeInput"
                className={classes.input}
                placeholder="2020.2"              
                value={ moment(get(restriction, 'dateTime')).format("YYYY-MM-DD")}
                onChange={ updateField.bind(this, 'dateTime')}
                fullWidth              
              />          
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Provision Type</InputAdornment>
              <Input
                id="provisionTypeInput"
                name="provisionTypeInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={get(restriction, 'provisionType[0].value')}
                onChange={ updateField.bind(this, 'provisionType[0].value')}
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
                value={get(restriction, 'status')}
                onChange={ updateField.bind(this, 'status')}
                fullWidth              
              />    
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Policy URI</InputAdornment>
              <Input
                id="policyUriInput"
                name="policyUriInput"
                className={classes.input}
                placeholder="http://"              
                value={get(restriction, 'policyUri')}
                onChange={ updateField.bind(this, 'policyUri')}
                fullWidth           
                multiline   
              />
            </FormControl>
                             
          </Grid>

          
        </Grid>
    </div>
  );
}

RestrictionDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  restrictionId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  restriction: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default RestrictionDetail;