import { 
    Checkbox, 
    Table, 
    TableRow, 
    TableCell,
    TableBody
  } from '@material-ui/core';
  
  import React from 'react';
  import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
  import { get } from 'lodash';
  import PropTypes from 'prop-types';



  export function GoalsTable(props){

    let data = {
        goals: []
    }
      
    //---------------------------------------------
    // Trackers

    // data.goals = useTracker(function(){
    //     return Goals.find().fetch();
    // }, [])

    //---------------------------------------------
    // Helper Functions

    function rowClick(id){
        Session.set('goalsUpsert', false);
        Session.set('selectedGoalId', id);
        Session.set('goalPageTabIndex', 2);
      };
    function removeRecord(_id){
        console.log('Remove goal ', _id)
        if(props.onRemoveRecord){
          props.onRemoveRecord(_id);
        }
      }
    function showSecurityDialog(goal){
        console.log('showSecurityDialog', goal)
    
        Session.set('securityDialogResourceJson', goal);
        Session.set('securityDialogResourceType', 'Goal');
        Session.set('securityDialogResourceId', get(goal, '_id'));
        Session.set('securityDialogOpen', true);
    }

    //---------------------------------------------
    // Render Functions

    function renderCheckboxsHeader(){
        if (!props.hideCheckbox) {
          return (
            <TableCell className="Checkbox"></TableCell>
          );
        }
      }
    function renderCheckboxs(patientId ){
        if (!props.hideCheckbox) {
          return (
            <TableCell className="Checkbox">
                <Checkbox
                  defaultChecked={true}
                />
              </TableCell>
          );
        }
      }
    function renderIdentifierHeader(){
        if (!props.hideIdentifier) {
          return (
            <TableCell className="identifier">Identifier</TableCell>
          );
        }
      }
    function renderIdentifier(goals ){
        if (!props.hideIdentifier) {
          
          return (
            <TableCell className='identifier'>{ get(goals, 'identifier[0].value') }</TableCell>       );
        }
      }
    function renderActionIconsHeader(){
        if (!props.hideActionIcons) {
          return (
            <TableCell className='actionIcons' style={{minWidth: '120px'}}>Actions</TableCell>
          );
        }
      }
    function renderActionIcons(goal){
        if (!props.hideActionIcons) {
    
          // let warningStyle = {
          //   marginLeft: '4px', 
          //   marginRight: '4px', 
          //   marginTop: '4px', 
          //   fontSize: '120%%',
          //   opacity: 0
          // }
    
          let iconStyle = {
            marginLeft: '4px', 
            marginRight: '4px', 
            marginTop: '4px', 
            fontSize: '120%'
          }
    
    
          return (
            <TableCell className='actionIcons' style={{minWidth: '120px', marginTop: '2px'}}>
              {/* <IoIosWarning style={warningStyle} onClick={showSecurityDialog.bind(this, goal)} /> */}
              {/* <FaTags style={iconStyle} onClick={showSecurityDialog.bind(this, goal)} />
              <GoTrashcan style={iconStyle} onClick={removeRecord.bind(this, goal._id)} />   */}
            </TableCell>
          );
        }
      } 


    //---------------------------------------------
    // Render Method

    let tableRows = [];
    for (var i = 0; i < data.goals.length; i++) {
      var newRow = {
        description: '',
        priority: '',
        status: ''
      };

      if(get(data.goals[i], 'description')){
        newRow.description = get(data.goals[i], 'description');
      }
      if(get(data.goals[i], 'priority.text')){
        newRow.priority = get(data.goals[i], 'priority.text');
      } else if(get(data.goals[i], 'priority')){
        newRow.priority = String(get(data.goals[i], 'priority'));
      }
      if(get(data.goals[i], 'status')){
        newRow.status = get(data.goals[i], 'status');
      }

      newRow.identifier = get(data.goals[i], 'identifier[0].value');

      let rowStyle = {
        cursor: 'pointer'
      }
      if(get(data.goals[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }

      tableRows.push(
        <TableRow key={i} className="goalRow" style={rowStyle} onClick={ rowClick.bind('this', data.goals[i]._id)} >
          { renderCheckboxs(data.goals[i]) }
          { renderActionIcons(data.goals[i]) }
          { renderIdentifier(data.goals[i]) }

          <TableCell className='description'>{ newRow.description }</TableCell>
          <TableCell className='priority'>{ newRow.priority }</TableCell>
          <TableCell className='status'>{ newRow.status }</TableCell>
        </TableRow>
      )
    }

    return(
      <Table id='goalsTable' hover >
        {/* <TableHeader>
          <TableRow>
            { renderCheckboxsHeader() }
            { renderActionIconsHeader() }
            { renderIdentifierHeader() }
            <TableCell className='description'>Description</TableCell>
            <TableCell className='priority'>Priority</TableCell>
            <TableCell className='status'>Status</TableCell>             
          </TableRow>
        </TableHeader>
        <TableBody>
          { tableRows }
        </TableBody> */}
      </Table>
    );
  }
  
  
  GoalsTable.propTypes = {
    data: PropTypes.array,
    query: PropTypes.object,
    paginationLimit: PropTypes.number,
    hideIdentifier: PropTypes.bool,
    hideCheckbox: PropTypes.bool,
    hideActionIcons: PropTypes.bool,
    onRemoveRecord: PropTypes.func
  };

  export default GoalsTable;