import { get } from 'lodash';
import validator from 'validator';

import BaseModel from '../BaseModel';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { BaseSchema, DomainResourceSchema, HumanNameSchema, IdentifierSchema, ContactPointSchema, AddressSchema, ReferenceSchema, SignatureSchema } from 'meteor/clinical:hl7-resource-datatypes';



// create the object using our BaseModel
Subscription = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Subscription.prototype._collection = Subscriptions;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Subscriptions = new Mongo.Collection('HL7.Resources.Subscriptions');

if(typeof Subscriptions === 'undefined'){
  Subscriptions = new Mongo.Collection('Subscriptions');
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Subscriptions._transform = function (document) {
  return new Subscription(document);
};

SubscriptionSchema = DomainResourceSchema.extend({
  "resourceType" : {
    type: String,
    defaultValue: "Subscription"
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
  "status" : {
    optional: true,
    type: String
  }, 
  "contact": {
    optional: true,
    type: Array
  },
  "contact.$": {
    optional: true,
    type: ContactPointSchema
  },
  "end": {
    optional: true,
    type: Date
  },
  "reason": {
    optional: true,
    type: String
  },
  "criteria": {
    optional: true,
    type: String
  },
  "error": {
    optional: true,
    type: String
  },
  "channel": {
    optional: true,
    type: Object
  },
  "channel.type": {
    optional: true,
    type: String
  },
  "channel.endpoint": {
    optional: true,
    type: String
  },
  "channel.payload": {
    optional: true,
    type: String
  },
  "channel.header": {
    optional: true,
    type: String
  }
});

Subscriptions.attachSchema(SubscriptionSchema);


export default { Subscription, Subscriptions, SubscriptionSchema };