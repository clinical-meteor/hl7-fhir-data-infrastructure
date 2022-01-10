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
// import { useTracker } from 'meteor/react-meteor-data';
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





// function BasicDetail(props){

//   let classes = useStyles();


//   let { 
//     children, 
//     basic,
//     ...otherProps 
//   } = props;








//   return(
//     <div className='BasicDetails'>

//         <Grid container spacing={3}>
//           <Grid item xs={6}>
//             <FormControl style={{width: '100%', marginTop: '20px'}}>
//               <InputAdornment className={classes.label}>Title</InputAdornment>
//               <Input
//                 id="titleInput"
//                 name="titleInput"
//                 className={classes.input}
//                 placeholder="Lorem ipsum."              
//                 value={get(basic, 'title')}
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
//                 value={get(basic, 'publisher')}
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
//                 value={get(basic, 'version')}
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
//                 value={get(basic, 'identifier[0].value')}
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
//                 value={get(basic, 'status')}
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
//                 value={get(basic, 'description')}
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

// BasicDetail.propTypes = {
//   id: PropTypes.string,
//   fhirVersion: PropTypes.string,
//   basicId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
//   basic: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
//   showPatientInputs: PropTypes.bool,
//   showHints: PropTypes.bool,
//   onInsert: PropTypes.func,
//   onUpsert: PropTypes.func,
//   onRemove: PropTypes.func,
//   onCancel: PropTypes.func
// };
// ReactMixin(BasicDetail.prototype, ReactMeteorData);
// export default BasicDetail;