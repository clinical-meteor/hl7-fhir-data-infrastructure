import { 
  CardContent, 
  CardHeader,
  Grid
} from '@material-ui/core';

import { StyledCard, PageCanvas } from 'fhir-starter';
import { DynamicSpacer, Questionnaires, QuestionnaireResponses } from 'meteor/clinical:hl7-fhir-data-infrastructure';

// import QuestionnaireResponseDetail from './QuestionnaireResponseDetail';
import QuestionnaireResponsesTable from './QuestionnaireResponsesTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import React from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';

import { get } from 'lodash';

import SurveyResponseSummary from './SurveyResponseSummary';


//===============================================================================================================
// Session Variables

Session.setDefault('questionnaireResponseFormData', null);
Session.setDefault('questionnaireResponseSearchFilter', '');
Session.setDefault('selectedQuestionnaireResponse', null);
Session.setDefault('selectedQuestionnaireResponseId', '');
Session.setDefault('QuestionnaireResponsesPage.onePageLayout', false)

//===============================================================================================================
// Global Theming 
// This is necessary for the Material UI component render layer

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

export function QuestionnaireResponsesPage(props){


  let data = {
    selectedQuestionnaireResponseId: '',
    selectedQuestionnaireResponse: null,
    questionnaireResponses: [],
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('QuestionnaireResponsesPage.onePageLayout');
  }, [])
  data.selectedQuestionnaireResponseId = useTracker(function(){
    return Session.get('selectedQuestionnaireResponseId');
  }, [])
  data.selectedQuestionnaireResponse = useTracker(function(){
    return QuestionnaireResponses.findOne(Session.get('selectedQuestionnaireResponseId'));
  }, [])
  data.questionnaireResponses = useTracker(function(){
    return QuestionnaireResponses.find().fetch();
  }, [])
  data.questionnaireResponseSearchFilter = useTracker(function(){
    return Session.get('questionnaireResponseSearchFilter');
  }, [])



  function onRowChecked(questionnaire, event, toggle){
    console.log('onRowChecked', questionnaire, toggle);
    let newStatus = 'draft';

    if(toggle){
      newStatus = 'active';
    } else {
      newStatus = 'draft';
    }

    Questionnaires._collection.update({_id: questionnaire._id}, {$set: {
      'status': newStatus
    }}, function(error, result){
      if(error){
        console.error('Questionnaire Error', error);
      }
    });
  }
  function onSend(id){
    let patient = QuestionnaireResponses.findOne({_id: id});

    console.log("QuestionnaireResponsesTable.onSend()", patient);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/QuestionnaireResponse', {
      data: patient
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();


  let cardWidth = window.innerWidth - paddingWidth;

  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
      <CardHeader title={data.responsesCount + " Questionnaire Responses"} />
      <CardContent>
        <QuestionnaireResponsesTable 
          questionnaireResponses={data.responses}
          count={data.responsesCount}
          onCellClick={function(responseId){
            console.log('responseId', responseId)
            Session.set('selectedQuestionnaireResponse', responseId)
            Session.set('questionnaireResponsePageTabIndex', 2)
          }}
          onRemoveRecord={function(responseId){
            console.log('onRemoveRecord()')
            QuestionnaireResponses.remove({_id: responseId});                      
          }}
          onRowClick={function(responseId){
            console.log('onRowClick()', responseId)
            Session.set('selectedQuestionnaireResponseId', responseId);                  
            Session.set('selectedQuestionnaireResponse', QuestionnaireResponses.findOne(responseId));                  
          }}
          formFactorLayout={formFactor}
          />
      </CardContent>
    </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6} style={{width: '100%'}} >
        <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
          <CardHeader title={data.responsesCount + " Responses"} />
          <CardContent>
            <QuestionnaireResponsesTable 
              questionnaireResponses={data.responses}
              count={data.responsesCount}
              onCellClick={function(responseId){
                console.log('responseId', responseId)
                Session.set('selectedQuestionnaireResponse', responseId)
                Session.set('selectedQuestionnaireResponseId', responseId)
                Session.set('questionnaireResponsePageTabIndex', 2)
              }}
              onRemoveRecord={function(responseId){
                console.log('onRemoveRecord()')
                QuestionnaireResponses.remove({_id: responseId});                      
              }}
              onRowClick={function(responseId){
                console.log('onRowClick()', responseId)
                Session.set('selectedQuestionnaireResponseId', responseId);                  
                Session.set('selectedQuestionnaireResponse', QuestionnaireResponses.findOne(responseId));                  
              }}
              formFactorLayout={formFactor}
            />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4} style={{width: '100%', marginBottom: '80px'}} >
        <StyledCard height="auto" margin={20} scrollable width={cardWidth + 'px'}>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.questionnaireResponseId }</h1>
          <CardContent>
            <CardContent>
              {/* <code>
                {JSON.stringify(data.questionnaireResponse)}
              </code> */}

              <SurveyResponseSummary 
                id='surveyResponseSummary' 
                selectedResponse={data.questionnaireResponse} 
                selectedResponseId={data.questionnaireResponse.id}
                />

            </CardContent>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  }
  
  return (
    <PageCanvas id="questionnaireResponsesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
       <MuiThemeProvider theme={muiTheme} >
        { layoutContents }
      </MuiThemeProvider>
    </PageCanvas>
  );
}



export default QuestionnaireResponsesPage;