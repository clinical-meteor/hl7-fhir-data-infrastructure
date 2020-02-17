
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

let defaultMedicationOrder = {
  "resourceType": "MedicationOrder",
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



Session.setDefault('medicationOrderUpsert', false);
Session.setDefault('selectedMedicationOrder', false);


export class MedicationOrderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observationId: false,
      observation: {
        "resourceType": "MedicationOrder",
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
    process.env.NODE_ENV === "test" && console.log('MedicationOrderDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // received an observation from the table; okay lets update again
    if(nextProps.medicationOrderId !== this.state.medicationOrderId){

      if(nextProps.medicationOrder){
        this.setState({medicationOrder: nextProps.medicationOrder})     
        this.setState({form: this.dehydrateFhirResource(nextProps.medicationOrder)})       
      }

      this.setState({medicationOrderId: nextProps.medicationOrderId})      
      shouldUpdate = true;
    }

    // both false; don't take any more updates
    if(nextProps.medicationOrder === this.state.medicationOrder){
      shouldUpdate = false;
    }
    
    return shouldUpdate;
  }


  getMeteorData() {
    let data = {
      medicationOrderId:  this.props.medicationOrderId,
      medicationOrder: false,
      form: this.state.form,
      displayDatePicker: false
    };

    if(this.props.displayDatePicker){
      data.displayDatePicker = this.props.displayDatePicker
    }
    
    if(this.props.medicationOrder){
      data.medicationOrder = this.props.medicationOrder;
      data.form = this.dehydrateFhirResource(this.props.medicationOrder);
    }

    // if (Session.get('medicationOrderUpsert')) {
    //   data.medicationOrder = Session.get('medicationOrderUpsert');
    // } else {
    //   if (Session.get('selectedMedicationOrder')) {
    //     data.medicationOrderId = Session.get('selectedMedicationOrder');
    //     console.log("selectedMedicationOrder", Session.get('selectedMedicationOrder'));

    //     let selectedMedicationOrder = MedicationOrders.findOne({_id: Session.get('selectedMedicationOrder')});
    //     console.log("selectedMedicationOrder", selectedMedicationOrder);

    //     if (selectedMedicationOrder) {
    //       data.medicationOrder = selectedMedicationOrder;
    //     }
    //   } else {
    //     data.medicationOrder = defaultMedicationOrder;
    //   }

    // }

    console.log('MedicationOrderDetail[data]', data);
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
      <div id={this.props.id} className="medicationOrderDetail">
        <CardContent>
          {/* <TextField
            id='patientDisplayInput'
            ref='patientDisplay'
            name='patientDisplay'
            floatingLabelText='Patient'
            value={this.data.medicationOrder.patient ? this.data.medicationOrder.patient.display : ''}
            onChange={ this.changeState.bind(this, 'patientDisplay')}
            fullWidth
            /><br/>
          <TextField
            id='asserterDisplayInput'
            ref='asserterDisplay'
            name='asserterDisplay'
            floatingLabelText='Asserter'
            value={this.data.medicationOrder.asserter ? this.data.medicationOrder.asserter.display : ''}
            onChange={ this.changeState.bind(this, 'asserterDisplay')}
            fullWidth
            /><br/>
          <TextField
            id='clinicalStatusInput'
            ref='clinicalStatus'
            name='clinicalStatus'
            floatingLabelText='Clinical Status'
            value={this.data.medicationOrder.clinicalStatus ? this.data.medicationOrder.clinicalStatus : ''}
            onChange={ this.changeState.bind(this, 'clinicalStatus')}
            fullWidth
            /><br/>
          <TextField
            id='snomedCodeInput'
            ref='snomedCode'
            name='snomedCode'
            floatingLabelText='SNOMED Code'
            value={this.data.medicationOrder.code.coding[0] ? this.data.medicationOrder.code.coding[0].code : ''}
            onChange={ this.changeState.bind(this, 'snomedCode')}
            fullWidth
            /><br/>
          <TextField
            id='snomedDisplayInput'
            ref='snomedDisplay'
            name='snomedDisplay'
            floatingLabelText='SNOMED Display'
            value={this.data.medicationOrder.code.coding[0] ? this.data.medicationOrder.code.coding[0].display : ''}
            onChange={ this.changeState.bind(this, 'snomedDisplay')}
            fullWidth
            /><br/>
          <TextField
            id='evidenceDisplayInput'
            ref='evidenceDisplay'
            name='evidenceDisplay'
            floatingLabelText='Evidence (Observation)'
            value={this.data.medicationOrder.evidence[0].detail[0] ? this.data.medicationOrder.evidence[0].detail[0].display : ''}
            onChange={ this.changeState.bind(this, 'evidenceDisplay')}
            fullWidth
            /><br/> */}




        </CardContent>
        <CardActions>
          { this.determineButtons(this.data.medicationOrderId) }
        </CardActions>
      </div>
    );
  }


  determineButtons(medicationOrderId){
    if (medicationOrderId) {
      return (
        <div>
          <Button id="saveMedicationOrderButton" color="primary"  onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
          <Button id="deleteMedicationOrderButton" onClick={this.handleDeleteButton.bind(this)} >Delete</Button>
        </div>
      );
    } else {
      return(
        <Button id="saveMedicationOrderButton" color="primary" onClick={this.handleSaveButton.bind(this)} >Save</Button>
      );
    }
  }



  // this could be a mixin
  changeState(field, event, value){
    let medicationOrderUpdate;

    if(process.env.NODE_ENV === "test") console.log("MedicationOrderDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new medicationOrder
    if (Session.get('medicationOrderUpsert')) {
      medicationOrderUpdate = Session.get('medicationOrderUpsert');
    } else {
      medicationOrderUpdate = defaultMedicationOrder;
    }



    // if there's an existing medicationOrder, use them
    if (Session.get('selectedMedicationOrder')) {
      medicationOrderUpdate = this.data.medicationOrder;
    }

    switch (field) {
      case "patientDisplay":
        medicationOrderUpdate.patient.display = value;
        break;
      case "asserterDisplay":
        medicationOrderUpdate.asserter.display = value;
        break;
      case "clinicalStatus":
        medicationOrderUpdate.clinicalStatus = value;
        break;
      case "snomedCode":
        medicationOrderUpdate.code.coding[0].code = value;
        break;
      case "snomedDisplay":
        medicationOrderUpdate.code.coding[0].display = value;
        break;
      case "evidenceDisplay":
        medicationOrderUpdate.evidence[0].detail[0].display = value;
        break;
      default:

    }

    if(process.env.NODE_ENV === "test") console.log("medicationOrderUpdate", medicationOrderUpdate);
    Session.set('medicationOrderUpsert', medicationOrderUpdate);
  }

  handleSaveButton(){
    let medicationOrderUpdate = Session.get('medicationOrderUpsert', medicationOrderUpdate);

    if(process.env.NODE_ENV === "test") console.log("medicationOrderUpdate", medicationOrderUpdate);


    if (Session.get('selectedMedicationOrder')) {
      if(process.env.NODE_ENV === "test") console.log("Updating medicationOrder...");
      delete medicationOrderUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      medicationOrderUpdate.resourceType = 'MedicationOrder';

      MedicationOrders.update(
        {_id: Session.get('selectedMedicationOrder')}, {$set: medicationOrderUpdate }, function(error, result) {
          if (error) {
            console.log("error", error);

            // Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MedicationOrders", recordId: Session.get('selectedMedicationOrder')});
            Session.set('medicationOrderPageTabIndex', 1);
            Session.set('selectedMedicationOrder', false);
            Session.set('medicationOrderUpsert', false);
            // Bert.alert('MedicationOrder updated!', 'success');
          }
        });
    } else {

      if(process.env.NODE_ENV === "test") console.log("create a new medicationOrder", medicationOrderUpdate);

      MedicationOrders.insert(medicationOrderUpdate, function(error, result) {
        if (error) {
          console.log("error", error);
          // Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MedicationOrders", recordId: result});
          Session.set('medicationOrderPageTabIndex', 1);
          Session.set('selectedMedicationOrder', false);
          Session.set('medicationOrderUpsert', false);
          // Bert.alert('MedicationOrder added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('medicationOrderPageTabIndex', 1);
  }

  handleDeleteButton(){
    MedicationOrder.remove({_id: Session.get('selectedMedicationOrder')}, function(error, result){
      if (error) {
        // Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MedicationOrders", recordId: Session.get('selectedMedicationOrder')});
        Session.set('medicationOrderPageTabIndex', 1);
        Session.set('selectedMedicationOrder', false);
        Session.set('medicationOrderUpsert', false);
        // Bert.alert('MedicationOrder removed!', 'success');
      }
    });
  }
}


MedicationOrderDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  medicationOrderId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  medicationOrder: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

ReactMixin(MedicationOrderDetail.prototype, ReactMeteorData);
export default MedicationOrderDetail;