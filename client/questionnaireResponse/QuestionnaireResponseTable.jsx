import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { Session } from 'meteor/session';
import { has, get } from 'lodash';
import { TableNoData } from 'meteor/clinical:glass-ui'
import PropTypes from 'prop-types';
import {Checkbox} from 'material-ui';

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go'

flattenQuestionnaireResponse = function(questionnaireResponse){
  let result = {
    _id: questionnaireResponse._id,
    title: '',
    identifier: '',
    questionnaire: '',
    status: '',
    subject: '',
    encounter: '',
    author: '',
    date: '',
    count: '0'
  };


  // there's an off-by-1 error between momment() and Date() that we want
  // to account for when converting back to a string
  result.date = moment(questionnaireResponse.authored).add(1, 'days').format("YYYY-MM-DD HH:mm")
  result.questionnaire = get(questionnaireResponse, 'questionnaire.reference', '');
  result.encounter = get(questionnaireResponse, 'encounter.reference', '');
  result.subject = get(questionnaireResponse, 'subject.display', '');
  result.author = get(questionnaireResponse, 'author.display', '');
  result.identifier = get(questionnaireResponse, 'identifier[0].value', '');
  result.status = get(questionnaireResponse, 'status', '');

  let items = get(questionnaireResponse, 'item', []);

  result.count = items.length;
  
  return result;
}

export class QuestionnaireResponseTable extends React.Component {
  constructor(props) {
    super(props);
  }
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
          paddingTop: '16px',
          maxWidth: '120px'
        },
        cell: {
          paddingTop: '16px'
        },
        avatar: {
          // color: rgb(255, 255, 255);
          backgroundColor: 'rgb(188, 188, 188)',
          userSelect: 'none',
          borderRadius: '2px',
          height: '40px',
          width: '40px'
        }
      },
      selected: [],
      questionnaireResponses: []
    };

    let query = {};
    let options = {};

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }

    // but can be over-ridden by props being more explicit
    if(this.props.paginationLimit){
      options.limit = this.props.paginationLimit;      
    }

    // you can also choose ascending or descending sort order
    // on the field of your choice
    if(this.props.sort){
      if(Session.get('sortAscending')){
        options.sort[this.props.sort] = 1;
      } else {
        options.sort[this.props.sort] = -1;
      }
    } else {
      // but we default to the date the questionnaire was authored on by default
      options.sort = {};
      if(Session.get('sortAscending')){
        options.sort["authored"] = 1;
      } else {
        options.sort["authored"] = -1;
      }
    }

    // in fact, you can also over-ride the entire query
    if(this.props.query){
      query = this.props.query
    }


    if(this.props.data){
      // console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(patient){
          data.questionnaireResponses.push(flattenQuestionnaireResponse(patient));
        });  
      }
    } else {
      data.questionnaireResponses = QuestionnaireResponses.find(query, options).map(function(patient){
        return flattenQuestionnaireResponse(patient);
      });
    }


    // console.log("QuestionnaireResponseTable[data]", data);
    return data;
  }
  imgError(avatarId) {
    this.refs[avatarId].src = Meteor.absoluteUrl() + 'noAvatar.png';
  }
  rowClick(id){
    Session.set('questionnaireResponsesUpsert', false);
    Session.set('selectedQuestionnaireResponse', id);
    Session.set('patientPageTabIndex', 2);
  }
  renderRowAvatarHeader(){
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <th className='avatar'>photo</th>
      );
    }
  }
  renderRowAvatar(patient, avatarStyle){
    // console.log('renderRowAvatar', patient, avatarStyle)
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <td className='avatar'>
          <img src={patient.photo} ref={patient._id} onError={ this.imgError.bind(this, patient._id) } style={avatarStyle}/>
        </td>
      );
    }
  }
  renderSendButtonHeader(){
    if (this.props.showSendButton === true) {
      return (
        <th className='sendButton' style={this.data.style.hideOnPhone}></th>
      );
    }
  }
  renderSendButton(patient, avatarStyle){
    if (this.props.showSendButton === true) {
      return (
        <td className='sendButton' style={this.data.style.hideOnPhone}>
          <FlatButton label="send" onClick={this.onSend.bind('this', this.data.questionnaireResponses[i]._id)}/>
        </td>
      );
    }
  }
  onSend(id){
    let patient = QuestionnaireResponses.findOne({_id: id});

    console.log("QuestionnaireResponseTable.onSend()", patient);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/QuestionnaireResponse', {
      data: patient
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  onRowClick(responseId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(responseId);
    }
  }
  renderCheckboxHeader(){
    if (!this.props.hideCheckboxes) {
      return (
        <th className="toggle"></th>
      );
    }
  }
  onRowChecked(questionnaire, event, toggle){
    console.log('onRowChecked', questionnaire, toggle);
    let newStatus = 'draft';

    if(toggle){
      newStatus = 'active';
    } else {
      newStatus = 'draft';
    }

    Questionnaires._collection.update({_id: questionnaire._id}, {$set: {
      'status': newStatus
    }}, function(error, result){
      if(error){
        console.error('Questionnaire Error', error);
      }
    });
  }
  renderCheckbox(questionnaire){
    if (!this.props.hideCheckboxes) {
      let toggleValue = false;
      let defaultToggle = false;

      if(get(questionnaire, 'status') === "active"){
        toggleValue = true;
        defaultToggle = true;
      } else {
        toggleValue = false;
        defaultToggle = false;
      }
      return (
        <td className="toggle">
            <Checkbox
              defaultChecked={defaultToggle}
              value={toggleValue}
              onCheck={this.onRowChecked.bind(this, questionnaire)}
            />
          </td>
      );
    }
  }
  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      return (
        <th className="identifier">Identifier</th>
      );
    }
  }
  renderIdentifier(questionnaireResponse ){
    if (!this.props.hideIdentifier) {
      let classNames = 'identifier';
      if(this.props.barcodes){
        classNames = 'barcode identifier'
      }
      return (
        <td className={classNames}>{ get(questionnaireResponse, 'identifier') }</td>       );
    }
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
  removeRecord(_id){
    console.log('Remove questionnaire ', _id)
    if(this.props.onRemoveRecord){
      this.props.onRemoveRecord(_id);
    }
  }
  onActionButtonClick(id){
    if(typeof this.props.onActionButtonClick === "function"){
      this.props.onActionButtonClick(id);
    }
  }
  cellClick(id){
    if(typeof this.props.onCellClick === "function"){
      this.props.onCellClick(id);
    }
  }

  onMetaClick(patient){
    let self = this;
    if(this.props.onMetaClick){
      this.props.onMetaClick(self, patient);
    }
  }
  onCellClick(serviceRequestId){
    console.log('selectServiceRequestCell().serviceRequestId', serviceRequestId);
    if(typeof this.props.onCellClick === "function"){
      this.props.onCellClick(serviceRequestId);
    }
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.questionnaireResponses.length === 0){
      footer = <TableNoData noDataPadding={ this.props.noDataPadding } />
    } else {
      for (var i = 0; i < this.data.questionnaireResponses.length; i++) {
        tableRows.push(
          <tr key={i} className="patientRow" style={{cursor: "pointer"}} onClick={this.onRowClick.bind(this, this.data.questionnaireResponses[i]._id )} >
            { this.renderCheckbox(this.data.questionnaireResponses[i]) }
            { this.renderActionIcons(this.data.questionnaireResponses[i]) }

            {/* <td className='identifier' onClick={ this.rowClick.bind(this, this.data.questionnaireResponses[i]._id)} style={this.data.style.cell}>{this.data.questionnaireResponses[i].identifier }</td> */}
            {/* <td className='title' onClick={ this.rowClick.bind(this, this.data.questionnaireResponses[i]._id)} style={this.data.style.cell}>{this.data.questionnaireResponses[i].title }</td> */}
            <td className='questionnaire' onClick={ this.onCellClick.bind(this, this.data.questionnaireResponses[i]._id)} style={this.data.style.cell}>{this.data.questionnaireResponses[i].questionnaire }</td>
            <td className='subject' onClick={ this.onCellClick.bind(this, this.data.questionnaireResponses[i]._id)} style={this.data.style.cell}>{this.data.questionnaireResponses[i].subject }</td>
            <td className='status' onClick={ this.onCellClick.bind(this, this.data.questionnaireResponses[i]._id)} style={this.data.style.cell}>{this.data.questionnaireResponses[i].status }</td>
            <td className='date' onClick={ this.onCellClick.bind(this, this.data.questionnaireResponses[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.questionnaireResponses[i].date }</td>
            <td className='count' onClick={ this.onCellClick.bind(this, this.data.questionnaireResponses[i]._id)} style={this.data.style.cell}>{this.data.questionnaireResponses[i].count }</td>
            { this.renderIdentifier(this.data.questionnaireResponses[i]) }
          </tr>
        );
      }
    }
    


    return(
      <div>
        <Table id='questionnaireResponsesTable' hover >
          <thead>
            <tr>
              { this.renderCheckboxHeader() }
              { this.renderActionIconsHeader() }

              {/* <th className='identifier'>Identifier</th> */}
              {/* <th className='title'>Title</th> */}
              {/* <th className='author'>Author</th> */}
              <th className='questionnaire'>Questionnaire</th>
              {/* <th className='encounter'>Encounter</th> */}
              <th className='subject'>Subject</th>
              <th className='status'>Status</th>
              <th className='date' style={{minWidth: '100px'}}>Date</th>
              <th className='count'>Count</th>
              { this.renderIdentifierHeader() }
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </Table>
        { footer }
      </div>
    );
  }
}

QuestionnaireResponseTable.propTypes = {
  data: PropTypes.array,
  fhirVersion: PropTypes.string,
  query: PropTypes.object,
  sort: PropTypes.string,
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
  onCheck: PropTypes.func,
  actionButtonLabel: PropTypes.string
};
ReactMixin(QuestionnaireResponseTable.prototype, ReactMeteorData);
export default QuestionnaireResponseTable;