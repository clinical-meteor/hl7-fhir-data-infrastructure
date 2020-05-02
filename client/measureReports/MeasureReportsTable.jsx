import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

import TableNoData from 'material-fhir-ui';

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

flattenMeasureReport = function(measureReport, measuresCursor, internalDateFormat, measureShorthand){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    type: '',
    measureUrl: '',
    measureTitle: '',
    date: '',
    reporter: '',
    periodStart: '',
    periodEnd: '',
    groupCode: '',
    populationCode: '',
    populationCount: '',
    measureScore: '',
    stratifierCount: ''
  };

  if(!internalDateFormat){
    internalDateFormat = get(Meteor, "settings.public.defaults.internalDateFormat", "YYYY-MM-DD");
  }

  result._id =  get(measureReport, 'id') ? get(measureReport, 'id') : get(measureReport, '_id');
  result.id = get(measureReport, 'id', '');
  result.identifier = get(measureReport, 'identifier[0].value', '');
  result.type = get(measureReport, 'type', '');

  result.measureUrl = FhirUtilities.pluckReferenceId(get(measureReport, 'measure', '')); 

  if(measuresCursor && result.measureUrl){
    let measure = measuresCursor.findOne({id: result.measureUrl});
    if(measureShorthand){
      result.measureTitle = get(measure, 'id');
    } else {
      result.measureTitle = get(measure, 'title');
    }
  }

  result.date = moment(get(measureReport, 'date', '')).format(internalDateFormat);
  if(get(measureReport, 'reporter.display', '')){
    result.reporter = get(measureReport, 'reporter.display', '');
  } else {
    result.reporter = get(measureReport, 'reporter.reference', '');
  }

  result.periodStart = moment(get(measureReport, 'period.start', '')).format(internalDateFormat);
  result.periodEnd = moment(get(measureReport, 'period.end', '')).format(internalDateFormat);

  result.groupCode = get(measureReport, 'group[0].coding[0].code', '');
  result.populationCode = get(measureReport, 'group[0].population[0].coding[0].code', '');
  result.populationCount = get(measureReport, 'group[0].population[0].count', '');

  result.measureScore = get(measureReport, 'group[0].measureScore.value', '');


  let stratifierArray = get(measureReport, 'group[0].stratifier', []);
  result.stratifierCount = stratifierArray.length;

  return result;
}




function MeasureReportsTable(props){
  logger.info('Rendering the MeasureReportsTable');
  logger.verbose('clinical:hl7-resource-encounter.client.MeasureReportsTable');
  logger.data('MeasureReportsTable.props', {data: props}, {source: "MeasureReportsTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    measureReports,
    selectedMeasureReportId,
    showMinutes,

    hideCheckboxes,
    hideIdentifier,
    hideTypeCode,
    hideMeasureTitle,
    hideMeasureUrl,
    hideDate,
    hideReporter,
    hidePeriodStart,
    hidePeriodEnd,
    hideGroupCode,
    hidePopulationCode,
    hidePopulationCount,
    hideMeasureScore,
    hideStratificationCount,
    hideActionIcons,
    measuresCursor,
    measureShorthand,

    onRowClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,

    query,
    paginationLimit,
    disablePagination,
    rowsPerPage,

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Helper Functions


  function handleRowClick(_id){
    console.log('Clicking row ' + _id)
    if(props.onRowClick){
      props.onRowClick(_id);
    }
  }

  function removeRecord(_id){
    logger.info('Remove measureReport: ' + _id)
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


  // ------------------------------------------------------------------------
  // Column Rendering

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
  function renderIdentifier(identifier){
    if (!props.hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
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
  function renderType(type){
    if (!props.hideType) {
      return (
        <TableCell className='type'>{ type }</TableCell>
      );
    }
  }
  function renderTypeHeader(){
    if (!props.hideType) {
      return (
        <TableCell className='type'>Type</TableCell>
      );
    }
  }
  function renderMeasureTitleHeader(){
    if (!props.hideMeasureTitle) {
      return (
        <TableCell className='measureTitle'>Measure</TableCell>
      );
    }
  }
  function renderMeasureTitle(title){
    if (!props.hideMeasureTitle) {
      return (
        <TableCell className='measureTitle'>{ title }</TableCell>
      );  
    }
  }
  function renderMeasureUrlHeader(){
    if (!props.hideMeasureUrl) {
      return (
        <TableCell className='measureUrl'>Measure Url</TableCell>
      );
    }
  }
  function renderMeasureUrl(url){
    if (!props.hideMeasureUrl) {
      return (
        <TableCell className='measureUrl'>{ url }</TableCell>
      );  
    }
  }
  function renderDate(date){
    if (!props.hideDate) {
      return (
        <TableCell className='date' style={{minWidth: '120px'}}>{ date }</TableCell>
      );
    }
  }
  function renderDateHeader(){
    if (!props.hideDate) {
      return (
        <TableCell className='date' style={{minWidth: '120px'}}>Date</TableCell>
      );
    }
  }
  function renderReporter(reporter){
    if (!props.hideReporter) {
      return (
        <TableCell className='reporter'>{ reporter }</TableCell>
      );
    }
  }
  function renderReporterHeader(){
    if (!props.hideReporter) {
      return (
        <TableCell className='reporter'>Reporter</TableCell>
      );
    }
  }
  function renderPeriodStart(periodStart){
    if (!props.hidePeriodStart) {
      return (
        <TableCell className='periodStart'>{ periodStart }</TableCell>
      );
    }
  }
  function renderPeriodStartHeader(){
    if (!props.hidePeriodStart) {
      return (
        <TableCell className='periodStart'>Start</TableCell>
      );
    }
  }
  function renderPeriodEnd(periodEnd){
    if (!props.hidePeriodEnd) {
      return (
        <TableCell className='periodEnd'>{ periodEnd }</TableCell>
      );
    }
  }
  function renderPeriodEndHeader(){
    if (!props.hidePeriodEnd) {
      return (
        <TableCell className='periodEnd'>End</TableCell>
      );
    }
  }
  function renderGroupCode(groupCode){
    if (!props.hideGroupCode) {
      return (
        <TableCell className='groupCode'>{ groupCode }</TableCell>
      );
    }
  }
  function renderGroupCodeHeader(){
    if (!props.hideGroupCode) {
      return (
        <TableCell className='groupCode'>Group Code</TableCell>
      );
    }
  }
  function renderPopulationCode(populationCode){
    if (!props.hidePopulationCode) {
      return (
        <TableCell className='populationCode'>{ populationCode }</TableCell>
      );
    }
  }
  function renderPopulationCodeHeader(){
    if (!props.hidePopulationCode) {
      return (
        <TableCell className='populationCode'>Population Code</TableCell>
      );
    }
  }
  function renderPopulationCount(populationCount){
    if (!props.hidePopulationCount) {
      return (
        <TableCell className='populationCount'>{ populationCount }</TableCell>
      );
    }
  }
  function renderPopulationCountHeader(){
    if (!props.hidePopulationCount) {
      return (
        <TableCell className='populationCount'>Population Count</TableCell>
      );
    }
  }
  function renderMeasureScore(measureScore){
    if (!props.hideMeasureScore) {
      return (
        <TableCell className='measureScore'>{ measureScore }</TableCell>
      );
    }
  }
  function renderMeasureScoreHeader(){
    if (!props.hideMeasureScore) {
      return (
        <TableCell className='measureScore'>Measure Score</TableCell>
      );
    }
  }
  function renderStratificationCount(stratificationCount){
    if (!props.hideStratificationCount) {
      return (
        <TableCell className='stratificationCount'>{ stratificationCount }</TableCell>
      );
    }
  }
  function renderStratificationCountHeader(){
    if (!props.hideStratificationCount) {
      return (
        <TableCell className='stratificationCount'>Stratificaiton</TableCell>
      );
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
  // Table Rows


  let tableRows = [];
  let measureReportsToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(props.showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(props.internalDateFormat){
    internalDateFormat = props.dateFormat;
  }

  if(props.measureReports){
    if(props.measureReports.length > 0){              
      props.measureReports.forEach(function(measureReport){
        measureReportsToRender.push(flattenMeasureReport(measureReport, props.measuresCursor, internalDateFormat, measureShorthand));
      });  
    }
  }

  if(measureReportsToRender.length === 0){
    logger.trace('MeasureReportsTable:  No measureReports to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < measureReportsToRender.length; i++) {
      let selected = false;
      if(measureReportsToRender[i].id === selectedMeasureReportId){
        selected = true;
      }

      tableRows.push(
        <TableRow className="measureReportRow" key={i} onClick={ handleRowClick.bind(this, measureReportsToRender[i]._id)} hover={true} style={{cursor: 'pointer', height: '52px'}} selected={selected} >            
          { renderToggle() }
          { renderActionIcons(measureReportsToRender[i]) }
          { renderIdentifier(measureReportsToRender[i].identifier)}
          
          { renderType(measureReportsToRender[i].type) }
          { renderDate(measureReportsToRender[i].date) }
          { renderReporter(measureReportsToRender[i].reporter) }
          { renderMeasureTitle(measureReportsToRender[i].measureTitle)}
          { renderMeasureUrl(measureReportsToRender[i].measureUrl)}
          { renderPeriodStart(measureReportsToRender[i].periodStart) }
          { renderPeriodEnd(measureReportsToRender[i].periodEnd) }
          { renderGroupCode(measureReportsToRender[i].groupCode) }
          { renderPopulationCode(measureReportsToRender[i].populationCode) }
          { renderPopulationCount(measureReportsToRender[i].populationCount) }
          { renderMeasureScore(measureReportsToRender[i].measureScore) }
          { renderStratificationCount(measureReportsToRender[i].stratificationCount) }          
          
          { renderBarcode(measureReportsToRender[i]._id)}
        </TableRow>
      );    
    }
  }

  return(
    <div>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }

            { renderTypeHeader() }
            { renderDateHeader() }
            { renderReporterHeader() }
            { renderMeasureTitleHeader() }
            { renderMeasureUrlHeader() }
            { renderPeriodStartHeader() }
            { renderPeriodEndHeader() }
            { renderGroupCodeHeader() }
            { renderPopulationCodeHeader() }
            { renderPopulationCountHeader() }
            { renderMeasureScoreHeader() }
            { renderStratificationCountHeader() }    
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

MeasureReportsTable.propTypes = {
  barcodes: PropTypes.bool,
  measureReports: PropTypes.array,
  selectedMeasureReportId: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  rowsPerPage: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckboxes: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideTypeCode: PropTypes.bool,
  hideMeasureUrl: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideReporter: PropTypes.bool,
  hidePeriodStart: PropTypes.bool,
  hidePeriodEnd: PropTypes.bool,
  hideGroupCode: PropTypes.bool,
  hidePopulationCode: PropTypes.bool,
  hidePopulationCount: PropTypes.bool,
  hideMeasureScore: PropTypes.bool,
  hideStratificationCount: PropTypes.bool,
  hideActionIcons: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  showActionButton: PropTypes.bool,

  measuresCursor: PropTypes.object,
  measureShorthand: PropTypes.bool
};
MeasureReportsTable.defaultProps = {
  rowsPerPage: 5,
  showMinutes: false,
  hideCheckboxes: true,
  hideIdentifier: true,
  hideStatus: true,
  hideTypeCode: true,
  hideMeasureTitle: false,
  hideMeasureUrl: true,
  hideDate: false,
  hideReporter: false,
  hidePeriodStart: false,
  hidePeriodEnd: false,
  hideGroupCode: true,
  hidePopulationCode: true,
  hidePopulationCount: true,
  hideMeasureScore: false,
  hideStratificationCount: true,
  hideActionIcons: true,
  measureShorthand: false,
  selectedMeasureReportId: false
}

export default MeasureReportsTable; 