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


export class CommunicationRequestsTable extends React.Component {
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
      communicationRequests: []
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

    data.communicationRequests = CommunicationRequests.find(query, options).map(function(communicationRequest){
      let result = {
        _id: communicationRequest._id,
        id: '',
        authoredOn: '',
        subject: '',
        subjectReference: '',
        recipient: '',
        identifier: '',
        telecom: '',
        sent: '',
        received: '',
        category: '',
        payload: '',
        status: '',
        requester: ''
      };

      if(get(communicationRequest, 'sent')){
        result.sent = moment(get(communicationRequest, 'sent')).add(1, 'days').format("YYYY-MM-DD hh:mm")
      }
      if(get(communicationRequest, 'received')){
        result.received = moment(get(communicationRequest, 'received')).add(1, 'days').format("YYYY-MM-DD")
      }

      if(get(communicationRequest, 'authoredOn')){
        result.authoredOn = moment(get(communicationRequest, 'authoredOn')).format("YYYY-MM-DD hh:mm")
      }

      let telecomString = "";
      let communicationRequestString = "";

      if(typeof get(communicationRequest, 'recipient[0].reference') === "string"){
        communicationRequestString = get(communicationRequest, 'recipient[0].reference', '');
      } else if(typeof get(communicationRequest, 'recipient.reference') === "string"){
        communicationRequestString = get(communicationRequest, 'recipient.reference', '');
      }
      
      if(communicationRequestString.split("/")[1]){
        telecomString = communicationRequestString.split("/")[1];
      } else {
        telecomString = communicationRequestString;
      }

      if(telecomString.length > 0){
        result.telecom = telecomString;
      } else {
        result.telecom = get(communicationRequest, 'telecom[0].value', '');
      }

      result.subject = get(communicationRequest, 'subject.display') ? get(communicationRequest, 'subject.display') : get(communicationRequest, 'subject.reference')
      result.recipient = get(communicationRequest, 'recipient[0].display') ? get(communicationRequest, 'recipient[0].display') : get(communicationRequest, 'recipient[0].reference')
      result.identifier = get(communicationRequest, 'identifier[0].value');
      result.category = get(communicationRequest, 'category[0].text');
      result.payload = get(communicationRequest, 'payload[0].contentString');
      result.status = get(communicationRequest, 'status');
      result.id = get(communicationRequest, 'id');

      result.requester = get(communicationRequest, 'requester.display');

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

    console.log('CommunicationRequestsTable.data', data)
    return data;
  }
  rowClick(id){
    Session.set('communicationRequestsUpsert', false);
    Session.set('selectedCommunicationRequest', id);
    Session.set('communicationRequestPageTabIndex', 2);
  }
  renderCheckboxHeader(){
    if (!this.props.hideCheckbox) {
      return (
        <TableCell className="toggle">Checkbox</TableCell>
      );
    }
  }
  renderCheckbox(communicationRequest){
    if (!this.props.hideCheckbox) {
      let toggleValue = false;
      if(get(communicationRequest, 'status') === "active"){
        toggleValue = true;
      }
      return (
        <TableCell className="toggle">
          <Checkbox
            defaultChecked={true}
            value={toggleValue}
            onCheck={this.toggleCommunicationRequestStatus.bind(this, communicationRequest)}
          />
        </TableCell>
      );
    }
  }
  toggleCommunicationRequestStatus(communicationRequest, event, toggle){
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
    console.log('Remove communicationRequest ', _id)
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
  sendCommunicationRequest(communicationRequest){
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
  renderAuthoredOn(authoredOn){
    if (!this.props.hideAuthoredOn) {
      return (
        <TableCell className='authoredOn'>{ authoredOn }</TableCell>
      );
    }
  }
  renderAuthoredOnHeader(){
    if (!this.props.hideAuthoredOn) {
      return (
        <TableCell className='authoredOn' style={{minWidth: '140px'}}>Authored On</TableCell>
      );
    }
  }
  renderRequestor(requester){
    if (!this.props.hideRequestor) {
      return (
        <TableCell className='requester'>{ requester }</TableCell>
      );
    }
  }
  renderRequestorHeader(){
    if (!this.props.hideRequestor) {
      return (
        <TableCell className='requester' style={{minWidth: '140px'}}>Requestor</TableCell>
      );
    }
  }
  renderStatus(status){
    if (!this.props.hideStatus) {
      return (
        <TableCell className='status'>{ status }</TableCell>
      );
    }
  }
  renderStatusHeader(){
    if (!this.props.hideStatus) {
      return (
        <TableCell className='status'>Status</TableCell>
      );
    }
  }
  renderCategory(category){
    if (!this.props.hideCategory) {
      return (
        <TableCell className='category'>{ category }</TableCell>
      );
    }
  }
  renderCategoryHeader(){
    if (!this.props.hideCategory) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  renderBarcode(id){
    if (!this.props.hideBarcode) {
      return (
        <TableCell className='id'>{ id }</TableCell>
      );
    }
  }
  renderBarcodeHeader(){
    if (!this.props.hideBarcode) {
      return (
        <TableCell className='id'>System Id</TableCell>
      );
    }
  }
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.communicationRequests.length; i++) {

      let sendButton;
      let buttonLabel = "Send";

      if(this.props.actionButtonLabel){
        buttonLabel = this.props.actionButtonLabel;
      }
      
      let statusCell = {
        fontWeight: 400,
        color: 'black'
      }

      if(this.data.communicationRequests[i].status === "completed"){
        statusCell.color = "green";
      }
      if(this.data.communicationRequests[i].status === "in-progress"){
        statusCell.color = "darkgoldenrod";
      }  

      if(this.data.communicationRequests[i].sent){
        buttonLabel = "Resend";
      } 

      tableRows.push(
        <TableRow key={i} className="communicationRequestRow" style={{cursor: "pointer"}} hover={true}>
          { this.renderCheckbox(this.data.communicationRequests[i]) }
          { this.renderActionIcons(this.data.communicationRequests[i]) }
          { this.renderAuthoredOn(this.data.communicationRequests[i].authoredOn) }
          { this.renderStatus(this.data.communicationRequests[i].status) }
          { this.renderCategory(this.data.communicationRequests[i].category) }
          { this.renderRequestor(this.data.communicationRequests[i].requester) }
          
          {/* <TableCell className='subject' onClick={ this.rowClick.bind('this', this.data.communicationRequests[i]._id)} style={this.data.style.cell}>{this.data.communicationRequests[i].subject }</TableCell>
          <TableCell className='recipient' onClick={ this.rowClick.bind('this', this.data.communicationRequests[i]._id)} style={this.data.style.cell}>{this.data.communicationRequests[i].recipient }</TableCell>
          <TableCell className='telecom' onClick={ this.rowClick.bind('this', this.data.communicationRequests[i]._id)} style={this.data.style.cell}>{this.data.communicationRequests[i].telecom }</TableCell>
          <TableCell className='received' onClick={ this.rowClick.bind('this', this.data.communicationRequests[i]._id)} style={this.data.style.cell}>{this.data.communicationRequests[i].received }</TableCell>
          <TableCell className='payload' onClick={ this.rowClick.bind('this', this.data.communicationRequests[i]._id)} style={this.data.style.cell}>{this.data.communicationRequests[i].payload }</TableCell>
          <TableCell className='sent' style={this.data.style.cell}>{ this.data.communicationRequests[i].sent }</TableCell>
          <TableCell className='actionButton' onClick={ this.rowClick.bind('this', this.data.communicationRequests[i]._id)} style={this.data.style.cell}>
            <Button primary={false} onClick={ this.sendCommunicationRequest.bind(this, this.data.communicationRequests[i]) } style={{marginTop: '-16px'}}>{buttonLabel}</Button>
          </TableCell> */}
          { this.renderIdentifier(this.data.communicationRequests[i]) }
          { this.renderBarcode(this.data.communicationRequests[i].id) }
        </TableRow>
      );
    }


    return(
      <Table id='communicationRequestsTable' >
        <TableHead>
          <TableRow>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
            { this.renderAuthoredOnHeader() }
            { this.renderStatusHeader() }
            { this.renderCategoryHeader() }
            { this.renderRequestorHeader() }
            {/* <TableCell className='subject'>Subject</TableCell>
            <TableCell className='recipient'>Recipient</TableCell>
            <TableCell className='telecom'>Telecom</TableCell>
            <TableCell className='received' style={{minWidth: '100px'}}>Received</TableCell>
            <TableCell className='payload' style={this.data.style.hideOnPhone}>Payload</TableCell>
            <TableCell className='sent' style={{minWidth: '100px'}}>Sent</TableCell>
            <TableCell className='actionButton' style={{minWidth: '100px'}}>Action</TableCell> */}
            { this.renderIdentifierHeader() }
            { this.renderBarcodeHeader() }
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>

    );
  }
}

CommunicationRequestsTable.propTypes = {
  data: PropTypes.array,
  fhirVersion: PropTypes.string,
  query: PropTypes.object,
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
  actionButtonLabel: PropTypes.string
};
CommunicationRequestsTable.defaultProps = {
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

ReactMixin(CommunicationRequestsTable.prototype, ReactMeteorData);
export default CommunicationRequestsTable;