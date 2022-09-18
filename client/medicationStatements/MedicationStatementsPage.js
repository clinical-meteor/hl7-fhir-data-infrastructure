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

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { get } from 'lodash';


//=============================================================================================================================================
// SESSION VARIABLES

Session.setDefault('medicationStatementPageTabIndex', 1); 
Session.setDefault('medicationStatementSearchFilter', ''); 
Session.setDefault('selectedMedicationStatementId', false);
Session.setDefault('selectedMedicationStatement', false)
Session.setDefault('MedicationStatementsPage.onePageLayout', true)
Session.setDefault('MedicationStatementsPage.defaultQuery', {})
Session.setDefault('MedicationStatementsTable.hideCheckbox', true)
Session.setDefault('MedicationStatementsTable.medicationStatementsIndex', 0)



//=============================================================================================================================================
// COMPONENT

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedMedicationStatementId', false);

export function MedicationStatementsPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  
  
  let cardWidth = window.innerWidth - paddingWidth;

  
  let data = {
    selectedMedicationStatementId: '',
    selectedMedicationStatement: null,
    medicationStatements: [],
    onePageLayout: true,
    onePageLayout: true,
    showSystemIds: false,
    showFhirIds: false,
    organizationsIndex: 0
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

  data.medicationStatementsIndex = useTracker(function(){
    return Session.get('MedicationStatementsTable.medicationStatementsIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])

  function setMedicationStatementsIndex(newIndex){
    Session.set('MedicationStatementsTable.medicationStatementsIndex', newIndex)
  }

  if(process.env.NODE_ENV === "test") console.log('In MedicationStatementsPage render');


  let layoutContent;
  if(data.medicationStatements.length > 0){
    layoutContent = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
      <CardHeader title={data.medicationStatements.length + ' Medication Statements'} />
      <CardContent>
        <MedicationStatementsTable 
          fhirVersion={ data.fhirVersion } 
          medicationStatements={data.medicationStatements} 
          count={data.medicationStatements.length}
          rowsPerPage={20}
          medicationsCursor={Medications}
          onSetPage={function(index){
            setMedicationStatementsIndex(index)
          }}       
          page={data.medicationStatementsIndex}                       
        />
      </CardContent>
  </StyledCard>    
  } else {
    layoutContent = <Container maxWidth="sm" style={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', height: '100%', justifyContent: 'center'}}>
      <img src={Meteor.absoluteUrl() + noDataImage} style={{width: '100%', marginTop: get(Meteor, 'settings.public.defaults.noData.marginTop', '-200px')}} />    
      <CardContent>
        <CardHeader 
          title={get(Meteor, 'settings.public.defaults.noData.defaultTitle', "No Data Available")} 
          subheader={get(Meteor, 'settings.public.defaults.noData.defaultMessage', "No records were found in the client data cursor.  To debug, check the data cursor in the client console, then check subscriptions and publications, and relevant search queries.  If the data is not loaded in, use a tool like Mongo Compass to load the records directly into the Mongo database, or use the FHIR API interfaces.")} 
        />
      </CardContent>
    </Container>
  }


  return (
    <PageCanvas id="medicationStatementsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      { layoutContent }   
    </PageCanvas>
  );
}



export default MedicationStatementsPage;