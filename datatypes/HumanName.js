import SimpleSchema from 'simpl-schema';
import PeriodSchema from './Period';

HumanNameSchema = new SimpleSchema({
  "use" : {
    optional: true,
    type: Code
    },
  "text" : {
    optional: true,
    type: String
    },
  "family" : {
    optional: true,
    type: String
    },
  "given" : {
    optional: true,
    type: Array
    },
  "given.$" : {
    optional: true,
    type: String
    },
  "prefix" : {
    optional: true,
    type: Array
    },
  "prefix.$" : {
    optional: true,
    type: String
    },
  "suffix" : {
    optional: true,
    type: Array
    },
  "suffix.$" : {
    optional: true,
    type: String
    },    
  "preferred" : {
    optional: true,
    type: Array
    },
  "preferred.$" : {
    optional: true,
    type: String
    },    
  "period" : {
    optional: true,
    type: PeriodSchema
    }
});




HumanName = {
  generate: function(){
    var newHumanName = {
      use: "official",
      text: "",
      family: [],
      given: []
    };
    return newHumanName;
  },
  clean: function(userName){
    if (userName) {

      HumanNameSchema.clean(userName);

      if (typeof userName.family === "string") {
        userName.family = [ userName.family ];
      } else {
        userName.family = userName.family;
      }
      if (typeof userName.given === "string") {
        userName.given = [ userName.given ];
      } else {
        userName.given = userName.given;
      }

    } else {
      userName = this.generate();
    }
  }
}


export default HumanNameSchema;