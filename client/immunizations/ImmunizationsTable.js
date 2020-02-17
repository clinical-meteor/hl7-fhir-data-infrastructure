import { 
  Grid, 
  Checkbox,
  Button,
  Table,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Box
} from '@material-ui/core';


import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go'

export class ImmunizationsTable extends React.Component {

  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      immunizations: [],
      displayCheckbox: false,
      displayDates: false
    }

    if(this.props.displayCheckboxs){
      data.displayCheckbox = this.props.displayCheckboxs;
    }
    if(this.props.displayDates){
      data.displayDates = this.props.displayDates;
    }
    if(this.props.data){
      data.immunizations = this.props.data;
    } else {
      if(Immunizations.find({}, {$sort: {'identifier.type.text': 1}}).count() > 0){
        data.immunizations = Immunizations.find({}, {$sort: {'identifier.type.text': 1}}).fetch();
      }
    }
    if(process.env.NODE_ENV === "test") console.log("ImmunizationsTable[data]", data);

    return data;
  };

  displayOnMobile(width){
    let style = {};
    if(['iPhone'].includes(window.navigator.platform)){
      style.display = "none";
    }
    if(width){
      style.width = width;
    }
    return style;
  }
  renderCheckboxHeader(){
    if (!this.props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  renderCheckbox(){
    if (!this.props.hideCheckboxes) {
      return (
        <TableCell className="toggle">
            <Checkbox
              defaultChecked={true}
            />
          </TableCell>
      );
    }
  }
  renderDateHeader(){
    if (!this.props.hideDate) {
      return (
        <TableCell className='date'>Date</TableCell>
      );
    }
  }
  renderDate(newDate ){
    if (!this.props.hideDate) {
      return (
        <TableCell className='date'>{ moment(newDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }

  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      return (
        <TableCell className="identifier">Identifier</TableCell>
      );
    }
  }
  renderIdentifier(immunization){
    if (!this.props.hideIdentifier) {
      
      return (
        <TableCell className='identifier'>{ get(immunization, 'identifier[0].value') }</TableCell>       );
    }
  }
  renderStatusHeader(){
    if (!this.props.hideStatus) {
      return (
        <TableCell className="status">Status</TableCell>
      );
    }
  }
  renderStatus(status){
    if (!this.props.hideStatus) {
      
      return (
        <TableCell className='status'>{ status }</TableCell>       );
    }
  }

  renderPatientHeader(){
    if (!this.props.hidePatient) {
      return (
        <TableCell className="patient">Patient</TableCell>
      );
    }
  }
  renderPatient(immunization){
    if (!this.props.hidePatient) {
      
      return (
        <TableCell className='patient'>{ get(immunization, 'patient.display') }</TableCell>       );
    }
  }
  renderPerformerHeader(){
    if (!this.props.hidePerformer) {
      return (
        <TableCell className="performer">Performer</TableCell>
      );
    }
  }
  renderPerformer(immunization){
    if (!this.props.hidePerformer) {
      
      return (
        <TableCell className='performer'>{ get(immunization, 'performer.display') }</TableCell>       );
    }
  }


  rowClick(id){
    Session.set('immunizationsUpsert', false);
    Session.set('selectedImmunizationId', id);
    Session.set('immunizationPageTabIndex', 2);
  };
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  renderActionIcons(immunization ){
    if (!this.props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          <FaTags style={iconStyle} onClick={this.showSecurityDialog.bind(this, immunization)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, immunization._id)} />  
        </TableCell>
      );
    }
  } 
  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  renderIdentifier(identifier ){
    if (!this.props.hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  } 
  removeRecord(_id){
    console.log('Remove patient ', _id)
    Immunizations._collection.remove({_id: _id})
  }
  showSecurityDialog(immunization){
    console.log('showSecurityDialog', immunization)

    Session.set('securityDialogResourceJson', Immunizations.findOne(get(immunization, '_id')));
    Session.set('securityDialogResourceType', 'Immunization');
    Session.set('securityDialogResourceId', get(immunization, '_id'));
    Session.set('securityDialogOpen', true);
  }
  render () {
    // console.log('this.data', this.data)

    let tableRows = [];
    for (var i = 0; i < this.data.immunizations.length; i++) {
      let newRow = {
        patientDisplay: get(this.data.immunizations[i], 'patient.display'),
        patientReference: get(this.data.immunizations[i], 'patient.reference'),
        performerDisplay: get(this.data.immunizations[i], 'performer.display'),
        performerReference: get(this.data.immunizations[i], 'performer.reference'),
        identifier: get(this.data.immunizations[i], 'identifier[0].value'),
        status: get(this.data.immunizations[i], 'status'),
        vaccineCode: get(this.data.immunizations[i], 'vaccineCode.text'),
        reported: get(this.data.immunizations[i], 'reported'),
        date: get(this.data.immunizations[i], 'date')
      }

      let rowStyle = {
        cursor: 'pointer',
        textAlign: 'left'
      }
      if(get(this.data.immunizations[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }

      tableRows.push(
        <TableRow key={i} className="immunizationRow" style={rowStyle} onClick={ this.rowClick.bind('this', this.data.immunizations[i]._id)} >
          { this.renderCheckbox() }
          { this.renderActionIcons(this.data.immunizations[i]) }
          { this.renderIdentifier( newRow.identifier ) }
          <TableCell className='vaccineCode'>{ newRow.vaccineCode }</TableCell>

          { this.renderStatus( newRow.status ) }
          { this.renderPatient(this.data.immunizations[i]) }
          { this.renderPerformer(this.data.immunizations[i]) }

          {/* <TableCell className='identifier' style={this.displayOnMobile()} >{ newRow.identifier }</TableCell> */}
          {/* <TableCell className='status' style={this.displayOnMobile()}>{ newRow.status }</TableCell>
          <TableCell className='patient' style={this.displayOnMobile()} >{ newRow.patientDisplay }</TableCell>
          <TableCell className='performer' style={this.displayOnMobile()} >{ newRow.performerDisplay }</TableCell> */}

          { this.renderDate(newRow.date) }
        </TableRow>
      )
    }

    return(
      <Table id='immunizationsTable' hover >
        <TableHead>
          <TableRow>
            { this.renderCheckboxHeader() }
            { this.renderActionIconsHeader() }
            { this.renderIdentifierHeader() }
            {/* <TableCell className='identifier' style={this.displayOnMobile()} >identifier</TableCell> */}

            <TableCell className='vaccineCode'>Vaccine Code</TableCell>

            {/* <TableCell className='status' style={this.displayOnMobile()} >status</TableCell>
            <TableCell className='patient' style={this.displayOnMobile()} >patient</TableCell>
            <TableCell className='performer' style={this.displayOnMobile()} >performer</TableCell> */}

            { this.renderStatusHeader() }
            { this.renderPatientHeader() }
            { this.renderPerformerHeader() }

            { this.renderDateHeader() }
          </TableRow>
        </TableHead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>
    );
  }
}

ImmunizationsTable.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,

  hideCheckboxes: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hidePatient: PropTypes.bool,
  hidePerformer: PropTypes.bool,
 
  limit: PropTypes.number,
  query: PropTypes.object,
  patient: PropTypes.string,
  patientDisplay: PropTypes.string,
  sort: PropTypes.string
  // onPatientClick: PropTypes.func
};
ReactMixin(ImmunizationsTable.prototype, ReactMeteorData);
export default ImmunizationsTable;