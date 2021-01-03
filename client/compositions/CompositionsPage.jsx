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
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

// import CompositionDetail from './CompositionDetail';
import CompositionsTable from './CompositionsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

Session.setDefault('compositionPageTabIndex', 0);
Session.setDefault('compositionSearchFilter', '');
Session.setDefault('selectedCompositionId', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('compositionsArray', []);

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

// const StyledCard = styled(Card)`
//   background: ` + theme.paperColor + `;
//   border-radius: 3px;
//   border: 0;
//   color: ` + theme.paperTextColor + `;
//   height: 48px;
//   padding: 0 30px;
//   box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
// `;



Session.setDefault('selectedCompositionId', '')
export function CompositionsPage(props){


  let data = {
    selectedCompositionId: Session.get("selectedCompositionId"),
    selectedComposition: false,
    selected: [],
    compositions: []
  };

  data.selectedCompositionId = useTracker(function(){
    return Session.get('selectedCompositionId');
  }, [])
  data.compositions = useTracker(function(){
    return Compositions.find().fetch();
  }, [])


  // function onDeleteComposition(context){
  //   Compositions._collection.remove({_id: get(context, 'state.compositionId')}, function(error, result){
  //     if (error) {
  //       if(process.env.NODE_ENV === "test") console.log('Compositions.insert[error]', error);
  //     }
  //     if (result) {
  //       Session.set('selectedCompositionId', false);
  //       HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: context.state.compositionId});
  //     }
  //   });
  //   Session.set('compositionPageTabIndex', 1);
  // }
  // function onUpsertComposition(context){
  //   //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
  //   console.log('Saving a new Composition...', context.state)

  //   if(get(context, 'state.composition')){
  //     let self = context;
  //     let fhirCompositionData = Object.assign({}, get(context, 'state.composition'));
  
  //     // if(process.env.NODE_ENV === "test") console.log('fhirCompositionData', fhirCompositionData);
  
  //     let compositionValidator = CompositionSchema.newContext();
  //     // console.log('compositionValidator', compositionValidator)
  //     compositionValidator.validate(fhirCompositionData)
  
  //     if(process.env.NODE_ENV === "development"){
  //       console.log('IsValid: ', compositionValidator.isValid())
  //       console.log('ValidationErrors: ', compositionValidator.validationErrors());
  
  //     }
  
  //     console.log('Checking context.state again...', context.state)
  //     if (get(context, 'state.compositionId')) {
  //       if(process.env.NODE_ENV === "development") {
  //         console.log("Updating composition...");
  //       }

  //       delete fhirCompositionData._id;
  
  //       // not sure why we're having to respecify this; fix for a bug elsewhere
  //       fhirCompositionData.resourceType = 'Composition';
  
  //       Compositions._collection.update({_id: get(context, 'state.compositionId')}, {$set: fhirCompositionData }, function(error, result){
  //         if (error) {
  //           if(process.env.NODE_ENV === "test") console.log("Compositions.insert[error]", error);
  //         }
  //         if (result) {
  //           HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: context.state.compositionId});
  //           Session.set('selectedCompositionId', false);
  //           Session.set('compositionPageTabIndex', 1);
  //         }
  //       });
  //     } else {
  //       // if(process.env.NODE_ENV === "test") 
  //       console.log("Creating a new composition...", fhirCompositionData);
  
  //       fhirCompositionData.effectiveDateTime = new Date();
  //       Compositions._collection.insert(fhirCompositionData, function(error, result) {
  //         if (error) {
  //           if(process.env.NODE_ENV === "test")  console.log('Compositions.insert[error]', error);
  //         }
  //         if (result) {
  //           HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: context.state.compositionId});
  //           Session.set('compositionPageTabIndex', 1);
  //           Session.set('selectedCompositionId', false);
  //         }
  //       });
  //     }
  //   } 
  //   Session.set('compositionPageTabIndex', 1);
  // }
  // function onInsert(compositionId){
  //   Session.set('selectedCompositionId', false);
  //   Session.set('compositionPageTabIndex', 1);
  //   HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: compositionId});
  // }
  // function onUpdate(compositionId){
  //   Session.set('selectedCompositionId', false);
  //   Session.set('compositionPageTabIndex', 1);
  //   HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: compositionId});
  // }
  // function onRemove(compositionId){
  //   Session.set('compositionPageTabIndex', 1);
  //   Session.set('selectedCompositionId', false);
  //   HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Compositions", recordId: compositionId});
  // }
  // function onCancel(){
  //   Session.set('compositionPageTabIndex', 1);
  // } 

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  return (
    <div id="compositionsPage" style={{paddingLeft: '100px', paddingRight: '100px', paddingBottom: '100px'}}>
      <MuiThemeProvider theme={muiTheme} >
          <StyledCard>
            <CardHeader
              title="Compositions"
            />
            <CardContent>
              <CompositionsTable 
                hideIdentifier={true} 
                hideCheckboxes={true} 
                hideSubjects={false}
                noDataMessagePadding={100}
                actionButtonLabel="Send"
                compositions={ data.compositions }
                paginationLimit={10}
                hideSubjects={true}
                hideClassCode={false}
                hideReasonCode={false}
                hideReason={false}
                hideHistory={false}
                />
            </CardContent>
          </StyledCard>
      </MuiThemeProvider>
    </div>
  );
}


export default CompositionsPage;