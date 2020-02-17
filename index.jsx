

import AllergyIntolerancesPage from './client/allergyIntolerances/AllergyIntolerancesPage';
import AllergyIntolerancesTable from './client/allergyIntolerances/AllergyIntolerancesTable';
import AllergyIntoleranceDetail from './client/allergyIntolerances/AllergyIntoleranceDetail';

import BundlesPage from './client/bundles/BundlesPage';
import BundleTable from './client/bundles/BundleTable';
import BundleDetail from './client/bundles/BundleDetail';

import CarePlansPage from './client/carePlans/CarePlansPage';
import CarePlanTable from './client/carePlans/CarePlanTable';
import CarePlanDetail from './client/carePlans/CarePlanDetail';

import ConditionsPage from './client/condition/ConditionsPage';
import ConditionTable from './client/condition/ConditionTable';
import ConditionDetail from './client/condition/ConditionDetail';

import DiagnosticReportsPage from './client/diagnosticReports/DiagnosticReportsPage';
import DiagnosticReportTable from './client/diagnosticReports/DiagnosticReportTable';
import DiagnosticReportDetail from './client/diagnosticReports/DiagnosticReportDetail';

import EncountersPage from './client/encounters/EncountersPage';
import EncountersTable from './client/encounters/EncountersTable';
import EncounterDetail from './client/encounters/EncounterDetail';

import ImmunizationsPage from './client/immunizations/ImmunizationsPage';
import ImmunizationTable from './client/immunizations/ImmunizationTable';
import ImmunizationDetail from './client/immunizations/ImmunizationDetail';

import MedicationOrdersPage from './client/medicationOrders/MedicationOrdersPage';
import MedicationOrderTable from './client/medicationOrders/MedicationOrderTable';
import MedicationOrderDetail from './client/medicationOrders/MedicationOrderDetail';

import MedicationStatementsPage from './client/medicationStatements/MedicationStatementsPage';
import MedicationStatementTable from './client/medicationStatements/MedicationStatementTable';
import MedicationStatementDetail from './client/medicationStatements/MedicationStatementDetail';

import ObservationsPage from './client/observations/ObservationsPage';
import ObservationTable from './client/observations/ObservationTable';
import ObservationDetail from './client/observations/ObservationDetail';

// import PatientsPage from './client/patients/NewPatientsPage';
import PatientsPage from './client/patients/PatientsPage';

import PractitionersPage from './client/practitioners/PractitionersPage';
import PractitionerTable from './client/practitioners/PractitionerTable';
import PractitionerDetail from './client/practitioners/PractitionerDetail';

import ProceduresPage from './client/procedures/ProceduresPage';
import ProcedureTable from './client/procedures/ProcedureTable';
import ProcedureDetail from './client/procedures/ProcedureDetail';


var DynamicRoutes = [{
  'name': 'AllergyIntolerancesPage',
  'path': '/allergies',
  'component': AllergyIntolerancesPage,
  'requireAuth': true
}, {
  'name': 'BundlePage',
  'path': '/bundles',
  'component': BundlesPage,
  'requireAuth': true
}, {
  'name': 'CarePlansPage',
  'path': '/careplans',
  'component': CarePlansPage,
  'requireAuth': true
}, {
  'name': 'ConditionsPage',
  'path': '/conditions',
  'component': ConditionsPage,
  'requireAuth': true
}, {
  'name': 'DiagnosticReportsPage',
  'path': '/diagnostic-reports',
  'component': DiagnosticReportsPage,
  'requireAuth': true
}, {
  'name': 'EncountersPage',
  'path': '/encounters',
  'component': EncountersPage,
  'requireAuth': true
}, {
  'name': 'ImmunizationsPage',
  'path': '/immunizations',
  'component': ImmunizationsPage,
  'requireAuth': true
}, {
  'name': 'MedicationOrdersPage',
  'path': '/medication-orders',
  'component': MedicationOrdersPage,
  'requireAuth': true
}, {
  'name': 'MedicationStatementsPage',
  'path': '/medication-statements',
  'component': MedicationStatementsPage,
  'requireAuth': true
}, {
  'name': 'ObservationsPage',
  'path': '/observations',
  'component': ObservationsPage,
  'requireAuth': true
}, {
  'name': 'PatientPage',
  'path': '/patients',
  'component': PatientsPage,
  'requireAuth': true
}, {
  'name': 'PractitionersPage',
  'path': '/practitioners',
  'component': PractitionersPage,
  'requireAuth': true
}, {
  'name': 'ProceduresPage',
  'path': '/procedures',
  'component': ProceduresPage,
  'requireAuth': true
} ];

var SidebarElements = [{
  'primaryText': 'Allergies & Intolerances',
  'to': '/allergies',
  'href': '/allergies'
}, {
  'primaryText': 'Bundles',
  'to': '/bundles',
  'href': '/bundles'
}, {
  'primaryText': 'CarePlans',
  'to': '/careplans',
  'href': '/careplans'
}, {
  'primaryText': 'DiagnosticReports',
  'to': '/diagnostic-reports',
  'href': '/diagnostic-reports'
}, {
  'primaryText': 'Encounters',
  'to': '/encounters',
  'href': '/encounters'
}, {
  'primaryText': 'Immunizations',
  'to': '/immunizations',
  'href': '/immunizations'
}, {
  'primaryText': 'MedicationOrders',
  'to': '/medication-orders',
  'href': '/medication-orders'
}, {
  'primaryText': 'MedicationStatements',
  'to': '/medication-statements',
  'href': '/medication-statements'
}, {
  'primaryText': 'Observations',
  'to': '/observations',
  'href': '/observations'
}, {
  'primaryText': 'Patients',
  'to': '/patients',
  'href': '/patients'
}, {
  'primaryText': 'Practitioners',
  'to': '/practitioners',
  'href': '/practitioners'
}, {
  'primaryText': 'Procedures',
  'to': '/procedures',
  'href': '/procedures'
}];
  
var AdminSidebarElements = [{
  'primaryText': 'Allergies & Intolerances',
  'to': '/allergies',
  'href': '/allergies'
}, {
  'primaryText': 'Bundles',
  'to': '/bundles',
  'href': '/bundles'
}, {
  'primaryText': 'CarePlans',
  'to': '/careplans',
  'href': '/careplans'
}, {
  'primaryText': 'DiagnosticReports',
  'to': '/diagnostic-reports',
  'href': '/diagnostic-reports'
}, {
  'primaryText': 'Encounters',
  'to': '/encounters',
  'href': '/encounters'
}, {
  'primaryText': 'Immunizations',
  'to': '/immunizations',
  'href': '/immunizations'
}, {
  'primaryText': 'MedicationOrders',
  'to': '/medication-orders',
  'href': '/medication-orders'
}, {
  'primaryText': 'MedicationStatements',
  'to': '/medication-statements',
  'href': '/medication-statements'
}, {
  'primaryText': 'Observations',
  'to': '/observations',
  'href': '/observations'
}, {
  'primaryText': 'Patients',
  'to': '/patients',
  'href': '/patients'
}, {
  'primaryText': 'Practitioners',
  'to': '/practitioners',
  'href': '/practitioners'
}, {
  'primaryText': 'Procedures',
  'to': '/procedures',
  'href': '/procedures'
}];



export { 
  SidebarElements,
  AdminSidebarElements, 
  DynamicRoutes, 

  AllergyIntolerancesPage,
  AllergyIntoleranceTable,
  AllergyIntoleranceDetail,

  BundlesPage,
  BundleTable,
  BundleDetail,

  CarePlansPage,
  CarePlanTable,
  CarePlanDetail,

  ConditionsPage,
  ConditionTable,
  ConditionDetail,

  DiagnosticReportsPage,
  DiagnosticReportTable,
  DiagnosticReportDetail,

  EncountersPage,
  EncounterTable,
  EncounterDetail,


  ImmunizationsPage,
  ImmunizationTable,
  ImmunizationDetail,

  MedicationOrdersPage,
  MedicationOrderTable,
  MedicationOrderDetail,

  MedicationStatementsPage,
  MedicationStatementTable,
  MedicationStatementDetail,

  ObservationsPage,
  ObservationTable,
  ObservationDetail,

  PatientsPage,

  PractitionersPage,
  PractitionerTable,
  PractitionerDetail,

  ProceduresPage,
  ProcedureTable,
  ProcedureDetail
};


