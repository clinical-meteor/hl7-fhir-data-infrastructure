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
import ReactMixin  from 'react-mixin';

import ListDetail from './ListDetail';
import ListsTable from './ListsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';


//===============================================================================================================
// Session Variables

Session.setDefault('listPageTabIndex', 0);
Session.setDefault('listSearchFilter', '');
Session.setDefault('selectedListId', '');
Session.setDefault('selectedList', false);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('listsArray', []);
Session.setDefault('ListsPage.onePageLayout', true)



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
// Main Component

export class ListsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listId: false,
      list: {}
    }
  }
  getMeteorData() {
    let data = {
      tabIndex: Session.get('listPageTabIndex'),
      listSearchFilter: Session.get('listSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedListId: Session.get("selectedListId"),
      selectedList: Session.get("selectedList"),
      selected: [],
      lists: [],
      query: {},
      options: {
        limit: get(Meteor, 'settings.public.defaults.paginationLimit', 5)
      },
      tabIndex: Session.get('listPageTabIndex'),
      onePageLayout: true,
      listsCount: Lists.find().count()
    };

    data.onePageLayout = Session.get('ListsPage.onePageLayout');

    console.log('ListsPage.data.query', data.query)
    console.log('ListsPage.data.options', data.options)

    data.lists = Lists.find(data.query, data.options).fetch();
    data.listsCount = Lists.find(data.query, data.options).count();

    // console.log("ListsPage[data]", data);
    return data;
  }

  // this could be a mixin
  handleTabChange(index){
    Session.set('listPageTabIndex', index);
  }
  handleActive(index){
  }
  onCancelUpsertList(context){
    Session.set('listPageTabIndex', 1);
  }
  onDeleteList(context){
    Lists._collection.remove({_id: get(context, 'state.listId')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Lists.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('selectedListId', false);
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Lists", recordId: context.state.listId});
        Bert.alert('List removed!', 'success');
      }
    });
    Session.set('listPageTabIndex', 1);
  }
  onUpsertList(context){
    //if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new List...', context.state)

    if(get(context, 'state.list')){
      let self = context;
      let fhirListData = Object.assign({}, get(context, 'state.list'));
  
      // if(process.env.NODE_ENV === "test") console.log('fhirListData', fhirListData);
  
      let listValidator = ListSchema.newContext();
      // console.log('listValidator', listValidator)
      listValidator.validate(fhirListData)
  
      if(process.env.NODE_ENV === "development"){
        console.log('IsValid: ', listValidator.isValid())
        console.log('ValidationErrors: ', listValidator.validationErrors());
  
      }
  
      console.log('Checking context.state again...', context.state)
      if (get(context, 'state.listId')) {
        if(process.env.NODE_ENV === "development") {
          console.log("Updating list...");
        }

        delete fhirListData._id;
  
        // not sure why we're having to respecify this; fix for a bug elsewhere
        fhirListData.resourceType = 'List';
  
        Lists._collection.update({_id: get(context, 'state.listId')}, {$set: fhirListData }, function(error, result){
          if (error) {
            if(process.env.NODE_ENV === "test") console.log("Lists.insert[error]", error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Lists", recordId: context.state.listId});
            Session.set('selectedListId', false);
            Session.set('listPageTabIndex', 1);
            Bert.alert('List added!', 'success');
          }
        });
      } else {
        // if(process.env.NODE_ENV === "test") 
        console.log("Creating a new list...", fhirListData);
  
        fhirListData.effectiveDateTime = new Date();
        Lists._collection.insert(fhirListData, function(error, result) {
          if (error) {
            if(process.env.NODE_ENV === "test")  console.log('Lists.insert[error]', error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Lists", recordId: context.state.listId});
            Session.set('listPageTabIndex', 1);
            Session.set('selectedListId', false);
            Bert.alert('List added!', 'success');
          }
        });
      }
    } 
    Session.set('listPageTabIndex', 1);
  }
  handleRowClick(listId, foo, bar){
    console.log('ListsPage.handleRowClick', listId)
    let list = Lists.findOne({id: listId});

    Session.set('selectedListId', get(list, 'id'));
    Session.set('selectedList', list);
  }
  onTableCellClick(id){
    Session.set('listsUpsert', false);
    Session.set('selectedListId', id);
    Session.set('listPageTabIndex', 2);
  }
  // onInsert(listId){
  //   Session.set('selectedListId', '');
  //   Session.set('listPageTabIndex', 1);
  //   HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Lists", recordId: listId});
  // }
  // onUpdate(listId){
  //   Session.set('selectedListId', '');
  //   Session.set('listPageTabIndex', 1);
  //   HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Lists", recordId: listId});
  // }
  // onRemove(listId){
  //   Session.set('listPageTabIndex', 1);
  //   Session.set('selectedListId', '');
  //   HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Lists", recordId: listId});
  // }
  // onCancel(){
  //   Session.set('listPageTabIndex', 1);
  // } 
  render() {
    // console.log('ListsPage.data', this.data)

    function handleChange(event, newValue) {
      Session.set('listPageTabIndex', newValue)
    }

    let headerHeight = LayoutHelpers.calcHeaderHeight();

    let paddingWidth = 84;
    if(Meteor.isCordova){
      paddingWidth = 20;
    }
    let cardWidth = window.innerWidth - paddingWidth;

    let layoutContents;
    if(this.data.onePageLayout){
      layoutContents = <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
        <CardHeader title={this.data.listsCount + " Lists"} />
        <CardContent>

          <ListsTable 
            lists={ this.data.lists }
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
          <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
            <CardHeader title={this.data.listsCount + " Lists"} />
            <CardContent>
              <ListsTable 
                lists={ this.data.lists }
                selectedListId={ this.data.selectedListId }
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
                count={this.data.listsCount}
                />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item lg={4}>
          <StyledCard height="auto" margin={20} scrollable width={cardWidth + 'px'}>
            <h1 className="barcode" style={{fontWeight: 100}}>{this.data.selectedListId }</h1>
            <CardContent>
              <CardContent>
                <ListDetail 
                  id='listDetails' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  list={ this.data.selectedList }
                  listId={ this.data.selectedListId } 
                  showListInputs={true}
                  showHints={false}
                />
              </CardContent>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    }

    return (
      <PageCanvas id="listsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(ListsPage.prototype, ReactMeteorData);
export default ListsPage;