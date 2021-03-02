import SimpleSchema from 'simpl-schema';
import ReferenceSchema from './Reference';

Annotation = {
  create: function(authorString, text){
    var newAnnotation = {
      authorString: '',
      time: new Date(),
      text: ''
    };

    if (authorString) {
      newAnnotation.authorString = authorString;
    }
    if (text) {
      newAnnotation.text = text;
    }

    return newAnnotation;
  }
}


AnnotationSchema = new SimpleSchema({
  "authorReference" : {
    type: ReferenceSchema,
    optional: true
    },
  "authorString" : {
    type: String,
    optional: true
    },
  "time" : {
    type: Date,
    optional: true
    },
  "text" : {
    type: String,
    optional: true
    }
});

export default AnnotationSchema;