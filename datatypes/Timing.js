import SimpleSchema from 'simpl-schema';
import QuantitySchema from './Quantity';
import RangeSchema from './Range';
import PeriodSchema from './Period';
import CodeableConceptSchema from './CodableConcept';
import Code from './Code';

TimingSchema = new SimpleSchema({
  "resourceType": {
    type: String,
    defaultValue: "Timing"
  },
  "event": {
    optional: true,
    type: Array
  },
  "event.$": {
    optional: true,
    type: Date 
  },
  "repeat": {
    optional: true,
    type: Object
  },
  "repeat.boundsQuantity": {
    optional: true,
    type: QuantitySchema
  },
  "repeat.boundsRange": {
    optional: true,
    type: RangeSchema
  },
  "repeat.boundsPeriod": {
    optional: true,
    type: PeriodSchema
  },
  "repeat.count": {
    optional: true,
    type: Number
  },
  "repeat.duration": {
    optional: true,
    type: Number
  },
  "repeat.durationMax": {
    optional: true,
    type: Number
  },
  "repeat.durationUnit": {
    optional: true,
    type: Code
  },
  "repeat.frequency": {
    optional: true,
    type: Number
  },
  "repeat.frequencyMax": {
    optional: true,
    type: Number
  },
  "repeat.period": {
    optional: true,
    type: Number
  },
  "repeat.periodMax": {
    optional: true,
    type: Number
  },
  "repeat.periodUnit": {
    optional: true,
    allowedValues: ['s', 'min', 'h', 'd', 'wk', 'mo', 'a'],
    type: Code
  },
  "repeat.dayOfWeek": {
    optional: true,
    allowedValues: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    type: Code
  },
  "repeat.when": {
    optional: true,
    type: Code
  },
  "repeat.offset": {
    optional: true,
    type: Number
  },
  "code": {
    optional: true,
    type: Array
  }, 
  "code.$": {
    optional: true,
    type: CodeableConceptSchema 
  }   
});

Timing = {
  create: function(){
    var newTiming = {

    };

    return newTiming;
  }
}


export default TimingSchema;