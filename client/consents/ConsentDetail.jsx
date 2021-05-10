// import { CardActions, CardText, Checkbox, RaisedButton, SelectField, MenuItem, TextField } from 'material-ui';
// import { Col, Row, Table } from 'react-bootstrap';

// import React from 'react';
// import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';
// import PropTypes from 'prop-types';

// import { Consents } from '../lib/Consents';
// import { Session } from 'meteor/session';

// import { get, set } from 'lodash';


// export class ConsentDetail extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       consentId: false,
//       consent: {
//         resourceType : "Consent",
//         identifier: [{
//           type: {
//             coding: [
//               {
//                 system: "",
//                 code: ""
//               }
//             ],
//             text: "Serial Number"
//           },
//           value: ""
//         }],
//         status: 'active',
//         category: {
//           coding: [
//             {
//               system: "",
//               code: ""
//             }
//           ],
//           text: ""
//         },
//         patient: {
//           reference: '',
//           display: ''
//         },
//         dateTime: null,
//         period: {
//           start: null,
//           end: null
//         },
//         consentingParty: [{
//           reference: '',
//           display: ''
//         }],
//         organization: {
//           reference: '',
//           display: ''
//         },
//         except: [{
//           type: 'permit',
//           class: [{
//             version: '',
//             code: '',
//             display: ''
//           }]
//         }]
//       },
//       form: {
//         identifier: '',
//         dateTime: '',
//         status: '',
//         patientDisplay: '',
//         organizationDisplay: '',
//         consentingParty: '',
//         periodStart: '',
//         periodEnd: '',
//         type: '',
//         class: '',
//         category: ''
//       },
//       selectedConsentCategory: 0
//     }
//   }
//   dehydrateFhirResource(consent) {
//     let formData = Object.assign({}, this.state.form);

//       formData.identifier = get(consent, 'identifier[0].value')
//       formData.status = get(consent, 'status')
//       formData.dateTime = get(consent, 'dateTime')
//       formData.patientDisplay = get(consent, 'patient.display')    
//       formData.consentingParty = get(consent, 'consentingParty[0].display')
//       formData.organizationDisplay = get(consent, 'organization[0].display')
//       formData.periodStart = get(consent, 'period.start')
//       formData.periodEnd = get(consent, 'period.end')
//       formData.type = get(consent, 'except[0].type')
//       formData.class = get(consent, 'except[0].class')
//       formData.category = get(consent, 'category.text')

//     return formData;
//   }
//   shouldComponentUpdate(nextProps){
//     process.env.NODE_ENV === "test" && console.log('ConsentDetail.shouldComponentUpdate()', nextProps, this.state)
//     let shouldUpdate = true;

//     // both false; don't take any more updates
//     if(nextProps.consent === this.state.consent){
//       shouldUpdate = false;
//     }

//     // received an consent from the table; okay lets update again
//     if(nextProps.consentId !== this.state.consentId){
//       this.setState({consentId: nextProps.consentId})
      
//       if(nextProps.consent){
//         this.setState({consent: nextProps.consent})     
//         this.setState({form: this.dehydrateFhirResource(nextProps.consent)})       
//       }
//       shouldUpdate = true;
//     }
 
//     return shouldUpdate;
//   }
//   getMeteorData() {
//     let data = {
//       consentId: this.props.consentId,
//       consent: false,
//       form: this.state.form
//     };

//     if(this.props.consent){
//       data.consent = this.props.consent;
//     }

//     if(process.env.NODE_ENV === "test") console.log("ConsentDetail[data]", data);
//     return data;
//   }
//   changeSelectedCategory(event, value){
//     console.log('changeSelectedCategory', event, value)
//     this.setState({selectedConsentCategory: value})
//   }
//   render() {
//     if(process.env.NODE_ENV === "test") console.log('ConsentDetail.render()', this.state)
//     let formData = this.state.form;
//     let renderText;

//     switch (this.state.selectedConsentCategory) {
//       case 0:
//         renderText = <div style={{textAlign: 'justify'}}>
//           <b>Authorization</b>
//           <p>I expressly authorize Duke University, Duke University Health System, Inc., the Private Diagnostic Clinic, PLLC and other members of the Duke Health Enterprise identified in its Notice of Privacy Practices (collectively “DHE”), any DHE member affiliates and subsidiaries, third party service providers, and any and all members faculty or medical staff members, employees, trainees, and students of any of the above (collectively “Duke”) to communicate with me by the methods checked below:</p>
//           <b>Text Messages</b>
//           <p>To text me at the following wireless phone number provided or any other number I may provide in the future.  I understand that message and data rates may apply based on the terms of my service provider contract.  I agree that methods of contact by Duke may include use of auto-generated text messages or an automatic dialing system.</p>
//           <p>I agree to indemnify Duke in full for all claims, expenses, and damages related to or caused in whole or in part by my failure to notify Duke if I change my wireless phone number, including but not limited to all claims, expenses, and damages related to or arising under the Telephone Consumer Protection Act.  I agree to notify Duke promptly by updating my demographic information as part of the appointment registration process if I change my wireless telephone number provided above.  I may revoke my consent to receive text messages by responding to a text message with STOP, notifying clinic front desk staff, selecting the un-enroll option in MyChart account, or in writing to appointmentcommunications@dm.duke.edu.  I understand this authorization cannot be revoked to the extent that action has already been taken in reliance on this authorization prior to the date Duke receives my written request to revoke authorization.  </p>
//           <b>Unencrypted Messages</b>
//           <p>I understand that the text message contents may include my protected health information concerning my health care including but not limited to appointment reminders or availability, payment, medication reminders or notices, wellness checkups, hospital pre-registration instructions, pre-operative instructions, lab results, post-discharge follow-up intended to prevent readmission, healthcare quality assessment surveys, or treatment recommendations.</p>
//           <p>I understand that a text is unencrypted and may be intercepted or visible to be read by third parties.  I understand that this authorization to receive text will apply to all future messages unless I request a change in writing.  I understand that there is no assurance of confidentiality of information communicated by an unencrypted text message.</p>
//           <p>I understand that I may refuse to sign this authorization.  I understand that my refusal to provide the consent described in this form will not affect, directly or indirectly, my right to receive healthcare services from Duke.</p>

//         </div>
//       break;
//       case 1:
//         renderText = <Table>
//           <thead>
//             <tr>
//               <th className='selected'>selected</th>
//               <th className='category' >category</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Allergies</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>CarePlans</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Conditions</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Consents</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Family Member Histories</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Goals</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Immunizations</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Medication Statements</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Observations</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Patient Demographics</td>          
//             </tr>
//             <tr className="consentRow" style={{cursor: "pointer"}}>
//               <td className='selected'  style={{width: '20px', paddingTop: '16px'}}><Checkbox /></td>
//               <td className='category' style={{minWidth: '100px', paddingTop: '16px'}}>Procedures</td>          
//             </tr>
//           </tbody>
//         </Table>
//         break;
//       case 2:
//           renderText = <div >
//               <p>I understand DNR means that if my heart stops beating or if I stop breathing, no medical procedure to restart breathing or heart functioning will be instituted.</p>
//               <p>I understand this decision will not prevent me from obtaining other emergency medical care by prehospital emergency medical care personnel and/or medical care directed by a physician prior to my death.</p>
//               <p>I understand I may revoke this directive at any time by destroying this form and removing any “DNR” medallions.</p>
//               <p>I give permission for this information to be given to the prehospital emergency care personnel, doctors, nurses or other health personnel as necessary to implement this directive.</p>
//               <p>I hereby agree to the “Do Not Resuscitate” (DNR) order.</p>
//             </div>
//         break;

//       default:
//         break;
//     }


//     return (
//       <div id={this.props.id} className="consentDetail">
//         <CardText>
//           <Row>
//           <Col md={6}>
//               <SelectField
//                 floatingLabelText="Category"
//                 value={0}
//                 onChange={this.changeSelectedCategory.bind(this)}
//                 fullWidth={true}
//               >
              
//                 <MenuItem value={0} primaryText="Patient Authorization for Text Communications" />
//                 <MenuItem value={1} primaryText="OAuth 2.0" />
//                 <MenuItem value={2} primaryText="Do Not Resuscitate" />
//                 <MenuItem value={3} disabled primaryText="Illinois Consent by Minors to Medical Procedures" />
//                 <MenuItem value={4} disabled primaryText="42 CFR Part 2 Form of Written Consent" />
//                 <MenuItem value={5} disabled primaryText="HIPAA Authorization" />
//                 <MenuItem value={6} disabled primaryText="HIPAA Notice of Privacy Practices" />
//                 <MenuItem value={7} disabled primaryText="HIPAA Restrictions" />
//                 <MenuItem value={8} disabled primaryText="HIPAA Research Authorization" />
//                 <MenuItem value={9} disabled primaryText="HIPAA Self-Pay Restriction" />
//                 <MenuItem value={10} disabled primaryText="Research Information Access" />
//                 <MenuItem value={11} disabled primaryText="Authorization to Disclose Information to the Social Security Administration" />
//                 <MenuItem value={12} disabled primaryText="Authorization and Consent to Release Information to the Department of Veterans Affairs (VA)" />
//                 <MenuItem value={13} disabled primaryText="Common rule informed consent" />
//               </SelectField>
//               { renderText }
//             </Col>
//             <Col md={6}>
//               <TextField
//                 id='identifierInput'
//                 ref='identifier'
//                 name='identifier'
//                 className='barcode'
//                 floatingLabelText='Identifier'
//                 hintText='kpcykg8lifppmWmth'
//                 value={ get(formData, 'identifier', '')}
//                 onChange={ this.changeState.bind(this, 'mrn')}
//                 floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>
//               <TextField
//                 id='patientDisplayInput'
//                 ref='patientDisplay'
//                 name='patientDisplay'
//                 floatingLabelText='Patient Name'
//                 hintText='Jane Doe'
//                 value={ get(formData, 'patientDisplay', '')}
//                 onChange={ this.changeState.bind(this, 'patientDisplay')}
//                 floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>
//               <TextField
//                 id='consentingPartyInput'
//                 ref='consentingParty'
//                 name='consentingParty'
//                 floatingLabelText='Consenting Party'
//                 hintText='Jane Doe'
//                 value={ get(formData, 'consentingParty', '')}
//                 onChange={ this.changeState.bind(this, 'consentingParty')}
//                 floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>                
//               <TextField
//                 id='organizationDisplayInput'
//                 ref='organizationDisplay'
//                 name='organizationDisplay'
//                 floatingLabelText='Organization'
//                 hintText='St. James Infirmiry'
//                 value={ get(formData, 'organizationDisplay', '')}
//                 onChange={ this.changeState.bind(this, 'organizationDisplay')}
//                 floatingLabelFixed={true}
//                 fullWidth
//                 /><br/>
//               {/* <TextField
//                 id='statusInput'
//                 ref='status'
//                 name='status'
//                 floatingLabelText='status'
//                 hintText='draft | proposed | active | rejected | inactive | entered-in-error'
//                 value={ get(formData, 'status', '')}
//                 onChange={ this.changeState.bind(this, 'status')}
//                 floatingLabelFixed={true}
//                 fullWidth
//                 /><br/> */}
//               <TextField
//                 id='dateTimeInput'
//                 ref='dateTime'
//                 name='dateTime'
//                 type='date'
//                 floatingLabelText='Signed On'
//                 value={ moment(get(formData, 'dateTime', '')).format('YYYY-MM-DD') }
//                 onChange={ this.changeState.bind(this, 'dateTime')}
//                 floatingLabelFixed={true}
//                 fullWidth
//                 /><br/><br/>

//               { this.determineButtons(this.data.consentId) }
//             </Col>
//           </Row>
//         </CardText>
//         <CardActions>
//         </CardActions>
//       </div>
//     );
//   }
//   determineButtons(consentId){
//     if (consentId) {
//       return (
//         <div>
//           <RaisedButton id='updateConsentButton' className='saveConsentButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
//           <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
//         </div>
//       );
//     } else {
//       return(
//         <RaisedButton id='saveConsentButton'  className='saveConsentButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
//       );
//     }
//   }
//   updateFormData(formData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("ConsentDetail.updateFormData", formData, field, textValue);

//     switch (field) {
//       case "identifier":
//         set(formData, 'identifier', textValue)
//         break;
//       case "dateTime":
//         set(formData, 'dateTime', textValue)
//         break;        
//       case "status":
//         set(formData, 'status', textValue)
//         break;
//       case "patientDisplay":
//         set(formData, 'patientDisplay', textValue)
//         break;
//       case "organizationDisplay":
//         set(formData, 'organizationDisplay', textValue)
//         break;
//       case "consentingParty":
//         set(formData, 'consentingParty', textValue)
//         break;
//       case "periodStart":
//         set(formData, 'periodStart', textValue)
//         break;
//       case "periodEnd":
//         set(formData, 'periodEnd', textValue)
//         break;
//       case "type":
//         set(formData, 'type', textValue)
//         break;
//       case "class":
//         set(formData, 'class', textValue)
//         break;
//       case "category":
//         set(formData, 'category', textValue)
//         break;
//     }

//     if(process.env.NODE_ENV === "test") console.log("formData", formData);
//     return formData;
//   }
//   updateConsent(consentData, field, textValue){
//     if(process.env.NODE_ENV === "test") console.log("ConsentDetail.updateConsent", consentData, field, textValue);

//     switch (field) {
//       case "identifier":
//         set(consentData, 'identifier[0].value', textValue)
//         break;
//       case "dateTime":
//         set(consentData, 'dateTime', textValue)
//         break;        
//       case "status":
//         set(consentData, 'status', textValue)
//         break;
//       case "patientDisplay":
//         set(consentData, 'patient.display', textValue)
//         break;
//       case "organizationDisplay":
//         set(consentData, 'organization.display', textValue)
//         break;
//       case "consentingParty":
//         set(consentData, 'consentingParty.display', textValue)
//         break;
//       case "periodStart":
//         set(consentData, 'period.start', textValue)
//         break;
//       case "periodEnd":
//         set(consentData, 'period.end', textValue)
//         break;
//       case "type":
//         set(consentData, 'except[0].type', textValue)
//         break;
//       case "class":
//         set(consentData, 'except[0].class', textValue)
//         break;
//       case "category":
//         set(consentData, 'category.text', textValue)
//         break;  
//     }
//     return consentData;
//   }
//   changeState(field, event, textValue){
//     if(process.env.NODE_ENV === "test") console.log("   ");
//     if(process.env.NODE_ENV === "test") console.log("ConsentDetail.changeState", field, textValue);
//     if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

//     let formData = Object.assign({}, this.state.form);
//     let consentData = Object.assign({}, this.state.consent);

//     formData = this.updateFormData(formData, field, textValue);
//     consentData = this.updateConsent(consentData, field, textValue);

//     if(process.env.NODE_ENV === "test") console.log("consentData", consentData);
//     if(process.env.NODE_ENV === "test") console.log("formData", formData);

//     this.setState({consent: consentData})
//     this.setState({form: formData})
//   }


//   handleSaveButton(){
//     if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
//     console.log('Saving a new Consent...', this.state)

//     let self = this;
//     let fhirConsentData = Object.assign({}, this.state.consent);

//     if(process.env.NODE_ENV === "test") console.log('fhirConsentData', fhirConsentData);


//     let consentValidator = ConsentSchema.newContext();
//     consentValidator.validate(fhirConsentData)

//     console.log('IsValid: ', consentValidator.isValid())
//     console.log('ValidationErrors: ', consentValidator.validationErrors());

//     if (this.state.consentId) {
//       if(process.env.NODE_ENV === "test") console.log("Updating consent...");

//       delete fhirConsentData._id;

//       // not sure why we're having to respecify this; fix for a bug elsewhere
//       fhirConsentData.resourceType = 'Consent';

//       Consents.update({_id: this.state.consentId}, {$set: fhirConsentData }, {
//         validate: get(Meteor, 'settings.public.defaults.schemas.validate', false), 
//         filter: get(Meteor, 'settings.public.defaults.schemas.filter', false), 
//         removeEmptyStrings: get(Meteor, 'settings.public.defaults.schemas.removeEmptyStrings', false)
//       }, function(error, result){
//         if (error) {
//           if(process.env.NODE_ENV === "test") console.log("Consents.insert[error]", error);
//           Bert.alert(error.reason, 'danger');
//         }
//         if (result) {
//           HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Consents", recordId: this.state.consentId});
//           Session.set('selectedConsent', false);
//           Session.set('consentPageTabIndex', 1);
//           Bert.alert('Consent added!', 'success');
//         }
//       });
//     } else {
//       if(process.env.NODE_ENV === "test") console.log("Creating a new consent...", fhirConsentData);

//       Consents.insert(fhirConsentData, {
//         validate: get(Meteor, 'settings.public.defaults.schemas.validate', false), 
//         filter: get(Meteor, 'settings.public.defaults.schemas.filter', false), 
//         removeEmptyStrings: get(Meteor, 'settings.public.defaults.schemas.removeEmptyStrings', false)
//       }, function(error, result) {
//         if (error) {
//           if(process.env.NODE_ENV === "test")  console.log('Consents.insert[error]', error);
//           Bert.alert(error.reason, 'danger');
//         }
//         if (result) {
//           HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Consents", recordId: result});
//           Session.set('consentPageTabIndex', 1);
//           Session.set('selectedConsent', false);
//           Bert.alert('Consent added!', 'success');
//         }
//       });
//     }
//   }

//   handleCancelButton(){
//     Session.set('consentPageTabIndex', 1);
//   }

//   handleDeleteButton(){
//     let self = this;
//     Consents.remove({_id: this.state.consentId}, function(error, result){
//       if (error) {
//         if(process.env.NODE_ENV === "test") console.log('Consents.insert[error]', error);
//         Bert.alert(error.reason, 'danger');
//       }
//       if (result) {
//         HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Consents", recordId: this.state.consentId});
//         Session.set('consentPageTabIndex', 1);
//         Session.set('selectedConsent', false);
//         Bert.alert('Consent removed!', 'success');
//       }
//     });
//   }
// }
// ConsentDetail.propTypes = {
//   id: PropTypes.string,
//   fhirVersion: PropTypes.string,
//   consentId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
//   consent: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
// };

// ReactMixin(ConsentDetail.prototype, ReactMeteorData);
// export default ConsentDetail;