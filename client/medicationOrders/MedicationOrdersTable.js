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

import TableNoData from 'fhir-starter';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;


// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

import { StyledCard, PageCanvas } from 'fhir-starter';
import { FhirDehydrator } from '../../lib/FhirDehydrator';


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
// 

// ===============================================================================================
// FUNCTIONAL COMPONENT

function MedicationOrdersTable(props){
  logger.info('Rendering the MedicationOrdersTable');
  logger.verbose('clinical:hl7-resource-encounter.client.MedicationOrdersTable');
  logger.data('MedicationOrdersTable.props', {data: props}, {source: "MedicationOrdersTable.jsx"});

  const classes = useStyles();
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(5);

  let { 
    children, 
    id,

    data,
    medicationOrders,
    selectedMedicationOrderId,
    query,
    paginationLimit,
    disablePagination,
  
    hideCheckbox,
    hideActionIcons,
    hideIdentifier,
    hideMedication,
    hidePatient,
    hidePatientReference,
    hidePrescriber,
    hideDateWritten,
    hideDosage,
    
    hidePostalCode,
    hideFhirId,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButton,
    hideActionButton,
    hideBarcode,
    actionButtonLabel,
    hideExtensions,
    hideNumEndpoints,
  
    onActionButtonClick,
    showActionButton,

    rowsPerPage,
    tableRowSize,
    dateFormat,
    showMinutes,
    size,
    appHeight,
    formFactorLayout,

    page,
    onSetPage,

    count,
    multiline,
    rows,

    ...otherProps 
  } = props;


  if(rowsPerPage){
    // if we receive an override as a prop, render that many rows
    // best to use rowsPerPage with disablePagination
    rowsToRender = rowsPerPage;
  } else {
    // otherwise default to the user selection
    rowsToRender = rowsPerPage;
  }

  let paginationCount = 101;
  if(count){
    paginationCount = count;
  } else if(Array.isArray(rows)){
    paginationCount = rows.length;
  }

  function rowClick(id){
    // logger.info('MedicationOrdersTable.rowClick', id);

    Session.set("selectedMedicationOrderId", id);
    Session.set('medicationOrderPageTabIndex', 1);
    Session.set('medicationOrderDetailState', false);

    // Session.set('medicationOrdersUpsert', false);
    // Session.set('selectedMedicationOrder', id);

    if(props && (typeof onRowClick === "function")){
      onRowClick(id);
    }
  }
  function renderCheckboxHeader(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(){
    if (!hideCheckbox) {
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
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!hideCheckbox) {
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
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( medicationOrder ){
    if (!hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={ showSecurityDialog.bind(this, medicationOrder)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={ removeRecord.bind(this, medicationOrder._id)} /> */}
        </TableCell>
      );      
    }
  } 
  function renderStatusHeader(){
    if (!hideStatus) {
      return (
        <TableCell className='patientDisplay'>Status</TableCell>
      );
    }
  }
  function renderStatus(status ){
    if (!hideStatus) {
      return (
        <TableCell className='status' style={{minWidth: '140px'}}>{ status }</TableCell>
      );
    }
  }
  function renderPatientHeader(){
    if (!hidePatient) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  function renderPatient(patientDisplay ){
    if (!hidePatient) {
      return (
        <TableCell className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</TableCell>
      );
    }
  }
  function renderPatientReferenceHeader(){
    if (!hidePatientReference) {
      return (
        <TableCell className='patientReference'>Patient Reference</TableCell>
      );
    }
  }
  function renderPatientReference(patientReference ){
    if (!hidePatientReference) {
      return (
        <TableCell className='patientReference' style={{minWidth: '140px'}}>{ patientReference }</TableCell>
      );
    }
  }
  function renderPrescriberHeader(){
    if (!hidePrescriber) {
      return (
        <TableCell className='prescriberDisplay'>Prescriber</TableCell>
      );
    }
  }
  function renderPrescriber(prescriberDisplay ){
    if (!hidePrescriber) {
      return (
        <TableCell className='prescriberDisplay' style={{minWidth: '140px'}}>{ prescriberDisplay }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(identifier ){
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  } 
  function renderMedicationHeader(){
    if (!hideMedication) {
      return (
        <TableCell className='medicationName'>Medication Name</TableCell>
      );
    }
  }
  function renderMedication(medicationName ){
    if (!hideMedication) {
      return (
        <TableCell className='medicationName'>{ medicationName }</TableCell>
      );
    }
  } 
  function renderMedicationCodeHeader(){
    if (!hideMedication) {
      return (
        <TableCell className='medicationCode'>Medication Code</TableCell>
      );
    }
  }
  function renderMedicationCode(medicationCode ){
    if (!hideMedication) {
      return (
        <TableCell className='medicationCode'>{ medicationCode }</TableCell>
      );
    }
  } 
  function renderDateWrittenHeader(){
    if (!hideDateWritten) {
      return (
        <TableCell className='dateWritten'>Date Written</TableCell>
      );
    }
  }
  function renderDateWritten(dateWritten ){
    if (!hideDateWritten) {
      return (
        <TableCell className='dateWritten'>{ dateWritten }</TableCell>
      );
    }
  } 
  function renderDosageHeader(){
    if (!hideDosage) {
      return (
        <TableCell className='dosage'>Dosage</TableCell>
      );
    }
  }
  function renderDosage(dosage ){
    if (!hideDosage) {
      return (
        <TableCell className='dosage' style={{minWidth: '140px'}}>{ dosage }</TableCell>
      );
    }
  }
  function renderBarcode(id){
    if (!hideBarcode) {
      return (
        <TableCell><span className="barcode helvetica">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!hideBarcode) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }
  function renderActionButtonHeader(){
    if (showActionButton === true) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(patient){
    if (showActionButton === true) {
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

  if(showMinutes){
    dateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    dateFormat = dateFormat;
  }

  if(medicationOrders){
    if(medicationOrders.length > 0){     
      let count = 0;    
      props.medicationOrders.forEach(function(medicationOrder){
        if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
          medicationOrdersToRender.push(FhirDehydrator.dehydrateMedicationOrder(medicationOrder, dateFormat));
        }
        count++;
      });  
    }
  }

  if(medicationOrdersToRender.length === 0){
    logger.trace('MedicationOrdersTable:  No procedures to render.');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
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
  if(!disablePagination){
    paginationFooter = <TablePagination
      component="div"
      // rowsPerPageOptions={[5, 10, 25, 100]}
      rowsPerPageOptions={['']}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      style={{float: 'right', border: 'none'}}
    />
  }

  return(
    <div>
      <Table id="proceduresTable" size="small" aria-label="a dense table" hover={true} >
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
  onSetPage: PropTypes.func,

  page: PropTypes.number,
  showActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,

  formFactorLayout: PropTypes.string
};

MedicationOrdersTable.defaultProps = {
  selectedMedicationOrderId: '',
  medicationOrders: [],
  hideFhirId: true,
  hideName: false,
  hideActionButton: true,
  hideCheckbox: true,
  hideBarcode: true,
  hideExtensions: true,
  hideNumEndpoints: true,
  hideMedication: false,
  multiline: false,
  page: 0,
  rowsPerPage: 5,
  hasRestrictions: false,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export',
  dateFormat: "YYYY-MM-DD",
  tableRowSize: 'medium',
  primaryColor: "#E5537E",
  rows: []
}

export default MedicationOrdersTable;
