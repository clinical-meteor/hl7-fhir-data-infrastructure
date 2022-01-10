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


import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import { get, set } from 'lodash';
// import { setFlagsFromString } from 'v8';

import { FhirUtilities } from '../../lib/FhirUtilities';
import { lookupReferenceName } from '../../lib/FhirDehydrator';

import {user} from 'react-icons-kit/fa/user';
import {users} from 'react-icons-kit/fa/user';
import { Icon } from 'react-icons-kit';


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

let defaultCareTeam = {
  resourceType: 'CareTeam'
}

Session.setDefault('CareTeam.Current', defaultCareTeam)


//====================================================================================
// MAIN COMPONENT

export function CareTeamDetail(props){

  let classes = useStyles();

  let { 
    children, 
    careTeam,
    ...otherProps 
  } = props;

  let activeCareTeam = defaultCareTeam;

  activeCareTeam = useTracker(function(){
    return Session.get('CareTeam.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('CareTeam.Current', set(activeCareTeam, path, event.currentTarget.value))    
  }



  return(
    <div className='CareTeamDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              id="nameInput"
              name="nameInput"
              className={classes.input}
              placeholder="Lorem ipsum."              
              value={get(activeCareTeam, 'name')}
              onChange={updateField.bind(this, 'name')}
              label="Team Name"
              fullWidth    
            />  
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Version"
              id="versionInput"
              name="versionInput"
              className={classes.input}
              placeholder="2020.2"              
              value={get(activeCareTeam, 'version')}
              onChange={updateField.bind(this, 'version')}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth              
            />    

            {/* <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Version</InputAdornment>
              <Input
                id="versionInput"
                name="versionInput"
                className={classes.input}
                placeholder="2020.2"              
                value={get(activeCareTeam, 'version')}
                onChange={updateField.bind(this, 'version')}
                fullWidth              
              />          
            </FormControl> */}
            {/* <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={get(activeCareTeam, 'identifier[0].value')}
                onChange={updateField.bind(this, 'identifier[0].value')}
                fullWidth              
              />
            </FormControl>      */}
          </Grid>
          <Grid item xs={3}>
              <TextField
                label="Status"
                id="statusInput"
                name="statusInput"
                className={classes.input}
                placeholder="active"              
                value={get(activeCareTeam, 'status')}
                onChange={updateField.bind(this, 'status')}
                fullWidth              
              />    
            {/* <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Status</InputAdornment>
              <Input
                id="statusInput"
                name="statusInput"
                className={classes.input}
                placeholder="active"              
                value={get(activeCareTeam, 'status')}
                onChange={updateField.bind(this, 'status')}
                fullWidth              
              />    
            </FormControl> */}
          </Grid>
          <Grid item xs={6}>            
              <TextField
                label="Patient"
                id="patientInput"
                name="patientInput"
                className={classes.input}
                value={get(activeCareTeam, 'patient.display')}
                onChange={updateField.bind(this, 'patient.display')}
                InputLabelProps={{
                  shrink: true
                }}
                // InputProps={{
                //   endAdornment: <Icon icon={user} />
                // }}          
                fullWidth              
              />      
            {/* <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Patient</InputAdornment>
              <Input
                id="patientInput"
                name="patientInput"
                className={classes.input}
                value={get(activeCareTeam, 'patient.display')}
                onChange={updateField.bind(this, 'patient.display')}
                fullWidth              
              />       
            </FormControl>       */}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Managing Organization"
              id="managingOrgInput"
              name="managingOrgInput"
              className={classes.input}
              value={get(activeCareTeam, 'managingOrganization.display')}
              onChange={updateField.bind(this, 'managingOrganization.display')}
              InputLabelProps={{
                shrink: true
              }}
              // InputProps={{
              //   endAdornment: <Icon icon={users} />
              // }}          
              fullWidth              
            />    
            {/* <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Managing Organization</InputAdornment>
              <Input
                id="managingOrgInput"
                name="managingOrgInput"
                className={classes.input}
                value={get(activeCareTeam, 'managingOrganization.display')}
                onChange={updateField.bind(this, 'managingOrganization.display')}
                fullWidth              
              />        
              
              </FormControl>   
            */}   
          </Grid>

          <Grid item xs={12}>
            {/* <TextField
              label="Address"
              id="addressInput"
              name="addressInput"
              className={classes.input}
              placeholder="http://localhost:3000/baseR4/metadata"              
              value={get(activeCareTeam, 'address')}
              onChange={updateField.bind(this, 'address')}
              fullWidth              
            />    */}
            {/* <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Address</InputAdornment>
              <Input
                id="addressInput"
                name="addressInput"
                className={classes.input}
                placeholder="http://localhost:3000/baseR4/metadata"              
                value={get(activeCareTeam, 'address')}
                onChange={updateField.bind(this, 'address')}
                fullWidth              
              />       
            </FormControl>   */}
                             
          </Grid>

          
        </Grid>
    </div>
  );
}

CareTeamDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  careTeamId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  careTeam: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default CareTeamDetail;