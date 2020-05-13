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

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { get } from 'lodash';
import moment from 'moment';


export class CommunicationResponsesTable extends React.Component {
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
      communicationResponses: []
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

    data.communicationResponses = CommunicationResponses.find(query, options).map(function(communicationResponse){
      let result = {
        _id: communicationResponse._id,
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

      if(get(communicationResponse, 'sent')){
        result.sent = moment(get(communicationResponse, 'sent')).add(1, 'days').format("YYYY-MM-DD hh:mm")
      }
      if(get(communicationResponse, 'received')){
        result.received = moment(get(communicationResponse, 'received')).add(1, 'days').format("YYYY-MM-DD")
      }

      let telecomString = "";
      let communicationResponseString = "";

      if(typeof get(communicationResponse, 'recipient[0].reference') === "string"){
        communicationResponseString = get(communicationResponse, 'recipient[0].reference', '');
      } else if(typeof get(communicationResponse, 'recipient.reference') === "string"){
        communicationResponseString = get(communicationResponse, 'recipient.reference', '');
      }
      
      if(communicationResponseString.split("/")[1]){
        telecomString = communicationResponseString.split("/")[1];
      } else {
        telecomString = communicationResponseString;
      }

      if(telecomString.length > 0){
        result.telecom = telecomString;
      } else {
        result.telecom = get(communicationResponse, 'telecom[0].value', '');
      }

      result.subject = get(communicationResponse, 'subject.display') ? get(communicationResponse, 'subject.display') : get(communicationResponse, 'subject.reference')
      result.recipient = get(communicationResponse, 'recipient[0].display') ? get(communicationResponse, 'recipient[0].display') : get(communicationResponse, 'recipient[0].reference')
      result.identifier = get(communicationResponse, 'identifier[0].type.text');
      result.category = get(communicationResponse, 'category[0].text');
      result.payload = get(communicationResponse, 'payload[0].contentString');
      result.status = get(communicationResponse, 'status');

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

    console.log('CommunicationResponsesTable.data', data)
    return data;
  }
  rowClick(id){
    Session.set('communicationResponsesUpsert', false);
    Session.set('selectedCommunicationResponse', id);
    Session.set('communicationResponsePageTabIndex', 2);
  }
  renderCheckboxHeader(){
    if (!this.props.hideCheckboxes) {
      return (
        <TableCell className="toggle">Checkbox</TableCell>
      );
    }
  }
  renderCheckbox(communicationResponse){
    if (!this.props.hideCheckboxes) {
      let toggleValue = false;
      if(get(communicationResponse, 'status') === "active"){
        toggleValue = true;
      }
      return (
        <TableCell className="toggle">
          <Checkbox
            defaultChecked={true}
            value={toggleValue}
            onCheck={this.toggleCommunicationResponseStatus.bind(this, communicationResponse)}
          />
        </TableCell>
      );
    }
  }
  toggleCommunicationResponseStatus(communicationResponse, event, toggle){
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
    console.log('Remove communicationResponse ', _id)
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
  renderActionButtonHeader(){
    if (!this.props.hideActionButton) {
      return (
        <TableCell className="actionButton">Action</TableCell>
      );
    }
  }
  renderActionButton(questionnaireId ){
    if (!this.props.hideActionButton) {
      let actionButtonLabel = "Send";
      if(this.props.actionButtonLabel){
        actionButtonLabel = this.props.actionButtonLabel;
      }

      return (
        <TableCell className="actionButton">
          <Button color="primary" onClick={handeActionButtonClick.bind(this, questionnaireId)}>{actionButtonLabel}</Button>
        </TableCell>       );
    }
  }
  handleActionButtonClick(id){
    if(typeof this.props.onActionButtonClick === "function"){
      this.props.onActionButtonClick(id)
    }
  }
  onSend(id){
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
  sendCommunicationResponse(communicationResponse){
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
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.communicationResponses.length; i++) {

      let sendButton;
      let buttonLabel = "Send";

      if(this.props.actionButtonLabel){
        buttonLabel = this.props.actionButtonLabel;
      }
      
      let statusCell = {
        fontWeight: 400,
        color: 'black'
      }

      if(this.data.communicationResponses[i].status === "completed"){
        statusCell.color = "green";
      }
      if(this.data.communicationResponses[i].status === "in-progress"){
        statusCell.color = "darkgoldenrod";
      }  

      if(this.data.communicationResponses[i].sent){
        buttonLabel = "Resend";
      } 

      tableRows.push(
        <TableRow key={i} className="communicationResponseRow" style={{cursor: "pointer"}} hover={true}>
          { this.renderCheckbox(this.data.communicationResponses[i]) }
          { this.renderActionIcons(this.data.communicationResponses[i]) }
          <TableCell className='subject' onClick={ this.rowClick.bind('this', this.data.communicationResponses[i]._id)} style={this.data.style.cell}>{this.data.communicationResponses[i].subject }</TableCell>
          <TableCell className='recipient' onClick={ this.rowClick.bind('this', this.data.communicationResponses[i]._id)} style={this.data.style.cell}>{this.data.communicationResponses[i].recipient }</TableCell>
          <TableCell className='telecom' onClick={ this.rowClick.bind('this', this.data.communicationResponses[i]._id)} style={this.data.style.cell}>{this.data.communicationResponses[i].telecom }</TableCell>
          <TableCell className='received' onClick={ this.rowClick.bind('this', this.data.communicationResponses[i]._id)} style={this.data.style.cell}>{this.data.communicationResponses[i].received }</TableCell>
          <TableCell className='category' onClick={ this.rowClick.bind('this', this.data.communicationResponses[i]._id)} style={this.data.style.cell}>{this.data.communicationResponses[i].category }</TableCell>
          <TableCell className='payload' onClick={ this.rowClick.bind('this', this.data.communicationResponses[i]._id)} style={this.data.style.cell}>{this.data.communicationResponses[i].payload }</TableCell>
          <TableCell className='status' onClick={ this.rowClick.bind('this', this.data.communicationResponses[i]._id)} style={ this.data.style.statusCell }>{this.data.communicationResponses[i].status }</TableCell>
          <TableCell className='sent' style={this.data.style.cell}>{ this.data.communicationResponses[i].sent }</TableCell>
          <TableCell className='actionButton' onClick={ this.rowClick.bind('this', this.data.communicationResponses[i]._id)} style={this.data.style.cell}>
            <Button primary={false} onClick={ this.sendCommunicationResponse.bind(this, this.data.communicationResponses[i]) } style={{marginTop: '-16px'}}>{buttonLabel}</Button>
          </TableCell>
          { this.renderIdentifier(this.data.communicationResponses[i]) }
          { this.renderActionButton(this.data.communicationResponses[i].id) }
        </TableRow>
      );
    }


    return(
      <Table id='communicationResponsesTable' >
        <TableHead>
          <TableRow>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
            <TableCell className='subject'>Subject</TableCell>
            <TableCell className='recipient'>Recipient</TableCell>
            <TableCell className='telecom'>Telecom</TableCell>
            <TableCell className='received' style={{minWidth: '100px'}}>Received</TableCell>
            <TableCell className='category' style={this.data.style.hideOnPhone}>Category</TableCell>
            <TableCell className='payload' style={this.data.style.hideOnPhone}>Payload</TableCell>
            <TableCell className='status' style={this.data.style.hideOnPhone}>Status</TableCell>
            <TableCell className='sent' style={{minWidth: '100px'}}>Sent</TableCell>
            <TableCell className='actionButton' style={{minWidth: '100px'}}>Action</TableCell>
            { this.renderIdentifierHeader() }
            { this.renderActionButtonHeader() }
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>

    );
  }
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
  actionButtonLabel: PropTypes.string
};

ReactMixin(CommunicationResponsesTable.prototype, ReactMeteorData);
export default CommunicationResponsesTable;