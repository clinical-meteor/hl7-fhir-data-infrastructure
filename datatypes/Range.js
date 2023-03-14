import SimpleSchema from 'simpl-schema';
import QuantitySchema from './Quantity';

RangeSchema = new SimpleSchema({
  "low" : {
    type: QuantitySchema
    },
  "high" : {
    type: QuantitySchema
    }
});



Range = {
  create: function(){
    var newRange = {

    };

    return newRange;
  }
}


export default RangeSchema;