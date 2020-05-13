import React, { useState } from 'react';
import PropTypes from 'prop-types';


import { 
  Checkbox,
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@material-ui/core';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'


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

flattenObservation = function(observation, dateFormat, props){
  let result = {
    _id: '',
    meta: '',
    category: '',
    codeValue: '',
    codeDisplay: '',
    valueString: '',
    value: '',
    observationValue: '',
    subject: '',
    subjectReference: '',
    status: '',
    device: '',
    createdBy: '',
    effectiveDateTime: '',
    issued: '',
    unit: '',
    numerator: '',
    denominator: ''
  };

  if(!dateFormat){
    dateFormat = get(Meteor, "settings.public.defaults.dateFormat", "YYYY-MM-DD hh a");
  }

  result._id =  get(observation, 'id') ? get(observation, 'id') : get(observation, '_id');

  if(get(observation, 'category[0].text')){
    result.category = get(observation, 'category[0].text', '');
  } else if (get(observation, 'category[0].coding[0].display')){
    result.category = get(observation, 'category[0].coding[0].display', '');
  }

  if(get(observation, 'code.coding[0].code')){
    result.codeValue = get(observation, 'code.coding[0].code', '');
  } else {
    result.codeValue = get(observation, 'code.text', '');
  }
  if(get(observation, 'code.coding[0].display')){
    result.codeDisplay = get(observation, 'code.coding[0].display', '');
  } else {
    result.codeDisplay = get(observation, 'code.text', '');
  }

  // result.codeValue = get(observation, 'code.coding[0].code', '');
  result.subject = get(observation, 'subject.display', '');
  result.subjectReference = get(observation, 'subject.reference', '');
  result.device = get(observation, 'device.display', '');
  result.status = get(observation, 'status', '');
  
  if(get(observation, 'effectiveDateTime')){
    result.effectiveDateTime =  moment(get(observation, 'effectiveDateTime')).format(dateFormat);
  }
  if(get(observation, 'issued')){
    result.effectiveDateTime =  moment(get(observation, 'issued')).format(dateFormat);    
  }

  result.meta = get(observation, 'category.text', '');

  if(result.valueString.length > 0){
    result.value = result.valueString;
  } else {
    if(result.comparator){
      result.value = result.comparator + ' ';
    } 
    result.value = result.value + result.observationValue + ' ' + result.unit;
  }

  if(Array.isArray(get(observation, 'component'))){
    // sometimes observations have multiple components
    // a great example is blood pressure, which includes systolic and diastolic measurements
    observation.component.forEach(function(componentObservation){
      // we grab the numerator and denominator and put in separate fields
      if(get(componentObservation, 'code.coding[0].code') === get(props, 'numeratorCode')){
        result.numerator = get(componentObservation, 'valueQuantity.value') + get(componentObservation, 'code.valueQuantity.unit')
      }
      if(get(componentObservation, 'code.coding[0].code') === get(props, 'denominatorCode')){
        result.denominator = get(componentObservation, 'valueQuantity.value') + get(componentObservation, 'code.valueQuantity.unit')
      }
    })
    // and if it's multiComponentValue, we string it all together into a nice string to be displayed
    if(props.multiComponentValues){
      result.unit = get(observation, 'valueQuantity.unit', '');  
      result.valueString = result.numerator + " / " + result.denominator + " " +  result.unit;
    }
  } else {
    // most observations arrive in a single component
    // some values are a string, such as Blood Type, or pos/neg
    if(get(observation, 'valueString')){
      result.valueString = get(observation, 'valueString', '');
    } else if(get(observation, 'valueCodeableConcept')){
      result.valueString = get(observation, 'valueCodeableConcept.text', '');
    } else {
      // other values are quantities with units
      // we need to place the quantity bits in the appropriate cells
      result.comparator = get(observation, 'valueQuantity.comparator', '');
      result.observationValue = Number.parseFloat(get(observation, 'valueQuantity.value', 0)).toFixed(2);;
      result.unit = get(observation, 'valueQuantity.unit', '');  

      // but we also want to string it together into a nice readable string
      result.valueString = result.comparator + " " + result.observationValue + " " + result.unit;
    }
  }

  return result;
}


function ObservationsTable(props){
  logger.info('Rendering the ObservationsTable');
  logger.verbose('clinical:hl7-fhir-data-infrastructure.client.ObservationsTable');
  logger.data('ObservationsTable.props', {data: props}, {source: "ObservationsTable.jsx"});

  //---------------------------------------------------------------------
  // Properties

  const {
    observations,
    query,
    barcodes,
    paginationLimit,
    disablePagination,
  
    hideCheckbox,
    hideActionIcons,
    hideIdentifier,
    hideCategory,
    hideValue,
    hideSubject,
    hideSubjects,
    hideSubjectReference,
    hideEffectiveDateTime,
    hideStatus,
    hideCodeValue,
    hideCode,
    hideDevices,
    hideComparator,
  
    hideNumerator,
    hideDenominator,
    denominatorLabel,
    denominatorCode,
    numeratorLabel,
    numeratorCode,
  
    enteredInError,
    multiline,
    multiComponentValues,
  
    hideBarcode,
  
    onCellClick,
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    actionButtonLabel,
  
    rowsPerPage,
    tableRowSize,
    dateFormat,
    showMinutes,
    count,

    ...otherProps

  } = props


  //---------------------------------------------------------------------
  // Styling 

  const classes = useStyles();


  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  
  const [page, setPage] = useState(0);
  const [rowsPerPageToRender, setRowsPerPage] = useState(props.rowsPerPage);

  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
  } else {
    paginationCount = rows.length;
  }

  function rowClick(id){
    if(typeof props.onRowClick === "function"){
      props.onRowClick(id);
    }
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(observation ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={this.onMetaClick.bind(this, observation)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={this.removeRecord.bind(this, observation._id)} /> */}
        </TableCell>
      );
    }
  } 
  function removeRecord(_id){
    logger.info('Remove observation: ' + _id)
    if(props.onRemoveRecord){
      props.onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof props.onCellClick === "function"){
      props.onCellClick(id);
    }
  }

  function handleMetaClick(patient){
    let self = this;
    if(props.onMetaClick){
      props.onMetaClick(self, patient);
    }
  }
  function renderBarcode(id){
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode helvetica">{id}</span></TableCell>
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
  function renderSubject(id){
    if (!props.hideSubject) {
      return (
        <TableCell className='name'>{ id }</TableCell>
      );
    }
  }
  function renderSubjectHeader(){
    if (!props.hideSubject) {
      return (
      <TableCell className='name'>Subject</TableCell>
      );
    }
  }
  function renderSubjectReference(id){
    if (!props.hideSubjectReference) {
      return (
        <TableCell className='subjectReference'>{ id }</TableCell>
      );
    }
  }
  function renderSubjectReferenceHeader(){
    if (!props.hideSubjectReference) {
      return (
      <TableCell className='subjectReference'>Subject Reference</TableCell>
      );
    }
  }
  function renderDevice(device){
    if (!props.hideDevices) {
      return (
      <TableCell className='device.display'>{device }</TableCell>
      );
    }    
  }
  function renderDeviceHeader(){
    if (!props.hideDevices) {
      return (
        <TableCell className='device.display'>Device</TableCell>
      );
    }
  }
  function renderValue(valueString){
    if (!props.hideValue) {
      return (
        <TableCell className='value'>{ valueString }</TableCell>
      );
    }
  }
  function renderValueHeader(){
    if (!props.hideValue) {
      return (
        <TableCell className='value'>Value</TableCell>
      );
    }
  }
  function renderCodeValueHeader(){
    if (!props.hideCodeValue) {
      return (
        <TableCell className='codeValue'>Code Value</TableCell>
      );
    }
  }
  function renderCodeValue(code){
    if (!props.hideCodeValue) {
      return (
        <TableCell className='codeValue'>{ code }</TableCell>
      );  
    }
  }
  function renderCodeHeader(){
    if (!props.hideCode) {
      return (
        <TableCell className='code'>Code</TableCell>
      );
    }
  }
  function renderCode(code, value){
    if (!props.hideCode) {
      if(props.multiline){
        return (<TableCell className='code'>
          <span style={{fontWeight: 400}}>{code }</span> <br />
          { value }
        </TableCell>)
      } else {
        return (
          <TableCell className='category'>{ code }</TableCell>
        );  
      }
    }
  }
  function renderCategoryHeader(){
    if (!props.hideCategory) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (!props.hideCategory) {
      return (
        <TableCell className='category'>{ category }</TableCell>
      );
    }
  }
  function renderValueString(valueString){
    if (!props.hideValue) {
      return (
        <TableCell className='value'>{ valueString }</TableCell>
      );
    }
  }
  function renderValueStringHeader(){
    if (!props.hideValue) {
      return (
        <TableCell className='value'>Value</TableCell>
      );
    }
  }
  function renderComparator(comparator){
    if (!props.hideComparator) {
      return (
        <TableCell className='comparator'>{ comparator }</TableCell>
      );
    }
  }
  function renderComparatorHeader(){
    if (!props.hideComparator) {
      return (
        <TableCell className='comparator'>Comparator</TableCell>
        );
    }
  }
  function renderToggleHeader(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!props.hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}}>
            <Checkbox
              defaultChecked={true}
            />
          </TableCell>
      );
    }
  }
  function renderStatus(valueString){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>{ valueString }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>Status</TableCell>
      );
    }
  }
  function renderEffectiveDateTimeHeader(){
    if (!props.hideEffectiveDateTime) {
      return (
        <TableCell className='effectiveDateTime' style={{minWidth: '140px'}}>Performed</TableCell>
      );
    }
  }
  function renderEffectiveDateTime(effectiveDateTime){
    if (!props.hideEffectiveDateTime) {
      return (
        <TableCell className='effectiveDateTime' style={{minWidth: '140px'}}>{ effectiveDateTime }</TableCell>
      );
    }
  }
  function renderComponentNumerator(numerator){
    if (!props.hideNumerator) {
      return (
        <TableCell className='numerator'>{ numerator }</TableCell>
      );
    }
  }
  function renderComponentNumeratorHeader(){
    if (!props.hideNumerator) {
      return (
        <TableCell className='numerator'>{props.numeratorLabel}</TableCell>
      );
    }
  }
  function renderComponentDenominator(denominator){
    if (!props.hideDenominator) {
      return (
        <TableCell className='denominator'>{ denominator }</TableCell>
      );
    }
  }
  function renderComponentDenominatorHeader(){
    if (!props.hideDenominator) {
      return (
        <TableCell className='denominator'>{props.denominatorLabel}</TableCell>
      );
    }
  }


  let tableRows = [];
  let observationsToRender = [];
  let footer;
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.observations){
    if(props.observations.length > 0){     
      let count = 0;    
      props.observations.forEach(function(observation){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          observationsToRender.push(flattenObservation(observation, internalDateFormat, props));
        }
        count++;
      });  
    }
  }

  if(observationsToRender.length === 0){
    logger.trace('ObservationsTable:  No observations to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < observationsToRender.length; i++) {
      if(props.multiline){
        tableRows.push(
          <TableRow className="observationRow" key={i} onClick={ rowClick.bind(this, observationsToRender[i]._id)} hover={true}>
            { renderToggle() }
            { renderActionIcons(observationsToRender[i]) }
            { renderCategory(observationsToRender[i].category) }
            { renderCodeValue(observationsToRender[i].codeValue) }
            { renderCode(observationsToRender[i].codeDisplay, observationsToRender[i].value) }
            { renderValue(observationsToRender[i].valueString)}
            { renderSubject(observationsToRender[i].subject)}
            { renderSubjectReference(observationsToRender[i].subjectReference)}
            { renderStatus(observationsToRender[i].status) }
            { renderDevice(observationsToRender[i].device)}
            { renderEffectiveDateTime(observationsToRender[i].effectiveDateTime) }
            { renderComponentNumerator(observationsToRender[i].numerator)}
            { renderComponentDenominator(observationsToRender[i].denominator)}
            { renderBarcode(observationsToRender[i].id)}
          </TableRow>
        );    

      } else {
        tableRows.push(
          <TableRow className="observationRow" key={i} onClick={ rowClick.bind(this, observationsToRender[i].id)} hover={true}>            
            { renderToggle() }
            { renderActionIcons(observationsToRender[i]) }
            { renderCategory(observationsToRender[i].category) }
            { renderCodeValue(observationsToRender[i].codeValue) }
            { renderCode(observationsToRender[i].codeDisplay) }
            { renderValue(observationsToRender[i].valueString)}
            { renderSubject(observationsToRender[i].subject)}
            { renderSubjectReference(observationsToRender[i].subjectReference)}
            { renderStatus(observationsToRender[i].status) }
            { renderDevice(observationsToRender[i].device)}
            { renderEffectiveDateTime(observationsToRender[i].effectiveDateTime) }
            { renderComponentNumerator(observationsToRender[i].numerator)}
            { renderComponentDenominator(observationsToRender[i].denominator)}
            { renderBarcode(observationsToRender[i].id)}
          </TableRow>
        );    
      }
    }
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
  
  return(
    <div>
      <Table id="observationsTable" size={tableRowSize} aria-label="a dense table" { ...otherProps }>
        <TableHead>
          <TableRow key='tableHeader'>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderCategoryHeader() }
            { renderCodeValueHeader() }
            { renderCodeHeader() }
            { renderValueHeader() }
            { renderSubjectHeader() }
            { renderSubjectReferenceHeader() }
            { renderStatusHeader() }
            { renderDeviceHeader() }
            { renderEffectiveDateTimeHeader() }
            { renderComponentNumeratorHeader()}
            { renderComponentDenominatorHeader()}
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

ObservationsTable.propTypes = {
  observations: PropTypes.array,
  query: PropTypes.object,
  
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideValue: PropTypes.bool,
  hideSubject: PropTypes.bool,
  hideSubjects: PropTypes.bool,
  hideSubjectReference: PropTypes.bool,
  hideEffectiveDateTime: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideCodeValue: PropTypes.bool,
  hideCode: PropTypes.bool,
  hideDevices: PropTypes.bool,
  hideComparator: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  hideNumerator: PropTypes.bool,
  hideDenominator: PropTypes.bool,
  denominatorLabel: PropTypes.string,
  denominatorCode: PropTypes.string,
  numeratorLabel: PropTypes.string,
  numeratorCode: PropTypes.string,

  enteredInError: PropTypes.bool,
  multiline: PropTypes.bool,
  multiComponentValues: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,
  tableRowSize: PropTypes.string,

  count: PropTypes.number
};
ObservationsTable.defaultProps = {
  hideBarcode: true,
  rowsPerPage: 5,
  hideNumerator: true,
  hideDenominator: true,
  numeratorLabel: "Systolic",
  denominatorLabel: "Diastolic",
  numeratorCode: "8480-6",
  denominatorCode: "8462-4",
  multiComponentValues: false,
  tableRowSize: 'small'
}


export default ObservationsTable; 