import SimpleSchema from 'simpl-schema';
import CodingSchema from './Coding';
import CodeableConceptSchema from './CodeableConcept';
import ReferenceSchema from './Reference';

CodeableReferenceSchema = new SimpleSchema({
  "concept" : {
    optional: true,
    type: CodeableConceptSchema 
  },  
  "reference" : {
    optional: true,
    type: ReferenceSchema
  }
});


// CodeableReference = {
//   create: function(text){
//     var newCodeableReference = {
//       text: ''
//     };

//     if (text) {
//       newCodeableReference.text = text;
//     }

//     return newCodeableReference;
//   }
// };

export default CodeableReferenceSchema;