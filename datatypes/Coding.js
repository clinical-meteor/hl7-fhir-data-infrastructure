import SimpleSchema from 'simpl-schema';

CodingSchema = new SimpleSchema({
  "system" : {
    optional: true,
    type: String
  },
  "code" : {
    optional: true,
    type: String
  },
  "version" : {
    optional: true,
    type: String
  },
  "display" : {
    optional: true,
    type: String
  },
  "userSelected" : {
    optional: true,
    type: Boolean
  }
});



Coding = {
  create: function(){
    var newCoding = {

    };

    return newCoding;
  }
}

export default CodingSchema;