import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { 
  CardHeader,
  CardContent,
  Container,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas, DynamicSpacer } from 'fhir-starter';


import MedicationsTable from './MedicationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { get } from 'lodash';

// import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';




//=============================================================================================================================================
// COMPONENT

Session.setDefault('medicationPageTabIndex', 1); 
Session.setDefault('medicationSearchFilter', ''); 
Session.setDefault('selectedMedicationId', false);
Session.setDefault('selectedMedication', false)
Session.setDefault('MedicationsPage.onePageLayout', true)
Session.setDefault('MedicationsPage.defaultQuery', {})
Session.setDefault('MedicationsTable.hideCheckbox', true)
Session.setDefault('MedicationsTable.medicationsIndex', 0)


export function MedicationsPage(props){
  let data = {
    selectedMedicationId: '',
    selectedMedication: null,
    medications: [],
    onePageLayout: true,
    showSystemIds: false,
    showFhirIds: false,
    organizationsIndex: 0

  };

  data.onePageLayout = useTracker(function(){
    return Session.get('MedicationsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('MedicationsTable.hideCheckbox');
  }, [])
  data.selectedMedicationId = useTracker(function(){
    return Session.get('selectedMedicationId');
  }, [])
  data.selectedMedication = useTracker(function(){
    return Medications.findOne(Session.get('selectedMedicationId'));
  }, [])
  data.medications = useTracker(function(){
    return Medications.find().fetch();
  }, [])
  data.medicationsIndex = useTracker(function(){
    return Session.get('MedicationsTable.medicationsIndex')
  }, [])
  data.showSystemIds = useTracker(function(){
    return Session.get('showSystemIds');
  }, [])
  data.showFhirIds = useTracker(function(){
    return Session.get('showFhirIds');
  }, [])


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  let cardWidth = window.innerWidth - paddingWidth;
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  


  // let [medicationsIndex, setMedicationsIndex] = setState(0);

  let layoutContent;
  if(data.medications.length > 0){
    layoutContent = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
        <CardHeader
          title={data.medications.length + " Medications"}
        />
        <CardContent>
          <MedicationsTable 
            medications={data.medications}
            count={data.medications.length}
            selectedMedicationId={data.selectedMedicationId}
            onSetPage={function(index){
              setMedicationsIndex(index)
            }}     
            page={data.medicationsIndex}                         
            rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
            size="medium"
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
    <PageCanvas id='medicationsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      { layoutContent }
    </PageCanvas>
  );
}


export default MedicationsPage;