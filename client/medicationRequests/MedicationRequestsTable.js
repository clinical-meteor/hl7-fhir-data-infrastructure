import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  IconButton,
  FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPageIcon
} from '@material-ui/core';

import TableNoData from 'material-fhir-ui';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;


// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'


import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';


//===========================================================================
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
  }
}));

let styles = {
  hideOnPhone: {
    visibility: 'visible',
    display: 'table'
  },
  cellHideOnPhone: {
    visibility: 'visible',
    display: 'table',
    paddingTop: '16px',
    maxWidth: '120px'
  },
  cell: {
    paddingTop: '16px'
  }
}

//===========================================================================
// FLATTENING / MAPPING

flattenMedicationRequest = function(medicationRequest, dateFormat){
  let result = {
    _id: medicationRequest._id,
    status: '',
    identifier: '',
    patientDisplay: '',
    patientReference: '',
    prescriberDisplay: '',
    asserterDisplay: '',
    clinicalStatus: '',
    snomedCode: '',
    snomedDisplay: '',
    evidenceDisplay: '',
    barcode: '',
    dateWritten: '',
    dosageInstructionText: '',
    medicationCodeableConcept: '',
    medicationCode: '',
    medicationReference: '',
    dosage: ''
  };

  if(!dateFormat){
    dateFormat = get(Meteor, "settings.public.defaults.dateFormat", "YYYY-MM-DD");
  }

  if (get(medicationRequest, 'medicationReference.display')){
    result.medicationCodeableConcept = get(medicationRequest, 'medicationReference.display');
  } else if(get(medicationRequest, 'medicationCodeableConcept')){
    result.medicationCodeableConcept = get(medicationRequest, 'medicationCodeableConcept.text');
    result.medicationCode = get(medicationRequest, 'medicationCodeableConcept.coding[0].code');
  } 

  result.medicationReference = get(medicationRequest, 'medicationReference.reference');

  result.status = get(medicationRequest, 'status');
  result.identifier = get(medicationRequest, 'identifier[0].value');

  if(get(medicationRequest, 'patient')){
    result.patientDisplay = get(medicationRequest, 'patient.display');
  } else if(get(medicationRequest, 'subject')){
    result.patientDisplay = get(medicationRequest, 'subject.display');
  }

  if(get(medicationRequest, 'patient')){
    result.patientReference = get(medicationRequest, 'patient.reference');
  } else if(get(medicationRequest, 'subject')){
    result.patientReference = get(medicationRequest, 'subject.reference');
  }
  
  result.prescriberDisplay = get(medicationRequest, 'prescriber.display');
  result.dateWritten = moment(get(medicationRequest, 'dateWritten')).format(dateFormat);
  
  result.dosage = get(medicationRequest, 'dosageInstruction[0].text');
  result.barcode = get(medicationRequest, '_id');

  return result;
}

// ===============================================================================================
// FUNCTIONAL COMPONENT

function MedicationRequestsTable(props){
  logger.info('Rendering the MedicationRequestsTable');
  logger.verbose('clinical:hl7-resource-encounter.client.MedicationRequestsTable');
  logger.data('MedicationRequestsTable.props', {data: props}, {source: "MedicationRequestsTable.jsx"});

  let rows = [];
  let rowsPerPageToRender = 5;

  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if(props.rowsPerPage){
    // if we receive an override as a prop, render that many rows
    // best to use rowsPerPage with disablePagination
    rowsPerPageToRender = props.rowsPerPage;
  } else {
    // otherwise default to the user selection
    rowsPerPageToRender = rowsPerPage;
  }

  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
  } else {
    paginationCount = rows.length;
  }

  function rowClick(id){
    // logger.info('MedicationRequestsTable.rowClick', id);

    Session.set("selectedMedicationRequestId", id);
    Session.set('medicationRequestPageTabIndex', 1);
    Session.set('medicationRequestDetailState', false);

    // Session.set('medicationRequestsUpsert', false);
    // Session.set('selectedMedicationRequest', id);

    if(props && (typeof props.onRowClick === "function")){
      props.onRowClick(id);
    }
  }
  function renderCheckboxHeader(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
            {/* <Checkbox
              defaultCheckbox={true}
            /> */}
          </TableCell>
      );
    }
  }
  function renderToggleHeader(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
            {/* <Checkbox
              defaultChecked={true}
            /> */}
        </TableCell>
      );
    }
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( medicationRequest ){
    if (!props.hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={ showSecurityDialog.bind(this, medicationRequest)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={ removeRecord.bind(this, medicationRequest._id)} /> */}
        </TableCell>
      );      
    }
  } 
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell className='patientDisplay'>Status</TableCell>
      );
    }
  }
  function renderStatus(status ){
    if (!props.hideStatus) {
      return (
        <TableCell className='status' style={{minWidth: '140px'}}>{ status }</TableCell>
      );
    }
  }
  function renderPatientHeader(){
    if (!props.hidePatient) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  function renderPatient(patientDisplay ){
    if (!props.hidePatient) {
      return (
        <TableCell className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</TableCell>
      );
    }
  }
  function renderPatientReferenceHeader(){
    if (!props.hidePatientReference) {
      return (
        <TableCell className='patientReference'>Patient Reference</TableCell>
      );
    }
  }
  function renderPatientReference(patientReference ){
    if (!props.hidePatientReference) {
      return (
        <TableCell className='patientReference' style={{minWidth: '140px'}}>{ patientReference }</TableCell>
      );
    }
  }
  function renderPrescriberHeader(){
    if (!props.hidePrescriber) {
      return (
        <TableCell className='prescriberDisplay'>Prescriber</TableCell>
      );
    }
  }
  function renderPrescriber(prescriberDisplay ){
    if (!props.hidePrescriber) {
      return (
        <TableCell className='prescriberDisplay' style={{minWidth: '140px'}}>{ prescriberDisplay }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!props.hideIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(identifier ){
    if (!props.hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  } 
  function renderMedicationHeader(){
    if (!props.hideMedication) {
      return (
        <TableCell className='medicationName'>Medication Name</TableCell>
      );
    }
  }
  function renderMedication(medicationName ){
    if (!props.hideMedication) {
      return (
        <TableCell className='medicationName'>{ medicationName }</TableCell>
      );
    }
  } 
  function renderMedicationCodeHeader(){
    if (!props.hideMedication) {
      return (
        <TableCell className='medicationCode'>Medication Code</TableCell>
      );
    }
  }
  function renderMedicationCode(medicationCode ){
    if (!props.hideMedication) {
      return (
        <TableCell className='medicationCode'>{ medicationCode }</TableCell>
      );
    }
  } 
  function renderDateWrittenHeader(){
    if (!props.hideDateWritten) {
      return (
        <TableCell className='dateWritten'>Date Written</TableCell>
      );
    }
  }
  function renderDateWritten(dateWritten ){
    if (!props.hideDateWritten) {
      return (
        <TableCell className='dateWritten'>{ dateWritten }</TableCell>
      );
    }
  } 
  function renderDosageHeader(){
    if (!props.hideDosage) {
      return (
        <TableCell className='dosage'>Dosage</TableCell>
      );
    }
  }
  function renderDosage(dosage ){
    if (!props.hideDosage) {
      return (
        <TableCell className='dosage' style={{minWidth: '140px'}}>{ dosage }</TableCell>
      );
    }
  }
  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode helvetica">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.hideBarcode) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }
  function renderActionButtonHeader(){
    if (props.showActionButton === true) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(patient){
    if (props.showActionButton === true) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ onActionButtonClick.bind(this, patient[i]._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }
  function removeRecord(_id){
    logger.info('Remove medication order: ' + _id)
    MedicationRequests._collection.remove({_id: _id})
  }
  function showSecurityDialog(medicationRequest){
    logger.info('Showing the security dialog.')

    Session.set('securityDialogResourceJson', MedicationRequests.findOne(get(medicationRequest, '_id')));
    Session.set('securityDialogResourceType', 'MedicationRequest');
    Session.set('securityDialogResourceId', get(medicationRequest, '_id'));
    Session.set('securityDialogOpen', true);
  }
  function handleChangePage(newPage){
    setPage(newPage);
  };

  let tableRows = [];
  let medicationRequestsToRender = [];
  let dateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    dateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    dateFormat = props.dateFormat;
  }

  if(props.medicationRequests){
    if(props.medicationRequests.length > 0){     
      let count = 0;    
      props.medicationRequests.forEach(function(medicationRequest){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          medicationRequestsToRender.push(flattenMedicationRequest(medicationRequest, dateFormat));
        }
        count++;
      });  
    }
  }

  if(medicationRequestsToRender.length === 0){
    logger.trace('MedicationRequestsTable:  No procedures to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < medicationRequestsToRender.length; i++) {
      tableRows.push(
        <TableRow className="medicationRequestRow" key={i} onClick={ rowClick.bind(this, medicationRequestsToRender[i]._id)} style={{cursor: 'pointer'}} hover="true" >            
          { renderToggle() }
          { renderActionIcons(medicationRequestsToRender[i]) }
          { renderIdentifier(medicationRequestsToRender[i].identifier ) }
          { renderMedicationCode(medicationRequestsToRender[i].medicationCode ) }
          { renderMedication(medicationRequestsToRender[i].medicationCodeableConcept ) }
          { renderStatus(medicationRequestsToRender[i].status)}
          { renderPatient(medicationRequestsToRender[i].patientDisplay)}
          { renderPatientReference(medicationRequestsToRender[i].patientReference)}
          { renderPrescriber(medicationRequestsToRender[i].performerDisplay)}
          { renderDateWritten(medicationRequestsToRender[i].dateWritten)}
          { renderDosage(medicationRequestsToRender[i].dosageInstructionText)}
          { renderBarcode(medicationRequestsToRender[i]._id)}
          { renderActionButton(medicationRequestsToRender[i]) }
        </TableRow>
      );    
    }
  }


  let paginationFooter;
  if(!props.disablePagination){
    paginationFooter = <TablePagination
      component="div"
      rowsPerPageOptions={[5, 10, 25, 100]}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPageToRender}
      page={page}
      onChangePage={handleChangePage}
      style={{float: 'right', border: 'none'}}
    />
  }

  return(
    <div>
      <Table id="proceduresTable" size="small" aria-label="a dense table" hover="true" >
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            { renderMedicationCodeHeader() }
            { renderMedicationHeader() }
            { renderStatusHeader() }
            { renderPatientHeader() }
            { renderPatientReferenceHeader() }
            { renderPrescriberHeader() }
            { renderDateWrittenHeader() }
            { renderDosageHeader() }
            { renderBarcodeHeader() }
            { renderActionButtonHeader() }
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>
      { paginationFooter }
    </div>
  ); 
}

MedicationRequestsTable.propTypes = {
  id: PropTypes.string,
  medicationRequests: PropTypes.array,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,
  fhirVersion: PropTypes.string,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideMedication: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hidePatient: PropTypes.bool,
  hidePatientReference: PropTypes.bool,
  hidePrescriber: PropTypes.bool,
  hideDateWritten: PropTypes.bool,
  hideDosageInstructions: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  showActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool
};

export default MedicationRequestsTable;
