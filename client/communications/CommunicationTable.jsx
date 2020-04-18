import Avatar from 'material-ui/Avatar';
import { FlatButton, RaisedButton } from 'material-ui';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {Checkbox} from 'material-ui';

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go'

import { get } from 'lodash';
// import { Communications } from 'meteor/clinical:hl7-resource-communication';

export class CommunicationTable extends React.Component {
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

    console.log('CommunicationTable.data', data)
    return data;
  }
  rowClick(id){
    Session.set('communicationsUpsert', false);
    Session.set('selectedCommunication', id);
    Session.set('communicationPageTabIndex', 2);
  }
  renderCheckboxHeader(){
    if (!this.props.hideCheckboxes) {
      return (
        <th className="toggle">Checkbox</th>
      );
    }
  }
  renderCheckbox(communication){
    if (!this.props.hideCheckboxes) {
      let toggleValue = false;
      if(get(communication, 'status') === "active"){
        toggleValue = true;
      }
      return (
        <td className="toggle">
            <Checkbox
              defaultChecked={true}
              value={toggleValue}
              onCheck={this.toggleCommunicationStatus.bind(this, communication)}
            />
          </td>
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
        <th className='actionIcons' style={{minWidth: '120px'}}>Actions</th>
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
        <td className='actionIcons' style={{minWidth: '120px'}}>
          <FaTags style={iconStyle} onClick={this.onMetaClick.bind(this, questionnaire)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, questionnaire._id)} />  
        </td>
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
        <th className="identifier">Identifier</th>
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
        <td className={classNames}>{ get(questionnaire, 'identifier[0].value') }</td>       );
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
        <tr key={i} className="communicationRow" style={{cursor: "pointer"}}>
          { this.renderCheckbox(this.data.communications[i]) }
          { this.renderActionIcons(this.data.communications[i]) }
          <td className='subject' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].subject }</td>
          <td className='recipient' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].recipient }</td>
          <td className='telecom' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].telecom }</td>
          <td className='received' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].received }</td>
          <td className='category' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].category }</td>
          <td className='payload' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>{this.data.communications[i].payload }</td>
          <td className='status' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={ this.data.style.statusCell }>{this.data.communications[i].status }</td>
          <td className='sent' style={this.data.style.cell}>{ this.data.communications[i].sent }</td>
          <td className='actionButton' onClick={ this.rowClick.bind('this', this.data.communications[i]._id)} style={this.data.style.cell}>
            <FlatButton primary={false} label={buttonLabel} onClick={ this.sendCommunication.bind(this, this.data.communications[i]) } style={{marginTop: '-16px'}} />
          </td>
          { this.renderIdentifier(this.data.communications[i]) }
        </tr>
      );
    }


    return(
      <Table id='communicationsTable' hover >
        <thead>
          <tr>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
            <th className='subject'>Subject</th>
            <th className='recipient'>Recipient</th>
            <th className='telecom'>Telecom</th>
            <th className='received' style={{minWidth: '100px'}}>Received</th>
            <th className='category' style={this.data.style.hideOnPhone}>Category</th>
            <th className='payload' style={this.data.style.hideOnPhone}>Payload</th>
            <th className='status' style={this.data.style.hideOnPhone}>Status</th>
            <th className='sent' style={{minWidth: '100px'}}>Sent</th>
            <th className='actionButton' style={{minWidth: '100px'}}>Action</th>
            { this.renderIdentifierHeader() }
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>

    );
  }
}

CommunicationTable.propTypes = {
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

ReactMixin(CommunicationTable.prototype, ReactMeteorData);
export default CommunicationTable;