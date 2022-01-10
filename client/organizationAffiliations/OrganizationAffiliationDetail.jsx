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

let defaultOrgAffiliation = {
  resourceType: 'OrganizationAffiliation'
}

Session.setDefault('OrganizationAffiliation.Current', defaultOrgAffiliation)


//====================================================================================
// MAIN COMPONENT



export function OrganizationAffiliationDetail(props){

  let classes = useStyles();


  let { 
    children, 
    organizationAffiliation,
    ...otherProps 
  } = props;


  let activeOrganizationAffiliation = defaultOrgAffiliation;

  activeOrganizationAffiliation = useTracker(function(){
    return Session.get('OrganizationAffiliation.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('OrganizationAffiliation.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }


  return(
    <div className='OrganizationAffiliationDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Name</InputAdornment>
              <Input
                id="nameInput"
                name="nameInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(activeOrganizationAffiliation, 'name')}
                onChange={updateField.bind(this, 'name')}
                fullWidth              
              />       
            </FormControl>               
          </Grid>       
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Code</InputAdornment>
              <Input
                id="codeInput"
                name="codeInput"
                className={classes.input}
                value={FhirUtilities.pluckCodeableConcept(get(activeOrganizationAffiliation, 'code[0]'))}
                onChange={updateField.bind(this, 'code')}
                fullWidth              
              />       
            </FormControl>      
          </Grid>          
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Healthcare Service(s)</InputAdornment>
              <Input
                id="healthcareServiceInput"
                name="healthcareServiceInput"
                className={classes.input}
                placeholder="Healthcare Service"              
                value={lookupReferenceName(FhirUtilities.pluckReference(get(activeOrganizationAffiliation, 'healthcareService[0]')))}
                onChange={updateField.bind(this, 'name')}
                fullWidth              
              />       
            </FormControl>               
          </Grid>       
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Network</InputAdornment>
              <Input
                id="networkInput"
                name="networkInput"
                className={classes.input}
                value={lookupReferenceName(FhirUtilities.pluckReference(get(activeOrganizationAffiliation, 'network[0]')))}
                onChange={updateField.bind(this, 'network')}
                fullWidth              
              />       
            </FormControl>      
          </Grid>   


          {/* <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Description</InputAdornment>
              <Input
                id="fullAddressInput"
                name="fullAddressInput"
                className={classes.input}
                placeholder="http://localhost:3000/baseR4/metadata"              
                value={get(activeOrganizationAffiliation, 'fullAddress')}
                onChange={updateField.bind(this, 'fullAddress')}
                fullWidth           
                multiline   
              />
            </FormControl>            
          </Grid>           */}
        </Grid>
    </div>
  );
}

OrganizationAffiliationDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  organizationAffiliationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  organizationAffiliation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
export default OrganizationAffiliationDetail;