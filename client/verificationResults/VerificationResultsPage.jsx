import { 
  Container,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Box,
  Grid
} from '@material-ui/core';
import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';


import VerificationResultDetail from './VerificationResultDetail';
import VerificationResultsTable from './VerificationResultsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';



//---------------------------------------------------------------
// Session Variables


Session.setDefault('verificationResultPageTabIndex', 0);
Session.setDefault('verificationResultSearchFilter', '');
Session.setDefault('selectedVerificationResultId', '');
Session.setDefault('selectedVerificationResult', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('verificationResultsArray', []);
Session.setDefault('VerificationResultsPage.onePageLayout', true)
Session.setDefault('VerificationResultsTable.hideCheckbox', true)

//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();



//===========================================================================
// MAIN COMPONENT  

Session.setDefault('verificationResultChecklistMode', false)

export function VerificationResultsPage(props){

  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    verificationResults: [],
    onePageLayout: true,
    verificationResultSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    verificationResultChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('VerificationResultsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('VerificationResultsTable.hideCheckbox');
  }, [])
  data.selectedVerificationResultId = useTracker(function(){
    return Session.get('selectedVerificationResultId');
  }, [])
  data.selectedVerificationResult = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedVerificationResultId'));
  }, [])
  data.verificationResults = useTracker(function(){
    let results = [];
    if(Session.get('verificationResultChecklistMode')){
      results = VerificationResults.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = VerificationResults.find().fetch();
    }

    return results;
  }, [])
  data.verificationResultSearchFilter = useTracker(function(){
    return Session.get('verificationResultSearchFilter')
  }, [])
  data.verificationResultChecklistMode = useTracker(function(){
    return Session.get('verificationResultChecklistMode')
  }, [])

  function handleRowClick(verificationResultId){
    console.log('VerificationResultsPage.handleRowClick', verificationResultId)
    let verificationResult = VerificationResults.findOne({id: verificationResultId});

    if(verificationResult){
      Session.set('selectedVerificationResultId', get(verificationResult, 'id'));
      Session.set('selectedVerificationResult', verificationResult);
      Session.set('VerificationResult.Current', verificationResult);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "VerificationResultDetail");
        Session.set('mainAppDialogMaxWidth', "md");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit VerificationResult");
        } else {
          Session.set('mainAppDialogTitle', "View VerificationResult");
        }
      }      
    } else {
      console.log('No verificationResult found...')
    }
  }
  function handleChange(event, newValue) {
    Session.set('verificationResultPageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.verificationResults.length + " Verification Results"} />
      <CardContent>

        <VerificationResultsTable 
          verificationResults={ data.verificationResults }
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.verificationResultChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          onRowClick={ handleRowClick.bind(this) }
          count={data.verificationResults.length}
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.verificationResults.length + " Verification Results"} />
          <CardContent>
            <VerificationResultsTable 
              selectedVerificationResultId={ data.selectedVerificationResultId }
              verificationResults={ data.verificationResults }
              hideCheckbox={data.hideCheckbox}
              hideIdentifier={true}               
              hideActionIcons={true}
              hideStatus={false}
              hideName={false}
              hideTitle={false}
              hideVersion={false}
              hideExperimental={false}    
              hideBarcode={true}
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              count={data.verificationResults.length}
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedVerificationResultId }</h1>
          {/* <CardHeader title={data.selectedVerificationResultId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <VerificationResultDetail 
                id='verificationResultDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                verificationResult={ data.selectedVerificationResult }
                verificationResultId={ data.selectedVerificationResultId } 
                showVerificationResultInputs={true}
                showHints={false}

              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  return (
    <PageCanvas id="verificationResultsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default VerificationResultsPage;