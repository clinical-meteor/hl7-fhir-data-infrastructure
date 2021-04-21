import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
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

// import React from 'react';
// import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';

import _ from 'lodash';
let get = _.get;
let set = _.set;
let has = _.has;

import moment from 'moment';

import FhirUtilities from '../../lib/FhirUtilities';

import { FhirDehydrator, StyledCard, PageCanvas } from 'fhir-starter';

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





// export class PractitionersTableOld extends React.Component {
//   // flattenPractitioner(practitioner){
//   //   console.log('PractitionersTable.flattenPractitioner()', practitioner)

//   //   let result = {
//   //     _id: practitioner._id,
//   //     name: '',
//   //     phone: '',
//   //     email: '',
//   //     qualificationIssuer: '',
//   //     qualificationIdentifier: '',
//   //     qualificationCode: '',
//   //     qualificationStart: null,
//   //     qualificationEnd: null,
//   //     text: '',
//   //     city: '',
//   //     state: '',
//   //     postalCode: ''
//   //   };

//   //   //---------------------------------------------------------
//   //   // TODO REFACTOR:  HumanName
//   //   // parse name!
//   //   // totally want to extract this

//   //   // STU3 and R4
//   //   if(Array.isArray(practitioner.name)){
//   //     if(get(practitioner, 'name[0].text')){
//   //       result.name = get(practitioner, 'name[0].text');
//   //     } else {
//   //       if(get(practitioner, 'name[0].suffix[0]')){
//   //         result.name = get(practitioner, 'name[0].suffix[0]')  + ' ';
//   //       }
    
//   //       result.name = result.name + get(practitioner, 'name[0].given[0]') + ' ';
        
//   //       if(get(practitioner, 'name[0].family[0]')){
//   //         result.name = result.name + get(practitioner, 'name[0].family[0]');
//   //       } else {
//   //         result.name = result.name + get(practitioner, 'name[0].family');
//   //       }
        
//   //       if(get(practitioner, 'name[0].suffix[0]')){
//   //         result.name = result.name + ' ' + get(practitioner, 'name[0].suffix[0]');
//   //       }
//   //     } 
//   //   } else {
//   //     // DSTU2
//   //     if(get(practitioner, 'name.text')){
//   //       result.name = get(practitioner, 'name.text');
//   //     } else {
//   //       if(get(practitioner, 'name.suffix[0]')){
//   //         result.name = get(practitioner, 'name.suffix[0]')  + ' ';
//   //       }
    
//   //       result.name = result.name + get(practitioner, 'name.given[0]') + ' ';
        
//   //       if(get(practitioner, 'name.family[0]')){
//   //         result.name = result.name + get(practitioner, 'name.family[0]');
//   //       } else {
//   //         result.name = result.name + get(practitioner, 'name.family');
//   //       }
        
//   //       if(get(practitioner, 'name.suffix[0]')){
//   //         result.name = result.name + ' ' + get(practitioner, 'name.suffix[0]');
//   //       }
//   //     } 
//   //   }

    
//   //   //---------------------------------------------------------

//   //   if(this.props.fhirVersion === 'v1.0.2'){
//   //     // if (get(practitioner, 'telecom[0].value')) {
//   //     //   result.phone = get(practitioner, 'telecom[0].value');
//   //     // }
//   //     // if (get(practitioner, 'telecom[0].use') ) {
//   //     //   result.email = get(practitioner, 'telecom[0].use')
//   //     // }
  
//   //     result.qualificationId = get(practitioner, 'qualification[0].identifier[0].value');
//   //     result.qualificationCode = get(practitioner, 'qualification[0].code.coding[0].code');
//   //     result.qualificationStart = moment(get(practitioner, 'qualification[0].period.start')).format("MMM YYYY");
//   //     result.qualificationEnd = moment(get(practitioner, 'qualification[0].period.end')).format("MMM YYYY");
//   //     result.issuer = get(practitioner, 'qualification[0].issuer.display');
    
//   //     result.text = get(practitioner, 'address[0].text')
//   //     result.city = get(practitioner, 'address[0].city')
//   //     result.state = get(practitioner, 'address[0].state')
//   //     result.postalCode = get(practitioner, 'address[0].postalCode')

//   //     //----------------------------------------------------------------
//   //     // TODO REFACTOR:  ContactPoint
//   //     // totally want to extract this

//   //     let telecomArray = get(practitioner, 'telecom');
//   //     telecomArray.forEach(function(telecomRecord){
//   //       if(get(telecomRecord, 'system') === 'phone'){
//   //         result.phone = get(telecomRecord, 'value');
//   //       }
//   //       if(get(telecomRecord, 'system') === 'email'){
//   //         result.email = get(telecomRecord, 'value');
//   //       }
//   //     })
//   //     //----------------------------------------------------------------
//   //   }

    
//   //   if(this.props.fhirVersion === 'v1.6.0'){
//   //     // tbd
//   //   }


//   //   if(this.props.fhirVersion === '3.0.1'){
//   //     // tbd      
//   //   }


//   //   return result;
//   // }
//   getMeteorData() {
//     var self = this;

//     let data = {
//       style: {
//         // row: Glass.darkroom({
//         //   opacity: Session.get('globalOpacity')
//         // })
//       },
//       selected: [],
//       practitioners: []
//     };

//     let query = {};
//     let options = {};

//     // number of items in the table should be set globally
//     if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
//       options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
//     }
//     // but can be over-ridden by props being more explicit
//     if(this.props.limit){
//       options.limit = this.props.limit;      
//     }

//     if(this.props.data){
//       // console.log('this.props.data', this.props.data);

//       if(this.props.data.length > 0){              
//         this.props.data.forEach(function(practitioner){
//           data.practitioners.push(self.flattenPractitioner(practitioner));
//         });  
//       }
//     } else {
//       data.practitioners = Practitioners.find().map(function(practitioner){
//         return self.flattenPractitioner(practitioner);
//       });
//     }
    
//     if(process.env.NODE_ENV === "test") console.log("PractitionersTable[data]", data);
//     return data;
//   }

//   rowClick(id){
//     Session.set('practitionerUpsert', false);
//     Session.set('selectedPractitionerId', id);
//     Session.set('practitionerPageTabIndex', 2);
//   }
//   render () {
//     let tableRows = [];
//     //console.log('this.data.practitioners', this.data.practitioners)
//     for (var i = 0; i < this.data.practitioners.length; i++) {
//       tableRows.push(
//       <TableRow className='practitionerRow' key={i} style={this.data.style.row} onClick={ this.rowClick.bind('this', this.data.practitioners[i]._id) }>
//         <TableCell className="name">{this.data.practitioners[i].name}</TableCell>
//         <TableCell className="phone">{this.data.practitioners[i].phone}</TableCell>
//         <TableCell className="email">{this.data.practitioners[i].email}</TableCell>
//         <TableCell className="issuer">{this.data.practitioners[i].issuer}</TableCell>
//         <TableCell className="qualificationCode">{this.data.practitioners[i].qualificationCode}</TableCell>
//         <TableCell className="qualificationStart">{this.data.practitioners[i].qualificationStart}</TableCell>
//         <TableCell className="qualificationEnd">{this.data.practitioners[i].qualificationEnd}</TableCell>
//         <TableCell className="city">{this.data.practitioners[i].city}</TableCell>
//         <TableCell className="state">{this.data.practitioners[i].state}</TableCell>
//         <TableCell className="barcode">{this.data.practitioners[i]._id}</TableCell>
//       </TableRow>);
//     }


//     return(
//       <Table id="practitionersTable" >
//         <TableHead>
//           <TableRow>
//             <TableCell className="name">Name</TableCell>
//             <TableCell className="phone">Phone</TableCell>
//             <TableCell className="email">Use</TableCell>
//             <TableCell className="issuer">Issuer</TableCell>
//             <TableCell className="qualificationCode">Credential</TableCell>
//             <TableCell className="qualificationStart">Start</TableCell>
//             <TableCell className="qualificationEnd">End</TableCell>
//             <TableCell className="city">City</TableCell>
//             <TableCell className="state">State</TableCell>
//             <TableCell className="barcode">System ID</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           { tableRows }
//         </TableBody>
//       </Table>

//     );
//   }
// }



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

    hideIssuer,
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
        hideCity = false;
        hideState = false;
        hidePostalCode = true;
        hideIssuer = true;
        hideQualificationCode = true;
        hideQualificationStart = true;
        hideQualificationEnd = true;
        multiline = true;
        break;
      case "tablet":
        hideFullName = false;
        hidePhone = true;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideIssuer = true;
        hideQualificationCode = true;
        hideQualificationStart = true;
        hideQualificationEnd = true;
        multiline = true;
        break;
      case "web":
        hideFullName = false;
        hidePhone = false;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideIssuer = true;
        hideQualificationCode = true;
        hideQualificationStart = true;
        hideQualificationEnd = true;
        multiline = false;
        break;
      case "desktop":
        hideFullName = false;
        hidePhone = false;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideIdentifier = false;
        hideIssuer = true;
        hideQualificationCode = true;
        hideQualificationStart = true;
        hideQualificationEnd = true;
        multiline = false;
        break;
      case "hdmi":
        hideFullName = false;
        hidePhone = false;
        hideEmail = true;
        hideAddressLine = true;
        hideCity = false;
        hideState = false;
        hidePostalCode = false;
        hideIdentifier = false;
        hideIssuer = false;
        hideQualificationCode = false;
        hideQualificationStart = false;
        hideQualificationEnd = false;
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
          practitionersToRender.push(FhirDehydrator.flattenPractitioner(practitioner));
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
        <TableRow className="practitionerRow" key={i} style={rowStyle} onClick={ handleRowClick.bind(this, practitionersToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} selected={selected} >            
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

          { renderIssuer(practitionersToRender[i].issuer) }
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

            { renderIssuerHeader() }
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

  hideIssuer:  PropTypes.bool,
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
  hideQualificationCode: true,
  hideQualificationStart: true,
  hideQualificationEnd: true,
  rowsPerPage: 5,
  tableRowSize: 'medium'
}

// ReactMixin(PractitionersTable.prototype, ReactMeteorData);
export default PractitionersTable;



