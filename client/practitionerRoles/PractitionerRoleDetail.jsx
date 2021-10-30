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





// function PractitionerRoleDetail(props){

//   let classes = useStyles();


//   let { 
//     children, 
//     practitionerRole,
//     ...otherProps 
//   } = props;








//   return(
//     <div className='PractitionerRoleDetails'>

//         <Grid container spacing={3}>
//           <Grid item xs={6}>
//             <FormControl style={{width: '100%', marginTop: '20px'}}>
//               <InputAdornment className={classes.label}>Title</InputAdornment>
//               <Input
//                 id="titleInput"
//                 name="titleInput"
//                 className={classes.input}
//                 placeholder="Lorem ipsum."              
//                 value={get(practitionerRole, 'title')}
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
//                 value={get(practitionerRole, 'publisher')}
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
//                 value={get(practitionerRole, 'version')}
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
//                 value={get(practitionerRole, 'identifier[0].value')}
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
//                 value={get(practitionerRole, 'status')}
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
//                 value={get(practitionerRole, 'description')}
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

// PractitionerRoleDetail.propTypes = {
//   id: PropTypes.string,
//   fhirVersion: PropTypes.string,
//   practitionerRoleId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
//   practitionerRole: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
//   showPatientInputs: PropTypes.bool,
//   showHints: PropTypes.bool,
//   onInsert: PropTypes.func,
//   onUpsert: PropTypes.func,
//   onRemove: PropTypes.func,
//   onCancel: PropTypes.func
// };
// ReactMixin(PractitionerRoleDetail.prototype, ReactMeteorData);
// export default PractitionerRoleDetail;