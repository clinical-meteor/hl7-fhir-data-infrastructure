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
Endpoint = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Endpoint.prototype._collection = Endpoints;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Endpoints = new Mongo.Collection('HL7.Resources.Endpoints');

if(typeof Endpoints === 'undefined'){
  Endpoints = new Mongo.Collection('Endpoints');

  // if(Package['autopublish']){
  //   Endpoints = new Mongo.Collection('Endpoints');
  // } else if(Package['clinical:autopublish']){    
  //   Endpoints = new Mongo.Collection('Endpoints');
  // } else if(Package['clinical:desktop-publish']){    
  //   Endpoints = new Mongo.Collection('Endpoints');
  // } else {
  //   Endpoints = new Mongo.Collection('Endpoints', {connection: null});
  // }
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Endpoints._transform = function (document) {
  return new Endpoint(document);
};

EndpointSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Endpoint"
  },
  "id" : {
    optional: true,
    type:  String 
    },
  "_id" : {
    optional: true,
    type:  String 
    },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "status" : {
    optional: true,
    type: String
  }, 
  "connectionType" : {
    optional: true,
    type: CodingSchema 
  }, 
  "name" : {
    optional: true,
    type: String
  }, 
  "managingOrganization" : {
    optional: true,
    type: ReferenceSchema
  }, 
  "contact" : {
    optional: true,
    type: Array
  }, 
  "contact.$" : {
    optional: true,
    type: ContactPointSchema 
  }, 
  "period" : {
    optional: true,
    type: PeriodSchema 
  }, 
  "payloadType" : {
    optional: true,
    type: Array
  }, 
  "payloadType.$" : {
    optional: true,
    type: CodeableConceptSchema 
  }, 
  "payloadMimeType" : {
    optional: true,
    type: Array
  }, 
  "payloadMimeType.$" : {
    optional: true,
    type: String 
  }, 
  "address" : {
    optional: true,
    type: String
  }, 
  "header" : {
    optional: true,
    type: Array
  },
  "header.$" : {
    optional: true,
    type: String 
  }

});

BaseSchema.extend(EndpointSchema);
DomainResourceSchema.extend(EndpointSchema);

Endpoints.attachSchema(EndpointSchema);

export default { Endpoint, Endpoints, EndpointSchema };