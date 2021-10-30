// import { 
//   Grid, 
//   Button, 
//   Container,
//   Typography,
//   DatePicker,
//   FormControl,
//   InputLabel,
//   Input,
//   InputAdornment,
//   FormControlLabel,
//   Checkbox
// } from '@material-ui/core';


// import React from 'react';
// import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
// import ReactMixin from 'react-mixin';
// import PropTypes from 'prop-types';

// import { Meteor } from 'meteor/meteor';

// import moment from 'moment';
// import { get, set } from 'lodash';
// // import { setFlagsFromString } from 'v8';

// import { ThemeProvider, makeStyles } from '@material-ui/styles';
// const useStyles = makeStyles(theme => ({
//   button: {
//     background: theme.background,
//     border: 0,
//     borderRadius: 3,
//     boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
//     color: theme.buttonText,
//     height: 48,
//     padding: '0 30px',
//   },
//   input: {
//     marginBottom: '20px'
//   },
//   compactInput: {
//     marginBottom: '10px'
//   },
//   label: {
//     paddingBottom: '10px'
//   }
// }));





// function OrganizationAffiliationDetail(props){

//   let classes = useStyles();


//   let { 
//     children, 
//     organizationAffiliation,
//     ...otherProps 
//   } = props;








//   return(
//     <div className='OrganizationAffiliationDetails'>

//         <Grid container spacing={3}>
//           <Grid item xs={6}>
//             <FormControl style={{width: '100%', marginTop: '20px'}}>
//               <InputAdornment className={classes.label}>Title</InputAdornment>
//               <Input
//                 id="titleInput"
//                 name="titleInput"
//                 className={classes.input}
//                 placeholder="Lorem ipsum."              
//                 value={get(organizationAffiliation, 'title')}
//                 //onChange={handleFhirEndpointChange}
//                 fullWidth              
//               />       
//             </FormControl>   
//             <FormControl style={{width: '100%', marginTop: '20px'}}>
//               <InputAdornment className={classes.label}>Publisher</InputAdornment>
//               <Input
//                 id="publisherInput"
//                 name="publisherInput"
//                 className={classes.input}
//                 value={get(organizationAffiliation, 'publisher')}
//                 //onChange={handleFhirEndpointChange}
//                 fullWidth              
//               />       
//             </FormControl>      
//           </Grid>
//           <Grid item xs={3}>
//             <FormControl style={{width: '100%', marginTop: '20px'}}>
//               <InputAdornment className={classes.label}>Version</InputAdornment>
//               <Input
//                 id="versionInput"
//                 name="versionInput"
//                 className={classes.input}
//                 placeholder="2020.2"              
//                 value={get(organizationAffiliation, 'version')}
//                 //onChange={handleFhirEndpointChange}
//                 fullWidth              
//               />          
//             </FormControl>
//             <FormControl style={{width: '100%', marginTop: '20px'}}>
//               <InputAdornment className={classes.label}>Identifier</InputAdornment>
//               <Input
//                 id="identifierInput"
//                 name="identifierInput"
//                 className={classes.input}
//                 placeholder="XYZ.1"              
//                 value={get(organizationAffiliation, 'identifier[0].value')}
//                 //onChange={handleFhirEndpointChange}
//                 fullWidth              
//               />
//             </FormControl>     
//           </Grid>
//           <Grid item xs={3}>
//             <FormControl style={{width: '100%', marginTop: '20px'}}>
//               <InputAdornment className={classes.label}>Status</InputAdornment>
//               <Input
//                 id="statusInput"
//                 name="statusInput"
//                 className={classes.input}
//                 placeholder="active"              
//                 value={get(organizationAffiliation, 'status')}
//                 //onChange={handleFhirEndpointChange}
//                 fullWidth              
//               />    
//             </FormControl>
//           </Grid>

//           <Grid item xs={12}>
//             <FormControl style={{width: '100%', marginTop: '20px'}}>
//               <InputAdornment className={classes.label}>Description</InputAdornment>
//               <Input
//                 id="descriptionInput"
//                 name="descriptionInput"
//                 className={classes.input}
//                 placeholder="Lorem ipsum."              
//                 value={get(organizationAffiliation, 'description')}
//                 //onChange={handleFhirEndpointChange}
//                 fullWidth           
//                 multiline   
//               />
//             </FormControl>
                             
//           </Grid>

          
//         </Grid>
//     </div>
//   );
// }

// OrganizationAffiliationDetail.propTypes = {
//   id: PropTypes.string,
//   fhirVersion: PropTypes.string,
//   organizationAffiliationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
//   organizationAffiliation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
//   showPatientInputs: PropTypes.bool,
//   showHints: PropTypes.bool,
//   onInsert: PropTypes.func,
//   onUpsert: PropTypes.func,
//   onRemove: PropTypes.func,
//   onCancel: PropTypes.func
// };
// ReactMixin(OrganizationAffiliationDetail.prototype, ReactMeteorData);
// export default OrganizationAffiliationDetail;