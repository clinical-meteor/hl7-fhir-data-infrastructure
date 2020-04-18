import { Checkbox, FlatButton, RaisedButton, Avatar, Tab, Tabs  } from 'material-ui';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { Session } from 'meteor/session';
import { has, get } from 'lodash';
import { TableNoData } from 'meteor/clinical:glass-ui';
import PropTypes from 'prop-types';

Session.setDefault('selectedDocumentSource', '');

export class ConsentTable extends React.Component {
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
        }
      },
      selected: [],
      consents: []
    };

    let query = {};
    if(this.props.patient){
      query['patient.display'] = this.props.patient;
    }

    if(this.props.query){
      query = this.props.query;
    }

    let options = {};

    if(this.props.sort){

      switch (this.props.sort) {
        case "date":
          options.sort = { dateTime: -1 }
          break;
        case "periodStart":
          options.sort = { 'period.start': -1 }
          break;      
        default:
          break;
      }
    }

    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }

    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    // data.consents = [];
    data.consents = Consents.find(query, options).map(function(document){
      let result = {
        _id: document._id,
        id: get(document, 'id', ''),
        dateTime: moment(get(document, 'dateTime', null)).format("YYYY-MM-DD hh:mm:ss"),
        status: get(document, 'status', ''),
        patientReference: get(document, 'patient.display', ''),
        consentingParty: get(document, 'consentingParty[0].display', ''),
        organization: get(document, 'organization[0].display', ''),
        policyRule: get(document, 'policyRule', ''),
        exceptType: get(document, 'except[0].type', ''),
        exceptAction: get(document, 'except[0].action[0].text', ''),
        exceptClass: get(document, 'except[0].class', ''),
        start: moment(get(document, 'period.start', '')).format("YYYY-MM-DD hh:mm:ss"),
        end: moment(get(document, 'period.end', '')).format("YYYY-MM-DD hh:mm:ss"),
        sourceReference: get(document, 'sourceReference.reference', ''),
        category: get(document, 'category[0].text', '')
      };

      if(result.patientReference === ''){
        result.patientReference = get(document, 'patient.reference', '');
      }

      var exceptions;
      if(get(document, 'except.0.class')){
        result.exceptClass = "";
        document.except[0].class.forEach(function(exception){   
          if(result.exceptClass == ''){
            result.exceptClass = exception.code;
          }  else {
            result.exceptClass = result.exceptClass + ' - ' + exception.code;
          }      
        });
      }
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

    // console.log("ConsentTable[data]", data);
    return data;
  }
  rowClick(id){
    Session.set('consentsUpsert', false);
    Session.set('selectedConsent', id);
    Session.set('consentPageTabIndex', 2);
  }
  handleRevoke(id){
    console.log('handleRevoke')
  }
  // handleVerify(id){
  //   console.log('handleVerify')
  //   alert('Verify this Consent... (not implemented yet)')
  // }


  renderSelected(exceptType){
    if (!this.props.hideSelected) {
      return (
        <td className='selected'  style={{minWidth: '100px', paddingTop: '16px'}}><Checkbox /></td>
      );
    }
  }
  renderSelectedHeader(){
    if (!this.props.hideSelected) {
      return (
        <th className='selected'>Selected</th>
      );
    }
  }
  renderId(id){
    if (!this.props.hideId) {
      return (
        <td className="id hidden-on-phone" onClick={ this.onIdentifierClick.bind(this, id)} >{ id }</td>
      );
    }
  }
  renderIdHeader(){
    if (!this.props.hideId) {
      return (
        <th className="id" >Id</th>
      );
    }
  }
  renderIdentifier(identifier){
    if (!this.props.hideIdentifier) {
      return (
        <td className="identifier hidden-on-phone">{ identifier }</td>
      );
    }
  }
  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      let identiferClassName;

      if(this.props.disableBarcodes){
        identiferClassName = "identifier hidden-on-phone"
      } else {
        identiferClassName = "identifier barcode hidden-on-phone"
      }
      return (
        <th className={identiferClassName} >Identifier</th>
      );
    }
  }

  renderType(exceptType){
    if (!this.props.hideType) {
      return (
        <td className='exceptType' style={this.data.style.cell} >{ exceptType }</td>
      );
    }
  }
  renderTypeHeader(){
    if (!this.props.hideType) {
      return (
        <th className='type' >Type</th>
      );
    }
  }
  renderClass(exceptClass){
    if (!this.props.hideClass) {
      return (
        <td className='exceptClass' style={this.data.style.cell} >{ exceptClass }</td>
      );
    }
  }
  renderClassHeader(){
    if (!this.props.hideClass) {
      return (
        <th className='class' >Class</th>
      );
    }
  }
  renderCategory(category){
    if (!this.props.hideCategory) {
      return (
        <td className='category' style={this.data.style.cell} >{ category }</td>
      );
    }
  }
  renderCategoryHeader(){
    if (!this.props.hideCategory) {
      return (
        <th className='category' >Category</th>
      );
    }
  }
  renderDate(id, dateTime){
    if (!this.props.hideDateTime) {
      return (
        <td className='date' onClick={ this.rowClick.bind('this', id)} style={{minWidth: '100px', paddingTop: '16px'}}>{ dateTime }</td>
      );
    }
  }
  renderDateHeader(){
    if (!this.props.hideDateTime) {
      return (
        <th className='date' style={{minWidth: '100px'}}>Date</th>
      );
    }
  }


  renderPeriodStart(id, periodStart){
    if (!this.props.hidePeriodStart) {
      return (
        <td className='start' onClick={ this.rowClick.bind('this', id)} style={{minWidth: '100px', paddingTop: '16px'}}>{ periodStart }</td>
      );
    }
  }
  renderPeriodStartHeader(){
    if (!this.props.hidePeriodStart) {
      return (
        <th className='start' style={{minWidth: '100px'}}>Start</th>
      );
    }
  }
  renderPeriodEnd(id, periodEnd){
    if (!this.props.hidePeriodEnd) {
      return (
        <td className='end' onClick={ this.rowClick.bind('this', id)} style={{minWidth: '100px', paddingTop: '16px'}}>{ periodEnd }</td>
      );
    }
  }
  renderPeriodEndHeader(){
    if (!this.props.hidePeriodEnd) {
      return (
        <th className='end' style={{minWidth: '100px'}}>End</th>
      );
    }
  }


  renderSource(sourceReference ){
    console.log('renderSource', sourceReference)
    if (!this.props.hideSourceReference) {
      return (
        <td className='sourceReference' onClick={ this.getDocumentReference.bind(this, sourceReference) } style={{minWidth: '100px', paddingTop: '16px'}}>{ sourceReference }</td>
      );
    }
  }
  renderSourceHeader(){
    if (!this.props.hideSourceReference) {
      return (
        <th className='sourceReference' style={{minWidth: '100px', marginLeft: '20px'}}> Source </th>
      );
    }
  }



  // renderVerify(){
  //   if (!this.props.hideVerify) {
  //     return (
  //       <td className='revoke'>
  //         <FlatButton label="Verify" onClick={this.handleVerify.bind(this)} />
  //       </td>
  //     );
  //   }
  // }
  // renderVerifyHeader(){
  //   if (!this.props.hideVerify) {
  //     return (
  //       <th className='end' style={{minWidth: '100px', marginLeft: '20px'}}> Verify </th>
  //     );
  //   }
  // }


  renderRevoke(){
    if (!this.props.hideRevoke) {
      return (
        <td className='revoke'>
          <FlatButton label="Revoke" onClick={this.handleRevoke.bind(this)} />
        </td>
      );
    }
  }
  renderRevokeHeader(){
    if (!this.props.hideRevoke) {
      return (
        <th className='end' style={{minWidth: '100px', marginLeft: '20px'}}> Revoke </th>
      );
    }
  }
  getDocumentReference(sourceReference){
    console.log('getDocumentReference...', sourceReference)

    Session.set('selectedDocumentSource', sourceReference);
  }
  onPatientClick(id){
    if(this.props.onPatientClick){
      this.props.onPatientClick(id);
    } else {
      Session.set('consentsUpsert', false);
      Session.set('selectedConsent', id);
      Session.set('consentPageTabIndex', 2);  
    }
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.consents.length === 0){
      // don't try to simplifiy the double negative in this expression
      // it's handling a boolean property, and also serving up instructions/help/warning
      // it's klunky to reason through; but it's not hurting anything
      if(!(this.props.noDataMessage === false)){
        footer = <TableNoData noDataPadding={ this.props.noDataMessagePadding } />
      }
    } else {
      for (var i = 0; i < this.data.consents.length; i++) {
        tableRows.push(
          <tr key={i} className="consentRow" style={{cursor: "pointer"}}>
            {this.renderSelected()}
            {this.renderId(get(this.data.consents[i], 'id'))}
            {this.renderIdentifier(get(this.data.consents[i], 'identifier'))}
            {this.renderDate(get(this.data.consents[i], '_id'), get(this.data.consents[i], 'date'))}
            {this.renderPeriodStart(get(this.data.consents[i], '_id'), get(this.data.consents[i], 'start'))}
            {this.renderPeriodEnd(get(this.data.consents[i], '_id'), get(this.data.consents[i], 'end'))}

            <td className='status' onClick={ this.rowClick.bind(this, this.data.consents[i]._id)} style={this.data.style.cell}>{this.data.consents[i].status}</td>
            <td className='patientReference' onClick={ this.onPatientClick.bind(this, this.data.consents[i]._id)} style={this.data.style.cell} >{this.data.consents[i].patientReference }</td>
            <td className='organization' style={this.data.style.cell} >{this.data.consents[i].organization}</td>

            {this.renderType( get(this.data.consents[i], 'exceptType')) }
            {this.renderClass( get(this.data.consents[i], 'exceptClass')) }
            {this.renderCategory( get(this.data.consents[i], 'category')) }
            {this.renderSource(get(this.data.consents[i], 'sourceReference')) }
            {this.renderRevoke() }

          </tr>
        );
      }  
    }

    return(
      <div>
        <Table id='consentsTable' hover >
          <thead>
            <tr>
              {this.renderSelectedHeader() }
              {this.renderIdHeader() }
              {this.renderIdentifierHeader() }
              {this.renderDateHeader() }
              {this.renderPeriodStartHeader() }
              {this.renderPeriodEndHeader() }
              <th className='status'>Status</th>
              <th className='patientReference'>Patient</th>
              <th className='organization' >Organization</th>
              {this.renderTypeHeader() }
              {this.renderClassHeader() }
              {this.renderCategoryHeader() }
              {this.renderSourceHeader() }
              {this.renderRevokeHeader() }
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
  onIdentifierClick(id){
    if(typeof this.props.onIdentifierClick === "function"){
      this.props.onIdentifierClick(id);
    } 
  }
}

ConsentTable.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  hideIdentifier: PropTypes.bool,
  hideDateTime: PropTypes.bool,
  hidePeriodStart: PropTypes.bool,
  hidePeriodEnd: PropTypes.bool,
  hideType: PropTypes.bool,
  hideClass: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideVerify: PropTypes.bool,
  hideRevoke: PropTypes.bool,
  sourceReference: PropTypes.bool,
  disableBarcodes: PropTypes.bool,
  limit: PropTypes.number,
  query: PropTypes.object,
  patient: PropTypes.string,
  patientDisplay: PropTypes.string,
  sort: PropTypes.string,
  selectedDocumentSource: PropTypes.string,
  onPatientClick: PropTypes.func
};

ReactMixin(ConsentTable.prototype, ReactMeteorData);
export default ConsentTable;