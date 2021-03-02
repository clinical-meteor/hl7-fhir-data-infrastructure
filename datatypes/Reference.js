import SimpleSchema from 'simpl-schema';

ReferenceSchema = new SimpleSchema({
  "reference" : {
    optional: true,
    type: String
  },
  "display" : {
    optional: true,
    type: String
  }
});

export default ReferenceSchema;