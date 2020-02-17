import { 
  Grid,
  Button, 
  CardActions, 
  CardContent, 
  CardHeader,
  TextField,
  Paper
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import PractitionersTable  from './PractitionersTable';
import { get, set } from 'lodash';
import moment from 'moment';

Session.setDefault('practitionerBlockchainData', []);

export class PractitionerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      practitionerId: false,
      practitioner: {
        resourceType : "Practitioner",
          name : {
            resourceType : "HumanName",
            text : ""
          },
          telecom : [{
            resourceType : "ContactPoint",
            system : "phone",
            value : "",
            use : "",
            rank : 1
          }, {
            resourceType : "ContactPoint",
            system : "email",
            value : "",
            use : "",
            rank : 1
          }],
          qualification : [{
            identifier : [{
              use : "certficate",
              value : "",
              period : {
                start: null,
                end: null
              }
            }],
            issuer : {
              display : "",
              reference : ""
            }
        }],
        address: [{
          text: '',
          city: '',
          state: '',
          postalCode: ''
        }]
      },
      form: {
        name: '',
        phone: '',
        email: '',
        qualificationIssuer: '',
        qualificationIdentifier: '',
        qualificationCode: '',
        qualificationStart: null,
        qualificationEnd: null,
        text: '',
        city: '',
        state: '',
        postalCode: ''
      }
    }
  }
  dehydrateFhirResource(practitioner) {
    let formData = Object.assign({}, this.state.form);

    formData.name = get(practitioner, 'name.text')

    let telecomArray = get(practitioner, 'telecom');
    telecomArray.forEach(function(telecomRecord){
      if(get(telecomRecord, 'system') === 'phone'){
        formData.phone = get(telecomRecord, 'value');
      }
      if(get(telecomRecord, 'system') === 'email'){
        formData.email = get(telecomRecord, 'value');
      }
    })

    formData.qualificationIssuer = get(practitioner, 'qualification[0].issuer.display')
    formData.qualificationIdentifier = get(practitioner, 'qualification[0].identifier')
    formData.qualificationStart = moment(get(practitioner, 'qualification[0].period.start')).format('YYYY-MM-DD')
    formData.qualificationEnd = moment(get(practitioner, 'qualification[0].period.end')).format('YYYY-MM-DD')
    formData.qualificationCode = get(practitioner, 'qualification[0].code.coding[0].code')

    formData.text = get(practitioner, 'address[0].text')
    formData.city = get(practitioner, 'address[0].city')
    formData.state = get(practitioner, 'address[0].state')
    formData.postalCode = get(practitioner, 'address[0].postalCode')

    return formData;
  }

  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('PractitionerDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.practitioner === this.state.practitioner){
      shouldUpdate = false;
    }

    // received an practitioner from the table; okay lets update again
    if(nextProps.practitionerId !== this.state.practitionerId){
      this.setState({practitionerId: nextProps.practitionerId})
      
      if(nextProps.practitioner){
        this.setState({practitioner: nextProps.practitioner})     
        this.setState({form: this.dehydrateFhirResource(nextProps.practitioner)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }


  getMeteorData() {
    let data = {
      practitionerId: this.props.practitionerId,
      practitioner: false,
      form: this.state.form
    };

    if(this.props.practitioner){
      data.practitioner = this.props.practitioner;
    }

    if(process.env.NODE_ENV === "test") console.log("PractitionerDetail[data]", data);
    return data;
  }


  render() {
    if(process.env.NODE_ENV === "test") console.log('PractitionerDetail.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="practitionerDetail">
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
                value={ get(formData, 'name') }
                onChange={ this.changeState.bind(this, 'name')}
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
                value={ get(formData, 'email') }
                onChange={ this.changeState.bind(this, 'email')}
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
                value={ get(formData, 'phone') }
                onChange={ this.changeState.bind(this, 'phone')}
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
                value={ get(formData, 'text') }
                onChange={ this.changeState.bind(this, 'text')}
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
                value={ get(formData, 'city') }
                onChange={ this.changeState.bind(this, 'city')}
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
                value={ get(formData, 'state') }
                onChange={ this.changeState.bind(this, 'state')}
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
                value={ get(formData, 'postalCode') }
                onChange={ this.changeState.bind(this, 'postalCode')}
                //floatingLabelFixed={true}
                hintText='60637'
                fullWidth
                /><br/>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={4}>
              <TextField
                id='qualificationIssuerInput'
                // ref='qualificationIssuer'
                name='qualificationIssuer'
                type='text'
                label='Qualification Issuer'
                //floatingLabelFixed={true}
                value={ get(formData, 'qualificationIssuer') }
                onChange={ this.changeState.bind(this, 'qualificationIssuer')}
                hintText='American College of Emergency Physicians'
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={2}>
              <TextField
                id='qualificationCodeInput'
                // ref='qualificationCode'
                name='qualificationCode'
                type='text'
                label='Qualification Code'
                //floatingLabelFixed={true}
                value={ get(formData, 'qualificationCode') }
                onChange={ this.changeState.bind(this, 'qualificationCode')}
                hintText='ACEP-10792866'
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={3}>
              <TextField
                id='qualificationStartInput'
                // ref='qualificationStart'
                name='qualificationStart'
                type='date'
                label='Start'
                //floatingLabelFixed={true}
                value={ get(formData, 'qualificationStart') }
                onChange={ this.changeState.bind(this, 'qualificationStart')}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={3}>
              <TextField
                id='qualificationEndInput'
                // ref='qualificationEnd'
                name='qualificationEnd'
                type='date'
                label='End'
                //floatingLabelFixed={true}
                value={ get(formData, 'qualificationEnd') }
                onChange={ this.changeState.bind(this, 'qualificationEnd')}
                fullWidth
                /><br/>
            </Grid>
          </Grid>
          { this.displayQualifications(this.data.practitionerId) }     
        </CardContent>
        <CardActions>
          { this.determineButtons(this.data.practitionerId) }
        </CardActions>
      </div>
    );
  }
  displayQualifications(practitionerId){

    if (practitionerId && get(Meteor, 'settings.public.defaults.displayBlockchainComponents')){      
      return (
        <Row>
          <Paper zDepth={2} style={{borderLeft: 'solid gray 3px', marginLeft: '60px', marginRight: '20px',marginTop: '40px', marginBottom: '40px'}}>
            <CardHeader title='Qualifications & Credentials' />
            <CardContent>
              <PractitionersTable showBarcodes={false} data={ this.data.blockchainData }/>
            </CardContent>
          </Paper>
        </Row>
      );
    }
  }
  determineButtons(practitionerId){
    if (practitionerId) {
      return (
        <div>
          <Button id="updatePractitionerButton" className="savePractitionerButton" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
          <Button id="deletePractitionerButton" onClick={this.handleDeleteButton.bind(this)} >Delete</Button>
        </div>
      );
    } else {
      return(
        <Button id="savePractitionerButton" className="savePractitionerButton" primary={true} onClick={this.handleSaveButton.bind(this)} >Save</Button>
      );
    }
  }



  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("PatientDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "name":
        set(formData, 'name', textValue)
        break;
      case "phone":
        set(formData, 'phone', textValue)
        break;
      case "email":
        set(formData, 'email', textValue)
        break;        
      case "qualificationIssuer":
        set(formData, 'qualificationIssuer', textValue)
        break;
      case "qualificationIdentifier":
        set(formData, 'qualificationIdentifier', textValue)
        break;
      case "qualificationCode":
        set(formData, 'qualificationCode', textValue)
        break;
      case "qualificationStart":
        set(formData, 'qualificationStart', )
        break;
      case "qualificationEnd":
        set(formData, 'qualificationEnd', textValue)
        break;
      case "text":
        set(formData, 'text', textValue)
        break;
      case "city":
        set(formData, 'city', textValue)
        break;
      case "state":
        set(formData, 'state', textValue)
        break;
      case "postalCode":
        set(formData, 'postalCode', textValue)
        break;
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updatePractitioner(practitionerData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("PatientDetail.updatePractitioner", practitionerData, field, textValue);

    let telecomArray = get(practitionerData, 'telecom');

    switch (field) {
      case "name":
        set(practitionerData, 'name.text', textValue)
        break;
        case "phone":
        telecomArray.forEach(function(telecom){
          if(telecom.system === 'phone'){
            telecom.value = textValue
          } 
        })
        set(practitionerData, 'telecom', telecomArray)
        break;
      case "email":
        telecomArray.forEach(function(telecom){
          if(telecom.system === 'email'){
            telecom.value = textValue
          } 
        })
        set(practitionerData, 'telecom', telecomArray)
        break;      
      case "qualificationIssuer":
        set(practitionerData, 'qualification[0].issuer.display', textValue)
        break;
      case "qualificationIdentifier":
        set(practitionerData, 'qualification[0].identifier', textValue)
        break;
      case "qualificationCode":
        set(practitionerData, 'qualification[0].code.coding[0].code', textValue)
        break;
      case "qualificationStart":
        set(practitionerData, 'qualification[0].period.start', moment(textValue))
        break;
      case "qualificationEnd":
        set(practitionerData, 'qualification[0].period.end', moment(textValue))
        break;
      case "text":
        set(practitionerData, 'address[0].text', textValue)
        break;
      case "city":
        set(practitionerData, 'address[0].city', textValue)
        break;
      case "state":
        set(practitionerData, 'address[0].state', textValue)
        break;
      case "postalCode":
        set(practitionerData, 'address[0].postalCode', textValue)
        break;
    }
    return practitionerData;
  }

  changeState(field, event, textValue){

    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("PractitionerDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let practitionerData = Object.assign({}, this.state.practitioner);

    formData = this.updateFormData(formData, field, textValue);
    practitionerData = this.updatePractitioner(practitionerData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("practitionerData", practitionerData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({practitioner: practitionerData})
    this.setState({form: formData})
  }

  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Practitioner...', this.state)

    let self = this;
    let fhirPractitionerData = Object.assign({}, this.state.practitioner);

    if(process.env.NODE_ENV === "test") console.log('fhirPractitionerData', fhirPractitionerData);


    let practitionerValidator = PractitionerSchema.newContext();
    practitionerValidator.validate(fhirPractitionerData)

    console.log('IsValid: ', practitionerValidator.isValid())


    if (this.state.practitionerId) {
      if(process.env.NODE_ENV === "test") console.log("Updating Practitioner...");

      delete fhirPractitionerData._id;

      if(process.env.NODE_ENV === "test") console.log("fhirPractitionerData", fhirPractitionerData);

      Practitioners._collection.update({_id: this.state.practitionerId}, {$set: fhirPractitionerData }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Practitioners.update[error]", error);
          // Bert.alert(error.reason, 'danger');
        } else {
          // Bert.alert('Practitioner added!', 'success');
          Session.set('practitionerPageTabIndex', 1);
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Practitioners", recordId: self.state.practitionerId});
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new practitioner...", fhirPractitionerData);

      Practitioners._collection.insert(fhirPractitionerData, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Practitioners.insert[error]", error);
          // Bert.alert(error.reason, 'danger');
        } else {
          // Bert.alert('Practitioner added!', 'success');
          Session.set('practitionerPageTabIndex', 1);
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Practitioners", recordId: self.state.practitionerId});
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('practitionerPageTabIndex', 1);
  }

  handleDeleteButton(){
    let self = this;
    Practitioners._collection.remove({_id: this.state.practitionerId}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log("Practitioners.insert[error]", error);
        // Bert.alert(error.reason, 'danger');
      } else {
        // Bert.alert('Practitioner removed!', 'success');
        Session.set('practitionerPageTabIndex', 1);
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Practitioners", recordId: self.state.practitionerId});
      }
    });
  }
}

PractitionerDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  practitionerId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  practitioner: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

ReactMixin(PractitionerDetail.prototype, ReactMeteorData);
export default PractitionerDetail;