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
  TablePagination
} from '@material-ui/core';


import moment from 'moment'
import { get, set } from 'lodash';

// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

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


//===========================================================================
// SESSION VARIABLES

Session.setDefault('selectedProvenances', []);


//===========================================================================
// MAIN COMPONENT

function ProvenancesTable(props){
  logger.info('Rendering the ProvenancesTable');
  logger.verbose('clinical:hl7-resource-encounter.client.ProvenancesTable');
  logger.data('ProvenancesTable.props', {data: props}, {source: "ProvenancesTable.jsx"});

  let { 
    id,
    children, 

    data,
    provenances,
    selectedProvenanceId,
    query,
    paginationLimit,
    disablePagination,
  
    hideCheckbox,
    hideIdentifier,
    hideActionIcons,
    hideTargetReference,
    hideTargetDisplay,
    hideSubject,
    hideSubjectReference,
    hideOccurredDateTime,
    hideOccurredDateTimeEnd,
    hideEntity,
    hideSignature,
    hideLocation,
    hideActivity,
    hideActivityDisplay,
    hideBarcode,
    filterEnteredInError,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    hideActionButton,
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

    ...otherProps 
  } = props;


  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    logger.verbose('formFactorLayout', formFactorLayout + ' ' + window.innerWidth);
    switch (formFactorLayout) {
      case "phone":
        hideSubject = true;
        hideSubjectReference = true;
        hideActivity = true;
        hideTargetDisplay = true;
        hideOccurredDateTime = true;
        hideOccurredDateTimeEnd = true;
        hideEntity = true;
        hideSignature = true;
        hideLocation = true;
        multiline = true;
        hideBarcode = true;
        break;
      case "tablet":
        hideActivity = false;
        hideTargetDisplay = false;
        hideOccurredDateTime = false;
        hideOccurredDateTimeEnd = true;
        hideEntity = true;
        hideSignature = true;
        hideLocation = true;
        multiline = false;
        hideBarcode = true;
        break;
      case "web":
        hideActivity = false;
        hideTargetDisplay = false;
        hideOccurredDateTime = false;
        hideOccurredDateTimeEnd = true;
        hideEntity = false;
        hideSignature = false;
        hideLocation = true;
        multiline = false;
        hideBarcode = true;
        break;
      case "desktop":
        hideActivity = false;
        hideTargetDisplay = false;
        hideOccurredDateTime = false;
        hideOccurredDateTimeEnd = false;
        hideEntity = false;
        hideSignature = false;
        hideLocation = false;
        multiline = false;
        hideBarcode = true;
        break;
      case "hdmi":
        hideActivity = false;
        hideTargetDisplay = false;
        hideOccurredDateTime = false;
        hideOccurredDateTimeEnd = false;
        hideEntity = false;
        hideSignature = false;
        hideLocation = false;
        multiline = false;
        hideBarcode = true;
        break;            
    }
  }


  // //---------------------------------------------------------------------
  // // Pagination

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

  function rowClick(id){
    // logger.info('ProvenancesTable.rowClick', id);

    // Session.set("selectedProvenanceId", id);
    // Session.set('procedurePageTabIndex', 1);
    // Session.set('procedureDetailState', false);

    if(props && (typeof onRowClick === "function")){
      onRowClick(id);
    }
  }
  function renderActionIconsHeader(){
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(procedure ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={ handleMetaClick.bind(procedure)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={ removeRecord.bind(procedure._id)} /> */}
        </TableCell>
      );
    }
  } 
  function handleMetaClick(_id){
    logger.info('Opening metadata for procedure: ' + _id)
    if(onMetaClick){
      onMetaClick(_id);
    }
  }
  function removeRecord(_id){
    logger.info('Remove procedure: ' + _id)
    if(onRemoveRecord){
      onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof onActionButtonClick === "function"){
      onActionButtonClick(id);
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
  function renderAgent(name, type, date){
    if (!hideSubject) {
      let result;
      return (
        <TableCell className='name'>{ name }</TableCell>
      );
    }
  }
  function renderAgentHeader(){
    if (!hideSubject) {
      return (
        <TableCell className='name'>Subject</TableCell>
      );
    }
  }
  function renderAgentReference(referenceString){
    if (!hideSubjectReference) {
      return (
        <TableCell className='patientReference' style={{maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis',  whiteSpace: 'nowrap'}}>
          { FhirUtilities.pluckReferenceId(referenceString) }
        </TableCell>
      );
    }
  }
  function renderAgentReferenceHeader(){
    if (!hideSubjectReference) {
      return (
        <TableCell className='subjectReference'>Subject Reference</TableCell>
      );
    }
  }
  function renderTargetDisplay(targetDisplay){
    if (!hideTargetDisplay) {
      return (
        <TableCell className='targetDisplay'>{ targetDisplay }</TableCell>
      );
    }
  }
  function renderTargetDisplayHeader(){
    if (!hideTargetDisplay) {
      return (
        <TableCell className='targetDisplay'>Target</TableCell>
      );
    }
  }
  function renderTargetReferenceHeader(){
    if (!hideTargetReference) {
      return (
        <TableCell className='targetReference'>Target Reference</TableCell>
      );
    }
  }
  function renderTargetReference(targetReference){
    if (!hideTargetReference) {
      return (
        <TableCell className='targetReference'>{ targetReference }</TableCell>
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
  function renderOcurredDateTimeHeader(){
    if (!hideOccurredDateTime) {
      return (
        <TableCell className='occurredDateTime' style={{minWidth: '140px'}}>Occurred</TableCell>
      );
    }
  }
  function renderOcurredDateTime(occurredDateTime){
    if (!hideOccurredDateTime) {
      if(typeof occurredDateTime === "object"){
        occurredDateTime = moment(occurredDateTime).format(internalDateFormat);
      }
      return (
        <TableCell className='occurredDateTime' style={{minWidth: '140px'}}>{ occurredDateTime }</TableCell>
      );
    }
  }
  function renderActionButtonHeader(){
    if (!hideActionButton) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(procedure){
    if (!hideActionButton) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ handleActionButtonClick.bind(this, get(procedure, "id"))}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }
  function renderIdentifier(identifier){
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
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
  function renderActivityHeader(){
    if (!hideActivity) {
      return (
        <TableCell className='activity'>Activity Code</TableCell>
      );
    }
  }
  function renderActivity(activity){
    if (!hideActivity) {
      return (
        <TableCell className='activity'>{ activity }</TableCell>
      );  
    }
  }
  function renderActivityDisplayHeader(){
    if (!hideActivityDisplay) {
      return (
        <TableCell className='activityDisplay'>Activity</TableCell>
      );
    }
  }
  function renderActivityDisplay(activityDisplay, codeValue, date){
    if (!hideActivityDisplay) {
      return (
        <TableCell className='activityDisplay'>{ activityDisplay }</TableCell>
      );  
    }
  }
  function renderLocation(locationDisplay){
    if (!hideLocation) {
      return (
        <TableCell className='location'>{ locationDisplay }</TableCell>
      );
    }
  }
  function renderLocationHeader(){
    if (!hideLocation) {
      return (
        <TableCell className='location'>Location</TableCell>
      );
    }
  }
  function renderEntity(entity){
    if (!hideEntity) {
      return (
        <TableCell className='entity'>{ entity }</TableCell>
      );
    }
  }
  function renderEntityHeader(){
    if (!hideEntity) {
      return (
        <TableCell className='entity'>Entity</TableCell>
      );
    }
  }
  function renderSignature(signature){
    if (!hideSignature) {
      return (
        <TableCell className='signature'>{ signature }</TableCell>
      );
    }
  }
  function renderSignatureHeader(){
    if (!hideSignature) {
      return (
        <TableCell className='signature'>Signature</TableCell>
      );
    }
  }



  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let provenancesToRender = [];
  let internalDateFormat = "YYYY-MM-DD";
  
  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }


  if(provenances){
    if(provenances.length > 0){     
      let count = 0;    
      provenances.forEach(function(procedure){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          provenancesToRender.push(FhirDehydrator.dehydrateProvenance(procedure, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }
  if(provenancesToRender.length === 0){
    logger.trace('ProvenancesTable:  No provenances to render.');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < provenancesToRender.length; i++) {
      let selected = false;
      if(provenancesToRender[i].id === selectedProvenanceId){
        selected = true;
      }
      if(get(provenancesToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      tableRows.push(
        <TableRow className="procedureRow" key={i} onClick={ rowClick.bind(this, provenancesToRender[i].id)} hover={true} style={rowStyle} selected={selected} >            
          { renderToggle() }
          { renderActionIcons(provenancesToRender[i]) }
          { renderIdentifier(provenancesToRender.identifier ) }
          { renderTargetDisplay(provenancesToRender[i].status)}
          { renderTargetReference(provenancesToRender[i].targetReferenceDisplay)}
          { renderActivity(provenancesToRender[i].code)}
          { renderActivityDisplay(provenancesToRender[i].codeDisplay, provenancesToRender[i].code, provenancesToRender[i].occurredDateTime)}          
          { renderAgent(provenancesToRender[i].subject)}
          { renderAgentReference(provenancesToRender[i].subjectReference)}
          { renderEntity(provenancesToRender[i].performerDisplay)}
          { renderSignature()}
          { renderOcurredDateTime(provenancesToRender[i].occurredDateTime)}
          { renderLocation(provenancesToRender[i].notesCount)}
          { renderBarcode(provenancesToRender[i]._id)}
          { renderActionButton(provenancesToRender[i]) }
        </TableRow>
      );    
    }
  }

  return(
    <div>
      <Table id="provenancesTable" size={tableRowSize} aria-label="a dense table" { ...otherProps } >
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            { renderTargetDisplayHeader() }
            { renderTargetReferenceHeader() }
            { renderActivityHeader() }
            { renderActivityDisplayHeader() }
            { renderAgentHeader() }
            { renderAgentReferenceHeader() }
            { renderEntityHeader() }
            { renderSignatureHeader() }
            { renderOcurredDateTimeHeader() }
            { renderLocationHeader() }
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

ProvenancesTable.propTypes = {
  id: PropTypes.string,

  data: PropTypes.array,
  provenances: PropTypes.array,
  selectedProvenanceId: PropTypes.string,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideTargetReference: PropTypes.bool,
  hideTargetDisplay: PropTypes.bool,
  hideSubject: PropTypes.bool,
  hideSubjectReference: PropTypes.bool,
  hideOccurredDateTime: PropTypes.bool,
  hideOccurredDateTimeEnd: PropTypes.bool,
  hideEntity: PropTypes.bool,
  hideSignature: PropTypes.bool,
  hideLocation: PropTypes.bool,
  hideActivity: PropTypes.bool,
  hideActivityDisplay: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  filterEnteredInError: PropTypes.bool,

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
  tableRowSize: PropTypes.string,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  count: PropTypes.number,
  multiline: PropTypes.bool,

  page: PropTypes.number,

  formFactorLayout: PropTypes.string
};
ProvenancesTable.defaultProps = {
  rowsPerPage: 5,
  hideCheckbox: true,
  hideActionIcons: true,
  hideActionButton: true,
  hideIdentifier: true,
  hideTargetReference: true,
  hideSignature: true,
  multiline: false,
  page: 0,
  rowsPerPage: 5,
  tableRowSize: 'medium'
}

export default ProvenancesTable;