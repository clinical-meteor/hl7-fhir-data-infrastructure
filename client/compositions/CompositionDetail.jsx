// import { CardActions, CardText } from 'material-ui/Card';
// import RaisedButton from 'material-ui/RaisedButton';
// import DatePicker from 'material-ui/DatePicker';
// import TextField from 'material-ui/TextField';

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

// import { GlassCard, VerticalCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';

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

// export class CompositionDetail extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       compositionId: false,
//       composition: {
//         resourceType: 'Composition',
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
//   dehydrateFhirResource(composition) {
//     let formData = Object.assign({}, this.state.form);

//     formData.category = get(composition, 'type.text')
//     formData.code = get(composition, 'code.text')
//     formData.value = get(composition, 'valueString')
//     formData.comparator = get(composition, 'valueQuantity.comparator')
//     formData.quantity = get(composition, 'valueQuantity.value')
//     formData.unit = get(composition, 'valueQuantity.unit')
//     formData.deviceDisplay = get(composition, 'device.display')
//     formData.subjectDisplay = get(composition, 'subject.display')
//     formData.subjectReference = get(composition, 'subject.reference')
//     formData.effectiveDateTime = get(composition, 'effectiveDateTime')
//     formData.status = get(composition, 'status')

//     formData.loincCode = get(composition, 'code.codeable[0].code')
//     formData.loincCodeText = get(composition, 'code.text')
//     formData.loincCodeDisplay = get(composition, 'code.codeable[0].display')

//     return formData;
//   }
//   shouldComponentUpdate(nextProps){
//     process.env.NODE_ENV === "test" && console.log('CompositionDetail.shouldComponentUpdate()', nextProps, this.state)
//     let shouldUpdate = true;

//     // received an composition from the table; okay lets update again
//     if(nextProps.compositionId !== this.state.compositionId){

//       if(nextProps.composition){
//         this.setState({composition: nextProps.composition})     
//         this.setState({form: this.dehydrateFhirResource(nextProps.composition)})       
//       }

//       this.setState({compositionId: nextProps.compositionId})      
//       shouldUpdate = true;
//     }

//     // both false; don't take any more updates
//     if(nextProps.composition === this.state.composition){
//       shouldUpdate = false;
//     }
    
//     return shouldUpdate;
//   }
//   getMeteorData() {
//     let data = {
//       compositionId: this.props.compositionId,
//       composition: false,
//       form: this.state.form,
//       displayDatePicker: false
//     };

//     if(this.props.displayDatePicker){
//       data.displayDatePicker = this.props.displayDatePicker
//     }
    
//     if(this.props.composition){
//       data.composition = this.props.composition;
//       data.form = this.dehydrateFhirResource(this.props.composition);
//     }

//     //console.log("CompositionDetail[data]", data);
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
//     // console.log('CompositionDetail.render()', this.state)
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
//             // Getting the following when passing an composition in via props
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
//       <div id={this.props.id} className="compositionDetail">
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
//           { this.determineButtons(this.data.compositionId) }
//         </CardActions>
//       </div>
//     );
//   }
//   determineButtons(compositionId) {
//     if (compositionId) {
//       return (
//         <div>
//           <Button id="updateCompositionButton" className="saveCompositionButton" onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} >Save</Button>
//           <Button id="deleteCompositionButton" onClick={this.handleDeleteButton.bind(this)}> Delete </Button>
//         </div>
//       );
//     } else {
//       return (
//         <Button id="saveCompositionButton" label="Save" onClick={this.handleSaveButton.bind(this)}>Save</Button>
//       );
//     }
//   }
//   updateFormData(formData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("CompositionDetail.updateFormData", formData, field, textValue);

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
//   updateComposition(compositionData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("CompositionDetail.updateComposition", compositionData, field, textValue);

//     switch (field) {
//       case "category":
//         set(compositionData, 'category.text', textValue)
//         break;
//       case "code":
//         set(compositionData, 'code.text', textValue)
//         break;        
//       case "value":
//         set(compositionData, 'valueString', textValue)
//         break;        
//       case "comparator":
//         set(compositionData, 'valueQuantity.comparator', textValue)
//         break;        
//       case "quantity":
//         set(compositionData, 'valueQuantity.value', textValue)
//         break;
//       case "unit":
//         set(compositionData, 'valueQuantity.unit', textValue)
//         break;
//       case "deviceDisplay":
//         set(compositionData, 'device.display', textValue)
//         break;
//       case "subjectDisplay":
//         set(compositionData, 'subject.display', textValue)
//         break;
//       case "subjectReference":
//         set(compositionData, 'subject.reference', textValue)
//         break;
//       case "effectiveDateTime":
//         set(compositionData, 'effectiveDateTime', textValue)
//         break;    
//       case "status":
//         set(compositionData, 'status', textValue)
//         break;    
//       case "loincCode":
//         set(compositionData, 'code.coding[0].code', textValue)
//         break;
//       case "loincCodeText":
//         set(compositionData, 'code.text', textValue)
//         break;
//       case "loincCodeDisplay":
//         set(compositionData, 'code.coding[0].display', textValue)
//         break;
//     }
//     return compositionData;
//   }

//   changeState(field, event, textValue){
//     if(process.env.NODE_ENV === "test") console.log("   ");
//     if(process.env.NODE_ENV === "test") console.log("CompositionDetail.changeState", field, textValue);
//     if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

//     let formData = Object.assign({}, this.state.form);
//     let compositionData = Object.assign({}, this.state.composition);

//     formData = this.updateFormData(formData, field, textValue);
//     compositionData = this.updateComposition(compositionData, field, textValue);

//     if(process.env.NODE_ENV === "test") console.log("compositionData", compositionData);
//     if(process.env.NODE_ENV === "test") console.log("formData", formData);

//     this.setState({composition: compositionData})
//     this.setState({form: formData})
//   }


  
//   // this could be a mixin
//   handleSaveButton() {
//     let self = this;
//     if(this.props.onUpsert){
//       this.props.onUpsert(self);
//     }
//     // if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
//     // console.log('Saving a new Composition...', this.state)

//     // let self = this;
//     // let fhirCompositionData = Object.assign({}, this.state.composition);

//     // if(process.env.NODE_ENV === "test") console.log('fhirCompositionData', fhirCompositionData);


//     // let compositionValidator = CompositionSchema.newContext();
//     // compositionValidator.validate(fhirCompositionData)

//     // console.log('IsValid: ', compositionValidator.isValid())
//     // console.log('ValidationErrors: ', compositionValidator.validationErrors());

//     // if (this.data.compositionId) {
//     //   if(process.env.NODE_ENV === "test") console.log("Updating composition...");
//     //   delete fhirCompositionData._id;

//     //   Compositions._collection.update({_id: this.data.compositionId}, {$set: fhirCompositionData },function(error, result){
//     //     if (error) {
//     //       if(process.env.NODE_ENV === "test") console.log("Compositions.insert[error]", error);
//     //       console.log('error', error)
//     //       Bert.alert(error.reason, 'danger');
//     //     }
//     //     if (result) {
//     //       if(self.props.onUpdate){
//     //         self.props.onUpdate(self.data.compositionId);
//     //       }
//     //       Bert.alert('Composition added!', 'success');
//     //     }
//     //   });
//     // } else {
//     //   fhirCompositionData.effectiveDateTime = new Date();
//     //   if (process.env.NODE_ENV === "test") console.log("create a new composition", fhirCompositionData);

//     //   Compositions._collection.insert(fhirCompositionData, function(error, result){
//     //     if (error) {
//     //       if(process.env.NODE_ENV === "test") console.log("Compositions.insert[error]", error);
//     //       console.log('error', error)
//     //       Bert.alert(error.reason, 'danger');
//     //     }
//     //     if (result) {
//     //       if(self.props.onInsert){
//     //         self.props.onInsert(self.data.compositionId);
//     //       }
//     //       Bert.alert('Composition added!', 'success');
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
//     // console.log('Delete composition...', this.data.compositionId)
//     // let self = this;
//     // Compositions._collection.remove({_id: this.data.compositionId}, function(error, result){
//     //   if (error) {
//     //     console.log('error', error)
//     //     Bert.alert(error.reason, 'danger');
//     //   }
//     //   if (result) {
//     //     if(self.props.onDelete){
//     //       self.props.onDelete(self.data.compositionId);
//     //     }
//     //     Bert.alert('Composition deleted!', 'success');
//     //   }
//     // })
//   }
// }




function CompositionDetail(props){

  let classes = useStyles();

  function renderDatePicker(displayDatePicker, effectiveDateTime){
    //console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
    // if (displayDatePicker) {
    //   return (
    //     <DatePicker 
    //       name='effectiveDateTime'
    //       hintText={ setHint("Date of Administration") } 
    //       container="inline" 
    //       mode="landscape"
    //       value={ effectiveDateTime ? effectiveDateTime : null}    
    //       onChange={ this.changeState.bind(this, 'effectiveDateTime')}      
    //       fullWidth
    //     />
    //   );
    // }
  }
  function setHint(text){
    if(props.showHints !== false){
      return text;
    } else {
      return '';
    }
  }

  return(
    <div className='CompositionDetails'>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            id='subjectDisplayInput'                
            name='subjectDisplay'
            label='Subject Name'
            // TimelineSidescrollPage dialog popup
            // Getting the following when passing an composition in via props
            // A component is changing a controlled input of type text to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. 
            // value={ get(this, 'data.form.subjectDisplay') }
            // onChange={ this.changeState.bind(this, 'subjectDisplay')}
            // hintText={ setHint('Jane Doe') }
            // floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='subjectIdInput'                
            name='subjectReference'
            label='Subject ID'
            // value={ get(this, 'data.form.subjectReference') }
            // onChange={ this.changeState.bind(this, 'subjectReference')}
            // hintText={ setHint('Patient/12345') }
            // floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='categoryTextInput'                
            name='category'
            label='Category'
            // value={ get(this, 'data.form.category') }
            // onChange={ this.changeState.bind(this, 'category')}
            // hintText={ setHint('Vital Signs') }
            // floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='deviceDisplayInput'                
            name='deviceDisplay'
            label='Device Name'
            // value={ get(this, 'data.form.deviceDisplay') }
            // onChange={ this.changeState.bind(this, 'deviceDisplay')}
            // hintText={ setHint('iHealth Blood Pressure Cuff') }
            // floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='deviceReferenceInput'                
            name='deviceReference'
            label='Device Name'
            // value={ get(this, 'data.form.deviceReference') }
            // onChange={ this.changeState.bind(this, 'deviceReference')}
            //hintText={ setHint('Device/444') }
            //floatingLabelFixed={true}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>
    </div>
  );
}

CompositionDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  compositionId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  composition: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
ReactMixin(CompositionDetail.prototype, ReactMeteorData);
export default CompositionDetail;