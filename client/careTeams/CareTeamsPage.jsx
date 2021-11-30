import React  from 'react';

import { 
  Grid,
  CardHeader,
  CardContent
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'fhir-starter';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import CareTeamDetail from './CareTeamDetail';
import CareTeamsTable from './CareTeamsTable';

import { useTracker } from 'meteor/react-meteor-data';
import FhirDehydrator from '../../lib/FhirDehydrator';

import { get, cloneDeep } from 'lodash';

import LayoutHelpers from '../../lib/LayoutHelpers';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


//---------------------------------------------------------------
// Theming

const muiTheme = Theming.createMuiTheme();


//---------------------------------------------------------------
// Session Variables


Session.setDefault('careTeamPageTabIndex', 0);
Session.setDefault('careTeamSearchFilter', '');
Session.setDefault('selectedCareTeamId', '');
Session.setDefault('selectedCareTeam', false);
Session.setDefault('CareTeamsPage.onePageLayout', true)
Session.setDefault('CareTeamsTable.hideCheckbox', true)



//=============================================================================================================================================
// COMPONENT

function CareTeamsPage(props){

  let data = {    
    selectedCareTeam: null,
    selectedCareTeamId: '',
    onePageLayout: true,
    hideCheckbox: true,
    careTeams: []
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('CareTeamsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('CareTeamsTable.hideCheckbox');
  }, [])

  data.selectedCareTeam = useTracker(function(){
    return CareTeams.findOne({id: Session.get('selectedCareTeamId')});
  }, [])
  data.selectedCareTeamId = useTracker(function(){
    return Session.get('selectedCareTeamId');
  }, [])
  data.careTeams = useTracker(function(){
    return CareTeams.find().fetch();
  }, [])

  function handleRowClick(careTeamId){
    console.log('CareTeamsPage.handleRowClick', careTeamId)
    let careTeam = CareTeams.findOne({id: careTeamId});

    if(careTeam){
      Session.set('selectedCareTeamId', get(careTeam, 'id'));
      Session.set('selectedCareTeam', careTeam);
      Session.set('CareTeam.Current', careTeam);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "CareTeamDetail");
        Session.set('mainAppDialogMaxWidth', "sm");
        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Team");
        } else {
          Session.set('mainAppDialogTitle', "View Team");
        }
      }      
    } else {
      console.log('No careteam found...')
    }
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;

  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height='auto' width={cardWidth + 'px'} margin={20} >
      <CardHeader title={ data.careTeams.length + ' Care Teams'} />
      <CardContent>
        <CareTeamsTable 
          careTeams={ data.careTeams}
          hideCheckbox={data.hideCheckbox}
          count={ data.careTeams.length}
          formFactorLayout={formFactor}
          rowsPerPage={LayoutHelpers.calcTableRows()}
          onRowClick={ handleRowClick.bind(this) }
        />
      </CardContent>
    </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.careTeams.length + " Care Teams"} />
          <CardContent>
            <CareTeamsTable 
              careTeams={ data.careTeams}
              hideCheckbox={data.hideCheckbox}
              count={ data.careTeams.length}
              formFactorLayout={formFactor}
              rowsPerPage={LayoutHelpers.calcTableRows()}
              onRowClick={ handleRowClick.bind(this) }
            />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedCareTeamId }</h1>
          {/* <CardHeader title={data.selectedCareTeamId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <CareTeamDetail 
                id='careTeamDetails'                 
                careTeam={ data.selectedCareTeam }
                careTeamId={ data.selectedCareTeamId } 
              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }
  return (
    <PageCanvas id='careTeamsPage' headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>      
    </PageCanvas>
  );
}


export default CareTeamsPage;