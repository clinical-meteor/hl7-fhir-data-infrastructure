import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Tab, 
  Tabs,
  Typography,
  TextField,
  DatePicker,
  Box
} from '@material-ui/core';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import { get, set } from 'lodash';
// import { setFlagsFromString } from 'v8';

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
  }
}));

// export class MeasureDetail extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       measureId: false,
//       measure: {
//         resourceType: 'Measure',
//         status: 'preliminary',
//         category: {
//           text: ''
//         },
//         effectiveDateTime: '',
//         subject: {
//           display: '',
//           reference: ''
//         },
//         performer: [],
//         device: {
//           display: '',
//           reference: ''
//         },
//         valueQuantity: {
//           value: '',
//           unit: '',
//           system: 'http://unitsofmeasure.org'
//         },
//         valueString: ''
//       },
//       form: {
//         category: '',
//         code: '',
//         value: '',
//         quantity: '',
//         unit: '',
//         deviceDisplay: '',
//         subjectDisplay: '',
//         subjectReference: '',
//         effectiveDateTime: '',
//         loincCode: '',
//         loincCodeText: '',
//         loincCodeDisplay: '',
//         status: ''
//       }
//     }
//   }
//   dehydrateFhirResource(measure) {
//     let formData = Object.assign({}, this.state.form);

//     formData.category = get(measure, 'type.text')
//     formData.code = get(measure, 'code.text')
//     formData.value = get(measure, 'valueString')
//     formData.comparator = get(measure, 'valueQuantity.comparator')
//     formData.quantity = get(measure, 'valueQuantity.value')
//     formData.unit = get(measure, 'valueQuantity.unit')
//     formData.deviceDisplay = get(measure, 'device.display')
//     formData.subjectDisplay = get(measure, 'subject.display')
//     formData.subjectReference = get(measure, 'subject.reference')
//     formData.effectiveDateTime = get(measure, 'effectiveDateTime')
//     formData.status = get(measure, 'status')

//     formData.loincCode = get(measure, 'code.codeable[0].code')
//     formData.loincCodeText = get(measure, 'code.text')
//     formData.loincCodeDisplay = get(measure, 'code.codeable[0].display')

//     return formData;
//   }
//   shouldComponentUpdate(nextProps){
//     process.env.NODE_ENV === "test" && console.log('MeasureDetail.shouldComponentUpdate()', nextProps, this.state)
//     let shouldUpdate = true;

//     // received an measure from the table; okay lets update again
//     if(nextProps.measureId !== this.state.measureId){

//       if(nextProps.measure){
//         this.setState({measure: nextProps.measure})     
//         this.setState({form: this.dehydrateFhirResource(nextProps.measure)})       
//       }

//       this.setState({measureId: nextProps.measureId})      
//       shouldUpdate = true;
//     }

//     // both false; don't take any more updates
//     if(nextProps.measure === this.state.measure){
//       shouldUpdate = false;
//     }
    
//     return shouldUpdate;
//   }
//   getMeteorData() {
//     let data = {
//       measureId: this.props.measureId,
//       measure: false,
//       form: this.state.form,
//       displayDatePicker: false
//     };

//     if(this.props.displayDatePicker){
//       data.displayDatePicker = this.props.displayDatePicker
//     }
    
//     if(this.props.measure){
//       data.measure = this.props.measure;
//       data.form = this.dehydrateFhirResource(this.props.measure);
//     }

//     //console.log("MeasureDetail[data]", data);
//     return data;
//   }

//   renderDatePicker(displayDatePicker, effectiveDateTime){
//     //console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
//     if(typeof effectiveDateTime === "string"){
//       effectiveDateTime = moment(effectiveDateTime);
//     }
//     // if (displayDatePicker) {
//     //   return (
//     //     <DatePicker 
//     //       name='effectiveDateTime'
//     //       hintText={ setHint("Date of Administration") } 
//     //       container="inline" 
//     //       mode="landscape"
//     //       value={ effectiveDateTime ? effectiveDateTime : null}    
//     //       onChange={ this.changeState.bind(this, 'effectiveDateTime')}      
//     //       fullWidth
//     //     />
//     //   );
//     // }
//   }
//   setHint(text){
//     if(this.props.showHints !== false){
//       return text;
//     } else {
//       return '';
//     }
//   }
//   render() {
//     // console.log('MeasureDetail.render()', this.state)
//     //let formData = this.state.form;

//     var patientInputs;
//     if(this.props.showPatientInputs !== false){
//       patientInputs = <Row>
//         <Col md={6}>
//           <TextField
//             id='subjectDisplayInput'                
//             name='subjectDisplay'
//             label='Subject Name'
//             // TimelineSidescrollPage dialog popup
//             // Getting the following when passing an measure in via props
//             // A component is changing a controlled input of type text to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. 
//             // value={ get(this, 'data.form.subjectDisplay') }
//             // onChange={ this.changeState.bind(this, 'subjectDisplay')}
//             // hintText={ setHint('Jane Doe') }
//             // floatingLabelFixed={true}
//             fullWidth
//             /><br/>
//         </Col>
//         <Col md={3}>
//           <TextField
//             id='subjectIdInput'                
//             name='subjectReference'
//             label='Subject ID'
//             // value={ get(this, 'data.form.subjectReference') }
//             // onChange={ this.changeState.bind(this, 'subjectReference')}
//             // hintText={ setHint('Patient/12345') }
//             // floatingLabelFixed={true}
//             fullWidth
//             /><br/>
//         </Col>
//         <Col md={3}>
//           <TextField
//             id='categoryTextInput'                
//             name='category'
//             label='Category'
//             // value={ get(this, 'data.form.category') }
//             // onChange={ this.changeState.bind(this, 'category')}
//             // hintText={ setHint('Vital Signs') }
//             // floatingLabelFixed={true}
//             fullWidth
//             /><br/>
//         </Col>
//       </Row>
//     }

//     return (
//       <div id={this.props.id} className="measureDetail">
//         <CardHeader>
//           { patientInputs }

//           <Row>
//             <Col md={3}>
//               <TextField
//                 id='deviceDisplayInput'                
//                 name='deviceDisplay'
//                 label='Device Name'
//                 // value={ get(this, 'data.form.deviceDisplay') }
//                 // onChange={ this.changeState.bind(this, 'deviceDisplay')}
//                 // hintText={ setHint('iHealth Blood Pressure Cuff') }
//                 // floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>
//             </Col>
//             <Col md={3}>
//               <TextField
//                 id='deviceReferenceInput'                
//                 name='deviceReference'
//                 label='Device Name'
//                 // value={ get(this, 'data.form.deviceReference') }
//                 // onChange={ this.changeState.bind(this, 'deviceReference')}
//                 hintText={ setHint('Device/444') }
//                 floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>
//             </Col>
//             <Col md={3}>
//               <br />
//               { this.renderDatePicker(this.data.displayDatePicker, get(this, 'data.form.effectiveDateTime') ) }
//             </Col>

//           </Row>
//         </CardHeader>
//         <CardActions>
//           { this.determineButtons(this.data.measureId) }
//         </CardActions>
//       </div>
//     );
//   }
//   determineButtons(measureId) {
//     if (measureId) {
//       return (
//         <div>
//           <Button id="updateMeasureButton" className="saveMeasureButton" onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
//           <Button id="deleteMeasureButton" onClick={this.handleDeleteButton.bind(this)}> Delete </Button>
//         </div>
//       );
//     } else {
//       return (
//         <Button id="saveMeasureButton" label="Save" onClick={this.handleSaveButton.bind(this)}>Save</Button>
//       );
//     }
//   }
//   updateFormData(formData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("MeasureDetail.updateFormData", formData, field, textValue);

//     switch (field) {
//       case "category":
//         set(formData, 'category', textValue)
//         break;
//       case "code":
//         set(formData, 'code', textValue)
//         break;        
//       case "value":
//         set(formData, 'value', textValue)
//         break;        
//       case "comparator":
//         set(formData, 'comparator', textValue)
//         break;
//       case "quantity":
//         set(formData, 'quantity', textValue)
//         break;
//       case "unit":
//         set(formData, 'unit', textValue)
//         break;
//       case "deviceDisplay":
//         set(formData, 'deviceDisplay', textValue)
//         break;
//       case "subjectDisplay":
//         set(formData, 'subjectDisplay', textValue)
//         break;
//       case "subjectReference":
//         set(formData, 'subjectReference', textValue)
//         break;
//       case "effectiveDateTime":
//         set(formData, 'effectiveDateTime', textValue)
//         break;
//       case "status":
//         set(formData, 'status', textValue)
//         break;
//       case "loincCode":
//         set(formData, 'loincCode', textValue)
//         break;
//       case "loincCodeText":
//         set(formData, 'loincCodeText', textValue)
//         break;
//       case "loincCodeDisplay":
//         set(formData, 'loincCodeDisplay', textValue)
//         break;
//     }

//     if(process.env.NODE_ENV === "test") console.log("formData", formData);
//     return formData;
//   }
//   updateMeasure(measureData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("MeasureDetail.updateMeasure", measureData, field, textValue);

//     switch (field) {
//       case "category":
//         set(measureData, 'category.text', textValue)
//         break;
//       case "code":
//         set(measureData, 'code.text', textValue)
//         break;        
//       case "value":
//         set(measureData, 'valueString', textValue)
//         break;        
//       case "comparator":
//         set(measureData, 'valueQuantity.comparator', textValue)
//         break;        
//       case "quantity":
//         set(measureData, 'valueQuantity.value', textValue)
//         break;
//       case "unit":
//         set(measureData, 'valueQuantity.unit', textValue)
//         break;
//       case "deviceDisplay":
//         set(measureData, 'device.display', textValue)
//         break;
//       case "subjectDisplay":
//         set(measureData, 'subject.display', textValue)
//         break;
//       case "subjectReference":
//         set(measureData, 'subject.reference', textValue)
//         break;
//       case "effectiveDateTime":
//         set(measureData, 'effectiveDateTime', textValue)
//         break;    
//       case "status":
//         set(measureData, 'status', textValue)
//         break;    
//       case "loincCode":
//         set(measureData, 'code.coding[0].code', textValue)
//         break;
//       case "loincCodeText":
//         set(measureData, 'code.text', textValue)
//         break;
//       case "loincCodeDisplay":
//         set(measureData, 'code.coding[0].display', textValue)
//         break;
//     }
//     return measureData;
//   }

//   changeState(field, event, textValue){
//     if(process.env.NODE_ENV === "test") console.log("   ");
//     if(process.env.NODE_ENV === "test") console.log("MeasureDetail.changeState", field, textValue);
//     if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

//     let formData = Object.assign({}, this.state.form);
//     let measureData = Object.assign({}, this.state.measure);

//     formData = this.updateFormData(formData, field, textValue);
//     measureData = this.updateMeasure(measureData, field, textValue);

//     if(process.env.NODE_ENV === "test") console.log("measureData", measureData);
//     if(process.env.NODE_ENV === "test") console.log("formData", formData);

//     this.setState({measure: measureData})
//     this.setState({form: formData})
//   }


  
//   // this could be a mixin
//   handleSaveButton() {
//     let self = this;
//     if(this.props.onUpsert){
//       this.props.onUpsert(self);
//     }
//     // if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
//     // console.log('Saving a new Measure...', this.state)

//     // let self = this;
//     // let fhirMeasureData = Object.assign({}, this.state.measure);

//     // if(process.env.NODE_ENV === "test") console.log('fhirMeasureData', fhirMeasureData);


//     // let measureValidator = MeasureSchema.newContext();
//     // measureValidator.validate(fhirMeasureData)

//     // console.log('IsValid: ', measureValidator.isValid())
//     // console.log('ValidationErrors: ', measureValidator.validationErrors());

//     // if (this.data.measureId) {
//     //   if(process.env.NODE_ENV === "test") console.log("Updating measure...");
//     //   delete fhirMeasureData._id;

//     //   Measures._collection.update({_id: this.data.measureId}, {$set: fhirMeasureData },function(error, result){
//     //     if (error) {
//     //       if(process.env.NODE_ENV === "test") console.log("Measures.insert[error]", error);
//     //       console.log('error', error)
//     //       Bert.alert(error.reason, 'danger');
//     //     }
//     //     if (result) {
//     //       if(self.props.onUpdate){
//     //         self.props.onUpdate(self.data.measureId);
//     //       }
//     //       Bert.alert('Measure added!', 'success');
//     //     }
//     //   });
//     // } else {
//     //   fhirMeasureData.effectiveDateTime = new Date();
//     //   if (process.env.NODE_ENV === "test") console.log("create a new measure", fhirMeasureData);

//     //   Measures._collection.insert(fhirMeasureData, function(error, result){
//     //     if (error) {
//     //       if(process.env.NODE_ENV === "test") console.log("Measures.insert[error]", error);
//     //       console.log('error', error)
//     //       Bert.alert(error.reason, 'danger');
//     //     }
//     //     if (result) {
//     //       if(self.props.onInsert){
//     //         self.props.onInsert(self.data.measureId);
//     //       }
//     //       Bert.alert('Measure added!', 'success');
//     //     }
//     //   });
//     // }
//   }

//   // this could be a mixin
//   handleCancelButton() {
//     let self = this;
//     if(this.props.onCancel){
//       this.props.onCancel(self);
//     }
//   }

//   handleDeleteButton() {
//     let self = this;
//     if(this.props.onDelete){
//       this.props.onDelete(self);
//     }
//     // console.log('Delete measure...', this.data.measureId)
//     // let self = this;
//     // Measures._collection.remove({_id: this.data.measureId}, function(error, result){
//     //   if (error) {
//     //     console.log('error', error)
//     //     Bert.alert(error.reason, 'danger');
//     //   }
//     //   if (result) {
//     //     if(self.props.onDelete){
//     //       self.props.onDelete(self.data.measureId);
//     //     }
//     //     Bert.alert('Measure deleted!', 'success');
//     //   }
//     // })
//   }
// }




function MeasureDetail(props){

  let classes = useStyles();

  function renderDatePicker(displayDatePicker, effectiveDateTime){
    //console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
  }
  function setHint(text){
    if(props.showHints !== false){
      return text;
    } else {
      return '';
    }
  }

  let titleStyle = {
    fontWeight: 'bold'
  }

  let inputStyle = {
    marginTop: '20px'
  }

  return(
    <div className='MeasureDetails'>
      <Grid container spacing={3}>
        <Grid row xs={12}>
          <Grid item xs={9}>
            <TextField
              id='titleInput'                
              name='title'
              label='Title'
              style={titleStyle}
              /><br/>          
            <TextField
              id='descriptionInput'                
              name='description'
              label='Description'
              fullWidth
              /><br/>          
          </Grid>
          <Grid item xs={3}>
          </Grid>
        </Grid>
        <Grid row xs={12}>
          <Grid item xs={9}>
            <TextField
              id='identifierInput'                
              name='identifier'
              label='Identifier'
              fullWidth
              style={inputStyle}
              /><br/>
            <TextField
              id='systemInput'                
              name='system'
              label='System'
              fullWidth
              style={inputStyle}
              /><br/>
            <TextField
              id='statusInput'                
              name='status'
              label='Status'
              fullWidth
              style={inputStyle}
              /><br/>
            <TextField
              id='purposeInput'                
              name='purpose'
              label='Purpose'
              fullWidth
              style={inputStyle}
              /><br/>
          </Grid>
          <Grid item xs={3}>
            <TextField
              id='proofOfMeasureInput'                
              name='proofOfMeasure'
              label='Proof Of Measure'
              multiline
              fullWidth
              style={inputStyle}
              /><br/>
          </Grid>
        </Grid>
        <Grid row xs={12}>
          <Grid item xs={3} style={{backgroundColor: 'babyblue'}}>
            <b>RELATED CODES</b>
          </Grid>
          <Grid item xs={9}>
            <TextField
              id='purposeInput'                
              name='purpose'
              label='Purpose'
              multiline
              fullWidth
              /><br/>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

MeasureDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  measureId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  measure: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
ReactMixin(MeasureDetail.prototype, ReactMeteorData);
export default MeasureDetail;