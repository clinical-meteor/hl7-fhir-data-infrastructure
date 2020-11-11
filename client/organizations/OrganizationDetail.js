
import React from 'react';
import PropTypes from 'prop-types';


import { 
  Button,
  Card,
  Checkbox,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Select,
  MenuItem,
} from '@material-ui/core';

import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';


import { Meteor } from 'meteor/meteor';

import moment from 'moment';
import { get, set } from 'lodash';


//---------------------------------------------------------------
// Theming  

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


//---------------------------------------------------------------
// Main Component  

function OrganizationDetail(props){
  logger.debug('OrganizationDetail', props)
  let classes = useStyles();

  let { 
    children, 
    organization,
    organizationId,
    ...otherProps 
  } = props;




  return(
    <div className='MeasureDetails'>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Name</InputAdornment>
              <Input
                id="nameInput"
                name="nameInput"
                className={classes.input}
                placeholder="St. James Infirmary"              
                value={get(organization, 'name', '')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />       
            </FormControl>       
          </Grid>
          <Grid item xs={4}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Identifier</InputAdornment>
              <Input
                id="identifierInput"
                name="identifierInput"
                className={classes.input}
                placeholder="12345"              
                value={get(organization, 'identifier[0].value', '')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />          
            </FormControl>   
          </Grid>
          <Grid item xs={5}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Address</InputAdornment>
              <Input
                id="addressLineInput"
                name="addressLineInput"
                className={classes.input}
                placeholder="123 Main St"              
                value={get(organization, 'address[0].line[0]', '')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />    
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>City</InputAdornment>
              <Input
                id="cityInput"
                name="cityInput"
                className={classes.input}
                placeholder="New Orleans"              
                value={get(organization, 'address[0].city', '')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />    
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>State</InputAdornment>
              <Input
                id="stateInput"
                name="stateInput"
                className={classes.input}
                placeholder="LI"              
                value={get(organization, 'address[0].state', '')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />    
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Postal Code</InputAdornment>
              <Input
                id="postalCodeInput"
                name="postalCodeInput"
                className={classes.input}
                placeholder="12345"              
                value={get(organization, 'address[0].postalCode', '')}
                //onChange={handleFhirEndpointChange}
                fullWidth              
              />    
            </FormControl>
          </Grid>                              

          <Grid item xs={12}>
            <FormControl style={{width: '100%', marginTop: '20px'}}>
              <InputAdornment className={classes.label}>Description</InputAdornment>
              <Input
                id="descriptionInput"
                name="descriptionInput"
                className={classes.input}
                placeholder=""              
                value={get(organization, 'description', '')}
                //onChange={handleFhirEndpointChange}
                fullWidth           
                multiline   
              />
            </FormControl>            
          </Grid>
        </Grid>
    </div>
  );
}


OrganizationDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  organizationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  organization: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};

export default OrganizationDetail;