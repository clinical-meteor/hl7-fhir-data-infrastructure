import { 
  Grid, 
  Container,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  DatePicker,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';


import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import { get, set } from 'lodash';
// import { setFlagsFromString } from 'v8';

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
  },
  input: {
    marginBottom: '20px'
  },
  compactInput: {
    marginBottom: '10px'
  },
  label: {
    paddingBottom: '10px'
  }
}));




function MeasureReportDetail(props){

  let classes = useStyles();

  let { 
    children, 
    measureReport,
    ...otherProps 
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



  let renderElements = [];
  let groups = get(measureReport, 'group');

  if(Array.isArray(groups)){
    groups.forEach(function(group){
      renderElements.push(<Grid item xs={9}>
        <FormControl style={{width: '100%', marginTop: '20px'}}>
          <InputAdornment className={classes.label}>Group Code</InputAdornment>
          <Input
            id="groupCodeInput"
            name="groupCodeInput"
            className={classes.input}       
            value={get(group, 'code.text')}
            fullWidth              
          />       
        </FormControl>   
      </Grid>)
      renderElements.push(<Grid item xs={3}>
        <FormControl style={{width: '100%', marginTop: '20px'}}>
          <InputAdornment className={classes.label}>Measure Score</InputAdornment>
          <Input
            id="measureScoreInput"
            name="measureScoreInput"
            className={classes.input}       
            value={get(group, 'measureScore.value')}
            fullWidth              
          />       
        </FormControl>     
      </Grid>)

      let populations = get(group, 'population');
      if(Array.isArray(populations)){
        populations.forEach(function(subPopulation){
          renderElements.push(<Grid item xs={9}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Population Code</InputAdornment>
              <Input
                id={"populationCodeInput-" + get(subPopulation, 'id')}
                name={"populationCodeInput-" + get(subPopulation, 'id')}
                className={classes.input}       
                value={get(subPopulation, 'code.text')}
                fullWidth              
              />       
            </FormControl>   
          </Grid>)
          renderElements.push(<Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Count</InputAdornment>
              <Input
                id={"populationCodeInput-" + get(subPopulation, 'id')}
                name={"populationCodeInput-" + get(subPopulation, 'id')}
                className={classes.input}       
                value={get(subPopulation, 'count')}
                fullWidth              
              />       
            </FormControl>   
          </Grid>)

        })
      }
    })    
  }

  let dateGenerated = '';
  if(get(measureReport, 'date')){
    dateGenerated = moment(get(measureReport, 'date')).format("YYYY-MM-DD")
  }

  let periodStart = '';
  if(get(measureReport, 'period.start')){
    periodStart = moment(get(measureReport, 'period.start')).format("YYYY-MM-DD")
  }
  let periodEnd = '';
  if(get(measureReport, 'period.end')){
    periodEnd = moment(get(measureReport, 'period.end')).format("YYYY-MM-DD")
  }
  return(
    <div className='MeasureReportDetails'>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={get(measureReport, 'identifier[0].value')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>  
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Status</InputAdornment>
            <Input
              id="statusInput"
              name="statusInput"
              className={classes.input}
              placeholder="active"              
              value={get(measureReport, 'status')}
              //onChange={handleFhirEndpointChange}
              fullWidth              
            />    
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Type</InputAdornment>
            <Input
              id="typeInput"
              name="typeInput"
              className={classes.input}
              value={get(measureReport, 'type')}
              fullWidth              
            />          
          </FormControl> 
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Date Generated</InputAdornment>
            <Input
              id="dateGeneratedInput"
              name="dateGeneratedInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"              
              value={dateGenerated}
              fullWidth              
            />
          </FormControl>
        </Grid>
        {/* <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Reporter</InputAdornment>
            <Input
              id="reporterInput"
              name="reporterInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"              
              value={get(measureReport, 'reporter.display')}
              fullWidth              
            />
          </FormControl>
        </Grid> */}
        <Grid item xs={6}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Measure</InputAdornment>
            <Input
              id="measureInput"
              name="measureInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"              
              value={get(measureReport, 'measure')}
              fullWidth              
            />
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Period Start</InputAdornment>
            <Input
              id="periodStartInput"
              name="periodStartInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"              
              value={periodStart}
              fullWidth              
            />
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl style={{width: '100%', marginTop: '20px'}}>
            <InputAdornment className={classes.label}>Period End</InputAdornment>
            <Input
              id="periodEndInput"
              name="periodEndInput"
              className={classes.input}
              placeholder="YYYY-MM-DD"              
              value={periodEnd}
              fullWidth              
            />
          </FormControl>
        </Grid>
        

        { renderElements }

      </Grid>
    </div>
  );
}

MeasureReportDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  measureReportId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  measureReport: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default MeasureReportDetail;