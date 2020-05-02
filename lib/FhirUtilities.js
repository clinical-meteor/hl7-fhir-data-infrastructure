import { get, has } from 'lodash';

FhirUtilities = {
  pluckReferenceId(reference){
    let identifier = ""
    let referenceParts = [];
    if(reference){
      // guard against empty strings
      if(reference.includes("/")){

        // split the string apart according to slashes
        referenceParts = reference.split("/");

        // get the last part of the string
        identifier = referenceParts[referenceParts.length - 1];  
      }
    }
    return identifier;
  },
  stringifyAddress(address){  
    // var assembledAddress = "3928 W. Cornelia Ave, Chicago, IL";
    let assembledAddress = '';
    if(get(address, 'line[0]')){
      assembledAddress = get(address, 'line[0]');
    }
    if(get(address, 'city')){
      assembledAddress = assembledAddress + ', ' + get(address, 'city');
    }
    if(get(address, 'state')){
      assembledAddress = assembledAddress + ', ' + get(address, 'state');
    }
    if(get(address, 'postalCode')){
      assembledAddress = assembledAddress + ', ' + get(address, 'postalCode');
    }
    if(get(address, 'country')){
      assembledAddress = assembledAddress + ', ' + get(address, 'country');
    }
  
    return assembledAddress;
  },
  assembleName(humanName, options){
    // patient name has gone through a number of revisions, and we need to search a few different spots, and assemble as necessary  
    let resultingNameString = "";

    let nameText = get(humanName, 'text', '');
    if(nameText.length > 0){
      // some systems will store the name as it is to be displayed in the text field
      // if that's present, use it
      resultingNameString = get(humanName, 'text', '');    
    } else {
      // the majority of systems out there are SQL based and make a design choice to store as 'first' and 'last' name
      // critiques of that approach can be saved for a later time
      // but suffice it to say that we need to assemble the parts

      if(!get(options, 'noPrefix')){
        if(get(humanName, 'prefix[0]')){
          resultingNameString = get(humanName, 'prefix[0]')  + ' ';
        }  
      }

      if(get(humanName, 'given[0]')){
        resultingNameString = resultingNameString + get(humanName, 'given[0]')  + ' ';
      }

      if(get(humanName, 'family')){
        // R4 - droped the array of family names; one authoritative family name per humanName
        resultingNameString = resultingNameString + get(humanName, 'family')  + ' ';
      } else if (get(humanName, 'family[0]')){
        // DSTU2 and STU3 - allows an array of family names
        resultingNameString = resultingNameString + get(humanName, 'family[0]')  + ' ';
      }
      
      if(get(humanName, 'suffix[0]')){
        resultingNameString = resultingNameString + ' ' + get(humanName, 'suffix[0]');
      }
    }

    // remove any whitespace from the name
    return resultingNameString.trim();
  },
  pluckName(fhirPatientResource, options){

    if(!options) {
      options = {};
    }

    // we assume the first listed name by default (>95% of the use cases)
    let selectedIndex = 0;
    let resultingNameString = "";

    // assuming the data isnt anonymized
    if(Array.isArray(get(fhirPatientResource, 'name'))){
      
      // we should parse through the available names
      fhirPatientResource.name.forEach(function(name, index){

        // to see if any of them are marked official
        if(get(name, 'use') === "official"){
          selectedIndex = index;
        }
      })

      // assemble the name from the first listed name or whatever is marked official
      resultingNameString = FhirUtilities.assembleName(fhirPatientResource.name[selectedIndex], options)
    }


    // remove any whitespace from the name
    return resultingNameString.trim();
  },
  pluckPhone(telecomArray){
    let result = "";
    if(Array.isArray(telecomArray)){
      telecomArray.forEach(function(telecomRecord){
        if(get(telecomRecord, 'system') === 'phone'){
          result = get(telecomRecord, 'value');
        }
      })  
    }
    return result;
  },
  pluckEmail(telecomArray){
    let result = "";
    if(Array.isArray(telecomArray)){
      telecomArray.forEach(function(telecomRecord){
        if(get(telecomRecord, 'system') === 'email'){
          result.email = get(telecomRecord, 'value');
        }
      })  
    }
    return result;
  },
  generateDateQuery(chainPrefix, startDate, endDate ){
    let dateQuery = '';

    if(chainPrefix){
      dateQuery = chainPrefix;
    }
    if(startDate){
      dateQuery = dateQuery + 'date=gt' + startDate
    }
    if(startDate && endDate){
      dateQuery = dateQuery + '&';
    }
    if(chainPrefix){
      dateQuery = dateQuery + chainPrefix;
    }

    if(endDate){
      dateQuery = dateQuery + 'date=lt' + endDate
    }
    if(startDate || endDate){
      dateQuery = dateQuery;
    }
 
    return dateQuery;
  },
  pluralizeResourceName(resourceType){
    let pluralized = '';
    switch (resourceType) {
      case 'Binary':          
        pluralized = 'Binaries';
        break;
      case 'Library':      
        pluralized = 'Libraries';
        break;
      case 'SupplyDelivery':      
        pluralized = 'SupplyDeliveries';
        break;
      case 'ImagingStudy':      
        pluralized = 'ImagingStudies';
        break;        
      case 'FamilyMemberHistory':      
        pluralized = 'FamilyMemberHistories';
        break;        
      case 'ResearchStudy':      
        pluralized = 'ResearchStudies';
        break;        
      default:
        pluralized = resourceType + 's';
        break;
    }

    return pluralized;
  },
  parseCapabilityStatement(capabilityStatement, canSearch){
    console.log('FhirUtilities.parseCapabilityStatement.', capabilityStatement)
    if(!canSearch){
      canSearch = {};
    }
    if(["CapabilityStatement", "Conformance"].includes(get(capabilityStatement, 'resourceType')) ){
      console.log('Found CapabilityStatement');
      if(get(capabilityStatement, 'rest[0].mode') === "server"){
        console.log('CapabilityStatement claims it is a server.');
        if(Array.isArray(get(capabilityStatement, 'rest[0].resource'))){
          let resourceArray = get(capabilityStatement, 'rest[0].resource');
          console.log('Loading resource array from CapabilityStatement.');

          if(Array.isArray(resourceArray)){
            resourceArray.forEach(function(resource){
              let resourceType = get(resource, 'type');
              canSearch[resourceType] = false;

              let interactionArray = get(resource, 'interaction');
              if(Array.isArray(interactionArray)){
                interactionArray.forEach(function(interaction){
                  if(get(interaction, 'code') === "read"){
                    canSearch[resourceType] = true;
                  }   
                })  
              }
            })  
          }
        }
      }
    }
    console.log("Generated the following ehrServerCapabilities object:", canSearch);
    return canSearch;
  }
}

export default FhirUtilities;