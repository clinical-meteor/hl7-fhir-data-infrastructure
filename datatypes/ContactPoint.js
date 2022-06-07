import SimpleSchema from 'simpl-schema';
import PeriodSchema from './Period';

ContactPointSchema = new SimpleSchema({
  "system" : {
    optional: true,
    type: Code
    },
  "value" : {
    optional: true,
    type: String
    },
  "use" : {
    optional: true,
    type: Code
    },
  "rank" : {
    optional: true,
    type: Number // PositiveInt
    },
  "period" : {
    optional: true,
    type: PeriodSchema
    }
});




ContactPoint = {
  create: function(){
    var newContactPoint = {

    };

    return newContactPoint;
  }
}



export default ContactPointSchema;