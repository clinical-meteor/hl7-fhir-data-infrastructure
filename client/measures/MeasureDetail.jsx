import { 
  Grid, 
  Container,
  Button,
  Typography,
  DatePicker,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  TextField
} from '@material-ui/core';


import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import { get, has } from 'lodash';
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





function MeasureDetail(props){

  let classes = useStyles();


  let { 
    children, 
    measure,
    ...otherProps 
  } = props;

  let renderElements = [];
  let groups = get(measure, 'group');

  if(Array.isArray(groups)){
    groups.forEach(function(group){
      renderElements.push(<Grid item xs={3}>
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
      renderElements.push(<Grid item xs={9}>
        <FormControl style={{width: '100%', marginTop: '20px'}}>
          <InputAdornment className={classes.label}>Group Description</InputAdornment>
          <Input
            id="groupDescriptionInput"
            name="groupDescriptionInput"
            className={classes.input}       
            value={get(group, 'description')}
            fullWidth              
          />       
        </FormControl>     
      </Grid>)

      let populations = get(group, 'population');
      if(Array.isArray(populations)){
        populations.forEach(function(subPopulation){
          renderElements.push(<Grid item xs={3} style={{paddingLeft: '40px'}}>
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
          renderElements.push(<Grid item xs={9} style={{paddingLeft: '40px'}}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Population Description</InputAdornment>
              <Input
                id={"populationDescriptionInput-" + get(subPopulation, 'id')}
                name={"populationDescriptionInput-" + get(subPopulation, 'id')}
                className={classes.input}       
                value={get(subPopulation, 'description')}
                fullWidth              
              />       
            </FormControl>   
          </Grid>)

          // renderElements.push(<Grid item xs={3} style={{paddingLeft: '40px', borderLeft: '2px double lightgray'}}>
          //   <FormControl style={{width: '100%', marginTop: '20px'}}>
          //     <InputAdornment className={classes.label}>Population Code</InputAdornment>
          //     <Input
          //       id={"populationCodeInput-" + get(subPopulation, 'id')}
          //       name={"populationCodeInput-" + get(subPopulation, 'id')}
          //       className={classes.input}       
          //       value={get(subPopulation, 'code.text')}
          //       fullWidth              
          //     />       
          //   </FormControl>   
          // </Grid>)
          // renderElements.push(<Grid item xs={9}>
          //   <FormControl style={{width: '100%', marginTop: '20px'}}>
          //     <InputAdornment className={classes.label}>Population Description</InputAdornment>
          //     <Input
          //       id={"populationCodeInput-" + get(subPopulation, 'id')}
          //       name={"populationCodeInput-" + get(subPopulation, 'id')}
          //       className={classes.input}       
          //       value={get(subPopulation, 'description')}
          //       fullWidth              
          //     />       
          //   </FormControl>   
          // </Grid>)

          if(has(subPopulation, 'criteria')){
            renderElements.push(<Grid item xs={3} style={{paddingLeft: '80px'}}>
            <FormControl style={{width: '100%', marginTop: '10px'}}>
              <InputLabel className={classes.label}>Criteria Name</InputLabel>
              <Input
                id={"criteriaNameInput-" + get(subPopulation, 'id')}
                name={"criteriaNameInput-" + get(subPopulation, 'id')}
                className={classes.compactInput}       
                value={get(subPopulation, 'criteria.name')}
                fullWidth              
              />       
            </FormControl>   
            </Grid>)
          renderElements.push(<Grid item xs={3} >
            <FormControl style={{width: '100%', marginTop: '10px'}}>
              <InputLabel className={classes.label}>Criteria Language</InputLabel>
              <Input
                id={"criteriaLanguageInput-" + get(subPopulation, 'id')}
                name={"criteriaLanguageInput-" + get(subPopulation, 'id')}
                className={classes.compactInput}       
                value={get(subPopulation, 'criteria.language')}
                fullWidth              
              />       
            </FormControl>   
            </Grid>)

          renderElements.push(<Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '10px'}}>
              <InputLabel className={classes.label}>Criteria Description</InputLabel>
              <Input
                id={"criteriaDescriptionInput-" + get(subPopulation, 'id')}
                name={"criteriaDescriptionInput-" + get(subPopulation, 'id')}
                className={classes.compactInput}       
                value={get(subPopulation, 'criteria.description')}
                fullWidth              
              />       
            </FormControl>   
            </Grid>)

          renderElements.push(<Grid item xs={12} style={{paddingLeft: '80px', marginTop: '0px'}} >
            <FormControl style={{width: '100%', marginTop: '10px'}}>
              <InputLabel shrunk={true} className={classes.label}>Criteria Expression</InputLabel>
              <Input
                id={"criteriaExpressionInput-" + get(subPopulation, 'id')}
                name={"criteriaExpressionInput-" + get(subPopulation, 'id')}
                className={classes.compactInput}       
                value={get(subPopulation, 'criteria.expression')}
                fullWidth              
              />       
            </FormControl>   
            </Grid>)

          renderElements.push(<Grid item xs={12} style={{paddingLeft: '80px', marginTop: '0px'}}>
            {/* <TextField 
              id={"criteriaUrl-" + get(subPopulation, 'id')}
              name={"criteriaUrl-" + get(subPopulation, 'id')}
              label="Criteria URL" 
              value={get(subPopulation, 'criteria.reference')}
              fullWidth
            /> */}

              <FormControl style={{width: '100%', marginTop: '10px'}}>
                <InputLabel className={classes.label}>Criteria URL</InputLabel>
                <Input
                  id={"criteriaUrl-" + get(subPopulation, 'id')}
                  name={"criteriaUrl-" + get(subPopulation, 'id')}
                  className={classes.compactInput}       
                  value={get(subPopulation, 'criteria.reference')}
                  fullWidth              
                />       
              </FormControl>   
            </Grid>)
          }

          


        })
      }
    })    
  }

  let approvedOnDate = '';
  if(get(measure, 'approvedDate')){
    approvedOnDate = moment(get(measure, 'approvedDate')).format("YYYY-MM-DD")
  }
  let lastEditedDate = '';
  if(get(measure, 'date')){
    lastEditedDate = moment(get(measure, 'date')).format("YYYY-MM-DD")
  }
  let lastReviewDate = '';
  if(get(measure, 'lastReviewDate')){
    lastReviewDate = moment(get(measure, 'lastReviewDate')).format("YYYY-MM-DD")
  }

  let descriptionElements = '';
  if(get(measure, 'description')){
    descriptionElements = <Grid item xs={12}>
    <FormControl style={{width: '100%', marginTop: '20px'}}>
      <InputAdornment className={classes.label}>Description</InputAdornment>
      <Input
        id="descriptionInput"
        name="descriptionInput"
        className={classes.input}
        placeholder="Lorem ipsum."              
        value={get(measure, 'description')}
        //onChange={handleFhirEndpointChange}
        fullWidth           
        multiline   
      />
    </FormControl>
                     
  </Grid>
  }

  let artifactsElements = '';
  if(Array.isArray(measure.relatedArtifact)){
    artifactsElements = <Grid item xs={12}>
    <FormControl style={{width: '100%', marginTop: '20px'}}>
      <InputAdornment className={classes.label}>Artifacts</InputAdornment>

    </FormControl>
                     
  </Grid>
  }


  return(
    <div className='MeasureDetails'>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Title</InputAdornment>
              <Input
                id="titleInput"
                name="titleInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(measure, 'title')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>   
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Publisher</InputAdornment>
              <Input
                id="publisherInput"
                name="publisherInput"
                className={classes.input}
                value={get(measure, 'publisher')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>      
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Version</InputAdornment>
              <Input
                id="versionInput"
                name="versionInput"
                className={classes.input}
                placeholder="2020.2"              
                value={get(measure, 'version')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />          
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={get(measure, 'identifier[0].value')}
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
                value={get(measure, 'status')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />    
            </FormControl>
          </Grid>

          { descriptionElements }

          <Grid item xs={6} style={{paddingLeft: '40px'}}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Editor</InputAdornment>
              <Input
                id="editorInput"
                name="editorInput"
                className={classes.input}            
                value={get(measure, 'editor[0].name')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Reviewer</InputAdornment>
              <Input
                id="reviewerInput"
                name="reviewerInput"
                className={classes.input}
                value={get(measure, 'reviewer[0].name')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Endorser</InputAdornment>
              <Input
                id="endorserInput"
                name="endorserInput"
                className={classes.input}         
                value={get(measure, 'endorser[0].name')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Last Edited</InputAdornment>
              <Input
                id="editedDateInput"
                name="editedDateInput"
                className={classes.input}
                placeholder="YYYY-MM-DD"              
                value={lastEditedDate}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Last Reviewed</InputAdornment>
              <Input
                id="reviewedDateInput"
                name="reviewedDateInput"
                className={classes.input}
                placeholder="YYYY-MM-DD"              
                value={lastReviewDate}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Approved On</InputAdornment>
              <Input
                id="approvedDateInput"
                name="approvedDateInput"
                className={classes.input}
                placeholder="YYYY-MM-DD"                   
                value={approvedOnDate}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
                   
          </Grid>
          <Grid item xs={3}></Grid>

          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Scoring</InputAdornment>
              <Input
                id="scoringInput"
                name="scoringInput"
                className={classes.input}              
                value={get(measure, 'scoring.text')}
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
                value={get(measure, 'type[0].text')}
                fullWidth              
              />          
            </FormControl>   
          </Grid>



          { renderElements }
          
        </Grid>
    </div>
  );
}

MeasureDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  measureId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  measure: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};

export default MeasureDetail;