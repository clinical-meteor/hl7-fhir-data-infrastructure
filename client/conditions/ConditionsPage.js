import { 
  CssBaseline,
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

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

// import ConditionDetail from './ConditionDetail';
import ConditionsTable from './ConditionsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { get } from 'lodash';



//=============================================================================================================================================
// SESSION VARIABLES

Session.setDefault('selectedConditionId', false);



//=============================================================================================================================================
// MAIN COMPONENT

export function ConditionsPage(props){

  let data = {
    currentConditionId: '',
    selectedCondition: null,
    conditions: []
  };

  data.selectedConditionId = useTracker(function(){
    return Session.get('selectedConditionId');
  }, [])
  data.selectedCondition = useTracker(function(){
    return Conditions.findOne({_id: Session.get('selectedConditionId')});
  }, [])
  data.conditions = useTracker(function(){
    return Conditions.find().fetch();
  }, [])


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  
  return (
    <PageCanvas id="conditionsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <StyledCard height="auto" scrollable={true} margin={20}>
        <CardHeader title={ data.conditions.length + " Conditions"} />
        <CardContent>

          <ConditionsTable 
            id='conditionsTable'
            conditions={data.conditions}
            count={data.conditions.length}  
            formFactorLayout={formFactor}
            rowsPerPage={LayoutHelpers.calcTableRows()}
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}



export default ConditionsPage;
