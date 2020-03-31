
import React from 'react';
import PropTypes from 'prop-types';


import { 
  Button,
  Card,
  Checkbox,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core';

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { get, set } from 'lodash';


export class OrganizationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organizationId: false,
      organization: {
        resourceType: 'Organization',
        active: true,
        name: "",
        identifier: [{
          use: 'usual',
          value: ''
        }],
        telecom: [{
          resourceType: "ContactPoint",
          system: "phone",
          value: '',
          use: ''
        }, {
          resourceType: "ContactPoint",
          system: "email",
          value: '',
          use: ''
        }],
        address: [{
          resourceType: "Address",
          text: '',
          city: '',
          state: '',
          postalCode: ''
        }]
      },
      form: {
        name: '',
        identifier: '',
        phone: '',
        email: '',
        text: '',
        city: '',
        state: '',
        postalCode: ''
      }
    }
  }
  dehydrateFhirResource(organization) {
    let formData = Object.assign({}, this.state.form);

    formData.name = get(organization, 'name')
    formData.identifier = get(organization, 'identifier[0].value')

    let telecomArray = get(organization, 'telecom');
    telecomArray.forEach(function(telecomRecord){
      if(get(telecomRecord, 'system') === 'phone'){
        formData.phone = get(telecomRecord, 'value');
      }
      if(get(telecomRecord, 'system') === 'email'){
        formData.email = get(telecomRecord, 'value');
      }
    })

    formData.text = get(organization, 'address[0].text')
    formData.city = get(organization, 'address[0].city')
    formData.state = get(organization, 'address[0].state')
    formData.postalCode = get(organization, 'address[0].postalCode')

    return formData;
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('DeviceDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.organization === this.state.organization){
      shouldUpdate = false;
    }

    // received an organization from the table; okay lets update again
    if(nextProps.organizationId !== this.state.organizationId){
      this.setState({organizationId: nextProps.organizationId})
      
      if(nextProps.organization){
        this.setState({organization: nextProps.organization})     
        this.setState({form: this.dehydrateFhirResource(nextProps.organization)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }
  getMeteorData() {
    let data = {
      organizationId: this.props.organizationId,
      organization: false,
      form: this.state.form
    };

    if(this.props.organization){
      data.organization = this.props.organization;
    }

    console.log('OrganizationDetail', data);
    return data;
  }


  render() {
    if(process.env.NODE_ENV === "test") console.log('DeviceDetail.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="organizationDetail">
        <CardContent>
          <Grid container>
            <Grid item md={9}>
              <TextField
                id='organizationNameInput'
                ref='organizationName'
                name='name'
                floatingLabelText='Organization Name'
                value={ get(formData, 'name') }
                onChange={ this.changeState.bind(this, 'name')}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={3}>
              <TextField
                id='identifierInput'
                ref='identifier'
                name='identifier'
                floatingLabelText='Identifier'
                value={ get(formData, 'identifier') }
                onChange={ this.changeState.bind(this, 'identifier')}
                fullWidth
                /><br/>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={4}>
              <TextField
                id='textInput'
                ref='text'
                name='text'
                floatingLabelText='Address'
                value={ get(formData, 'text') }
                onChange={ this.changeState.bind(this, 'text')}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={2}>
              <TextField
                id='cityInput'
                ref='city'
                name='city'
                floatingLabelText='City'
                value={ get(formData, 'city') }
                onChange={ this.changeState.bind(this, 'city')}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={2}>
              <TextField
                id='stateInput'
                ref='state'
                name='state'
                floatingLabelText='State'
                value={ get(formData, 'state') }
                onChange={ this.changeState.bind(this, 'state')}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={2}>
              <TextField
                id='postalCodeInput'
                ref='postalCode'
                name='postalCode'
                floatingLabelText='Postal Code'
                value={ get(formData, 'postalCode') }
                onChange={ this.changeState.bind(this, 'postalCode')}
                fullWidth
                /><br/>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={3}>
              <TextField
                id='phoneInput'
                ref='phone'
                name='phone'
                floatingLabelText='Phone'
                value={ get(formData, 'phone') }
                onChange={ this.changeState.bind(this, 'phone')}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={3}>
              <TextField
                id='emailInput'
                ref='email'
                name='email'
                floatingLabelText='Email'
                value={ get(formData, 'email') }
                onChange={ this.changeState.bind(this, 'email')}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={3}>
            </Grid>
            <Grid item md={3}>
            </Grid>
          </Grid>

        </CardContent>
        <CardActions>
          { this.determineButtons(this.data.organizationId) }
        </CardActions>
      </div>
    );
  }


  determineButtons(organizationId){
    if (organizationId) {
      return (
        <div>
          <Button id="updateOrganizationButton" label="Save" color="primary" variant="contained" onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <Button id="deleteOrganizationButton" label="Delete" color="primary"  onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <Button id="saveOrganizationButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("DeviceDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "name":
        set(formData, 'name', textValue)
        break;
      case "identifier":
        set(formData, 'identifier', textValue)
        break;        
      case "phone":
        set(formData, 'phone', textValue)
        break;
      case "email":
        set(formData, 'email', textValue)
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
      default:
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateOrganization(organizationData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("DeviceDetail.updateDevice", organizationData, field, textValue);

    let telecomArray = organizationData.telecom;

    switch (field) {
      case "name":
        set(organizationData, 'name', textValue)
        break;
      case "identifier":
        set(organizationData, 'identifier[0].value', textValue)
        break;        
      case "phone":
        telecomArray.forEach(function(telecom){
          if(telecom.system === 'phone'){
            telecom.value = textValue
          } 
        })
        set(organizationData, 'telecom', telecomArray)
        break;
      case "email":
        telecomArray.forEach(function(telecom){
          if(telecom.system === 'email'){
            telecom.value = textValue
          } 
        })
        set(organizationData, 'telecom', telecomArray)
        break;
      case "text":
        set(organizationData, 'address[0].text', textValue)
        break;
      case "city":
        set(organizationData, 'address[0].city', textValue)
        break;
      case "state":
        set(organizationData, 'address[0].state', textValue)
        break;
      case "postalCode":
        set(organizationData, 'address[0].postalCode', textValue)
        break;    
    }
    return organizationData;
  }

  changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("DeviceDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let organizationData = Object.assign({}, this.state.organization);

    formData = this.updateFormData(formData, field, textValue);
    organizationData = this.updateOrganization(organizationData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("organizationData", organizationData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({organization: organizationData})
    this.setState({form: formData})
  }

  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Organization...', this.state)

    let self = this;
    let fhirOrganizationData = Object.assign({}, this.state.organization);

    if(process.env.NODE_ENV === "test") console.log('fhirOrganizationData', fhirOrganizationData);


    let organizationValidator = OrganizationSchema.newContext();
    organizationValidator.validate(fhirOrganizationData)

    console.log('IsValid: ', organizationValidator.isValid())
    console.log('ValidationErrors: ', organizationValidator.validationErrors());

    if (this.state.organizationId) {
      if(process.env.NODE_ENV === "test") console.log("Update Organization");
      delete fhirOrganizationData._id;

      Organizations._collection.update(
        {_id: this.state.organizationId}, {$set: fhirOrganizationData }, function(error) {
          if (error) {
            console.log("error", error);
            Bert.alert(error.reason, 'danger');
          } else {
            Bert.alert('Organization updated!', 'success');
            Session.set('organizationPageTabIndex', 1);
            Session.set('selectedOrganization', false);
          }
        });
    } else {

      if(process.env.NODE_ENV === "test") console.log("create a new organization", fhirOrganizationData);

      Organizations._collection.insert(fhirOrganizationData, function(error) {
        if (error) {
          console.log('Organizations.insert[error]', error)
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Organization added!', 'success');
          Session.set('organizationPageTabIndex', 1);
          Session.set('selectedOrganization', false);
        }
      });
    }
  }

  handleCancelButton(){
    if(process.env.NODE_ENV === "test") console.log("handleCancelButton");
  }

  handleDeleteButton(){
    Organizations._collection.remove({_id: this.state.organizationId}, function(error, result){
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Organization deleted!', 'success');
        Session.set('organizationPageTabIndex', 1);
        Session.set('selectedOrganization', false);
      }
    })
  }
}


OrganizationDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  organizationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  organization: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

ReactMixin(OrganizationDetail.prototype, ReactMeteorData);
export default OrganizationDetail;