// =======================================================================
// Using DSTU2  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// https://www.hl7.org/fhir/DSTU2/allergyintolerance.html
//
//
// =======================================================================

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@material-ui/core';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { moment } from 'moment';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { Icon } from 'react-icons-kit'
import { tag } from 'react-icons-kit/fa/tag'
import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'


export class AllergyIntolerancesTable extends React.Component {

  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      allergyIntolerances: [],
      displayToggle: false,
      displayIdentifier: false,
      displayDates: false,
      displayStatus: false,
      displayVerification: false,
      displayType: false,
      displayCategory: false,
      fhirVersion: 'v1.0.2'
    }

    // STU3 v3.0.1
    if(this.props.displayStatus){
      data.hideStatus = this.props.displayStatus;
    }
    if(this.props.displayVerification){
      data.hideVerification = this.props.displayVerification;
    }


    // DSTU2 v1.0.2
    if(this.props.displayIdentifier){
      data.hideIdentifier = this.props.displayIdentifier;
    }
    if(this.props.displayType){
      data.hideType = this.props.displayType;
    }
    if(this.props.displayCategory){
      data.hideCategory = this.props.displayCategory;
    }
    if(this.props.fhirVersion){
      data.fhirVersion = this.props.fhirVersion;
      switch (this.props.fhirVersion) {
        case 'v1.0.2':
            data.hideToggle = false;
            data.hideDates = true;
            data.hideIdentifier = true;
            data.hideStatus = false;
            data.hideVerification = false;
            data.hideType = true;
            data.hideCategory = true;
          break;      
        case 'v3.0.1':
          data.hideToggle = false;
          data.hideDates = true;
          data.hideIdentifier = true;
          data.hideStatus = true;
          data.hideVerification = true;
          data.hideType = true;
          data.hideCategory = true;
        break;      
      default:
          break;
      }
    }

    // Workflow Items
    if(this.props.hideToggle){
      data.hideToggle = this.props.hideToggle;
    }
    if(this.props.displayDates){
      data.hideDates = this.props.displayDates;
    }

    // Data
    if(this.props.data){
      data.allergyIntolerances = this.props.data;
    } else {
      if(AllergyIntolerances.find().count() > 0){
        data.allergyIntolerances = AllergyIntolerances.find().fetch();
      }  
    }

    if(process.env.NODE_ENV === "test") console.log("AllergyIntolerancesTable[data]", data);
    return data;
  };
  removeRecord(_id){
    console.log('Remove allergy ', _id)
    AllergyIntolerances._collection.remove({_id: _id})
  }
  showSecurityDialog(allergy){
    console.log('showSecurityDialog', allergy)

    Session.set('securityDialogResourceJson', AllergyIntolerances.findOne(get(allergy, '_id')));
    Session.set('securityDialogResourceType', 'AllergyIntolerance');
    Session.set('securityDialogResourceId', get(allergy, '_id'));
    Session.set('securityDialogOpen', true);
  }
  renderTogglesHeader(){
    if (!this.props.hideToggle) {
      return (
        <TableHead className="toggle">Toggle</TableHead>
      );
    }
  }
  renderToggles(patientId ){
    if (!this.props.hideToggle) {
      return (
        <TableCell className="toggle">
            <Toggle
              defaultToggled={true}
            />
          </TableCell>
      );
    }
  }

  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      return (
        <TableHead className="identifier">Identifier</TableHead>
      );
    }
  }
  renderIdentifier(allergyIntolerance ){
    if (!this.props.hideIdentifier) {
      
      return (
        <TableCell className='identifier'>{ get(allergyIntolerance, 'identifier[0].value') }</TableCell>       );
    }
  }

  renderDateHeader(){
    if (!this.props.hideDates) {
      return (
        <TableHead className='date'>Date</TableHead>
      );
    }
  }
  renderDate(newDate ){
    if (!this.props.hideDates) {
      return (
        <TableCell className='date'>{ moment(newDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }



  renderClinicalStatusHeader(){
    if (!this.props.hideStatus) {
      return (
        <TableHead className="clinicalStatus">Status</TableHead>
      );
    }
  }
  renderClinicalStatus(allergyIntolerances ){
    if (!this.props.hideStatus) {
      return (
        <TableCell className='clinicalStatus'>{ get(allergyIntolerances, 'clinicalStatus') }</TableCell>       );
    }
  }

  renderRecorderHeader(){
    if (!this.props.hideStatus) {
      return (
        <TableHead className="clinicalStatus">Status</TableHead>
      );
    }
  }
  renderRecorder(allergyIntolerances ){
    if (!this.props.hideRecorder) {
      return (
        <TableCell className='clinicalStatus'>{ get(allergyIntolerances, 'clinicalStatus') }</TableCell>       );
    }
  }


  renderVerificationStatusHeader(){
    if (!this.props.hideVerification) {
      return (
        <TableHead className="verificationStatus">Verification</TableHead>
      );
    }
  }
  renderVerificationStatus(allergyIntolerances ){
    if (!this.props.hideVerification) {
      return (
        <TableCell className='verificationStatus'>{ get(allergyIntolerances, 'verificationStatus') }</TableCell>       );
    }
  }


  renderTypeHeader(){
    if (!this.props.hideType) {
      return (
        <TableHead className="type">Type</TableHead>
      );
    }
  }
  renderType(allergyIntolerances ){
    if (!this.props.hideType) {
      return (
        <TableCell className='type'>{ get(allergyIntolerances, 'type') }</TableCell>       );
    }
  }
  renderCategoryHeader(){
    if (!this.props.hideCategory) {
      return (
        <TableHead className="category">Category</TableHead>
      );
    }
  }
  renderCategory(allergyIntolerances ){
    if (!this.props.hideCategory) {
      return (
        <TableCell className='category'>{ get(allergyIntolerances, 'category[0]') }</TableCell>       );
    }
  }
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <TableHead className='actionIcons' style={{minWidth: '120px'}}>Actions</TableHead>
      );
    }
  }
  renderActionIcons(allergyIntolerance ){
    if (!this.props.hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          <Icon icon={tag} style={iconStyle} onClick={this.showSecurityDialog.bind(this, allergyIntolerance)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={this.removeRecord.bind(this, allergyIntolerance._id)} />
        </TableCell>
      );      
    }
  } 
  renderPatientNameHeader(){
    if (!this.props.hidePatient) {
      return (
        <TableHead className='patientDisplay'>Patient</TableHead>
      );
    }
  }
  renderPatientName(patientDisplay ){
    if (!this.props.hidePatient) {
      return (
        <TableCell className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</TableCell>
      );
    }
  }
  rowClick(id){
    Session.set('allergyIntolerancesUpsert', false);
    Session.set('selectedAllergyIntolerance', id);
    Session.set('allergyIntolerancePageTabIndex', 2);
  };
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.allergyIntolerances.length; i++) {
      var newRow = {
        patientDisplay: '',
        asserterDisplay: '',
        identifier: '',
        type: '',
        category: '',
        clinicalStatus: '',
        verificationStatus: '',
        snomedCode: '',
        snomedDisplay: '',
        evidenceDisplay: '',
        barcode: '',
        criticality: '',
        patient: '',
        recorder: '', 
        reaction: '',
        substance: '',
        onset: ''
      };

      newRow.identifier = get(this.data.allergyIntolerances[i], 'identifier[0].value');
      newRow.clinicalStatus = get(this.data.allergyIntolerances[i], 'clinicalStatus');
      newRow.verificationStatus = get(this.data.allergyIntolerances[i], 'verificationStatus');
      newRow.type = get(this.data.allergyIntolerances[i], 'type');
      newRow.category = get(this.data.allergyIntolerances[i], 'category[0]');
      newRow.substance = get(this.data.allergyIntolerances[i], 'substance.coding[0].display');

      if(get(this.data.allergyIntolerances[i], 'code.coding[0]')){            
        newRow.snomedCode = get(this.data.allergyIntolerances[i], 'code.coding[0].code');
        newRow.snomedDisplay = get(this.data.allergyIntolerances[i], 'code.coding[0].display');
      }

      // DSTU2 v1.0.2
      newRow.patient = get(this.data.allergyIntolerances[i], 'patient.display');
      newRow.recorder = get(this.data.allergyIntolerances[i], 'recorder.display');
      newRow.reaction = get(this.data.allergyIntolerances[i], 'reaction[0].description', '');
      newRow.onset = moment(get(this.data.allergyIntolerances[i], 'reaction[0].onset')).format("YYYY-MM-DD");

      // DSTU v4
      if(get(this.data.allergyIntolerances[i], 'onsetDateTime')){
        newRow.onset = moment(get(this.data.allergyIntolerances[i], 'onsetDateTime')).format("YYYY-MM-DD");
      }
      if(get(this.data.allergyIntolerances[i], 'reaction[0].manifestation[0].text')){
        newRow.reaction = get(this.data.allergyIntolerances[i], 'reaction[0].manifestation[0].text', '');
      }

      if(get(this.data.allergyIntolerances[i], 'criticality')){
        switch (get(this.data.allergyIntolerances[i], 'criticality')) {
          case "CRITL":
            newRow.criticality = 'Low Risk';         
            break;
          case "CRITH":
            newRow.criticality = 'High Risk';         
            break;
          case "CRITU":
            newRow.criticality = 'Unable to determine';         
            break;        
          default:
            newRow.criticality = get(this.data.allergyIntolerances[i], 'criticality');    
          break;
        }
      };

      let rowStyle = {
        cursor: 'pointer'
      }
      if(get(this.data.allergyIntolerances[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }

      tableRows.push(
        <TableRow key={i} className="allergyIntoleranceRow" style={rowStyle} onClick={ this.rowClick.bind('this', this.data.allergyIntolerances[i]._id)} >
          { this.renderToggles(this.data.allergyIntolerances[i]) }
          { this.renderActionIcons(this.data.allergyIntolerances[i]) }
          { this.renderIdentifier(this.data.allergyIntolerances[i]) }
          <TableCell className='substance'>{ newRow.substance }</TableCell>
          <TableCell className='reaction'>{ newRow.reaction }</TableCell>
          <TableCell className='criticality'>{ newRow.criticality }</TableCell>
          { this.renderType(this.data.allergyIntolerances[i]) }
          { this.renderCategory(this.data.allergyIntolerances[i]) }
          { this.renderPatientName(newRow.patientDisplay ) } 
          {/* <TableCell className='patient'>{ newRow.patient }</TableCell> */}
          <TableCell className='recorder'>{ newRow.recorder }</TableCell>
          <TableCell className='onset'>{ newRow.onset }</TableCell>
          { this.renderClinicalStatus(this.data.allergyIntolerances[i]) }
          { this.renderVerificationStatus(this.data.allergyIntolerances[i]) }
          {/* { this.renderDate(this.data.allergyIntolerances[i].assertedDate) } */}
        </TableRow>
      )
    }

    return(
      <Table id='allergyIntolerancesTable' hover >
        <TableHeader>
          <TableRow>
            { this.renderTogglesHeader() }
            { this.renderActionIconsHeader() }
            { this.renderIdentifierHeader() }
            <TableHead className='substance'>Substance</TableHead>
            <TableHead className='reaction'>Reaction</TableHead>
            <TableHead className='criticality'>Criticality</TableHead>
            { this.renderTypeHeader() }
            { this.renderCategoryHeader() }
            { this.renderPatientNameHeader() }
            {/* <TableHead className='patient' style={{minWidth: '140px'}}>Patient</TableHead> */}
            <TableHead className='recorder'  style={{minWidth: '140px'}}>Recorder</TableHead>
            <TableHead className='onsert'>Onset</TableHead>
            { this.renderClinicalStatusHeader() }
            { this.renderVerificationStatusHeader() }
            {/* { this.renderDateHeader() } */}
          </TableRow>
        </TableHeader>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>
    );
  }
}


AllergyIntolerancesTable.propTypes = {
  data: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  hideIdentifier: PropTypes.bool,
  hideToggle: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideType: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hidePatient: PropTypes.bool,
  hideRecorder: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideVerification: PropTypes.bool,
  enteredInError: PropTypes.bool
};

ReactMixin(AllergyIntolerancesTable.prototype, ReactMeteorData);
export default AllergyIntolerancesTable;