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

import TableNoData from 'fhir-starter';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import FhirUtilities from '../../lib/FhirUtilities';
import { flattenMessageHeader } from '../../lib/FhirDehydrator';


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

flattenMessageHeader = function(messageHeader, internalDateFormat){
  let result = {
    _id: '',
    meta: '',
    identifier: '',
    status: '',
    date: '',
    destination: '',
    focus: '',
    eventCoding: ''
  };

  if(!internalDateFormat){
    internalDateFormat = get(Meteor, "settings.public.defaults.internalDateFormat", "YYYY-MM-DD");
  }

  result._id =  get(messageHeader, 'id') ? get(messageHeader, 'id') : get(messageHeader, '_id');
  result.id = get(messageHeader, 'id', '');
  result.identifier = get(messageHeader, 'identifier[0].value', '');

  result.destination = get(messageHeader, 'destination[0].endpoint', '');
  result.focus = get(messageHeader, 'focus[0].display', '');
  result.eventCoding = get(messageHeader, 'eventCoding.display', '');

  if(get(messageHeader, 'date')){
    result.date = moment(get(messageHeader, 'date', '')).format(internalDateFormat);
  }

  result.status = get(messageHeader, 'status', '');

  return result;
}





function MessageHeadersTable(props){
  logger.info('Rendering the MessageHeadersTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.MessageHeadersTable');
  logger.data('MessageHeadersTable.props', {data: props}, {source: "MessageHeadersTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    messageHeaders,
    selectedMessageHeaderId,

    query,
    paginationLimit,
    disablePagination,

    hideCheckbox,
    hideActionIcons,
    hideDestination,
    hideFocus,
    hideEventCoding,    
    hideBarcode,

    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,
  
    rowsPerPage,
    dateFormat,
    showMinutes,
    displayEnteredInError,

    ...otherProps 
  } = props;


  // ------------------------------------------------------------------------
  // Helper Functions

  function handleRowClick(id){
    console.log('Clicking row ' + id)
    if(props.onRowClick){
      props.onRowClick(id);
    }
  }

  function removeRecord(_id){
    console.log('Remove messageHeader ', _id)
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
            <Checkbox
              defaultChecked={true}
            />
        </TableCell>
      );
    }
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(messageHeader ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(messageHeader)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(messageHeader._id)} />   */}
        </TableCell>
      );
    }
  } 

  

  function renderApprovalDate(approvalDate){
    if (!props.hideApprovalDate) {
      return (
        <TableCell className='approvalDate'>{ approvalDate }</TableCell>
      );
    }
  }
  function renderApprovalDateHeader(){
    if (!props.hideApprovalDate) {
      return (
        <TableCell className='approvalDate' style={{minWidth: '140px'}}>Approval Date</TableCell>
      );
    }
  }
  
  function renderStatus(status){
    if (!props.hideStatus) {
      return (
        <TableCell><span className="status">{status}</span></TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell>Status</TableCell>
      );
    }
  }
  function renderDestination(destination){
    if (!props.hideDestination) {
      return (
        <TableCell><span className="destination">{destination}</span></TableCell>
      );
    }
  }
  function renderDestinationHeader(){
    if (!props.hideDestination) {
      return (
        <TableCell>Destination</TableCell>
      );
    }
  }
  function renderFocus(focus){
    if (!props.hideFocus) {
      return (
        <TableCell><span className="focus">{focus}</span></TableCell>
      );
    }
  }
  function renderFocusHeader(){
    if (!props.hideFocus) {
      return (
        <TableCell>Focus</TableCell>
      );
    }
  }
  function renderEventCoding(eventCoding){
    if (!props.hideEventCoding) {
      return (
        <TableCell><span className="eventCoding">{eventCoding}</span></TableCell>
      );
    }
  }
  function renderEventCodingHeader(){
    if (!props.hideEventCoding) {
      return (
        <TableCell>Event Coding</TableCell>
      );
    }
  }

  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
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

  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
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
      rowsPerPageOptions={[5, 10, 25, 100]}
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
  let messageHeadersToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.internalDateFormat){
    internalDateFormat = props.dateFormat;
  }


  if(props.messageHeaders){
    if(props.messageHeaders.length > 0){              
      props.messageHeaders.forEach(function(messageHeader){
        messageHeadersToRender.push(flattenMessageHeader(messageHeader, internalDateFormat));
      });  
    }
  }

  if(messageHeadersToRender.length === 0){
    console.log('No messageHeaders to render');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < messageHeadersToRender.length; i++) {

      let selected = false;
      if(messageHeadersToRender[i].id === selectedMessageHeaderId){
        selected = true;
      }
      tableRows.push(
        <TableRow 
          className="messageHeaderRow" 
          key={i} 
          onClick={ handleRowClick.bind(this, messageHeadersToRender[i]._id)} 
          hover={true} 
          style={{cursor: 'pointer', height: '52px'}} 
          selected={selected}
        >
          { renderToggle() }
          { renderActionIcons(messageHeadersToRender[i]) }
          { renderStatus(messageHeadersToRender[i].status) }
          { renderDestination(messageHeadersToRender[i].destination) }
          { renderFocus(messageHeadersToRender[i].focus) }
          { renderEventCoding(messageHeadersToRender[i].eventCoding) }
          { renderBarcode(messageHeadersToRender[i].id)}
        </TableRow>
      );       
    }
  }

  return(
    <div>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderStatusHeader() }
            { renderDestinationHeader() }
            { renderFocusHeader() }
            { renderEventCodingHeader() }
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

MessageHeadersTable.propTypes = {
  barcodes: PropTypes.bool,
  messageHeaders: PropTypes.array,
  selectedMessageHeaderId: PropTypes.string,

  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideDestination: PropTypes.bool,
  hideFocus: PropTypes.bool,
  hideEventCoding: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,

  formFactorLayout: PropTypes.string
};
MessageHeadersTable.defaultProps = {
  hideCheckbox: true,
  hideActionIcons: true,
  showMinutes: false,
  hideDestination: false,
  hideFocus: false,
  hideEventCoding: false,
  hideBarcode: false,
  selectedMessageHeaderId: '',
  rowsPerPage: 5
}

export default MessageHeadersTable; 