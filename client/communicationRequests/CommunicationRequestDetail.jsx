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

let defaultCommunicationRequest = {
  "resourceType" : "CommunicationRequest",
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


Session.setDefault('communicationRequestUpsert', false);
Session.setDefault('selectedCommunicationRequest', false);
Session.setDefault('CommunicationRequest.Current', defaultCommunicationRequest)

//====================================================================================
// MAIN COMPONENT

export function CommunicationRequestDetail(props) {
  
  let classes = useStyles();

  let { 
    children, 
    communicationRequest,
    ...otherProps 
  } = props;

  let activeCommunicationRequest = defaultCommunicationRequest;

  activeCommunicationRequest = useTracker(function(){
    return Session.get('CommunicationRequest.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('CommunicationRequest.Current', set(activeCommunicationRequest, path, event.currentTarget.value))    
  }

  return (
    <div className="communicationRequestDetail">
      <CardContent>
          <Grid container>
            <Grid item md={2}>
              <TextField
                label="Category"
                id='categoryInput'
                name='category'
                floatingLabelText='category'
                value={ get(activeCommunicationRequest, 'category[0].text') }
                onChange={updateField.bind(this, 'category[0].text')}
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={6}>
              <TextField
                label="Identifier"
                id='identifierInput'
                name='identifier'
                floatingLabelText='identifier'
                value={ get(activeCommunicationRequest, 'identifier[0].url') }
                onChange={updateField.bind(this, 'identifier[0].url')}
                floatingLabelFixed={false}
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                /><br/>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={4}>
              
                <TextField
                  label="Subject"
                  id='subjectInput'
                  name='subject'
                  floatingLabelText='subject'
                  value={ get(activeCommunicationRequest, 'subject.display', '') }
                  onChange={updateField.bind(this, 'subject.display')}
                  InputLabelProps={{
                    shrink: true
                  }}  
                  fullWidth
                  /><br/>
                <TextField
                  label="Sent"
                  id='sentInput'
                  name='sent'
                  floatingLabelText='sent'
                  value={ moment(get(activeCommunicationRequest, 'sent')).format('YYYY-MM-DD hh:mm:ss') }
                  onChange={updateField.bind(this, 'sent')}
                  InputLabelProps={{
                    shrink: true
                  }}  
                  fullWidth
                  /><br/>
              
            </Grid>
            <Grid item md={4}>
              
                <TextField
                  label="Definition"
                  id='definitionInput'
                  name='definition'
                  floatingLabelText='definition'
                  value={ get(activeCommunicationRequest, 'definition[0].text') }
                  onChange={updateField.bind(this, 'definition[0].text')}
                  InputLabelProps={{
                    shrink: true
                  }}  
                  fullWidth
                  /><br/>
                <TextField
                  label="Payload"
                  id='payloadInput'
                  name='payload'
                  floatingLabelText='payload'
                  value={ get(activeCommunicationRequest, 'payload[0].contentString') }
                  onChange={updateField.bind(this, 'payload[0].contentString')}
                  InputLabelProps={{
                    shrink: true
                  }}  
                  fullWidth
                  /><br/>
              
            
            </Grid>
            <Grid item md={4}>
              
                <TextField
                  label="Recipient"
                  id='recipientInput'
                  name='recipient'
                  floatingLabelText='recipient'
                  value={ get(activeCommunicationRequest, 'recipient.display', '') }
                  onChange={updateField.bind(this, 'recipient.display')}
                  InputLabelProps={{
                    shrink: true
                  }}  
                  fullWidth
                  /><br/>
                <TextField
                  label="Received"
                  id='receivedInput'
                  name='received'
                  floatingLabelText='received'
                  value={ moment(get(activeCommunicationRequest, 'received')).format('YYYY-MM-DD hh:mm:ss') }
                  onChange={updateField.bind(this, 'received')}
                  InputLabelProps={{
                    shrink: true
                  }}  
                  fullWidth
                  /><br/>
              
            </Grid>
          </Grid>

      </CardContent>
    </div>
  );
  
}



export default CommunicationRequestDetail;