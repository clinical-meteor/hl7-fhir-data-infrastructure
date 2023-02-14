// import { get, has } from 'lodash';
// import { Meteor } from 'meteor/meteor';


// import AllergyIntolerances from './schemas/AllergyIntolerances';
// import Conditions from './schemas/Conditions';
// // import Claims from './schemas/Claims';
// import DiagnosticReports from './schemas/DiagnosticReports';
// import Encounters from './schemas/Encounters';
// // import ExplanationOfBenefits from './schemas/ExplanationOfBenefits';
// import Immunizations from './schemas/Immunizations';
// import Medications from './schemas/Medications';
// import MedicationOrders from './schemas/MedicationOrders';
// import MedicationStatements from './schemas/MedicationStatements';
// import Observations from './schemas/Observations';
// import Patients from './schemas/Patients';
// import Procedures from './schemas/Procedures';
// import ValueSets from './schemas/ValueSets';

// // import { FhirUtilities } from 'meteor/clinical:hl7-fhir-data-infrastructure';

// //---------------------------------------------------------------------------
// // Collections

// // this is a little hacky, but it works to access our collections.
// // we use to use Mongo.Collection.get(collectionName), but in Meteor 1.3, it was deprecated
// // we then started using window[collectionName], but that only works on the client
// // so we now take the window and 

// let Collections;

// if(Meteor.isClient){
//   Collections = window;
// }
// if(Meteor.isServer){
//   Collections = {};
//   Collections.AllergyIntolerances = AllergyIntolerances;
//   Collections.Conditions = Conditions;
//   // Collections.Claims = Claims;
//   Collections.DiagnosticReports = DiagnosticReports;
//   Collections.Encounters = Encounters;
//   // Collections.ExplanationOfBenefits = ExplanationOfBenefits;
//   Collections.Immunizations = Immunizations;
//   Collections.Medications = Medications;
//   Collections.MedicationOrders = MedicationOrders;
//   Collections.MedicationStatements = MedicationStatements;
//   Collections.Observations = Observations;
//   Collections.Patients = Patients;
//   Collections.ValueSets = Procedures;
//   Collections.ValueSets = ValueSets;
// }



// //---------------------------------------------------------------------------
// // Main Application  

// MedicalRecordImporter = {
//   pluralizeResourceName: function(resourceType){
//     var pluralized = '';
//     switch (resourceType) {
//       case 'Binary':          
//         pluralized = 'Binaries';
//         break;
//       case 'Library':      
//         pluralized = 'Libraries';
//         break;
//       case 'SupplyDelivery':      
//         pluralized = 'SupplyDeliveries';
//         break;
//       case 'ImagingStudy':      
//         pluralized = 'ImagingStudies';
//         break;        
//       case 'FamilyMemberHistory':      
//         pluralized = 'FamilyMemberHistories';
//         break;        
//       case 'ResearchStudy':      
//         pluralized = 'ResearchStudies';
//         break;        
//       default:
//         pluralized = resourceType + 's';
//         break;
//     }

//     return pluralized;
//   },
//   importBundle: function(dataContent, collectionRoot){    
//     console.log('MedicalRecordImporter.importBundle()');
//     // console.log('dataContent', dataContent);

//     let self = this;

//     let parsedResults = {};

//     if(typeof dataContent === "string"){
//       parsedResults = JSON.parse(dataContent);
//     } else if(has(dataContent, 'content')){
//       if(typeof dataContent.content === "string"){
//         parsedResults = JSON.parse(dataContent.content);
//       } else {
//         parsedResults = dataContent.content;
//       }
//     } else {
//       parsedResults = dataContent;
//     }

//     // console.log('Parsed results:  ', parsedResults);
    
//     if(get(parsedResults, 'resourceType') === "Bundle"){
//       console.log('Found a FHIR bundle! There appear to be ' + parsedResults.entry.length + ' resources in the bundle.  Attempting import...')

//       // // EXPERIMENTAL:  Send the bundle to the bundle service.  Probablly want to disable this.
//       // Meteor.call('proxyInsert', parsedResults, function(error, result){
//       //   if(error){
//       //     console.error('error', error)
//       //   }
//       //   if(result){
//       //     console.log('result', result)
//       //   }
//       // })

//       // as a Bundle, we know it's going to have an entries array
//       // so, we're going to loop through each entry, looking for it's resources
//       if(Array.isArray(parsedResults.entry)){
//         parsedResults.entry.forEach(function(entry){          
//           if(get(entry, 'resource.resourceType')){
//             // console.log('Found a ' + get(entry, 'resource.resourceType'));

//             var newRecord = entry.resource;
//             // console.log('newRecord', newRecord)
  
//             if(!newRecord.id){
//               if(newRecord._id){
//                 newRecord.id = entry.resource._id;
//               } else {
//                 let newId = Random.id();
//                 newRecord.id = newId;
//                 newRecord._id = newId;
//               }
//             }
//             //console.log("Collections", JSON.stringify(Collections))
//             let collectionName = self.pluralizeResourceName(get(entry, 'resource.resourceType'))            

//             console.log('collectionName', collectionName)
//             if(Meteor.isServer){
//               // console.log('Collections', JSON.stringify(Object.keys(Collections)));
//               if(Collections[collectionName]){
//                 console.log('Collections[collectionName]', Collections[collectionName])
//                 if(!Collections[collectionName].findOne({_id: newRecord._id})){                  
//                   //console.log('Couldnt find record; attempting to insert.')
//                   let newRecordId = Collections[collectionName]._collection.insert(newRecord, {validate: false, filter: false}, function(error){
//                     if(error) {
//                       console.log('window(self.pluralizeResourceName(entry.resource.resourceType))._collection.insert.error', error)
//                     }
//                   });   
//                   console.log('New ' + get(entry, 'resource.resourceType') + ' record created: ' + newRecordId)
//                 }  
//               }  
//             }


//             if(Meteor.isClient){
//               // checking if there's a pub/sub
//               let subscriptionActivated = false;
//               if(has(Meteor, 'default_connection')){
//                 Object.keys( Meteor.default_connection._subscriptions).forEach(function(key) {
//                   var record = Meteor.default_connection._subscriptions[key];
//                   if(record.name === collectionName){
//                     subscriptionActivated = true;
//                   }
//                 });
                              
//                 console.log('Trying to import the following record', newRecord)
//                 if(subscriptionActivated){
//                   // console.log('Subscription for this resource exists; sending to proxy server to import.')
//                   Meteor.call('proxyInsert', entry, function(error, result){
//                     if(error){
//                       console.error('error', error)
//                     }
//                     if(result){
//                       console.log('result', result)
//                     }
//                   })
//                 } else {
//                   if(Meteor.isClient){
//                     if(window[collectionName]){
//                       if(!window[collectionName]._collection.findOne({_id: newRecord._id})){                  
//                         //console.log('Couldnt find record; attempting to insert.')
//                         let newRecordId = window[collectionName]._collection.insert(newRecord, {validate: false, filter: false}, function(error){
//                           if(error) {
//                             console.log('window(self.pluralizeResourceName(entry.resource.resourceType))._collection.insert.error', error)
//                           }
//                         });   
//                         console.log('New ' + get(entry, 'resource.resourceType') + ' record created: ' + newRecordId)
//                       }  
//                     }  
//                   }
//                 }
//               } else {
//                 // this should only be run if there's not a pubsub, and the cursors are effectively running offline
//                 console.log('Cursor appears to be offline.')                
//               }
//             }
//           }
//         })
//       }


//     // if it's not an array...
//     } else {
//       if(Meteor.isClient){
//         console.log('parsedResults', parsedResults)
//         console.log('parsedResults.resource.resourceType', get(parsedResults, 'resource.resourceType'))
//         console.log('parsedResults.resource.resourceType.pluralized',self.pluralizeResourceName(get(parsedResults, 'resourceType')))
//         console.log('Collections[parsedResults.resource.resourceType.pluralized]', Collections[self.pluralizeResourceName(get(parsedResults, 'resourceType'))])

//         // // Maybe works better on server
//         // if(self.pluralizeResourceName(get(parsedResults, 'resource.resourceType'))){
//         //   Collections[self.pluralizeResourceName(get(parsedResults, 'resourceType'))].upsert({id: parsedResults.id}, {$set: parsedResults}, {validate: false, filter: false},  function(error){          
//         //     if(error) console.log('Collections[self.pluralizeResourceName(dataContent.resourceType))._collection.insert.error', error)
//         //   });    
//         // } else {
//         //   console.log("Couldnt find the " + self.pluralizeResourceName(get(entry, 'resource.resourceType')) + ' collection.  Is it imported?')
//         // }

//         // This might work better on the client; but needs allow/deny rules to be set
//         if(self.pluralizeResourceName(get(parsedResults, 'resource.resourceType'))){
//           let pluralizedCollectionName = self.pluralizeResourceName(get(parsedResults, 'resourceType'));
          
//           if(!Collections[pluralizedCollectionName].findOne(parsedResults.id)){
//             Collections[pluralizedCollectionName].insert(parsedResults, {validate: false, filter: false},  function(error){          
//               if(error) console.log('Collections[self.pluralizeResourceName(dataContent.resourceType))._collection.insert.error', error);              
//             });      
//           }
//         } else {
//           console.log("Couldnt find the " + self.pluralizeResourceName(get(entry, 'resource.resourceType')) + ' collection.  Is it imported?')
//         }
//       }
//     }    
//     return true
//   }
// }

// export default MedicalRecordImporter;