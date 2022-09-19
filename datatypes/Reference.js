import SimpleSchema from 'simpl-schema';

ReferenceSchema = new SimpleSchema({
  "reference" : {
    optional: true,
    type: String
  },
  "type" : {
    optional: true,
    type: String
  },
  "identifier" : {
    optional: true,
    type: Object
  },
  "identifier.use" : {
    optional: true,
    type: String
  },
  "identifier.system" : {
    optional: true,
    type: String
  },
  "identifier.value" : {
    optional: true,
    type: String
  },
  "identifier.type" : {
    optional: true,
    blackbox: true,
    type: Object
  },
  "display" : {
    optional: true,
    type: String
  }
});

export default ReferenceSchema;