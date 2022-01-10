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

import moment from 'moment'
import _ from 'lodash';
let get = _.get;
let set = _.set;

import { FhirUtilities } from '../../lib/FhirUtilities';
import { StyledCard, PageCanvas, TableNoData } from 'fhir-starter';
import { FhirDehydrator } from '../../lib/FhirDehydrator';

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


export function MeasureReportsTable(props){
  logger.debug('Rendering the MeasureReportsTable');
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
    hideSubject,
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
    measureScoreType,
    measureScoreLabel,
    hideNumerator,
    hideDenominator,
    hideBarcode,
    hideStatus,

    onRowClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,

    query,
    paginationLimit,
    disablePagination,
    rowsPerPage,
    tableRowSize,

    page,
    onSetPage,

    count,
    formFactorLayout,

    ...otherProps 
  } = props;

  // ------------------------------------------------------------------------
  // Helper Functions


  function handleRowClick(_id){
    // console.log('Clicking row ' + _id)
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
  function renderStatus(status){
    if (!props.hideStatus) {
      return (
        <TableCell className='status'>{ status }</TableCell>
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
        <TableCell className='date' style={{minWidth: '120px'}}>Report Date</TableCell>
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
    if (!props.hideSubject) {
      return (
        <TableCell className='reporter'>Reporter</TableCell>
      );
    }
  }
  function renderSubject(subject){
    if (!props.hideSubject) {
      return (
        <TableCell className='subject'>{ subject }</TableCell>
      );
    }
  }
  function renderSubjectHeader(){
    if (!props.hideReporter) {
      return (
        <TableCell className='subject'>Subject</TableCell>
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
        <TableCell className='periodStart' style={{width: '140px'}}>Start Date</TableCell>
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
        <TableCell className='periodEnd' style={{width: '140px'}}>End Date</TableCell>
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
      let columnHeaderText = "Measure Score";
      if(props.measureScoreLabel){
        columnHeaderText = props.measureScoreLabel;
      }
      return (
      <TableCell className='measureScore'>{columnHeaderText}</TableCell>
      );
    }
  }
  function renderNumerator(numerator){
    if (!props.hideNumerator) {
      return (
        <TableCell className='numerator'>{ numerator }</TableCell>
      );
    }
  }
  function renderNumeratorHeader(){
    if (!props.hideNumerator) {
      return (
        <TableCell className='numerator'>Numerator</TableCell>
      );
    }
  }
  function renderDenominator(denominator){
    if (!props.hideDenominator) {
      return (
        <TableCell className='denominator'>{ denominator }</TableCell>
      );
    }
  }
  function renderDenominatorHeader(){
    if (!props.hideDenominator) {
      return (
        <TableCell className='denominator'>Denominator</TableCell>
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
    if (!props.hideBarcode) {
      return (
        <TableCell><span className="barcode">{id}</span></TableCell>
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

  


  // //---------------------------------------------------------------------
  // // Pagination

  let rows = [];

  let paginationCount = 101;
  if(count){
    paginationCount = count;
  } else {
    paginationCount = rows.length;
  }

  const handleChangePage = (event, newPage) => {
    if(typeof onSetPage === "function"){
      onSetPage(newPage);
    }    
  };

  let paginationFooter;
  if(!disablePagination){
    paginationFooter = <TablePagination
      component="div"
      // rowsPerPageOptions={[5, 10, 25, 100]}
      rowsPerPageOptions={['']}
      colSpan={3}
      count={paginationCount}
      rowsPerPage={rowsPerPage}
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
      let count = 0;  

      props.measureReports.forEach(function(measureReport){
        if((count >= (page * rowsPerPage)) && (count < (page + 1) * rowsPerPage)){
          measureReportsToRender.push(FhirDehydrator.dehydrateMeasureReport(measureReport, props.measuresCursor, internalDateFormat, measureShorthand, measureScoreType));
        }
        count++;
      }); 
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '52px'
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
      if(get(measureReportsToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }
      tableRows.push(
        <TableRow className="measureReportRow" key={i} onClick={ handleRowClick.bind(this, measureReportsToRender[i]._id)} hover={true} style={rowStyle} selected={selected} >            
          { renderToggle() }
          { renderActionIcons(measureReportsToRender[i]) }
          { renderIdentifier(measureReportsToRender[i].identifier)}
          
          { renderStatus(measureReportsToRender[i].status) }
          { renderType(measureReportsToRender[i].type) }
          { renderDate(measureReportsToRender[i].date) }
          { renderReporter(measureReportsToRender[i].reporter) }
          { renderSubject(measureReportsToRender[i].subject) }
          { renderMeasureTitle(measureReportsToRender[i].measureTitle)}
          { renderMeasureUrl(measureReportsToRender[i].measureUrl)}
          { renderPeriodStart(measureReportsToRender[i].periodStart) }
          { renderPeriodEnd(measureReportsToRender[i].periodEnd) }
          { renderGroupCode(measureReportsToRender[i].groupCode) }
          { renderPopulationCode(measureReportsToRender[i].populationCode) }
          { renderPopulationCount(measureReportsToRender[i].populationCount) }
          { renderNumerator(measureReportsToRender[i].numerator) }
          { renderDenominator(measureReportsToRender[i].denominator) }
          { renderMeasureScore(measureReportsToRender[i].measureScore) }
          { renderStratificationCount(measureReportsToRender[i].stratificationCount) }          
          
          { renderBarcode(measureReportsToRender[i]._id)}
        </TableRow>
      );    
    }
  }

  return(
    <div>
      <Table size={tableRowSize} aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }

            { renderStatusHeader() }
            { renderTypeHeader() }
            { renderDateHeader() }
            { renderReporterHeader() }
            { renderSubjectHeader() }
            { renderMeasureTitleHeader() }
            { renderMeasureUrlHeader() }
            { renderPeriodStartHeader() }
            { renderPeriodEndHeader() }
            { renderGroupCodeHeader() }
            { renderPopulationCodeHeader() }
            { renderPopulationCountHeader() }
            { renderNumeratorHeader() }
            { renderDenominatorHeader() }
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
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  showMinutes: PropTypes.bool,

  hideCheckboxes: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideTypeCode: PropTypes.bool,
  hideMeasureTitle: PropTypes.bool,
  hideMeasureUrl: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideReporter: PropTypes.bool,
  hideSubject: PropTypes.bool,
  hidePeriodStart: PropTypes.bool,
  hidePeriodEnd: PropTypes.bool,
  hideGroupCode: PropTypes.bool,
  hidePopulationCode: PropTypes.bool,
  hidePopulationCount: PropTypes.bool,
  hideMeasureScore: PropTypes.bool,
  hideStratificationCount: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  onSetPage: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  showActionButton: PropTypes.bool,

  measuresCursor: PropTypes.object,
  measureShorthand: PropTypes.bool,

  measureScoreLabel: PropTypes.string,
  measureScoreType: PropTypes.string,

  count: PropTypes.number,
  tableRowSize: PropTypes.string,

  formFactorLayout: PropTypes.string
};
MeasureReportsTable.defaultProps = {
  tableRowSize: 'medium',
  page: 0,
  rowsPerPage: 5,
  showMinutes: false,
  hideCheckboxes: true,
  hideStatus: false,
  hideIdentifier: true,
  hideStatus: true,
  hideTypeCode: true,
  hideMeasureTitle: true,
  hideMeasureUrl: true,
  hideDate: false,
  hideSubject: false,
  hideReporter: false,
  hidePeriodStart: false,
  hidePeriodEnd: false,
  hideGroupCode: true,
  hidePopulationCode: true,
  hidePopulationCount: true,
  hideMeasureScore: false,
  hideStratificationCount: true,
  hideActionIcons: true,
  hideNumerator: false,
  hideDenominator: false,
  hideBarcode: false,
  measureShorthand: false,
  measureScoreLabel: 'ICU Beds',
  measureScoreType: 'numICUBeds',
  selectedMeasureReportId: ''
}

export default MeasureReportsTable; 