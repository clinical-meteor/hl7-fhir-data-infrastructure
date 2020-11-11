import { 
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas, DynamicSpacer } from 'material-fhir-ui';

import React  from 'react';
import ReactMixin  from 'react-mixin';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';

// import MedicationDetail from './MedicationDetail';
import MedicationsTable from './MedicationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { get } from 'lodash';

// import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';




//=============================================================================================================================================
// COMPONENT

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedMedicationId', false);
Session.setDefault('MedicationsPage.onePageLayout', true)

export function MedicationsPage(props){
  let data = {
    selectedMedicationId: '',
    selectedMedication: null,
    medications: [],
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('MedicationsPage.onePageLayout');
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


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  let cardWidth = window.innerWidth - paddingWidth;

  return (
    <PageCanvas id='medicationsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
          <CardHeader
            title={this.data.medicationsCount + " Medications"}
          />
          <CardContent>
            <MedicationsTable 
              medications={this.data.medications}
              count={this.data.medicationsCount}
              selectedMedicationId={this.data.selectedMedicationId}
              rowsPerPage={LayoutHelpers.calcTableRows()}
            />
          </CardContent>
        </StyledCard>
    </PageCanvas>
  );
}


export default MedicationsPage;