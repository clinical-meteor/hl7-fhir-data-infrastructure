import SimpleSchema from 'simpl-schema';

// if(Package['clinical:autopublish']){
//   console.log("*****************************************************************************")
//   console.log("HIPAA WARNING:  Your app has the 'clinical-autopublish' package installed.");
//   console.log("Any protected health information (PHI) stored in this app should be audited."); 
//   console.log("Please consider writing secure publish/subscribe functions and uninstalling.");  
//   console.log("");  
//   console.log("meteor remove clinical:autopublish");  
//   console.log("");  
// }
// if(Package['autopublish']){
//   console.log("*****************************************************************************")
//   console.log("HIPAA WARNING:  DO NOT STORE PROTECTED HEALTH INFORMATION IN THIS APP. ");  
//   console.log("Your application has the 'autopublish' package installed.  Please uninstall.");
//   console.log("");  
//   console.log("meteor remove autopublish");  
//   console.log("meteor add clinical:autopublish");  
//   console.log("");  
// }



// create the object using our BaseModel
CommunicationRequest = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
CommunicationRequest.prototype._collection = CommunicationRequests;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.CommunicationRequests = new Mongo.Collection('HL7.Resources.CommunicationRequests');
if(typeof CommunicationRequests === 'undefined'){
  // if(Package['clinical:autopublish']){
  //   CommunicationRequests = new Mongo.Collection('CommunicationRequests');
  // } else if(Package['clinical:desktop-publish']){
  //   CommunicationRequests = new Mongo.Collection('CommunicationRequests');
  // } else {
  //   CommunicationRequests = new Mongo.Collection('CommunicationRequests', {connection: null});
  // }
  CommunicationRequests = new Mongo.Collection('CommunicationRequests');
}

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
CommunicationRequests._transform = function (document) {
  return new CommunicationRequest(document);
};







CommunicationRequestR4 = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "CommunicationRequest"
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
});


CommunicationRequestSchema = CommunicationRequestR4;

BaseSchema.extend(CommunicationRequestR4);
DomainResourceSchema.extend(CommunicationRequestR4);

CommunicationRequests.attachSchema(CommunicationRequestR4);


CommunicationRequest.prototype.toFhir = function(){
  console.log('CommunicationRequest.toFhir()');

  return EJSON.stringify(this.name);
}

/**
 * @summary Search the CommunicationRequests collection for those sent by a specific userId.
 * @memberOf CommunicationRequests
 * @name findCommunicationRequestsSentByUserId
 * @version 1.2.3
 * @returns array of communications
 * @example
 * ```js
 *  let communications = CommunicationRequests.findCommunicationRequestsSentByUserId(Meteor.userId());
 *  let communication = communications[0];
 * ```
 */

CommunicationRequests.findCommunicationRequestsSentByUserId = function (userId) {
  process.env.TRACE && console.log("CommunicationRequests.findCommunicationRequestsSentByUserId()");
  return CommunicationRequests.find({'sender.value': userId});
};

/**
 * @summary Search the CommunicationRequests collection for those sent by a specific userId.
 * @memberOf CommunicationRequests
 * @name findCommunicationRequestsSentToUserId
 * @version 1.2.3
 * @returns array of communications
 * @example
 * ```js
 *  let communications = CommunicationRequests.findCommunicationRequestsSentByUserId(Meteor.userId());
 *  let communication = communications[0];
 * ```
 */
CommunicationRequests.findCommunicationRequestsSentToUserId = function (userId) {
  process.env.TRACE && console.log("CommunicationRequests.findCommunicationRequestsSentToUserId()");
  return CommunicationRequests.find({'recipient.value': userId});
};


/**
 * @summary Search the CommunicationRequests collection for a specific Meteor.userId().
 * @memberOf CommunicationRequests
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let communications = CommunicationRequests.findMrn('12345').fetch();
 * ```
 */
CommunicationRequests.findConversation = function (conversationId, sort=1) {
  process.env.TRACE && console.log("CommunicationRequests.findMrn()");  
  return CommunicationRequests.find(
    { 'partOf.identifier.value': conversationId}, 
    { 'sort': { 'received': sort } });
};

/**
 * @summary Search the CommunicationRequests collection for a specific query.
 * @memberOf CommunicationRequests
 */

CommunicationRequests.fetchBundle = function (query, parameters, callback) {
  process.env.TRACE && console.log("CommunicationRequests.fetchBundle()");  
  var communicationArray = CommunicationRequests.find(query, parameters, callback).map(function(communication){
    communication.id = communication._id;
    delete communication._document;
    return communication;
  });

  // console.log("communicationArray", communicationArray);

  var result = Bundle.generate(communicationArray);

  // console.log("result", result.entry[0]);

  return result;
};




// CommunicationRequests.prototype.insertUnique = function(record){
//   console.log('CommunicationRequests.prototype.insertUnique');

//   if(CommunicationRequests.findConversation(record._id)){
//     CommunicationRequests.insert(record)    
//   }
// }

CommunicationRequests.insertUnique = function (record) {
  console.log("CommunicationRequests.insertUnique()");
  console.log("CommunicationRequests.findOne(record._id)", CommunicationRequests.findOne(record._id));

  if(!CommunicationRequests.findOne(record._id)){
    let collectionConfig = {};
    if(Meteor.isClient){
      collectionConfig = { validate: false, filter: false }
    }
    let communicationId = CommunicationRequests.insert(record, collectionConfig);    
    console.log('CommunicationRequest created: ' + communicationId);
    return communicationId;
  }
};


export { CommunicationRequest, CommunicationRequests, CommunicationRequestStu3, CommunicationRequestR4, CommunicationRequestSchema };