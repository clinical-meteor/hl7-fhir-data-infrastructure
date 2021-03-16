

import { 
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Tab, 
  Tabs,
  Typography,
  TextField,
  DatePicker,
  Box
} from '@material-ui/core';

import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { get, set } from 'lodash';
import { Icon } from 'react-icons-kit'
import {users} from 'react-icons-kit/fa/users'



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


//===========================================================================
// MAIN COMPONENT

export function CompositionDetail(props){

  let classes = useStyles();

  let {
    children,
    composition,
    compositionId
  } = props;
 
  function renderDatePicker(displayDatePicker, effectiveDateTime){
    //console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
    // if (displayDatePicker) {
    //   return (
    //     <DatePicker 
    //       name='effectiveDateTime'
    //       hintText={ setHint("Date of Administration") } 
    //       container="inline" 
    //       mode="landscape"
    //       value={ effectiveDateTime ? effectiveDateTime : null}    
    //       onChange={ this.changeState.bind(this, 'effectiveDateTime')}      
    //       fullWidth
    //     />
    //   );
    // }
  }
  function setHint(text){
    if(props.showHints !== false){
      return text;
    } else {
      return '';
    }
  }

  return(
    <div className='CompositionDetails' >
      <Grid container spacing={3} style={{paddingBottom: '20px'}}>
        <Grid item xs={6}>
          <TextField
            id='subjectDisplayInput'                
            name='subjectDisplay'
            label='Subject Name'
            value={get(composition, 'subject.display')}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='subjectIdInput'                
            name='subjectReference'
            label='Subject ID'
            value={get(composition, 'subject.reference')}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id='titleInput'                
            name='title'
            label='Title'
            value={get(composition, 'title')}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='statusInput'                
            name='status'
            label='Status'
            value={get(composition, 'status')}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='categoryTextInput'                
            name='category'
            label='Category'
            value={get(composition, 'category[0].display')}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='encounterReferenceInput'                
            name='encounterReference'
            label='Encounter Reference'
            value={get(composition, 'encounter.reference')}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            /><br/>
        </Grid>
        <Grid item xs={3}>
          <TextField
            id='encounterInput'                
            name='encounter'
            label='Encounter'
            value={get(composition, 'encounter.display')}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            /><br/>
        </Grid>
      </Grid>
    </div>
  );
}

CompositionDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  compositionId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  composition: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default CompositionDetail;