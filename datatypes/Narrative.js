import SimpleSchema from 'simpl-schema';

NarrativeSchema = new SimpleSchema({
  "status" : {
    type: Code,
    optional: true,
    defaultValue: 'additional'
  },
  "div" : {
    type: String,
    optional: true
  }
});



Narrative = {
  create: function(){
    var newNarrative = {

    };

    return newNarrative;
  }
}


export default NarrativeSchema;