
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

flattenDevice = function(device, internalDateFormat){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    deviceName: '',
    deviceModel: '',
    manufacturer: '',
    serialNumber: '',
    costOfOwnership: '',
    status: ''
  };

  if(!internalDateFormat){
    internalDateFormat = "YYYY-MM-DD";
  }

  result._id =  get(device, 'id') ? get(device, 'id') : get(device, '_id');
  result.id = get(device, 'id', '');
  result.identifier = get(device, 'identifier[0].value', '');

  result.status = get(device, 'status', '');
  result.deviceName = get(device, 'type.text', '');
  result.deviceModel = get(device, 'model', '');
  result.manufacturer = get(device, 'manufacturer', '');
  result.serialNumber = get(device, 'identifier[0].value', '');
  result.note = get(device, 'note[0].text', '');
  

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
    devices,
    query,
    paginationLimit,
    disablePagination,
  
    displayCheckbox,
    displayIdentifier,
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
    tableRowSize,
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
    if (props.displayCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Checkbox</TableCell>
      );
    }
  }
  function renderCheckbox(patientId ){
    if (props.displayCheckbox) {
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
  function renderActionIcons( device ){
    if (props.displayActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{width: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, device)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, device._id)} /> */}
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
  let devicesToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.devices){
    if(props.devices.length > 0){     
      let count = 0;    

      props.devices.forEach(function(device){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          devicesToRender.push(flattenDevice(device, internalDateFormat));
        }
        count++;
      });  
    }
  }

  let rowStyle = {
    cursor: 'pointer'
  }
  if(devicesToRender.length === 0){
    logger.trace('ConditionsTable: No devices to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < devicesToRender.length; i++) {
      if(get(devicesToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      logger.trace('devicesToRender[i]', devicesToRender[i])
      tableRows.push(
        <TableRow className="deviceRow" key={i} style={rowStyle} onClick={ rowClick.bind(this, devicesToRender[i]._id)} style={{cursor: 'pointer'}} hover={true} >            
          { renderCheckbox() }  
          { renderActionIcons() }
          { renderIdentifier() }
          <TableCell className='deviceName'>{ get(devicesToRender[i], 'status') }</TableCell>
          <TableCell className='deviceName'>{ get(devicesToRender[i], 'device[0].name') }</TableCell>
          <TableCell className='manufacturer'>{devicesToRender[i].manufacturer }</TableCell>
          <TableCell className='deviceModel'>{devicesToRender[i].model }</TableCell>
          { renderBarcode(devicesToRender[i].id)}
          { renderActionButton(devicesToRender[i]) }
        </TableRow>
      );    
    }
  }



  //---------------------------------------------------------------------
  // Actual Render Method

  return(
    <div>
      <Table className='devicesTable' size={tableRowSize} aria-label="a dense table" { ...otherProps }>
        <TableHead>
          <TableRow>
            { renderCheckboxHeader() }  
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            <TableCell className='status'>Status</TableCell>
            <TableCell className='deviceName'>Name</TableCell>
            <TableCell className='manufacturer'>Manufacturer</TableCell>
            <TableCell className='deviceModel'>Model</TableCell>
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




DevicesTable.propTypes = {
  data: PropTypes.array,
  devices: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  displayCheckbox: PropTypes.bool,
  displayIdentifier: PropTypes.bool,
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
  tableRowSize: PropTypes.string,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  displayEnteredInError: PropTypes.bool
};

DevicesTable.defaultProps = {
  displayCheckbox: false,
  displayIdentifier: true,
  displayMake: true,
  displayModel: true,
  displayManufacturer: true,
  displaySerialNumber: true,
  rowsPerPage: 5,
  tableRowSize: 'medium'
}

export default DevicesTable;
