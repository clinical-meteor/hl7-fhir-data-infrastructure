import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { 
  Checkbox, 
  Table, 
  TableRow, 
  TableCell,
  TableBody,
  TableHead,
  TablePagination
} from '@material-ui/core';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get } from 'lodash';

import moment from 'moment';

import { browserHistory } from 'react-router';

// import { Icon } from 'react-icons-kit'
// import { tag } from 'react-icons-kit/fa/tag'
// import {iosTrashOutline} from 'react-icons-kit/ionicons/iosTrashOutline'

import { FhirUtilities } from '../../lib/FhirUtilities';

import { flattenCarePlan } from '../../lib/FhirDehydrator';



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



// flattenCarePlan = function(plan){
//   // careplans: CarePlans.find({'subject.reference': Meteor.userId}).map(function(plan){
//   // todo: replace tertiary logic

//   // console.log('flattenCarePlan', plan)

//   let result = {
//     _id: plan._id,
//     subject: '',
//     author: '',
//     template: '',
//     category: '',
//     am: '',
//     pm: '',
//     activities: 0,
//     goals: 0,
//     addresses: 0,
//     start: '',
//     end: '',
//     title: ''
//   };

//   if (get(plan, 'template')) {
//     result.template = plan.template.toString();
//   }

//   result.subject = get(plan, 'subject.display', '');
//   result.author = get(plan, 'author[0].display', '')
//   result.start = moment(get(plan, 'period.start')).format("YYYY-MM-DD hh:mm a");
//   result.end = moment(get(plan, 'period.start')).format("YYYY-MM-DD hh:mm a");
//   result.category = get(plan, 'category[0].text', '')    


//   if (get(plan, 'activity')) {
//     result.activities = plan.activity.length;
//   }
//   if (get(plan, 'goal')) {
//     result.goals = plan.goal.length;
//   }
//   if (get(plan, 'addresses')) {
//     result.addresses = plan.addresses.length;
//   }

//   if(!result.title){
//     result.title = get(plan, 'title', '')    
//   }
//   if(!result.title){
//     result.title = get(plan, 'description', '')    
//   }
//   if(!result.title){
//     result.title = get(plan, 'category[0].coding[0].display', '')    
//   }

//   // if( plan.period ) {
//   //   if (plan.period.start) {
//   //     result.start = plan.period.start;
//   //   }
//   //   if (plan.period.end) {
//   //     result.end = plan.period.end;
//   //   }
//   // }

//   return result;
// }


// export class CarePlansTable extends React.Component {
  
//   getMeteorData() {

//     // we need to rewrite the authorization here
//     let carePlanQuery = {};

//     // default query is scoped to the logged in user
//     if(Meteor.userId()){
//       carePlanQuery = {
//         'subject.reference': Meteor.userId()
//       }
//     }
//     if (get(Meteor.user(), 'roles[0]') === "practitioner") {
//       // practitioner query is open ended and returns everybody
//       carePlanQuery = {};
//     }

//     // this should all be handled by props
//     // or a mixin!
//     let data = {
//       style: {
//         opacity: Session.get('globalOpacity')
//       },
//       selected: [],
//       careplans: []
//     };


//     if(this.data){
//       this.data.forEach(function(plan){
//         data.careplans.push(flattenCarePlan(plan));
//       })
//     } else {
//       data.careplans = CarePlans.find(carePlanQuery).map(flattenCarePlan);
//     }

//     // if (Session.get('darkroomEnabled')) {
//     //   data.style.color = "black";
//     //   data.style.background = "white";
//     // } else {
//     //   data.style.color = "white";
//     //   data.style.background = "black";
//     // }

//     // // this could be another mixin
//     // if (Session.get('glassBlurEnabled')) {
//     //   data.style.filter = "blur(3px)";
//     //   data.style.WebkitFilter = "blur(3px)";
//     // }

//     // // this could be another mixin
//     // if (Session.get('backgroundBlurEnabled')) {
//     //   data.style.backdropFilter = "blur(5px)";
//     // }

//     if(process.env.NODE_ENV === "test") console.log("CarePlansTable[data]", data);


//     return data;
//   }
//   removeRecord(_id){
//     console.log('Remove careplan ', _id)
//     CarePlans._collection.remove({_id: _id})
//   }
//   showSecurityDialog(carePlan){
//     console.log('showSecurityDialog', carePlan)

//     Session.set('securityDialogResourceJson', CarePlans.findOne(get(carePlan, '_id')));
//     Session.set('securityDialogResourceType', 'CarePlan');
//     Session.set('securityDialogResourceId', get(carePlan, '_id'));
//     Session.set('securityDialogOpen', true);
//   }
//   handleChange(row, key, value) {
//     const source = this.state.source;
//     source[row][key] = value;
//     this.setState({source});
//   }

//   handleSelect(selected) {
//     this.setState({selected});
//   }
//   getDate(){
//     return "YYYY/MM/DD";
//   }
//   noChange(){
//     return "";
//   }
//   rowClick(carePlanId){
//     if(typeof(this.onRowClick) === "function"){
//       this.onRowClick(carePlanId);
//     } else {
//       Session.set('selectedPatientId', carePlanId);
//       Session.set('selectedPatient', CarePlans.findOne(carePlanId));

//       browserHistory.push('/careplan/' + carePlanId);  
//     }
//   }
//   renderBarcode(_id){
//     if (this.showBarcode) {
//       return (
//         <TableCell><span className="barcode helvetica">{ _id }</span></TableCell>
//       );
//     }
//   }
//   renderBarcodeHeader(){
//     if (this.showBarcode) {
//       return (<TableCell>id</TableCell>);
//     }
//   }
//   renderCheckboxHeader(){
//     if (!this.hideCheckboxes) {
//       return (
//         <TableCell className="toggle" style={{width: '60px'}} ></TableCell>
//       );
//     }
//   }
//   renderCheckbox(){
//     if (!this.hideCheckboxes) {
//       return (
//         <TableCell className="toggle" style={{width: '60px'}}>
//             <Checkbox
//               defaultChecked={true}
//             />
//           </TableCell>
//       );
//     }
//   }
//   renderSubjectHeader(){
//     if (!this.hideSubject) {
//       return (
//         <TableCell className='patientDisplay'>Patient</TableCell>
//       );
//     }
//   }
//   renderSubject(subject ){
//     if (!this.hideSubject) {
//       return (
//         <TableCell className='subject' style={{minWidth: '140px'}}>{ subject }</TableCell>
//       );
//     }
//   }
//   renderActionIconsHeader(){
//     if (!this.hideActionIcons) {
//       return (
//         <TableCell className='actionIcons' style={{width: '100px'}}>Actions</TableCell>
//       );
//     }
//   }
//   renderActionIcons(carePlan ){
//     if (!this.hideActionIcons) {
//       let iconStyle = {
//         marginLeft: '4px', 
//         marginRight: '4px', 
//         marginTop: '4px', 
//         fontSize: '120%'
//       }

//       return (
//         <TableCell className='actionIcons' style={{minWidth: '120px'}}>
//           {/* <Icon icon={tag} style={iconStyle} onClick={this.showSecurityDialog.bind(this, carePlan)} />
//           <Icon icon={iosTrashOutline} style={iconStyle} onClick={this.removeRecord.bind(this, carePlan._id)} /> */}
//         </TableCell>
//       );
//     }
//   } 
//   render () {
//     let tableRows = [];
//     for (var i = 0; i < this.data.careplans.length; i++) {

//       let rowStyle = {
//         cursor: 'pointer',
//         textAlign: 'left'
//       }
//       if(get(this.data.careplans[i], 'modifierExtension[0]')){
//         rowStyle.color = "orange";
//       }

//       let activitesCount = get(this.data.careplans[i], 'activities', []);
//       let goalsCount = get(this.data.careplans[i], 'goals', []);
//       let addressesCount = get(this.data.careplans[i], 'addresses', []);

//       tableRows.push(
//         <TableRow key={i} className="carePlanRow" style={rowStyle} onClick={ this.rowClick.bind(this, this.data.careplans[i]._id)} hover={true} >
//           { this.renderCheckbox(this.data.careplans[i]._id) }
//           { this.renderActionIcons(this.data.careplans[i]) }

//           <TableCell>{this.data.careplans[i].title }</TableCell>
//           {/* <TableCell>{this.data.careplans[i].subject }</TableCell> */}
//           { this.renderSubject( this.data.careplans[i].subject ) } 
//           <TableCell>{this.data.careplans[i].author }</TableCell>
//           <TableCell>{ this.data.careplans[i].activities }</TableCell>
//           <TableCell>{ this.data.careplans[i].goals }</TableCell>
//           <TableCell>{ this.data.careplans[i].addresses }</TableCell>
//         </TableRow>
//       );
//     }


//     return(
//       <Table>
//         <TableHead id='carePlansTable' >
//           <TableRow>
//             { this.renderCheckboxHeader() }
//             { this.renderActionIconsHeader() }
//             <TableCell>Title</TableCell>
//             { this.renderSubjectHeader() }
//             {/* <TableCell>Subject</TableCell> */}
//             <TableCell>Author</TableCell>
//             <TableCell>Activites</TableCell>
//             <TableCell>Goals</TableCell>
//             <TableCell>Conditions Addressed</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           { tableRows }
//         </TableBody>
//       </Table>

//     );
//   }
// }


// CarePlansTable.propTypes = {
//   data: PropTypes.array,
//   query: PropTypes.object,
//   onRowClick: PropTypes.func,
//   paginationLimit: PropTypes.number,
//   hideIdentifier: PropTypes.bool,
//   hideCheckboxes: PropTypes.bool,
//   hideActionIcons: PropTypes.bool,
//   hideSubject: PropTypes.bool,
//   enteredInError: PropTypes.bool
// };
// ReactMixin(CarePlansTable.prototype, ReactMeteorData);
// export default CarePlansTable;





function CarePlansTable(props){
  logger.debug('Rendering the CarePlansTable');
  logger.verbose('clinical:hl7-resource-encounter.client.CarePlansTable');
  logger.data('CarePlansTable.props', {data: props}, {source: "CarePlansTable.jsx"});

  const classes = useStyles();

  let { 
    children, 
    id,

    carePlans,
    selectedCarePlanId,
    dateFormat,
    showMinutes,

    hideCheckboxes,
    hideIdentifier,
    hideActionIcons,
    hideSubject,
    hideAuthor,
    hideTitle,
    hideActivities,
    hideGoals,
    hideAddresses,
    hideCategory,
    hideTemplate,
    hideCreated,
    hideStatus,
    hideBarcode,

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
        hideCheckboxes = true;
        hideIdentifier = true;
        hideActionIcons = true;
        hideSubject = true;
        hideAuthor = true;
        hideTitle = false;
        hideActivities = true;
        hideGoals = true;
        hideAddresses = true;
        hideCategory = true;
        hideTemplate = true;
        hideCreated = false;
        hideStatus = true;
        hideBarcode = true;
        break;
      case "tablet":
        hideCheckboxes = true;
        hideIdentifier = true;
        hideActionIcons = true;
        hideSubject = true;
        hideAuthor = true;
        hideTitle = false;
        hideActivities = true;
        hideGoals = true;
        hideAddresses = true;
        hideCategory = true;
        hideTemplate = true;
        hideCreated = false;
        hideStatus = true;
        hideBarcode = true;
        break;
      case "web":
        hideCheckboxes = true;
        hideIdentifier = true;
        hideActionIcons = true;
        hideSubject = true;
        hideAuthor = false;
        hideTitle = false;
        hideActivities = false;
        hideGoals = false;
        hideAddresses = true;
        hideCategory = false;
        hideTemplate = true;
        hideCreated = false;
        hideStatus = false;
        hideBarcode = true;
        break;
      case "desktop":
        hideCheckboxes = true;
        hideIdentifier = true;
        hideActionIcons = true;
        hideSubject = true;
        hideAuthor = false;
        hideTitle = false;
        hideActivities = false;
        hideGoals = false;
        hideAddresses = false;
        hideCategory = false;
        hideTemplate = false;
        hideCreated = false;
        hideStatus = false;
        hideBarcode = true;
        break;
      case "videowall":
        hideCheckboxes = false;
        hideIdentifier = false;
        hideActionIcons = false;
        hideSubject = false;
        hideAuthor = false;
        hideTitle = false;
        hideActivities = false;
        hideGoals = false;
        hideAddresses = false;
        hideCategory = false;
        hideTemplate = false;
        hideCreated = false;
        hideStatus = false;
        hideBarcode = false;
        break;            
    }
  }

  // ------------------------------------------------------------------------
  // Helper Functions


  function handleRowClick(_id){
    // console.log('Clicking row ' + _id)
    if(onRowClick){
      onRowClick(_id);
    }
  }

  function removeRecord(_id){
    logger.info('Remove measureReport: ' + _id)
    if(onRemoveRecord){
      onRemoveRecord(_id);
    }
  }
  function handleActionButtonClick(id){
    if(typeof onActionButtonClick === "function"){
      onActionButtonClick(id);
    }
  }
  function cellClick(id){
    if(typeof onCellClick === "function"){
      onCellClick(id);
    }
  }

  function handleMetaClick(patient){
    let self = this;
    if(onMetaClick){
      onMetaClick(self, patient);
    }
  }


  // ------------------------------------------------------------------------
  // Column Rendering

  function renderToggleHeader(){
    if (!hideCheckboxes) {
      return (
        <TableCell className="toggle" style={{width: '60px'}} >Toggle</TableCell>
      );
    }
  }
  function renderToggle(){
    if (!hideCheckboxes) {
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
  function renderSubjectHeader(){
    if (!hideSubject) {
      return (
        <TableCell className='patientDisplay'>Patient</TableCell>
      );
    }
  }
  function renderSubject(subject ){
    if (!hideSubject) {
      return (
        <TableCell className='subject' style={{minWidth: '140px'}}>{ subject }</TableCell>
      );
    }
  }
  function renderTitleHeader(){
    if (!hideTitle) {
      return (
        <TableCell className='title'>Title</TableCell>
      );
    }
  }
  function renderTitle(title ){
    if (!hideTitle) {
      return (
        <TableCell className='title' >{ title }</TableCell>
      );
    }
  }
  function renderAuthorHeader(){
    if (!hideAuthor) {
      return (
        <TableCell className='author'>Author</TableCell>
      );
    }
  }
  function renderAuthor(author ){
    if (!hideAuthor) {
      return (
        <TableCell className='author' >{ author }</TableCell>
      );
    }
  }

  function renderCreatedHeader(){
    if (!hideCreated) {
      return (
        <TableCell className='created'>Created</TableCell>
      );
    }
  }
  function renderCreated(createdDate ){
    if (!hideCreated) {
      return (
        <TableCell className='created'>{ moment(createdDate).format('YYYY-MM-DD') }</TableCell>
      );
    }
  }

  function renderCategory(category){
    if (!hideCategory) {
      return (
        <TableCell className="category">{category}</TableCell>
      );
    }
  }
  function renderCategoryHeader(){
    if (!hideCategory) {
      return (
        <TableCell className="category">Category</TableCell>
      );
    }
  }
  function renderActivities(activities){
    if (!hideActivities) {
      return (
        <TableCell className="activities">{activities}</TableCell>
      );
    }
  }
  function renderActivitiesHeader(){
    if (!hideActivities) {
      return (
        <TableCell className="activities">Activities</TableCell>
      );
    }
  }
  function renderGoals(goals){
    if (!hideGoals) {
      return (
        <TableCell className="goals">{goals}</TableCell>
      );
    }
  }
  function renderGoalsHeader(){
    if (!hideGoals) {
      return (
        <TableCell className="goals">Goals</TableCell>
      );
    }
  }
  function renderAddresses(addresses){
    if (!hideAddresses) {
      return (
        <TableCell className="addresses">{addresses}</TableCell>
      );
    }
  }
  function renderAddressesHeader(){
    if (!hideAddresses) {
      return (
        <TableCell className="addresses">Addresses</TableCell>
      );
    }
  }

  function renderStatus(status){
    if (!hideStatus) {
      return (
        <TableCell><span className="status">{status}</span></TableCell>
      );
    }
  }
  function renderStatusHeader(){
    if (!hideStatus) {
      return (
        <TableCell className="status">Status</TableCell>
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
        <TableCell className="barcode">System ID</TableCell>
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
  let carePlansToRender = [];
  let internalDateFormat = "YYYY-MM-DD";

  if(showMinutes){
    internalDateFormat = "YYYY-MM-DD hh:mm";
  }
  if(internalDateFormat){
    internalDateFormat = dateFormat;
  }

  if(carePlans){
    if(carePlans.length > 0){              
      let count = 0;  

      carePlans.forEach(function(carePlan){
        if((count >= (page * rowsPerPageToRender)) && (count < (page + 1) * rowsPerPageToRender)){
          carePlansToRender.push(flattenCarePlan(carePlan));
        }
        count++;
      }); 
    }
  }

  let rowStyle = {
    cursor: 'pointer', 
    height: '52px'
  }


  if(carePlansToRender.length === 0){
    logger.trace('CarePlansTable:  No carePlans to render.');
    // footer = <TableNoData noDataPadding={ noDataMessagePadding } />
  } else {
    for (var i = 0; i < carePlansToRender.length; i++) {
      let selected = false;
      if(carePlansToRender[i]._id === selectedCarePlanId){
        selected = true;
      }
      if(get(carePlansToRender[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }
      if(tableRowSize === "small"){
        rowStyle.height = '32px';
      }
      tableRows.push(
        <TableRow className="carePlanRow" key={i} onClick={ handleRowClick.bind(this, carePlansToRender[i]._id)} hover={true} style={rowStyle} selected={selected} >            
          { renderToggle() }
          { renderActionIcons(carePlansToRender[i]) }
          { renderIdentifier(carePlansToRender[i].identifier)}
          
          { renderSubject( carePlansToRender[i].subject ) } 
          { renderTitle( carePlansToRender[i].title ) } 
          { renderAuthor( carePlansToRender[i].author ) } 

          { renderCategory( carePlansToRender[i].category ) } 
          { renderActivities( carePlansToRender[i].activities ) } 
          { renderGoals( carePlansToRender[i].goals ) } 
          { renderAddresses( carePlansToRender[i].addresses ) } 

          { renderCreated(carePlansToRender[i].recorded) }
          { renderStatus(carePlansToRender[i].status) }
          
          { renderBarcode(carePlansToRender[i]._id)}
        </TableRow>
      );    
    }
  }

  return(
    <div id={id} className="tableWithPagination">
      <Table size={tableRowSize} aria-label="a dense table">
        <TableHead>
          <TableRow>
            { renderToggleHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            { renderSubjectHeader() }
            { renderTitleHeader() }
            { renderAuthorHeader() }

            { renderCategoryHeader() }
            { renderActivitiesHeader() }
            { renderGoalsHeader() }
            { renderAddressesHeader() }

            { renderCreatedHeader() }            
            { renderStatusHeader() }            
  
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



CarePlansTable.propTypes = {
  barcodes: PropTypes.bool,
  carePlans: PropTypes.array,
  selectedCarePlanId: PropTypes.string,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  rowsPerPage: PropTypes.number,
  dateFormat: PropTypes.string,
  showMinutes: PropTypes.bool,

  hideCheckboxes: PropTypes.bool,
  hideIdentifier: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hideSubject: PropTypes.bool,
  hideAuthor: PropTypes.bool,
  hideTitle: PropTypes.bool,
  hideActivities: PropTypes.bool,
  hideGoals: PropTypes.bool,
  hideAddresses: PropTypes.bool,
  hideCategory: PropTypes.bool,
  hideTemplate: PropTypes.bool,
  hideCreated: PropTypes.bool,
  hideStatus: PropTypes.bool,
  hideBarcode: PropTypes.bool,

  onCellClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onMetaClick: PropTypes.func,
  onRemoveRecord: PropTypes.func,
  onActionButtonClick: PropTypes.func,
  actionButtonLabel: PropTypes.string,
  showActionButton: PropTypes.bool,

  count: PropTypes.number,
  tableRowSize: PropTypes.string,
  formFactorLayout: PropTypes.string
};

CarePlansTable.defaultProps = {
  tableRowSize: 'medium',
  rowsPerPage: 5,
  dateFormat: "YYYY-MM-DD hh:mm:ss",
  hideCheckboxes: true,
  hideActionIcons: true,
  hideIdentifier: false,
  hideSubject: false,
  hideAuthor: false,
  hideTitle: false,
  hideActivities: false,
  hideGoals: false,
  hideAddresses: false,
  hideCategory: false,
  hideTemplate: false,
  hideCreated: false,
  hideStatus: false,
  hideBarcode: true,
  carePlans: []
};

export default CarePlansTable;