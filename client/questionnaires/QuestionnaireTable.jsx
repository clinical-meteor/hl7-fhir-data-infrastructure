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

flattenQuestionnaire = function(questionnaire){
  let result = {
    _id: questionnaire._id,
    title: '',
    state: '',
    date: '',
    items: 0
  };

  result.date = moment(questionnaire.date).add(1, 'days').format("YYYY-MM-DD")
  result.title = get(questionnaire, 'title', '');
  result.status = get(questionnaire, 'status', '');
  result.items = get(questionnaire, 'item', []).length;
  
  return result;
}

export class QuestionnaireTable extends React.Component {
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
      questionnaires: []
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

    if(this.props.data){
      // console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(questionnaire){
          data.questionnaires.push(flattenQuestionnaire(questionnaire));
        });  
      }
    } else {
      data.questionnaires = Questionnaires.find().map(function(questionnaire){
        return flattenQuestionnaire(questionnaire);
      });
    }


    console.log("QuestionnaireTable[data]", data);
    return data;
  }
  imgError(avatarId) {
    this.refs[avatarId].src = Meteor.absoluteUrl() + 'noAvatar.png';
  }
  rowClick(id){
    Session.set('questionnairesUpsert', false);
    Session.set('selectedQuestionnaire', id);
    // Session.set('questionnairePageTabIndex', 2);
  }
  renderRowAvatarHeader(){
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <th className='avatar'>photo</th>
      );
    }
  }
  renderRowAvatar(questionnaire, avatarStyle){
    console.log('renderRowAvatar', questionnaire, avatarStyle)
    if (get(Meteor, 'settings.public.defaults.avatars') && (this.props.showAvatars === true)) {
      return (
        <td className='avatar'>
          <img src={questionnaire.photo} ref={questionnaire._id} onError={ this.imgError.bind(this, questionnaire._id) } style={avatarStyle}/>
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
  renderSendButton(questionnaire, avatarStyle){
    if (this.props.showSendButton === true) {
      return (
        <td className='sendButton' style={this.data.style.hideOnPhone}>
          <FlatButton label="send" onClick={this.onSend.bind('this', this.data.questionnaires[i]._id)}/>
        </td>
      );
    }
  }
  onSend(id){
    let questionnaire = Questionnaires.findOne({_id: id});

    console.log("QuestionnaireTable.onSend()", questionnaire);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/Questionnaire', {
      data: questionnaire
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  selectQuestionnaireRow(questionnaireId){
    if(typeof(this.props.onRowClick) === "function"){
      this.props.onRowClick(questionnaireId);
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
  render () {
    let tableRows = [];
    let footer;

    if(this.data.questionnaires.length === 0){
      footer = <TableNoData noDataPadding={ this.props.noDataPadding } />
    } else {
      for (var i = 0; i < this.data.questionnaires.length; i++) {
        tableRows.push(
          <tr key={i} className="questionnaireRow" style={{cursor: "pointer"}} onClick={this.selectQuestionnaireRow.bind(this, this.data.questionnaires[i].id )} >
            { this.renderCheckbox(this.data.questionnaires[i]) }
            { this.renderActionIcons(this.data.questionnaires[i]) }
            <td className='title' onClick={ this.rowClick.bind('this', this.data.questionnaires[i]._id)} style={this.data.style.cell}>{this.data.questionnaires[i].title }</td>
            <td className='status' onClick={ this.rowClick.bind('this', this.data.questionnaires[i]._id)} style={this.data.style.cell}>{this.data.questionnaires[i].status }</td>
            <td className='date' onClick={ this.rowClick.bind('this', this.data.questionnaires[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.questionnaires[i].date }</td>
            <td className='items' onClick={ this.rowClick.bind('this', this.data.questionnaires[i]._id)} style={this.data.style.cell}>{this.data.questionnaires[i].items }</td>
            { this.renderIdentifier(this.data.questionnaires[i]) }
          </tr>
        );
      }
    }
    


    return(
      <div>
        <Table id='questionnairesTable' hover >
          <thead>
            <tr>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
              <th className='title'>Title</th>
              <th className='status'>Status</th>
              <th className='date' style={{minWidth: '100px'}}>Date</th>
              <th className='items'>Items</th>
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

QuestionnaireTable.propTypes = {
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
  onCheck: PropTypes.func,
  actionButtonLabel: PropTypes.string
};
ReactMixin(QuestionnaireTable.prototype, ReactMeteorData);
export default QuestionnaireTable;