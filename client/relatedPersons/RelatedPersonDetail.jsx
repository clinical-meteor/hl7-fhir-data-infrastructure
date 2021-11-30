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
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import RelatedPersonsTable  from './RelatedPersonsTable';
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

let defaultRelatedPerson = {
  resourceType: 'RelatedPerson'
}

Session.setDefault('RelatedPerson.Current', defaultRelatedPerson)
Session.setDefault('relatedPersonBlockchainData', []);


//====================================================================================
// MAIN COMPONENT

export function RelatedPersonDetail(props){

  let classes = useStyles();

  let { 
    children, 
    relatedPerson,
    ...otherProps 
  } = props;

  let activeRelatedPerson = defaultRelatedPerson;

  activeRelatedPerson = useTracker(function(){
    return Session.get('RelatedPerson.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('RelatedPerson.Current', set(activeRelatedPerson, path, event.currentTarget.value))    
  }


  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     relatedPersonId: false,
  //     relatedPerson: {
  //       resourceType : "RelatedPerson",
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
  // dehydrateFhirResource(relatedPerson) {
  //   let formData = Object.assign({}, this.state.form);

  //   formData.name = get(relatedPerson, 'name.text')

  //   let telecomArray = get(relatedPerson, 'telecom');
  //   telecomArray.forEach(function(telecomRecord){
  //     if(get(telecomRecord, 'system') === 'phone'){
  //       formData.phone = get(telecomRecord, 'value');
  //     }
  //     if(get(telecomRecord, 'system') === 'email'){
  //       formData.email = get(telecomRecord, 'value');
  //     }
  //   })

  //   formData.qualificationIssuer = get(relatedPerson, 'qualification[0].issuer.display')
  //   formData.qualificationIdentifier = get(relatedPerson, 'qualification[0].identifier')
  //   formData.qualificationStart = moment(get(relatedPerson, 'qualification[0].period.start')).format('YYYY-MM-DD')
  //   formData.qualificationEnd = moment(get(relatedPerson, 'qualification[0].period.end')).format('YYYY-MM-DD')
  //   formData.qualificationCode = get(relatedPerson, 'qualification[0].code.coding[0].code')

  //   formData.text = get(relatedPerson, 'address[0].text')
  //   formData.city = get(relatedPerson, 'address[0].city')
  //   formData.state = get(relatedPerson, 'address[0].state')
  //   formData.postalCode = get(relatedPerson, 'address[0].postalCode')

  //   return formData;
  // }

  // shouldComponentUpdate(nextProps){
  //   process.env.NODE_ENV === "test" && console.log('RelatedPersonDetail.shouldComponentUpdate()', nextProps, this.state)
  //   let shouldUpdate = true;

  //   // both false; don't take any more updates
  //   if(nextProps.relatedPerson === this.state.relatedPerson){
  //     shouldUpdate = false;
  //   }

  //   // received an relatedPerson from the table; okay lets update again
  //   if(nextProps.relatedPersonId !== this.state.relatedPersonId){
  //     this.setState({relatedPersonId: nextProps.relatedPersonId})
      
  //     if(nextProps.relatedPerson){
  //       this.setState({relatedPerson: nextProps.relatedPerson})     
  //       this.setState({form: this.dehydrateFhirResource(nextProps.relatedPerson)})       
  //     }
  //     shouldUpdate = true;
  //   }
 
  //   return shouldUpdate;
  // }


  // getMeteorData() {
  //   let data = {
  //     relatedPersonId: this.props.relatedPersonId,
  //     relatedPerson: false,
  //     form: this.state.form
  //   };

  //   if(this.props.relatedPerson){
  //     data.relatedPerson = this.props.relatedPerson;
  //   }

  //   if(process.env.NODE_ENV === "test") console.log("RelatedPersonDetail[data]", data);
  //   return data;
  // }

  let telecomArray = [];

  if(get(activeRelatedPerson, 'telecom')){
    if(Array.isArray(activeRelatedPerson.telecom)){
      activeRelatedPerson.telecom.forEach(function(record, index){
        telecomArray.push(
          <Grid container spacing={3}>
              <Grid item md={2}>
                <TextField
                  id='systemInput'
                  name='system'
                  type='text'
                  label='System'
                  //floatingLabelFixed={true}
                  value={ get(activeRelatedPerson, 'telecom[' + index + '].system') }
                  onChange={ updateField.bind(this, 'telecom[' + index + '].system')}
                  hintText='phone | email | fax'
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={2}>
                <TextField
                  id='telecomUseInput'
                  name='telecomUse'
                  type='text'
                  label='Use'
                  //floatingLabelFixed={true}
                  value={ get(activeRelatedPerson, 'telecom[' + index + '].use') }
                  onChange={ updateField.bind(this, 'telecom[' + index + '].use')}
                  hintText='phone | email | fax'
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={3}>
                <TextField
                  id='telecomValueInput'
                  name='telecomValue'
                  type='text'
                  label='Value'
                  value={ get(activeRelatedPerson, 'telecom[' + index + '].value') }
                  onChange={ updateField.bind(this, 'telecom[' + index + '].value') }
                  hintText='773-865-8350; jane@gmail.com'
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={1}>
                <TextField
                  id='telecomRankInput'
                  name='telecomRank'
                  type='text'
                  label='Rank'
                  value={ get(activeRelatedPerson, 'telecom[' + index + '].rank') }
                  onChange={ updateField.bind(this, 'telecom[' + index + '].rank') }
                  hintText='1, 2, 3...'
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={2}>
                <TextField
                  id='telecomStartInput'
                  // ref='telecomStart'
                  name='telecomStart'
                  type='date'
                  label='Start'
                  floatingLabelFixed={true}
                  value={ get(activeRelatedPerson, 'telecom[' + index + '].period.start', null) }
                  onChange={ updateField.bind(this, 'telecom[' + index + '].period.start')}
                  disabled={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={2}>
                <TextField
                  id='telecomEndInput'
                  // ref='telecomEnd'
                  name='telecomEnd'
                  type='date'
                  label='End'
                  disabled={true}
                  floatingLabelFixed={true}
                  value={ get(activeRelatedPerson, 'telecom[' + index + '].period.end', null) }
                  onChange={ updateField.bind(this, 'telecom[' + index + '].period.end')}
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
    <div className="relatedPersonDetail">
      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={6}>  
            <TextField
              id='relatedPersonNameInput'
              // ref='name'
              name='name'
              type='text'
              label='Name'
              //floatingLabelFixed={true}
              hintText='Alison Camron'
              value={ FhirUtilities.assembleName(get(activeRelatedPerson, 'name[0]')) }
              onChange={ updateField.bind(this, 'name')}
              InputLabelProps={{
                shrink: true
              }}
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
              value={ FhirUtilities.pluckEmail(get(activeRelatedPerson, 'email')) }
              onChange={ updateField.bind(this, 'email')}
              InputLabelProps={{
                shrink: true
              }}
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
              value={ FhirUtilities.pluckPhone(get(activeRelatedPerson, 'phone')) }
              onChange={ updateField.bind(this, 'phone')}
              InputLabelProps={{
                shrink: true
              }}
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
              value={ FhirUtilities.stringifyAddress(get(activeRelatedPerson, 'address[0].line')) }
              onChange={ updateField.bind(this, 'address[0].line')}
              //floatingLabelFixed={true}
              hintText='South Side'
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={2}>
            <TextField
              id='cityInput'
              // ref='city'
              name='city'
              label='City'
              value={ get(activeRelatedPerson, 'city') }
              onChange={ updateField.bind(this, 'city')}
              hintText='Chicago'
              //floatingLabelFixed={true}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={2}>
            <TextField
              id='stateInput'
              // ref='state'
              name='state'
              label='State'
              value={ get(activeRelatedPerson, 'address[0].state') }
              onChange={ updateField.bind(this, 'address[0].state')}
              //floatingLabelFixed={true}
              InputLabelProps={{
                shrink: true
              }}
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
              value={ get(activeRelatedPerson, 'address[0].postalCode') }
              onChange={ updateField.bind(this, 'address[0].postalCode')}
              //floatingLabelFixed={true}
              InputLabelProps={{
                shrink: true
              }}
              hintText='60637'
              fullWidth
              /><br/>
          </Grid>
        </Grid>

        <div id="qualificationArray" style={{ paddingLeft: '10px', borderLeft: '4px double lightgray', marginTop: '20px'}}>
          { telecomArray }
        </div>  
        
        {/* { this.displayQualifications(this.data.relatedPersonId) }      */}
      </CardContent>
      {/* <CardActions>
        { this.determineButtons(this.data.relatedPersonId) }
      </CardActions> */}
    </div>
  );
}

RelatedPersonDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  relatedPersonId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  relatedPerson: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

export default RelatedPersonDetail;