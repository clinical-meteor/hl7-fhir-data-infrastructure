// // =======================================================================
// // Using DSTU2  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// //
// // https://www.hl7.org/fhir/DSTU2/medicationstatement.html
// //
// //
// // =======================================================================


// import { 
//   Grid,
//   Card,
//   Button,
//   CardHeader,
//   CardContent,
//   CardActions,
//   Typography,
//   TextField,
//   DatePicker
// } from '@material-ui/core';

// import { get, has, set } from 'lodash';

// import React from 'react';
// import { useTracker } from 'meteor/react-meteor-data';

// import PropTypes from 'prop-types';
// import { moment } from 'moment';

// import { medicationStatement2, medicationStatement3 } from '../../lib/templates/defaultMedicationStatements';

// Session.setDefault('originalMedicationStatement', false);

// export class MedicationStatementDetail extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       medicationStatementId: false,
//       stu: medicationStatement3,
//       dstu2: medicationStatement2,
//       form: {
//         basedOn: "",
//         status: '',
//         effectiveDateTime: "",
//         dateAsserted: "",
//         informationSourceReference: "",
//         informationSourceDisplay: "",
//         subjectDisplay: "",
//         subjectReference: "",
//         taken: "",
//         reasonCodeDisplay: "",
//         reasonCode: "",
//         dosage: "",
//         medicationReference: '',
//         medicationDisplay: '',
//         clinicalNote: ''
//       }
//     }
//   }
//   shouldComponentUpdate(nextProps){
//     process.env.NODE_ENV === "test" && console.log('MedicationDetail.shouldComponentUpdate()', nextProps, this.state)
//     let shouldUpdate = true;

//     // both false; don't take any more updates
//     if(nextProps.medicationStatement === this.state.dstu2){
//       shouldUpdate = false;
//     }

//     // received an medicationStatement from the table; okay lets update again
//     if(nextProps.medicationStatementId !== this.state.medicationStatementId){

//       this.setState({medicationStatementId: nextProps.medicationStatementId});
      
//       if(nextProps.medicationStatement){
//         this.setState({form: this.dehydrateFhirResource(nextProps.medicationStatement)})       

//         if(this.props.fhirVersion === "v3.0.1"){
//           this.setState({stu: nextProps.medicationStatement})     
//         }
//         if(this.props.fhirVersion === "v1.0.2"){
//           this.setState({dstu2: nextProps.medicationStatement})     
//         }
//       }
//       shouldUpdate = true;
//     }
 
//     return shouldUpdate;
//   }

//   dehydrateFhirResource(statement) {
//     let formData = Object.assign({}, this.state.form);

//     // STU3
//     if(this.props.fhirVersion === 'v3.0.1'){
//       formData.basedOn = get(statement, 'basedOn[0].display')
//       formData.effectiveDateTime = get(statement, 'effectiveDateTime')    
//       formData.dateAsserted = get(statement, 'dateAsserted')
//       formData.informationSourceReference = get(statement, 'informationSource.reference')
//       formData.informationSourceDisplay = get(statement, 'informationSource.display')
//       formData.subjectDisplay = get(statement, 'subject.display')
//       formData.subjectReference = get(statement, 'subject.reference')
//       formData.taken = get(statement, 'taken')
//       formData.reasonCodeDisplay = get(statement, 'reasonCode[0].coding[0].display')
//       formData.reasonCode = get(statement, 'reasonCode[0].coding[0].code')
//       formData.dosage = get(statement, 'dosage[0].text')
//       formData.medicationReference = get(statement, 'medicationReference.reference')
//       formData.medicationDisplay = get(statement, 'medicationReference.display')
//       formData.clinicalNote = get(statement, 'note[0].text')
//       formData.status = get(statement, 'status')
//     }

//     // DSTU2
//     if(this.props.fhirVersion === 'v1.0.2'){
//       formData.effectiveDateTime = get(statement, 'effectiveDateTime')    
//       formData.dateAsserted = get(statement, 'dateAsserted')
//       formData.informationSourceReference = get(statement, 'supportingInformation[0].reference')
//       formData.informationSourceDisplay = get(statement, 'supportingInformation[0].display')
//       formData.subjectDisplay = get(statement, 'patient.display')
//       formData.subjectReference = get(statement, 'patient.reference')
//       formData.reasonCodeDisplay = get(statement, 'reasonForUseCodeableConcept.coding[0].display')
//       formData.reasonCode = get(statement, 'reasonForUseCodeableConcept.coding[0].code')
//       formData.dosage = get(statement, 'dosage[0].text')
//       formData.medicationReference = get(statement, 'medicationReference.reference')
//       formData.medicationDisplay = get(statement, 'medicationReference.display')
//       formData.clinicalNote = get(statement, 'note[0].text')
//       formData.status = get(statement, 'status')
//     }

//     return formData;
//   }



//   getMeteorData() {
//     let data = {
//       medicationStatementId: this.state.medicationStatementId,
//       medicationStatement: false,
//       form: this.props.form
//     };

//     if(this.props.medicationStatement){
//       data.medicationStatement = this.props.medicationStatement;
//     }


//     // if (this.state.medicationStatementId) {
//     //   data.medicationStatementId = this.state.medicationStatementId;
//     //   console.log("selectedMedicationStatementId", this.state.medicationStatementId);

//     //   data.medicationStatement = MedicationStatements.findOne({_id: this.state.medicationStatementId});
//     //   console.log("selectedMedicationStatementId", data.medicationStatement);

//     // } else {
//     //   data.medicationStatementForm = defaultMedicationStatementForm;
//     //   data.medicationStatement = defaultMedicationStatement;
//     // }    
    

//     // // if(has(data.medicationStatement, 'medicationReference.display')){
//     //   data.medicationStatementForm.medicationDisplay = get(data.medicationStatement, 'medicationReference.display', '');
//     // // } 
//     // // if(has(data.medicationStatement, 'medicationReference.reference')){
//     //   data.medicationStatementForm.medicationReference = get(data.medicationStatement, 'medicationReference.reference', '');
//     // // } 

//     // // if(has(data.medicationStatement, 'identifier[0].value')){
//     //   data.medicationStatementForm.identifier = get(data.medicationStatement, 'identifier[0].value', '');
//     // // }        

//     // // if(has(data.medicationStatement, 'effectiveDateTime')){
//     //   data.medicationStatementForm.effectiveDateTime = moment(get(data.medicationStatement, 'effectiveDateTime')).format("YYYY-MM-DD");
//     // // }        

//     // // if(has(data.medicationStatement, 'dateAsserted')){
//     //   data.medicationStatementForm.dateAsserted = moment(get(data.medicationStatement, 'dateAsserted')).format("YYYY-MM-DD");
//     // // }        

//     // // if(has(data.medicationStatement, 'subject.display')){
//     //   data.medicationStatementForm.subjectDisplay = get(data.medicationStatement, 'subject.display', '');
//     // // }        
//     // // if(has(data.medicationStatement, 'subject.reference')){
//     //   data.medicationStatementForm.subjectReference = get(data.medicationStatement, 'subject.reference', '');
//     // // }        

//     // // if(has(data.medicationStatement, 'informationSource.display')){
//     //   data.medicationStatementForm.informationSourceDisplay = get(data.medicationStatement, 'informationSource.display', '');
//     // // }        
//     // // if(has(data.medicationStatement, 'informationSource.reference')){
//     //   data.medicationStatementForm.informationSourceReference = get(data.medicationStatement, 'informationSource.reference', '');
//     // // }        

//     // // if(has(data.medicationStatement, 'taken')){
//     //   data.medicationStatementForm.taken = get(data.medicationStatement, 'taken', 'y');
//     // // }        

//     // // if(has(data.medicationStatement, 'reasonCode[0].coding[0].display')){
//     //   data.medicationStatementForm.reasonCodeDisplay = get(data.medicationStatement, 'reasonCode[0].coding[0].display', '');
//     // // }  
//     // // if(has(data.medicationStatement, 'reasonCode[0].coding[0].code')){
//     //   data.medicationStatementForm.reasonCode = get(data.medicationStatement, 'reasonCode[0].coding[0].code', '');
//     // // }  
//     // // if(has(data.medicationStatement, 'note[0].text')){
//     //   data.medicationStatementForm.clinicalNote = get(data.medicationStatement, 'note[0].text', '');
//     // // }     
    
//     // // if (Session.get('medicationStatementFormUpsert')) {
//     //   data.medicationStatementForm = Session.get('medicationStatementFormUpsert');
//     // // } 

//     console.log('MedicationStatementDetail[data]', data);
//     return data;
//   }

//   render() {
//     if(process.env.NODE_ENV === "test") console.log('MedicationDetail.render()', this.state)
//     let formData = this.state.form;

//     return (
//       <div id={this.props.id} className="medicationStatementDetail">
//         <CardContent>
//             {/* <DatePicker
//               id='dateAssertedInput'
//               name='dateAsserted'
//               label='Date Asserted'
//               container="inline" 
//               mode="landscape"
//               value={ get(formData, 'dateAsserted') }
//               onChange={ this.changeState.bind(this, 'dateAsserted')}
//               //floatingLabelFixed={true}
//               /><br/>    */}

//           <Grid container spacing={3}>
//             <Grid item md={8}>          
//               <TextField
//                 id='subjectDisplayInput'
//                 name='subjectDisplay'
//                 label='Patient - Display'
//                 value={ get(formData, 'subjectDisplay') }
//                 onChange={ this.changeState.bind(this, 'subjectDisplay')}
//                 // hintText="Jane Doe"
//                 fullWidth
//                 //floatingLabelFixed={true}
//                 /><br/>
//             </Grid>
//             <Grid item md={4} >
//               <TextField
//                 id='subjectReferenceInput'
//                 name='subjectReference'
//                 label='Patient - Reference'
//                 value={ get(formData, 'subjectReference') }
//                 onChange={ this.changeState.bind(this, 'subjectReference')}
//                 // hintText="Patient/12345"
//                 fullWidth
//                 //floatingLabelFixed={true}
//                 /><br/>         
//             </Grid>
//           </Grid>


//           <Grid container spacing={3}>
//             <Grid item md={8}>     
//               <TextField
//                 id='medicationDisplayInput'
//                 name='medicationDisplay'
//                 label='Medication - Display'
//                 value={ get(formData, 'medicationDisplay') }
//                 onChange={ this.changeState.bind(this, 'medicationDisplay')}
//                 //floatingLabelFixed={true}
//                 // hintText="Aleve - Naproxene Sodium"
//                 fullWidth
//                 /><br/>               
//             </Grid>
//             <Grid item md={4} >
//               <TextField
//                 id='medicationReferenceInput'
//                 name='medicationReference'
//                 label='Medication - Reference'
//                 value={ get(formData, 'medicationReference') }
//                 onChange={ this.changeState.bind(this, 'medicationReference')}
//                 // hintText="Medication/0280-6000"
//                 //floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>     
//             </Grid>
//           </Grid> 
//           <Grid container spacing={3}>
//             <Grid item md={8}>     
//               <TextField
//                 id='informationSourceDisplayInput'
//                 name='informationSourceDisplay'
//                 label='Information Source - Display'
//                 value={ get(formData, 'informationSourceDisplay') }
//                 onChange={ this.changeState.bind(this, 'informationSourceDisplay')}
//                 // hintText="Pain"
//                 fullWidth
//                 //floatingLabelFixed={true}
//                 /><br/>
//             </Grid>
//             <Grid item md={4} >
//               <TextField
//                 id='informationSourceReferenceInput'
//                 name='informationSourceReference'
//                 label='Information Source - Reference'
//                 value={ get(formData, 'informationSourceReference') }
//                 onChange={ this.changeState.bind(this, 'informationSourceReference')}
//                 // hintText="Condition/777"
//                 fullWidth
//                 //floatingLabelFixed={true}
//                 /><br/>   
//             </Grid>
//           </Grid>

//           <Grid container spacing={3}>
//             <Grid item md={8}>     
//               <TextField
//                 id='reasonCodeDisplayInput'
//                 name='reasonCodeDisplay'
//                 label='Reason - Display Text'
//                 value={ get(formData, 'reasonCodeDisplay') }
//                 onChange={ this.changeState.bind(this, 'reasonCodeDisplay')}
//                 // hintText="Pulled Muscle"
//                 //floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>   
//             </Grid>
//             <Grid item md={4} >
//               <TextField
//                 id='reasonCodeInput'
//                 name='reasonCode'
//                 label='Reason - Code Value'
//                 value={ get(formData, 'reasonCode') }
//                 onChange={ this.changeState.bind(this, 'reasonCode')}
//                 // hintText="Observation/12345"
//                 //floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>   
//             </Grid>
//           </Grid>

//           <Grid container spacing={3}>
//             {/* <Grid item md={2} >
//               <TextField
//                 id='takenInput'
//                 name='taken'
//                 label='Medication Taken'
//                 value={ get(formData, 'taken') }
//                 onChange={ this.changeState.bind(this, 'taken')}
//                 fullWidth
//                 /><br/>   
//             </Grid> */}
//             <Grid item md={6} >
//               <DatePicker
//                 id='effectiveDateTimeInput'
//                 name='effectiveDateTime'
//                 label='Effective Date/Time'
//                 container="inline" 
//                 mode="landscape"
//                 value={ get(formData, 'effectiveDateTime') }
//                 onChange={ this.changeState.bind(this, 'effectiveDateTime')}
//                 //floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>   
//             </Grid>
//           </Grid>

//           <TextField
//             id='clinicalNoteInput'
//             name='clinicalNote'
//             label='Clinical Note'
//             value={ get(formData, 'clinicalNote') }
//             onChange={ this.changeState.bind(this, 'clinicalNote')}
//             multiLine={true}
//             rows={5}
//             //floatingLabelFixed={true}
//             fullWidth
//             /><br/>   
//         </CardContent>
//         <CardActions>
//           { this.determineButtons(this.data.medicationStatementId) }
//         </CardActions>
//       </div>
//     );
//   }
//   determineButtons(medicationStatementId){
//     if (medicationStatementId) {
//       return (
//         <div>
//           <Button id="updateMedicationStatementButton" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
//           <Button id="deleteMedicationStatementButton" onClick={this.handleDeleteButton.bind(this)} >Delete</Button>          
//         </div>
//       );
//     } else {
//       return(
//         <Button id="saveMedicationStatementButton" primary={true} onClick={this.handleSaveButton.bind(this)} >Save</Button>
//       );
//     }
//   }


//   updateFormData(formData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("MedicationDetail.updateFormData", formData, field, textValue);

//     switch (field) {
//       case "effectiveDateTime":
//         set(formData, 'effectiveDateTime', textValue)
//         break;
//       case "dateAsserted":
//         set(formData, 'dateAsserted', textValue)
//         break;
//       case "informationSourceReference":
//         set(formData, 'informationSourceReference', textValue)
//         break;        
//       case "informationSourceDisplay":
//         set(formData, 'informationSourceDisplay', textValue)
//         break;        
//       case "subjectDisplay":
//         set(formData, 'subjectDisplay', textValue)
//         break;
//       case "subjectReference":
//         set(formData, 'subjectReference', textValue)
//         break;
//       case "reasonCodeDisplay":
//         set(formData, 'reasonCodeDisplay', textValue)
//         break;
//       case "reasonCode":
//         set(formData, 'reasonCode', textValue)
//         break;
//       case "dosage":
//         set(formData, 'dosage', textValue)
//         break;
//       case "medicationReference":
//         set(formData, 'medicationReference', textValue)
//         break;
//       case "medicationDisplay":
//         set(formData, 'medicationDisplay', textValue)
//         break;
//       case "clinicalNote":
//         set(formData, 'clinicalNote', textValue)
//         break;
//       case "status":
//         set(formData, 'status', textValue)
//         break;
//       default:
//     }

//     if(process.env.NODE_ENV === "test") console.log("formData", formData);
//     return formData;
//   }
//   updateMedicationStatement(medicationStatementData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("MedicationDetail.updateMedication", medicationStatementData, field, textValue);

//     if(this.props.fhirVersion === 'v1.0.2'){
//       switch (field) {
//         case "effectiveDateTime":
//           set(medicationStatementData, 'effectiveDateTime', textValue)
//           break;
//         case "dateAsserted":
//           set(medicationStatementData, 'dateAsserted', textValue)
//           break;
//         case "informationSourceReference":
//           set(medicationStatementData, 'supportingInformation[0].reference', textValue)
//           break;        
//         case "informationSourceDisplay":
//           set(medicationStatementData, 'supportingInformation[0].display', textValue)
//           break;        
//         case "subjectDisplay":
//           set(medicationStatementData, 'patient.display', textValue)
//           break;
//         case "subjectReference":
//           set(medicationStatementData, 'patient.reference', textValue)
//           break;
//         case "reasonCodeDisplay":
//           set(medicationStatementData, 'reasonForUseCodeableConcept.coding[0].display', textValue)
//           break;
//         case "reasonCode":
//           set(medicationStatementData, 'reasonForUseCodeableConcept.coding[0].code', textValue)
//           break;
//         case "dosage":
//           set(medicationStatementData, 'dosage[0].text', textValue)
//           break;
//         case "medicationReference":
//           set(medicationStatementData, 'medicationReference.reference', textValue)
//           break;
//         case "medicationDisplay":
//           set(medicationStatementData, 'medicationReference.display', textValue)
//           break;
//         case "clinicalNote":
//           set(medicationStatementData, 'note[0].text', textValue)
//           break;
//         case "status":
//           set(medicationStatementData, 'status', textValue)
//           break;
//       }
//     }
//     return medicationStatementData;
//   }

//   changeState(field, event, textValue){
//     if(process.env.NODE_ENV === "test") console.log("   ");
//     if(process.env.NODE_ENV === "test") console.log("MedicationDetail.changeState", field, textValue);
//     if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

//     let formData = Object.assign({}, this.state.form);
//     let medicationStatementData = Object.assign({}, this.state.dstu2);

//     formData = this.updateFormData(formData, field, textValue);
//     medicationStatementData = this.updateMedicationStatement(medicationStatementData, field, textValue);

//     if(process.env.NODE_ENV === "test") console.log("medicationStatementData", medicationStatementData);
//     if(process.env.NODE_ENV === "test") console.log("formData", formData);

//     if(this.props.fhirVersion === 'v1.0.2'){
//       this.setState({dstu2: medicationStatementData})
//     }
//     if(this.props.fhirVersion === 'v3.0.1'){
//       this.setState({stu: medicationStatementData})
//     }
//     this.setState({form: formData})
//   }

//   handleSaveButton(){
//     if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
//     console.log('Saving a new Medication Statement...', this.state)

//     let self = this;
//     let fhirMedicationStatementData = Object.assign({}, this.state.dstu2);

//     if(process.env.NODE_ENV === "test") console.log('fhirMedicationStatementData', fhirMedicationStatementData);

//     let medicationStatementValidator = MedicationStatementSchema.newContext();
//     medicationStatementValidator.validate(fhirMedicationStatementData)

//     console.log('IsValid: ', medicationStatementValidator.isValid())
//     console.log('ValidationErrors: ', medicationStatementValidator.validationErrors());

//     if (this.state.medicationStatementId) {
//       if(process.env.NODE_ENV === "test") console.log("Updating medicationStatement...");

//       delete fhirMedicationStatementData._id;

//       MedicationStatements._collection.update(
//         {_id: this.state.medicationStatementId}, {$set: fhirMedicationStatementData }, function(error, result) {
//           if (error) {
//             console.log("error", error);
//             // Bert.alert(error.reason, 'danger');
//           }
//           if (result) {
//             HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MedicationStatements", recordId: self.state.medicationStatementId});
//             Session.set('medicationStatementPageTabIndex', 1);
//             Session.set('selectedMedicationStatementId', false);
//             // Bert.alert('MedicationStatement updated!', 'success');
//           }
//         });
//     } else {

//       if(process.env.NODE_ENV === "test") console.log("create a new medicationStatement", fhirMedicationStatementData);

//       set(fhirMedicationStatementData, 'meta.lastUpdated', moment().toDate())
//       set(fhirMedicationStatementData, 'meta.tag', [])  
//       fhirMedicationStatementData.meta.tag.push(this.props.fhirVersion);

//       MedicationStatements._collection.insert(fhirMedicationStatementData, function(error, result) {
//         if (error) {
//           console.log("error", error);
//           // Bert.alert(error.reason, 'danger');
//         }
//         if (result) {
//           HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MedicationStatements", recordId: self.state.medicationStatementId});
//           Session.set('medicationStatementPageTabIndex', 1);
//           Session.set('selectedMedicationStatementId', false);
//           // Bert.alert('MedicationStatement added!', 'success');
//         }
//       });
//     }
//   }

//   handleCancelButton(){
//     Session.set('medicationStatementPageTabIndex', 1);
//   }

//   handleDeleteButton(){
//     let self = this;
//     MedicationStatements._collection.remove({_id: this.state.medicationStatementId}, function(error, result){
//       if (error) {
//         // Bert.alert(error.reason, 'danger');
//       }
//       if (result) {
//         HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MedicationStatements", recordId: self.state.medicationStatementId});
//         Session.set('medicationStatementPageTabIndex', 1);
//         Session.set('selectedMedicationStatementId', false);
//         // Bert.alert('MedicationStatement removed!', 'success');
//       }
//     });
//   }
// }


// MedicationStatementDetail.propTypes = {
//   id: PropTypes.string,
//   fhirVersion: PropTypes.string,
//   medicationStatementId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
//   medicationStatement: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
// };

// export default MedicationStatementDetail;