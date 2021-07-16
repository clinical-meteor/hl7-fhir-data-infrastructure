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

import moment from 'moment'


// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

import FhirUtilities from '../../lib/FhirUtilities';

import { FhirDehydrator, StyledCard, PageCanvas, TableNoData } from 'fhir-starter';


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
// MAIN COMPONENT

function ImmunizationsTable(props){
  logger.info('Rendering the ImmunizationsTable');
  logger.verbose('clinical:hl7-resource-encounter.client.ImmunizationsTable');
  logger.data('ImmunizationsTable.props', {data: props}, {source: "ImmunizationsTable.jsx"});

  const classes = useStyles();

  let { 
    id,
    children, 

    data,
    immunizations,
    selectedImmunizationId,
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
    hideVaccineCodeText,

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

    tableRowSize,
    formFactorLayout,
    count,

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    logger.verbose('formFactorLayout', formFactorLayout + ' ' + window.innerWidth);
    switch (formFactorLayout) {
      case "phone":
        hidePatient = true;
        hideIdentifier = true;
        hidePerformer = true;
        hideVaccineCode = true;
        break;
      case "tablet":
        hideVaccineCode = false;
        break;
      case "web":
    
        break;
      case "desktop":
  
        break;
      case "videowall":

        break;            
    }
  }


  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(rowsPerPage);


  let paginationCount = 101;
  if(count){
    paginationCount = count;
  } else {
    paginationCount = rows.length;
  }

  function handleChangePage(event, newPage){
    setPage(newPage);
  }

  let paginationFooter;
  if(!disablePagination){
    paginationFooter = <TablePagination
      component="div"
      // rowsPerPageOptions={[5, 10, 25, 100]}
      rowsPerPageOptions={['']}
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
  function handleRowClick(id){
    console.log('handleRowClick', id)

    if(props && (typeof onRowClick === "function")){
      props.onRowClick(id);
    }
  }
  function handleActionButtonClick(){
    console.log('handleActionButtonClick')
  }
  
  //---------------------------------------------------------------------
  // Column Rendering

  function renderCheckboxHeader(){
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(){
    if (!hideCheckbox) {
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
    if (!hideDate) {
      return (
        <TableCell className='date'>Date</TableCell>
      );
    }
  }
  function renderDate(newDate ){
    if (!hideDate) {
      return (
        <TableCell className='date' style={{minWidth: '140px'}}>{ moment(newDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }

  function renderIdentifierHeader(){
    if (!hideIdentifier) {
      return (
        <TableCell className="identifier">Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(immunization){
    if (!hideIdentifier) {
      
      return (
        <TableCell className='identifier'>{ get(immunization, 'identifier[0].value') }</TableCell>       );
    }
  }
  function renderStatusHeader(){
    if (!hideStatus) {
      return (
        <TableCell className="status">Status</TableCell>
      );
    }
  }
  function renderStatus(status){
    if (!hideStatus) {
      
      return (
        <TableCell className='status'>{ status }</TableCell>       );
    }
  }
  function renderVaccineCodeHeader(){
    if (!hideVaccineCode) {
      return (
        <TableCell className="vaccineCode">Vaccine Code</TableCell>
      );
    }
  }
  function renderVaccineCode(vaccineCode){
    if (!hideVaccineCode) {
      
      return (
        <TableCell className='vaccineCode'>{ vaccineCode }</TableCell>       );
    }
  }

  function renderVaccineCodeTextHeader(){
    if (!hideVaccineCodeText) {
      return (
        <TableCell className="vaccineCodeText">Vaccine</TableCell>
      );
    }
  }
  function renderVaccineCodeText(vaccineCodeText){
    if (!hideVaccineCodeText) {
      
      return (
        <TableCell className='vaccineCodeText'>{ vaccineCodeText }</TableCell>       );
    }
  }

  function renderPatientHeader(){
    if (!hidePatient) {
      return (
        <TableCell className="patient">Patient</TableCell>
      );
    }
  }
  function renderPatient(immunization){
    if (!hidePatient) {
      
      return (
        <TableCell className='patient'>{ get(immunization, 'patient.display') }</TableCell>       );
    }
  }
  function renderPerformerHeader(){
    if (!hidePerformer) {
      return (
        <TableCell className="performer">Performer</TableCell>
      );
    }
  }
  function renderPerformer(immunization){
    if (!hidePerformer) {
      
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
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(immunization ){
    if (!hideActionIcons) {
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
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(identifier ){
    if (!hideIdentifier) {
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

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(dateFormat){
    internalDateFormat = dateFormat;
  }

  if(immunizations){
    if(immunizations.length > 0){     
      let count = 0;    

      immunizations.forEach(function(immunization){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          immunizationsToRender.push(FhirDehydrator.flattenImmunization(immunization, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '52px'
  }
  if(immunizationsToRender.length === 0){
    logger.trace('ConditionsTable: No immunizations to render.');
  } else {

    for (var i = 0; i < immunizationsToRender.length; i++) {

      let selected = false;
      if(immunizationsToRender[i].id === selectedImmunizationId){
        selected = true;
      }
      if(get(immunizationsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      } 

      logger.trace('immunizationsToRender[i]', immunizationsToRender[i])

      if(get(immunizationsToRender[i], "resourceType") === "OperationOutcome"){
        tableRows.push(
          <TableRow 
          className="immunizationRow" 
          key={i} 
          style={rowStyle} 
          onClick={ handleRowClick.bind(this, immunizationsToRender[i].id)} 
          hover={true} 
          style={{height: '53px', background: "repeating-linear-gradient( 45deg, rgba(253,184,19, 0.9), rgba(253,184,19, 0.9) 10px, rgba(253,184,19, 0.75) 10px, rgba(253,184,19, 0.75) 20px ), url(http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/old_map_@2X.png)"}} >            
            <TableCell className='actionIcons' style={{width: '100%', whiteSpace: 'nowrap'}}>
              {get(immunizationsToRender[i], 'issue[0].text', 'OperationOutcome: No data returned.')}
            </TableCell>
            <TableCell className='actionIcons' ></TableCell>
            <TableCell className='actionIcons' ></TableCell>
            <TableCell className='actionIcons' ></TableCell>

          </TableRow>
        ); 
      } else {
        tableRows.push(
          <TableRow className="immunizationRow" key={i} style={rowStyle} onClick={ handleRowClick.bind(this, immunizationsToRender[i].id)} hover={true} >            
            { renderCheckbox() }
            { renderActionIcons(immunizationsToRender[i]) }
            { renderIdentifier( immunizationsToRender[i].identifier ) }
            { renderVaccineCode( immunizationsToRender[i].vaccineCode ) }
            { renderVaccineCodeText( immunizationsToRender[i].vaccineDisplay ) }
            { renderStatus( immunizationsToRender[i].status ) }
            { renderPatient(immunizationsToRender[i].patientDisplay) }
            { renderPerformer(immunizationsToRender[i].performerDisplay) }
            { renderDate(immunizationsToRender[i].date) }
          </TableRow>
        ); 
      }      
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
  selectedImmunizationId: PropTypes.string,

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
  sort: PropTypes.string,
  dateFormat: PropTypes.string,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  showActionButton: PropTypes.bool,

  count: PropTypes.number,
  tableRowSize: PropTypes.string,
  formFactorLayout: PropTypes.string
};


ImmunizationsTable.defaultProps = {
  tableRowSize: 'medium',
  rowsPerPage: 5,
  dateFormat: "YYYY-MM-DD hh:mm:ss",
  hideCheckbox: true,
  hideActionIcons: true,
  hideIdentifier: false,
  hidePatient: false,
  hidePerformer: false,
  hideStatus: false
};

export default ImmunizationsTable;