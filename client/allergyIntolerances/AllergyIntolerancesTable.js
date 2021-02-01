// =======================================================================
// Using DSTU2  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// https://www.hl7.org/fhir/DSTU2/allergyintolerance.html
//
//
// =======================================================================


import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@material-ui/core';

// import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get, set } from 'lodash';

import moment from 'moment'

import FhirUtilities from '../../lib/FhirUtilities';
import FhirDehydrator, { flattenAllergyIntolerance } from '../../lib/FhirDehydrator';


//===========================================================================
// ICONS

// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'



//===========================================================================
// THEMING


import { makeStyles } from '@material-ui/styles';
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

function AllergyIntolerancesTable(props){
  logger.debug('Rendering the AllergyIntolerancesTable');
  logger.verbose('clinical:hl7-resource-encounter.client.AllergyIntolerancesTable');
  logger.data('AllergyIntolerancesTable.props', {data: props}, {source: "AllergyIntolerancesTable.jsx"});

  const classes = useStyles();


  let { 
    id,
    children, 
    allergyIntolerances,
    selectedAllergyIntoleranceId,
    dateFormat,
    showMinutes,

    hideCheckbox,
    hideIdentifier,
    hideActionIcons,
    hidePatientDisplay,
    hidePatientReference,
    hideReaction,
    hideCriticality,
    hideSeverity,
    hideRecorder,
    hideOnset,
    hideVerification,
    hideClinical,
    hideSubstance,
    hideCategory,
    hideType,
    hideRecordedDate,
    hideBarcode,
    
    onRowClick,
    onMetaClick,
    onRemoveRecord,
    onActionButtonClick,
    showActionButton,
    actionButtonLabel,

    query,
    paginationLimit,
    disablePagination,
    hideEnteredInError,
    rowsPerPage,
    tableRowSize,

    count,
    formFactorLayout,

    ...otherProps 
  } = props;


  // ------------------------------------------------------------------------
  // Form Factors

  if(formFactorLayout){
    logger.verbose('formFactorLayout', formFactorLayout + ' ' + window.innerWidth);

    switch (formFactorLayout) {
      case "phone":
        hideCheckbox = true;
        hideType = true;
        hideSeverity = true;
        hideCriticality = true;
        hidePatientDisplay = true;
        hidePatientReference = true;
        hideRecordedDate = false;
        hideClinical = true;
        hideVerification = true;
        hideOnset = true;
        hideBarcode = true;
      break;
      case "tablet":
        hideSeverity = false;
        hideCriticality = false;
        hidePatientDisplay = true;
        hidePatientReference = true;
        hideRecordedDate = false;
        hideClinical = false;
        hideVerification = true;
        hideOnset = true;
        hideBarcode = true;
      break;
      case "web":
        hideSeverity = false;
        hideCriticality = false;
        hidePatientDisplay = false;
        hidePatientReference = false;
        hideRecordedDate = false;
        hideClinical = false;
        hideVerification = false;
        hideOnset = false;
        hideBarcode = true;
      break;
      case "desktop":
        hideSeverity = false;
        hideCriticality = false;
        hidePatientDisplay = false;
        hidePatientReference = false;
        hideRecordedDate = false;
        hideClinical = false;
        hideVerification = false;
        hideOnset = false;
        hideBarcode = true;
      break;
      case "hdmi":
        hideSeverity = false;
        hideCriticality = false;
        hidePatientDisplay = false;
        hidePatientReference = false;
        hideRecordedDate = false;
        hideClinical = false;
        hideVerification = false;
        hideOnset = false;
        hideBarcode = false;
      break;            
    }
  }


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
    if (!hideCheckbox) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!hideCheckbox) {
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
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(measureReport ){
    if (!hideActionIcons) {
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
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>{ identifier }</TableCell>
      );
    }
  }
  function renderIdentifierHeader(){
    if (!hideIdentifier) {
      return (
        <TableCell className='identifier'>Identifier</TableCell>
      );
    }
  }
  function renderBarcode(id){
    if (!hideBarcode) {
      return (
        <TableCell><span className="barcode">{id}</span></TableCell>
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


  function renderSubstanceHeader(){
    if (!hideSubstance) {
      return (
        <TableCell className="substance">Substance</TableCell>
      );
    }
  }
  function renderSubstance(substance ){
    if (!hideSubstance) {
      
      return (
        <TableCell className='substance'>{ substance }</TableCell>       );
    }
  }
  function renderReactionHeader(){
    if (!hideReaction) {
      return (
        <TableCell className="reaction">Reaction</TableCell>
      );
    }
  }
  function renderReaction(reaction ){
    if (!hideReaction) {
      
      return (
        <TableCell className='reaction'>{ reaction }</TableCell>       );
    }
  }

  function renderCriticalityHeader(){
    if (!hideCriticality) {
      return (
        <TableCell className="criticality">Criticality</TableCell>
      );
    }
  }
  function renderCriticality(criticality ){
    if (!hideCriticality) {
      
      return (
        <TableCell className='criticality'>{ criticality }</TableCell>       );
    }
  }

  function renderRecorderHeader(){
    if (!hideRecorder) {
      return (
        <TableCell className="recorder">Recorder</TableCell>
      );
    }
  }
  function renderRecorder(recorder ){
    if (!hideRecorder) {
      
      return (
        <TableCell className='recorder'>{ recorder }</TableCell>       );
    }
  }

  function renderOnsetHeader(){
    if (!hideOnset) {
      return (
        <TableCell className='onset'>Onset</TableCell>
      );
    }
  }
  function renderOnset(onsetDate ){
    if (!hideOnset) {
      return (
        <TableCell className='onset'>{ onsetDate }</TableCell>
      );
    }
  }



  function renderClinicalStatusHeader(){
    if (!hideClinical) {
      return (
        <TableCell className="clinicalStatus">Status</TableCell>
      );
    }
  }
  function renderClinicalStatus(clinicalStatus ){
    if (!hideClinical) {
      return (
        <TableCell className='clinicalStatus'>{ clinicalStatus }</TableCell>       );
    }
  }

  function renderRecorderHeader(){
    if (!hideRecorder) {
      return (
        <TableCell className="recorder">Recorder</TableCell>
      );
    }
  }
  function renderRecorder(recorder ){
    if (!hideRecorder) {
      return (
        <TableCell className='recorder'>{ recorder }</TableCell>       );
    }
  }


  function renderVerificationStatusHeader(){
    if (!hideVerification) {
      return (
        <TableCell className="verificationStatus">Verification</TableCell>
      );
    }
  }
  function renderVerificationStatus(verificatonStatus ){
    if (!hideVerification) {
      return (
        <TableCell className='verificationStatus'>{ verificatonStatus }</TableCell>       );
    }
  }

  function renderTypeHeader(){
    if (!hideType) {
      return (
        <TableCell className="type">Type</TableCell>
      );
    }
  }
  function renderType(type ){
    if (!hideType) {
      return (
        <TableCell className='type'>{ type }</TableCell>       );
    }
  }
  function renderCategoryHeader(){
    if (!hideCategory) {
      return (
        <TableCell className="category">Category</TableCell>
      );
    }
  }
  function renderCategory(category ){
    if (!hideCategory) {
      return (
        <TableCell className='category'>{ category }</TableCell>       );
    }
  }
  function renderActionIconsHeader(){
    if (!hideActionIcons) {
      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>Actions</TableCell>
      );
    }
  }
  function renderActionIcons(allergyIntolerance ){
    if (!hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <TableCell className='actionIcons' style={{minWidth: '120px'}}>
          {/* <Icon icon={tag} style={iconStyle} onClick={showSecurityDialog.bind(this, allergyIntolerance)} />
          <Icon icon={iosTrashOutline} style={iconStyle} onClick={removeRecord.bind(this, allergyIntolerance._id)} /> */}
        </TableCell>
      );      
    }
  } 
  function renderPatientNameHeader(){
    if (!hidePatientDisplay) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  function renderPatientName(patientDisplay ){
    if (!hidePatientDisplay) {
      return (
        <TableCell className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</TableCell>
      );
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let paginationFooter;
  if(!disablePagination){
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
  let allergyIntolerancesToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(internalDateFormat){
    internalDateFormat = dateFormat;
  }

  if(allergyIntolerances){
    if(allergyIntolerances.length > 0){              
      let count = 0;  

      allergyIntolerances.forEach(function(allergyIntolerance){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          allergyIntolerancesToRender.push(flattenAllergyIntolerance(allergyIntolerance));
        }
        count++;
      }); 
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '52px'
  }

  if(allergyIntolerancesToRender.length === 0){
    logger.trace('AllergyIntolerancesTable:  No allergyIntolerances to render.');
    // footer = <TableNoData noDataPadding={ props.noDataMessagePadding } />
  } else {
    for (var i = 0; i < allergyIntolerancesToRender.length; i++) {
      let selected = false;
      if(allergyIntolerancesToRender[i].id === selectedAllergyIntoleranceId){
        selected = true;
      }
      if(get(allergyIntolerancesToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }

      logger.trace('allergyIntolerancesToRender[i]', allergyIntolerancesToRender[i])
      tableRows.push(
        <TableRow className="allergyIntoleranceRow" key={i} onClick={ handleRowClick.bind(this, allergyIntolerancesToRender[i]._id)} hover={true} style={rowStyle} selected={selected} >            
          { renderToggle() }
          { renderActionIcons(allergyIntolerancesToRender[i]) }
          { renderIdentifier(allergyIntolerancesToRender[i].identifier)}

          { renderSubstance(allergyIntolerancesToRender[i].substance) }
          { renderReaction(allergyIntolerancesToRender[i].reaction) }
          { renderCriticality(allergyIntolerancesToRender[i].criticality) }

          { renderType(allergyIntolerancesToRender[i].type) }
          { renderCategory(allergyIntolerancesToRender[i].category) }
          { renderPatientName(allergyIntolerancesToRender[i].patientDisplay ) } 

          { renderRecorder(allergyIntolerancesToRender[i].recorder ) } 
          { renderOnset(allergyIntolerancesToRender[i].onset ) } 

          { renderClinicalStatus(allergyIntolerancesToRender[i].clinicalStatus) }
          { renderVerificationStatus(allergyIntolerancesToRender[i].verificationStatus) }
          
          { renderBarcode(allergyIntolerancesToRender[i]._id)}
        </TableRow>
      );    
    }
  }

  return(
    <div id={id} className="tableWithPagination">
      <Table className='allergiessTable'  size={tableRowSize} aria-label="a dense table" { ...otherProps }>
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
        
            { renderSubstanceHeader() }
            { renderReactionHeader() }
            { renderCriticalityHeader() }
      

            { renderTypeHeader() }
            { renderCategoryHeader() }
            { renderPatientNameHeader() }

            { renderRecorderHeader() }
            { renderOnsetHeader() }

            { renderClinicalStatusHeader() }
            { renderVerificationStatusHeader() }

            { renderBarcodeHeader() }
          </TableRow>
        </TableHead>
        <TableBody>
          { tableRows }
        </TableBody>
      </Table>
      { paginationFooter }
    </div>
  )
}



// export class AllergyIntolerancesTable extends React.Component {

//   // getMeteorData() {
//   //   let data = {
//   //     style: {
//   //       opacity: Session.get('globalOpacity')
//   //     },
//   //     selected: [],
//   //     allergyIntolerances: [],
//   //     hideToggle: false,
//   //     hideIdentifier: false,
//   //     hideDates: false,
//   //     hideStatus: false,
//   //     hideVerification: false,
//   //     hideType: false,
//   //     hideCategory: false,
//   //     fhirVersion: 'v1.0.2'
//   //   }

//   //   // Data
//   //   if(props.data){
//   //     data.allergyIntolerances = props.data;
//   //   } else {
//   //     if(AllergyIntolerances.find().count() > 0){
//   //       data.allergyIntolerances = AllergyIntolerances.find().fetch();
//   //     }  
//   //   }

//   //   if(process.env.NODE_ENV === "test") console.log("AllergyIntolerancesTable[data]", data);
//   //   return data;
//   // };
//   // removeRecord(_id){
//   //   console.log('Remove allergy ', _id)
//   //   AllergyIntolerances._collection.remove({_id: _id})
//   // }
//   // showSecurityDialog(allergy){
//   //   console.log('showSecurityDialog', allergy)

//   //   Session.set('securityDialogResourceJson', AllergyIntolerances.findOne(get(allergy, '_id')));
//   //   Session.set('securityDialogResourceType', 'AllergyIntolerance');
//   //   Session.set('securityDialogResourceId', get(allergy, '_id'));
//   //   Session.set('securityDialogOpen', true);
//   // }
//   // renderTogglesHeader(){
//   //   if (!hideToggle) {
//   //     return (
//   //       <TableHead className="toggle">Toggle</TableHead>
//   //     );
//   //   }
//   // }
//   // renderToggles(patientId ){
//   //   if (!hideToggle) {
//   //     return (
//   //       <TableCell className="toggle">
//   //           <Toggle
//   //             defaultToggled={true}
//   //           />
//   //         </TableCell>
//   //     );
//   //   }
//   // }

//   // renderIdentifierHeader(){
//   //   if (!hideIdentifier) {
//   //     return (
//   //       <TableHead className="identifier">Identifier</TableHead>
//   //     );
//   //   }
//   // }
//   // renderIdentifier(allergyIntolerance ){
//   //   if (!hideIdentifier) {
      
//   //     return (
//   //       <TableCell className='identifier'>{ get(allergyIntolerance, 'identifier[0].value') }</TableCell>       );
//   //   }
//   // }

//   // rowClick(id){
//   //   Session.set('allergyIntolerancesUpsert', false);
//   //   Session.set('selectedAllergyIntolerance', id);
//   //   Session.set('allergyIntolerancePageTabIndex', 2);
//   // };
//   render () {
//     let tableRows = [];
//     for (var i = 0; i < data.allergyIntolerances.length; i++) {
//       var newRow = FhirDehydrator.flattenAllergyIntolerance(data.allergyIntolerance[i])
      
//       let rowStyle = {
//         cursor: 'pointer'
//       }
//       if(get(data.allergyIntolerances[i], 'modifierExtension[0]')){
//         rowStyle.color = "orange";
//       }

//       tableRows.push(
//         <TableRow key={i} className="allergyIntoleranceRow" style={rowStyle} onClick={ rowClick.bind('this', data.allergyIntolerances[i]._id)} >
//           { renderToggles(newRow) }
//           { renderActionIcons(newRow) }
//           { renderIdentifier(newRow.identifier) }

//           { renderSubstance(newRow.substance) }
//           { renderReaction(newRow.reaction) }
//           { renderCriticality(newRow.criticality) }

//           { renderType(newRow.type) }
//           { renderCategory(newRow.category) }
//           { renderPatientName(newRow.patientDisplay ) } 

//           { renderRecorder(newRow.recorder ) } 
//           { renderOnset(newRow.onset ) } 

//           { renderClinicalStatus(newRow.clinicalStatus) }
//           { renderVerificationStatus(newRow.verificationStatus) }
//         </TableRow>
//       )
//     }

//     // return(
//     //   <Table id='allergyIntolerancesTable' hover >
//     //     <TableHead>
//     //       <TableRow>
//     //         { renderTogglesHeader() }
//     //         { renderActionIconsHeader() }
//     //         { renderIdentifierHeader() }

//     //         { renderSubstanceHeader() }
//     //         { renderReactionHeader() }
//     //         { renderCriticalityHeader() }
      

//     //         { renderTypeHeader() }
//     //         { renderCategoryHeader() }
//     //         { renderPatientNameHeader() }

//     //         { renderRecorderHeader() }
//     //         { renderOnsetHeader() }

//     //         { renderClinicalStatusHeader() }
//     //         { renderVerificationStatusHeader() }
//     //       </TableRow>
//     //     </TableHead>
//     //     <TableBody>
//     //       { tableRows }
//     //     </TableBody>
//     //   </Table>
//     // );
//   }
// }


AllergyIntolerancesTable.propTypes = {
  data: PropTypes.array,
  allergyIntolerances: PropTypes.array,
  selectedAllergyIntoleranceId: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  disablePagination: PropTypes.bool,

  hideCheckbox: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hidePatientDisplay: PropTypes.bool,
  hidePatientReference: PropTypes.bool,
  hideReaction: PropTypes.bool,
  hideCriticality: PropTypes.bool,
  hideSeverity: PropTypes.bool,
  hideRecorder:  PropTypes.bool,
  hideOnset:  PropTypes.bool,
  hideSubstance: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideVerification: PropTypes.bool,
  hideClinical: PropTypes.bool,
  hideType: PropTypes.bool,
  hideRecordedDate: PropTypes.bool,

  hideBarcode: PropTypes.bool,

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
  hideEnteredInError: PropTypes.bool,
  count: PropTypes.number,
  tableRowSize: PropTypes.string,
  formFactorLayout: PropTypes.string
};

AllergyIntolerancesTable.defaultProps = {
  allergyIntolerances: [],
  selectedAllergyIntoleranceId: '',
  
  hideCheckbox: false,
  hideActionIcons: false,
  hideIdentifier: false,
  hidePatientDisplay: false,
  hidePatientReference: false,

  hideIdentifier: true,
  hideToggle: true,
  hideActionIcons: true,
  hideType: true,
  hideCategory: true,
  hidePatient: true,
  hideRecorder: true,
  hideReaction: false,
  hideStatus: false,
  hideVerification: false,
  hideCriticality: false,
  hideSeverity: false,
  hideRecorder: true,
  hideOnset: false,
  hideClinical: false,
  hideRecordedDate: false,

  hideBarcode: false,
  disablePagination: false,
  autoColumns: true,
  rowsPerPage: 5,
  tableRowSize: "medium"  // small | normal
}


//ReactMixin(AllergyIntolerancesTable.prototype, ReactMeteorData);
export default AllergyIntolerancesTable;