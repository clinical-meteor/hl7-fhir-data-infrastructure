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

export class CommunicationsTable extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        hideOnPhone: {
          visibility: 'visible',
          display: 'table'
        },
        cellHideOnPhone: {
          visibility: 'visible',
          display: 'table',
          paddingTop: '16px'
        },
        cell: {
          paddingTop: '16px'
        },
        statusCell: {
          paddingTop: '16px'
        },
        avatar: {
          backgroundColor: 'rgb(188, 188, 188)',
          userSelect: 'none',
          borderRadius: '2px',
          height: '40px',
          width: '40px'
        }
      },
      selected: [],
      communications: []
    };

    let query = {};
    let options = {};

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }

    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    data.communications = Communications.find(query, options).map(function(communication){
      let result = {
        _id: communication._id,
        subject: '',
        subjectReference: '',
        recipient: '',
        identifier: '',
        telecom: '',
        sent: '',
        received: '',
        category: '',
        payload: '',
        status: ''
      };

      if(get(communication, 'sent')){
        result.sent = moment(get(communication, 'sent')).add(1, 'days').format("YYYY-MM-DD hh:mm")
      }
      if(get(communication, 'received')){
        result.received = moment(get(communication, 'received')).add(1, 'days').format("YYYY-MM-DD")
      }

      let telecomString = "";
      let communicationString = "";

      if(typeof get(communication, 'recipient[0].reference') === "string"){
        communicationString = get(communication, 'recipient[0].reference', '');
      } else if(typeof get(communication, 'recipient.reference') === "string"){
        communicationString = get(communication, 'recipient.reference', '');
      }
      
      if(communicationString.split("/")[1]){
        telecomString = communicationString.split("/")[1];
      } else {
        telecomString = communicationString;
      }

      if(telecomString.length > 0){
        result.telecom = telecomString;
      } else {
        result.telecom = get(communication, 'telecom[0].value', '');
      }

      result.subject = get(communication, 'subject.display') ? get(communication, 'subject.display') : get(communication, 'subject.reference')
      result.recipient = get(communication, 'recipient[0].display') ? get(communication, 'recipient[0].display') : get(communication, 'recipient[0].reference')
      result.identifier = get(communication, 'identifier[0].type.text');
      result.category = get(communication, 'category[0].text');
      result.payload = get(communication, 'payload[0].contentString');
      result.status = get(communication, 'status');

      return result;
    });

    if (Session.get('appWidth') < 768) {
      data.style.hideOnPhone.visibility = 'hidden';
      data.style.hideOnPhone.display = 'none';
      data.style.cellHideOnPhone.visibility = 'hidden';
      data.style.cellHideOnPhone.display = 'none';
    } else {
      data.style.hideOnPhone.visibility = 'visible';
      data.style.hideOnPhone.display = 'table-cell';
      data.style.cellHideOnPhone.visibility = 'visible';
      data.style.cellHideOnPhone.display = 'table-cell';
    }

    console.log('CommunicationsTable.data', data)
    return data;
  }
  rowClick(id){
    Session.set('communicationsUpsert', false);
    Session.set('selectedCommunication', id);
    Session.set('communicationPageTabIndex', 2);
  }
  renderCheckboxHeader(){
    if (!this.props.hideCheckbox) {
      return (
        <TableCell className="toggle">Checkbox</TableCell>
      );
    }
  }
  renderCheckbox(communication){
    if (!this.props.hideCheckbox) {
      let toggleValue = false;
      if(get(communication, 'status') === "active"){
        toggleValue = true;
      }
      return (
        <TableCell className="toggle">
            <Checkbox
              defaultChecked={true}
              value={toggleValue}
              onCheck={this.toggleCommunicationStatus.bind(this, communication)}
            />
          </TableCell>
      );
    }
  }
  toggleCommunicationStatus(communication, event, toggle){
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
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>Actions</TableCell>
      );
    }
  }
  renderActionIcons(questionnaire ){
    if (!this.props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={this.onMetaClick.bind(this, questionnaire)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, questionnaire._id)} />   */}
        </TableCell>
      );
    }
  } 
  onMetaClick(patient){
    let self = this;
    if(this.props.onMetaClick){
      this.props.onMetaClick(self, patient);
    }
  }
  removeRecord(_id){
    console.log('Remove communication ', _id)
    if(this.props.onRemoveRecord){
      this.props.onRemoveRecord(_id);
    }
  }
  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      return (
        <TableCell className="identifier">Identifier</TableCell>
      );
    }
  }
  renderIdentifier(questionnaire ){
    if (!this.props.hideIdentifier) {
      let classNames = 'identifier';
      if(this.props.barcodes){
        classNames = 'barcode identifier'
      }
      return (
        <TableCell className={classNames}>{ get(questionnaire, 'identifier[0].value') }</TableCell>       );
    }
  }
  onSend(id){
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
  sendCommunication(communication){
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
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.communications.length; i++) {

      let sendButton;
      let buttonLabel = "Send";

      if(this.props.actionButtonLabel){
        buttonLabel = this.props.actionButtonLabel;
      }
      
      let statusCell = {
        fontWeight: 400,
        color: 'black'
      }

      if(this.data.communications[i].status === "completed"){
        statusCell.color = "green";
      }
      if(this.data.communications[i].status === "in-progress"){
        statusCell.color = "darkgoldenrod";
      }  

      if(this.data.communications[i].sent){
        buttonLabel = "Resend";
      } 

      tableRows.push(
        <TableRow key={i} className="communicationRow" style={{cursor: "pointer"}} hover={true}>
          { this.renderCheckbox(this.data.communications[i]) }
          { this.renderActionIcons(this.data.communications[i]) }
          { this.renderIdentifier(this.data.communications[i]) }
          <TableCell className='subject' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].subject }</TableCell>
          <TableCell className='recipient' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].recipient }</TableCell>
          <TableCell className='telecom' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].telecom }</TableCell>
          <TableCell className='received' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].received }</TableCell>
          <TableCell className='category' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].category }</TableCell>
          <TableCell className='payload' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].payload }</TableCell>
          <TableCell className='status' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={ this.data.style.statusCell }>{this.data.communications[i].status }</TableCell>
          <TableCell className='sent' style={this.data.style.cell}>{ this.data.communications[i].sent }</TableCell>
          <TableCell className='actionButton' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>
            <Button color="primary" onClick={ this.sendCommunication.bind(this, this.data.communications[i]) } style={{marginTop: '-16px'}}>{buttonLabel}</Button>
          </TableCell>
        </TableRow>
      );
    }


    return(
      <Table id='communicationsTable' >
        <TableHead>
          <TableRow>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
            { this.renderIdentifierHeader() }
            <TableCell className='subject'>Subject</TableCell>
            <TableCell className='recipient'>Recipient</TableCell>
            <TableCell className='telecom'>Telecom</TableCell>
            <TableCell className='received' style={{minWidth: '100px'}}>Received</TableCell>
            <TableCell className='category' style={this.data.style.hideOnPhone}>Category</TableCell>
            <TableCell className='payload' style={this.data.style.hideOnPhone}>Payload</TableCell>
            <TableCell className='status' style={this.data.style.hideOnPhone}>Status</TableCell>
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

ReactMixin(CommunicationsTable.prototype, ReactMeteorData);
export default CommunicationsTable;