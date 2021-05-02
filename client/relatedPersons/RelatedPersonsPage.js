import React  from 'react';

import { 
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'fhir-starter';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import RelatedPersonsTable from './RelatedPersonsTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

import { useTracker } from 'meteor/react-meteor-data';
import FhirDehydrator from '../../lib/FhirDehydrator';

import { get } from 'lodash';



//=============================================================================================================================================
// COMPONENT

function RelatedPersonsPage(props){

  let data = {    
    selectedCarePlanId: null,
    relatedPersons: []
  };

  data.selectedCarePlanId = useTracker(function(){
    return Session.get('selectedCarePlanId');
  }, [])
  data.relatedPersons = useTracker(function(){
    return RelatedPersons.find().fetch();
  }, [])


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  return (
    <PageCanvas id='relatedPersonsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height='auto' width={cardWidth + 'px'} margin={20} >
        <CardHeader title={ data.relatedPersons.length + ' Care Teams'} />
        <CardContent>
          <RelatedPersonsTable 
            relatedPersons={ data.relatedPersons}
            count={ data.relatedPersons.length}
            formFactorLayout={formFactor}
            rowsPerPage={LayoutHelpers.calcTableRows()}
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}


export default RelatedPersonsPage;