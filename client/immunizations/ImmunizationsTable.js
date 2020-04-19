import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Grid, 
  Checkbox,
  Button,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Box
} from '@material-ui/core';

import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor'

import { get } from 'lodash';
import moment from 'moment';

// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

import FhirUtilities from '../../lib/FhirUtilities';


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
  }
}



//===========================================================================
// FLATTENING / MAPPING

flattenImmunization = function(immunization, internalDateFormat){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    patientDisplay: '',
    patientReference: '',
    performerDisplay: '',
    performerReference: '',
    vaccineCode: '',
    vaccineDisplay: '',
    status: '',
    reported: '',
    date: ''
  };

  if(!internalDateFormat){
    internalDateFormat = "YYYY-MM-DD";
  }

  result._id =  get(immunization, 'id') ? get(immunization, 'id') : get(immunization, '_id');
  result.id = get(immunization, 'id', '');
  result.identifier = get(immunization, 'identifier[0].value', '');

  if(get(immunization, 'patient')){
    result.patientDisplay = get(immunization, 'patient.display', '');
    result.patientReference = get(immunization, 'patient.reference', '');
  } else if (get(immunization, 'subject')){
    result.patientDisplay = get(immunization, 'subject.display', '');
    result.patientReference = get(immunization, 'subject.reference', '');
  }

  if(get(immunization, 'performer')){
    result.performerDisplay = get(immunization, 'performer.display', '');
    result.performerReference = get(immunization, 'performer.reference', '');
  } 

  result.performerDisplay = get(immunization, 'asserter.display', '');

  if(get(immunization, 'status.coding[0].code')){
    result.status = get(immunization, 'status.coding[0].code', '');  //R4
  } else {
    result.status = get(immunization, 'status', '');                 // DSTU2
  }

  result.vaccineCode = get(immunization, 'vaccineCode.coding[0].code', '');

  if(get(immunization, 'vaccineCode.coding[0].display')){
    result.vaccineDisplay = get(immunization, 'vaccineCode.coding[0].display', '');  //R4
  } else {
    result.vaccineDisplay = get(immunization, 'vaccineCode.text', '');                 // DSTU2
  }

  result.barcode = get(immunization, '_id', '');

  if(get(immunization, 'occurrenceDateTime')){
    result.date = moment(get(immunization, 'occurrenceDateTime')).format("YYYY-MM-DD");
  } else {
    result.date = moment(get(immunization, 'date')).format("YYYY-MM-DD");
  }
  result.reported = moment(get(immunization, 'reported', '')).format("YYYY-MM-DD");

  return result;
}


//===========================================================================
// MAIN COMPONENT

function ImmunizationsTable(props){
  logger.info('Rendering the ImmunizationsTable');
  logger.verbose('clinical:hl7-resource-encounter.client.ImmunizationsTable');
  logger.data('ImmunizationsTable.props', {data: props}, {source: "ImmunizationsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    data,
    immunizations,
    query,
    paginationLimit,
    disablePagination,
  
    hideCheckbox,
    hideActionIcons,
    hideIdentifier,
    hideDate,
    hideStatus,
    hidePatient,
    hidePerformer,
    hideVaccineCode,

    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,
  
    rowsPerPage,
    dateFormat,
    showMinutes,
    displayEnteredInError,

    ...otherProps 
  } = props;

  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
  } else {
    paginationCount = rows.length;
  }

  function handleChangePage(event, newPage){
    setPage(newPage);
  }

  let paginationFooter;
  if(!props.disablePagination){
    paginationFooter = <TablePagination
      component="div"
      rowsPerPageOptions={[5, 10, 25, 100]}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPageToRender}
      page={page}
      onChangePage={handleChangePage}
      style={{float: 'right', border: 'none'}}
    />
  }


  //---------------------------------------------------------------------
  // Helper Functions

  function removeRecord(_id){
    console.log('removeRecord')
  }
  function rowClick(id){
    console.log('rowClick')
  }
  function handleActionButtonClick(){
    console.log('handleActionButtonClick')
  }
  
  //---------------------------------------------------------------------
  // Column Rendering

  function renderCheckboxHeader(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle">
            <Checkbox
              defaultChecked={true}
            />
          </TableCell>
      );
    }
  }
  function renderDateHeader(){
    if (!props.hideDate) {
      return (
        <TableCell className='date'>Date</TableCell>
      );
    }
  }
  function renderDate(newDate ){
    if (!props.hideDate) {
      return (
        <TableCell className='date'>{ moment(newDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }

  function renderIdentifierHeader(){
    if (!props.hideIdentifier) {
      return (
        <TableCell className="identifier">Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(immunization){
    if (!props.hideIdentifier) {
      
      return (
        <TableCell className='identifier'>{ get(immunization, 'identifier[0].value') }</TableCell>       );
    }
  }
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell className="status">Status</TableCell>
      );
    }
  }
  function renderStatus(status){
    if (!props.hideStatus) {
      
      return (
        <TableCell className='status'>{ status }</TableCell>       );
    }
  }
  function renderVaccineCodeHeader(){
    if (!props.hideVaccineCode) {
      return (
        <TableCell className="vaccineCode">Vaccine Code</TableCell>
      );
    }
  }
  function renderVaccineCode(vaccineCode){
    if (!props.hideVaccineCode) {
      
      return (
        <TableCell className='vaccineCode'>{ vaccineCode }</TableCell>       );
    }
  }

  function renderVaccineCodeTextHeader(){
    if (!props.hideVaccineCodeText) {
      return (
        <TableCell className="vaccineCodeText">Vaccine</TableCell>
      );
    }
  }
  function renderVaccineCodeText(vaccineCodeText){
    if (!props.hideVaccineCodeText) {
      
      return (
        <TableCell className='vaccineCodeText'>{ vaccineCodeText }</TableCell>       );
    }
  }

  function renderPatientHeader(){
    if (!props.hidePatient) {
      return (
        <TableCell className="patient">Patient</TableCell>
      );
    }
  }
  function renderPatient(immunization){
    if (!props.hidePatient) {
      
      return (
        <TableCell className='patient'>{ get(immunization, 'patient.display') }</TableCell>       );
    }
  }
  function renderPerformerHeader(){
    if (!props.hidePerformer) {
      return (
        <TableCell className="performer">Performer</TableCell>
      );
    }
  }
  function renderPerformer(immunization){
    if (!props.hidePerformer) {
      
      return (
        <TableCell className='performer'>{ get(immunization, 'performer.display') }</TableCell>       );
    }
  }


  function rowClick(id){
    Session.set('immunizationsUpsert', false);
    Session.set('selectedImmunizationId', id);
    Session.set('immunizationPageTabIndex', 2);
  };
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(immunization ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={this.showSecurityDialog.bind(this, immunization)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={this.removeRecord.bind(this, immunization._id)} /> */}
        </TableCell>
      );
    }
  } 
  function renderIdentifierHeader(){
    if (!props.hideIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(identifier ){
    if (!props.hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  } 
  function removeRecord(_id){
    console.log('Remove patient ', _id)
    Immunizations._collection.remove({_id: _id})
  }
  function showSecurityDialog(immunization){
    console.log('showSecurityDialog', immunization)

    Session.set('securityDialogResourceJson', Immunizations.findOne(get(immunization, '_id')));
    Session.set('securityDialogResourceType', 'Immunization');
    Session.set('securityDialogResourceId', get(immunization, '_id'));
    Session.set('securityDialogOpen', true);
  }


  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let immunizationsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.immunizations){
    if(props.immunizations.length > 0){     
      let count = 0;    

      props.immunizations.forEach(function(immunization){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          immunizationsToRender.push(flattenImmunization(immunization, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(immunizationsToRender.length === 0){
    logger.trace('ConditionsTable: No immunizations to render.');
  } else {
    for (var i = 0; i < immunizationsToRender.length; i++) {
      if(get(immunizationsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('immunizationsToRender[i]', immunizationsToRender[i])
      tableRows.push(
        <TableRow className="immunizationRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, immunizationsToRender[i]._id)} hover={true} >            
          { renderCheckbox() }
          { renderActionIcons(immunizations[i]) }
          { renderIdentifier( immunizationsToRender[i].identifier ) }
          { renderVaccineCode( immunizationsToRender[i].vaccineCode ) }
          { renderVaccineCodeText( immunizationsToRender[i].vaccineDisplay ) }
          { renderStatus( immunizationsToRender[i].status ) }
          { renderPatient(immunizations[i].patientDisplay) }
          { renderPerformer(immunizations[i].performerDisplay) }
          { renderDate(immunizationsToRender[i].date) }
        </TableRow>
      );    
    }
  }

  //---------------------------------------------------------------------
  // Actual Render Method

  return(
    <div>
      <Table className='immunizationsTable' size="small" aria-label="a dense table" { ...otherProps }>
        <TableHead>
          <TableRow>
              { renderCheckboxHeader() }
              { renderActionIconsHeader() }
              { renderIdentifierHeader() }
              { renderVaccineCodeHeader() }
              { renderVaccineCodeTextHeader() }
              { renderStatusHeader() }
              { renderPatientHeader() }
              { renderPerformerHeader() }
              { renderDateHeader() }
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>
    { paginationFooter }
    </div>
  );
}

ImmunizationsTable.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  immunizations: PropTypes.array,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hidePatient: PropTypes.bool,
  hidePerformer: PropTypes.bool,
  hideVaccineCode: PropTypes.bool,
  hideVaccineCodeText: PropTypes.bool,
  
  rowsPerPage: PropTypes.number,
  limit: PropTypes.number,
  query: PropTypes.object,
  patient: PropTypes.string,
  patientDisplay: PropTypes.string,
  sort: PropTypes.string
};
ImmunizationsTable.defaultProps = {
  rowsPerPage: 5
}

export default ImmunizationsTable;