import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Container,
  MenuItem,
  Button
} from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

import { get, set, has, cloneDeep } from 'lodash';

//--------------------------------------------------------------------------------
// Default RiskAssessment

let defaultRiskAssessment = {
  "resourceType": "RiskAssessment",
  "identifier": [
    {
      "use": "official",
      "system": "http://example.org",
      "value": "risk-assessment-cardiac"
    }
  ],
  "status": "final",
  "subject": {
    "reference": "Patient/pat2"
  },
  "encounter": {
    "reference": "Encounter/example"
  },
  "occurrenceDateTime": "2014-07-19T16:04:00Z",
  "performer": {
    "display": "http://cvdrisk.nhlbi.nih.gov/#cholesterol"
  },
  "basis": [
    {
      "reference": "Patient/pat2"
    },
    {
      "reference": "DiagnosticReport/lipids"
    },
    {
      "reference": "Observation/blood-pressure"
    }
  ],
  "prediction": [
    {
      "outcome": {
        "text": "Heart Attack"
      },
      "probabilityDecimal": 0.02,
      "whenRange": {
        "low": {
          "value": 39,
          "unit": "years",
          "system": "http://unitsofmeasure.org",
          "code": "a"
        },
        "high": {
          "value": 49,
          "unit": "years",
          "system": "http://unitsofmeasure.org",
          "code": "a"
        }
      }
    }
  ]
}

//--------------------------------------------------------------------------------
// Main Component

let statuss = [{
  value: 'draft',
  label: "Draft"
}, {
  value: 'proposed',
  label: "Proposed"
}, {
  value: 'active',
  label: "Active"
}, {
  value: 'rejected',
  label: "Rejected"
}, {
  value: 'inactive',
  label: "Inactive"
}, {
  value: 'entered-in-error',
  label: "Entered-In-Error"
}];

let martialStatuses = [{
  value: 'UNK',
  label: "Unknown"
}, {
  value: 'A',
  label: "Annulled"
}, {
  value: 'D',
  label: "Divorced"
}, {
  value: 'I',
  label: "Interlocutory"
}, {
  value: 'L',
  label: "Legally Separated"
}, {
  value: 'M',
  label: "Married"
}, {
  value: 'P',
  label: "Polygamous"
}, {
  value: 'S',
  label: "Never Married"
}, {
  value: 'T',
  label: "Domestic Partner"
}, {
  value: 'U',
  label: "Unmarried"
}, {
  value: 'W',
  label: "Widowed"
}]

//--------------------------------------------------------------------------------
// Main Component


function RiskAssessmentForm(props){

  let {
    showHeader,
    showPrefixSuffix,
    riskAssessment,
    children,
    showSpecies,
    defaultSpecies,
    onChangeRiskAssessment,
    defaultLanguage,
    textMessage,
    patientId,
    onSave,
    ...otherProps
  } = props;

  let classes = useStyles();
  let [localRiskAssessment, setLocalRiskAssessment] = useState(riskAssessment);




  function changeState(field, event, select){
    console.log('changeState', field, get(event, 'currentTarget.value'), select)

    let newRiskAssessment = Object.assign({}, riskAssessment);

    switch (field) {
      case 'identifier':  
        if(!Array.isArray(newRiskAssessment.identifier)){
          newRiskAssessment.identifier = [];
        }
        if(has(newRiskAssessment, 'identifier[0]')){
          let ident = get(newRiskAssessment, 'identifier[0]');
          ident.value = get(event, 'currentTarget.value')
          newRiskAssessment.identifier[0] = ident;
        }
        break;
      case 'status':
        newRiskAssessment.status = select.key;
        break;
      case 'dateTime':
        newRiskAssessment.dateTime = get(event, 'currentTarget.value');
        break;        
      case 'given':
        if(!Array.isArray(newRiskAssessment.name)){
          newRiskAssessment.name = [];
        }
        newRiskAssessment.name[0].given = [get(event, 'currentTarget.value')];
        newRiskAssessment.name[0].text = get(event, 'currentTarget.value') + " " + newRiskAssessment.name[0].family;
        break;        
      case 'legalName':
        newRiskAssessment.patient.display = get(event, 'currentTarget.value');
        break;        
      default:
        break;
    }

    console.log('newRiskAssessment', newRiskAssessment)
    if(typeof onChangeRiskAssessment === "function"){
      onChangeRiskAssessment(newRiskAssessment)
    }
    setLocalRiskAssessment(newRiskAssessment)
  }
  function openDocumentationLink(){
    logger.verbose('client.app.patient.RiskAssessmentForm.openDocumentationLink');

    window.open(get(Meteor, 'settings.public.defaults.riskAssessments.readMoreUrl', 'https://www.symptomatic.io'), '_system')
    logger.info('Open documentation website');
  }
  function handleSaveRiskAssessment(){
    console.log('RiskAssessmentForm.handleSaveRiskAssessment()', localRiskAssessment, patientId)

    let newRiskAssessment = cloneDeep(localRiskAssessment);
    console.log('RiskAssessmentForm.newRiskAssessment', newRiskAssessment)
    if(get(newRiskAssessment, 'patient.reference') === ""){
      console.log('RiskAssessmentForm.newRiskAssessment.patient.reference', get(newRiskAssessment, 'patient.reference'))
      set(newRiskAssessment, 'patient.reference', 'Patient/' + patientId)
    }
    console.log('RiskAssessmentForm.newRiskAssessment', newRiskAssessment)

    if(typeof onSave === "function"){
      onSave(newRiskAssessment)
    }
  }
  


  let email = '';
  let phonenumber = '';

  if(localRiskAssessment){
    if(Array.isArray(localRiskAssessment.telecom)){
      localRiskAssessment.telecom.forEach(function(contactPoint){
        if(get(contactPoint, 'system') === "email"){
          email = get(contactPoint, 'value');
        }
        if(get(contactPoint, 'system') === "phone"){
          phonenumber = get(contactPoint, 'value');
        }
      })
    }  
  }

  return(
    <CardContent>
      <Grid container spacing={3}>

        <Grid item xs={12} sm={8}>
          <TextField
            id='categoryInput'                
            name='category'
            label='Category'
            margin='normal'
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={ get(localRiskAssessment, 'category[0].coding[0].display', '')}
            onChange={ changeState.bind(this, 'category')}
            /><br/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            id='statusInput'                
            name='status'
            label='Status'
            placeholder='draft | proposed | active | rejected | inactive | entered-in-error'
            margin='normal'
            InputLabelProps={{ shrink: true }}
            fullWidth
            select
            value={ get(localRiskAssessment, 'status', '')}
            onChange={ changeState.bind(this, 'status')}
            >
            {statuss.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField><br/>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
        <div dangerouslySetInnerHTML={{__html: textMessage}} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            id='policyUrlInput'                
            name='policyUrl'
            label='Policy URL'
            placeholder='http://'
            margin='normal'
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={ get(localRiskAssessment, 'policy[0].uri', '')}
            onChange={ changeState.bind(this, 'policyUrl')}
            /><br/>
        </Grid>
      </Grid>
      <Grid container spacing={3}>  
        <Grid item xs={12} xs={8}>
          <TextField
            id='legalNameInput'                
            name='legalName'
            label='Legal Name'
            placeholder='Jane Doe'
            margin='normal'
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={ get(localRiskAssessment, 'patient.display', '')}
            helperText={ get(localRiskAssessment, 'patient.reference', '')}
            onChange={ changeState.bind(this, 'legalName')}
            /><br/>
        </Grid>
        <Grid item xs={12} md={4} xs={4}>
          <TextField
            id='dateInput'                
            name='date'
            type='date'
            label='Date'
            margin='normal'
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={ get(localRiskAssessment, 'dateTime', '')}
            onChange={ changeState.bind(this, 'dateTime')}
            /><br/>
        </Grid>
      </Grid>
      <Grid style={{marginTop: '40px'}}>
        <Button variant="contained" color="primary" type="submit" style={{marginRight: '10px'}} onClick={function(){handleSaveRiskAssessment()}} >
          Accept and Save
        </Button>
        <Button variant="contained" style={{marginLeft: '10px'}}>
          Cancel
        </Button>
        <Button style={{float: 'right'}} onClick={function(){ openDocumentationLink()}}>
          Read More
        </Button>
      </Grid>
    </CardContent>
  );
}

  

RiskAssessmentForm.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  riskAssessmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  riskAssessment: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  patientId: PropTypes.string,

  showHeader: PropTypes.bool,
  showPrefixSuffix: PropTypes.bool,
  showSpecies: PropTypes.bool,
  defaultSpecies: PropTypes.string,
  
  onChangeRiskAssessment: PropTypes.func,
  onDelete: PropTypes.func,
  onUpsert: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  buttons: PropTypes.object,
  textMessage: PropTypes.string
};
RiskAssessmentForm.defaultProps = {
  showPrefixSuffix: false,
  showHeader: false,
  showSpecies: false,
  defaultSpecies: "Human",
  defaultLanguage: "English",
  riskAssessment: defaultRiskAssessment,
  patientId: ''
}

export default RiskAssessmentForm;