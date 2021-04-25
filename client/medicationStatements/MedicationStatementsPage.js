import { 
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'fhir-starter';

// import MedicationStatementDetail from './MedicationStatementDetail';
import MedicationStatementsTable from './MedicationStatementsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get } from 'lodash';



//=============================================================================================================================================
// COMPONENT

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedMedicationStatementId', false);

export function MedicationStatementsPage(props){

  let data = {
    selectedMedicationStatementId: '',
    selectedMedicationStatement: null,
    medicationStatements: [],
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('MedicationStatementsPage.onePageLayout');
  }, [])
  data.selectedMedicationStatementId = useTracker(function(){
    return Session.get('selectedMedicationStatementId');
  }, [])
  data.selectedMedicationStatement = useTracker(function(){
    return MedicationStatements.findOne(Session.get('selectedMedicationStatementId'));
  }, [])
  data.medicationStatements = useTracker(function(){
    return MedicationStatements.find().fetch();
  }, [])


  if(process.env.NODE_ENV === "test") console.log('In MedicationStatementsPage render');

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  return (
    <PageCanvas id="medicationStatementsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
          <CardHeader title={data.medicationStatements.length + ' Medication Statements'} />
          <CardContent>
            <MedicationStatementsTable 
              fhirVersion={ data.fhirVersion } 
              medicationStatements={data.medicationStatements} 
              count={data.medicationStatements.length}
              rowsPerPage={20}
              medicationsCursor={Medications}
            />
          </CardContent>
      </StyledCard>        
    </PageCanvas>
  );
}



export default MedicationStatementsPage;