import React, { useState } from 'react';
import PropTypes from 'prop-types';



import { 
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
} from '@material-ui/core';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;


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

  flattenOrganization = function(organization, internalDateFormat){
    let result = {
      _id: '',
      id: '',
      meta: '',
      name: '',
      identifier: '',
      phone: '',
      addressLine: '',
      text: '',
      city: '',
      state: '',
      postalCode: ''
    };

    result._id =  get(organization, 'id') ? get(organization, 'id') : get(organization, '_id');
    result.id = get(organization, 'id', '');
    result.identifier = get(organization, 'identifier[0].value', '');

    result.name = get(organization, 'name', '')

    result.phone = FhirUtilities.pluckPhone(get(organization, 'telecom'));
    result.email = FhirUtilities.pluckEmail(get(organization, 'telecom'));

    result.addressLine = get(organization, 'address[0].line[0]');
    result.state = get(organization, 'address[0].state');
    result.postalCode = get(organization, 'address[0].postalCode');
    result.country = get(organization, 'address[0].country');

    return result;
  }

//===========================================================================
// SESSION VARIABLES

Session.setDefault('selectedOrganizations', []);


//===========================================================================
// MAIN COMPONENT


function OrganizationsTable(props){
  logger.info('Rendering the OrganizationsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.OrganizationsTable');
  logger.data('OrganizationsTable.props', {data: props}, {source: "OrganizationsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    data,
    organizations,
    query,
    paginationLimit,
    disablePagination,
  
    hideCheckboxes,
    hideActionIcons,
    hideIdentifier,
    hideName,
    hidePhone,
    hideEmail,
    hideAddressLine,
    hideCity,
    hideState,
    hidePostalCode,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClihandle,
    hideActionButton,
    hideBarcode,
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
  // Helper Methods  


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
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (!props.hideCheckboxes) {
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
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( organization ){
    if (!props.hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, organization)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, organization._id)} /> */}
        </TableCell>
      );
    }
  } 
  function renderIdentifier(identifier){
    if (!props.hideIdentifier) {
      return (
        <TableCell className="identifier hidden-on-phone">{ identifier }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!props.hideIdentifier) {
      return (
        <TableCell className="identifier hidden-on-phone">Identifier</TableCell>
      );
    }
  }
  function renderName(name){
    if (!props.hideName) {
      return (
        <TableCell className="name">{ name }</TableCell>
      );
    }
  }
  function renderNameHeader(){
    if (!props.hideName) {
      return (
        <TableCell className="name">Name</TableCell>
      );
    }
  }
  function renderPhone(phone){
    if (!props.hidePhone) {
      return (
        <TableCell className="phone">{ phone }</TableCell>
      );
    }
  }
  function renderPhoneHeader(){
    if (!props.hidePhone) {
      return (
        <TableCell className="phone">Phone</TableCell>
      );
    }
  }
  function renderEmail(email){
    if (!props.hideEmail) {
      return (
        <TableCell className="email hidden-on-phone">{ email }</TableCell>
      );
    }
  }
  function renderEmailHeader(){
    if (!props.hideEmail) {
      return (
        <TableCell className="email hidden-on-phone">Email</TableCell>
      );
    }
  }
  function renderAddressLine(addressLine){
    if (!props.hideAddressLine) {
      return (
        <TableCell className="addressLine ">{ addressLine }</TableCell>
      );
    }
  }
  function renderAddressLineHeader(){
    if (!props.hideAddressLine) {
      return (
        <TableCell className="addressLine"> Address</TableCell>
      );
    }
  }
  function renderCity(city){
    if (!props.hideCity) {
      return (
        <TableCell className="city ">{ city }</TableCell>
      );
    }
  }
  function renderCityHeader(){
    if (!props.hideCity) {
      return (
        <TableCell className="city">City</TableCell>
      );
    }
  }
  function renderState(state){
    if (!props.hideState) {
      return (
        <TableCell className="state">{ state }</TableCell>
      );
    }
  }
  function renderStateHeader(){
    if (!props.hideState) {
      return (
        <TableCell className="state">State</TableCell>
      );
    }
  }
  function renderPostalCode(postalCode){
    if (!props.hidePostalCode) {
      return (
        <TableCell className="postalCode hidden-on-phone">{ postalCode }</TableCell>
      );
    }
  }
  function renderPostalCodeHeader(){
    if (!props.hidePostalCode) {
      return (
        <TableCell className="postalCode hidden-on-phone">Postal Code</TableCell>
      );
    }
  }
  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.hideBarcode) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }
  function renderActionButtonHeader(){
    if (!props.hideActionButton) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(patient){
    if (!props.hideActionButton) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ handleActionButtonClick.bind(this, patient._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }

  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let organizationsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.organizations){
    if(props.organizations.length > 0){     
      let count = 0;    

      props.organizations.forEach(function(organization){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          organizationsToRender.push(flattenOrganization(organization));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(organizationsToRender.length === 0){
    logger.trace('OrganizationsTable: No organizations to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < organizationsToRender.length; i++) {
      if(get(organizationsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('organizationsToRender[i]', organizationsToRender[i])
      tableRows.push(
        <TableRow className="organizationRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, organizationsToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} >            
          { renderCheckbox() }
          { renderActionIcons(organizationsToRender[i]) }
          { renderIdentifier(organizationsToRender[i].identifier ) }

          {renderName(organizationsToRender[i].name)}
          {renderPhone(organizationsToRender[i].phone)}
          {renderEmail(organizationsToRender[i].email)}
          {renderAddressLine(organizationsToRender[i].addressLine)}
          {renderCity(organizationsToRender[i].city)}
          {renderState(organizationsToRender[i].state)}
          {renderPostalCode(organizationsToRender[i].postalCode)}

          { renderBarcode(organizationsToRender[i]._id)}
          { renderActionButton(organizationsToRender[i]) }
        </TableRow>
      );    
    }
  }


  //---------------------------------------------------------------------
  // Actual Render Method

  return(
    <div>
      <Table className='organizationsTable' size="small" aria-label="a dense table" { ...otherProps }>
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() } 
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }

            { renderNameHeader() }
            { renderPhoneHeader() }
            { renderEmailHeader() }
            { renderCityHeader() }
            { renderStateHeader() }
            { renderPostalCodeHeader() }
            
            { renderBarcodeHeader() }
            { renderActionButtonHeader() }
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


OrganizationsTable.propTypes = {
  data: PropTypes.array,
  organizations: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckboxes:  PropTypes.bool,
  hideActionIcons:  PropTypes.bool,
  hideIdentifier:  PropTypes.bool,
  hideName:  PropTypes.bool,
  hidePhone:  PropTypes.bool,
  hideEmail:  PropTypes.bool,
  hideAddressLine:  PropTypes.bool,
  hideCity:  PropTypes.bool,
  hideState:  PropTypes.bool,
  hidePostalCode:  PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClihandle: PropTypes.func,
  hideActionButton: PropTypes.bool,
  hideBarcode: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  displayEnteredInError: PropTypes.bool
};

OrganizationsTable.defaultProps = {
  hideName: false,
  hideActionButton: true,
  hideBarcode: true,
  rowsPerPage: 5
}

export default OrganizationsTable;



//===========================================================================
// MAIN COMPONENT  





// export class OrganizationsTable extends React.Component {
//   getMeteorData() {
//     let data = {
//       style: {
//         opacity: Session.get('globalOpacity'),
//         block: {
//           maxWidth: 250
//         }
//       },
//       selected: [],
//       organizations: Organizations.find().map(function(organization){
//         let result = {
//           _id: '',
//           name: '',
//           identifier: '',
//           phone: '',
//           email: '',
//           text: '',
//           city: '',
//           state: '',
//           postalCode: ''
//         };

//         result._id = get(organization, '_id');
//         result.name = get(organization, 'name')
//         result.identifier = get(organization, 'identifier[0].value', '')
    

//         //----------------------------------------------------------------
//         // TODO REFACTOR:  ContactPoint
//         // totally want to extract this

//         let telecomArray = get(organization, 'telecom', []);
//         telecomArray.forEach(function(telecomRecord){
//           if(get(telecomRecord, 'system') === 'phone'){
//             result.phone = get(telecomRecord, 'value');
//           }
//           if(get(telecomRecord, 'system') === 'email'){
//             result.email = get(telecomRecord, 'value');
//           }
//         })

//         //----------------------------------------------------------------
    
//         result.text = get(organization, 'address[0].text')
//         result.city = get(organization, 'address[0].city')
//         result.state = get(organization, 'address[0].state')
//         result.postalCode = get(organization, 'address[0].postalCode')

//         return result;
//       })
//     };

//     if(process.env.NODE_ENV === "test") console.log("OrganizationsTable[data]", data);

//     return data;
//   }
//   handleChange(row, key, value) {
//     const source = this.state.source;
//     source[row][key] = value;
//     this.setState({source});
//   }

//   handleSelect(selected) {
//     this.setState({selected});
//   }

//   rowClick(id){
//     Session.set('organizationUpsert', false);
//     Session.set('selectedOrganizationId', id);
//     Session.set('organizationPageTabIndex', 2);
//   }
//   renderIdentifier(identifier){
//     if (!props.hideIdentifier) {
//       return (
//         <TableCell className="identifier hidden-on-phone">{ identifier }</TableCell>
//       );
//     }
//   }
//   renderIdentifierHeader(){
//     if (!props.hideIdentifier) {
//       return (
//         <TableCell className="identifier hidden-on-phone">identifier</TableCell>
//       );
//     }
//   }
//   renderPhone(phone){
//     if (!props.hidePhone) {
//       return (
//         <TableCell className="phone">{ phone }</TableCell>
//       );
//     }
//   }
//   renderPhoneHeader(){
//     if (!props.hidePhone) {
//       return (
//         <TableCell className="phone">phone</TableCell>
//       );
//     }
//   }
//   renderEmail(email){
//     if (!props.hideEmail) {
//       return (
//         <TableCell className="email hidden-on-phone">{ email }</TableCell>
//       );
//     }
//   }
//   renderEmailHeader(){
//     if (!props.hideEmail) {
//       return (
//         <TableCell className="email hidden-on-phone">email</TableCell>
//       );
//     }
//   }
//   renderCity(city){
//     if (!props.hideCity) {
//       return (
//         <TableCell className="city ">{ city }</TableCell>
//       );
//     }
//   }
//   renderCityHeader(){
//     if (!props.hideCity) {
//       return (
//         <TableCell className="city">city</TableCell>
//       );
//     }
//   }
//   renderState(state){
//     if (!props.hideState) {
//       return (
//         <TableCell className="state">{ state }</TableCell>
//       );
//     }
//   }
//   renderStateHeader(){
//     if (!props.hideState) {
//       return (
//         <TableCell className="city">city</TableCell>
//       );
//     }
//   }
//   renderPostalCode(postalCode){
//     if (!props.hidePostalCode) {
//       return (
//         <TableCell className="postalCode hidden-on-phone">{ postalCode }</TableCell>
//       );
//     }
//   }
//   renderPostalCodeHeader(){
//     if (!props.hidePostalCode) {
//       return (
//         <TableCell className="postalCode hidden-on-phone">postalCode</TableCell>
//       );
//     }
//   }
  
//   render () {
//     let tableRows = [];
//     for (var i = 0; i < this.data.organizations.length; i++) {
//       tableRows.push(
//       <tr className='organizationRow' ref='med-{i}' key={i} style={{cursor: 'pointer'}} onClick={ this.rowClick.bind('this', this.data.organizations[i]._id) }>
//         <TableCell className="name">{this.data.organizations[i].name}</TableCell>
//         {this.renderIdentifier(this.data.organizations[i].identifier)}
//         {this.renderPhone(this.data.organizations[i].phone)}
//         {this.renderEmail(this.data.organizations[i].email)}
//         {this.renderCity(this.data.organizations[i].city)}
//         {this.renderState(this.data.organizations[i].state)}
//         {this.renderPostalCode(this.data.organizations[i].postalCode)}
//       </tr>);
//     }


//     return(
//       <Table id="organizationsTable" ref='organizationsTable' hover >
//         <TableCellead>
//           <tr>
//             <TableCell className="name">name</TableCell>
//             {this.renderIdentifierHeader() }
//             {this.renderPhoneHeader() }
//             {this.renderEmailHeader() }
//             {this.renderCityHeader() }
//             {this.renderStateHeader() }
//             {this.renderPostalCodeHeader() }
//           </tr>
//         </thead>
//         <tbody>
//           { tableRows }
//         </tbody>
//       </Table>
//     );
//   }
// }

// OrganizationsTable.propTypes = {
//   id: PropTypes.string,
//   fhirVersion: PropTypes.string,
//   hideIdentifier: PropTypes.bool,
//   hidePhone: PropTypes.bool,
//   hideEmail: PropTypes.bool,
//   hideCity: PropTypes.bool,
//   hideState: PropTypes.bool,
//   hidePostalCode: PropTypes.bool
// };
