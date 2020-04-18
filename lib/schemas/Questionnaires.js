import { BaseModel } from 'meteor/clinical:base-model';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { BaseSchema, DomainResourceSchema, HumanNameSchema, IdentifierSchema, ContactPointSchema, AddressSchema, ReferenceSchema, SignatureSchema } from 'meteor/clinical:hl7-resource-datatypes';


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






// create the object using our BaseModel
Questionnaire = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
Questionnaire.prototype._collection = Questionnaires;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof Questionnaires === 'undefined'){
  // if(Package['autopublish']){
  //   Questionnaires = new Mongo.Collection('Questionnaires');
  // } else if(Package['clinical:autopublish']){    
  //   Questionnaires = new Mongo.Collection('Questionnaires');
  // } else if(Package['clinical:desktop-publish']){    
  //   Questionnaires = new Mongo.Collection('Questionnaires');
  // } else {
  //   Questionnaires = new Mongo.Collection('Questionnaires', {connection: null});
  // }
  Questionnaires = new Mongo.Collection('Questionnaires');
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Questionnaires._transform = function (document) {
  return new Questionnaire(document);
};



QuestionnaireSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Questionnaire"
    },
  "_id" : {
    optional: true,
    type: String
    },

  "id" : {
    optional: true,
    type: String
    },
  "text" : {
      optional: true,
      type: Object,
      blackbox: true
      },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "version" : {
    optional: true,
    type: String
    },
  "status" : {
    optional: true,
    type: String
    },
  "title" : {
    optional: true,
    type: String
    },
  "date" : {
    optional: true,
    type: Date
    },
  "publisher" : {
    optional: true,
    type: String
    },
  "telecom" : {
    optional: true,
    type: Array
    },
  "telecom.$" : {
    optional: true,
    type: ContactPointSchema 
    },
  "subjectType" : {
    optional: true,
    type: Array
    },
  "subjectType.$" : {
    optional: true,
    type: String 
    },
  "item" : {
    optional: true,
    type: Array
    },
  "item.$" : {
    optional: true,
    type: Object,
    blackbox: true
    },
  "item.$.linkId" : {
    optional: true,
    type: String 
    },
  "item.$.description" : {
    optional: true,
    type: String 
    },
  "item.$.text" : {
    optional: true,
    type: String 
    },
  "item.$.type" : {
    optional: true,
    type: String 
    },
  "item.$.enableWhen" : {
    optional: true,
    type: Array 
    },
  "item.$.enableWhen.$" : {
    optional: true,
    blackbox: true,
    type: Object 
    },
  "item.$.required" : {
    optional: true,
    type: Boolean 
    },
  "item.$.readOnly" : {
    optional: true,
    type: Boolean 
    },
  "item.$.maxLength" : {
      optional: true,
      type: Number 
      },
  "item.$.answerOption" : {
    optional: true,
    type: Array 
    },
  "item.$.answerOption.$" : {
    optional: true,
    blackbox: true,
    type: Object 
    },  
  "item.$.initial" : {
    optional: true,
    type: Array 
    },
  "item.$.initial.$" : {
    optional: true,
    blackbox: true,
    type: Object 
    },      
  "group" : {
    blackbox: true,
    optional: true,
    type: GroupSchema
    }
});

// BaseSchema.extend(QuestionnaireSchema);
// DomainResourceSchema.extend(QuestionnaireSchema);

// Questionnaires.attachSchema(QuestionnaireSchema);


Questionnaires.insertUnique = function (record) {
  console.log("Questionnaires.insertUnique()");
  console.log("Questionnaires.findOne(record._id)", Questionnaires.findOne(record._id));
  if(!Questionnaires.findOne(record._id)){
    let collectionConfig = {};
    if(Meteor.isClient){
      collectionConfig = { validate: false, filter: false }
    }
    let questionnaireId = Questionnaires.insert(record, collectionConfig);    
    console.log('Questionnaire created: ' + questionnaireId);
    return questionnaireId;
  }
};



export { Questionnaire, Questionnaires, QuestionnaireSchema };