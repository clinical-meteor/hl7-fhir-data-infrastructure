
import { 
  Select, 
  MenuItem,
  CardContent, 
  CardHeader, 
  CardActions, 
  TextField, 
  Checkbox, 
  Button,
  Grid
} from '@material-ui/core';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { DynamicSpacer } from 'meteor/clinical:hl7-fhir-data-infrastructure';

import QuestionnaireExpansionPanels from './QuestionnaireExpansionPanels';
import QuestionnairesTable from './QuestionnairesTable';
import SortableQuestionnaire from './SortableQuestionnaire';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { 
  FormControl,
  Input,
  InputAdornment
} from '@material-ui/core';


import PropTypes from 'prop-types';
import React from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';
import { Random } from 'meteor/random';

import moment from 'moment';
import { get } from 'lodash';

let defaultQuestionnaire = {
  index: 2,
  id: ''
};

// =========================================================================================================
// Session Variables  

Session.setDefault('questionnaireFormData', defaultQuestionnaire);
Session.setDefault('questionnaireSearchFilter', '');
Session.setDefault('questionnaireDesignerCurrentQuestion', {
  linkId: 0,
  text: '',
  type: 'question',
  multiplicity: 1,
  multiline: false,
  numerical: false
});
Session.setDefault('questionnaireDesignerCurrentMultiChoice', {label: ''});
Session.setDefault('questionnaireIsSorting', false);

Session.setDefault('enableCurrentQuestionnaire', false);
Session.setDefault('activeQuestionnaireName', 'bar');
Session.setDefault('activeQuestionLinkId', false);

Session.setDefault('selectedQuestionnaireId', '')

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


//===============================================================================================================
// Classes Styles Theming 

import { ThemeProvider, makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(theme => ({
  button: {
    background: theme.background,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: theme.buttonText,
    height: 48,
    padding: '0 30px',
  },
  input: {
    marginBottom: '20px'
  },
  compactInput: {
    marginBottom: '10px'
  },
  label: {
    paddingBottom: '10px'
  }
}));



// =========================================================================================================
// Main Component

export function QuestionnairesPage(props){
  let data = {
    questionnaire: defaultQuestionnaire,
    questionnaireSearchFilter: '',
    currentQuestionnaire: null,
    questionnaireId: false,
    sortableItems: [],
    enabled: true,
    chatbotInstalled: false,
    questionnaireName: '',
    questionnaireDesignerCurrentQuestion: {text: ''},
    questionnaireDesignerCurrentMultiChoice: {label: ''},
    isActive: false,
    isNumber: false,
    isSorting: false,
    activeQuestionLinkId: '',
    onePageLayout: true,
    questionnaires: [],
    selectedQuestionnaireId: '',
    selectedQuestionnaire: null,
    questionnaireSearchFilter: ''
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('QuestionnairesPage.onePageLayout');
  }, [])
  data.selectedQuestionnaireId = useTracker(function(){
    return Session.get('selectedQuestionnaireId');
  }, [])
  data.selectedQuestionnaire = useTracker(function(){
    return Questionnaires.findOne(Session.get('selectedQuestionnaireId'));
  }, [])
  data.questionnaires = useTracker(function(){
    return Questionnaires.find().fetch();
  }, [])
  data.enabled = useTracker(function(){
    return Session.get('enableCurrentQuestionnaire');
  }, [])
  data.isSorting = useTracker(function(){
    return Session.get('questionnaireIsSorting');
  }, [])
  data.activeQuestionLinkId = useTracker(function(){
    return Session.get('activeQuestionLinkId');
  }, [])

  data.questionnaireSearchFilter = useTracker(function(){
    return Session.get('questionnaireSearchFilter');
  }, [])


  if (get(data, 'selectedQuestionnaire')) {
    if (get(data, 'selectedQuestionnaire.item')) {
      
      if(Array.isArray(data.selectedQuestionnaire.item)){
        let count = 0;
        data.selectedQuestionnaire.item.forEach(function(item){
          data.sortableItems.push({
            linkId: count,
            text: get(item, 'text')
          });              
          count++;
        });  
      }
    }

    if(get(data, 'selectedQuestionnaire.status') === "active"){
      data.isActive = true;
    } else {
      data.isActive = false;
    }

    // if(get(data, 'selectedQuestionnaire.title')){
    //   data.questionnaireName = get(data, 'selectedQuestionnaire.title');
    // } else {
    //   data.questionnaireName = '';
    // }
  }

  if(get(data, 'activeQuestionLinkId')){
    console.log('ActiveQuestionLinkId was updated. Checking if it exists in the current questionnaire items.')
    if (Array.isArray(get(data, 'selectedQuestionnaire.item'))) {
      data.selectedQuestionnaire.item.forEach(function(item){
        if(Session.equals('activeQuestionLinkId', get(item, 'linkId', ''))){      
          console.log('Found.  Updating the question being edited.')
          data.questionnaireDesignerCurrentQuestion = item;
        }  
      });
    } 
  } 

  // if (Session.get('questionnaireDesignerCurrentQuestion')) {
  //   console.log('Selected question not found.  Using dirty state.')
  //   data.questionnaireDesignerCurrentQuestion = Session.get('questionnaireDesignerCurrentQuestion');
  // }

  console.log("QuestionnairesPage[data]", data);



  function toggleSortStatus(){
    if(Session.equals('questionnaireIsSorting', true)){
      this.saveSortedQuestionnaire();
      Session.set('questionnaireIsSorting', false);
    } else {
      Session.set('questionnaireIsSorting', true);
    }    
  }
  function toggleActiveStatus(event, newValue){
    console.log('toggleActiveStatus', event, newValue)
    console.log('toggleActiveStatus currentQuestionnaire id', get(this, 'data.currentQuestionnaire._id'))

    let currentStatus =  get(this, 'data.currentQuestionnaire.status');

    console.log('currentStatus', currentStatus)

    if(currentStatus === 'inactive'){
      Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
        'status': 'active'
      }});
    } else if (currentStatus === 'active'){
      Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
        'status': 'inactive'
      }});
    }
  }
  function handleTabChange(index){
    Session.set('questionnairePageTabIndex', index);
  }
  function changeText(name, event, newValue){
    console.log('changeText', this, newValue)

    // Session.set('activeQuestionnaireName', newValue);
    // console.log('_id', get(this, 'data.currentQuestionnaire._id'))

    Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
      'title': newValue
    }});
  }
  function onSend(id){
    let patient = QuestionnaireResponses.findOne({_id: id});

    console.log("QuestionnaireResponseTable.onSend()", patient);

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
  function saveQuestion(event, activeQuestionLinkId){
    console.log('Saving question to Questionnaire/', get(this, 'data.currentQuestionnaire._id'))
    console.log(' ')
    console.log('Going to try to add the following item: ');
    console.log(Session.get('questionnaireDesignerCurrentQuestion'));
    console.log(' ')
    console.log('ActiveQuestionLinkId', data.activeQuestionLinkId);
    console.log(' ')

    let currentItemsArray = get(this, 'data.currentQuestionnaire.item', []);
    console.log('Current questionnaire items:', currentItemsArray)

    let newItems = [];
    if(Array.isArray(currentItemsArray)){
      console.log('Iterating through current items')
      currentItemsArray.forEach(function(item){
        if(Session.equals('activeQuestionLinkId', item.linkId)){
          console.log('Found a match.  Using dirty state.')
          newItems.push(Session.get('questionnaireDesignerCurrentQuestion'));
        } else {
          console.log('No match.  Using the original.')
          newItems.push(item);
        }
      });
    }

    console.log('New items.  Adding to questionnaire.', newItems)
    Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
      'item': newItems
    }})  
  }
  function addQuestion(event, bar, baz){
    console.log('Adding a question to Questionnaire/', get(this, 'data.currentQuestionnaire._id'))
    console.log(' ')
    console.log('Going to try to add the following item: ');
    console.log(Session.get('questionnaireDesignerCurrentQuestion'));
    console.log(' ')
    console.log('Output of current Questionnaire', get(this, 'data.currentQuestionnaire'))
    
    let itemsArray = get(this, 'data.currentQuestionnaire.item', []);
    let newItem = Session.get('questionnaireDesignerCurrentQuestion')
    
    if(itemsArray.length === 0){
      newItem.linkId = 1;
    } else {
      newItem.linkId = Random.id();
    }
    
    console.log(' ')
    console.log("This is the new item we've generated and will be attaching to the questionnaire: ", newItem)
    console.log(' ')

    Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$addToSet: {
      'item': newItem
    }})    
  }
  function updateQuestionText(event, newValue){
    // console.log('record id', get(this, 'data.currentQuestionnaire._id'))
    console.log('updateQuestionText', newValue)

    let newQuestionState = Session.get('questionnaireDesignerCurrentQuestion');
    newQuestionState.text = newValue;

    Session.set('questionnaireDesignerCurrentQuestion', newQuestionState);
    console.log('newQuestionState', newQuestionState)
  }
  function handleSaveQuestionnaireResponse(){
    console.log('Posting questionnaire response to external system...')

    let newQuestionnaireResponse = {
      "resourceType": "QuestionnaireResponse",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2020-05-12T14:58:42.196+00:00",
        "profile": [
          "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponse|2.7"
        ]
      },
      "questionnaire": "Questionnaire/d2ff1d83-f772-448c-b5df-04b66b5ef0f2",
      "status": "in-progress",
      "authored": new Date(),
      "subject": {
        "reference": "Patient/" + Random.id(),
        "type": "Patient"
      },
      "item": [{
        "linkId": "/food",
        "text": "Food",
        "item": [{
          "linkId": "/food/1",
          "text": "Within the past 12 months, did you worry that your food would run out before you got money to buy more?",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }, {
          "linkId": "/food/2",
          "text": "Within the past 12 months, did the food you bought just not last and you didn’t have money to get more?",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }]
      }, {
        "linkId": "/housing/utilities",
        "text": "Housing/Utilities",
        "item": [{
          "linkId": "/housing/utilities/3",
          "text": "Within the past 12 months, have you ever stayed: outside, in a car, in a tent, in an overnight shelter, or temporarily in someone else’s home (i.e. couch-surfing)?",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }, {
          "linkId": "/housing/utilities/4",
          "text": "Are you worried about losing your housing?",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }, {
          "linkId": "/housing/utilities/5",
          "text": "Within the past 12 months, have you been unable to get utilities (heat, electricity) when it was really needed?",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }]
      }, {
        "linkId": "/transportation",
        "text": "Transportation",
        "item": [{
          "linkId": "/transportation/6",
          "text": "Within the past 12 months, has a lack of transportation kept you from medical appointments or from doing things needed for daily living?",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }]
      },
      {
        "linkId": "/interpersonal safety",
        "text": "Interpersonal Safety",
        "item": [{
          "linkId": "/interpersonal safety/7",
          "text": "Do you feel physically or emotionally unsafe where you currently live?",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }, {
          "linkId": "/interpersonal safety/8",
          "text": "Within the past 12 months, have you been hit, slapped, kicked or otherwise physically hurt by anyone?",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }]
      },
      {
        "linkId": "/optional: immediate need",
        "text": "Optional: Immediate Need",
        "item": [{
          "linkId": "/optional: immediate need/10",
          "text": "Are any of your needs urgent? For example, you don’t have food for tonight, you don’t have a place to sleep tonight, you are afraid you will get hurt if you go home today.",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }, {
          "linkId": "/optional: immediate need/11",
          "text": "Would you like help with any of the needs that you have identified?",
          "answer": [{
            "valueBoolean": Random.choice([true, false])
          }]
        }
      ]}
    ]}

    Meteor.call('postRelay', 'https://nw-sf-dev-uses0-safr2-safhirapim.azure-api.net/grav/api/QuestionnaireResponse', {
      payload: newQuestionnaireResponse
    }, function(error, response){
      if(error){
        console.log('error', error)
      }
      if(response){
        console.log('response', response)
      }
    })
  }



  // let classes = useStyles();
  let classes = {
    button: {
      background: theme.background,
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: theme.buttonText,
      height: 48,
      padding: '0 30px',
    },
    input: {
      marginBottom: '20px'
    },
    compactInput: {
      marginBottom: '10px'
    },
    label: {
      paddingBottom: '10px'
    }
  }

  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor(2);
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  let cardWidth = window.innerWidth - paddingWidth;



  let secondaryGridSize = 5;
  let secondaryGridStyle = {
    position: 'sticky', 
    top: '0px', 
    marginBottom: '84px',
    width: '100%'
  }
  if(window.innerWidth < 768){
    let secondaryGridSize = 5;
  }

  return (
    <PageCanvas id="questionnairesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
      <MuiThemeProvider theme={muiTheme} >
        <Grid container spacing={3} >
          <Grid item lg={6} style={{width: '100%'}} >
            <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
              <CardHeader
                title={data.questionnairesCount + " Questionnaires"}
              />
              <QuestionnairesTable 
                questionnaires={ data.questionnaires }
                selectedQuestionnaireId={data.selectedQuestionnaireId}                  
                onRemoveRecord={function(questionnaireId){
                  Questionnaires.remove({_id: questionnaireId})
                }}
                onRowClick={function(questionnaireId){
                  console.log('Clicked on a row.  Questionnaire Id: ' + questionnaireId)
                  Session.set('selectedQuestionnaireId', questionnaireId)
                  Session.set('selectedQuestionnaire', Questionnaires.findOne({id: questionnaireId}))
                }}
                formFactorLayout={formFactor}              
              />
            </StyledCard>
          </Grid>
          <Grid item lg={secondaryGridSize} style={secondaryGridStyle}>
              <h1 className="barcode helveticas">{data.selectedQuestionnaireId}</h1>
            <StyledCard margin={20} width={cardWidth + 'px'}>
              <CardContent>
                <FormControl style={{width: '100%', marginTop: '20px'}}>
                  <InputAdornment 
                    style={classes.label}
                  >Questionnaire Title</InputAdornment>
                  <Input
                    id="publisherInput"
                    name="publisherInput"
                    style={classes.input}
                    value={ get(this, 'data.selectedQuestionnaire.title', '') }
                    onChange={ this.changeText.bind(this, 'title')}
                    fullWidth              
                  />       
                </FormControl>    
                <Grid container>
                  <Grid item md={6}>
                    <FormControl style={{width: '100%', marginTop: '20px'}}>
                      <InputAdornment 
                        style={classes.label}
                      >Identifier</InputAdornment>
                      <Input
                        id="identifierInput"
                        name="identifierInput"
                        style={classes.input}
                        value={ get(this, 'data.selectedQuestionnaire.identifier.value', '') }
                        fullWidth              
                      />       
                    </FormControl>    
                  </Grid>
                  <Grid item md={3}>
                    <FormControl style={{width: '100%', marginTop: '20px'}}>
                      <InputAdornment 
                        style={classes.label}
                      >Date</InputAdornment>
                      <Input
                        id="dateInput"
                        name="dateInput"
                        style={classes.input}
                        value={ moment(get(this, 'data.selectedQuestionnaire.date', '')).format("YYYY-MM-DD") }
                        fullWidth              
                      />       
                    </FormControl>    
                  </Grid>
                  <Grid item md={3}>
                    <FormControl style={{width: '100%', marginTop: '20px'}}>
                      <InputAdornment 
                        style={classes.label}
                      >Status</InputAdornment>
                      <Input
                        id="statusInput"
                        name="statusInput"
                        style={classes.input}
                        value={ get(this, 'data.selectedQuestionnaire.status', '') }
                        fullWidth              
                      />       
                    </FormControl>    
                  </Grid>
                </Grid>
              </CardContent>
              {/* <CardActions>
                <Button id='isActiveButton' onClick={this.toggleActiveStatus.bind(this)} primary={ data.isActive } >{isActiveLabel}</Button>
                <Button id='isSortingButton' onClick={this.toggleSortStatus.bind(this)} primary={ data.isSorting } >Sort</Button>
              </CardActions> */}
            </StyledCard>
            <DynamicSpacer />

            <QuestionnaireExpansionPanels 
              id='questionnaireDetails' 
              selectedQuestionnaire={data.selectedQuestionnaire} 
              selectedQuestionnaireId={data.selectedQuestionnaireId}
              />


            <DynamicSpacer />
            <Button id='saveAnswersButton' onClick={this.handleSaveQuestionnaireResponse.bind(this)} color="primary" variant="contained" fullWidth>Submit Questionnaire Response (Hardcoded)</Button>

          </Grid>
        </Grid>
      </MuiThemeProvider>         
    </PageCanvas>
  );
}


export default QuestionnairesPage;