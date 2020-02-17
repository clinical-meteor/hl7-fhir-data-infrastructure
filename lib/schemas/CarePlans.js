import SimpleSchema from 'simpl-schema';

// create the object using our BaseModel
CarePlan = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
CarePlan.prototype._collection = CarePlans;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');

if(typeof CarePlans === 'undefined'){
  if(Package['clinical:autopublish']){
    CarePlans = new Mongo.Collection('CarePlans');
  } else if(Package['clinical:desktop-publish']){
    CarePlans = new Mongo.Collection('CarePlans');
  } else {
    CarePlans = new Mongo.Collection('CarePlans', {connection: null});
  }
}

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
CarePlans._transform = function (document) {
  return new CarePlan(document);
};


// if (Meteor.isClient){
//   Meteor.subscribe("CarePlans");
// }

// if (Meteor.isServer){
//   Meteor.publish("CarePlans", function (argument){
//     if (this.userId) {
//       return CarePlans.find();
//     } else {
//       return [];
//     }
//   });
// }

CarePlanDstu2 = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "CarePlan"
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "subject" : {
    optional: true,
    type: ReferenceSchema
    },
  "status" : {
    type: Code,
    allowedValues: ['proposed', 'draft', 'active', 'completed', 'cancelled']
    },
  "context" : {
    optional: true,
    type: ReferenceSchema
    },
  "period" : {
    optional: true,
    type: PeriodSchema
    },
  "author" : {
    optional: true,
    type: Array
    },
  "author.$" : {
    optional: true,
    type: ReferenceSchema 
    },    
  "modified" : {
    optional: true,
    type: Date
    },
  "category" : {
    optional: true,
    type: Array
    },
  "category.$" : {
    optional: true,
    type: CodeableConceptSchema 
    },
  "description" : {
    optional: true,
    type: String
    },
  "addresses" : {
    optional: true,
    type: Array
    },
  "addresses.$" : {
    optional: true,
    type: ReferenceSchema 
    },    
  "support" : {
    optional: true,
    type: Array
    },    
  "support.$" : {
    optional: true,
    type: ReferenceSchema 
    },    

  "relatedPlan" :  {
    optional: true,
    type: Array
    },
  "relatedPlan.$" :  {
    optional: true,
    type: Object
    },          
  "relatedPlan.$.code" :  {
    optional: true,
    type: Code,
    allowedValues: ['includes', 'replaces', 'fulfills']
    },
  "relatedPlan.$.plan" :  {
    optional: true,
    type: ReferenceSchema
    },
  "participant" :  {
    optional: true,
    type: Array
    },
  "participant.$" :  {
    optional: true,
    type: Object
    },          
  "participant.$.role" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "participant.$.member" :  {
    optional: true,
    type: ReferenceSchema
    },

  "goal" :  {
    optional: true,
    type: Array
    },
  "goal.$" :  {
    optional: true,
    type: ReferenceSchema 
    },

  "activity" :  {
    optional: true,
    type: Array
    },
  "activity.$" :  {
    optional: true,
    type: Object
    },      

  "activity.$.actionResulting" :  {
    optional: true,
    type: Array
    },
  "activity.$.actionResulting.$" :  {
    optional: true,
    type: ReferenceSchema 
    },

  "activity.$.progress" :  {
    optional: true,
    type: Array
    },
  "activity.$.progress.$" :  {
    optional: true,
    type: AnnotationSchema 
    },    
  "activity.$.reference" :  {
    optional: true,
    type: ReferenceSchema
    },

  "activity.$.detail" :  {
    optional: true,
    type: Object
    },

  "activity.$.detail.category" :  {
    optional: true,
    type: CodeableConceptSchema,
    allowedValues: ['diet', 'drug', 'encounter', 'observation', 'procedure', 'supply', 'other']
    },
  "activity.$.detail.code" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.reasonCode" :  {
    optional: true,
    type: Array
    },
  "activity.$.detail.reasonCode.$" :  {
    optional: true,
    type: CodeableConceptSchema 
    },

  "activity.$.detail.reasonReference" :  {
    optional: true,
    type: Array
    },
  "activity.$.detail.reasonReference.$" :  {
    optional: true,
    type: ReferenceSchema 
    },

  "activity.$.detail.goal" :  {
    optional: true,
    type: Array
    },
  "activity.$.detail.goal.$" :  {
    optional: true,
    type: ReferenceSchema 
    },

  "activity.$.detail.status" :  {
    optional: true,
    type: Code,
    allowedValues: ['not-started', 'scheduled', 'in-progress', 'on-hold', 'completed', 'cancelled']
    },
  "activity.$.detail.statusReason" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.prohibited" :  {
    type: Boolean,
    defaultValue: false
    },
  "activity.$.detail.scheduledTiming" :  {
    optional: true,
    type: TimingSchema
    },
  "activity.$.detail.scheduledPeriod" :  {
    optional: true,
    type: PeriodSchema
    },
  "activity.$.detail.scheduledString" :  {
    optional: true,
    type: String
    },
  "activity.$.detail.location" :  {
    optional: true,
    type: ReferenceSchema
    },
  "activity.$.detail.performer" : {
    optional: true,
    type:  Array
    },
  "activity.$.detail.performer.$" : {
    optional: true,
    type:  ReferenceSchema 
    },    
  "activity.$.detail.productCodeableConcept" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.productReference" :  {
    optional: true,
    type: ReferenceSchema
    },
  "activity.$.detail.dailyAmount" :  {
    optional: true,
    type: QuantitySchema
    },
  "activity.$.detail.quantity" :  {
    optional: true,
    type: QuantitySchema
    },
  "activity.$.detail.description" :  {
    optional: true,
    type: String
    },
  "note" :  {
    optional: true,
    type: AnnotationSchema
    }
});





CarePlanStu3 = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "CarePlan"
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
  "basedOn" :  {
    optional: true,
    type: ReferenceSchema
    },
  "replaces" :  {
    optional: true,
    type: ReferenceSchema
    },
  "partOf" :  {
    optional: true,
    type: ReferenceSchema
    },
  "status" : {
    type: Code,
    allowedValues: ['draft', 'active', 'suspended', 'completed', 'entered-in-error', 'cancelled', 'unknown']
    },
  "intent" : {
    type: Code,
    allowedValues: ['proposal', 'plan', 'order', 'option']
    },
  "category" : {
    optional: true,
    type: Array
    },
  "category.$" : {
    optional: true,
    type: CodeableConceptSchema 
    },
  "title" : {
    optional: true,
    type: String
    },
  "description" : {
    optional: true,
    type: String
    },
    
  "subject" : {
    optional: true,
    type: ReferenceSchema
    },
  "context" : {
    optional: true,
    type: ReferenceSchema
    },
  "period" : {
    optional: true,
    type: PeriodSchema
    },
  "author" : {
    optional: true,
    type: Array
    },
  "author.$" : {
    optional: true,
    type: ReferenceSchema 
    },  
   
  "careTEam" : {
    optional: true,
    type: ReferenceSchema
    },

  "addresses" : {
    optional: true,
    type: Array
    },
  "addresses.$" : {
    optional: true,
    type: ReferenceSchema 
    },    
  "supportingInfo" : {
    optional: true,
    type: Array
    },    
  "supportingInfo.$" : {
    optional: true,
    type: ReferenceSchema 
    },    

  "goal" :  {
    optional: true,
    type: Array
    },
  "goal.$" :  {
    optional: true,
    type: ReferenceSchema 
    },

  "activity" :  {
    optional: true,
    type: Array
    },
  "activity.$" :  {
    optional: true,
    type: Object
    },      
  "activity.$.outcomeCodeableConcept" :  {
    optional: true,
    type: Array
    },
  "activity.$.outcomeCodeableConcept.$" :  {
    optional: true,
    type: CodeableConceptSchema 
    },
  "activity.$.outcomeReference" :  {
    optional: true,
    type: Array
    },
  "activity.$.outcomeReference.$" :  {
    optional: true,
    type: ReferenceSchema 
    },

  "activity.$.progress" :  {
    optional: true,
    type: Array
    },
  "activity.$.progress.$" :  {
    optional: true,
    type: AnnotationSchema 
    },    
  "activity.$.reference" :  {
    optional: true,
    type: ReferenceSchema
    },

  "activity.$.detail" :  {
    optional: true,
    type: Object
    },

  "activity.$.detail.category" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.definition" :  {
    optional: true,
    type: ReferenceSchema
    },    
  "activity.$.detail.code" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.reasonCode" :  {
    optional: true,
    type: Array
    },
  "activity.$.detail.reasonCode.$" :  {
    optional: true,
    type: CodeableConceptSchema 
    },

  "activity.$.detail.reasonReference" :  {
    optional: true,
    type: Array
    },
  "activity.$.detail.reasonReference.$" :  {
    optional: true,
    type: ReferenceSchema 
    },

  "activity.$.detail.goal" :  {
    optional: true,
    type: Array
    },
  "activity.$.detail.goal.$" :  {
    optional: true,
    type: ReferenceSchema 
    },

  "activity.$.detail.status" :  {
    type: Code,
    allowedValues: ['not-started', 'scheduled', 'in-progress', 'on-hold', 'completed', 'cancelled', 'unknown']
    },
  "activity.$.detail.statusReason" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.prohibited" :  {
    type: Boolean,
    defaultValue: false
    },
  "activity.$.detail.scheduledTiming" :  {
    optional: true,
    type: TimingSchema
    },
  "activity.$.detail.scheduledPeriod" :  {
    optional: true,
    type: PeriodSchema
    },
  "activity.$.detail.scheduledString" :  {
    optional: true,
    type: String
    },
  "activity.$.detail.location" :  {
    optional: true,
    type: ReferenceSchema
    },
  "activity.$.detail.performer" : {
    optional: true,
    type:  Array
    },
  "activity.$.detail.performer.$" : {
    optional: true,
    type:  ReferenceSchema 
    },    
  "activity.$.detail.productCodeableConcept" :  {
    optional: true,
    type: CodeableConceptSchema
    },
  "activity.$.detail.productReference" :  {
    optional: true,
    type: ReferenceSchema
    },
  "activity.$.detail.dailyAmount" :  {
    optional: true,
    type: QuantitySchema
    },
  "activity.$.detail.quantity" :  {
    optional: true,
    type: QuantitySchema
    },
  "activity.$.detail.description" :  {
    optional: true,
    type: String
    },
  "note" :  {
    optional: true,
    type: AnnotationSchema
    }
});

CarePlanSchema = CarePlanStu3

BaseSchema.extend(CarePlanSchema);
DomainResourceSchema.extend(CarePlanSchema);
CarePlans.attachSchema(CarePlanSchema);

export default { CarePlan, CarePlans, CarePlanSchema, CarePlanStu3, CarePlanDstu2 };