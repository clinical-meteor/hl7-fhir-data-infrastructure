import SimpleSchema from 'simpl-schema';
import NarativeSchema from './Narrative';
import BaseSchema from './Base';

DomainResourceSchema = BaseSchema.extend({
  "text" : {
    type: NarativeSchema,
    optional: true
  },
  "contained" : {
    type: Array,
    optional: true
  },
  "contained.$" : {
    type: Object,
    blackbox: true,
    optional: true
  },
  "extension" : {
    type: Array,
    optional: true
  },
  "extension.$" : {
    type: Object,
    blackbox: true,
    optional: true
  },
  "modifierExtension" : {
    optional: true,
    type:  Array
    },
  "modifierExtension.$" : {
    optional: true,
    blackbox: true,
    type:  Object 
    }
});

export default DomainResourceSchema;