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
import { useTracker } from 'meteor/react-meteor-data';

// import MessageHeaderDetail from './MessageHeaderDetail';
import MessageHeadersTable from './MessageHeadersTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

Session.setDefault('messageHeaderPageTabIndex', 0);
Session.setDefault('messageHeaderSearchFilter', '');
Session.setDefault('selectedMessageHeaderId', '');
Session.setDefault('selectedMessageHeader', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('messageHeadersArray', []);
Session.setDefault('MessageHeadersPage.onePageLayout', true)

// Global Theming 
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


  

export function MessageHeadersPage(props){

  let data = {
    selectedMessageHeaderId: '',
    selectedMessageHeader: null,
    messageHeaders: [],
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('MessageHeadersPage.onePageLayout');
  }, [])
  data.selectedMessageHeaderId = useTracker(function(){
    return Session.get('selectedMessageHeaderId');
  }, [])
  data.selectedMessageHeader = useTracker(function(){
    return MeasageHeaders.findOne(Session.get('selectedMessageHeaderId'));
  }, [])
  data.messageHeaders = useTracker(function(){
    return MeasageHeaders.find().fetch();
  }, [])

  function onCancelUpsertMessageHeader(context){
    Session.set('messageHeaderPageTabIndex', 1);
  }
  function onDeleteMessageHeader(context){
    MessageHeaders._collection.remove({_id: get(context, 'state.messageHeaderId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('MessageHeaders.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedMessageHeaderId', '');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MessageHeaders", recordId: context.state.messageHeaderId});
        Bert.alert('MessageHeader removed!', 'success');
      }
    });
    Session.set('messageHeaderPageTabIndex', 1);
  }
  function onUpsertMessageHeader(context){
    console.log('Saving a new MessageHeader...', context.state)

    if(get(context, 'state.messageHeader')){
      let self = context;
      let fhirMessageHeaderData = Object.assign({}, get(context, 'state.messageHeader'));
  
      let messageHeaderValidator = MessageHeaderSchema.newContext();
  
      messageHeaderValidator.validate(fhirMessageHeaderData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', messageHeaderValidator.isValid())
        console.log('ValidationErrors: ', messageHeaderValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.messageHeaderId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating messageHeader...");
        }

        delete fhirMessageHeaderData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirMessageHeaderData.resourceType = 'MessageHeader';
  
        MessageHeaders._collection.update({_id: get(context, 'state.messageHeaderId')}, {$set: fhirMessageHeaderData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("MessageHeaders.insert[error]", error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MessageHeaders", recordId: context.state.messageHeaderId});
            Session.set('selectedMessageHeaderId', '');
            Session.set('messageHeaderPageTabIndex', 1);
            Bert.alert('MessageHeader added!', 'success');
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new messageHeader...", fhirMessageHeaderData);
  
        fhirMessageHeaderData.effectiveDateTime = new Date();
        MessageHeaders._collection.insert(fhirMessageHeaderData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('MessageHeaders.insert[error]', error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MessageHeaders", recordId: context.state.messageHeaderId});
            Session.set('messageHeaderPageTabIndex', 1);
            Session.set('selectedMessageHeaderId', '');
            Bert.alert('MessageHeader added!', 'success');
          }
        });
      }
    } 
    Session.set('messageHeaderPageTabIndex', 1);
  }
  function handleRowClick(messageHeaderId, foo, bar){
    console.log('MessageHeadersPage.handleRowClick', messageHeaderId)
    let messageHeader = MessageHeaders.findOne({id: messageHeaderId});

    Session.set('selectedMessageHeaderId', get(messageHeader, 'id'));
    Session.set('selectedMessageHeader', messageHeader);
  }
  function onInsert(messageHeaderId){
    Session.set('selectedMessageHeaderId', '');
    Session.set('messageHeaderPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "MessageHeaders", recordId: messageHeaderId});
  }
  function onCancel(){
    Session.set('messageHeaderPageTabIndex', 1);
  } 


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

    let layoutContents;
    if(data.onePageLayout){
      layoutContents = <StyledCard height="auto" margin={20} >
        <CardHeader title={data.messageHeadersCount + " MessageHeaders"} />
        <CardContent>

          <MessageHeadersTable 
            messageHeaders={ data.messageHeaders }
            hideCheckbox={true} 
            hideActionIcons={true}
            hideIdentifier={true} 
            hideTitle={false} 
            hideDescription={false} 
            hideApprovalDate={false}
            hideLastReviewed={false}
            hideVersion={false}
            hideStatus={false}
            hideAuthor={true}
            hidePublisher={false}
            hideReviewer={false}
            hideEditor={false}
            hideEndorser={false}
            hideType={false}
            hideRiskAdjustment={true}
            hideRateAggregation={true}
            hideScoring={false}
            paginationLimit={10}     
            />
          </CardContent>
        </StyledCard>
    } else {
      layoutContents = <Grid container spacing={3}>
        <Grid item lg={6}>
          <StyledCard height="auto" margin={20} >
            <CardHeader title={data.messageHeadersCount + " MessageHeaders"} />
            <CardContent>
              <MessageHeadersTable 
                messageHeaders={ data.messageHeaders }
                selectedMessageHeaderId={ data.selectedMessageHeaderId }
                hideIdentifier={true} 
                hideCheckbox={true} 
                hideApprovalDate={false}
                hideLastReviewed={false}
                hideVersion={false}
                hideStatus={false}
                hidePublisher={true}
                hideReviewer={true}
                hideScoring={true}
                hideEndorser={true}
                paginationLimit={10}            
                hideActionIcons={true}
                onRowClick={this.handleRowClick.bind(this) }
                count={data.messageHeadersCount}
                />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item lg={4}>
          <StyledCard height="auto" margin={20} scrollable>
            <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedMessageHeaderId }</h1>
            {/* <CardHeader title={data.selectedMessageHeaderId } className="helveticas barcode" /> */}
            <CardContent>
              <CardContent>
                <MessageHeaderDetail 
                  id='messageHeaderDetails' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  messageHeader={ data.selectedMessageHeader }
                  messageHeaderId={ data.selectedMessageHeaderId } 
                  showMessageHeaderInputs={true}
                  showHints={false}
                  // onInsert={ this.onInsert }
                  // onDelete={ this.onDeleteMessageHeader }
                  // onUpsert={ this.onUpsertMessageHeader }
                  // onCancel={ this.onCancelUpsertMessageHeader } 
                />
              </CardContent>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    }

    return (
      <PageCanvas id="messageHeadersPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
}


export default MessageHeadersPage;