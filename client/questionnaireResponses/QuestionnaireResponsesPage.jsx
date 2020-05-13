import { 
  CardContent, 
  CardHeader,
  Grid
} from '@material-ui/core';

import { StyledCard, PageCanvas } from 'material-fhir-ui';
import { DynamicSpacer } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import QuestionnaireResponseDetail from './QuestionnaireResponseDetail';
import QuestionnaireResponsesTable from './QuestionnaireResponsesTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';

import { get } from 'lodash';


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

export class QuestionnaireResponsesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      questionnaireResponse: Session.get('selectedQuestionnaireResponse'),
      questionnaireResponseId: Session.get('selectedQuestionnaireResponseId'),
      questionnaireResponseSearchFilter: '',
      currentQuestionnaireResponse: null,
      onePageLayout: true,
      responses: QuestionnaireResponses.find().fetch(),
      responsesCount: QuestionnaireResponses.find().count(),
      onePageLayout: Session.get('QuestionnaireResponsesPage.onePageLayout')
    };

    if (Session.get('questionnaireResponseSearchFilter')) {
      data.questionnaireResponseSearchFilter = Session.get('questionnaireResponseSearchFilter');
    }

    //if(process.env.NODE_ENV === "test") 
    console.log("QuestionnaireResponsesPage[data]", data);
    return data;
  }



  onRowChecked(questionnaire, event, toggle){
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
  onSend(id){
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


  render() {
    let headerHeight = LayoutHelpers.calcHeaderHeight();

    let layoutContents;
    if(this.data.onePageLayout){
      layoutContents = <StyledCard height="auto" margin={20} >
        <CardHeader title={this.data.responsesCount + " Questionnaire Responses"} />
        <CardContent>

          <QuestionnaireResponsesTable 
            questionnaireResponses={this.data.responses}
            count={this.data.responsesCount}
            hideActionIcons={true}
            hideCheckbox={true}
            hideBarcodes={false} 
            hideIdentifier={false}
            onCellClick={function(responseId){
              console.log('responseId', responseId)
              Session.set('selectedQuestionnaireResponse', responseId)
              Session.set('questionnaireResponsePageTabIndex', 2)
            }}
            onRemoveRecord={function(responseId){
              console.log('onRemoveRecord()')
              QuestionnaireResponses.remove({_id: responseId});                      
            }}
            />
        </CardContent>
      </StyledCard>
    } else {
      layoutContents = <Grid container spacing={3}>
        <Grid item lg={6}>
          <StyledCard height="auto" margin={20} >
            <CardHeader title={this.data.responsesCount + " Responses"} />
            <CardContent>
              <QuestionnaireResponsesTable 
                questionnaireResponses={this.data.responses}
                count={this.data.responsesCount}
                hideActionIcons={true}
                hideCheckbox={true}
                hideBarcodes={false} 
                hideIdentifier={false}
                onCellClick={function(responseId){
                  console.log('responseId', responseId)
                  Session.set('selectedQuestionnaireResponse', responseId)
                  Session.set('questionnaireResponsePageTabIndex', 2)
                }}
                onRemoveRecord={function(responseId){
                  console.log('onRemoveRecord()')
                  QuestionnaireResponses.remove({_id: responseId});                      
                }}
              />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item lg={4}>
          <StyledCard height="auto" margin={20} scrollable>
            <h1 className="barcode" style={{fontWeight: 100}}>{this.data.selectedListId }</h1>
            <CardContent>
              <CardContent>

              </CardContent>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    }
    
    return (
      <PageCanvas id="questionnaireResponsesPage" headerHeight={headerHeight}>
         <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}


ReactMixin(QuestionnaireResponsesPage.prototype, ReactMeteorData);
export default QuestionnaireResponsesPage;