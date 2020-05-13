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

import { get } from 'lodash';
import moment from 'moment';

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';


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

export class CommunicationRequestDetail extends React.Component {
  getMeteorData() {
    let data = {
      communicationRequestId: false,
      communicationRequest: defaultCommunicationRequest
    };

    if (Session.get('communicationRequestUpsert')) {
      data.communicationRequest = Session.get('communicationRequestUpsert');
    } else {
      if (Session.get('selectedCommunicationRequest')) {
        data.communicationRequestId = Session.get('selectedCommunicationRequest');
        console.log("selectedCommunicationRequest", Session.get('selectedCommunicationRequest'));

        let selectedCommunicationRequest = CommunicationRequests.findOne({_id: Session.get('selectedCommunicationRequest')});
        console.log("selectedCommunicationRequest", selectedCommunicationRequest);

        if (selectedCommunicationRequest) {
          data.communicationRequest = selectedCommunicationRequest;

          if (typeof selectedCommunicationRequest.birthDate === "object") {
            data.communicationRequest.birthDate = moment(selectedCommunicationRequest.birthDate).add(1, 'day').format("YYYY-MM-DD");
          }
        }
      } else {
        data.communicationRequest = defaultCommunicationRequest;
      }
    }

    if(process.env.NODE_ENV === "test") console.log("CommunicationRequestDetail[data]", data);
    return data;
  }

  render() {
    return (
      <div id={this.props.id} className="communicationRequestDetail">
        <CardContent>
            <Grid container>
              <Grid item md={2}>
                <TextField
                  id='categoryInput'
                  name='category'
                  floatingLabelText='category'
                  value={ get(this, 'data.communicationRequest.category[0].text') }
                  onChange={ this.changeState.bind(this, 'category')}
                  fullWidth
                  /><br/>
              </Grid>
              <Grid item md={6}>
                <TextField
                  id='identifierInput'
                  name='identifier'
                  floatingLabelText='identifier'
                  value={ get(this, 'data.communicationRequest.identifier[0].url') }
                  onChange={ this.changeState.bind(this, 'photo')}
                  floatingLabelFixed={false}
                  fullWidth
                  /><br/>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={4}>
                <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                  <TextField
                    id='subjectInput'
                    name='subject'
                    floatingLabelText='subject'
                    value={ get(this, 'data.communicationRequest.subject.display', '') }
                    onChange={ this.changeState.bind(this, 'name')}
                    fullWidth
                    /><br/>
                  <TextField
                    id='sentInput'
                    name='sent'
                    floatingLabelText='sent'
                    value={ moment(get(this, 'data.communicationRequest.sent')).format('YYYY-MM-DD hh:mm:ss') }
                    onChange={ this.changeState.bind(this, 'sent')}
                    fullWidth
                    /><br/>
                </Card>
              </Grid>
              <Grid item md={4}>
                <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                  <TextField
                    id='definitionInput'
                    name='definition'
                    floatingLabelText='definition'
                    value={ get(this, 'data.communicationRequest.definition[0].text') }
                    onChange={ this.changeState.bind(this, 'definition')}
                    fullWidth
                    /><br/>
                  <TextField
                    id='payloadInput'
                    name='payload'
                    floatingLabelText='payload'
                    value={ get(this, 'data.communicationRequest.payload[0].contentString') }
                    onChange={ this.changeState.bind(this, 'payload')}
                    fullWidth
                    /><br/>
                </Card>
              
              </Grid>
              <Grid item md={4}>
                <Card zDepth={2} style={{padding: '20px', marginBottom: '20px'}}>
                  <TextField
                    id='recipientInput'
                    name='recipient'
                    floatingLabelText='recipient'
                    onChange={ this.changeState.bind(this, 'recipient')}
                    value={ get(this, 'data.communicationRequest.recipient.display', '') }
                    fullWidth
                    /><br/>
                  <TextField
                    id='receivedInput'
                    name='received'
                    floatingLabelText='received'
                    value={ moment(get(this, 'data.communicationRequest.received')).format('YYYY-MM-DD hh:mm:ss') }
                    onChange={ this.changeState.bind(this, 'received')}
                    fullWidth
                    /><br/>
                </Card>
                {/* { this.determineButtons(this.data.communicationRequestId) }   */}
              </Grid>
            </Grid>

        </CardContent>
      </div>
    );
  }
  // determineButtons(communicationRequestId){
  //   if (communicationRequestId) {
  //     return (
  //       <div>
  //         <RaisedButton id='saveCommunicationRequestButton' className='saveCommunicationRequestButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
  //         <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
  //       </div>
  //     );
  //   } else {
  //     return(
  //         <RaisedButton id='saveCommunicationRequestButton'  className='saveCommunicationRequestButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
  //     );
  //   }
  // }

  changeState(field, event, value){
    let communicationRequestUpdate;

    if(process.env.NODE_ENV === "test") console.log("communicationRequestDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new communicationRequest
    if (Session.get('communicationRequestUpsert')) {
      communicationRequestUpdate = Session.get('communicationRequestUpsert');
    } else {
      communicationRequestUpdate = defaultCommunicationRequest;
    }



    // if there's an existing communicationRequest, use them
    if (Session.get('selectedCommunicationRequest')) {
      communicationRequestUpdate = this.data.communicationRequest;
    }

    switch (field) {
      case "subject":
        communicationRequestUpdate.name[0].text = value;
        break;
      case "recipient":
        communicationRequestUpdate.gender = value.toLowerCase();
        break;
      case "sent":
        communicationRequestUpdate.birthDate = value;
        break;
      case "definition":
        communicationRequestUpdate.photo[0].url = value;
        break;
      case "identifier":
        communicationRequestUpdate.identifier[0].value = value;
        break;
      case "category":
        communicationRequestUpdate.identifier[0].value = value;
        break;
        case "payload":
        communicationRequestUpdate.identifier[0].value = value;
        break;
      default:

    }
    // communicationRequestUpdate[field] = value;
    process.env.TRACE && console.log("communicationRequestUpdate", communicationRequestUpdate);

    Session.set('communicationRequestUpsert', communicationRequestUpdate);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let communicationRequestUpdate = Session.get('communicationRequestUpsert', communicationRequestUpdate);


    if (communicationRequestUpdate.birthDate) {
      communicationRequestUpdate.birthDate = new Date(communicationRequestUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("communicationRequestUpdate", communicationRequestUpdate);

    if (Session.get('selectedCommunicationRequest')) {
      if(process.env.NODE_ENV === "test") console.log("Updating communicationRequest...");

      delete communicationRequestUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      communicationRequestUpdate.resourceType = 'CommunicationRequest';

      CommunicationRequests.update({_id: Session.get('selectedCommunicationRequest')}, {$set: communicationRequestUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("CommunicationRequests.insert[error]", error);
          //Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CommunicationRequests", recordId: Session.get('selectedCommunicationRequest')});
          Session.set('communicationRequestUpdate', defaultCommunicationRequest);
          Session.set('communicationRequestUpsert', defaultCommunicationRequest);
          Session.set('communicationRequestPageTabIndex', 1);
          //Bert.alert('CommunicationRequest added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new communicationRequest...", communicationRequestUpdate);

      CommunicationRequests.insert(communicationRequestUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('CommunicationRequests.insert[error]', error);
          //Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CommunicationRequests", recordId: result});
          Session.set('communicationRequestPageTabIndex', 1);
          Session.set('selectedCommunicationRequest', false);
          Session.set('communicationRequestUpsert', false);
          //Bert.alert('CommunicationRequest added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('communicationRequestPageTabIndex', 1);
  }

  handleDeleteButton(){
    CommunicationRequests.remove({_id: Session.get('selectedCommunicationRequest')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('CommunicationRequests.insert[error]', error);
        //Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "CommunicationRequests", recordId: Session.get('selectedCommunicationRequest')});
        Session.set('communicationRequestUpdate', defaultCommunicationRequest);
        Session.set('communicationRequestUpsert', defaultCommunicationRequest);
        Session.set('communicationRequestPageTabIndex', 1);
        //Bert.alert('CommunicationRequest removed!', 'success');
      }
    });
  }
}


ReactMixin(CommunicationRequestDetail.prototype, ReactMeteorData);

export default CommunicationRequestDetail;