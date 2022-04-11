import { 
  Grid, 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button
} from '@material-ui/core'; 

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { StyledCard, PageCanvas } from 'fhir-starter';

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
  
  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  
  let noDataCardStyle = {};

  let [conditionsPageIndex, setConditionsPageIndex] = setState(0);

  let conditionContent;
  if(data.conditions.length > 0){
    conditionContent = <StyledCard height="auto" scrollable={true} margin={20}>
      <CardHeader title={ data.conditions.length + " Conditions"} />
      <CardContent>
        <ConditionsTable 
          id='conditionsTable'
          conditions={data.conditions}
          count={data.conditions.length}  
          formFactorLayout={formFactor}
          rowsPerPage={LayoutHelpers.calcTableRows()} 
          actionButtonLabel="Remove"
          hideActionButton={get(Meteor, 'settings.public.modules.fhir.Conditions.hideRemoveButtonOnTable', true)}
          onActionButtonClick={function(selectedId){
            Conditions._collection.remove({_id: selectedId})
          }}
          onSetPage={function(index){
            setConditionsPageIndex(index)
          }}        
          page={conditionsPageIndex}
        />
      </CardContent>
    </StyledCard>
  } else {
    conditionContent = <Container maxWidth="sm" style={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', height: '100%', justifyContent: 'center'}}>
      <img src={Meteor.absoluteUrl() + noDataImage} style={{width: '100%', marginTop: get(Meteor, 'settings.public.defaults.noData.marginTop', '-200px')}} />    
      <CardContent>
        <CardHeader 
          title={get(Meteor, 'settings.public.defaults.noData.defaultTitle', "No Data Selected")} 
          subheader={get(Meteor, 'settings.public.defaults.noData.defaultMessage', "Please import some vital sign data, and then select a biomarker type.")} 
        />
      </CardContent>
    </Container>
  }
  
  return (
    <PageCanvas id="conditionsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      { conditionContent }
    </PageCanvas>
  );
}



export default ConditionsPage;
