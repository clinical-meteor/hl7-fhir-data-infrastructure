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





function ExplanationOfBenefitDetail(props){

  let classes = useStyles();


  let { 
    children, 
    explanationOfBenefit,
    ...otherProps 
  } = props;




  let renderElements = [];
  let groups = get(explanationOfBenefit, 'group');

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
          renderElements.push(<Grid item xs={3}>
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
          renderElements.push(<Grid item xs={9}>
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


          renderElements.push(<Grid item xs={3} style={{paddingLeft: '40px'}}>
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

          renderElements.push(<Grid item xs={12} style={{paddingLeft: '40px', marginTop: '0px'}} >
            <FormControl style={{width: '100%', marginTop: '10px'}}>
              <InputLabel className={classes.label}>Criteria Expression</InputLabel>
              <Input
                id={"criteriaExpressionInput-" + get(subPopulation, 'id')}
                name={"criteriaExpressionInput-" + get(subPopulation, 'id')}
                className={classes.compactInput}       
                value={get(subPopulation, 'criteria.expression')}
                fullWidth              
              />       
            </FormControl>   
            </Grid>)

          renderElements.push(<Grid item xs={12} style={{paddingLeft: '40px', marginTop: '0px'}}>
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


        })
      }
    })    
  }

  let approvedOnDate = '';
  if(get(explanationOfBenefit, 'approvedDate')){
    approvedOnDate = moment(get(explanationOfBenefit, 'approvedDate')).format("YYYY-MM-DD")
  }
  let lastEditedDate = '';
  if(get(explanationOfBenefit, 'date')){
    lastEditedDate = moment(get(explanationOfBenefit, 'date')).format("YYYY-MM-DD")
  }
  let lastReviewDate = '';
  if(get(explanationOfBenefit, 'lastReviewDate')){
    lastReviewDate = moment(get(explanationOfBenefit, 'lastReviewDate')).format("YYYY-MM-DD")
  }


  return(
    <div className='ExplanationOfBenefitDetails'>

        <Grid container spacing={3}>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Use</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="claim"              
                value={get(explanationOfBenefit, 'use')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>   
            {/* <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Publisher</InputAdornment>
              <Input
                id="publisherInput"
                name="publisherInput"
                className={classes.input}
                value={get(explanationOfBenefit, 'publisher')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>       */}
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Created</InputAdornment>
              <Input
                id="createdInput"
                name="createdInput"
                className={classes.input}
                placeholder="YYYY-MM-DD"              
                value={moment(get(explanationOfBenefit, 'created')).format("YYYY-MM-DD")}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />          
            </FormControl>
            {/* <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="XYZ.1"              
                value={get(explanationOfBenefit, 'identifier[0].value')}
                fullWidth              
              />
            </FormControl>      */}
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Status</InputAdornment>
              <Input
                id="statusInput"
                name="statusInput"
                className={classes.input}
                placeholder="active"              
                value={get(explanationOfBenefit, 'status')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />    
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Outcome</InputAdornment>
              <Input
                id="statusInput"
                name="statusInput"
                className={classes.input}
                placeholder="active"              
                value={get(explanationOfBenefit, 'outcome')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />    
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Disposition</InputAdornment>
              <Input
                id="descriptionInput"
                name="descriptionInput"
                className={classes.input}
                placeholder="Lorem ipsum."              
                value={get(explanationOfBenefit, 'disposition')}
                //onChange={handleFhirEndpointChange}
                fullWidth           
                multiline   
              />
            </FormControl>
                             
          </Grid>
          <Grid item xs={6} style={{paddingLeft: '40px'}}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Patient</InputAdornment>
              <Input
                id="patientDisplayInput"
                name="patientDisplayInput"
                className={classes.input}            
                value={get(explanationOfBenefit, 'patient.display')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Insurer</InputAdornment>
              <Input
                id="insurerDisplayInput"
                name="insurerDisplayInput"
                className={classes.input}
                value={get(explanationOfBenefit, 'insurer.display')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Provider</InputAdornment>
              <Input
                id="providerDisplayInput"
                name="providerDisplayInput"
                className={classes.input}         
                value={get(explanationOfBenefit, 'provider.display')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>  
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Payee</InputAdornment>
              <Input
                id="payeeDisplayInput"
                name="payeeDisplayInput"
                className={classes.input}         
                value={get(explanationOfBenefit, 'payee.party.display')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Facility</InputAdornment>
              <Input
                id="locationInput"
                name="locationInput"
                className={classes.input}         
                value={get(explanationOfBenefit, 'facility.display')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Claim</InputAdornment>
              <Input
                id="claimInput"
                name="claimInput"
                className={classes.input}         
                value={get(explanationOfBenefit, 'claim.display')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Claim Response</InputAdornment>
              <Input
                id="claimResponseInput"
                name="claimResponseInput"
                className={classes.input}         
                value={get(explanationOfBenefit, 'claimResponse.display')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     


          </Grid>
          <Grid item xs={6} style={{paddingRight: '40px'}}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Patient Reference</InputAdornment>
              <Input
                id="patientReferenceInput"
                name="patientReferenceInput"
                className={classes.input}
                value={get(explanationOfBenefit, 'patient.reference')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Insurer Reference</InputAdornment>
              <Input
                id="insurerReferenceInput"
                name="insurerReferenceInput"
                className={classes.input}
                value={get(explanationOfBenefit, 'insurer.reference')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Provider Reference</InputAdornment>
              <Input
                id="providerReferenceInput"
                name="providerReferenceInput"
                className={classes.input}
                value={get(explanationOfBenefit, 'provider.reference')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Payee Reference</InputAdornment>
              <Input
                id="payeeReferenceInput"
                name="payeeReferenceInput"
                className={classes.input}
                value={get(explanationOfBenefit, 'payee.party.reference')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>    
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Facility Reference</InputAdornment>
              <Input
                id="locationInput"
                name="locationInput"
                className={classes.input}         
                value={get(explanationOfBenefit, 'facility.reference')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Claim Reference</InputAdornment>
              <Input
                id="claimInput"
                name="claimInput"
                className={classes.input}         
                value={get(explanationOfBenefit, 'claim.reference')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Claim Response Reference</InputAdornment>
              <Input
                id="claimResponseInput"
                name="claimResponseInput"
                className={classes.input}         
                value={get(explanationOfBenefit, 'claimResponse.reference')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />
            </FormControl>     
                   
          </Grid>
          <Grid item xs={3}></Grid>

          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Total</InputAdornment>
              <Input
                id="scoringInput"
                name="scoringInput"
                className={classes.input}              
                value={get(explanationOfBenefit, 'total[0].amount.value') + ' ' + get(explanationOfBenefit, 'total[0].amount.currency')}
                fullWidth              
              />       
            </FormControl>        
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Category</InputAdornment>
              <Input
                id="typeInput"
                name="typeInput"
                className={classes.input}
                value={get(explanationOfBenefit, 'total.category.coding.code')}
                fullWidth              
              />          
            </FormControl>   
          </Grid>
          <Grid item xs={6}>

          </Grid>


          { renderElements }
          
        </Grid>
    </div>
  );
}

ExplanationOfBenefitDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  explanationOfBenefitId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  explanationOfBenefit: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showPatientInputs: PropTypes.bool,
  showHints: PropTypes.bool,
  onInsert: PropTypes.func,
  onUpsert: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func
};
ReactMixin(ExplanationOfBenefitDetail.prototype, ReactMeteorData);
export default ExplanationOfBenefitDetail;