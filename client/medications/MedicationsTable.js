import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
} from '@material-ui/core';

import { get } from 'lodash';

import FhirUtilities from '../../lib/FhirUtilities';
import { StyledCard, PageCanvas } from 'fhir-starter';
import { FhirDehydrator } from '../../lib/FhirDehydrator';


//===========================================================================
// THEMING

import { ThemeProvider, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
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
// SESSION VARIABLES

Session.setDefault('selectedMedications', []);



//===========================================================================
// MAIN COMPONENT

function MedicationsTable(props){
  logger.info('Rendering the MedicationsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.MedicationsTable');
  logger.data('MedicationsTable.props', {data: props}, {source: "MedicationsTable.jsx"});

  const classes = useStyles();

  let { 
    id,
    children, 

    medications,
    fhirVersion,
    query,
    paginationLimit,
    hideIdentifier,
    hideCheckbox,
    hideActionIcons,
    hideActiveIngredient,
    hideForm,
    hideName,
    hideCode,
    hideManufacturer,
    hideBarcode,
    onRowClick,

    rowsPerPage,
    tableRowSize,
    dateFormat,
    showMinutes,
    formFactorLayout,

    selectedMedicationId,

    page,
    onSetPage,

    ...otherProps 
  } = props;

  //---------------------------------------------------------------------
  // Pagination

  let rows = [];

  let paginationCount = 101;
  if(count){
    paginationCount = count;
  } else {
    paginationCount = rows.length;
  }

  function handleChangePage(event, newPage){
    if(typeof onSetPage === "function"){
      onSetPage(newPage);
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


  //---------------------------------------------------------------------
  // Helper Functions

  function removeRecord(_id){
    console.log('removeRecord')
  }
  function rowClick(id){
    console.log('rowClick')
  }
  function handleActionButtonClick(){
    console.log('handleActionButtonClick')
  }
  function showSecurityDialog(medication){
    console.log('showSecurityDialog', medication)
  }

  //---------------------------------------------------------------------
  // Render Functions

  function renderCheckboxHeader(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle"></TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle">
            <Checkbox
              defaultChecked={true}
            />
          </TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!props.hideIdentifier) {
      return (
        <TableCell className="identifier">Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(medication ){
    if (!props.hideIdentifier) {
      let classNames = 'identifier';
      if(props.barcodes){
        classNames = 'barcode identifier'
      }
      return (
        <TableCell className={classNames}>{ get(medication, 'identifier[0].value') }</TableCell>       );
    }
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( medication ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={this.showSecurityDialog.bind(this, medication)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, medication._id)} />   */}
        </TableCell>
      );
    }
  } 

  function renderCode(code){
    if (!props.hideCode) {
      return (
        <TableCell className='code'>{code}</TableCell>
      );
    }
  }
  function renderCodeHeader(){
    if (!props.hideCode) {
      return (
        <TableCell className='code'>Code</TableCell>
      );
    }
  }

  function renderName(name){
    if (!props.hideName) {
      return (
        <TableCell className='name'>{name}</TableCell>
      );
    }
  }
  function renderNameHeader(){
    if (!props.hideName) {
      return (
        <TableCell className='name'>Name</TableCell>
      );
    }
  }


  function renderForm(form){
    if (!props.hideForm) {
      return (
        <TableCell className='form'>{form}</TableCell>
      );
    }
  }
  function renderFormHeader(){
    if (!props.hideForm) {
      return (
        <TableCell className='form'>Form</TableCell>
      );
    }
  }

  function renderManufacturer(manufacturer){
    if (!props.hideManufacturer) {
      return (
        <TableCell className='manufacturer' >{ manufacturer }</TableCell>
      );
    }
  }
  function renderManufacturerHeader(){
    if (!props.hideManufacturer) {
      return (
        <TableCell className='manufacturer' >Manufacturer</TableCell>
      );
    }
  }
  function renderActiveIngredient(id){
    if (!props.hideActiveIngredient) {
      return (
        <TableCell className='activeIngredient'>{id}</TableCell>
      );
    }
  }
  function renderActiveIngredientHeader(){
    if (!props.hideActiveIngredient) {
      return (
        <TableCell className='activeIngredient'>Active Ingredient</TableCell>
      );
    }
  }
  function renderBarcode(id){
    if (props.hideBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (props.hideBarcode) {
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

  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let medicationsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.medications){
    if(props.medications.length > 0){     
      let count = 0;    

      props.medications.forEach(function(medication){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          medicationsToRender.push(FhirDehydrator.dehydrateMedication(medication, internalDateFormat, "R4"));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(medicationsToRender.length === 0){
    logger.trace('ConditionsTable: No medications to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < medicationsToRender.length; i++) {
      if(get(medicationsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('medicationsToRender[i]', medicationsToRender[i])
      tableRows.push(
        <TableRow className="medicationRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, medicationsToRender[i]._id)} hover={true} >            
          { renderCheckbox() }
          { renderActionIcons(medicationsToRender[i]) }
          { renderIdentifier(medicationsToRender[i].identifier ) }
          { renderCode(medicationsToRender[i].code ) }
          { renderName(medicationsToRender[i].name ) }
          { renderManufacturer(medicationsToRender[i].manufacturer) }
          { renderForm(medicationsToRender[i].form) }
          { renderActiveIngredient(medicationsToRender[i].activeIngredient) }
          { renderBarcode(medicationsToRender[i]._id)}
          { renderActionButton(medicationsToRender[i]) }
        </TableRow>
      );    
    }
  }

  return(
    <div id={id} className="tableWithPagination">
      <Table className="medicationsTable" size={tableRowSize} aria-label="a dense table" { ...otherProps }>
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            { renderCodeHeader() }
            { renderNameHeader() }
            { renderManufacturerHeader() }
            { renderFormHeader() }
            { renderActiveIngredientHeader() }
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



MedicationsTable.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array,
  medications: PropTypes.array,
  selectedConditionId: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,

  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  onSetPage: PropTypes.func,

  page: PropTypes.number,
  hideActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  hideEnteredInError: PropTypes.bool,
  count: PropTypes.number,
  tableRowSize: PropTypes.string,
  formFactorLayout: PropTypes.string
};

MedicationsTable.defaultProps = {
  tableRowSize: 'medium',
  rowsPerPage: 5,
  dateFormat: "YYYY-MM-DD hh:mm:ss",
  hideCheckbox: true,
  hideActionIcons: true,
  hideIdentifier: true,  
  medications: []
}


export default MedicationsTable;