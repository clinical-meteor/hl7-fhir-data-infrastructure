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
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { get } from 'lodash';
import moment from 'moment';

import { FhirUtilities } from '../../lib/FhirUtilities';
// import FhirDehydrator, { flattenCondition } from '../../lib/FhirDehydrator';


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
}


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
    selectedConditionId,

    query,
    paginationLimit,
    disablePagination,
  
    hideCheckbox,
    hideActionIcons,
    hideIdentifier,
    hidePatientName,
    hidePatientReference,
    hideAsserterName,
    hideClinicalStatus,
    hideSnomedCode,
    hideSnomedDisplay,
    hideVerification,
    hideSeverity,
    hideEvidence,
    hideDates,
    hideEndDate,
    hideBarcode,
  
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


  //---------------------------------------------------------------------
  // Column Rendering

  function renderCheckboxHeader(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (!hideCheckbox) {
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
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, condition._id)} /> */}
        </TableCell>
      );
    }
  } 

  function rowClick(id){
    Session.set('communicationsUpsert', false);
    Session.set('selectedCommunication', id);
    Session.set('communicationPageTabIndex', 2);
  }
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
  function removeRecord(_id){
    console.log('Remove communication ', _id)
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
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

  //----------------------------------------------------------
  // Render

  let tableRows = [];
    for (var i = 0; i < communications.length; i++) {

      let sendButton;
      let buttonLabel = "Send";

      if(props.actionButtonLabel){
        buttonLabel = props.actionButtonLabel;
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

      tableRows.push(
        <TableRow key={i} className="communicationRow" style={{cursor: "pointer"}} hover={true}>
          { renderCheckbox(communications[i]) }
          { renderActionIcons(communications[i]) }
          { renderIdentifier(communications[i]) }
          <TableCell className='subject' onClick={ rowClick.bind('this', communications[i]._id)} >{communications[i].subject }</TableCell>
          <TableCell className='recipient' onClick={ rowClick.bind('this', communications[i]._id)} >{communications[i].recipient }</TableCell>
          <TableCell className='telecom' onClick={ rowClick.bind('this', communications[i]._id)} >{communications[i].telecom }</TableCell>
          <TableCell className='received' onClick={ rowClick.bind('this', communications[i]._id)} >{communications[i].received }</TableCell>
          <TableCell className='category' onClick={ rowClick.bind('this', communications[i]._id)} >{communications[i].category }</TableCell>
          <TableCell className='payload' onClick={ rowClick.bind('this', communications[i]._id)} >{communications[i].payload }</TableCell>
          <TableCell className='status' onClick={ rowClick.bind('this', communications[i]._id)} >{communications[i].status }</TableCell>
          <TableCell className='sent' style={style.cell}>{ communications[i].sent }</TableCell>
          <TableCell className='actionButton' onClick={ rowClick.bind('this', communications[i]._id)} >
            <Button color="primary" onClick={ sendCommunication.bind(this, communications[i]) } style={{marginTop: '-16px'}}>{buttonLabel}</Button>
          </TableCell>
        </TableRow>
      );
    }

  return(
    <Table id='communicationsTable' >
      <TableHead>
        <TableRow>
          { renderCheckboxHeader() }
          { renderActionIconsHeader() }
          { renderIdentifierHeader() }
          <TableCell className='subject'>Subject</TableCell>
          <TableCell className='recipient'>Recipient</TableCell>
          <TableCell className='telecom'>Telecom</TableCell>
          <TableCell className='received'>Received</TableCell>
          <TableCell className='category'>Category</TableCell>
          <TableCell className='payload'>Payload</TableCell>
          <TableCell className='status'>Status</TableCell>
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
  data: PropTypes.array,
  fhirVersion: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  hideIdentifier: PropTypes.bool,
  hideCheckbox: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  formFactorLayout: PropTypes.string
};

export default CommunicationsTable;