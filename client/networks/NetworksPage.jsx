import React  from 'react';
import { useTracker } from 'meteor/react-meteor-data';

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

// import NetworkDetail from './NetworkDetail';
import NetworksTable from './NetworksTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';




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


Session.setDefault('networkPageTabIndex', 0);
Session.setDefault('networkSearchFilter', '');
Session.setDefault('selectedNetworkId', '');
Session.setDefault('selectedNetwork', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('networksArray', []);
Session.setDefault('NetworksPage.onePageLayout', true)
Session.setDefault('networkChecklistMode', false)


//===========================================================================
// MAIN COMPONENT  


export function NetworksPage(props){

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();


  let data = {
    selectedAuditEventId: '',
    selectedAuditEvent: null,
    networks: [],
    onePageLayout: true,
    networkSearchFilter: '',
    options: {
      sort: {
        'focus.display': -1,
        lastModified: -1
      }
    },
    networkChecklistMode: false
  };

  


  data.onePageLayout = useTracker(function(){
    return Session.get('NetworksPage.onePageLayout');
  }, [])
  data.selectedNetworkId = useTracker(function(){
    return Session.get('selectedNetworkId');
  }, [])
  data.selectedNetwork = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedNetworkId'));
  }, [])
  data.networks = useTracker(function(){
    let results = [];
    if(Session.get('networkChecklistMode')){
      results = Networks.find({
        'focus.display': "Patient Correction"
      }, {
        limit: 10,
        sort: {lastModified: -1}
      }).fetch();      
    } else {
      results = Networks.find().fetch();
    }

    return results;
  }, [])
  data.networkSearchFilter = useTracker(function(){
    return Session.get('networkSearchFilter')
  }, [])
  data.networkChecklistMode = useTracker(function(){
    return Session.get('networkChecklistMode')
  }, [])


  // function onCancelUpsertNetwork(context){
  //   Session.set('networkPageTabIndex', 1);
  // }
  // function onDeleteNetwork(context){
  //   Networks._collection.remove({_id: get(context, 'state.networkId')}, function(error, result){
  //     if (error) {
  //       if(process.env.NODE_ENV === "test") console.log('Networks.insert[error]', error);
  //       Bert.alert(error.reason, 'danger');
  //     }
  //     if (result) {
  //       Session.set('selectedNetworkId', '');
  //       HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Networks", recordId: context.state.networkId});        
  //     }
  //   });
  //   Session.set('networkPageTabIndex', 1);
  // }
  // function onUpsertNetwork(context){
  //   //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
  //   console.log('Saving a new Network...', context.state)

  //   if(get(context, 'state.network')){
  //     let self = context;
  //     let fhirNetworkData = Object.assign({}, get(context, 'state.network'));
  
  //     // if(process.env.NODE_ENV === "test") console.log('fhirNetworkData', fhirNetworkData);
  
  //     let networkValidator = NetworkSchema.newContext();
  //     // console.log('networkValidator', networkValidator)
  //     networkValidator.validate(fhirNetworkData)
  
  //     if(process.env.NODE_ENV === "development"){
  //       console.log('IsValid: ', networkValidator.isValid())
  //       console.log('ValidationErrors: ', networkValidator.validationErrors());
  
  //     }
  
  //     console.log('Checking context.state again...', context.state)
  //     if (get(context, 'state.networkId')) {
  //       if(process.env.NODE_ENV === "development") {
  //         console.log("Updating network...");
  //       }

  //       delete fhirNetworkData._id;
  
  //       // not sure why we're having to respecify this; fix for a bug elsewhere
  //       fhirNetworkData.resourceType = 'Network';
  
  //       Networks._collection.update({_id: get(context, 'state.networkId')}, {$set: fhirNetworkData }, function(error, result){
  //         if (error) {
  //           if(process.env.NODE_ENV === "test") console.log("Networks.insert[error]", error);
          
  //         }
  //         if (result) {
  //           HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Networks", recordId: context.state.networkId});
  //           Session.set('selectedNetworkId', '');
  //           Session.set('networkPageTabIndex', 1);
  //         }
  //       });
  //     } else {
  //       // if(process.env.NODE_ENV === "test") 
  //       console.log("Creating a new network...", fhirNetworkData);
  
  //       fhirNetworkData.effectiveDateTime = new Date();
  //       Networks._collection.insert(fhirNetworkData, function(error, result) {
  //         if (error) {
  //           if(process.env.NODE_ENV === "test")  console.log('Networks.insert[error]', error);           
  //         }
  //         if (result) {
  //           HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Networks", recordId: context.state.networkId});
  //           Session.set('networkPageTabIndex', 1);
  //           Session.set('selectedNetworkId', '');
  //         }
  //       });
  //     }
  //   } 
  //   Session.set('networkPageTabIndex', 1);
  // }
  function handleRowClick(networkId){
    console.log('NetworksPage.handleRowClick', networkId)
    let network = Networks.findOne({id: networkId});

    if(network){
      Session.set('selectedNetworkId', get(network, 'id'));
      Session.set('selectedNetwork', network);
      Session.set('Network.Current', network);
      
      let showModals = true;
      if(showModals){
        Session.set('mainAppDialogOpen', true);
        Session.set('mainAppDialogComponent', "NetworkDetail");
        Session.set('mainAppDialogMaxWidth', "sm");

        if(Meteor.currentUserId()){
          Session.set('mainAppDialogTitle', "Edit Network");
        } else {
          Session.set('mainAppDialogTitle', "View Network");
        }
      }      
    }
  }
  // function onInsert(networkId){
  //   Session.set('selectedNetworkId', '');
  //   Session.set('networkPageTabIndex', 1);
  //   HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Networks", recordId: networkId});
  // }
  // function onCancel(){
  //   Session.set('networkPageTabIndex', 1);
  // } 


  // console.log('NetworksPage.data', data)

  function handleChange(event, newValue) {
    Session.set('networkPageTabIndex', newValue)
  }


  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} scrollable >
      <CardHeader title={data.networks.length + " Networks"} />
      <CardContent>

        <NetworksTable 
        formFactorLayout={formFactor}  
          networks={ data.networks }
          count={data.networks.length}
          selectedNetworkId={ data.selectedNetworkId }
          onRowClick={ handleRowClick.bind(this) }
          hideCheckbox={false}
          hideStatus={false}
          hideName={false}
          hideTitle={false}
          hideVersion={false}
          hideExperimental={false}
          paginationLimit={10}     
          checklist={data.networkChecklistMode}
          rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
          size="small"
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} >
          <CardHeader title={data.networks.length + " Networks"} />
          <CardContent>
            <NetworksTable 
              formFactorLayout={formFactor}  
              networks={ data.networks }
              count={data.networks.length}
              selectedNetworkId={ data.selectedNetworkId }
              hideIdentifier={true} 
              hideCheckbox={false}
              hideActionIcons={true}
              hideStatus={false}
              hideName={false}
              hideTitle={false}
              hideVersion={false}
              hideExperimental={false}    
              hideBarcode={true}
              onRowClick={ handleRowClick.bind(this) }
              rowsPerPage={ LayoutHelpers.calcTableRows("medium",  props.appHeight) }
              size="medium"
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedNetworkId }</h1>
          {/* <CardHeader title={data.selectedNetworkId } className="helveticas barcode" /> */}
          <CardContent>
            <CardContent>
              <NetworkDetail 
                id='networkDetails'                 
                displayDatePicker={true} 
                displayBarcodes={false}
                network={ data.selectedNetwork }
                networkId={ data.selectedNetworkId } 
                showNetworkInputs={true}
                showHints={false}

              />
            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }


  return (
    <PageCanvas id="networksPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}


export default NetworksPage;