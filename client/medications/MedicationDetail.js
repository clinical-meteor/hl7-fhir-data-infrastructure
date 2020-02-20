import { 
  Grid,
  Card,
  Button,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  DatePicker
} from '@material-ui/core';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';
import { get, set } from 'lodash';


export class MedicationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medicationId: false,
      dstu2: {
        resourceType: 'Medication',
        code: {
          coding: [{
            system: "http://hl7.org/fhir/sid/ndc",
            code: "",
            display: ""
          }]
        },
        isBrand: true,
        manufacturer: {
          display: '',
          reference: ''
        },
        product: {
          form: {
            coding: [{
              system: "http://hl7.org/fhir/sid/ndc",
              code: "",
              display: ""
            }],
          },
          ingredient: [{
            item: {
              display: ''
            }
          }]
        },
        package: {
          container: {
            text: 'bottle'
          },
          content: [{
            amount: {
              value: 30,
              unit: 'tablet'
            }
          }]
        }
      },
      form: {
        code: '',
        name: '',
        form: '',
        activeIngredient: '',
        activeIngredientDescription: '',
        amount: '',
        manufacturer: ''
      }
    }
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('MedicationDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.medication === this.state.dstu2){
      shouldUpdate = false;
    }

    // received an medication from the table; okay lets update again
    if(nextProps.medicationId !== this.state.medicationId){
      this.setState({medicationId: nextProps.medicationId})
      
      if(nextProps.medication){
        this.setState({dstu2: nextProps.medication})     
        this.setState({form: this.dehydrateFhirResource(nextProps.medication)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }
  dehydrateFhirResource(medication) {
    let formData = Object.assign({}, this.state.form);

    // explicitely opt into the latest
    if(this.props.fhirVersion === '3.0.1'){
      formData.code = get(medication, 'code.coding[0].code');
      formData.name = get(medication, 'code.coding[0].display');  
      formData.form = get(medication, 'form.coding[0].display');
      formData.amount = get(medication, 'package.content[0].amount.value');
      formData.activeIngredient = get(medication, 'ingredient[0].coding[0].display');
      formData.manufacturer = get(medication, 'manufacturer.display');
    } else {
      // otherwise default to v1.0.2
      formData.code = get(medication, 'code.coding[0].code');
      formData.name = get(medication, 'code.coding[0].display');
      formData.form = get(medication, 'product.form.coding[0].display');
      formData.amount = get(medication, 'package.content[0].amount.value');
      formData.activeIngredient = get(medication, 'product.ingredient[0].item.display');
      formData.manufacturer = get(medication, 'manufacturer.display');
    }

    return formData;
  }
  getMeteorData() {
    let data = {
      medicationId: this.state.medicationId,
      medication: false,
      form: this.state.form
    };

    if(this.props.medication){
      data.medication = this.props.medication;
    }

    return data;
  }


  render() {
    if(process.env.NODE_ENV === "test") console.log('MedicationDetail.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="medicationDetail">
        <CardContent>

        <Grid container spacing={3}>
            <Grid item md={4}>  
              <TextField
                id='medicationCodeInput'
                ref='code'
                name='code'
                floatingLabelText='National Drug Code'
                value={ get(formData, 'code') }
                onChange={ this.changeState.bind(this, 'code')}
                hintText='0280-6000'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
              <a href='https://www.accessdata.fda.gov/scripts/cder/ndc/index.cfm' target="_blank">National Drug Code Directory</a>
            </Grid>
            <Grid item md={4}>
              <TextField
                id='medicationNameInput'
                ref='name'
                name='name'
                floatingLabelText='Medication Name'
                value={ get(formData, 'name') }
                onChange={ this.changeState.bind(this, 'name')}
                hintText='Aleve'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={4}>
              <TextField
                id='manufacturerDisplayInput'
                ref='manufacturer'
                name='manufacturer'
                floatingLabelText='Manufacturer'
                value={ get(formData, 'manufacturer') }
                onChange={ this.changeState.bind(this, 'manufacturer')}
                hintText='Bayer HealthCare LLC.'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={4}>
              <TextField
                id='activeIngredientInput'
                ref='activeIngredient'
                name='activeIngredient'
                floatingLabelText='Active Ingredient'
                value={ get(formData, 'activeIngredient') }
                onChange={ this.changeState.bind(this, 'activeIngredient')}
                hintText='NAPROXEN SODIUM'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={8}>  
              <TextField
                id='activeIngredientDescriptionInput'
                ref='activeIngredientDescription'
                name='activeIngredientDescription'
                floatingLabelText='Active Ingredient Description'
                value={ get(formData, 'activeIngredientDescription') }
                onChange={ this.changeState.bind(this, 'activeIngredientDescription')}
                floatingLabelFixed={true}
                disabled
                fullWidth
                /><br/>
            </Grid>            
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={2}>
              <TextField
                id='amountInput'
                ref='amount'
                name='amount'
                floatingLabelText='Amount'
                value={ get(formData, 'amount') }
                onChange={ this.changeState.bind(this, 'amount')}
                floatingLabelFixed={true}
                hintText='40'
                fullWidth
                /><br/>
            </Grid>
            <Grid item md={2}>
              <TextField
                id='medicationFormInput'
                ref='form'
                name='form'
                floatingLabelText='Substance Form'
                value={ get(formData, 'form') }
                onChange={ this.changeState.bind(this, 'form')}
                hintText='Capsules'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          { this.determineButtons(this.state.medicationId) }
        </CardActions>
      </div>
    );
  }


  determineButtons(medicationId){
    if (medicationId) {
      return (
        <div>
          <Button id="updateMedicationButton" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
          <Button id="deleteMedicationButton" onClick={this.handleDeleteButton.bind(this)} >Delete</Button>
        </div>
      );
    } else {
      return(
        <Button id="saveMedicationButton" primary={true} onClick={this.handleSaveButton.bind(this)} >Save</Button>
      );
    }
  }

  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("MedicationDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "code":
        set(formData, 'code', textValue)
        break;
      case "name":
        set(formData, 'name', textValue)
        break;
      case "form":
        set(formData, 'form', textValue)
        break;        
      case "activeIngredient":
        set(formData, 'activeIngredient', textValue)
        break;        
      case "activeIngredientDescription":
        set(formData, 'activeIngredientDescription', textValue)
        break;
      case "amount":
        set(formData, 'amount', textValue)
        break;
      case "manufacturer":
        set(formData, 'manufacturer', textValue)
        break;
      default:
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateMedication(medicationData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("MedicationDetail.updateMedication", medicationData, field, textValue);

    switch (field) {
      case "code":
        set(medicationData, 'code.coding[0].code', textValue)
        break;
      case "name":
        set(medicationData, 'code.coding[0].display', textValue)
        break;
      case "form":
        set(medicationData, 'product.form.coding[0].display', textValue)
        break;        
      case "activeIngredient":
        set(medicationData, 'product.ingredient[0].item.display', textValue)
        break;        
      case "activeIngredientDescription":
        // set(medicationData, 'identifier[0].value', textValue)
        break;
      case "amount":
        set(medicationData, 'package.content[0].amount.value', textValue)
        break;
      case "manufacturer":
        set(medicationData, 'manufacturer.display', textValue)
        break;
    }
    return medicationData;
  }
  componentDidUpdate(props){
    if(process.env.NODE_ENV === "test") console.log('MedicationDetail.componentDidUpdate()', props, this.state)
  }

  changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("MedicationDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let medicationData = Object.assign({}, this.state.dstu2);

    formData = this.updateFormData(formData, field, textValue);
    medicationData = this.updateMedication(medicationData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("medicationData", medicationData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({dstu2: medicationData})
    this.setState({form: formData})
  }


  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Medication...', this.state)

    let self = this;
    let fhirMedicationData = Object.assign({}, this.state.dstu2);

    if(process.env.NODE_ENV === "test") console.log('fhirMedicationData', fhirMedicationData);

    let medicationValidator = MedicationSchema.newContext();
    medicationValidator.validate(fhirMedicationData)

    console.log('IsValid: ', medicationValidator.isValid())
    console.log('ValidationErrors: ', medicationValidator.validationErrors());

    if (this.state.medicationId) {
      if(process.env.NODE_ENV === "test") console.log("Update Medication");
      delete fhirMedicationData._id;

      Medications._collection.update(
        {_id: this.state.medicationId}, {$set: fhirMedicationData }, function(error, result) {
          if (error) {
            console.log("error", error);
            // Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Medications", recordId: self.state.medicationId});
            Session.set('medicationPageTabIndex', 1);
            Session.set('selectedMedication', false);
            Session.set('medicationUpsert', false);
            // Bert.alert('Medication updated!', 'success');
          }
        });
    } else {

      if(process.env.NODE_ENV === "test") console.log("create a new medication", fhirMedicationData);

      Medications._collection.insert(fhirMedicationData, function(error, result) {
        if (error) {
          // Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Medications", recordId: self.state.medicationId});
          Session.set('medicationPageTabIndex', 1);
          Session.set('selectedMedication', false);
          // Bert.alert('Medication added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('medicationPageTabIndex', 1);
  }

  handleDeleteButton(){
    let self = this;
    Medications._collection.remove({_id: this.state.medicationId}, function(error, result){
      if (error) {
        // Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Medications", recordId: self.state.medicationId});
        Session.set('medicationPageTabIndex', 1);
        Session.set('selectedMedication', false);
        // Bert.alert('Medication deleted!', 'success');
      }
    })
  }
}


MedicationDetail.propTypes = {
  id: PropTypes.string,
  medicationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  medication: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
ReactMixin(MedicationDetail.prototype, ReactMeteorData);
export default MedicationDetail;