import { get } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

if(Meteor.isServer){
    Meteor.publish('medications', function(){
        return Medications.find();
    });    
}


createSubstance = function(newSubstance, fhirVersion){
    // check(newSubstance, Object);
    // check(fhirVersion, String);

    process.env.NODE_ENV === "logging" && console.log('newSubstance', newSubstance);

    if (!Substances.findOne({'code.text': newSubstance.code.text})) {
        let collectionConfig = {};
        if(Meteor.isClient){
            collectionConfig = { filter: false, validate: false }
        }
        return Substances.insert(newSubstance, collectionConfig);
    }
}


Meteor.methods({
    'Medication/create':function(medicationObject, fhirVersion){
        check(medicationObject, Object);
        check(fhirVersion, String);

        if (process.env.NIGHTWATCH || this.userId) {
            console.log('medicationObject', medicationObject);

            if (Medications.find({'code.text': medicationObject.code.text}).count() === 0) {
                return Medications._collection.insert(medicationObject, function(error, result){
                if (error) {
                    console.log(error);
                }
                if (result) {
                    console.log('Medication created: ' + result);
                }
                });
            }    
        } else {

        }

    },
    'Substances/initialize':function(){
        console.log('Substances/initialize');

        //==========================================================================
        //==========================================================================
        // SUBSTANCES

        var Loratadine = {
            'resourceType': 'Substance',
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            'code': {
                'text': 'Loratadine'
            },
            'description': 'Antihistimine'
        }
        let loratadineId = createSubstance(Loratadine, '3.0.1')
        console.log('Substance created: ', loratadineId);

        var Ibuprofen = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Ibuprofen"
            },
            "description" : "Pain reliever / fever reducer"
        }
        let ibuprofenId = createSubstance(Ibuprofen, '3.0.1');
        console.log('Substance created: ', ibuprofenId);

        var Cetinizine = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Cetinizine HCl"
            },
            "description" : "Antihistamine"
        }
        let cetinizineId = createSubstance(Cetinizine, '3.0.1');
        console.log('Substance created: ', cetinizineId);

        var Camphor = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Camphor"
            },
            "description" : "Antihistamine"
        }
        let camphorId = createSubstance(Camphor, '3.0.1');
        console.log('Substance created: ', camphorId);

        var Menthol = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Menthol, natural"
            },
            "description" : "Topical analgesic"
        }
        let mentholId = createSubstance(Menthol, '3.0.1');
        console.log('Substance created: ', mentholId);

        var HydrogenPeroxideStabalized = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Hydrogen peroxide (stabilized)"
            },
            "description" : "First aid antiseptic, Oral deriding agent"
        }
        let hydrogenPeroxideStabalizedId = createSubstance(HydrogenPeroxideStabalized, '3.0.1')
        console.log('Substance created: ', hydrogenPeroxideStabalizedId);

        var Aloe = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Aloe barbadensis leaf tract"
            },
            "description" : "Analgesic"
        }
        let aloeId = createSubstance(Aloe, '3.0.1')
        console.log('Substance created: ', aloeId);

        var Albuterol = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Albuterol"
            },
            "description" : "Analgesic"
        }
        let albuterolId = createSubstance(Albuterol, '3.0.1');
        console.log('Substance created: ', albuterolId);

        var Acetaminophen = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Acetaminophen"
            },
            "description" : "Pain reliever/fever reducer."
        }
        let acetaminophenId = createSubstance(Acetaminophen, '3.0.1')
        console.log('Substance created: ', acetaminophenId);

        var Dextromethorphan = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Dextromethorphan"
            },
            "description" : "Cough suppressant."
        }
        let dextromethorphanId = createSubstance(Dextromethorphan, '3.0.1');
        console.log('Substance created: ', dextromethorphanId);

        var Doxylamine = {
            "resourceType" : "Substance",
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Substance"]
            },
            "code" : {
                "text" : "Doxylamine"
            },
            "description" : "Antihistamine."
        }
        let doxylamineId = createSubstance(Doxylamine, '3.0.1');
        console.log('Substance created: ', doxylamineId);
    },
    'Medications/initialize':function(fhirVersion){
        check(fhirVersion, Match.Maybe(String));

        console.log('Initializing Medications manifest...')

        //==========================================================================
        //==========================================================================
        // SHORT LIST

        var medicationList = [];
        var Claritin = {
            'code': 'Claritin',
            'ingredients': [],
            "manufacturer": "",
            'form': 'tablet',
            'amount': {
                'value': 30,
                'unit': 'tablet'
            }
        }
        var Motrin = {
            'code': 'Motrin',
            'ingredients': [],
            "manufacturer": "Johnson & Johnson",
            'form': 'softgel',
            'container': 'bottle',
            'amount': {
                'value': 30,
                'unit': 'tablet'
            }
        }
        var Zyrtec = {
            'code': 'Zyrtec',
            'ingredients': [],
            "manufacturer": "",
            'form': 'tablet',
            'container': 'bottle',
            'amount': {
                'value': 70,
                'unit': 'tablet'
            }
        }
        var MentholatumOintment = {
            'code': 'Mentholatum Ointment',
            'ingredients': [],
            "manufacturer": "",
            'form': 'tablet',
            'container': 'bottle',
            'amount': {
                'value': 1,
                'unit': 'fl oz'
            }
        }
        var HydrogenPeroxide = {
            'code': "Hydrogen Peroxide",
            'ingredients': [],
            'form': 'liquid',
            "manufacturer": "",
            'container': 'bottle',
            'quantity': '3%',
            'amount': {
                'value': 16,
                'unit': 'fl oz'
            }
        }

        var TopCare = {
            'code': "TopCare",
            'ingredients': [],
            'form': 'liquid',
            "manufacturer": "",
            'container': 'bottle',
            'quantity': '0.5 oz',
            'amount': {
                'value': 16,
                'unit': 'fl oz'
            }
        }
        var Ventolin = {
            'code': "Ventolin",
            'ingredients': [],
            'form': 'inhaler',
            "manufacturer": "",
            'container': 'bottle',
            'quantity': '2 mg',
            'amount': {
                'value': 40,
                'unit': 'inhalations'
            }
        }
        var NyQuill = {
            'code': "Ventolin",
            'isBrand': true,
            'ingredients': [],
            "manufacturer": "",
            'form': 'liquid',
            'container': 'vial',
            'quantity': '2 mg',
            'amount': {
                'value': 12,
                'unit': 'fl oz'
            }
        }

        //==========================================================================
        //==========================================================================
        // SUBSTANCES

        Claritin.ingredients.push(Substances.findOne({'code.text': 'Loratadine'}));
        process.env.NODE_ENV === "verbose" && console.log('Claritin.ingredients', Claritin.ingredients);
        medicationList.push(Claritin);

        Motrin.ingredients.push(Substances.findOne({'code.text': 'Ibuprofen'}));
        process.env.NODE_ENV === "verbose" && console.log('Motrin.ingredients', Motrin.ingredients)
        medicationList.push(Motrin);

        Zyrtec.ingredients.push(Substances.findOne({'code.text': 'Cetinizine HCl'}));
        process.env.NODE_ENV === "verbose" && console.log('Zyrtec.ingredients', Zyrtec.ingredients)
        medicationList.push(Zyrtec);

        MentholatumOintment.ingredients.push(Substances.findOne({'code.text': 'Camphor'}));
        MentholatumOintment.ingredients.push(Substances.findOne({'code.text': 'Menthol, natural'}));
        process.env.NODE_ENV === "verbose" && console.log('MentholatumOintment.ingredients', MentholatumOintment.ingredients)
        medicationList.push(MentholatumOintment);

        HydrogenPeroxide.ingredients.push(Substances.findOne({'code.text': 'Hydrogen peroxide (stabilized)'}));
        process.env.NODE_ENV === "verbose" && console.log('HydrogenPeroxide.ingredients', HydrogenPeroxide.ingredients)
        medicationList.push(HydrogenPeroxide);

        TopCare.ingredients.push(Substances.findOne({'code.text': 'Aloe barbadensis leaf tract'}));
        process.env.NODE_ENV === "verbose" && console.log('TopCare.ingredients', TopCare.ingredients)
        medicationList.push(TopCare);

        Ventolin.ingredients.push(Substances.findOne({'code.text': 'Albuterol'}));
        process.env.NODE_ENV === "verbose" && console.log('TopCare.ingredients', Ventolin.ingredients)
        medicationList.push(Ventolin);

        NyQuill.ingredients.push(Substances.findOne({'code.text': 'Acetaminophen'}));
        NyQuill.ingredients.push(Substances.findOne({'code.text': 'Dextromethorphan'}));
        NyQuill.ingredients.push(Substances.findOne({'code.text': 'Doxylamine'}));

        process.env.NODE_ENV === "verbose" && console.log('TopCare.ingredients', NyQuill.ingredients)
        medicationList.push(NyQuill);


        //==========================================================================
        //==========================================================================
        // MEDICATION   

        console.log('Lets make sure our Medication inventory is correct...');


        var newMedication = {
            'meta' : {
                'profile' : ["http://hl7.org/fhir/DSTU2/StructureDefinition/Medication"]
            },
            'code': {
                'text': ""
            },
            'isBrand': false,
            'manufacturer': {
                'display': '',
                'reference': ''
            },
            'product': {
                'form': {
                    'text': 'tablet'
                },
                'ingredient': []
            }
        };


        medicationList.forEach(function(medication){
            switch (fhirVersion) {
                case 'DSTU2':
                    newMedication.code.text = get(medication, 'code');
                    newMedication.manufacturer.display = get(medication, 'manufacturer');
                    // newMedication.package.container.text = get(medication, 'container');
                    // newMedication.package.content = [get(medication, 'amount')];

                    if(get(medication, 'ingredients')){
                        medication.ingredients.forEach(function(ingredientId){
                            newMedication.product.ingredient.push({
                                'item': {
                                    'display': get(medication, 'code'),
                                    'reference': 'Substance/' + ingredientId
                                }
                            });        
                        })
                    }
                    break;
                case 'STU3':
    
                    break;
                case 'R4':
                    newMedication.code.text = get(medication, 'ingredientId');
                    if(get(medication, 'ingredients')){
                        medication.ingredients.forEach(function(ingredientId){
                            newMedication.product.ingredient.push({
                                'item': {
                                    'display': get(medication, 'code'),
                                    'reference': 'Substance/' + ingredientId
                                }
                            });        
                        })
                    }
                    break;        
                default:
                    newMedication.code.text = get(medication, 'ingredientId');
                    if(get(medication, 'ingredients')){
                        medication.ingredients.forEach(function(ingredientId){
                            newMedication.product.ingredient.push({
                                'item': {
                                    'display': get(medication, 'code'),
                                    'reference': 'Substance/' + ingredientId
                                }
                            });        
                        })
                    }
                    break;
            }
            // Meteor.call('Medication/create', newMedication, '3.0.1');


            process.env.NODE_ENV === "logging" && console.log('newMedication', newMedication)
            if (!Medications.findOne({'code.text': newMedication.code.text})) {
                // console.log("Couldn't find " + newMedication.code.text + ".  Inserting into local collection...")

                let collectionConfig = {};
                if(Meteor.isClient){
                    collectionConfig = {validate: true, filter: true};
                }
                let medId = Medications.insert(newMedication, collectionConfig, function(error, result){
                    //if (error) { console.log(error); }
                    if (result) { console.log('Medication created: ' + result);}
                });    
                if(medId){
                    console.log("Couldn't find " + newMedication.code.text)
                }
            } else {
                console.log('Found a previous instance of the medication.  Skipping...')
            }   
        })



    },
    'Medication/drop': function(){
        if (process.env.NIGHTWATCH || this.userId) {
            console.log('-----------------------------------------');
            console.log('Dropping medications... ');
            Medications.find().forEach(function(medication){
                Medications.remove({_id: medication._id});
            });    
        } else {
            console.log('Not authorized.  Try logging in or setting NIGHTWATCH=true')
        }
    }
});

