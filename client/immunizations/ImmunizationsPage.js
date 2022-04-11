import { 
  Grid,
  Card,
  Button,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Container
} from '@material-ui/core'; 

import { PageCanvas, StyledCard } from 'fhir-starter';

// import ImmunizationDetail from './ImmunizationDetail';
import ImmunizationsTable from './ImmunizationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { Session } from 'meteor/session';

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { get } from 'lodash';


//=============================================================================================================================================
// COMPONENT


Session.setDefault('fhirVersion', 'v1.0.2');

export function ImmunizationsPage(props){

  let data = {
    selectedImmunizationId: Session.get('selectedImmunizationId'),
    selectedImmunization: false,
    immunizations: []
  };

  data.selectedImmunizationId = useTracker(function(){
    return Session.get('selectedImmunizationId');
  }, [])
  data.selectedImmunization = useTracker(function(){
    return Immunizations.findOne({_id: Session.get('selectedImmunizationId')});
  }, [])
  data.immunizations = useTracker(function(){
    return Immunizations.find().fetch();
  }, [])


  if(process.env.NODE_ENV === "test") console.log('ImmunizationsPage.render()', data);

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  let noDataImage = get(Meteor, 'settings.public.defaults.noData.noDataImagePath', "packages/clinical_hl7-fhir-data-infrastructure/assets/NoData.png");  
  let noDataCardStyle = {};

  let [immunizationsPageIndex, setImmunizationsPageIndex] = setState(0);

  let immunizationContent;
  if(data.immunizations.length > 0){
    immunizationContent = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
      <CardHeader title={data.immunizations.length + ' Immunizations'} />
      <CardContent>
        <Grid container>
          <Grid item md={12}>
            <ImmunizationsTable 
              immunizations={data.immunizations }    
              count={ data.immunizations.length }    
              formFactorLayout={formFactor}
              onSetPage={function(index){
                setImmunizationsPageIndex(index)
              }}    
              page={immunizationsPageIndex}                      
            />
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  } else {
    immunizationContent = <Container maxWidth="sm" style={{display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', height: '100%', justifyContent: 'center'}}>
      <img src={Meteor.absoluteUrl() + noDataImage} style={{width: '100%', marginTop: get(Meteor, 'settings.public.defaults.noData.marginTop', '-200px')}} />
      <CardContent>
        <CardHeader 
          title={get(Meteor, 'settings.public.defaults.noData.defaultTitle', "No Data Selected")} 
          subheader={get(Meteor, 'settings.public.defaults.noData.defaultMessage', "Please import some immunization data.")} 
        />
      </CardContent>
    </Container>
  }

  return (
    <PageCanvas id='immunizationsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>      
      { immunizationContent }
    </PageCanvas>
  );
}



export default ImmunizationsPage;