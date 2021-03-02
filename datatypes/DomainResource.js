import SimpleSchema from 'simpl-schema';

DomainResourceSchema = new SimpleSchema({
  "text" : {
    type: Object,
    optional: true
  },
  "text.status" : {
    type: Code,
    optional: true,
    defaultValue: 'additional'
  },
  "text.div" : {
    type: String,
    optional: true
  },
  "contained" : {
    type: Object,
    optional: true
  },
  "extension" : {
    type: Array,
    optional: true
  },
  "extension.$" : {
    type: Object,
    optional: true
  }
});

export default DomainResourceSchema;