import { CardActions, CardText } from 'material-ui/Card';
import { Col, Grid, Row } from 'react-bootstrap';

import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import { get, set } from 'lodash';


export class LocationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationId: false,
      location: {
        resourceType: "Location",
        status: "active",
        name: "",
        position: {
          latitude: 0,
          longitude: 0,
          altitude: 0
        }
      },
      form: {
        name: '',
        status: '',
        latitude: '',
        longitude: '',
        identifier: '',
        altitude: ''
      }
    }
  }
  dehydrateFhirResource(location) {
    let formData = Object.assign({}, this.state.form);

    formData.name = get(location, 'name')
    formData.status = get(location, 'status')
    formData.latitude = get(location, 'position.latitude')    
    formData.longitude = get(location, 'position.longitude')    
    formData.altitude = get(location, 'position.altitude')    

    return formData;
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('LocationDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.location === this.state.location){
      shouldUpdate = false;
    }

    // received an location from the table; okay lets update again
    if(nextProps.locationId !== this.state.locationId){
      this.setState({locationId: nextProps.locationId})    
      
      if(nextProps.location){
        this.setState({location: nextProps.location})     
        this.setState({form: this.dehydrateFhirResource(nextProps.location)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }
  getMeteorData() {
    let data = {
      locationId: this.props.locationId,
      location: false,
      form: this.state.form
    };

    if(this.props.location){
      data.location = this.props.location;
    }

    console.log('LocationDetail[data]', data);
    return data;
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('LocationDetail.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="locationDetail" style={{height: '100%'}}>
        <CardText>
          <Row>
            <Col md={8}>
              <TextField
                id='nameInput'
                ref='name'
                name='name'
                floatingLabelText='Location Name'
                value={ get(formData, 'name') }
                onChange={ this.changeState.bind(this, 'name')}
                floatingLabelFixed={true}
                hintText='Home'
                fullWidth
                /><br/>
            </Col>
            <Col md={4}>
              <TextField
                id='statusInput'
                ref='status'
                name='status'
                floatingLabelText='Status'
                value={ get(formData, 'status') }
                onChange={ this.changeState.bind(this, 'status')}
                floatingLabelFixed={true}
                hintText='active | suspended | inactive'
                fullWidth
                /><br/>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <TextField
                id='latitudeInput'
                ref='latitude'
                name='latitude'
                floatingLabelText='Latitude'
                value={ get(formData, 'latitude')}
                onChange={ this.changeState.bind(this, 'latitude')}
                floatingLabelFixed={true}
                hintText='41.7895716'
                fullWidth
                /><br/>
            </Col>
            <Col md={4}>
              <TextField
                id='longitudeInput'
                ref='longitude'
                name='longitude'
                floatingLabelText='Longitude'
                value={ get(formData, 'longitude') }
                onChange={ this.changeState.bind(this, 'longitude')}
                floatingLabelFixed={true}
                hintText='-87.599661'
                fullWidth
                /><br/>
            </Col>
            <Col md={4}>
              <TextField
                id='altitudeInput'
                ref='altitude'
                name='altitude'
                floatingLabelText='Altitude'
                value={ get(formData, 'altitude') }
                onChange={ this.changeState.bind(this, 'altitude')}
                floatingLabelFixed={true}                
                fullWidth
                /><br/>
            </Col>
          </Row>
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.locationId) }
        </CardActions>
      </div>
    );
  }

  determineButtons(locationId){
    if (locationId) {
      return (
        <div>
          <RaisedButton id="updateLocationButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}}  />
          <RaisedButton id="deleteLocationButton" label="Delete" onClick={this.handleDeleteButton.bind(this)}  />
        </div>
      );
    } else {
      return(
        <RaisedButton id="saveLocationButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }
  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("LocationDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "name":
        set(formData, 'name', textValue)
        break;
      case "status":
        set(formData, 'status', textValue)
        break;
      case "latitude":
        set(formData, 'latitude', textValue)
        break;        
      case "longitude":
        set(formData, 'longitude', textValue)
        break;        
      case "altitude":
        set(formData, 'altitude', textValue)
        break;      
      default:
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateLocation(locationData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("LocationDetail.updateLocation", locationData, field, textValue);

    switch (field) {
      case "name":
        set(locationData, 'name', textValue)
        break;
      case "status":
        set(locationData, 'status', textValue)
        break;
      case "latitude":
        set(locationData, 'position.latitude', textValue)
        break;        
      case "longitude":
        set(locationData, 'position.longitude', textValue)
        break;        
      case "altitude":
        set(locationData, 'position.altitude', textValue)
        break;
    }
    return locationData;
  }

  changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("LocationDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let locationData = Object.assign({}, this.state.location);

    formData = this.updateFormData(formData, field, textValue);
    locationData = this.updateLocation(locationData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("locationData", locationData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({location: locationData})
    this.setState({form: formData})
  }

  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Location...', this.state)

    let self = this;
    let fhirLocationData = Object.assign({}, this.state.location);

    if(process.env.NODE_ENV === "test") console.log('fhirLocationData', fhirLocationData);


    let locationValidator = LocationSchema.newContext();
    locationValidator.validate(fhirLocationData)

    console.log('IsValid: ', locationValidator.isValid())
    console.log('ValidationErrors: ', locationValidator.validationErrors());


    if (this.props.locationId) {
      if(process.env.NODE_ENV === "test") console.log("update practioner");
      delete fhirLocationData._id;

      Locations._collection.update(
        {_id: this.props.locationId}, {$set: fhirLocationData }, function(error) {
          if (error) {
            console.log("error", error);

            Bert.alert(error.reason, 'danger');
          } else {
            Bert.alert('Location updated!', 'success');
            Session.set('locationPageTabIndex', 1);
            Session.set('selectedLocation', false);
          }
        });
    } else {

      if(process.env.NODE_ENV === "test") console.log("Create a new Location", fhirLocationData);

      Locations._collection.insert(fhirLocationData, function(error) {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Location added!', 'success');
          Session.set('locationPageTabIndex', 1);
          Session.set('selectedLocation', false);
        }
      });
    }
  }

  // this could be a mixin
  handleCancelButton(){
    if(process.env.NODE_ENV === "test") console.log("handleCancelButton");
  }

  handleDeleteButton(){
    let self = this;
    Locations._collection.remove({_id: this.props.locationId}, function(error, result){
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Location deleted!', 'success');
        Session.set('locationPageTabIndex', 1);
        Session.set('selectedLocation', false);
        Session.set('locationUpsert', false);
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Locations", recordId: self.props.locationId});
      }
    })
  }
}

LocationDetail.propTypes = {
  id: PropTypes.string,
  locationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  location: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
ReactMixin(LocationDetail.prototype, ReactMeteorData);
export default LocationDetail;