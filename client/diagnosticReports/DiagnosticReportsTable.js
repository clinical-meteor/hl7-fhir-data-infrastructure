import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  CardMedia,
  Tab, 
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox
} from '@material-ui/core';

import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { get } from 'lodash';

const mapDiagnosticReportToRow = function(report, fhirVersion){
  //console.log('report', report)
  
  var newRow = {
    _id: '',
    subjectDisplay: '',
    code: '',
    status: '',
    issued: '',
    performerDisplay: '',
    identifier: '',
    category: '',
    effectiveDate: ''
  };
  if (report){
    if(report._id){
      newRow._id = report._id;
    }
    if(report.subject){
      if(report.subject.display){
        newRow.subjectDisplay = report.subject.display;
      } else {
        newRow.subjectDisplay = report.subject.reference;          
      }
    }
    if(fhirVersion === "v3.0.1"){
      if(get(report, 'performer[0].actor.display')){
        newRow.performerDisplay = get(report, 'performer[0].actor.display');
      } else {
        newRow.performerDisplay = get(report, 'performer[0].actor.reference');          
      }
    }
    if(fhirVersion === "v1.0.2"){
      if(report.performer){
        newRow.performerDisplay = get(report, 'performer.display');
      } else {
        newRow.performerDisplay = get(report, 'performer.reference'); 
      }      
    }

    if(get(report, 'category.coding[0].code')){
      newRow.category = get(report, 'category.coding[0].code');
    } else {
      newRow.category = get(report, 'category.text');
    }

    newRow.code = get(report, 'code.text', '');
    newRow.identifier = get(report, 'identifier[0].value', '');
    newRow.status = get(report, 'status', '');
    newRow.effectiveDate = moment(get(report, 'effectiveDateTime')).format("YYYY-MM-DD");
    newRow.issued = moment(get(report, 'issued')).format("YYYY-MM-DD"); 

    return newRow;  
  } 
}


export class DiagnosticReportsTable extends React.Component {
  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      diagnosticReports: [],
      displayToggle: false,
      displayDates: true,
      fhirVersion: 'v1.0.2'
    }

    if(this.props.fhirVersion){
      data.fhirVersion = this.props.fhirVersion;
    }

    if(this.props.displayToggles){
      data.displayToggle = this.props.displayToggles;
    }
    if(this.props.displayDates){
      data.displayDates = this.props.displayDates;
    }
    
    if(this.props.data){
      this.props.data.map(function(report){
        data.diagnosticReports.push(mapDiagnosticReportToRow(report, data.fhirVersion));        
      });
    } else {
      if(DiagnosticReports.find().count() > 0){
        DiagnosticReports.find().map(function(report){
          data.diagnosticReports.push(mapDiagnosticReportToRow(report, data.fhirVersion));        
        });
      }
    }
    
    if(process.env.NODE_ENV === "test") console.log("DiagnosticReportsTable[data]", data);
    return data;
  };

  renderTogglesHeader(displayToggle){
    if (displayToggle) {
      return (
        <TableCell className="toggle">toggle</TableCell>
      );
    }
  }
  renderToggles(displayToggle, patientId ){
    if (displayToggle) {
      return (
        <TableCell className="toggle">
          <Checkbox
            defaultChecked={true}
          />
        </TableCell>
      );
    }
  }
  renderDateHeader(displayDates){
    if (displayDates) {
      return (
        <TableCell className='effectiveDateTime'  style={{width: '120px'}}>Effective Date</TableCell>
      );
    }
  }
  renderDate(displayDates, newDate ){
    if (displayDates) {
      return (
        <TableCell className='date'  style={{width: '120px'}}>{ moment(newDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }
  rowClick(id){
    Session.set('diagnosticReportsUpsert', false);
    Session.set('selectedDiagnosticReportId', id);
    Session.set('diagnosticReportPageTabIndex', 1);

    if(typeof this.props.onRowClick === "function"){
      this.props.onRowClick(id);
    }
  };
  render () {
    if(process.env.NODE_ENV === "test") console.log('DiagnosticReportsTable.render()', this.data.diagnosticReports)

    let tableRows = [];
    for (var i = 0; i < this.data.diagnosticReports.length; i++) {

      tableRows.push(
        <TableRow key={i} className="diagnosticReportRow" style={{cursor: "pointer"}} onClick={ this.rowClick.bind('this', this.data.diagnosticReports[i]._id)} >
          { this.renderToggles(this.data.displayToggle, this.data.diagnosticReports[i]) }

          <TableCell className='subjectDisplay' style={{minWidth: '400px'}}>{ this.data.diagnosticReports[i].subjectDisplay }</TableCell>
          <TableCell className='code'>{ this.data.diagnosticReports[i].code }</TableCell>
          <TableCell className='status'>{ this.data.diagnosticReports[i].status }</TableCell>
          <TableCell className='issued'  style={{width: '120px'}}>{ this.data.diagnosticReports[i].issued }</TableCell>
          <TableCell className='performerDisplay'>{ this.data.diagnosticReports[i].performerDisplay }</TableCell>
          <TableCell className='identifier'>{ this.data.diagnosticReports[i].identifier }</TableCell>
          {/* <TableCell className='effectiveDateTime'>{ this.data.diagnosticReports[i].effectiveDate }</TableCell> */}
          <TableCell className='category'>{ this.data.diagnosticReports[i].category }</TableCell>
          { this.renderDate(this.data.displayDates, this.data.diagnosticReports[i].effectiveDate) }
        </TableRow>
      )
    }

    return(
      <Table id='diagnosticReportsTable' size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
          { this.renderTogglesHeader(this.data.displayToggle) }
            <TableCell className='subjectDisplay' style={{width: '140px'}}>Subject</TableCell>
            <TableCell className='code'>Code</TableCell>
            <TableCell className='status'>Status</TableCell>
            <TableCell className='issued' style={{width: '120px'}}>Issued</TableCell>
            <TableCell className='performerDisplay'>Performer</TableCell>
            <TableCell className='identifier'>Identifier</TableCell>
            <TableCell className='category'>Category</TableCell>
            { this.renderDateHeader(this.data.displayDates) }
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>
    );
  }
}


ReactMixin(DiagnosticReportsTable.prototype, ReactMeteorData);
export default DiagnosticReportsTable;