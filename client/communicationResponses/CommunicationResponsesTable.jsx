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

import { get } from 'lodash';
import moment from 'moment';


import { FhirDehydrator, StyledCard, PageCanvas } from 'fhir-starter';



function CommunicationResponsesTable(props){

  let {
    data,
    fhirVersion,
    query,
    communicationResponses,
    paginationLimit,
    hideIdentifier,
    hideCheckboxes,
    hideBarcodes,
    hideActionIcons,
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    actionButtonLabel,
    formFactorLayout
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

  // ------------------------------------------------------------------------
  // Column Methods

  function rowClick(id){
    Session.set('communicationResponsesUpsert', false);
    Session.set('selectedCommunicationResponse', id);
    Session.set('communicationResponsePageTabIndex', 2);
  }
  function renderCheckboxHeader(){
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle">Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(communicationResponse){
    if (!props.hideCheckboxes) {
      let toggleValue = false;
      if(get(communicationResponse, 'status') === "active"){
        toggleValue = true;
      }
      return (
        <TableCell className="toggle">
          <Checkbox
            defaultChecked={true}
            value={toggleValue}
            onCheck={toggleCommunicationResponseStatus.bind(this, communicationResponse)}
          />
        </TableCell>
      );
    }
  }
  function toggleCommunicationResponseStatus(communicationResponse, event, toggle){
    console.log('toggleCommunicationResponseStatus', communicationResponse, toggle);
    let newStatus = 'draft';

    if(toggle){
      newStatus = 'active';
    } else {
      newStatus = 'draft';
    }

    CommunicationResponses._collection.update({_id: communicationResponse._id}, {$set: {
      'status': newStatus
    }}, function(error, result){
      if(error){
        console.error('CommunicationResponse Error', error);
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
  function onMetaClick(patient){
    let self = this;
    if(props.onMetaClick){
      props.onMetaClick(self, patient);
    }
  }
  function removeRecord(_id){
    console.log('Remove communicationResponse ', _id)
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
  function renderActionButtonHeader(){
    if (!props.hideActionButton) {
      return (
        <TableCell className="actionButton">Action</TableCell>
      );
    }
  }
  function renderActionButton(questionnaireId ){
    if (!props.hideActionButton) {
      let actionButtonLabel = "Send";
      if(props.actionButtonLabel){
        actionButtonLabel = props.actionButtonLabel;
      }

      return (
        <TableCell className="actionButton">
          <Button color="primary" onClick={handeActionButtonClick.bind(this, questionnaireId)}>{actionButtonLabel}</Button>
        </TableCell>       );
    }
  }
  function handleActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id)
    }
  }
  function onSend(id){
      let communicationResponse = CommunicationResponses.findOne({_id: id});
    
      var httpEndpoint = "http://localhost:8080";
      if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
        httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
      }
      HTTP.post(httpEndpoint + '/CommunicationResponse', {
        data: communicationResponse
      }, function(error, result){
        if (error) {
          console.log("error", error);
        }
        if (result) {
          console.log("result", result);
        }
      });
  }
  function sendCommunicationResponse(communicationResponse){
    console.log('sendCommunicationResponse', communicationResponse)

    // TODO:

    switch (get(communicationResponse, 'category')) {
      case 'SMS Text Message':
        if(communicationResponse.telecom && (typeof communicationResponse.telecom === "string")){
          console.log('Sending SMS Text Message', communicationResponse.payload, communicationResponse.telecom)
          Meteor.call('sendTwilioMessage', communicationResponse.payload, communicationResponse.telecom)
          CommunicationResponses.update({_id: communicationResponse._id}, {$set: {
            sent: new Date()
          }})  
        }
        break;    
      default:
        break;
    }
  }


  // ------------------------------------------------------------------------
  // Render

  let tableRows = [];
    for (var i = 0; i < data.communicationResponses.length; i++) {

      let sendButton;
      let buttonLabel = "Send";

      if(props.actionButtonLabel){
        buttonLabel = props.actionButtonLabel;
      }
      
      let statusCell = {
        fontWeight: 400,
        color: 'black'
      }

      if(data.communicationResponses[i].status === "completed"){
        statusCell.color = "green";
      }
      if(data.communicationResponses[i].status === "in-progress"){
        statusCell.color = "darkgoldenrod";
      }  

      if(data.communicationResponses[i].sent){
        buttonLabel = "Resend";
      } 

      tableRows.push(
        <TableRow key={i} className="communicationResponseRow" style={{cursor: "pointer"}} hover={true}>
          { renderCheckbox(data.communicationResponses[i]) }
          { renderActionIcons(data.communicationResponses[i]) }
          <TableCell className='subject' onClick={ rowClick.bind('this', data.communicationResponses[i]._id)} style={data.style.cell}>{data.communicationResponses[i].subject }</TableCell>
          <TableCell className='recipient' onClick={ rowClick.bind('this', data.communicationResponses[i]._id)} style={data.style.cell}>{data.communicationResponses[i].recipient }</TableCell>
          <TableCell className='telecom' onClick={ rowClick.bind('this', data.communicationResponses[i]._id)} style={data.style.cell}>{data.communicationResponses[i].telecom }</TableCell>
          <TableCell className='received' onClick={ rowClick.bind('this', data.communicationResponses[i]._id)} style={data.style.cell}>{data.communicationResponses[i].received }</TableCell>
          <TableCell className='category' onClick={ rowClick.bind('this', data.communicationResponses[i]._id)} style={data.style.cell}>{data.communicationResponses[i].category }</TableCell>
          <TableCell className='payload' onClick={ rowClick.bind('this', data.communicationResponses[i]._id)} style={data.style.cell}>{data.communicationResponses[i].payload }</TableCell>
          <TableCell className='status' onClick={ rowClick.bind('this', data.communicationResponses[i]._id)} style={ data.style.statusCell }>{data.communicationResponses[i].status }</TableCell>
          <TableCell className='sent' style={data.style.cell}>{ data.communicationResponses[i].sent }</TableCell>
          <TableCell className='actionButton' onClick={ rowClick.bind('this', data.communicationResponses[i]._id)} style={data.style.cell}>
            <Button primary={false} onClick={ sendCommunicationResponse.bind(this, data.communicationResponses[i]) } style={{marginTop: '-16px'}}>{buttonLabel}</Button>
          </TableCell>
          { renderIdentifier(data.communicationResponses[i]) }
          { renderActionButton(data.communicationResponses[i].id) }
        </TableRow>
      );
    }

  
  return(
    <Table id='communicationResponsesTable' >
      <TableHead>
        <TableRow>
          { renderCheckboxHeader() }
          { renderActionIconsHeader() }
          <TableCell className='subject'>Subject</TableCell>
          <TableCell className='recipient'>Recipient</TableCell>
          <TableCell className='telecom'>Telecom</TableCell>
          <TableCell className='received' style={{minWidth: '100px'}}>Received</TableCell>
          <TableCell className='category' style={data.style.hideOnPhone}>Category</TableCell>
          <TableCell className='payload' style={data.style.hideOnPhone}>Payload</TableCell>
          <TableCell className='status' style={data.style.hideOnPhone}>Status</TableCell>
          <TableCell className='sent' style={{minWidth: '100px'}}>Sent</TableCell>
          <TableCell className='actionButton' style={{minWidth: '100px'}}>Action</TableCell>
          { renderIdentifierHeader() }
          { renderActionButtonHeader() }
        </TableRow>
      </TableHead>
      <TableBody>
        { tableRows }
      </TableBody>
    </Table>

  );
}



CommunicationResponsesTable.propTypes = {
  data: PropTypes.array,
  fhirVersion: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  hideIdentifier: PropTypes.bool,
  hideCheckboxes: PropTypes.bool,
  hideBarcodes: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  formFactorLayout: PropTypes.string
};

export default CommunicationResponsesTable;