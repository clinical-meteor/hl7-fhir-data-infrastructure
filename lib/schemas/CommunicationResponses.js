
if(Package['clinical:autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  Your app has the 'clinical-autopublish' package installed.");
  console.log("Any protected health information (PHI) stored in this app should be audited."); 
  console.log("Please consider writing secure publish/subscribe functions and uninstalling.");  
  console.log("");  
  console.log("meteor remove clinical:autopublish");  
  console.log("");  
}
if(Package['autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  DO NOT STORE PROTECTED HEALTH INFORMATION IN THIS APP. ");  
  console.log("Your application has the 'autopublish' package installed.  Please uninstall.");
  console.log("");  
  console.log("meteor remove autopublish");  
  console.log("meteor add clinical:autopublish");  
  console.log("");  
}

import { get } from 'lodash';
import validator from 'validator';

import BaseModel from '../BaseModel';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// REFACTOR:  we want to deprecate meteor/clinical:hl7-resource-datatypes
// so please remove references from the following line
// and replace with import from ../../datatypes/*
import { BaseSchema, DomainResourceSchema, IdentifierSchema, ContactPointSchema, AddressSchema, SignatureSchema } from 'meteor/clinical:hl7-resource-datatypes';
import ReferenceSchema from '../../datatypes/Reference';
import HumanNameSchema from '../../datatypes/HumanName';



// create the object using our BaseModel
CommunicationResponse = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
CommunicationResponse.prototype._collection = CommunicationResponses;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.CommunicationResponses = new Mongo.Collection('HL7.Resources.CommunicationResponses');
if(typeof CommunicationResponses === 'undefined'){
  CommunicationResponses = new Mongo.Collection('CommunicationResponses');
}

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
CommunicationResponses._transform = function (document) {
  return new CommunicationResponse(document);
};




CommunicationResponseR4 = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "CommunicationResponse"
  },
  "_id" : {
    optional: true,
    type: String
    },
  "id" : {
    optional: true,
    type: String
    },
  
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "extension" : {
    optional: true,
    type:  Array
    },
  "extension.$" : {
    optional: true,
    blackbox: true,
    type:  Object 
    },
  "modifierExtension" : {
    optional: true,
    type:  Array
    },
  "modifierExtension.$" : {
    optional: true,
    blackbox: true,
    type:  Object 
    },
});


CommunicationResponseSchema = CommunicationResponseR4;

BaseSchema.extend(CommunicationResponseR4);
DomainResourceSchema.extend(CommunicationResponseR4);

CommunicationResponses.attachSchema(CommunicationResponseR4);


CommunicationResponse.prototype.toFhir = function(){
  console.log('CommunicationResponse.toFhir()');

  return EJSON.stringify(this.name);
}

/**
 * @summary Search the CommunicationResponses collection for those sent by a specific userId.
 * @memberOf CommunicationResponses
 * @name findCommunicationResponsesSentByUserId
 * @version 1.2.3
 * @returns array of communications
 * @example
 * ```js
 *  let communications = CommunicationResponses.findCommunicationResponsesSentByUserId(Meteor.userId());
 *  let communication = communications[0];
 * ```
 */

CommunicationResponses.findCommunicationResponsesSentByUserId = function (userId) {
  process.env.TRACE && console.log("CommunicationResponses.findCommunicationResponsesSentByUserId()");
  return CommunicationResponses.find({'sender.value': userId});
};

/**
 * @summary Search the CommunicationResponses collection for those sent by a specific userId.
 * @memberOf CommunicationResponses
 * @name findCommunicationResponsesSentToUserId
 * @version 1.2.3
 * @returns array of communications
 * @example
 * ```js
 *  let communications = CommunicationResponses.findCommunicationResponsesSentByUserId(Meteor.userId());
 *  let communication = communications[0];
 * ```
 */
CommunicationResponses.findCommunicationResponsesSentToUserId = function (userId) {
  process.env.TRACE && console.log("CommunicationResponses.findCommunicationResponsesSentToUserId()");
  return CommunicationResponses.find({'recipient.value': userId});
};


/**
 * @summary Search the CommunicationResponses collection for a specific Meteor.userId().
 * @memberOf CommunicationResponses
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let communications = CommunicationResponses.findMrn('12345').fetch();
 * ```
 */
CommunicationResponses.findConversation = function (conversationId, sort=1) {
  process.env.TRACE && console.log("CommunicationResponses.findMrn()");  
  return CommunicationResponses.find(
    { 'partOf.identifier.value': conversationId}, 
    { 'sort': { 'received': sort } });
};

/**
 * @summary Search the CommunicationResponses collection for a specific query.
 * @memberOf CommunicationResponses
 */

CommunicationResponses.fetchBundle = function (query, parameters, callback) {
  process.env.TRACE && console.log("CommunicationResponses.fetchBundle()");  
  var communicationArray = CommunicationResponses.find(query, parameters, callback).map(function(communication){
    communication.id = communication._id;
    delete communication._document;
    return communication;
  });

  // console.log("communicationArray", communicationArray);

  var result = Bundle.generate(communicationArray);

  // console.log("result", result.entry[0]);

  return result;
};




// CommunicationResponses.prototype.insertUnique = function(record){
//   console.log('CommunicationResponses.prototype.insertUnique');

//   if(CommunicationResponses.findConversation(record._id)){
//     CommunicationResponses.insert(record)    
//   }
// }

CommunicationResponses.insertUnique = function (record) {
  console.log("CommunicationResponses.insertUnique()");
  console.log("CommunicationResponses.findOne(record._id)", CommunicationResponses.findOne(record._id));

  if(!CommunicationResponses.findOne(record._id)){
    let collectionConfig = {};
    if(Meteor.isClient){
      collectionConfig = { validate: false, filter: false }
    }
    let communicationId = CommunicationResponses.insert(record, collectionConfig);    
    console.log('CommunicationResponse created: ' + communicationId);
    return communicationId;
  }
};


export default { CommunicationResponse, CommunicationResponses, CommunicationResponseR4, CommunicationResponseSchema };