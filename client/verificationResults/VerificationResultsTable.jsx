import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox
} from '@material-ui/core';


import moment from 'moment'
import { get, set } from 'lodash';

import FhirUtilities from '../../lib/FhirUtilities';
import { StyledCard, PageCanvas } from 'fhir-starter';
import { FhirDehydrator } from '../../lib/FhirDehydrator';


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
// SESSION VARIABLES

Session.setDefault('selectedResults', []);


//===========================================================================
// MAIN COMPONENT


function VerificationResultsTable(props){
  logger.info('Rendering the VerificationResultsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.VerificationResultsTable');
  logger.data('VerificationResultsTable.props', {data: props}, {source: "VerificationResultsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,

    data,
    verificationResults,
    selectedVerificationResultId,
    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,
    hideTarget,
    hideStatus,
    hideStatusDate,
    hideValidationType,
    hideValidationProcess,
    hideLastPerformed,
    hideNextScheduled,

    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,
  
    
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
    checklist,

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    switch (formFactorLayout) {
      case "phone":
        hideActionIcons = false;
        hideBarcode = true;

        hideTarget = false
        hideStatus = false
        hideStatusDate = false
        hideValidationType = false
        hideValidationProcess = false
        hideLastPerformed = false
        hideNextScheduled = false
    
        break;
      case "tablet":
        hideActionIcons = false;
        hideBarcode = true;

        hideTarget = false
        hideStatus = false
        hideStatusDate = false
        hideValidationType = false
        hideValidationProcess = false
        hideLastPerformed = false
        hideNextScheduled = false
        break;
      case "web":
        hideActionIcons = false;
        hideBarcode = true;

        hideTarget = false
        hideStatus = false
        hideStatusDate = false
        hideValidationType = false
        hideValidationProcess = false
        hideLastPerformed = false
        hideNextScheduled = false
        break;
      case "desktop":
        hideActionIcons = false;
        hideBarcode = true;

        hideTarget = false
        hideStatus = false
        hideStatusDate = false
        hideValidationType = false
        hideValidationProcess = false
        hideLastPerformed = false
        hideNextScheduled = false
        break;
      case "videowall":
        hideActionIcons = false;
        hideBarcode = true;

        hideTarget = false
        hideStatus = false
        hideStatusDate = false
        hideValidationType = false
        hideValidationProcess = false
        hideLastPerformed = false
        hideNextScheduled = false
        break;            
    }
  }

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

  // ------------------------------------------------------------------------
  // Helper Functions

  function handleRowClick(id){
    console.log('Clicking row ' + id)
    if(onRowClick){
      onRowClick(id);
    }
  }

  function removeRecord(_id){
    console.log('Remove verificationResult ', _id)
    if(onRemoveRecord){
      onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof onActionButtonClick === "function"){
      onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof onCellClick === "function"){
      onCellClick(id);
    }
  }
  function handleMetaClick(patient){
    let self = this;
    if(onMetaClick){
      onMetaClick(self, patient);
    }
  }

  // ------------------------------------------------------------------------
  // Column Rendering

  function renderCheckboxHeader(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderCheckbox(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
            <Checkbox
              defaultChecked={true}
            />
        </TableCell>
      );
    }
  }
  function renderActionIconsHeader(){
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(verificationResult ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(verificationResult)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(verificationResult._id)} />   */}
        </TableCell>
      );
    }
  } 

  function renderStatus(status){
    if (!hideStatus) {
      return (
        <TableCell className='status'>{ status }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!hideStatus) {
      return (
        <TableCell className='status'>Status</TableCell>
      );
    }
  }
  function renderStatusDate(statusDate){
    if (!hideStatusDate) {
      return (
        <TableCell className='statusDate'>{ statusDate }</TableCell>
      );
    }
  }
  function renderStatusDateHeader(){
    if (!hideStatusDate) {
      return (
        <TableCell className='statusDate'>Status Date</TableCell>
      );
    }
  }

  function renderTarget(target){
    if (!hideTarget) {
      return (
        <TableCell className='target'>{ target }</TableCell>
      );
    }
  }
  function renderTargetHeader(){
    if (!hideTarget) {
      return (
        <TableCell className='target'>Target</TableCell>
      );
    }
  }
  function renderValidationType(validationType){
    if (!hideValidationType) {
      return (
        <TableCell className='validationType'>{ validationType }</TableCell>
      );
    }
  }
  function renderValidationTypeHeader(){
    if (!hideValidationType) {
      return (
        <TableCell className='validationType'>Type</TableCell>
      );
    }
  }
  function renderValidationProcess(validationProcess){
    if (!hideValidationProcess) {
      return (
        <TableCell className='validationProcess'>{ validationProcess }</TableCell>
      );
    }
  }
  function renderValidationProcessHeader(){
    if (!hideValidationProcess) {
      return (
        <TableCell className='validationProcess'>Process</TableCell>
      );
    }
  }


  function renderLastPerformed(lastPerformed){
    if (!hideLastPerformed) {
      return (
        <TableCell className='lastPerformed'>{ lastPerformed }</TableCell>
      );
    }
  }
  function renderLastPerformedHeader(){
    if (!hideLastPerformed) {
      return (
        <TableCell className='lastPerformed'>Last Performed</TableCell>
      );
    }
  }

  function renderNextScheduled(nextScheduled){
    if (!hideNextScheduled) {
      return (
        <TableCell className='nextScheduled'>{ nextScheduled }</TableCell>
      );
    }
  }
  function renderNextScheduledHeader(){
    if (!hideNextScheduled) {
      return (
        <TableCell className='nextScheduled'>Next Scheduled</TableCell>
      );
    }
  }

  function renderBarcode(id){
    if (!hideBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
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

  
  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let verificationResultsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(verificationResults){
    if(verificationResults.length > 0){  
      let count = 0;    

      verificationResults.forEach(function(verificationResult){
        if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
          verificationResultsToRender.push(FhirDehydrator.dehydrateVerificationResult(verificationResult, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }

  if(verificationResultsToRender.length === 0){
    console.log('No verificationResults to render');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < verificationResultsToRender.length; i++) {

      let selected = false;
      if(verificationResultsToRender[i].id === selectedVerificationResultId){
        selected = true;
      }
      if(get(verificationResultsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow 
          className="verificationResultRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, verificationResultsToRender[i].id)} 
          hover={true} 
          style={{cursor: 'pointer', height: '52px'}} 
          selected={selected}
        >
          { renderCheckbox() }
          { renderActionIcons(verificationResultsToRender[i]) }
          { renderStatus(verificationResultsToRender[i].status) }
          { renderTarget(verificationResultsToRender[i].target) }
          { renderStatusDate(verificationResultsToRender[i].statusDate) }
          { renderValidationType(verificationResultsToRender[i].validationType) }
          { renderValidationProcess(verificationResultsToRender[i].validationProcess) }
          { renderLastPerformed(verificationResultsToRender[i].lastPerformed) }
          { renderNextScheduled(verificationResultsToRender[i].nextScheduled) }

          { renderBarcode(verificationResultsToRender[i].id)}
        </TableRow>
      );       
    }
  }

  return(
    <div>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() }
            { renderActionIconsHeader() }
            { renderStatusHeader() }
            { renderTargetHeader() }
            { renderStatusDateHeader() }
            { renderValidationTypeHeader() }
            { renderValidationProcessHeader() }
            { renderLastPerformedHeader() }
            { renderNextScheduledHeader() }

            { renderBarcodeHeader() }
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

VerificationResultsTable.propTypes = {
  barcodes: PropTypes.bool,
  verificationResults: PropTypes.array,
  selectedVerificationResultId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  hideTarget:  PropTypes.bool,
  hideStatus:  PropTypes.bool,
  hideStatusDate:  PropTypes.bool,
  hideValidationType:  PropTypes.bool,
  hideValidationProcess:  PropTypes.bool,
  hideLastPerformed:  PropTypes.bool,
  hideNextScheduled:  PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  tableRowSize: PropTypes.string,

  formFactorLayout: PropTypes.string,
  checklist: PropTypes.bool
};
VerificationResultsTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  hideBarcode: true,

  checklist: true,
  selectedVerificationResultId: '',
  page: 0,
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export'
}

export default VerificationResultsTable; 