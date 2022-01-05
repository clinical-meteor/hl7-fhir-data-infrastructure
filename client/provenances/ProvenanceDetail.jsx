import React from 'react';

import {
  Grid,
  Button,
  Container,
  Typography,
  DatePicker,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

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

let defaultProvenance = {
  resourceType: 'Provenance'
}

Session.setDefault('Provenance.Current', defaultProvenance)


//====================================================================================
// MAIN COMPONENT

export function ProvenanceDetail(props){

  let classes = useStyles();

  let { 
    children, 
    provenance,
    ...otherProps 
  } = props;

  let activeProvenance = defaultProvenance;

  activeProvenance = useTracker(function(){
    return Session.get('Provenance.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('Provenance.Current', set(activeProvenance, path, event.currentTarget.value))    
  }



  return(
    <div className='ProvenanceDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              label="Target"
              id="targetInput"
              name="targetInput"
              className={classes.input}
              placeholder="Lorem ipsum."              
              value={FhirUtilities.pluckReference(get(activeProvenance, 'target[0]'))}
              onChange={updateField.bind(this, 'name')}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth              
            />       
        </Grid>
          <Grid item xs={3}>
            <TextField
              label="Occurrance"
              id="occurredPeriodStartInput"
              name="occurredPeriodStartInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"              
              value={get(activeProvenance, 'occurredPeriod.start')}
              onChange={updateField.bind(this, 'occurredPeriod.start')}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth              
            />          
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Occurrance End"
              id="occurredPeriodEndInput"
              name="occurredPeriodEndInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"                     
              value={get(activeProvenance, 'occurredPeriod.end')}
              onChange={updateField.bind(this, 'occurredPeriod.end')}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth              
            />
          </Grid>
          

          <Grid item xs={12}>
            <TextField
              label="Policy"
              id="policyInput"
              name="policyInput"
              className={classes.input}
              placeholder="http://localhost:3000/baseR4/metadata"              
              value={get(activeProvenance, 'policy[0]')}
              onChange={updateField.bind(this, 'policy[0]')}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth              
            />       
          </Grid> 
          <Grid item xs={12}>
            <TextField
              label="Signature"
              id="signatureInput"
              name="signatureInput"
              className={classes.input}
              placeholder="asdlfjhlashljnvlknldfkjlfkfjlkjdslkfjlkdj"              
              value={get(activeProvenance, 'signature[0]')}
              onChange={updateField.bind(this, 'signature[0]')}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth              
            />       
          </Grid>          
        </Grid>
    </div>
  );
}

ProvenanceDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  provenanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  provenance: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default ProvenanceDetail;