import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPageIcon
} from '@material-ui/core';


import { useTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
let get = _.get;
let set = _.set;
let has = _.has;

import moment from 'moment';

import FhirUtilities from '../../lib/FhirUtilities';

import { StyledCard, PageCanvas } from 'fhir-starter';
import { FhirDehydrator } from '../../lib/FhirDehydrator';

//===========================================================================
// SESSION VARIABLES  

Session.setDefault('selectedPractitioner', false);


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

function PractitionersTable(props){
  logger.info('Rendering the PractitionersTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.PractitionersTable');
  logger.data('PractitionersTable.props', {data: props}, {source: "PractitionersTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,

    data,
    practitioners,
    selectedPractitionerId,
    query,
    paginationLimit,
    disablePagination,
  
    hideCheckbox,
    hideActionIcons,
    hideIdentifier,
    hideFullName,
    hidePhone,
    hideEmail,
    hideAddressLine,
    hideCity,
    hideState,
    hidePostalCode,
    hideFullAddress,
    
    hideIssuer,
    hideQualification,
    hideQualificationCode,
    hideQualificationStart,
    hideQualificationEnd,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClihandle,
    hideActionButton,
    hideBarcode,
    actionButtonLabel,
    hideExtensions,


  
    rowsPerPage,
    tableRowSize,
    dateFormat,
    showMinutes,
    size,

    formFactorLayout,
    count,
    multiline,

    ...otherProps 
  } = props;


  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    logger.verbose('formFactorLayout', formFactorLayout + ' ' + window.innerWidth);
    switch (formFactorLayout) {
      case "phone":
        hideFullName = false;
        hidePhone = true;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = true;
        hideState = true;
        hidePostalCode = true;
        hideIssuer = false;
        hideQualification = false;
        hideQualificationCode = true;
        hideQualificationStart = true;
        hideQualificationEnd = true;
        hideFullAddress = true;
        multiline = true;
        break;
      case "tablet":
        hideFullName = false;
        hidePhone = true;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = true;
        hideState = true;
        hidePostalCode = true;
        hideIssuer = false;
        hideQualification = false;
        hideQualificationCode = true;
        hideQualificationStart = true;
        hideQualificationEnd = true;
        hideFullAddress = true;
        multiline = true;
        break;
      case "web":
        hideFullName = false;
        hidePhone = false;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = true;
        hideState = true;
        hidePostalCode = true;
        hideIssuer = false;
        hideQualification = false;
        hideQualificationCode = true;
        hideQualificationStart = true;
        hideQualificationEnd = true;
        hideFullAddress = true;
        multiline = false;
        break;
      case "desktop":
        hideFullName = false;
        hidePhone = false;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = true;
        hideState = true;
        hidePostalCode = true;
        hideIdentifier = false;
        hideIssuer = false;
        hideQualification = false;
        hideQualificationCode = true;
        hideQualificationStart = true;
        hideQualificationEnd = true;
        hideFullAddress = false;
        multiline = false;
        break;
      case "hdmi":
        hideFullName = false;
        hidePhone = false;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = true;
        hideState = true;
        hidePostalCode = true;
        hideIdentifier = false;
        hideIssuer = false;
        hideQualification = false;
        hideQualificationCode = false;
        hideQualificationStart = false;
        hideQualificationEnd = false;
        hideFullAddress = false;
        multiline = false;
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
  // Helper Methods  


  function removeRecord(_id){
    console.log('removeRecord')
  }
  function handleRowClick(id){
    console.log('handleRowClick')
    if(typeof onRowClick === "function"){
      onRowClick(id);
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
  function renderCheckbox(patientId ){
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
  function renderActionIconsHeader(){
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( practitioner ){
    if (!hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, practitioner)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, practitioner._id)} /> */}
        </TableCell>
      );
    }
  } 
  function renderIdentifier(identifier){
    if (!hideIdentifier) {
      return (
        <TableCell className="identifier">{ identifier }</TableCell>
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
  function renderExtensions(extensions){
    if (!hideExtensions) {
      return (
        <TableCell className="extensions">{ extensions }</TableCell>
      );
    }
  }
  function renderExtensionsHeader(){
    if (!hideExtensions) {
      return (
        <TableCell className="extensions">Extensions</TableCell>
      );
    }
  }

  function renderFullName(name){
    if (!hideFullName) {
      return (
        <TableCell className="name">{ name }</TableCell>
      );
    }
  }
  function renderFullNameHeader(){
    if (!hideFullName) {
      return (
        <TableCell className="name">Full Name</TableCell>
      );
    }
  }
  function renderPhone(phone){
    if (!hidePhone) {
      return (
        <TableCell className="phone">{ phone }</TableCell>
      );
    }
  }
  function renderPhoneHeader(){
    if (!hidePhone) {
      return (
        <TableCell className="phone">Phone</TableCell>
      );
    }
  }
  function renderEmail(email){
    if (!hideEmail) {
      return (
        <TableCell className="email hidden-on-phone">{ email }</TableCell>
      );
    }
  }
  function renderEmailHeader(){
    if (!hideEmail) {
      return (
        <TableCell className="email hidden-on-phone">Email</TableCell>
      );
    }
  }
  function renderAddressLine(addressLine){
    if (!hideAddressLine) {
      return (
        <TableCell className="addressLine ">{ addressLine }</TableCell>
      );
    }
  }
  function renderAddressLineHeader(){
    if (!hideAddressLine) {
      return (
        <TableCell className="addressLine"> Address</TableCell>
      );
    }
  }
  function renderCity(city){
    if (!hideCity) {
      return (
        <TableCell className="city ">{ city }</TableCell>
      );
    }
  }
  function renderCityHeader(){
    if (!hideCity) {
      return (
        <TableCell className="city">City</TableCell>
      );
    }
  }
  function renderState(state){
    if (!hideState) {
      return (
        <TableCell className="state">{ state }</TableCell>
      );
    }
  }
  function renderStateHeader(){
    if (!hideState) {
      return (
        <TableCell className="state">State</TableCell>
      );
    }
  }
  function renderPostalCode(postalCode){
    if (!hidePostalCode) {
      return (
        <TableCell className="postalCode">{ postalCode }</TableCell>
      );
    }
  }
  function renderPostalCodeHeader(){
    if (!hidePostalCode) {
      return (
        <TableCell className="postalCode">Postal Code</TableCell>
      );
    }
  }
  function renderFullAddress(fullAddress){
    if (!hideFullAddress) {
      return (
        <TableCell className="fullAddress ">{ fullAddress }</TableCell>
      );
    }
  }
  function renderFullAddressHeader(){
    if (!hideFullAddress) {
      return (
        <TableCell className="fullAddress">Full Address</TableCell>
      );
    }
  }
  function renderIssuer(issuer){
    if (!hideIssuer) {
      return (
        <TableCell className="issuer ">{ issuer }</TableCell>
      );
    }
  }
  function renderIssuerHeader(){
    if (!hideIssuer) {
      return (
        <TableCell className="issuer">Issuer</TableCell>
      );
    }
  }

  function renderQualification(qualification){
    if (!hideQualification) {
      return (
        <TableCell className="qualification ">{ qualification }</TableCell>
      );
    }
  }
  function renderQualificationHeader(){
    if (!hideQualification) {
      return (
        <TableCell className="qualification">Qualification</TableCell>
      );
    }
  }

  function renderQualificationCode(qualificationCode){
    if (!hideQualificationCode) {
      return (
        <TableCell className="qualificationCode ">{ qualificationCode }</TableCell>
      );
    }
  }
  function renderQualificationCodeHeader(){
    if (!hideQualificationCode) {
      return (
        <TableCell className="qualificationCode">Qualification Code</TableCell>
      );
    }
  }

  function renderQualificationStart(qualificationStart){
    if (!hideQualificationStart) {
      return (
        <TableCell className="qualificationStart">{ qualificationStart }</TableCell>
      );
    }
  }
  function renderQualificationStartHeader(){
    if (!hideQualificationStart) {
      return (
        <TableCell className="qualificationStart">Start</TableCell>
      );
    }
  }
  function renderQualificationEnd(qualificationEnd){
    if (!hideQualificationEnd) {
      return (
        <TableCell className="qualificationEnd ">{ qualificationEnd }</TableCell>
      );
    }
  }
  function renderQualificationEndHeader(){
    if (!hideQualificationEnd) {
      return (
        <TableCell className="qualificationEnd">End</TableCell>
      );
    }
  }


  function renderBarcode(id){
    if (!hideBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!hideBarcode) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }


  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let practitionersToRender = [];

  
  if(practitioners){
    if(practitioners.length > 0){     
      let count = 0;    

      practitioners.forEach(function(practitioner){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          practitionersToRender.push(FhirDehydrator.dehydratePractitioner(practitioner));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(practitionersToRender.length === 0){
    logger.trace('PractitionersTable: No practitioners to render.');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < practitionersToRender.length; i++) {
      let selected = false;
      if(practitionersToRender[i].id === selectedPractitionerId){
        selected = true;
      }
      if(get(practitionersToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('practitionersToRender[i]', practitionersToRender[i])
      tableRows.push(
        <TableRow className="practitionerRow" key={i} style={rowStyle} onClick={ handleRowClick.bind(this, practitionersToRender[i].id)} style={{cursor: 'pointer'}} hover={true} selected={selected} >            
          { renderCheckbox() }
          { renderActionIcons(practitionersToRender[i]) }
          { renderIdentifier(practitionersToRender[i].identifier ) }

          { renderFullName(practitionersToRender[i].fullName, practitionersToRender[i].fullAddress)}
          { renderPhone(practitionersToRender[i].phone)}
          { renderEmail(practitionersToRender[i].email)}
          { renderAddressLine(practitionersToRender[i].addressLine)}
          { renderCity(practitionersToRender[i].city)}
          { renderState(practitionersToRender[i].state)}
          { renderPostalCode(practitionersToRender[i].postalCode)}
          { renderFullAddress(practitionersToRender[i].fullAddress)}

          { renderIssuer(practitionersToRender[i].issuer) }
          { renderQualification(practitionersToRender[i].qualification) }
          { renderQualificationCode(practitionersToRender[i].qualificationCode) }
          { renderQualificationStart(practitionersToRender[i].qualificationStart) }
          { renderQualificationEnd(practitionersToRender[i].qualificationEnd) }

          { renderBarcode(practitionersToRender[i]._id)}
        </TableRow>
      );    
    }
  }



  //---------------------------------------------------------------------
  // Actual Render Method

  return(
    <div id={id} className="tableWithPagination">
      <Table id="practitionersTable" >
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() } 
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }

            { renderFullNameHeader() }
            { renderPhoneHeader() }
            { renderEmailHeader() }
            { renderAddressLineHeader() }
            { renderCityHeader() }
            { renderStateHeader() }
            { renderPostalCodeHeader() }
            { renderFullAddressHeader() }

            { renderIssuerHeader() }
            { renderQualificationHeader() }
            { renderQualificationCodeHeader() }
            { renderQualificationStartHeader() }
            { renderQualificationEndHeader() }

            { renderBarcodeHeader() }
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


PractitionersTable.propTypes = {
  id: PropTypes.string,

  data: PropTypes.array,
  practitioners: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox:  PropTypes.bool,
  hideActionIcons:  PropTypes.bool,
  hideIdentifier:  PropTypes.bool,
  hideFullName:  PropTypes.bool,
  hidePhone:  PropTypes.bool,
  hideEmail:  PropTypes.bool,
  hideAddressLine:  PropTypes.bool,
  hideCity:  PropTypes.bool,
  hideState:  PropTypes.bool,
  hidePostalCode:  PropTypes.bool,
  hideFullAddress:  PropTypes.bool,

  hideIssuer:  PropTypes.bool,
  hideQualification:  PropTypes.bool,
  hideQualificationCode:  PropTypes.bool,
  hideQualificationStart:  PropTypes.bool,
  hideQualificationEnd:  PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClihandle: PropTypes.func,
  hideActionButton: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  actionButtonLabel: PropTypes.string,
  hideExtensions: PropTypes.bool,

  rowsPerPage: PropTypes.number,
  tableRowSize: PropTypes.string,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  size: PropTypes.string,
  count: PropTypes.number,
  multiline: PropTypes.bool,

  formFactorLayout: PropTypes.string
};

PractitionersTable.defaultProps = {
  hideFullName: false,
  hideActionIcons: true,
  hideActionButton: true,
  hideIdentifier: true,
  hideCheckbox: true,
  hideBarcode: true,
  hideExtensions: true,
  multiline: false,
  hideIssuer: false,
  hideQualification: false,
  hideQualificationCode: true,
  hideQualificationStart: true,
  hideQualificationEnd: true,
  hideFullAddress: true,
  rowsPerPage: 5,
  tableRowSize: 'medium'
}

// ReactMixin(PractitionersTable.prototype, ReactMeteorData);
export default PractitionersTable;



