import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell, 
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Checkbox
} from '@material-ui/core';

import { HTTP } from 'meteor/http';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment';
import { get } from 'lodash';

import { FhirUtilities } from '../../lib/FhirUtilities';
import { StyledCard, PageCanvas } from 'fhir-starter';
import { FhirDehydrator } from '../../lib/FhirDehydrator';


//===========================================================================
// THEMING

import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  button: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: theme.buttonText,
    height: 48,
    padding: '0 30px',
  },
  hideOnPhone: {
    visibility: 'visible',
    hide: 'table'
  },
  cellHideOnPhone: {
    visibility: 'visible',
    hide: 'table',
    paddingTop: '16px',
    maxWidth: '120px'
  },
  cell: {
    paddingTop: '16px'
  }
}));



//===========================================================================
// SESSION VARIABLES

Session.setDefault('selectedCommunications', []);


//===========================================================================
// MAIN COMPONENT

function CommunicationsTable(props){
  logger.info('Rendering the CommunicationsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.CommunicationsTable');
  logger.data('CommunicationsTable.props', {data: props}, {source: "CommunicationsTable.jsx"});

  const classes = useStyles();

  let { 
    id,
    children, 

    data,
    communications,
    selectedCommunicationId,
    query,
    paginationLimit,
    disablePagination,
  
    hideCheckboxes,
    hideActionIcons,
    hideIdentifier,
    hideSender,
    hideSent,
    hideSubject,
    hideRecipient,
    hidePayload,
    hideCategory,
    hideStatus,
    hideTelecom,
    hideReceived,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    hideActionButton,
    actionButtonLabel,
  
    autoColumns,
    rowsPerPage,
    tableRowSize,
    dateFormat,
    showMinutes,
    size,
    appHeight,
    hideEnteredInError,
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
        break;
      case "tablet":
        break;
      case "web":
        break;
      case "desktop":
        break;
      case "hdmi":
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


  // ------------------------------------------------------------------------
  // Helper Functions


  function handleRowClick(_id){
    logger.info('clicking row ' + _id)
    if(onRowClick){
      onRowClick(_id);
    }
  }

  function handleRemoveRecord(_id){
    logger.info('Remove measureReport: ' + _id)
    if(onRemoveRecord){
      onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof onActionButtonClick === "function"){
      onActionButtonClick(id);
    }
  }
  function handleCellClick(id){
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

  // function handleRowClick(id){
  //   Session.set('communicationsUpsert', false);
  //   Session.set('selectedCommunication', id);
  //   Session.set('communicationPageTabIndex', 2);
  // }

    function toggleCommunicationStatus(communication, event, toggle){
    console.log('toggleCommunicationStatus', communication, toggle);
    let newStatus = 'draft';

    if(toggle){
      newStatus = 'active';
    } else {
      newStatus = 'draft';
    }

    Communications._collection.update({_id: communication._id}, {$set: {
      'status': newStatus
    }}, function(error, result){
      if(error){
        console.error('Communication Error', error);
      }
    });
  }

  function onSend(id){
      let communication = Communications.findOne({_id: id});
    
      var httpEndpoint = "http://localhost:8080";
      if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
        httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
      }
      HTTP.post(httpEndpoint + '/Communication', {
        data: communication
      }, function(error, result){
        if (error) {
          console.log("error", error);
        }
        if (result) {
          console.log("result", result);
        }
      });
  }
  function sendCommunication(communication){
    console.log('sendCommunication', communication)

    // TODO:

    switch (get(communication, 'category')) {
      case 'SMS Text Message':
        if(communication.telecom && (typeof communication.telecom === "string")){
          console.log('Sending SMS Text Message', communication.payload, communication.telecom)
          Meteor.call('sendTwilioMessage', communication.payload, communication.telecom)
          Communications.update({_id: communication._id}, {$set: {
            sent: new Date()
          }})  
        }
        break;    
      default:
        break;
    }
  }

  //---------------------------------------------------------------------
  // Column Rendering

  function renderCheckboxHeader(){
    if (!hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (!hideCheckboxes) {
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

  function renderActionIconsHeader(){
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( condition ){
    if (!hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, condition)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={handleRemoveRecord.bind(this, condition._id)} /> */}
        </TableCell>
      );
    }
  } 
  function renderSubjectHeader(){
    if (!hideSubject) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  function renderSubject(subject ){
    if (!hideSubject) {
      return (
        <TableCell className='subject' style={{minWidth: '140px'}}>{ subject }</TableCell>
      );
    }
  }


  function renderRecipientHeader(){
    if (!hideRecipient) {
      return (
        <TableCell className='recipient'>Recipient</TableCell>
      );
    }
  }
  function renderRecipient(recipient ){
    if (!hideRecipient) {
      return (
        <TableCell className='recipient' style={{minWidth: '140px'}}>{ recipient }</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (!hideCategory) {
      return (
        <TableCell className="category">{category}</TableCell>
      );
    }
  }
  function renderCategoryHeader(){
    if (!hideCategory) {
      return (
        <TableCell className="category">Category</TableCell>
      );
    }
  }

  function renderStatus(status){
    if (!hideStatus) {
      return (
        <TableCell><span className="status">{status}</span></TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!hideStatus) {
      return (
        <TableCell className="status">Status</TableCell>
      );
    }
  }
  function renderReceivedHeader(){
    if (!hideReceived) {
      return (
        <TableCell className='received'>Received</TableCell>
      );
    }
  }
  function renderReceived(received ){
    if (!hideReceived) {
      return (
        <TableCell className='received' style={{minWidth: '140px'}}>{ received }</TableCell>
      );
    }
  }

  function renderTelecomHeader(){
    if (!hideTelecom) {
      return (
        <TableCell className='telecom'>Telecom</TableCell>
      );
    }
  }
  function renderTelecom(telecom ){
    if (!hideTelecom) {
      return (
        <TableCell className='telecom' style={{minWidth: '140px'}}>{ telecom }</TableCell>
      );
    }
  }
  function renderPayload(payload){
    if (!hidePayload) {
      return (
        <TableCell className="payload">{payload}</TableCell>
      );
    }
  }
  function renderPayloadHeader(){
    if (!hidePayload) {
      return (
        <TableCell className="payload">Payload</TableCell>
      );
    }
  }
  
  //----------------------------------------------------------
  // Render

  let tableRows = [];
  let communicationsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(internalDateFormat){
    internalDateFormat = dateFormat;
  }

  if(communications){
    if(communications.length > 0){              
      let count = 0;  

      communications.forEach(function(communication){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          communicationsToRender.push(FhirDehydrator.dehydrateCommunication(communication));
        }
        count++;
      }); 
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '55px'
  }

  if(communicationsToRender.length === 0){
    logger.trace('CarePlansTable:  No carePlans to render.');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < communicationsToRender.length; i++) {
      let selected = false;
      if(communicationsToRender[i]._id === selectedCommunicationId){
        selected = true;
      }
      if(get(communicationsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      let sendButton;
      let buttonLabel = "Send";

      if(actionButtonLabel){
        buttonLabel = actionButtonLabel;
      }
      
      let statusCell = {
        fontWeight: 400,
        color: 'black'
      }

      if(communications[i].status === "completed"){
        statusCell.color = "green";
      }
      if(communications[i].status === "in-progress"){
        statusCell.color = "darkgoldenrod";
      }  

      if(communications[i].sent){
        buttonLabel = "Resend";
      } 

      console.log('communications[' + i + ']', communicationsToRender[i])

      tableRows.push(
        <TableRow key={i} className="communicationRow" hover={true} style={rowStyle} selected={selected} >
          { renderCheckbox(communicationsToRender[i]) }
          { renderActionIcons(communicationsToRender[i]) }
          { renderIdentifier(communicationsToRender[i]) }
          { renderSubject( communicationsToRender[i].subject ) } 
          { renderRecipient( communicationsToRender[i].recipient ) } 
          { renderTelecom( communicationsToRender[i].telecom ) } 
          { renderReceived( moment(communicationsToRender[i].received).format("YYYY-MM-DD") ) } 
          { renderCategory( communicationsToRender[i].category ) } 
          { renderPayload( communicationsToRender[i].payload ) } 
          { renderStatus(communicationsToRender[i].status) }
          <TableCell className='sent'>{ communicationsToRender[i].sent }</TableCell>
          <TableCell className='actionButton' onClick={ handleRowClick.bind(this, communicationsToRender[i]._id)} >
            <Button color="primary" onClick={ sendCommunication.bind(this, communicationsToRender[i]) } style={{marginTop: '-16px'}}>{buttonLabel}</Button>
          </TableCell>
        </TableRow>
      );
    }

  }


  return(
    <Table id='communicationsTable' >
      <TableHead>
        <TableRow>
          { renderCheckboxHeader() }
          { renderActionIconsHeader() }
          { renderIdentifierHeader() }
          { renderSubjectHeader() }
          { renderRecipientHeader() }
          { renderTelecomHeader() }
          { renderReceivedHeader() }
          { renderCategoryHeader() }
          { renderPayloadHeader() }
          { renderStatusHeader() }       
          <TableCell className='sent' style={{minWidth: '100px'}}>Sent</TableCell>
          <TableCell className='actionButton' style={{minWidth: '100px'}}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        { tableRows }
      </TableBody>
    </Table>
  );

}


CommunicationsTable.propTypes = {
  barcodes: PropTypes.bool,
  
  communications: PropTypes.array,
  selecteCommunicationId: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,

  hideCheckboxes: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  hideActionIcons: PropTypes.bool,

  hideSender: PropTypes.bool,
  hideSent: PropTypes.bool,
  hideSubject: PropTypes.bool,
  hideRecipient: PropTypes.bool,
  hidePayload: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideTelecom: PropTypes.bool,
  hideReceived: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  onSetPage: PropTypes.func,
  showActionButton: PropTypes.bool,

  page: PropTypes.number,
  count: PropTypes.number,
  tableRowSize: PropTypes.string,
  formFactorLayout: PropTypes.string
};

CommunicationsTable.defaultProps = {
  tableRowSize: 'medium',
  rowsPerPage: 5,
  dateFormat: "YYYY-MM-DD hh:mm:ss",
  hideCheckboxes: true,
  hideActionIcons: true,
  hideIdentifier: false,
  hideSender: false,
  hideSent: false,
  hideSubject: false,
  hideRecipient: false,
  hidePayload: false,
  hideReceived: true,
  hideCategory: true,
  hideStatus: false,
  hideTelecom: false,
  hideBarcode: true,
  communications: []
};


CommunicationsTable.defaultProps = {
  page: 0,
  rowsPerPage: 5,
  tableRowSize: 'medium',
  actionButtonLabel: 'Export'
}

export default CommunicationsTable;