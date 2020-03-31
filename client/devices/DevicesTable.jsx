
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

flattenCondition = function(condition, internalDateFormat){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    deviceType: '',
    deviceModel: '',
    manufacturer: '',
    serialNumber: '',
    costOfOwnership: ''
  };

  if(!internalDateFormat){
    internalDateFormat = "YYYY-MM-DD";
  }

  result._id =  get(condition, 'id') ? get(condition, 'id') : get(condition, '_id');
  result.id = get(condition, 'id', '');
  result.identifier = get(condition, 'identifier[0].value', '');

  result.deviceType = get(condition, 'type.text', '');
  result.deviceModel = get(condition, 'model', '');
  result.manufacturer = get(condition, 'manufacturer', '');
  result.serialNumber = get(condition, 'identifier[0].value', '');
  result.note = get(condition, 'note[0].text', '');

  return result;
}


function DevicesTable(props){
  logger.info('Rendering the DevicesTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.DevicesTable');
  logger.data('DevicesTable.props', {data: props}, {source: "DevicesTable.jsx"});

  const classes = useStyles();

  let { 
    children, 

    data,
    conditions,
    query,
    paginationLimit,
    disablePagination,
  
    displayCheckboxes,
    displayMake,
    displayModel,
    displayManufacturer,
    displaySerialNumber,

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

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
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
  // Column Rendering 

  function renderCheckboxHeader(){
    if (props.displayCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (props.displayCheckboxes) {
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
    if (props.displayActionIcons) {
      return (
        <TableCell className='actionIcons'>Actions</TableCell>
      );
    }
  }
  function renderActionIcons( condition ){
    if (props.displayActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, condition)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, condition._id)} /> */}
        </TableCell>
      );
    }
  } 
  function renderIdentifierHeader(){
    if (props.displayIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderIdentifier(identifier ){
    if (props.displayIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  } 

  function renderBarcode(id){
    if (props.displayBarcode) {
      return (
        <TableCell><span className="barcode helveticas">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (props.displayBarcode) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }
  function renderActionButtonHeader(){
    if (props.showActionButton === true) {
      return (
        <TableCell className='ActionButton' >Action</TableCell>
      );
    }
  }
  function renderActionButton(patient){
    if (props.showActionButton === true) {
      return (
        <TableCell className='ActionButton' >
          <Button onClick={ onActionButtonClick.bind(this, patient[i]._id)}>{ get(props, "actionButtonLabel", "") }</Button>
        </TableCell>
      );
    }
  }

  //---------------------------------------------------------------------
  // Table Rows

  let tableRows = [];
  let conditionsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.conditions){
    if(props.conditions.length > 0){     
      let count = 0;    

      props.conditions.forEach(function(condition){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          conditionsToRender.push(flattenCondition(condition, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(conditionsToRender.length === 0){
    logger.trace('ConditionsTable: No conditions to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < conditionsToRender.length; i++) {
      if(get(conditionsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('conditionsToRender[i]', conditionsToRender[i])
      tableRows.push(
        <TableRow className="deviceRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, conditionsToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} >            
          <TableCell className='deviceType'>{this.data.devices[i].type.text }</TableCell>
          <TableCell className='manufacturer'>{this.data.devices[i].manufacturer }</TableCell>
          <TableCell className='deviceModel'>{this.data.devices[i].model }</TableCell>
          <TableCell className='serialNumber'>{this.data.devices[i].identifier[0] ? this.data.devices[i].identifier[0].value :  '' }</TableCell>
          <TableCell className="costOfOwnership">{ (this.data.devices[i].note && this.data.devices[i].note[0]) ? this.data.devices[i].note[0].text : '' }</TableCell>
          { renderBarcode(conditionsToRender[i]._id)}
          { renderActionButton(conditionsToRender[i]) }
        </TableRow>
      );    
    }
  }



  //---------------------------------------------------------------------
  // Actual Render Method

  return(
    <div>
      <Table className='conditionsTable' size="small" aria-label="a dense table" { ...otherProps }>
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() }  
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            <TableCell className='deviceType'>Type</TableCell>
            <TableCell className='manufacturer'>Manufacturer</TableCell>
            <TableCell className='deviceModel'>Model</TableCell>
            <TableCell className='serialNumber'>Serial Number</TableCell>
            <TableCell className='costOfOwnership'>Notes</TableCell>
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


// export default class DevicesTable extends React.Component {

//   getMeteorData() {
//     let data = {
//       style: {},
//       selected: [],
//       devices: Devices.find().fetch()
//     }

//     if(process.env.NODE_ENV === "test") console.log("DevicesTable[data]", data);
//     return data;
//   };


//   rowClick(id){
//     // Session.set('devicesUpsert', false);
//     // Session.set('selectedDeviceId', id);
//     // Session.set('devicePageTabIndex', 2);
//   };
//   render () {
//     let tableRows = [];
//     for (var i = 0; i < this.data.devices.length; i++) {
//       tableRows.push(
//         <tr key={i} className="deviceRow" style={{cursor: "pointer"}} onClick={ this.rowClick.bind('this', this.data.devices[i]._id)} >

//           <td className='deviceType'>{this.data.devices[i].type.text }</td>
//           <td className='manufacturer'>{this.data.devices[i].manufacturer }</td>
//           <td className='deviceModel'>{this.data.devices[i].model }</td>
//           <td className='serialNumber'>{this.data.devices[i].identifier[0] ? this.data.devices[i].identifier[0].value :  '' }</td>
//           <td className="costOfOwnership">{ (this.data.devices[i].note && this.data.devices[i].note[0]) ? this.data.devices[i].note[0].text : '' }</td>
//           <td><span className="barcode">{ this.data.devices[i]._id }</span></td>
//         </tr>
//       );
//     }

//     return(
//       <Table id='devicesTable' hover >
//         <thead>
//           <tr>
//             <th className='deviceType'>type</th>
//             <th className='manufacturer'>manufacturer</th>
//             <th className='deviceModel'>model</th>
//             <th className='serialNumber'>serial number</th>
//             <th className='costOfOwnership'>cost ($/year)</th>
//             <th>_id</th>
//           </tr>
//         </thead>
//         <tbody>
//           { tableRows }
//         </tbody>
//       </Table>
//     );
//   }
// }



DevicesTable.propTypes = {
  data: PropTypes.array,
  conditions: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  displayCheckboxes: PropTypes.bool,
  displayMake: PropTypes.bool,
  displayModel: PropTypes.bool,
  displayManufacturer: PropTypes.bool,
  displaySerialNumber: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  showActionButton: PropTypes.bool,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  displayEnteredInError: PropTypes.bool
};

DevicesTable.defaultProps = {
  displayCheckboxes: false,
  displayMake: true,
  displayModel: true,
  displayManufacturer: true,
  displaySerialNumber: true,
  rowsPerPage: 5
}

export default DevicesTable;
