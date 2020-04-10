
import FhirUtilities from './lib/FhirUtilities';
import FhirDehydrator from './lib/FhirDehydrator';

import AllergyIntolerancesPage from './client/allergyIntolerances/AllergyIntolerancesPage';
import AllergyIntolerancesTable from './client/allergyIntolerances/AllergyIntolerancesTable';
import AllergyIntoleranceDetail from './client/allergyIntolerances/AllergyIntoleranceDetail';

import BundlesPage from './client/bundles/BundlesPage';
import BundleTable from './client/bundles/BundleTable';
import BundleDetail from './client/bundles/BundleDetail';

import CarePlansPage from './client/carePlans/CarePlansPage';
import CarePlansTable from './client/carePlans/CarePlansTable';
import CarePlanDetail from './client/carePlans/CarePlanDetail';

import CompositionsPage from './client/compositions/CompositionsPage';
import CompositionsTable from './client/compositions/CompositionsTable';
import CompositionDetail from './client/compositions/CompositionDetail';

import ConditionsPage from './client/conditions/ConditionsPage';
import ConditionsTable from './client/conditions/ConditionsTable';
import ConditionDetail from './client/conditions/ConditionDetail';

import DevicesPage from './client/devices/DevicesPage';
import DevicesTable from './client/devices/DevicesTable';
import DeviceDetail from './client/devices/DeviceDetail';

import DiagnosticReportsPage from './client/diagnosticReports/DiagnosticReportsPage';
import DiagnosticReportsTable from './client/diagnosticReports/DiagnosticReportsTable';
import DiagnosticReportDetail from './client/diagnosticReports/DiagnosticReportDetail';

import EncountersPage from './client/encounters/EncountersPage';
import EncountersTable from './client/encounters/EncountersTable';
import EncounterDetail from './client/encounters/EncounterDetail';

import ImmunizationsPage from './client/immunizations/ImmunizationsPage';
import ImmunizationsTable from './client/immunizations/ImmunizationsTable';
import ImmunizationDetail from './client/immunizations/ImmunizationDetail';

import LocationsTable from './client/locations/LocationsTable';
import LocationsPage from './client/locations/LocationsPage';

import MeasuresPage from './client/measures/MeasuresPage';
import MeasuresTable from './client/measures/MeasuresTable';
import MeasureDetail from './client/measures/MeasureDetail';

import MeasureReportsPage from './client/measureReports/MeasureReportsPage';
import MeasureReportsTable from './client/measureReports/MeasureReportsTable';
import MeasureReportDetail from './client/measureReports/MeasureReportDetail';

import MedicationsPage from './client/medications/MedicationsPage';
import MedicationsTable from './client/medications/MedicationsTable';
import MedicationDetail from './client/medications/MedicationDetail';

import MedicationOrdersPage from './client/medicationOrders/MedicationOrdersPage';
import MedicationOrdersTable from './client/medicationOrders/MedicationOrdersTable';
import MedicationOrderDetail from './client/medicationOrders/MedicationOrderDetail';

import MedicationStatementsPage from './client/medicationStatements/MedicationStatementsPage';
import MedicationStatementsTable from './client/medicationStatements/MedicationStatementsTable';
import MedicationStatementDetail from './client/medicationStatements/MedicationStatementDetail';

import ObservationsPage from './client/observations/ObservationsPage';
import ObservationsTable from './client/observations/ObservationsTable';
import ObservationDetail from './client/observations/ObservationDetail';

import OrganizationsPage from './client/organizations/OrganizationsPage';
import OrganizationsTable from './client/organizations/OrganizationsTable';
import OrganizationDetail from './client/organizations/OrganizationDetail';

import PatientsPage from './client/patients/PatientsPage';

import PractitionersPage from './client/practitioners/PractitionersPage';
import PractitionersTable from './client/practitioners/PractitionersTable';
import PractitionerDetail from './client/practitioners/PractitionerDetail';

import ProceduresPage from './client/procedures/ProceduresPage';
import ProceduresTable from './client/procedures/ProceduresTable';
import ProcedureDetail from './client/procedures/ProcedureDetail';


let DynamicRoutes = [{
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
  'name': 'CompositionsPage',
  'path': '/compositions',
  'component': CompositionsPage,
  'requireAuth': true
}, {
  'name': 'DevicesPage',
  'path': '/devices',
  'component': DevicesPage,
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
  'name': 'LocationsPage',
  'path': '/locations',
  'component': LocationsPage,
  'requireAuth': true
}, {
  'name': 'MeasuresPage',
  'path': '/measures',
  'component': MeasuresPage,
  'requireAuth': true
}, {
  'name': 'MeasureReportsPage',
  'path': '/measure-reports',
  'component': MeasureReportsPage,
  'requireAuth': true
}, {
  'name': 'MedicationsPage',
  'path': '/medications',
  'component': MedicationsPage,
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
  'name': 'OrganizationsPage',
  'path': '/organizations',
  'component': OrganizationsPage,
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

let SidebarElements = [{
  'primaryText': 'Allergies & Intolerances',
  'to': '/allergies',
  'href': '/allergies'
}, {
  'primaryText': 'Bundles',
  'to': '/bundles',
  'href': '/bundles',
  'iconName': 'suitcase'  
}, {
  'primaryText': 'Care Plans',
  'to': '/careplans',
  'href': '/careplans',
  'iconName': 'notepad'  
}, {
  'primaryText': 'Conditions',
  'to': '/conditions',
  'href': '/conditions',
  'iconName': 'heartbeat'  
}, {
  'primaryText': 'Devices',
  'to': '/devices',
  'href': '/devices',
  'iconName': 'ic_devices'  
}, {
  'primaryText': 'Diagnostic Reports',
  'to': '/diagnostic-reports',
  'href': '/diagnostic-reports'
}, {
  'primaryText': 'Encounters',
  'to': '/encounters',
  'href': '/encounters',
  'iconName': 'ic_transfer_within_a_station'
}, {
  'primaryText': 'Immunizations',
  'to': '/immunizations',
  'href': '/immunizations',
  'iconName': 'eyedropper'  
}, {
  'primaryText': 'Locations',
  'to': '/locations',
  'href': '/locations',
  'iconName': 'location' 
}, {
  'primaryText': 'Measures',
  'to': '/measures',
  'href': '/measures'
}, {
  'primaryText': 'Measure Reports',
  'to': '/measure-reports',
  'href': '/measure-reports'
}, {
  'primaryText': 'Medications',
  'to': '/medications',
  'href': '/medications',
  'iconName': 'erlenmeyerFlask'  
}, {
  'primaryText': 'Medication Orders',
  'to': '/medication-orders',
  'href': '/medication-orders',
  'iconName': 'ic_local_pharmacy'  
}, {
  'primaryText': 'Medication Statements',
  'to': '/medication-statements',
  'href': '/medication-statements',
  'iconName': 'ic_local_pharmacy'  
}, {
  'primaryText': 'Observations',
  'to': '/observations',
  'href': '/observations',
  'iconName': 'iosPulseStrong' 
}, {
  'primaryText': 'Organizations',
  'to': '/organizations',
  'href': '/organizations',
  'iconName': 'hospitalO'
}, {
  'primaryText': 'Patients',
  'to': '/patients',
  'href': '/patients',
  'iconName': 'users'
}, {
  'primaryText': 'Practitioners',
  'to': '/practitioners',
  'href': '/practitioners',
  'iconName': 'userMd'
}, {
  'primaryText': 'Procedures',
  'to': '/procedures',
  'href': '/procedures',
  'iconName': 'bath'
}];
  
let AdminSidebarElements = [{
  'primaryText': 'Allergies & Intolerances',
  'to': '/allergies',
  'href': '/allergies'
}, {
  'primaryText': 'Bundles',
  'to': '/bundles',
  'href': '/bundles'
}, {
  'primaryText': 'Care Plans',
  'to': '/careplans',
  'href': '/careplans'
}, {
  'primaryText': 'Devices',
  'to': '/devices',
  'href': '/devices'
}, {
  'primaryText': 'Diagnostic Reports',
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
},  {
  'primaryText': 'Measures',
  'to': '/measures',
  'href': '/measures'
}, {
  'primaryText': 'Measure Reports',
  'to': '/measure-reports',
  'href': '/measure-reports'
}, {
  'primaryText': 'Medications',
  'to': '/medications',
  'href': '/medications'
}, {
  'primaryText': 'Medication Orders',
  'to': '/medication-orders',
  'href': '/medication-orders'
}, {
  'primaryText': 'Medication Statements',
  'to': '/medication-statements',
  'href': '/medication-statements'
}, {
  'primaryText': 'Observations',
  'to': '/observations',
  'href': '/observations'
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
  AllergyIntolerancesTable,
  AllergyIntoleranceDetail,

  BundlesPage,
  BundleTable,
  BundleDetail,

  CarePlansPage,
  CarePlansTable,
  CarePlanDetail,

  CompositionsPage,
  CompositionsTable,
  CompositionDetail,

  ConditionsPage,
  ConditionsTable,
  ConditionDetail,

  DevicesPage,
  DevicesTable,
  DeviceDetail,

  DiagnosticReportsPage,
  DiagnosticReportsTable,
  DiagnosticReportDetail,

  EncountersPage,
  EncountersTable,
  EncounterDetail,

  ImmunizationsPage,
  ImmunizationsTable,
  ImmunizationDetail,

  LocationsTable,
  LocationPage,

  MeasuresPage,
  MeasuresTable,
  MeasureDetail,

  MeasureReportsPage,
  MeasureReportsTable,
  MeasureReportDetail,

  MedicationsPage,
  MedicationsTable,
  MedicationDetail,

  MedicationOrdersPage,
  MedicationOrdersTable,
  MedicationOrderDetail,

  MedicationStatementsPage,
  MedicationStatementsTable,
  MedicationStatementDetail,

  ObservationsPage,
  ObservationsTable,
  ObservationDetail,

  OrganizationsPage,
  OrganizationsTable,
  OrganizationDetail,

  PatientsPage,

  PractitionersPage,
  PractitionersTable,
  PractitionerDetail,

  ProceduresPage,
  ProceduresTable,
  ProcedureDetail,

  FhirDehydrator,
  FhirUtilities
};




