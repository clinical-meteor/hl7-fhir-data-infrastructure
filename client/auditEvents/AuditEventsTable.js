// https://www.hl7.org/fhir/auditevent.html  
// STU3

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

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
// MAIN COMPONENT

function AuditEventsTable(props){
  logger.debug('Rendering the AuditEventsTable');
  logger.verbose('clinical:hl7-resource-encounter.client.AuditEventsTable');
  logger.data('AuditEventsTable.props', {data: props}, {source: "AuditEventsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,

    auditEvents,
    selectedAuditEventId,
    dateFormat,
    showMinutes,

    hideCheckboxes,
    hideIdentifier,
    hideActionIcons,
    hideStatus,
    hideTypeCode,
    hideTypeDisplay,
    hideSubtypeCode,
    hideSubtypeDisplay,
    hideAction,
    hideOutcome,
    hideOutcomeDesc,
    hideAgentName,
    hideSourceSite,
    hideEntityName,
    hideRecorded,
    hideBarcode,

    onRowClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,

    query,
    paginationLimit,
    disablePagination,
    rowsPerPage,
    tableRowSize,

    count,
    formFactorLayout,

    ...otherProps 
  } = props;


  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    logger.verbose('formFactorLayout', formFactorLayout + ' ' + window.innerWidth);

    switch (formFactorLayout) {
      case "phone":
        hideTypeCode = true;
        hideTypeDisplay = true;
        hideSubtypeCode = true;
        hideSubtypeDisplay = true;
        hideOutcomeDesc = true;
        hideSourceSite = true;
        hideEntityName = true;
        hideBarcode = true;
        hideOutcome = true;
        break;
      case "tablet":
        hideTypeCode = true;
        hideTypeDisplay = true;
        hideSubtypeCode = true;
        hideSubtypeDisplay = true;
        hideOutcome = false;
        hideOutcomeDesc = true;
        hideSourceSite = true;
        hideEntityName = true;
        hideBarcode = true;
        break;
      case "web":
        hideTypeCode = false;
        hideTypeDisplay = false;
        hideSubtypeCode = false;
        hideSubtypeDisplay = false;
        hideOutcome = false;
        hideOutcomeDesc = false;
        break;
      case "desktop":
        hideTypeCode = false;
        hideTypeDisplay = false;
        hideSubtypeCode = false;
        hideSubtypeDisplay = false;
        hideOutcome = false;
        hideOutcomeDesc = false;
        break;
      case "videowall":
        hideTypeCode = false;
        hideTypeDisplay = false;
        hideSubtypeCode = false;
        hideSubtypeDisplay = false;
        hideOutcome = false;
        hideOutcomeDesc = false;
        break;            
    }
  }


  // ------------------------------------------------------------------------
  // Helper Functions


  function handleRowClick(_id){
    // console.log('Clicking row ' + _id)
    if(props.onRowClick){
      props.onRowClick(_id);
    }
  }

  function removeRecord(_id){
    logger.info('Remove measureReport: ' + _id)
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof props.onCellClick === "function"){
      props.onCellClick(id);
    }
  }

  function handleMetaClick(patient){
    let self = this;
    if(props.onMetaClick){
      props.onMetaClick(self, patient);
    }
  }


  // ------------------------------------------------------------------------
  // Column Rendering

  function renderToggleHeader(){
    if (!hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!hideCheckboxes) {
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
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(measureReport ){
    if (!hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(measureReport)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(measureReport._id)} />   */}
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
  function renderTypeDisplay(typeDisplay){
    if (!hideTypeDisplay) {
      return (
        <TableCell className='typeDisplay'>{ typeDisplay }</TableCell>
      );
    }
  }
  function renderTypeDisplayHeader(){
    if (!hideTypeDisplay) {
      return (
        <TableCell className='typeDisplay'>Type</TableCell>
      );
    }
  }
  function renderTypeCode(typeCode){
    if (!hideTypeCode) {
      return (
        <TableCell className='typeCode'>{ typeCode }</TableCell>
      );
    }
  }
  function renderTypeCodeHeader(){
    if (!hideTypeCode) {
      return (
        <TableCell className='typeCode'>Type Code</TableCell>
      );
    }
  }
  function renderSubtypeDisplay(subtypeDisplay){
    if (!hideSubtypeDisplay) {
      return (
        <TableCell className='subtypeDisplay'>{ subtypeDisplay }</TableCell>
      );
    }
  }
  function renderSubtypeDisplayHeader(){
    if (!hideSubtypeDisplay) {
      return (
        <TableCell className='subtypeDisplay'>Subtype</TableCell>
      );
    }
  }
  function renderSubtypeCode(subtypeCode){
    if (!hideSubtypeCode) {
      return (
        <TableCell className='subtypeCode'>{ subtypeCode }</TableCell>
      );
    }
  }

  function renderSubtypeCodeHeader(){
    if (!hideSubtypeCode) {
      return (
        <TableCell className='subtypeCode'>Subtype Code</TableCell>
      );
    }
  }

  function renderAction(action){
    if (!hideAction) {
      return (
        <TableCell className='action'>{ action }</TableCell>
      );
    }
  }
  function renderActionHeader(){
    if (!hideAction) {
      return (
        <TableCell className='action'>Action</TableCell>
      );
    }
  }

  function renderOutcome(outcome){
    if (!hideOutcome) {
      return (
        <TableCell className='outcome'>{ outcome }</TableCell>
      );
    }
  }
  function renderOutcomeHeader(){
    if (!hideOutcome) {
      return (
        <TableCell className='outcome'>Outcome</TableCell>
      );
    }
  }

  function renderOutcomeDesc(description){
    if (!hideOutcomeDesc) {
      return (
        <TableCell className='description'>{ description }</TableCell>
      );
    }
  }
  function renderOutcomeDescHeader(){
    if (!hideOutcomeDesc) {
      return (
        <TableCell className='description'>Description</TableCell>
      );
    }
  }

  function renderAgentName(agentName){
    if (!hideAgentName) {
      return (
        <TableCell className='agentName'>{ agentName }</TableCell>
      );
    }
  }
  function renderAgentNameHeader(){
    if (!hideAgentName) {
      return (
        <TableCell className='agentName'>Agent</TableCell>
      );
    }
  }

  function renderSourceSite(sourceSite){
    if (!hideSourceSite) {
      return (
        <TableCell className='sourceSite'>{ sourceSite }</TableCell>
      );
    }
  }
  function renderSourceSiteHeader(){
    if (!hideSourceSite) {
      return (
        <TableCell className='sourceSite'>Source</TableCell>
      );
    }
  }

  function renderEntityName(entityName){
    if (!hideEntityName) {
      return (
        <TableCell className='entityName'>{ entityName }</TableCell>
      );
    }
  }
  function renderEntityNameHeader(){
    if (!hideEntityName) {
      return (
        <TableCell className='entityName'>Entity</TableCell>
      );
    }
  }


  function renderRecordedHeader(){
    if (!hideRecorded) {
      return (
        <TableCell className='recorded'>Recorded</TableCell>
      );
    }
  }
  function renderRecorded(recordedDate ){
    if (!hideRecorded) {
      return (
        <TableCell className='recorded'>{ moment(recordedDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }


  function renderBarcode(id){
    if (!hideBarcode) {
      return (
        <TableCell><span className="barcode">{id}</span></TableCell>
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
  // Pagination

  let rows = [];
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  let paginationCount = 101;
  if(count){
    paginationCount = count;
  } else {
    paginationCount = rows.length;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let paginationFooter;
  if(!props.disablePagination){
    paginationFooter = <TablePagination
      component="div"
      // rowsPerPageOptions={[5, 10, 25, 100]}
      rowsPerPageOptions={['']}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPageToRender}
      page={page}
      onChangePage={handleChangePage}
      style={{float: 'right', border: 'none'}}
    />
  }


  //---------------------------------------------------------------------
  // Table Rows


  let tableRows = [];
  let auditEventsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(internalDateFormat){
    internalDateFormat = dateFormat;
  }

  if(auditEvents){
    if(auditEvents.length > 0){              
      let count = 0;  

      auditEvents.forEach(function(auditEvent){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          auditEventsToRender.push(FhirDehydrator.dehydrateAuditEvent(auditEvent));
        }
        count++;
      }); 
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '52px'
  }

  if(auditEventsToRender.length === 0){
    logger.trace('AuditEventsTable:  No auditEvents to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < auditEventsToRender.length; i++) {
      let selected = false;
      if(auditEventsToRender[i]._id === selectedAuditEventId){
        selected = true;
      }
      if(get(auditEventsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }
      tableRows.push(
        <TableRow className="auditEventRow" key={i} onClick={ handleRowClick.bind(this, auditEventsToRender[i]._id)} hover={true} style={rowStyle} selected={selected} >            
          { renderToggle() }
          { renderActionIcons(auditEventsToRender[i]) }
          { renderIdentifier(auditEventsToRender[i].identifier)}
          
          { renderTypeDisplay(auditEventsToRender[i].typeDisplay) }
          { renderTypeCode(auditEventsToRender[i].typeCode) }
          { renderSubtypeDisplay(auditEventsToRender[i].subtype) }
          { renderSubtypeCode(auditEventsToRender[i].subtype) }

          { renderAction(auditEventsToRender[i].action) }
          { renderOutcome(auditEventsToRender[i].outcome) }
          { renderOutcomeDesc(auditEventsToRender[i].outcomeDesc) }

          { renderAgentName(auditEventsToRender[i].agentName) }
          { renderSourceSite(auditEventsToRender[i].sourceSite) }
          { renderEntityName(auditEventsToRender[i].entityName) }

          { renderRecorded(auditEventsToRender[i].recorded) }
          
          { renderBarcode(auditEventsToRender[i]._id)}
        </TableRow>
      );    
    }
  }

  return(
    <div id={id} className="tableWithPagination">
      <Table size={tableRowSize} aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }

            { renderTypeDisplayHeader() }
            { renderTypeCodeHeader() }
            { renderSubtypeDisplayHeader() }
            { renderSubtypeCodeHeader() }

            { renderActionHeader() }
            { renderOutcomeHeader() }
            { renderOutcomeDescHeader() }

            { renderAgentNameHeader() }
            { renderSourceSiteHeader() }
            { renderEntityNameHeader() }

            { renderRecordedHeader() }            

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



AuditEventsTable.propTypes = {
  id: PropTypes.string,

  barcodes: PropTypes.bool,
  auditEvents: PropTypes.array,
  selectedAuditEventId: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,

  hideCheckboxes: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideTypeCode: PropTypes.bool,
  hideTypeDisplay: PropTypes.bool,
  hideSubtypeCode: PropTypes.bool,
  hideSubtypeDisplay: PropTypes.bool,
  hideAction: PropTypes.bool,
  hideOutcome: PropTypes.bool,
  hideOutcomeDesc: PropTypes.bool,
  hideAgentName: PropTypes.bool,
  hideSourceSite: PropTypes.bool,
  hideEntityName: PropTypes.bool,
  hideRecorded: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  showActionButton: PropTypes.bool,

  count: PropTypes.number,
  tableRowSize: PropTypes.string,
  formFactorLayout: PropTypes.string
};
AuditEventsTable.defaultProps = {
  tableRowSize: 'medium',
  rowsPerPage: 5,
  dateFormat: "YYYY-MM-DD hh:mm:ss",
  hideActionIcons: true,
  hideCheckboxes: true,
  hideIdentifier: true,
  hideStatus: true,
  hideTypeCode: true,
  hideTypeDisplay: false,
  hideSubtypeCode: true,
  hideSubtypeDisplay: false,
  hideAction: false,
  hideOutcome: false,
  hideOutcomeDesc: false,
  hideAgentName: false,
  hideSourceSite: false,
  hideEntityName: false,
  hideRecorded: false,
  hideBarcode: false,
  auditEvents: []
}

export default AuditEventsTable; 