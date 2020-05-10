
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

import QuestionnaireDetailExpansionPanels from './QuestionnaireDetailExpansionPanels';
import QuestionnairesTable from './QuestionnairesTable';
import SortableQuestionnaire from './SortableQuestionnaire';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { 
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  FormControlLabel,
} from '@material-ui/core';


import PropTypes from 'prop-types';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';
import { Random } from 'meteor/random';

import moment from 'moment';
import { get } from 'lodash';

let defaultQuestionnaire = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
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

export class QuestionnairesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('questionnairePageTabIndex'),
      questionnaire: defaultQuestionnaire,
      questionnaireSearchFilter: '',
      currentQuestionnaire: null,
      questionnaireId: false,
      sortableItems: [],
      enabled: Session.get('enableCurrentQuestionnaire'),
      chatbotInstalled: false,
      questionnaireName: '',
      questionnaireDesignerCurrentQuestion: {text: ''},
      questionnaireDesignerCurrentMultiChoice: {label: ''},
      isActive: false,
      isNumber: false,
      isSorting: Session.get('questionnaireIsSorting'),
      activeQuestionLinkId: Session.get('activeQuestionLinkId'),
      onePageLayout: true,
      questionnaires: Questionnaires.find().fetch(),
      questionnairesCount: Questionnaires.find().count(), 
      selectedQuestionnaireId: Session.get('selectedQuestionnaireId'),
      selectedQuestionnaire: Session.get('selectedQuestionnaire')
    };

    // if (Session.get('questionnaireFormData')) {
    //   data.questionnaire = Session.get('questionnaireFormData');
    // }
    if (Session.get('questionnaireSearchFilter')) {
      data.questionnaireSearchFilter = Session.get('questionnaireSearchFilter');
    }

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

    if(Session.get('activeQuestionLinkId')){
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
    return data;
  }
  toggleSortStatus(){
    if(Session.equals('questionnaireIsSorting', true)){
      this.saveSortedQuestionnaire();
      Session.set('questionnaireIsSorting', false);
    } else {
      Session.set('questionnaireIsSorting', true);
    }    
  }
  // toggleActiveStatus(event, newValue){
  //   //Session.toggle('enableCurrentQuestionnaire');
  //   console.log('toggleActiveStatus', event, newValue)
  //   console.log('toggleActiveStatus currentQuestionnaire id', get(this, 'data.currentQuestionnaire._id'))

  //   let currentStatus =  get(this, 'data.currentQuestionnaire.status');

  //   console.log('currentStatus', currentStatus)

  //   if(currentStatus === 'inactive'){
  //     Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
  //       'status': 'active'
  //     }});
  //   } else if (currentStatus === 'active'){
  //     Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
  //       'status': 'inactive'
  //     }});
  //   }
  // }

  handleTabChange(index){
    Session.set('questionnairePageTabIndex', index);
  }
  selectLanguage(){
    
  }
  onNewTab(){
    Session.set('selectedQuestionnaire', false);
    Session.set('questionnaireUpsert', false);
  }
  addChoice(){
    console.log('addChoice')
  }
  changeText(name, event, newValue){
    console.log('changeText', this, newValue)

    // Session.set('activeQuestionnaireName', newValue);
    // console.log('_id', get(this, 'data.currentQuestionnaire._id'))

    Questionnaires.update({_id: get(this, 'data.currentQuestionnaire._id')}, {$set: {
      'title': newValue
    }});
  }

  onSend(id){
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

  saveQuestion(event, activeQuestionLinkId){
    console.log('Saving question to Questionnaire/', get(this, 'data.currentQuestionnaire._id'))
    console.log(' ')
    console.log('Going to try to add the following item: ');
    console.log(Session.get('questionnaireDesignerCurrentQuestion'));
    console.log(' ')
    console.log('ActiveQuestionLinkId', this.data.activeQuestionLinkId);
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
  addQuestion(event, bar, baz){
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
  returnCurrentlySelectedQuestionItem(event){
    console.log('Returning currently selected Question Item')
    return '';
  }
  updateQuestionText(event, newValue){
    // console.log('record id', get(this, 'data.currentQuestionnaire._id'))
    console.log('updateQuestionText', newValue)

    let newQuestionState = Session.get('questionnaireDesignerCurrentQuestion');
    newQuestionState.text = newValue;

    Session.set('questionnaireDesignerCurrentQuestion', newQuestionState);
    console.log('newQuestionState', newQuestionState)
  }
  saveSortedQuestionnaire(){
    // Session.set('editedQuestionnaire', {
    //   questionnaireId: Session.get('selectedQuestionnaire'),
    //   items: this.state.items
    // })

    let editedQuestionnaire = Session.get('editedQuestionnaire');
    let currentQuestionnaire = Questionnaires.findOne(get(editedQuestionnaire, 'questionnaireId'));

    let updatedItemArray = [];

    if(editedQuestionnaire){
      if(Array.isArray(editedQuestionnaire.items)){
        editedQuestionnaire.items.forEach(function(editedItem){
          console.log('editedItem', editedItem)
          
          currentQuestionnaire.item.forEach(function(currentItem){
            console.log('currentItem', currentItem)
            if(editedItem.text === currentItem.text){
              console.log('found match; pushing')
              updatedItemArray.push(currentItem);
            }        
          });
        });
      }
  
      console.log('Current  questionnaire item array: ', currentQuestionnaire.item);
      console.log('Proposed questionnaire item array: ', updatedItemArray);
  
      let count = 0;
      updatedItemArray.forEach(function(item){
        if(count === 0){
          item.linkId = 1;
        } else {
          item.linkId = Random.id()
        }
        count++;
      })  
  
      console.log('Renormalized linkIds: ', updatedItemArray);
  
      if(get(editedQuestionnaire, 'questionnaireId')){
        Questionnaires.update({_id: get(editedQuestionnaire, 'questionnaireId')}, {$set: {
          item: updatedItemArray
        }})
        Session.set('questionnaireIsSorting', false)
      }      
    }
  }
  render() {
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

    // let isActiveLabel = 'Active';

    // if(this.data.isActive){
    //   isActiveLabel = 'Active';
    // } else {
    //   isActiveLabel = 'Inactive';
    // }

    return (
      <PageCanvas id="questionnairesPage" headerHeight={headerHeight}>
        <MuiThemeProvider theme={muiTheme} >
          <Grid container>
            <Grid item md={6}>
              <StyledCard height="auto" margin={20}>
                <CardHeader
                  title={this.data.questionnairesCount + " Questionnaires"}
                />
                <QuestionnairesTable 
                  questionnaires={ this.data.questionnaires }
                  hideCheckbox={true}
                  hideActionIcons={true}
                  hideIdentifier={true}
                  onRemoveRecord={function(questionnaireId){
                    Questionnaires.remove({_id: questionnaireId})
                  }}
                  onRowClick={function(questionnaireId){
                    console.log('Clicked on a row.  Questionnaire Id: ' + questionnaireId)
                    Session.set('selectedQuestionnaireId', questionnaireId)
                    Session.set('selectedQuestionnaire', Questionnaires.findOne({id: questionnaireId}))
                  }}
                  hideCheckbox={true}                  
                />
              </StyledCard>
            </Grid>
            <Grid item md={5} style={{position: 'sticky', top: '0px', margin: '20px'}}>
                <h1 className="barcode helveticas">{this.data.selectedQuestionnaireId}</h1>
              <StyledCard margin={20}>
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
                  <Button id='isActiveButton' onClick={this.toggleActiveStatus.bind(this)} primary={ this.data.isActive } >{isActiveLabel}</Button>
                  <Button id='isSortingButton' onClick={this.toggleSortStatus.bind(this)} primary={ this.data.isSorting } >Sort</Button>
                </CardActions> */}
              </StyledCard>
              <DynamicSpacer />

              <QuestionnaireDetailExpansionPanels 
                id='questionnaireDetails' 
                selectedQuestionnaire={this.data.selectedQuestionnaire} 
                selectedQuestionnaireId={this.data.selectedQuestionnaireId}
                />

              {/* <StyledCard margin={20}>
                <CardContent>
                </CardContent>
              </StyledCard> */}
            </Grid>
          </Grid>
        </MuiThemeProvider>         
      </PageCanvas>
    );
  }
}


ReactMixin(QuestionnairesPage.prototype, ReactMeteorData);
export default QuestionnairesPage;