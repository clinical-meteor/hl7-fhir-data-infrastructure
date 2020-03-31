import React from 'react';
import PropTypes from 'prop-types';

import { 
  CssBaseline,
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

import TableNoData from 'material-fhir-ui';

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

// import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
// import { GoTrashcan } from 'react-icons/go';

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


flattenMeasureReport = function(measureReport){
  let result = {
    _id: '',
    meta: '',
    subject: '',
    subjectId: '',
    identifier: '',
    status: '',
    statusHistory: 0,
    periodStart: '',
    periodEnd: '',
    measureReference: '', 
    reasonDisplay: '', 
    typeCode: '',
    typeDisplay: '',
    classCode: ''
  };

  result._id =  get(measureReport, 'id') ? get(measureReport, 'id') : get(measureReport, '_id');


  if(get(measureReport, 'subject.display', '')){
    result.subject = get(measureReport, 'subject.display', '');
  } else {
    result.subject = get(measureReport, 'subject.reference', '');
  }
  result.subjectId = get(measureReport, 'subject.reference', '');

  result.identifier = get(measureReport, 'identifier[0].value', '');


  result.status = get(measureReport, 'status', '');
  result.periodStart = moment(get(measureReport, 'period.start', '')).format("YYYY-MM-DD hh:mm");
  result.periodEnd = moment(get(measureReport, 'period.end', '')).format("YYYY-MM-DD hh:ss");
  result.measureReference = get(measureReport, 'measure.reference', '');
  result.reasonDisplay = get(measureReport, 'reason[0].coding[0].display', '');
  result.typeCode = get(measureReport, 'type[0].coding[0].code', '');
  result.typeDisplay = get(measureReport, 'type[0].coding[0].display', '');

  if(get(measureReport, 'class.code')){
    result.classCode = get(measureReport, 'class.code', '');
  } else if(get(measureReport, 'class')){
    result.classCode = get(measureReport, 'class', '');
  }

  let statusHistory = get(measureReport, 'statusHistory', []);

  result.statusHistory = statusHistory.length;

  return result;
}


// export class MeasureReportsTable extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selected: [],
//       measureReports: []
//     }
//   }
//   getMeteorData() {

//     // this should all be handled by props
//     // or a mixin!
//     let data = {
//       style: {
//         text: Glass.darkroom()
//       },
//       selected: [],
//       measureReports: []
//     };

//     if(props.data){
//       logger.info('props.data', props.data);

//       if(props.data.length > 0){              
//         props.data.forEach(function(measureReport){
//           data.measureReports.push(flattenMeasureReport(measureReport));
//         });  
//       }
//     } else {
//       let query = {};
//       if(props.query){
//         query = props.query
//       }
//       if(props.hideEnteredInError){
//         query['verificationStatus'] = {
//           $nin: ['entered-in-error']  // unconfirmed | provisional | differential | confirmed | refuted | entered-in-error
//         }
//       }

//       data.measureReports = MeasureReports.find(query).map(function(measureReport){
//         return flattenMeasureReport(measureReport);
//       });
//     }

//     if(process.env.NODE_ENV === "test") logger.info("MeasureReportsTable[data]", data);
//     return data;
//   }




function MeasureReportsTable(props){
  logger.info('Rendering the MeasureReportsTable');
  logger.verbose('clinical:hl7-resource-encounter.client.MeasureReportsTable');
  logger.data('MeasureReportsTable.props', {data: props}, {source: "MeasureReportsTable.jsx"});

  const classes = useStyles();

  function handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  }
  function displayOnMobile(width){
    let style = {};
    if(['iPhone'].includes(window.navigator.platform)){
      style.display = "none";
    }
    if(width){
      style.width = width;
    }
    return style;
  }
  function handleSelect(selected) {
    this.setState({selected});
  }
  function getDate(){
    return "YYYY/MM/DD";
  }
  function noChange(){
    return "";
  }
  function rowClick(id){
    Session.set("selectedMeasureReportId", id);
    Session.set('measureReportPageTabIndex', 1);
    Session.set('measureReportDetailState', false);
  }
  function renderActionIconsHeader(){
    if (!props.hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(measureReport ){
    if (!props.hideActionIcons) {
      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <FaTags style={iconStyle} onClick={ onMetaClick.bind(measureReport)} />
          <GoTrashcan style={iconStyle} onClick={ removeRecord.bind(measureReport._id)} />   */}
        </TableCell>
      );
    }
  } 
  function removeRecord(_id){
    logger.info('Remove measureReport: ' + _id)
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
    if (!props.hideIdentifier) {
      return (
        <TableCell><span className="barcode">{id}</span></TableCell>
      );
    }
  }
  function renderBarcodeHeader(){
    if (!props.hideIdentifier) {
      return (
        <TableCell>System ID</TableCell>
      );
    }
  }
  function renderIdentifier(identifier){
    if (!props.hideSubjects) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!props.hideSubjects) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderDescription(identifier){
    let description = "";
    if(typeof identifier === "string"){
      description = identifier;
    }

    if(typeof Measures === "object"){
      let measures = Measures.find({'identifier[0].value': identifier}).fetch();
      if(measures && measures[0])
      description = get(measures[0], 'description', '');
    }

    if (!props.showDescription) {
      return (
        <TableCell className='description'>{ description }</TableCell>
      );
    }
  }
  function renderDescriptionHeader(){
    if (!props.showDescription) {
      return (
        <TableCell className='description'>Description</TableCell>
      );
    }
  }
  function renderStatus(valueString){
    if (!props.hideStatus) {
      return (
        <TableCell className='value'>{ valueString }</TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!props.hideStatus) {
      return (
        <TableCell className='value'>Value</TableCell>
      );
    }
  }

  function renderHistory(valueString){
    if (!props.hideHistory) {
      return (
        <TableCell className='history'>{ valueString }</TableCell>
      );
    }
  }
  function renderHistoryHeader(){
    if (!props.hideHistory) {
      return (
        <TableCell className='history'>Value</TableCell>
      );
    }
  }

  function renderTypeCodeHeader(){
    if (!props.hideTypeCode) {
      return (
        <TableCell className='typecode'>TypeCode</TableCell>
      );
    }
  }
  function renderTypeCode(code){
    if (!props.hideTypeCode) {
      return (
        <TableCell className='typecode'>{ code }</TableCell>
      );  
    }
  }
  function renderClassCodeHeader(){
    if (!props.hideClassCode) {
      return (
        <TableCell className='classcode'>Class</TableCell>
      );
    }
  }
  function renderClassCode(code){
    if (!props.hideClassCode) {
      return (
        <TableCell className='classcode'>{ code }</TableCell>
      );  
    }
  }
  function renderMeasureReferenceHeader(){
    if (!props.hideMeasureReference) {
      return (
        <TableCell className='measure'>Measure</TableCell>
      );
    }
  }
  function renderMeasureReference(code){
    if (!props.hideMeasureReference) {
      return (
        <TableCell className='measure'>{ code }</TableCell>
      );  
    }
  }
  function renderReasonHeader(){
    if (!props.hideReason) {
      return (
        <TableCell className='reason'>Reason</TableCell>
      );
    }
  }
  function renderReason(code){
    if (!props.hideReason) {
      return (
        <TableCell className='reason'>{ code }</TableCell>
      );  
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
            {/* <Checkbox
              defaultChecked={true}
            /> */}
        </TableCell>
      );
    }
  }



  let tableRows = [];
  let measureReportsToRender = [];
  if(props.measureReports){
    if(props.measureReports.length > 0){              
      props.measureReports.forEach(function(measureReport){
        measureReportsToRender.push(flattenMeasureReport(measureReport));
      });  
    }
  }

  if(measureReportsToRender.length === 0){
    logger.trace('MeasureReportsTable:  No measureReports to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < measureReportsToRender.length; i++) {
      if(props.multiline){
        tableRows.push(
          <TableRow className="measureReportRow" key={i} onClick={ rowClick(measureReportsToRender[i]._id)} >
            { renderToggle() }
            { renderActionIcons(measureReportsToRender[i]) }


            { renderIdentifier(measureReportsToRender[i].identifier)}
            { renderDescription(measureReportsToRender[i].identifier)}
            { renderMeasureReference(measureReportsToRender[i].measureReference)}

            {/* { renderClassCode(measureReportsToRender[i].classCode) }
            { renderTypeCode(measureReportsToRender[i].typeCode) } */}
            {/* <TableCell className='classCode' >{measureReportsToRender[i].classCode }</TableCell> */}
            {/* <TableCell className='typeCode' >{measureReportsToRender[i].typeCode }</TableCell> */}
            {/* <TableCell className='typeDisplay' >{measureReportsToRender[i].typeDisplay }</TableCell>
            { renderReason(measureReportsToRender[i].reasonDisplay)} */}
            {/* <TableCell className='measureReference' >{measureReportsToRender[i].measureReference }</TableCell>
            <TableCell className='reasonDisplay' >{measureReportsToRender[i].reasonDisplay }</TableCell> */}

            { renderStatus(measureReportsToRender[i].status)}
            {/* { renderHistory(measureReportsToRender[i].statusHistory)} */}

            {/* <TableCell className='status' >{measureReportsToRender[i].status }</TableCell>
            <TableCell className='statusHistory' >{measureReportsToRender[i].statusHistory }</TableCell> */}
            <TableCell className='periodStart' style={{minWidth: '140px'}}>{measureReportsToRender[i].periodStart }</TableCell>
            <TableCell className='periodEnd' style={{minWidth: '140px'}}>{measureReportsToRender[i].periodEnd }</TableCell>
            { renderBarcode(measureReportsToRender[i]._id)}
          </TableRow>
        );    

      } else {
        tableRows.push(
          <TableRow className="measureReportRow" key={i} onClick={ rowClick.bind(measureReportsToRender[i]._id)} >            
            { renderToggle() }
            { renderActionIcons(measureReportsToRender[i]) }
            { renderIdentifier(measureReportsToRender[i].identifier)}
            { renderDescription(measureReportsToRender[i].identifier)}
            { renderMeasureReference(measureReportsToRender[i].measureReference)}

            {/* { renderClassCode(measureReportsToRender[i].classCode) }
            { renderTypeCode(measureReportsToRender[i].typeCode) } */}
            {/* <TableCell className='classCode' >{ measureReportsToRender[i].classCode }</TableCell> */}
            {/* <TableCell className='typeCode' >{ measureReportsToRender[i].typeCode }</TableCell> */}
            {/* <TableCell className='typeDisplay' >{ measureReportsToRender[i].typeDisplay }</TableCell>
            { renderReason(measureReportsToRender[i].reasonDisplay)} */}
            {/* <TableCell className='measureReference' >{ measureReportsToRender[i].measureReference }</TableCell>
            <TableCell className='reasonDisplay' >{ measureReportsToRender[i].reasonDisplay }</TableCell> */}

            { renderStatus(measureReportsToRender[i].status)}
            {/* { renderHistory(measureReportsToRender[i].statusHistory)} */}

            {/* <TableCell className='status' >{ measureReportsToRender[i].status }</TableCell>
            <TableCell className='statusHistory' >{ measureReportsToRender[i].statusHistory }</TableCell> */}
            <TableCell className='periodStart' style={{minWidth: '140px'}}>{ measureReportsToRender[i].periodStart }</TableCell>
            <TableCell className='periodEnd' style={{minWidth: '140px'}}>{ measureReportsToRender[i].periodEnd }</TableCell>
            { renderBarcode(measureReportsToRender[i]._id)}
          </TableRow>
        );    
      }
    }
  }

  return(
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          { renderToggleHeader() }
          { renderActionIconsHeader() }
          { renderIdentifierHeader() }
          { renderDescriptionHeader() }
          { renderMeasureReferenceHeader() }
          
          {/* { renderClassCodeHeader() }
          { renderTypeCodeHeader() } */}
          {/* <TableCell className='classCode'>Class</TableCell> */}
          {/* <TableCell className='typeCode'>TypeCode</TableCell> */}
          {/* <TableCell className='typeDisplay'>Type</TableCell>
          { renderReasonHeader() } */}
          {/* <TableCell className='measureReference'>ReasonCode</TableCell>
          <TableCell className='reasonDisplay'>Reason</TableCell> */}

          { renderStatusHeader() }
          {/* { renderHistoryHeader() } */}

          {/* <TableCell className='status'>Status</TableCell>
          <TableCell className='statusHistory'>History</TableCell> */}
          <TableCell className='start' style={{minWidth: '140px'}}>Start</TableCell>
          <TableCell className='end' style={{minWidth: '140px'}}>End</TableCell>
          { renderBarcodeHeader() }
        </TableRow>
      </TableHead>
      <TableBody>
        { tableRows }
      </TableBody>
    </Table>
  );
}

MeasureReportsTable.propTypes = {
  barcodes: PropTypes.bool,
  measureReports: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  hideClassCode: PropTypes.bool,
  hideTypeCode: PropTypes.bool,
  hideReason: PropTypes.bool,
  hideMeasureReference: PropTypes.bool,
  hideSubjects: PropTypes.bool,
  hideCheckboxes: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideHistory: PropTypes.bool,
  showDescription: PropTypes.bool,
  enteredInError: PropTypes.bool,
  multiline: PropTypes.bool,
  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  showActionButton: PropTypes.bool
};


export default MeasureReportsTable; 