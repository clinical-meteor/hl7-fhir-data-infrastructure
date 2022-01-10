import React from 'react';

import { 
  Grid, 
  Container,
  Button,
  Typography,
  DatePicker,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  TextField,
  Card,
  CardContent
} from '@material-ui/core';

import { get, set } from 'lodash';
import moment from 'moment';

import { useTracker } from 'meteor/react-meteor-data';

import { Session } from 'meteor/session';

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


let defaultCommunication = {
  "resourceType" : "Communication",
  "name" : [{
    "text" : "",
    "resourceType" : "HumanName"
  }],
  "active" : true,
  "gender" : "",
  "birthDate" : null,
  "photo" : [{
    url: ""
  }],
  "identifier": [{
    "use": "usual",
    "type": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/v2/0203",
          "code": "MR"
        }
      ]
    },
    "value": ""
  }],
  "test" : false
};

Session.setDefault('communicationUpsert', false);
Session.setDefault('selectedCommunication', false);
Session.setDefault('Communication.Current', defaultCommunication)


//====================================================================================
// MAIN COMPONENT

export function CommunicationDetail(props){
  let classes = useStyles();

  let { 
    children, 
    communication,
    selectedCommunicationId,
    ...otherProps 
  } = props;

  let activeCommunication = defaultCommunication;

  activeCommunication = useTracker(function(){
    return Session.get('Communication.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('Communication.Current', set(activeCommunication, path, event.currentTarget.value))    
  }


  return (
    <div className="communicationDetail">
      {/* <CardContent> */}
          <Grid container spacing={3}>
            <Grid item md={6}>
              <FormControl style={{width: '100%', marginTop: '20px'}}>
                <InputAdornment className={classes.label}>Name</InputAdornment>
                <Input
                  id='categoryInput'
                  name='category'
                  className={classes.input}
                  floatingLabelText='category'
                  placeholder="Lorem ipsum." 
                  value={ get(activeCommunication, 'category[0].text') }
                  onChange={updateField.bind(this, 'category[0].text')}                  
                  fullWidth
                  />
              </FormControl>              
            </Grid>
            <Grid item md={6}>
              <FormControl style={{width: '100%', marginTop: '20px'}}>
                <InputAdornment className={classes.label}>Identifier</InputAdornment>
                <Input
                  id='identifierInput'
                  name='identifier'
                  className={classes.input}
                  floatingLabelText='identifier'
                  value={ get(activeCommunication, 'identifier[0].url') }
                  onChange={updateField.bind(this, 'identifier[0].url')}
                  floatingLabelFixed={false}
                  fullWidth
                  />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                <TextField
                  label="Subject"
                  id='subjectInput'
                  name='subject'
                  floatingLabelText='subject'
                  value={ get(activeCommunication, 'subject.display', '') }
                  onChange={updateField.bind(this, 'subject.display')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  /><br/>
                <TextField
                  label="Sent"
                  id='sentInput'
                  name='sent'
                  floatingLabelText='sent'
                  value={ moment(get(activeCommunication, 'sent')).format('YYYY-MM-DD hh:mm:ss') }
                  onChange={updateField.bind(this, 'sent')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  /><br/>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                <TextField
                  label="Definition"
                  id='definitionInput'
                  name='definition'
                  floatingLabelText='definition'
                  value={ get(activeCommunication, 'definition[0].text') }
                  onChange={updateField.bind(this, 'definition[0].text')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  /><br/>
                <TextField
                  label="Payload"
                  id='payloadInput'
                  name='payload'
                  floatingLabelText='payload'
                  value={ get(activeCommunication, 'payload[0].contentString') }
                  onChange={updateField.bind(this, 'payload[0].contentString')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  /><br/>
              </Card>
            
            </Grid>
            <Grid item xs={12} md={4}>
              <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                <TextField
                  label="Recipient"
                  id='recipientInput'
                  name='recipient'
                  floatingLabelText='recipient'
                  value={ get(activeCommunication, 'recipient') }
                  onChange={updateField.bind(this, 'recipient')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  /><br/>
                <TextField
                  label="Received"
                  id='receivedInput'
                  name='received'
                  floatingLabelText='received'
                  value={ moment(get(activeCommunication, 'received')).format('YYYY-MM-DD hh:mm:ss') }
                  onChange={updateField.bind(this, 'received')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  /><br/>
              </Card>
            </Grid>
          </Grid>

      {/* </CardContent> */}
    </div>
  );
}


export default CommunicationDetail;