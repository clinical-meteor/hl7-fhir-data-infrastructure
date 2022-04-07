import React  from 'react';

import { 
  CardHeader,
  CardContent,
  Grid
} from '@material-ui/core';
import styled from 'styled-components';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { useTracker } from 'meteor/react-meteor-data';

import SubscriptionDetail from './SubscriptionDetail';
import SubscriptionsTable from './SubscriptionsTable';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import LayoutHelpers from '../../lib/LayoutHelpers';



//=============================================================================================================================================
// GLOBAL THEMING

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// This is necessary for the Material UI component render layer
let theme = {
  primaryColor: "rgb(108, 183, 110)",
  primaryText: "rgba(255, 255, 255, 1) !important",

  secondaryColor: "rgb(108, 183, 110)",
  secondaryText: "rgba(255, 255, 255, 1) !important",

  cardColor: "rgba(255, 255, 255, 1) !important",
  cardTextColor: "rgba(0, 0, 0, 1) !important",

  errorColor: "rgb(128,20,60) !important",
  errorText: "#ffffff !important",

  appBarColor: "#f5f5f5 !important",
  appBarTextColor: "rgba(0, 0, 0, 1) !important",

  paperColor: "#f5f5f5 !important",
  paperTextColor: "rgba(0, 0, 0, 1) !important",

  backgroundCanvas: "rgba(255, 255, 255, 1) !important",
  background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",

  nivoTheme: "greens"
}

// if we have a globally defined theme from a settings file
if(get(Meteor, 'settings.public.theme.palette')){
  theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
}

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: theme.primaryColor,
      contrastText: theme.primaryText
    },
    secondary: {
      main: theme.secondaryColor,
      contrastText: theme.errorText
    },
    appBar: {
      main: theme.appBarColor,
      contrastText: theme.appBarTextColor
    },
    cards: {
      main: theme.cardColor,
      contrastText: theme.cardTextColor
    },
    paper: {
      main: theme.paperColor,
      contrastText: theme.paperTextColor
    },
    error: {
      main: theme.errorColor,
      contrastText: theme.secondaryText
    },
    background: {
      default: theme.backgroundCanvas
    },
    contrastThreshold: 3,
    tonalOffset: 0.2
  }
});


//---------------------------------------------------------------
// Session Variables


Session.setDefault('subscriptionPageTabIndex', 0);
Session.setDefault('subscriptionSearchFilter', '');
Session.setDefault('selectedSubscriptionId', '');
Session.setDefault('selectedSubscription', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('subscriptionsArray', []);
Session.setDefault('SubscriptionsPage.onePageLayout', true)
Session.setDefault('SubscriptionsTable.hideCheckbox', true)

Session.setDefault('subscriptionChecklistMode', false)


//===========================================================================
// MAIN COMPONENT  


export function SubscriptionsPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();


  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    subscriptions: [],
    onePageLayout: true,
    hideCheckbox: true,
    subscriptionSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    subscriptionChecklistMode: false
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('SubscriptionsPage.onePageLayout');
  }, [])
  data.hideCheckbox = useTracker(function(){
    return Session.get('SubscriptionsTable.hideCheckbox');
  }, [])
  data.selectedSubscriptionId = useTracker(function(){
    return Session.get('selectedSubscriptionId');
  }, [])
  data.selectedSubscription = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedSubscriptionId'));
  }, [])
  data.subscriptions = useTracker(function(){
    let results = [];
    if(Session.get('subscriptionChecklistMode')){
      results = Subscriptions.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = Subscriptions.find().fetch();
    }

    return results;
  }, [])
  data.subscriptionSearchFilter = useTracker(function(){
    return Session.get('subscriptionSearchFilter')
  }, [])
  data.subscriptionChecklistMode = useTracker(function(){
    return Session.get('subscriptionChecklistMode')
  }, [])


  function handleRowClick(subscriptionId){
    console.log('SubscriptionsPage.handleRowClick', subscriptionId)
    let subscription = Subscriptions.findOne({id: subscriptionId});

    if(subscription){
      Session.set('selectedSubscriptionId', get(subscription, 'id'));
      Session.set('selectedSubscription', subscription);
      Session.set('Subscription.Current', subscription);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "SubscriptionDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Subscription");
        } else {
          Session.set('mainAppDialogTitle', "View Subscription");
        }
      }      
    } else {
      console.log('No subscription found...')
    }
  }
  function onInsert(subscriptionId){
    Session.set('selectedSubscriptionId', '');
    Session.set('subscriptionPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Subscriptions", recordId: subscriptionId});
  }
  function onCancel(){
    Session.set('subscriptionPageTabIndex', 1);
  } 


  // console.log('SubscriptionsPage.data', data)

  function handleChange(event, newValue) {
    Session.set('subscriptionPageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.subscriptions.length + " Subscriptions"} />
      <CardContent>

        <SubscriptionsTable 
          formFactorLayout={formFactor}  
          subscriptions={ data.subscriptions }
          count={data.subscriptions.length}
          hideCheckbox={data.hideCheckbox}
          hideStatus={false}
          hideName={false}
          hideConnectionType={false}
          hideOrganization={false}
          hideAddress={false}    
          paginationLimit={10}     
          checklist={data.subscriptionChecklistMode}
          onRowClick={ handleRowClick.bind(this) }
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          size="medium"
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.subscriptions.length + " Code Systems"} />
          <CardContent>
            <SubscriptionsTable 
              formFactorLayout={formFactor}  
              subscriptions={ data.subscriptions }
              count={data.subscriptions.length}
              selectedSubscriptionId={ data.selectedSubscriptionId }
              hideIdentifier={true} 
              hideCheckbox={data.hideCheckbox}
              hideActionIcons={true}
              hideStatus={false}
              hideName={false}
              hideConnectionType={false}
              hideOrganization={false}
              hideAddress={false}    
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              size="small"
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedSubscriptionId }</h1>
          {/* <CardHeader title={data.selectedSubscriptionId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <SubscriptionDetail 
                id='subscriptionDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                subscription={ data.selectedSubscription }
                subscriptionId={ data.selectedSubscriptionId } 
                showSubscriptionInputs={true}
                showHints={false}

              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }


  return (
    <PageCanvas id="subscriptionsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default SubscriptionsPage;