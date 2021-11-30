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
import ReactMixin from 'react-mixin';
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

let defaultTask = {
  resourceType: 'Task'
}

Session.setDefault('Task.Current', defaultTask)




function TaskDetail(props){

  let classes = useStyles();


  let { 
    children, 
    task,
    ...otherProps 
  } = props;

  let activeTask = defaultTask;

  activeTask = useTracker(function(){
    return Session.get('Task.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('Task.Current', set(activeTask, path, event.currentTarget.value))    
  }





  return(
    <div className='TaskDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Title</InputAdornment>
              <Input
                id="titleInput"
                name="titleInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(task, 'title')}
                onChange={updateField.bind(this, 'title')}
                fullWidth              
              />       
            </FormControl>   
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Requestor</InputAdornment>
              <Input
                id="requestorInput"
                name="requestorInput"
                className={classes.input}
                value={FhirUtilities.pluckReference(get(task, 'requestor'))}
                onChange={updateField.bind(this, 'requestor.display')}
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
                value={get(task, 'version')}
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
                value={get(task, 'identifier[0].value')}
                onChange={updateField.bind(this, 'dentifier[0].value')}
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
                value={get(task, 'status')}
                onChange={updateField.bind(this, 'status')}
                fullWidth              
              />    
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Business Status</InputAdornment>
              <Input
                id="businessStatusInput"
                name="businessStatusInput"
                className={classes.input}
                placeholder="active"              
                value={get(task, 'businessStatus')}
                onChange={updateField.bind(this, 'businessStatus')}
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
                value={get(task, 'description')}
                onChange={updateField.bind(this, 'description')}
                fullWidth           
                multiline   
              />
            </FormControl>
                             
          </Grid>

          
        </Grid>
    </div>
  );
}

TaskDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  taskId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  task: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default TaskDetail;