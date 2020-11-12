import { 
  Card,
  CardHeader,
  CardContent,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// import CarePlanDetail from './CarePlanDetail';
import CarePlansTable from './CarePlansTable';

import LayoutHelpers from '../../lib/LayoutHelpers';

import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get } from 'lodash';



//=============================================================================================================================================
// COMPONENT

function CarePlansPage(props){

  let data = {    
    selectedCarePlanId: null,
    carePlans: []
  };

  data.selectedCarePlanId = useTracker(function(){
    return Session.get('selectedCarePlanId');
  }, [])
  data.carePlans = useTracker(function(){
    return CarePlans.find().fetch();
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
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}


export default CarePlansPage;