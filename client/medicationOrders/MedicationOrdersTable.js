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

import moment from 'moment-es6'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go'

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

flattenMedicationOrder = function(medicationOrder, dateFormat){
  let result = {
    _id: medicationOrder._id,
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
    dosage: ''
  };

  if(!dateFormat){
    dateFormat = get(Meteor, "settings.public.defaults.dateFormat", "YYYY-MM-DD");
  }

  if (get(medicationOrder, 'medicationReference.display')){
    result.medicationCodeableConcept = get(medicationOrder, 'medicationReference.display');
  } else if(get(medicationOrder, 'medicationCodeableConcept')){
    result.medicationCodeableConcept = get(medicationOrder, 'medicationCodeableConcept.text');
    result.medicationCode = get(medicationOrder, 'medicationCodeableConcept.coding[0].code');
  } 

  result.status = get(medicationOrder, 'status');
  result.identifier = get(medicationOrder, 'identifier[0].value');
  result.patientDisplay = get(medicationOrder, 'patient.display');
  result.patientReference = get(medicationOrder, 'patient.reference');
  result.prescriberDisplay = get(medicationOrder, 'prescriber.display');
  result.dateWritten = moment(get(medicationOrder, 'dateWritten')).format(dateFormat);
  
  result.dosage = get(medicationOrder, 'dosageInstruction[0].text');
  result.barcode = get(medicationOrder, '_id');

  return result;
}

// ===============================================================================================
// FUNCTIONAL COMPONENT

function MedicationOrdersTable(props){
  logger.info('Rendering the MedicationOrdersTable');
  logger.verbose('clinical:hl7-resource-encounter.client.MedicationOrdersTable');
  logger.data('MedicationOrdersTable.props', {data: props}, {source: "MedicationOrdersTable.jsx"});

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
    // logger.info('MedicationOrdersTable.rowClick', id);

    Session.set("selectedMedicationOrderId", id);
    Session.set('medicationOrderPageTabIndex', 1);
    Session.set('medicationOrderDetailState', false);

    // Session.set('medicationOrdersUpsert', false);
    // Session.set('selectedMedicationOrder', id);

    if(props && (typeof props.onRowClick === "function")){
      props.onRowClick(id);
    }
  }
  function renderCheckboxHeader(){
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(){
    if (!props.hideCheckboxes) {
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
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!props.hideCheckboxes) {
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
  function renderActionIcons( medicationOrder ){
    if (!props.hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>
          <FaTags style={iconStyle} onClick={ showSecurityDialog.bind(this, medicationOrder)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(this, medicationOrder._id)} />  
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
    MedicationOrders._collection.remove({_id: _id})
  }
  function showSecurityDialog(medicationOrder){
    logger.info('Showing the security dialog.')

    Session.set('securityDialogResourceJson', MedicationOrders.findOne(get(medicationOrder, '_id')));
    Session.set('securityDialogResourceType', 'MedicationOrder');
    Session.set('securityDialogResourceId', get(medicationOrder, '_id'));
    Session.set('securityDialogOpen', true);
  }
  function handleChangePage(newPage){
    setPage(newPage);
  };

  let tableRows = [];
  let medicationOrdersToRender = [];
  let dateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    dateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    dateFormat = props.dateFormat;
  }

  if(props.medicationOrders){
    if(props.medicationOrders.length > 0){     
      let count = 0;    
      props.medicationOrders.forEach(function(medicationOrder){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          medicationOrdersToRender.push(flattenMedicationOrder(medicationOrder, dateFormat));
        }
        count++;
      });  
    }
  }

  if(medicationOrdersToRender.length === 0){
    logger.trace('MedicationOrdersTable:  No procedures to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < medicationOrdersToRender.length; i++) {
      tableRows.push(
        <TableRow className="medicationOrderRow" key={i} onClick={ rowClick.bind(this, medicationOrdersToRender[i]._id)} style={{cursor: 'pointer'}} hover="true" >            
          { renderToggle() }
          { renderActionIcons(medicationOrdersToRender[i]) }
          { renderIdentifier(medicationOrdersToRender[i].identifier ) }
          { renderMedicationCode(medicationOrdersToRender[i].medicationCode ) }
          { renderMedication(medicationOrdersToRender[i].medicationCodeableConcept ) }
          { renderStatus(medicationOrdersToRender[i].status)}
          { renderPatient(medicationOrdersToRender[i].patientDisplay)}
          { renderPatientReference(medicationOrdersToRender[i].patientReference)}
          { renderPrescriber(medicationOrdersToRender[i].performerDisplay)}
          { renderDateWritten(medicationOrdersToRender[i].dateWritten)}
          { renderDosage(medicationOrdersToRender[i].dosageInstructionText)}
          { renderBarcode(medicationOrdersToRender[i]._id)}
          { renderActionButton(medicationOrdersToRender[i]) }
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

MedicationOrdersTable.propTypes = {
  id: PropTypes.string,
  medicationOrders: PropTypes.array,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,
  fhirVersion: PropTypes.string,

  hideCheckboxes: PropTypes.bool,
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

export default MedicationOrdersTable;
