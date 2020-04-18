
import { 
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Typography,
  TextField
} from '@material-ui/core';

// import { Bert } from 'meteor/clinical:alert';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';
import { get, set } from 'lodash';

let defaultMedicationRequest = {
  "resourceType": "MedicationRequest",
  "patient": {
    "reference": "",
    "display": ""
  },
  "asserter": {
    "reference": "",
    "display": ""
  },
  "dateRecorded": "",
  "code": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "",
        "display": ""
      }
    ]
  },
  "clinicalStatus": "",
  "verificationStatus": "confirmed",
  "severity": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "",
        "display": ""
      }
    ]
  },
  "onsetDateTime": "",
  "evidence": [
    {
      "detail": [
        {
          "reference": "",
          "display": ""
        }
      ]
    }
  ]
};



Session.setDefault('medicationRequestUpsert', false);
Session.setDefault('selectedMedicationRequest', false);


export class MedicationRequestDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observationId: false,
      observation: {
        "resourceType": "MedicationRequest",
        "patient": {
          "reference": "",
          "display": ""
        },
        "asserter": {
          "reference": "",
          "display": ""
        },
        "dateRecorded": "",
        "code": {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "",
              "display": ""
            }
          ]
        },
        "clinicalStatus": "",
        "verificationStatus": "confirmed",
        "severity": {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "",
              "display": ""
            }
          ]
        },
        "onsetDateTime": "",
        "evidence": [
          {
            "detail": [
              {
                "reference": "",
                "display": ""
              }
            ]
          }
        ]
      },
      form: {
        dateWritten: '',
        disageInstruction: '',
        medicationCode: '',
        note: '',
        patient: '',
        prescriber: '',
        status: ''        
      }
    }
  }
  dehydrateFhirResource(observation) {
    let formData = Object.assign({}, this.state.form);

    formData.dateWritten = get(observation, 'dateWritten')
    formData.disageInstruction = get(observation, 'disageInstruction[0].text')
    formData.medicationCode = get(observation, 'medicationCode.text')
    formData.note = get(observation, 'note')
    formData.patient = get(observation, 'patient.display')
    formData.prescriber = get(observation, 'prescriber.display')
    formData.status = get(observation, 'status')

    return formData;
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('MedicationRequestDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // received an observation from the table; okay lets update again
    if(nextProps.medicationRequestId !== this.state.medicationRequestId){

      if(nextProps.medicationRequest){
        this.setState({medicationRequest: nextProps.medicationRequest})     
        this.setState({form: this.dehydrateFhirResource(nextProps.medicationRequest)})       
      }

      this.setState({medicationRequestId: nextProps.medicationRequestId})      
      shouldUpdate = true;
    }

    // both false; don't take any more updates
    if(nextProps.medicationRequest === this.state.medicationRequest){
      shouldUpdate = false;
    }
    
    return shouldUpdate;
  }


  getMeteorData() {
    let data = {
      medicationRequestId:  this.props.medicationRequestId,
      medicationRequest: false,
      form: this.state.form,
      displayDatePicker: false
    };

    if(this.props.displayDatePicker){
      data.displayDatePicker = this.props.displayDatePicker
    }
    
    if(this.props.medicationRequest){
      data.medicationRequest = this.props.medicationRequest;
      data.form = this.dehydrateFhirResource(this.props.medicationRequest);
    }

    // if (Session.get('medicationRequestUpsert')) {
    //   data.medicationRequest = Session.get('medicationRequestUpsert');
    // } else {
    //   if (Session.get('selectedMedicationRequest')) {
    //     data.medicationRequestId = Session.get('selectedMedicationRequest');
    //     console.log("selectedMedicationRequest", Session.get('selectedMedicationRequest'));

    //     let selectedMedicationRequest = MedicationRequests.findOne({_id: Session.get('selectedMedicationRequest')});
    //     console.log("selectedMedicationRequest", selectedMedicationRequest);

    //     if (selectedMedicationRequest) {
    //       data.medicationRequest = selectedMedicationRequest;
    //     }
    //   } else {
    //     data.medicationRequest = defaultMedicationRequest;
    //   }

    // }

    console.log('MedicationRequestDetail[data]', data);
    return data;
  }
  setHint(text){
    if(this.props.showHints !== false){
      return text;
    } else {
      return '';
    }
  }
  render() {
    return (
      <div id={this.props.id} className="medicationRequestDetail">
        <CardContent>
          {/* <TextField
            id='patientDisplayInput'
            ref='patientDisplay'
            name='patientDisplay'
            floatingLabelText='Patient'
            value={this.data.medicationRequest.patient ? this.data.medicationRequest.patient.display : ''}
            onChange={ this.changeState.bind(this, 'patientDisplay')}
            fullWidth
            /><br/>
          <TextField
            id='asserterDisplayInput'
            ref='asserterDisplay'
            name='asserterDisplay'
            floatingLabelText='Asserter'
            value={this.data.medicationRequest.asserter ? this.data.medicationRequest.asserter.display : ''}
            onChange={ this.changeState.bind(this, 'asserterDisplay')}
            fullWidth
            /><br/>
          <TextField
            id='clinicalStatusInput'
            ref='clinicalStatus'
            name='clinicalStatus'
            floatingLabelText='Clinical Status'
            value={this.data.medicationRequest.clinicalStatus ? this.data.medicationRequest.clinicalStatus : ''}
            onChange={ this.changeState.bind(this, 'clinicalStatus')}
            fullWidth
            /><br/>
          <TextField
            id='snomedCodeInput'
            ref='snomedCode'
            name='snomedCode'
            floatingLabelText='SNOMED Code'
            value={this.data.medicationRequest.code.coding[0] ? this.data.medicationRequest.code.coding[0].code : ''}
            onChange={ this.changeState.bind(this, 'snomedCode')}
            fullWidth
            /><br/>
          <TextField
            id='snomedDisplayInput'
            ref='snomedDisplay'
            name='snomedDisplay'
            floatingLabelText='SNOMED Display'
            value={this.data.medicationRequest.code.coding[0] ? this.data.medicationRequest.code.coding[0].display : ''}
            onChange={ this.changeState.bind(this, 'snomedDisplay')}
            fullWidth
            /><br/>
          <TextField
            id='evidenceDisplayInput'
            ref='evidenceDisplay'
            name='evidenceDisplay'
            floatingLabelText='Evidence (Observation)'
            value={this.data.medicationRequest.evidence[0].detail[0] ? this.data.medicationRequest.evidence[0].detail[0].display : ''}
            onChange={ this.changeState.bind(this, 'evidenceDisplay')}
            fullWidth
            /><br/> */}




        </CardContent>
        <CardActions>
          { this.determineButtons(this.data.medicationRequestId) }
        </CardActions>
      </div>
    );
  }


  determineButtons(medicationRequestId){
    if (medicationRequestId) {
      return (
        <div>
          <Button id="saveMedicationRequestButton" color="primary"  onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
          <Button id="deleteMedicationRequestButton" onClick={this.handleDeleteButton.bind(this)} >Delete</Button>
        </div>
      );
    } else {
      return(
        <Button id="saveMedicationRequestButton" color="primary" onClick={this.handleSaveButton.bind(this)} >Save</Button>
      );
    }
  }



  // this could be a mixin
  changeState(field, event, value){
    let medicationRequestUpdate;

    if(process.env.NODE_ENV === "test") console.log("MedicationRequestDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new medicationRequest
    if (Session.get('medicationRequestUpsert')) {
      medicationRequestUpdate = Session.get('medicationRequestUpsert');
    } else {
      medicationRequestUpdate = defaultMedicationRequest;
    }



    // if there's an existing medicationRequest, use them
    if (Session.get('selectedMedicationRequest')) {
      medicationRequestUpdate = this.data.medicationRequest;
    }

    switch (field) {
      case "patientDisplay":
        medicationRequestUpdate.patient.display = value;
        break;
      case "asserterDisplay":
        medicationRequestUpdate.asserter.display = value;
        break;
      case "clinicalStatus":
        medicationRequestUpdate.clinicalStatus = value;
        break;
      case "snomedCode":
        medicationRequestUpdate.code.coding[0].code = value;
        break;
      case "snomedDisplay":
        medicationRequestUpdate.code.coding[0].display = value;
        break;
      case "evidenceDisplay":
        medicationRequestUpdate.evidence[0].detail[0].display = value;
        break;
      default:

    }

    if(process.env.NODE_ENV === "test") console.log("medicationRequestUpdate", medicationRequestUpdate);
    Session.set('medicationRequestUpsert', medicationRequestUpdate);
  }

  handleSaveButton(){
    let medicationRequestUpdate = Session.get('medicationRequestUpsert', medicationRequestUpdate);

    if(process.env.NODE_ENV === "test") console.log("medicationRequestUpdate", medicationRequestUpdate);


    if (Session.get('selectedMedicationRequest')) {
      if(process.env.NODE_ENV === "test") console.log("Updating medicationRequest...");
      delete medicationRequestUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      medicationRequestUpdate.resourceType = 'MedicationRequest';

      MedicationRequests.update(
        {_id: Session.get('selectedMedicationRequest')}, {$set: medicationRequestUpdate }, function(error, result) {
          if (error) {
            console.log("error", error);

            // Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MedicationRequests", recordId: Session.get('selectedMedicationRequest')});
            Session.set('medicationRequestPageTabIndex', 1);
            Session.set('selectedMedicationRequest', false);
            Session.set('medicationRequestUpsert', false);
            // Bert.alert('MedicationRequest updated!', 'success');
          }
        });
    } else {

      if(process.env.NODE_ENV === "test") console.log("create a new medicationRequest", medicationRequestUpdate);

      MedicationRequests.insert(medicationRequestUpdate, function(error, result) {
        if (error) {
          console.log("error", error);
          // Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MedicationRequests", recordId: result});
          Session.set('medicationRequestPageTabIndex', 1);
          Session.set('selectedMedicationRequest', false);
          Session.set('medicationRequestUpsert', false);
          // Bert.alert('MedicationRequest added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('medicationRequestPageTabIndex', 1);
  }

  handleDeleteButton(){
    MedicationRequest.remove({_id: Session.get('selectedMedicationRequest')}, function(error, result){
      if (error) {
        // Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MedicationRequests", recordId: Session.get('selectedMedicationRequest')});
        Session.set('medicationRequestPageTabIndex', 1);
        Session.set('selectedMedicationRequest', false);
        Session.set('medicationRequestUpsert', false);
        // Bert.alert('MedicationRequest removed!', 'success');
      }
    });
  }
}


MedicationRequestDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  medicationRequestId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  medicationRequest: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

ReactMixin(MedicationRequestDetail.prototype, ReactMeteorData);
export default MedicationRequestDetail;