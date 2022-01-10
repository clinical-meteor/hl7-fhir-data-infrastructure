import { 
  Grid,
  Button, 
  CardActions, 
  CardContent, 
  CardHeader,
  TextField,
  Paper
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'fhir-starter';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import PractitionersTable  from './PractitionersTable';
import { get, set } from 'lodash';
import moment from 'moment';

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

let defaultPractitioner = {
  resourceType: 'Practitioner'
}

Session.setDefault('Practitioner.Current', defaultPractitioner)
Session.setDefault('practitionerBlockchainData', []);


//====================================================================================
// MAIN COMPONENT

export function PractitionerDetail(props){

  let classes = useStyles();

  let { 
    children, 
    practitioner,
    ...otherProps 
  } = props;

  let activePractitioner = defaultPractitioner;

  activePractitioner = useTracker(function(){
    return Session.get('Practitioner.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('Practitioner.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }


  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     practitionerId: false,
  //     practitioner: {
  //       resourceType : "Practitioner",
  //         name : {
  //           resourceType : "HumanName",
  //           text : ""
  //         },
  //         telecom : [{
  //           resourceType : "ContactPoint",
  //           system : "phone",
  //           value : "",
  //           use : "",
  //           rank : 1
  //         }, {
  //           resourceType : "ContactPoint",
  //           system : "email",
  //           value : "",
  //           use : "",
  //           rank : 1
  //         }],
  //         qualification : [{
  //           identifier : [{
  //             use : "certficate",
  //             value : "",
  //             period : {
  //               start: null,
  //               end: null
  //             }
  //           }],
  //           issuer : {
  //             display : "",
  //             reference : ""
  //           }
  //       }],
  //       address: [{
  //         text: '',
  //         city: '',
  //         state: '',
  //         postalCode: ''
  //       }]
  //     },
  //     form: {
  //       name: '',
  //       phone: '',
  //       email: '',
  //       qualificationIssuer: '',
  //       qualificationIdentifier: '',
  //       qualificationCode: '',
  //       qualificationStart: null,
  //       qualificationEnd: null,
  //       text: '',
  //       city: '',
  //       state: '',
  //       postalCode: ''
  //     }
  //   }
  // }
  // dehydrateFhirResource(practitioner) {
  //   let formData = Object.assign({}, this.state.form);

  //   formData.name = get(practitioner, 'name.text')

  //   let telecomArray = get(practitioner, 'telecom');
  //   telecomArray.forEach(function(telecomRecord){
  //     if(get(telecomRecord, 'system') === 'phone'){
  //       formData.phone = get(telecomRecord, 'value');
  //     }
  //     if(get(telecomRecord, 'system') === 'email'){
  //       formData.email = get(telecomRecord, 'value');
  //     }
  //   })

  //   formData.qualificationIssuer = get(practitioner, 'qualification[0].issuer.display')
  //   formData.qualificationIdentifier = get(practitioner, 'qualification[0].identifier')
  //   formData.qualificationStart = moment(get(practitioner, 'qualification[0].period.start')).format('YYYY-MM-DD')
  //   formData.qualificationEnd = moment(get(practitioner, 'qualification[0].period.end')).format('YYYY-MM-DD')
  //   formData.qualificationCode = get(practitioner, 'qualification[0].code.coding[0].code')

  //   formData.text = get(practitioner, 'address[0].text')
  //   formData.city = get(practitioner, 'address[0].city')
  //   formData.state = get(practitioner, 'address[0].state')
  //   formData.postalCode = get(practitioner, 'address[0].postalCode')

  //   return formData;
  // }

  // shouldComponentUpdate(nextProps){
  //   process.env.NODE_ENV === "test" && console.log('PractitionerDetail.shouldComponentUpdate()', nextProps, this.state)
  //   let shouldUpdate = true;

  //   // both false; don't take any more updates
  //   if(nextProps.practitioner === this.state.practitioner){
  //     shouldUpdate = false;
  //   }

  //   // received an practitioner from the table; okay lets update again
  //   if(nextProps.practitionerId !== this.state.practitionerId){
  //     this.setState({practitionerId: nextProps.practitionerId})
      
  //     if(nextProps.practitioner){
  //       this.setState({practitioner: nextProps.practitioner})     
  //       this.setState({form: this.dehydrateFhirResource(nextProps.practitioner)})       
  //     }
  //     shouldUpdate = true;
  //   }
 
  //   return shouldUpdate;
  // }


  // getMeteorData() {
  //   let data = {
  //     practitionerId: this.props.practitionerId,
  //     practitioner: false,
  //     form: this.state.form
  //   };

  //   if(this.props.practitioner){
  //     data.practitioner = this.props.practitioner;
  //   }

  //   if(process.env.NODE_ENV === "test") console.log("PractitionerDetail[data]", data);
  //   return data;
  // }

  let practitionerArray = [];

  if(get(activePractitioner, 'qualification')){
    if(Array.isArray(activePractitioner.qualification)){
      activePractitioner.qualification.forEach(function(record, index){
        practitionerArray.push(
          <Grid container spacing={3}>
              <Grid item md={4}>
                <TextField
                  id='qualificationIssuerInput'
                  // ref='qualificationIssuer'
                  name='qualificationIssuer'
                  type='text'
                  label='Qualification Issuer'
                  //floatingLabelFixed={true}
                  value={ FhirUtilities.pluckReference(get(activePractitioner, 'qualification[' + index + '].issuer')) }
                  onChange={ updateField.bind(this, 'qualification[' + index + '].issuer')}
                  hintText='American College of Emergency Physicians'
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={4}>
                <TextField
                  id='qualificationCodeInput'
                  // ref='qualificationCode'
                  name='qualificationCode'
                  type='text'
                  label='Code'
                  //floatingLabelFixed={true}
                  value={ FhirUtilities.pluckCodeableConcept(get(activePractitioner, 'qualification[' + index + '].code')) }
                  onChange={ updateField.bind(this, 'qualification[' + index + '].code') }
                  hintText='ACEP-10792866'
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={2}>
                <TextField
                  id='qualificationStartInput'
                  // ref='qualificationStart'
                  name='qualificationStart'
                  type='date'
                  label='Start'
                  floatingLabelFixed={true}
                  value={ get(activePractitioner, 'qualification[' + index + '].period.start', null) }
                  onChange={ updateField.bind(this, 'qualification[' + index + '].period.start')}
                  disabled={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={2}>
                <TextField
                  id='qualificationEndInput'
                  // ref='qualificationEnd'
                  name='qualificationEnd'
                  type='date'
                  label='End'
                  disabled={true}
                  floatingLabelFixed={true}
                  value={ get(activePractitioner, 'qualification[' + index + '].period.end', null) }
                  onChange={ updateField.bind(this, 'qualification[' + index + '].period.end')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  /><br/>
              </Grid>
          </Grid>
        )
      })
    }
    
  }

  return (
    <div className="practitionerDetail">
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={6}>  
            <TextField
              id='practitionerNameInput'
              // ref='name'
              name='name'
              type='text'
              label='name'
              //floatingLabelFixed={true}
              hintText='Alison Camron'
              value={ FhirUtilities.assembleName(get(activePractitioner, 'name[0]')) }
              onChange={ updateField.bind(this, 'name')}
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={3}>
            <TextField
              id='emailInput'
              // ref='email'
              name='email'
              type='email'
              label='Email'
              //floatingLabelFixed={true}
              hintText='drcamron@symptomatic.io'
              value={ FhirUtilities.pluckEmail(get(activePractitioner, 'email')) }
              onChange={ updateField.bind(this, 'email')}
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={3}>
            <TextField
              id='phoneInput'
              // ref='phone'
              name='phone'
              type='phone'
              label='Phone'
              //floatingLabelFixed={true}
              hintText='773-555-1010'
              value={ FhirUtilities.pluckPhone(get(activePractitioner, 'phone')) }
              onChange={ updateField.bind(this, 'phone')}
              fullWidth
              /><br/>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={6}>
            <TextField
              id='textInput'
              // ref='text'
              name='text'
              label='Address'
              value={ FhirUtilities.stringifyAddress(get(activePractitioner, 'address[0].line')) }
              onChange={ updateField.bind(this, 'address[0].line')}
              //floatingLabelFixed={true}
              hintText='South Side'
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={2}>
            <TextField
              id='cityInput'
              // ref='city'
              name='city'
              label='City'
              value={ get(activePractitioner, 'city') }
              onChange={ updateField.bind(this, 'city')}
              hintText='Chicago'
              //floatingLabelFixed={true}
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={2}>
            <TextField
              id='stateInput'
              // ref='state'
              name='state'
              label='State'
              value={ get(activePractitioner, 'address[0].state') }
              onChange={ updateField.bind(this, 'address[0].state')}
              //floatingLabelFixed={true}
              hintText='Illinois'
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={2}>
            <TextField
              id='postalCodeInput'
              // ref='postalCode'
              name='postalCode'
              label='Postal Code'
              value={ get(activePractitioner, 'address[0].postalCode') }
              onChange={ updateField.bind(this, 'address[0].postalCode')}
              //floatingLabelFixed={true}
              hintText='60637'
              fullWidth
              /><br/>
          </Grid>
        </Grid>

        <div id="qualificationArray" style={{ paddingLeft: '10px', borderLeft: '4px double lightgray', marginTop: '20px'}}>
          { practitionerArray }
        </div>  
        
        {/* { this.displayQualifications(this.data.practitionerId) }      */}
      </CardContent>
      {/* <CardActions>
        { this.determineButtons(this.data.practitionerId) }
      </CardActions> */}
    </div>
  );
}

PractitionerDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  practitionerId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  practitioner: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

export default PractitionerDetail;