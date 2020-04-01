import { get, has } from 'lodash';
import moment from 'moment';

export function flattenBundle(person){
  let result = {
    _id: person._id,
    id: person.id,
    active: true,
    subject: '',
    author: '',
    title: '',
    date: ''
  };

  result.subject = get(person, 'entry[0].resource.subject.display', true).toString();
  result.author = get(person, 'entry[0].resource.author[0].display', true).toString();
  result.title = get(person, 'entry[0].resource.title', true).toString();

  // there's an off-by-1 error between momment() and Date() that we want
  // to account for when converting back to a string
  result.date = moment(person.date).format("YYYY-MM-DD")

  return result;
}

export function flattenCarePlan(plan){
  // careplans: CarePlans.find({'subject.reference': Meteor.userId}).map(function(plan){
  // todo: replace tertiary logic

  // console.log('flattenCarePlan', plan)

  let result = {
    _id: plan._id,
    subject: '',
    author: '',
    template: '',
    category: '',
    am: '',
    pm: '',
    activities: 0,
    goals: 0,
    addresses: 0,
    start: '',
    end: '',
    title: ''
  };

  if (get(plan, 'template')) {
    result.template = plan.template.toString();
  }

  result.subject = get(plan, 'subject.display', '');
  result.author = get(plan, 'author[0].display', '')
  result.start = moment(get(plan, 'period.start')).format("YYYY-MM-DD hh:mm a");
  result.end = moment(get(plan, 'period.start')).format("YYYY-MM-DD hh:mm a");
  result.category = get(plan, 'category[0].text', '')    


  if (get(plan, 'activity')) {
    result.activities = plan.activity.length;
  }
  if (get(plan, 'goal')) {
    result.goals = plan.goal.length;
  }
  if (get(plan, 'addresses')) {
    result.addresses = plan.addresses.length;
  }

  if(!result.title){
    result.title = get(plan, 'title', '')    
  }
  if(!result.title){
    result.title = get(plan, 'description', '')    
  }
  if(!result.title){
    result.title = get(plan, 'category[0].coding[0].display', '')    
  }
  return result;
}

export function flattenComposition(composition){
  let result = {
    _id: '',
    meta: '',
    subject: '',
    subjectId: '',
    status: '',
    statusHistory: 0,
    periodStart: '',
    periodEnd: '',
    reasonCode: '', 
    reasonDisplay: '', 
    typeCode: '',
    typeDisplay: '',
    classCode: ''
  };

  result._id =  get(composition, 'id') ? get(composition, 'id') : get(composition, '_id');


  if(get(composition, 'subject.display', '')){
    result.subject = get(composition, 'subject.display', '');
  } else {
    result.subject = get(composition, 'subject.reference', '');
  }
  result.subjectId = get(composition, 'subject.reference', '');

  result.status = get(composition, 'status', '');
  result.periodStart = moment(get(composition, 'period.start', '')).format("YYYY-MM-DD hh:mm");
  result.periodEnd = moment(get(composition, 'period.end', '')).format("YYYY-MM-DD hh:ss");
  result.reasonCode = get(composition, 'reason[0].coding[0].code', '');
  result.reasonDisplay = get(composition, 'reason[0].coding[0].display', '');
  result.typeCode = get(composition, 'type[0].coding[0].code', '');
  result.typeDisplay = get(composition, 'type[0].coding[0].display', '');

  if(get(composition, 'class.code')){
    result.classCode = get(composition, 'class.code', '');
  } else if(get(composition, 'class')){
    result.classCode = get(composition, 'class', '');
  }

  let statusHistory = get(composition, 'statusHistory', []);

  result.statusHistory = statusHistory.length;

  return result;
}

export function flattenCondition(condition, internalDateFormat){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    clinicalStatus: '',
    patientDisplay: '',
    patientReference: '',
    asserterDisplay: '',
    verificationStatus: '',
    severity: '',
    snomedCode: '',
    snomedDisplay: '',
    evidenceDisplay: '',
    barcode: '',
    onsetDateTime: '',
    abatementDateTime: ''
  };

  if(!internalDateFormat){
    internalDateFormat = "YYYY-MM-DD";
  }

  result._id =  get(condition, 'id') ? get(condition, 'id') : get(condition, '_id');
  result.id = get(condition, 'id', '');
  result.identifier = get(condition, 'identifier[0].value', '');

  if(get(condition, 'patient')){
    result.patientDisplay = get(condition, 'patient.display', '');
    result.patientReference = get(condition, 'patient.reference', '');
  } else if (get(condition, 'subject')){
    result.patientDisplay = get(condition, 'subject.display', '');
    result.patientReference = get(condition, 'subject.reference', '');
  }
  result.asserterDisplay = get(condition, 'asserter.display', '');


  if(get(condition, 'clinicalStatus.coding[0].code')){
    result.clinicalStatus = get(condition, 'clinicalStatus.coding[0].code', '');  //R4
  } else {
    result.clinicalStatus = get(condition, 'clinicalStatus', '');                 // DSTU2
  }

  if(get(condition, 'verificationStatus.coding[0].code')){
    result.verificationStatus = get(condition, 'verificationStatus.coding[0].code', '');  // R4
  } else {
    result.verificationStatus = get(condition, 'verificationStatus', '');                 // DSTU2
  }

  result.snomedCode = get(condition, 'code.coding[0].code', '');
  result.snomedDisplay = get(condition, 'code.coding[0].display', '');

  result.evidenceDisplay = get(condition, 'evidence[0].detail[0].display', '');
  result.barcode = get(condition, '_id', '');
  result.severity = get(condition, 'severity.text', '');

  result.onsetDateTime = moment(get(condition, 'onsetDateTime', '')).format("YYYY-MM-DD");
  result.abatementDateTime = moment(get(condition, 'abatementDateTime', '')).format("YYYY-MM-DD");

  return result;
}

export function flattenDevice(device, internalDateFormat){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    deviceType: '',
    deviceModel: '',
    manufacturer: '',
    serialNumber: '',
    costOfOwnership: ''
  };

  if(!internalDateFormat){
    internalDateFormat = "YYYY-MM-DD";
  }

  result._id =  get(device, 'id') ? get(device, 'id') : get(device, '_id');
  result.id = get(device, 'id', '');
  result.identifier = get(device, 'identifier[0].value', '');

  result.deviceType = get(device, 'type.text', '');
  result.deviceModel = get(device, 'model', '');
  result.manufacturer = get(device, 'manufacturer', '');
  result.serialNumber = get(device, 'identifier[0].value', '');
  result.note = get(device, 'note[0].text', '');

  return result;
}

export function flattenDiagnosticReport(report, fhirVersion){  
  var newRow = {
    _id: '',
    subjectDisplay: '',
    code: '',
    status: '',
    issued: '',
    performerDisplay: '',
    identifier: '',
    category: '',
    effectiveDate: ''
  };
  if (report){
    if(report._id){
      newRow._id = report._id;
    }
    if(report.subject){
      if(report.subject.display){
        newRow.subjectDisplay = report.subject.display;
      } else {
        newRow.subjectDisplay = report.subject.reference;          
      }
    }
    if(fhirVersion === "v3.0.1"){
      if(get(report, 'performer[0].actor.display')){
        newRow.performerDisplay = get(report, 'performer[0].actor.display');
      } else {
        newRow.performerDisplay = get(report, 'performer[0].actor.reference');          
      }
    }
    if(fhirVersion === "v1.0.2"){
      if(report.performer){
        newRow.performerDisplay = get(report, 'performer.display');
      } else {
        newRow.performerDisplay = get(report, 'performer.reference'); 
      }      
    }

    if(get(report, 'category.coding[0].code')){
      newRow.category = get(report, 'category.coding[0].code');
    } else {
      newRow.category = get(report, 'category.text');
    }

    newRow.code = get(report, 'code.text', '');
    newRow.identifier = get(report, 'identifier[0].value', '');
    newRow.status = get(report, 'status', '');
    newRow.effectiveDate = moment(get(report, 'effectiveDateTime')).format("YYYY-MM-DD");
    newRow.issued = moment(get(report, 'issued')).format("YYYY-MM-DD"); 

    return newRow;  
  } 
}

export function flattenEncounter(encounter, internalDateFormat){
  let result = {
    _id: '',
    meta: '',
    subject: '',
    subjectId: '',
    status: '',
    statusHistory: 0,
    periodStart: '',
    periodEnd: '',
    reasonCode: '', 
    reasonDisplay: '', 
    typeCode: '',
    typeDisplay: '',
    classCode: '',
    duration: ''
  };

  if(!internalDateFormat){
    internalDateFormat = get(Meteor, "settings.public.defaults.internalDateFormat", "YYYY-MM-DD");
  }

  result._id =  get(encounter, 'id') ? get(encounter, 'id') : get(encounter, '_id');

  if(get(encounter, 'subject')){
    if(get(encounter, 'subject.display', '')){
      result.subject = get(encounter, 'subject.display', '');
    } else {
      result.subject = get(encounter, 'subject.reference', '');
    }
  }  
  if(get(encounter, 'patient')){
    if(get(encounter, 'patient.display', '')){
      result.subject = get(encounter, 'patient.display', '');
    } else {
      result.subject = get(encounter, 'patient.reference', '');
    }
  }  

  result.subjectId = get(encounter, 'subject.reference', '');

  result.status = get(encounter, 'status', '');
  result.reasonCode = get(encounter, 'reason[0].coding[0].code', '');
  result.reasonDisplay = get(encounter, 'reason[0].coding[0].display', '');
  result.typeCode = get(encounter, 'type[0].coding[0].code', '');
  result.typeDisplay = get(encounter, 'type[0].coding[0].display', '');

  if(get(encounter, 'class.code')){
    result.classCode = get(encounter, 'class.code', '');
  } else if(get(encounter, 'class')){
    result.classCode = get(encounter, 'class', '');
  }

  let statusHistory = get(encounter, 'statusHistory', []);

  result.statusHistory = statusHistory.length;

  let momentStart = moment(get(encounter, 'period.start', ''))
  if(get(encounter, 'period.start')){
    momentStart = moment(get(encounter, 'period.start', ''))
  } else if(get(encounter, 'performedPeriod.start')){
    momentStart = moment(get(encounter, 'performedPeriod.start', ''))
  }
  if(momentStart){
    result.periodStart = momentStart.format(internalDateFormat);
  } 


  let momentEnd;
  if(get(encounter, 'period.end')){
    momentEnd = moment(get(encounter, 'period.end', ''))
  } else if(get(encounter, 'performedPeriod.end')){
    momentEnd = moment(get(encounter, 'performedPeriod.end', ''))
  }
  if(momentEnd){
    result.periodEnd = momentEnd.format(internalDateFormat);
  } 

  if(momentStart && momentEnd){
    result.duration = Math.abs(momentStart.diff(momentEnd, 'minutes', true))
  }

  return result;
}

export function flattenLocation(location){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    name: '',
    address: '',
    type: '',
    latitude: '',
    longitude: ''
  };

  result.severity = get(location, 'severity.text', '');

  if (get(location, '_id')){
    result._id = get(location, '_id');
  }
  if (get(location, 'name')) {
    result.name = get(location, 'name');
  }
  if (get(location, 'address')) {
    result.address = FhirUtilities.stringifyAddress(get(location, 'address'), {noPrefix: true});
  }
  if (get(location, 'type.text')) {
    result.type = get(location, 'type.text');
  }
  if (get(location, 'position.latitude')) {
    result.latitude = get(location, 'position.latitude', null);
  }
  if (get(location, 'position.longitude')) {
    result.longitude = get(location, 'position.longitude', null);
  }

  return result;
}

export function flattenMeasureReport(measureReport, measuresCursor){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    type: '',
    measureUrl: '',
    measureTitle: '',
    date: '',
    reporter: '',
    periodStart: '',
    periodEnd: '',
    groupCode: '',
    populationCode: '',
    populationCount: '',
    measureScore: '',
    stratifierCount: ''
  };

  result._id =  get(measureReport, 'id') ? get(measureReport, 'id') : get(measureReport, '_id');
  result.id = get(measureReport, 'id', '');
  result.identifier = get(measureReport, 'identifier[0].value', '');
  result.type = get(measureReport, 'type', '');

  result.measureUrl = FhirUtilities.pluckReferenceId(get(measureReport, 'measure')); 

  if(measuresCursor && result.measureUrl){
    let measure = measuresCursor.findOne({id: result.measureUrl});
    result.measureTitle = get(measure, 'title');
  }

  result.date = moment(get(measureReport, 'date', '')).format("YYYY-MM-DD hh:mm");
  if(get(measureReport, 'reporter.display', '')){
    result.reporter = get(measureReport, 'reporter.display', '');
  } else {
    result.reporter = get(measureReport, 'reporter.reference', '');
  }

  result.periodStart = moment(get(measureReport, 'period.start', '')).format("YYYY-MM-DD hh:mm");
  result.periodEnd = moment(get(measureReport, 'period.end', '')).format("YYYY-MM-DD hh:ss");

  result.groupCode = get(measureReport, 'group[0].coding[0].code', '');
  result.populationCode = get(measureReport, 'group[0].population[0].coding[0].code', '');
  result.populationCount = get(measureReport, 'group[0].population[0].count', '');

  result.measureScore = get(measureReport, 'group[0].measureScore.value', '');


  let stratifierArray = get(measureReport, 'group[0].stratifier', []);
  result.stratifierCount = stratifierArray.length;

  return result;
}

export function flattenMeasure(measure){
  let result = {
    _id: '',
    meta: '',
    identifier: '',
    publisher: '',
    status: '',
    title: '',
    date: '',
    lastReviewDate: '',
    author: '',
    reviewer: '',
    scoring: '',
    type: '',
    riskAdjustment: '',
    rateAggregation: '',
    supplementalDataCount: '',
    context: ''
  };

  result._id =  get(measure, 'id') ? get(measure, 'id') : get(measure, '_id');
  result.id = get(measure, 'id', '');
  result.identifier = get(measure, 'identifier[0].value', '');
  result.date = moment(get(measure, 'date', '')).format("YYYY-MM-DD hh:mm");
  result.lastReviewDate = moment(get(measure, 'lastReviewDate', '')).format("YYYY-MM-DD hh:mm");

  result.publisher = get(measure, 'publisher', '');
  result.title = get(measure, 'title', '');
  result.status = get(measure, 'status', '');

  result.context = get(measure, 'useContext[0].valueCodeableConcept.text', '');

  if(get(measure, 'author.display')){
    result.author = get(measure, 'author.display', '');
  } else {
    result.author = FhirUtilities.pluckReferenceId(get(measure, 'author.reference'));
  }

  if(get(measure, 'reviewer.display')){
    result.reviewer = get(measure, 'reviewer.display', '');
  } else {
    result.reviewer = FhirUtilities.pluckReferenceId(get(measure, 'reviewer.reference'));
  }

  result.scoring = get(measure, 'scoring.coding[0].display', '');
  result.type = get(measure, 'type.coding[0].display', '');

  result.riskAdjustment = get(measure, 'riskAdjustment', '');
  result.rateAggregation = get(measure, 'rateAggregation', '');
  
  let supplementalData = get(measure, 'supplementalData', []);
  result.supplementalDataCount = supplementalData.length;

  let cohorts = get(measure, 'group[0].population', []);
  result.cohortCount = cohorts.length;


  return result;
}

export function flattenMedicationOrder(medicationOrder, dateFormat){
  let result = {
    _id: medicationOrder._id,
    status: '',
    identifier: '',
    patientDisplay: '',
    patientReference: '',
    prescriberDisplay: '',
    asserterDisplay: '',
    clinicalStatus: '',
    snomedCode: '',
    snomedDisplay: '',
    evidenceDisplay: '',
    barcode: '',
    dateWritten: '',
    dosageInstructionText: '',
    medicationCodeableConcept: '',
    medicationCode: '',
    dosage: ''
  };

  if(!dateFormat){
    dateFormat = get(Meteor, "settings.public.defaults.dateFormat", "YYYY-MM-DD");
  }

  if (get(medicationOrder, 'medicationReference.display')){
    result.medicationCodeableConcept = get(medicationOrder, 'medicationReference.display');
  } else if(get(medicationOrder, 'medicationCodeableConcept')){
    result.medicationCodeableConcept = get(medicationOrder, 'medicationCodeableConcept.text');
    result.medicationCode = get(medicationOrder, 'medicationCodeableConcept.coding[0].code');
  } 

  result.status = get(medicationOrder, 'status');
  result.identifier = get(medicationOrder, 'identifier[0].value');
  result.patientDisplay = get(medicationOrder, 'patient.display');
  result.patientReference = get(medicationOrder, 'patient.reference');
  result.prescriberDisplay = get(medicationOrder, 'prescriber.display');
  result.dateWritten = moment(get(medicationOrder, 'dateWritten')).format(dateFormat);
  
  result.dosage = get(medicationOrder, 'dosageInstruction[0].text');
  result.barcode = get(medicationOrder, '_id');

  return result;
}

export function flattenMedicationStatement(statement, fhirVersion){
  console.log('flattenMedicationStatement', statement)

  var newRow = {
    '_id': statement._id,
    'medication': '',
    'medicationReference': '',
    'medicationDisplay': '',
    'reasonCodeCode': '',
    'reasonCodeDisplay': '',
    'basedOn': '',
    'effectiveDateTime': '',
    'dateAsserted': null,
    'informationSource': '',
    'subjectDisplay': '',
    'taken': '',
    'reasonCodeDisplay': '',
    'dosage': '',
  };

  // STU3
  if(fhirVersion === "v3.0.1"){
    newRow.subjectDisplay = get(statement, 'subject.display');
    newRow.medication = get(statement, 'medicationReference.reference');
    newRow.medication = get(statement, 'medicationReference.display');
    newRow.medication = get(statement, 'medicationCodeableConcept.coding[0].display');
    newRow.identifier = get(statement, 'identifier[0].value');
    newRow.effectiveDateTime = moment(get(statement, 'effectiveDateTime')).format("YYYY-MM-DD");
    newRow.dateAsserted = moment(get(statement, 'dateAsserted')).format("YYYY-MM-DD");
    newRow.informationSource = get(statement, 'informationSource.display');
    newRow.taken = get(statement, 'taken');
    newRow.reasonCodeDisplay = get(statement, 'reasonCode[0].coding[0].display');  
  }

  // DSTU2
  if(fhirVersion === "v1.0.2"){
    newRow.subjectDisplay = get(statement, 'patient.display');
    newRow.medicationReference = get(statement, 'medicationReference.reference');
    newRow.medicationDisplay = get(statement, 'medicationReference.display');
    newRow.medication = get(statement, 'medicationReference.display');
    newRow.reasonCode = get(statement, 'reasonForUseCodeableConcept.coding[0].code');
    newRow.reasonCodeDisplay = get(statement, 'reasonForUseCodeableConcept.coding[0].display');
    newRow.identifier = get(statement, 'identifier[0].value');
    newRow.effectiveDateTime = moment(get(statement, 'effectiveDateTime')).format("YYYY-MM-DD");
    newRow.dateAsserted = moment(get(statement, 'dateAsserted')).format("YYYY-MM-DD");
    newRow.informationSource = get(statement, 'supportingInformation[0].display');
    newRow.reasonCodeDisplay = get(statement, 'reasonForUseCodeableConcept.coding[0].display');  
  }

  return newRow;
}

export function flattenObservation(observation, dateFormat){
  let result = {
    _id: '',
    meta: '',
    category: '',
    code: '',
    valueString: '',
    value: '',
    observationValue: '',
    subject: '',
    subjectId: '',
    status: '',
    device: '',
    createdBy: '',
    effectiveDateTime: '',
    issued: '',
    unit: ''
  };

  if(!dateFormat){
    dateFormat = get(Meteor, "settings.public.defaults.dateFormat", "YYYY-MM-DD hh a");
  }

  result._id =  get(observation, 'id') ? get(observation, 'id') : get(observation, '_id');

  result.category = get(observation, 'category.text', '');
  result.code = get(observation, 'code.text', '');
  result.codeValue = get(observation, 'code.coding[0].code', '');
  result.valueString = get(observation, 'valueString', '');
  result.comparator = get(observation, 'valueQuantity.comparator', '');
  result.observationValue = Number.parseFloat(get(observation, 'valueQuantity.value', 0)).toFixed(2);;
  result.unit = get(observation, 'valueQuantity.unit', '');
  result.subject = get(observation, 'subject.display', '');
  result.subjectId = get(observation, 'subject.reference', '');
  result.device = get(observation, 'device.display', '');
  result.status = get(observation, 'status', '');
  
  if(get(observation, 'effectiveDateTime')){
    result.effectiveDateTime =  moment(get(observation, 'effectiveDateTime')).format(dateFormat);
  }
  if(get(observation, 'issued')){
    result.effectiveDateTime =  moment(get(observation, 'issued')).format(dateFormat);    
  }

  result.meta = get(observation, 'category.text', '');

  if(result.valueString.length > 0){
    result.value = result.valueString;
  } else {
    if(result.comparator){
      result.value = result.comparator + ' ';
    } 
    result.value = result.value + result.observationValue + ' ' + result.unit;
  }

  return result;
}

export function flattenOrganization(organization, internalDateFormat){
  let result = {
    _id: '',
    id: '',
    meta: '',
    name: '',
    identifier: '',
    phone: '',
    addressLine: '',
    text: '',
    city: '',
    state: '',
    postalCode: ''
  };

  result._id =  get(organization, 'id') ? get(organization, 'id') : get(organization, '_id');
  result.id = get(organization, 'id', '');
  result.identifier = get(organization, 'identifier[0].value', '');

  result.name = get(organization, 'name', '')

  result.phone = FhirUtilities.pluckPhone(get(organization, 'telecom'));
  result.email = FhirUtilities.pluckEmail(get(organization, 'telecom'));

  result.addressLine = get(organization, 'address[0].line[0]');
  result.state = get(organization, 'address[0].state');
  result.postalCode = get(organization, 'address[0].postalCode');
  result.country = get(organization, 'address[0].country');

  return result;
}

export function flattenPatient(patient, internalDateFormat){
  let result = {
    _id: get(patient, '_id'),
    id: get(patient, 'id'),
    meta: '',
    identifier: '',
    active: true,
    gender: get(patient, 'gender'),
    name: '',
    mrn: '',
    birthDate: '',
    photo: "/thumbnail-blank.png",
    addressLine: '',
    state: '',
    postalCode: '',
    country: '',
    maritalStatus: '',
    preferredLanguage: '',
    species: '',
    resourceCounts: '',
    deceased: false
  };

  result._id =  get(patient, 'id') ? get(patient, 'id') : get(patient, '_id');
  result.id = get(patient, 'id', '');
  result.identifier = get(patient, 'identifier[0].value', '');

  result.identifier = get(patient, 'identifier[0].value', '');
  result.active = get(patient, 'active', true).toString();
  
  result.gender = get(patient, 'gender', '');

  // patient name has gone through a number of revisions, and we need to search a few different spots, and assemble as necessary  
  let resultingNameString = "";

  let nameText = get(patient, 'name[0].text', '');
  if(nameText.length > 0){
    // some systems will store the name as it is to be displayed in the name[0].text field
    // if that's present, use it
    resultingNameString = get(patient, 'name[0].text', '');    
  } else {
    // the majority of systems out there are SQL based and make a design choice to store as 'first' and 'last' name
    // critiques of that approach can be saved for a later time
    // but suffice it to say that we need to assemble the parts

    if(get(patient, 'name[0].prefix[0]')){
      resultingNameString = get(patient, 'name[0].prefix[0]')  + ' ';
    }

    if(get(patient, 'name[0].given[0]')){
      resultingNameString = resultingNameString + get(patient, 'name[0].given[0]')  + ' ';
    }

    if(get(patient, 'name[0].family')){
      // R4 - droped the array of family names; one authoritative family name per patient
      resultingNameString = resultingNameString + get(patient, 'name[0].family')  + ' ';
    } else if (get(patient, 'name[0].family[0]')){
      // DSTU2 and STU3 - allows an array of family names
      resultingNameString = resultingNameString + get(patient, 'name[0].family[0]')  + ' ';
    }
    
    if(get(patient, 'name[0].suffix[0]')){
      resultingNameString = resultingNameString + ' ' + get(patient, 'name[0].suffix[0]');
    }
  }

  // remove any whitespace from the name
  result.name = resultingNameString.trim();

  // there's an off-by-1 error between momment() and Date() that we want
  // to account for when converting back to a string
  // which is why we run it through moment()
  result.birthDate = moment(get(patient, "birthDate")).format("YYYY-MM-DD")

  result.photo = get(patient, 'photo[0].url', '');

  result.maritalStatus = get(patient, 'maritalStatus.text', '');

  let communicationArray = [];
  if(get(patient, 'communication') && Array.isArray(get(patient, 'communication'))){
    communicationArray = get(patient, 'communication');
    // first, we're going to try to loop through the communications array 
    // and find an authoritatively preferred language
    communicationArray.forEach(function(communication){
      if(get(communication, "preferred")){
        if(get(communication, "text")){
          // using the text field if possible
          result.preferredLanguage = get(communication, "text");
        } else {
          // but resorting to a code name, if needed
          result.preferredLanguage = get(communication, "coding[0].display");
        }
      }
    })
    // if we didn't find any langauge that is marked as preferred 
    if(result.preferredLanguage === ""){
      // then we try the same thing on the first language listed
      if(get(communicationArray[0], "text")){
        result.preferredLanguage = get(communicationArray[0], "text");
      } else if (get(communicationArray[0], "coding[0].display")) {
        result.preferredLanguage = get(communicationArray[0], "coding[0].display")
      }
    }
  }


  // is the patient dead?  :(
  result.deceased = get(patient, 'deceasedBoolean', '');

  // DSTU2 & STU3 
  result.species = get(patient, 'animal.species.text', '');


  // address
  result.addressLine = get(patient, 'address[0].line[0]')
  result.state = get(patient, 'address[0].state')
  result.postalCode = get(patient, 'address[0].postalCode')
  result.country = get(patient, 'address[0].country')

  // console.log('flattened', result)
  return result;
}

export function flattenPractitioner(practitioner){
  console.log('PractitionersTable.flattenPractitioner()', practitioner)

  let result = {
    _id: practitioner._id,
    name: '',
    phone: '',
    email: '',
    qualificationIssuer: '',
    qualificationIdentifier: '',
    qualificationCode: '',
    qualificationStart: null,
    qualificationEnd: null,
    text: '',
    city: '',
    state: '',
    postalCode: ''
  };

  //---------------------------------------------------------
  // TODO REFACTOR:  HumanName
  // parse name!
  // totally want to extract this
  if(get(practitioner, 'name.text')){
    result.name = get(practitioner, 'name.text');
  } else {
    if(get(practitioner, 'name.suffix[0]')){
      result.name = get(practitioner, 'name.suffix[0]')  + ' ';
    }

    result.name = result.name + get(practitioner, 'name.given[0]') + ' ';
    
    if(get(practitioner, 'name.family[0]')){
      result.name = result.name + get(practitioner, 'name.family[0]');
    } else {
      result.name = result.name + get(practitioner, 'name.family');
    }
    
    if(get(practitioner, 'name.suffix[0]')){
      result.name = result.name + ' ' + get(practitioner, 'name.suffix[0]');
    }
  } 
  //---------------------------------------------------------

  if(this.props.fhirVersion === 'v1.0.2'){
    // if (get(practitioner, 'telecom[0].value')) {
    //   result.phone = get(practitioner, 'telecom[0].value');
    // }
    // if (get(practitioner, 'telecom[0].use') ) {
    //   result.email = get(practitioner, 'telecom[0].use')
    // }

    result.qualificationId = get(practitioner, 'qualification[0].identifier[0].value');
    result.qualificationCode = get(practitioner, 'qualification[0].code.coding[0].code');
    result.qualificationStart = moment(get(practitioner, 'qualification[0].period.start')).format("MMM YYYY");
    result.qualificationEnd = moment(get(practitioner, 'qualification[0].period.end')).format("MMM YYYY");
    result.issuer = get(practitioner, 'qualification[0].issuer.display');
  
    result.text = get(practitioner, 'address[0].text')
    result.city = get(practitioner, 'address[0].city')
    result.state = get(practitioner, 'address[0].state')
    result.postalCode = get(practitioner, 'address[0].postalCode')

    //----------------------------------------------------------------
    // TODO REFACTOR:  ContactPoint
    // totally want to extract this

    let telecomArray = get(practitioner, 'telecom');
    telecomArray.forEach(function(telecomRecord){
      if(get(telecomRecord, 'system') === 'phone'){
        result.phone = get(telecomRecord, 'value');
      }
      if(get(telecomRecord, 'system') === 'email'){
        result.email = get(telecomRecord, 'value');
      }
    })
    //----------------------------------------------------------------
  }

  return result;
}


export function flattenProcedure(procedure, internalDateFormat){
  let result = {
    _id: '',
    id: '',
    meta: '',
    identifier: '',
    status: '',
    categoryDisplay: '',
    code: '',
    codeDisplay: '',
    subject: '',
    subjectReference: '',
    performerDisplay: '',
    performedStart: '',
    performedEnd: '',
    notesCount: '',
    bodySiteDisplay: ''
  };

  if(!internalDateFormat){
    internalDateFormat = "YYYY-MM-DD";
  }

  result._id =  get(procedure, 'id') ? get(procedure, 'id') : get(procedure, '_id');

  result.id = get(procedure, 'id', '');
  result.status = get(procedure, 'status', '');
  result.categoryDisplay = get(procedure, 'category.coding[0].display', '');
  result.identifier = get(procedure, 'identifier[0].value');
  result.code = get(procedure, 'code.coding[0].code');
  result.codeDisplay = get(procedure, 'code.coding[0].display');
  result.categoryDisplay = get(procedure, 'category.coding[0].display')    

  if(get(procedure, 'subject')){
    result.subject = get(procedure, 'subject.display', '');
    result.subjectReference = get(procedure, 'subject.reference', '');
  } else if(get(procedure, 'patient')){
    result.subject = get(procedure, 'patient.display', '');
    result.subjectReference = get(procedure, 'patient.reference', '');
  }

  result.performedStart = moment(get(procedure, 'performedDateTime')).format(internalDateFormat);      
  result.performerDisplay = moment(get(procedure, 'performer.display')).format(internalDateFormat);
  result.performerReference = get(procedure, 'performer.reference');
  result.bodySiteDisplay = get(procedure, 'bodySite.display');

  if(get(procedure, 'performedPeriod')){
    result.performedStart = moment(get(procedure, 'performedPeriod.start')).format(internalDateFormat);      
    result.performedEnd = moment(get(procedure, 'performedPeriod.end')).format(internalDateFormat);      
  }

  let notes = get(procedure, 'notes')
  if(notes && notes.length > 0){
    result.notesCount = notes.length;
  } else {
    result.notesCount = 0;
  }

  return result;
}


FhirDehydrator = {
  dehydrateBundle: flattenBundle(),
  dehydrateCarePlan: flattenCarePlan(),
  dehydrateComposition: flattenComposition(),
  dehydrateCondition: flattenCondition(),
  dehydrateDevice: flattenDevice(),
  dehydrateDiagnosticReport: flattenDiagnosticReport(),
  dehydrateEncounter: flattenEncounter(),
  dehydrateLocation: flattenLocation(),
  dehydrateMeasureReport: flattenMeasureReport(),
  dehydrateMeasure: flattenMeasure(),
  dehydrateMedicationOrder: flattenMedicationOrder(),
  dehydrateMedicationStatement: flattenMedicationStatement(),
  dehydrateObservation: flattenObservation(),
  dehydrateOrganization: flattenOrganization(),
  dehydratePatient: flattenPatient(),
  dehydratePractitioner: flattenPractitioner(),
  dehydrateProcedure: flattenProcedure()
}

export default {
  FhirDehydrator,
  flattenBundle,
  flattenCarePlan,
  flattenComposition,
  flattenCondition,
  flattenDevice,
  flattenDiagnosticReport,
  flattenEncounter,
  flattenLocation,
  flattenMeasureReport,
  flattenMeasure,
  flattenMedicationOrder,
  flattenMedicationStatement,
  flattenObservation,
  flattenOrganization,
  flattenPatient,
  flattenPractitioner,
  flattenProcedure
}

