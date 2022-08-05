import React, { useState } from 'react';

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

import CarePlansTable from './CarePlansTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

import { useTracker } from 'meteor/react-meteor-data';
import FhirDehydrator from '../../lib/FhirDehydrator';

import { get } from 'lodash';



//=============================================================================================================================================
// SESSION VARIABLES

Session.setDefault('carePlanPageTabIndex', 1); 
Session.setDefault('carePlanSearchFilter', ''); 
Session.setDefault('selectedCarePlanId', false);
Session.setDefault('selectedCarePlan', false)
Session.setDefault('CarePlansPage.onePageLayout', true)
Session.setDefault('CarePlansPage.defaultQuery', {})
Session.setDefault('CarePlansTable.hideCheckbox', true)
Session.setDefault('CarePlansTable.carePlansIndex', 0)


//=============================================================================================================================================
// COMPONENT

function CarePlansPage(props){

  let data = {    
    selectedCarePlanId: null,
    carePlans: [],
    onePageLayout: true,
    showSystemIds: false,
    showFhirIds: false,
    carePlansIndex: 0
  };

  data.selectedCarePlanId = useTracker(function(){
    return Session.get('selectedCarePlanId');
  }, [])
  data.carePlans = useTracker(function(){
    return CarePlans.find().fetch();
  }, [])
  data.carePlansIndex = useTracker(function(){
    return Session.get('CarePlansTable.carePlansIndex')
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


  return (
    <PageCanvas id='carePlansPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height='auto' width={cardWidth + 'px'} margin={20} >
        <CardHeader title={ data.carePlans.length + ' CarePlans'} />
        <CardContent>
          <CarePlansTable 
            carePlans={ data.carePlans}
            count={ data.carePlans.length}
            formFactorLayout={formFactor}
            rowsPerPage={LayoutHelpers.calcTableRows()}
            onSetPage={function(index){
              setCarePlansPageIndex(index)
            }}  
            page={data.carePlansIndex}
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}


export default CarePlansPage;