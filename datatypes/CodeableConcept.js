import SimpleSchema from 'simpl-schema';
import CodingSchema from './Coding';

CodeableConceptSchema = new SimpleSchema({
  "coding" : {
    optional: true,
    type: Array
  },
  "coding.$" : {
    optional: true,
    type: CodingSchema 
  },  
  "text" : {
    optional: true,
    type: String
  }
});


CodeableConcept = {
  create: function(text){
    var newCodeableConcept = {
      text: ''
    };

    if (text) {
      newCodeableConcept.text = text;
    }

    return newCodeableConcept;
  }
};

export default CodeableConceptSchema;