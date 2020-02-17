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

import moment from 'moment-es6'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go'

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

flattenObservation = function(observation, dateFormat){
  let result = {
    _id: '',
    meta: '',
    category: '',
    code: '',
    valueString: '',
    value: '',
    observationValue: '',
    subject: '',
    subjectId: '',
    status: '',
    device: '',
    createdBy: '',
    effectiveDateTime: '',
    issued: '',
    unit: ''
  };

  if(!dateFormat){
    dateFormat = get(Meteor, "settings.public.defaults.dateFormat", "YYYY-MM-DD hh a");
  }

  result._id =  get(observation, 'id') ? get(observation, 'id') : get(observation, '_id');

  result.category = get(observation, 'category.text', '');
  result.code = get(observation, 'code.text', '');
  result.codeValue = get(observation, 'code.coding[0].code', '');
  result.valueString = get(observation, 'valueString', '');
  result.comparator = get(observation, 'valueQuantity.comparator', '');
  result.observationValue = Number.parseFloat(get(observation, 'valueQuantity.value', 0)).toFixed(2);;
  result.unit = get(observation, 'valueQuantity.unit', '');
  result.subject = get(observation, 'subject.display', '');
  result.subjectId = get(observation, 'subject.reference', '');
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

  return result;
}


function ObservationsTable(props){
  // logger.log('ObservationsTable.props', props);
  // logger.log('ObservationsTable.props.observations', props.observations);

  const classes = useStyles();

  //---------------------------------------------------------------------
  // Pagination

  let rows = [];
  let rowsPerPageToRender = 5;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if(props.rowsPerPage){
    // if we receive an override as a prop, render that many rows
    // best to use rowsPerPage with disablePagination
    rowsPerPageToRender = props.rowsPerPage;
  } else {
    // otherwise default to the user selection
    rowsPerPageToRender = rowsPerPage;
  }

  let paginationCount = 101;
  if(props.count){
    paginationCount = props.count;
  } else {
    paginationCount = rows.length;
  }

  // handleChange(row, key, value) {
  //   const source = this.state.source;
  //   source[row][key] = value;
  //   this.setState({source});
  // }
  // displayOnMobile(width){
  //   let style = {};
  //   if(['iPhone'].includes(window.navigator.platform)){
  //     style.display = "none";
  //   }
  //   if(width){
  //     style.width = width;
  //   }
  //   return style;
  // }
  // function handleSelect(selected) {
  //   setState({selected});
  // }
  // function getDate(){
  //   return "YYYY/MM/DD";
  // }
  // function noChange(){
  //   return "";
  // }
  function rowClick(id){
    Session.set("selectedObservationId", id);
    Session.set('observationPageTabIndex', 2);
    Session.set('observationDetailState', false);
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
          <FaTags style={iconStyle} onClick={this.onMetaClick.bind(this, observation)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, observation._id)} />  
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
  function onActionButtonClick(id){
    if(typeof props.onActionButtonClick === "function"){
      props.onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof props.onCellClick === "function"){
      props.onCellClick(id);
    }
  }

  function onMetaClick(patient){
    let self = this;
    if(props.onMetaClick){
      props.onMetaClick(self, patient);
    }
  }
  function renderBarcode(id){
    if (!props.hideBarcodes) {
      return (
        <TableCell><span className="barcode helvetica">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.hideBarcodes) {
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
    if (props.multiline === false) {
      return (
        <TableCell className='category'>Category</TableCell>
      );
    }
  }
  function renderCategory(category){
    if (props.multiline === false) {
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
    if (!props.hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!props.hideCheckboxes) {
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

  let tableRows = [];
  let observationsToRender = [];
  let footer;
  let dateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    dateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.dateFormat){
    dateFormat = props.dateFormat;
  }

  if(props.observations){
    if(props.observations.length > 0){     
      let count = 0;    
      props.observations.forEach(function(observation){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          observationsToRender.push(flattenObservation(observation, dateFormat));
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
          <TableRow className="observationRow" key={i} onClick={ rowClick.bind(this, observationsToRender[i]._id)} >
            { renderToggle() }
            { renderActionIcons(observationsToRender[i]) }
            { renderCategory(observationsToRender[i].category) }
            { renderCodeValue(observationsToRender[i].codeValue) }
            { renderCode(observationsToRender[i].code, observationsToRender[i].value) }
            { renderValue(observationsToRender[i].value)}
            { renderSubject(observationsToRender[i].subject)}
            { renderStatus(observationsToRender[i].status) }
            { renderDevice(observationsToRender[i].device)}
            { renderEffectiveDateTime(observationsToRender[i].effectiveDateTime) }
            { renderBarcode(observationsToRender[i]._id)}
          </TableRow>
        );    

      } else {
        tableRows.push(
          <TableRow className="observationRow" key={i} onClick={ rowClick.bind(this, observationsToRender[i]._id)} >            
            { renderToggle() }
            { renderActionIcons(observationsToRender[i]) }
            { renderCategory(observationsToRender[i].category) }
            { renderCodeValue(observationsToRender[i].codeValue) }
            { renderCode(observationsToRender[i].code) }
            { renderValue(observationsToRender[i].value)}
            { renderSubject(observationsToRender[i].subject)}
            { renderStatus(observationsToRender[i].status) }
            { renderDevice(observationsToRender[i].device)}
            { renderEffectiveDateTime(observationsToRender[i].effectiveDateTime) }
            { renderBarcode(observationsToRender[i]._id)}
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
    <Table id="observationsTable" >
      <TableHead>
        <TableRow>
          { renderToggleHeader() }
          { renderActionIconsHeader() }
          { renderCategoryHeader() }
          { renderCodeValueHeader() }
          { renderCodeHeader() }
          { renderValueHeader() }
          { renderSubjectHeader() }
          { renderStatusHeader() }
          { renderDeviceHeader() }
          { renderEffectiveDateTimeHeader() }
          { renderBarcodeHeader() }
        </TableRow>
      </TableHead>
      <TableBody>
        { tableRows }
      </TableBody>
    </Table>
  );  
}

ObservationsTable.propTypes = {
  observations: PropTypes.array,
  query: PropTypes.object,
  barcodes: PropTypes.bool,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckboxes: PropTypes.bool,
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
  enteredInError: PropTypes.bool,
  multiline: PropTypes.bool,
  
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,

  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool
};


export default ObservationsTable; 