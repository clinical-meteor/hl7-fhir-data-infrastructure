import React from 'react';
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

import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { get } from 'lodash';
import moment from 'moment';


import FhirDehydrator, { flattenCommunicationRequest } from '../../lib/FhirDehydrator';
import { FhirUtilities } from '../../lib/FhirUtilities';
import { Theming } from '../../lib/Theming';

// //===========================================================================
// // THEMING

// import { ThemeProvider, makeStyles } from '@material-ui/styles';
// const useStyles = makeStyles(theme => ({
//   button: {
//     background: theme.background,
//     border: 0,
//     borderRadius: 3,
//     boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
//     color: theme.buttonText,
//     height: 48,
//     padding: '0 30px',
//   },
//   hideOnPhone: {
//     visibility: 'visible',
//     hide: 'table'
//   },
//   cellHideOnPhone: {
//     visibility: 'visible',
//     hide: 'table',
//     paddingTop: '16px',
//     maxWidth: '120px'
//   },
//   cell: {
//     paddingTop: '16px'
//   }
// }));


//===========================================================================
// MAIN COMPONENT

function CommunicationRequestsTable(props){
  logger.info('Rendering the CommunicationRequestsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.CommunicationRequestsTable');
  logger.data('CommunicationRequestsTable.props', {data: props}, {source: "CommunicationRequestsTable.jsx"});

  let { 
    id,
    children, 

    data,
    communicationRequests,
    selectedCommunicationRequestId,

    query,
    paginationLimit,
    disablePagination,
  
    hideIdentifier,
    hideCheckbox,
    hideBarcodes,
    hideActionIcons,
    hideAuthoredOn,
    hideRequestor,
    hideStatus,
    hideCategory,
  
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
    hideEnteredInError,
    formFactorLayout,
    count,

    ...otherProps 
  } = props;






  //--------------------------------------------------
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


  //--------------------------------------------------
  // Column Functions

  function rowClick(id){
    Session.set('communicationRequestsUpsert', false);
    Session.set('selectedCommunicationRequest', id);
    Session.set('communicationRequestPageTabIndex', 2);
  }
  function renderCheckboxHeader(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle">Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(communicationRequest){
    if (!props.hideCheckbox) {
      let toggleValue = false;
      if(get(communicationRequest, 'status') === "active"){
        toggleValue = true;
      }
      return (
        <TableCell className="toggle">
          <Checkbox
            defaultChecked={true}
            value={toggleValue}
            onCheck={toggleCommunicationRequestStatus.bind(this, communicationRequest)}
          />
        </TableCell>
      );
    }
  }
  function toggleCommunicationRequestStatus(communicationRequest, event, toggle){
    console.log('toggleCommunicationRequestStatus', communicationRequest, toggle);
    let newStatus = 'draft';

    if(toggle){
      newStatus = 'active';
    } else {
      newStatus = 'draft';
    }

    CommunicationRequests._collection.update({_id: communicationRequest._id}, {$set: {
      'status': newStatus
    }}, function(error, result){
      if(error){
        console.error('CommunicationRequest Error', error);
      }
    });
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(questionnaire ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={onMetaClick.bind(this, questionnaire)} />
          <GoTrashcan style={iconStyle} onClick={removeRecord.bind(this, questionnaire._id)} />   */}
        </TableCell>
      );
    }
  } 

  function removeRecord(_id){
    console.log('Remove communicationRequest ', _id)
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
  }
  function renderIdentifierHeader(){
    if (!props.hideIdentifier) {
      return (
        <TableCell className="identifier">Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(questionnaire ){
    if (!props.hideIdentifier) {
      let classNames = 'identifier';
      if(props.barcodes){
        classNames = 'barcode identifier'
      }
      return (
        <TableCell className={classNames}>{ get(questionnaire, 'identifier[0].value') }</TableCell>       );
    }
  }
  function onSend(id){
      let communicationRequest = CommunicationRequests.findOne({_id: id});
    
      var httpEndpoint = "http://localhost:8080";
      if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
        httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
      }
      HTTP.post(httpEndpoint + '/CommunicationRequest', {
        data: communicationRequest
      }, function(error, result){
        if (error) {
          console.log("error", error);
        }
        if (result) {
          console.log("result", result);
        }
      });
  }
  function sendCommunicationRequest(communicationRequest){
    console.log('sendCommunicationRequest', communicationRequest)

    // TODO:

    switch (get(communicationRequest, 'category')) {
      case 'SMS Text Message':
        if(communicationRequest.telecom && (typeof communicationRequest.telecom === "string")){
          console.log('Sending SMS Text Message', communicationRequest.payload, communicationRequest.telecom)
          Meteor.call('sendTwilioMessage', communicationRequest.payload, communicationRequest.telecom)
          CommunicationRequests.update({_id: communicationRequest._id}, {$set: {
            sent: new Date()
          }})  
        }
        break;    
      default:
        break;
    }
  }
  function renderAuthoredOn(authoredOn){
    if (!props.hideAuthoredOn) {
      return (
        <TableCell className='authoredOn'>{ authoredOn }</TableCell>
      );
    }
  }
  function renderAuthoredOnHeader(){
    if (!props.hideAuthoredOn) {
      return (
        <TableCell className='authoredOn' style={{minWidth: '140px'}}>Authored On</TableCell>
      );
    }
  }
  function renderRequestor(requester){
    if (!props.hideRequestor) {
      return (
        <TableCell className='requester'>{ requester }</TableCell>
      );
    }
  }
  function renderRequestorHeader(){
    if (!props.hideRequestor) {
      return (
        <TableCell className='requester' style={{minWidth: '140px'}}>Requestor</TableCell>
      );
    }
  }
  function renderStatus(status){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>{ status }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>Status</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (!props.hideCategory) {
      return (
        <TableCell className='category'>{ category }</TableCell>
      );
    }
  }
  function renderCategoryHeader(){
    if (!props.hideCategory) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell className='id'>{ id }</TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.hideBarcode) {
      return (
        <TableCell className='id'>System Id</TableCell>
      );
    }
  }

  //--------------------------------------------------
  // Render

  let tableRows = [];
  let communicationRequestsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }

  if(communicationRequests){
    if(communicationRequests.length > 0){     
      let count = 0;    

      communicationRequests.forEach(function(communicationRequest){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          communicationRequestsToRender.push(flattenCommunicationRequest(communicationRequest, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer',
    height: '52px'
  }



  if(communicationRequestsToRender.length === 0){
    logger.trace('ConditionsTable: No conditions to render.');
  } else {
    for (var i = 0; i < communicationRequestsToRender.length; i++) {

      let selected = false;
      if(communicationRequestsToRender[i].id === selectedConditionId){
        selected = true;
      }
      if(get(communicationRequestsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }
      logger.trace('communicationRequestsToRender[i]', communicationRequestsToRender[i])

      let sendButton;
      let buttonLabel = "Send";
  
      if(actionButtonLabel){
        buttonLabel = actionButtonLabel;
      }
      
      let statusCell = {
        fontWeight: 400,
        color: 'black'
      }
  
      if(communicationRequestsToRender[i].status === "completed"){
        statusCell.color = "green";
      }
      if(communicationRequestsToRender[i].status === "in-progress"){
        statusCell.color = "darkgoldenrod";
      }  
  
      if(communicationRequestsToRender[i].sent){
        buttonLabel = "Resend";
      } 
  
      tableRows.push(
        <TableRow key={i} className="communicationRequestRow" style={{cursor: "pointer"}} hover={true}>
          {/* { renderCheckbox(communicationRequestsToRender[i]) } */}
          {/* { renderActionIcons(communicationRequestsToRender[i]) } */}
          { renderAuthoredOn(get(communicationRequestsToRender[i], 'authoredOn', '')) }
          { renderStatus(get(communicationRequestsToRender[i], 'status', '')) }
          {/* { renderCategory(communicationRequestsToRender[i].category) } */}
          { renderRequestor(get(communicationRequestsToRender[i], 'requestor.display', '')) }
          
          {/* <TableCell className='subject' onClick={ rowClick.bind('this', communicationRequestsToRender[i]._id)} style={style.cell}>{communicationRequestsToRender[i].subject }</TableCell>
          <TableCell className='recipient' onClick={ rowClick.bind('this', communicationRequestsToRender[i]._id)} style={style.cell}>{communicationRequestsToRender[i].recipient }</TableCell>
          <TableCell className='telecom' onClick={ rowClick.bind('this', communicationRequestsToRender[i]._id)} style={style.cell}>{communicationRequestsToRender[i].telecom }</TableCell>
          <TableCell className='received' onClick={ rowClick.bind('this', communicationRequestsToRender[i]._id)} style={style.cell}>{communicationRequestsToRender[i].received }</TableCell>
          <TableCell className='payload' onClick={ rowClick.bind('this', communicationRequestsToRender[i]._id)} style={style.cell}>{communicationRequestsToRender[i].payload }</TableCell>
          <TableCell className='sent' style={style.cell}>{ communicationRequestsToRender[i].sent }</TableCell>
          <TableCell className='actionButton' onClick={ rowClick.bind('this', communicationRequestsToRender[i]._id)} style={style.cell}>
            <Button primary={false} onClick={ sendCommunicationRequest.bind(this, communicationRequestsToRender[i]) } style={{marginTop: '-16px'}}>{buttonLabel}</Button>
          </TableCell> */}
          { renderIdentifier(get(communicationRequestsToRender[i], 'identifier[0].value', '')) }
          { renderBarcode(get(communicationRequestsToRender[i], 'id', '')) }
        </TableRow>
      );
    }
  }



  


  return(
    <Table id='communicationRequestsTable' >
      <TableHead>
        <TableRow>
          {/* { renderCheckboxHeader() } */}
          {/* { renderActionIconsHeader() } */}
          { renderAuthoredOnHeader() }
          { renderStatusHeader() }
          {/* { renderCategoryHeader() } */}
          { renderRequestorHeader() }
          {/* <TableCell className='subject'>Subject</TableCell>
          <TableCell className='recipient'>Recipient</TableCell>
          <TableCell className='telecom'>Telecom</TableCell>
          <TableCell className='received' style={{minWidth: '100px'}}>Received</TableCell>
          <TableCell className='payload' style={style.hideOnPhone}>Payload</TableCell>
          <TableCell className='sent' style={{minWidth: '100px'}}>Sent</TableCell>
          <TableCell className='actionButton' style={{minWidth: '100px'}}>Action</TableCell> */}
          { renderIdentifierHeader() }
          { renderBarcodeHeader() }
        </TableRow>
      </TableHead>
      <TableBody>
        { tableRows }
      </TableBody>
    </Table>

  );
}



CommunicationRequestsTable.propTypes = {
  data: PropTypes.array,
  fhirVersion: PropTypes.string,
  query: PropTypes.object,
  communicationRequests: PropTypes.array,
  selectedCommunicationRequestId: PropTypes.string,
  paginationLimit: PropTypes.number,
  hideIdentifier: PropTypes.bool,
  hideCheckbox: PropTypes.bool,
  hideBarcodes: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideAuthoredOn: PropTypes.bool,
  hideRequestor: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideCategory: PropTypes.bool,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  formFactorLayout: PropTypes.string
};
CommunicationRequestsTable.defaultProps = {
  communicationRequests: [],
  hideIdentifier: false,
  hideCheckbox: true,
  hideBarcodes: false,
  hideActionIcons: true,
  hideAuthoredOn: false,
  hideRequestor: false,
  hideStatus: false,
  hideCategory: false,
  hideBarcode: false
}

export default CommunicationRequestsTable;