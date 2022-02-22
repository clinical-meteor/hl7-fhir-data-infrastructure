import SimpleSchema from 'simpl-schema';

OperationOutcomeSchema = new SimpleSchema({
  "_id" : {
    type: String,
    optional: true
  },
  "id" : {
    type: String,
    optional: true
  },
  "meta" : {
    type: Object,
    optional: true,
    blackbox: true
  },
  "resourceType" : {
    type: String,
    defaultValue: "OperationOutcome"
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
  "issue" : {
    optional: true,
    type:  Array
    },
  "issue.$" : {
    optional: true,
    blackbox: true,
    type:  Object 
  },
  "issue.$.severity" : {
    optional: true,
    allowedValues: ["fatal", "error", "warning", "information"],
    type:  String 
  },
  "issue.$.code" : {
    optional: true,
    type:  String 
  },
  "issue.$.details" : {
    optional: true,
    blackbox: true,
    type:  Object
  },
  "issue.$.diagnostics" : {
    optional: true,
    type:  String 
  },
  "issue.$.location" : {
    optional: true,
    type:  Array 
  },
  "issue.$.location.$" : {
    optional: true,
    type:  String 
  },
  "issue.$.expression" : {
    optional: true,
    type:  Array 
  },
  "issue.$.expression.$" : {
    optional: true,
    type:  String 
  }
});

export default OperationOutcomeSchema;