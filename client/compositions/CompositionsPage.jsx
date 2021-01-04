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
import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import CompositionDetail from './CompositionDetail';
import CompositionsTable from './CompositionsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas, DynamicSpacer } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


//---------------------------------------------------------------
// Session Variables

Session.setDefault('compositionPageTabIndex', 0);
Session.setDefault('compositionSearchFilter', '');
Session.setDefault('selectedCompositionId', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('compositionsArray', []);
Session.setDefault('CompositionsPage.onePageLayout', false)
Session.setDefault('selectedCompositionId', '')

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();

//---------------------------------------------------------------
// Main Component

export function CompositionsPage(props){

  let data = {
    selectedCompositionId: Session.get("selectedCompositionId"),
    selectedComposition: false,
    onePageLayout: true,
    selected: [],
    compositions: [],
    selectedComposition: {}
  };

  data.selectedCompositionId = useTracker(function(){
    return Session.get('selectedCompositionId');
  }, [])
  data.selectedComposition = useTracker(function(){
    return Compositions.findOne({id: Session.get('selectedCompositionId')});
  }, [])
  data.compositions = useTracker(function(){
    return Compositions.find().fetch();
  }, [])

  data.onePageLayout = useTracker(function(){
    return Session.get('CompositionsPage.onePageLayout');
  }, [])


  function compositionRowClick(id){
    console.log('compositionRowClick', id)
    Session.set('selectedCompositionId', id)
  }


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();
  
  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" scrollable={true} margin={20}>
      <CardHeader
        title="Compositions"
      />
      <CardContent>
        <CompositionsTable 
          compositions={ data.compositions }
          paginationLimit={10}
          />
      </CardContent>
    </StyledCard>
  } else {

    let sectionCards = [];
    let componentSections = get(data.selectedComposition, 'section', []);
    if(Array.isArray(componentSections)){
      componentSections.forEach(function(section){
        sectionCards.push(<StyledCard>
          <CardHeader title={get(section, 'title', '')} />
          <CardContent style={{maxHeight: '200px'}} >
            <div className="dangerouslySetInnerHTML" dangerouslySetInnerHTML={{__html: get(section, 'text.div', '')}} style={{width: '100%'}}></div>
          </CardContent>      
        </StyledCard>)
        sectionCards.push(<DynamicSpacer />)
      })
    }

    layoutContents = <Grid container spacing={3}>
      <Grid item md={8}>
        <StyledCard height="auto" scrollable={true} margin={20}>
          <CardHeader
            title="Compositions"
          />
          <CardContent>
            <CompositionsTable 
              compositions={ data.compositions }
              paginationLimit={10}
              hideBarcode={true}
              hideIdentifier={true}
              hideSubjectReference={true}
              onRowClick={compositionRowClick.bind(this)}
            />            
          </CardContent>
        </StyledCard>

      </Grid>
      <Grid item md={4}>
        <StyledCard scrollable={true} margin={20}>
          <h2 className="barcode barcodes">{data.selectedCompositionId}</h2>            
        </StyledCard>
        <DynamicSpacer />
        {/* <StyledCard scrollable={true} margin={20}>
          <CardContent style={{maxHeight: '200px'}}>
            <pre>
              {JSON.stringify(data.selectedComposition, null, 2)}
            </pre>
          </CardContent>      
        </StyledCard>
        <DynamicSpacer /> */}

        <StyledCard scrollable={true} margin={20} style={{paddingBottom: '20px'}}>
          <CardHeader title="Metadata" />
          <CardContent style={{maxHeight: '200px', paddingBottom: '20px'}}>
            <CompositionDetail 
              composition={data.selectedComposition}
            />
          </CardContent>      
        </StyledCard>
        <DynamicSpacer />
        { sectionCards }
      </Grid>
    </Grid>
    
    
    
  }

  return (
    <PageCanvas id="compositionsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>      
    </PageCanvas>
  );
}


export default CompositionsPage;