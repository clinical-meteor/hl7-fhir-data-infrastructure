import { 
  Button,
  Card,
  Checkbox,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Tab, 
  Tabs,
  TextField,
  Typography,
  Box
} from '@material-ui/core';

import React from 'react';
import PropTypes from 'prop-types';

import { useTracker } from 'meteor/react-meteor-data';

import { get, set } from 'lodash';

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

let defaultLocation = {
  resourceType: 'Location'
}

Session.setDefault('Location.Current', defaultLocation)


//====================================================================================
// MAIN COMPONENT


export function LocationDetail(props) {


  let classes = useStyles();


  let { 
    children, 
    location,
    ...otherProps 
  } = props;

  let activeLocation = defaultLocation;

  activeLocation = useTracker(function(){
    return Session.get('Location.Current');
  }, [])

  function updateField(path, event){
    console.log('updateField', event.currentTarget.value);

    // setCurrentCodeSystem(set(currentCodeSystem, path, event.currentTarget.value))
    Session.set('Location.Current', set(activeCodeSystem, path, event.currentTarget.value))    
  }


  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     locationId: false,
  //     location: {
  //       resourceType: "Location",
  //       status: "active",
  //       name: "",
  //       position: {
  //         latitude: 0,
  //         longitude: 0,
  //         altitude: 0
  //       }
  //     },
  //     form: {
  //       name: '',
  //       status: '',
  //       latitude: '',
  //       longitude: '',
  //       identifier: '',
  //       altitude: ''
  //     }
  //   }
  // }
  // dehydrateFhirResource(location) {
  //   let formData = Object.assign({}, this.state.form);

  //   formData.name = get(location, 'name')
  //   formData.status = get(location, 'status')
  //   formData.latitude = get(location, 'position.latitude')    
  //   formData.longitude = get(location, 'position.longitude')    
  //   formData.altitude = get(location, 'position.altitude')    

  //   return formData;
  // }
  // shouldComponentUpdate(nextProps){
  //   process.env.NODE_ENV === "test" && console.log('LocationDetail.shouldComponentUpdate()', nextProps, this.state)
  //   let shouldUpdate = true;

  //   // both false; don't take any more updates
  //   if(nextProps.location === this.state.location){
  //     shouldUpdate = false;
  //   }

  //   // received an location from the table; okay lets update again
  //   if(nextProps.locationId !== this.state.locationId){
  //     this.setState({locationId: nextProps.locationId})    
      
  //     if(nextProps.location){
  //       this.setState({location: nextProps.location})     
  //       this.setState({form: this.dehydrateFhirResource(nextProps.location)})       
  //     }
  //     shouldUpdate = true;
  //   }
 
  //   return shouldUpdate;
  // }
  // getMeteorData() {
  //   let data = {
  //     locationId: this.props.locationId,
  //     location: false,
  //     form: this.state.form
  //   };

  //   if(this.props.location){
  //     data.location = this.props.location;
  //   }

  //   console.log('LocationDetail[data]', data);
  //   return data;
  // }

  // let formData = this.state.form;

  return (
    <div className="locationDetail" style={{height: '100%'}}>
      <CardContent>
        <Grid container spacer={3}>
          <Grid item md={8}>
            <TextField
              id='nameInput'
              name='name'
              floatingLabelText='Location Name'
              value={ get(activeLocation, 'name') }
              onChange={updateField.bind(this, 'name')}
              floatingLabelFixed={true}
              hintText='Home'
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={4}>
            <TextField
              id='statusInput'
              name='status'
              floatingLabelText='Status'
              value={ get(activeLocation, 'status') }
              onChange={updateField.bind(this, 'status')}
              floatingLabelFixed={true}
              hintText='active | suspended | inactive'
              fullWidth
              /><br/>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={4}>
            <TextField
              id='latitudeInput'
              name='latitude'
              floatingLabelText='Latitude'
              value={ get(activeLocation, 'latitude')}
              onChange={updateField.bind(this, 'latitude')}
              floatingLabelFixed={true}
              hintText='41.7895716'
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={4}>
            <TextField
              id='longitudeInput'
              name='longitude'
              floatingLabelText='Longitude'
              value={ get(activeLocation, 'longitude') }
              onChange={updateField.bind(this, 'longitude')}
              floatingLabelFixed={true}
              hintText='-87.599661'
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={4}>
            <TextField
              id='altitudeInput'
              name='altitude'
              floatingLabelText='Altitude'
              value={ get(activeLocation, 'altitude') }
              onChange={updateField.bind(this, 'altitude')}
              floatingLabelFixed={true}                
              fullWidth
              /><br/>
          </Grid>
        </Grid>
      </CardContent>
      {/* <CardActions>
        { this.determineButtons(this.data.locationId) }
      </CardActions> */}
    </div>
  );

  // determineButtons(locationId){
  //   if (locationId) {
  //     return (
  //       <div>
  //         <Button id="updateLocationButton" color="primary" variant="contained" onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
  //         <Button id="deleteLocationButton" onClick={this.handleDeleteButton.bind(this)} >Delete</Button>
  //       </div>
  //     );
  //   } else {
  //     return(
  //       <Button id="saveLocationButton" color="primary" variant="contained" onClick={this.handleSaveButton.bind(this)} >Save</Button>
  //     );
  //   }
  // }
  // updateFormData(formData, field, textValue){
  //   if(process.env.NODE_ENV === "test") console.log("LocationDetail.updateFormData", formData, field, textValue);

  //   switch (field) {
  //     case "name":
  //       set(formData, 'name', textValue)
  //       break;
  //     case "status":
  //       set(formData, 'status', textValue)
  //       break;
  //     case "latitude":
  //       set(formData, 'latitude', textValue)
  //       break;        
  //     case "longitude":
  //       set(formData, 'longitude', textValue)
  //       break;        
  //     case "altitude":
  //       set(formData, 'altitude', textValue)
  //       break;      
  //     default:
  //   }

  //   if(process.env.NODE_ENV === "test") console.log("formData", formData);
  //   return formData;
  // }
  // updateLocation(locationData, field, textValue){
  //   if(process.env.NODE_ENV === "test") console.log("LocationDetail.updateLocation", locationData, field, textValue);

  //   switch (field) {
  //     case "name":
  //       set(locationData, 'name', textValue)
  //       break;
  //     case "status":
  //       set(locationData, 'status', textValue)
  //       break;
  //     case "latitude":
  //       set(locationData, 'position.latitude', textValue)
  //       break;        
  //     case "longitude":
  //       set(locationData, 'position.longitude', textValue)
  //       break;        
  //     case "altitude":
  //       set(locationData, 'position.altitude', textValue)
  //       break;
  //   }
  //   return locationData;
  // }

  // changeState(field, event, textValue){
  //   if(process.env.NODE_ENV === "test") console.log("   ");
  //   if(process.env.NODE_ENV === "test") console.log("LocationDetail.changeState", field, textValue);
  //   if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

  //   let formData = Object.assign({}, this.state.form);
  //   let locationData = Object.assign({}, this.state.location);

  //   formData = this.updateFormData(formData, field, textValue);
  //   locationData = this.updateLocation(locationData, field, textValue);

  //   if(process.env.NODE_ENV === "test") console.log("locationData", locationData);
  //   if(process.env.NODE_ENV === "test") console.log("formData", formData);

  //   this.setState({location: locationData})
  //   this.setState({form: formData})
  // }

  // // this could be a mixin
  // handleSaveButton(){
  //   if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
  //   console.log('Saving a new Location...', this.state)

  //   let self = this;
  //   let fhirLocationData = Object.assign({}, this.state.location);

  //   if(process.env.NODE_ENV === "test") console.log('fhirLocationData', fhirLocationData);


  //   let locationValidator = LocationSchema.newContext();
  //   locationValidator.validate(fhirLocationData)

  //   console.log('IsValid: ', locationValidator.isValid())
  //   console.log('ValidationErrors: ', locationValidator.validationErrors());


  //   if (this.props.locationId) {
  //     if(process.env.NODE_ENV === "test") console.log("update practioner");
  //     delete fhirLocationData._id;

  //     Locations._collection.update(
  //       {_id: this.props.locationId}, {$set: fhirLocationData }, function(error) {
  //         if (error) {
  //           console.log("error", error);

  //           // Bert.alert(error.reason, 'danger');
  //         } else {
  //           // Bert.alert('Location updated!', 'success');
  //           Session.set('locationPageTabIndex', 1);
  //           Session.set('selectedLocation', false);
  //         }
  //       });
  //   } else {

  //     if(process.env.NODE_ENV === "test") console.log("Create a new Location", fhirLocationData);

  //     Locations._collection.insert(fhirLocationData, function(error) {
  //       if (error) {
  //         // Bert.alert(error.reason, 'danger');
  //       } else {
  //         // Bert.alert('Location added!', 'success');
  //         Session.set('locationPageTabIndex', 1);
  //         Session.set('selectedLocation', false);
  //       }
  //     });
  //   }
  // }

  // // this could be a mixin
  // handleCancelButton(){
  //   if(process.env.NODE_ENV === "test") console.log("handleCancelButton");
  // }

  // handleDeleteButton(){
  //   let self = this;
  //   Locations._collection.remove({_id: this.props.locationId}, function(error, result){
  //     if (error) {
  //       // Bert.alert(error.reason, 'danger');
  //     } else {
  //       // Bert.alert('Location deleted!', 'success');
  //       Session.set('locationPageTabIndex', 1);
  //       Session.set('selectedLocation', false);
  //       Session.set('locationUpsert', false);
  //     }
  //     if (result) {
  //       // HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Locations", recordId: self.props.locationId});
  //     }
  //   })
  // }
}

LocationDetail.propTypes = {
  id: PropTypes.string,
  locationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  location: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

export default LocationDetail;