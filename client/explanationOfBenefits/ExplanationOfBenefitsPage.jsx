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
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import ExplanationOfBenefitDetail from './ExplanationOfBenefitDetail';
import ExplanationOfBenefitsTable from './ExplanationOfBenefitsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

Session.setDefault('explanationOfBenefitPageTabIndex', 0);
Session.setDefault('explanationOfBenefitSearchFilter', '');
Session.setDefault('selectedExplanationOfBenefitId', '');
Session.setDefault('selectedExplanationOfBenefit', null);
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('explanationOfBenefitsArray', []);
Session.setDefault('ExplanationOfBenefitsPage.onePageLayout', true);

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




export class ExplanationOfBenefitsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      explanationOfBenefitId: false,
      explanationOfBenefit: {}
    }
  }
  getMeteorData() {
    let data = {
      tabIndex: Session.get('explanationOfBenefitPageTabIndex'),
      explanationOfBenefitSearchFilter: Session.get('explanationOfBenefitSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedExplanationOfBenefitId: Session.get("selectedExplanationOfBenefitId"),
      selectedExplanationOfBenefit: Session.get("selectedExplanationOfBenefit"),
      selected: [],
      explanationOfBenefits: [],
      query: {},
      options: {
        limit: get(Meteor, 'settings.public.defaults.paginationLimit', 5)
      },
      tabIndex: Session.get('explanationOfBenefitPageTabIndex'),
      onePageLayout: Session.get('ExplanationOfBenefitsPage.onePageLayout')
    };

    console.log('ExplanationOfBenefitsPage.data.query', data.query)
    console.log('ExplanationOfBenefitsPage.data.options', data.options)

    data.explanationOfBenefits = ExplanationOfBenefits.find(data.query, data.options).fetch();
    data.explanationOfBenefitsCount = ExplanationOfBenefits.find(data.query, data.options).count();

    // console.log("ExplanationOfBenefitsPage[data]", data);
    return data;
  }


  
  handleRowClick(explanationOfBenefitId, foo, bar){
    console.log('ExplanationOfBenefitsPage.handleRowClick', explanationOfBenefitId)
    let explanationOfBenefit = ExplanationOfBenefits.findOne({id: explanationOfBenefitId});

    Session.set('selectedExplanationOfBenefitId', get(explanationOfBenefit, 'id'));
    Session.set('selectedExplanationOfBenefit', explanationOfBenefit);
  }
  onTableCellClick(id){
    Session.set('explanationOfBenefitsUpsert', false);
    Session.set('selectedExplanationOfBenefitId', id);
  }
  tableActionButtonClick(_id){
    let explanationOfBenefit = ExplanationOfBenefits.findOne({_id: _id});

    // console.log("ExplanationOfBenefitsTable.onSend()", explanationOfBenefit);

    var httpEndpoint = "http://localhost:8080";
    if (get(Meteor, 'settings.public.interfaces.default.channel.endpoint')) {
      httpEndpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    }
    HTTP.post(httpEndpoint + '/explanationOfBenefit', {
      data: explanationOfBenefit
    }, function(error, result){
      if (error) {
        console.log("error", error);
      }
      if (result) {
        console.log("result", result);
      }
    });
  }
  onInsert(explanationOfBenefitId){
    Session.set('selectedExplanationOfBenefitId', '');
    Session.set('explanationOfBenefitPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "explanationOfBenefits", recordId: explanationOfBenefitId});
  }
  onUpdate(explanationOfBenefitId){
    Session.set('selectedExplanationOfBenefitId', '');
    Session.set('explanationOfBenefitPageTabIndex', 1);
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "explanationOfBenefits", recordId: explanationOfBenefitId});
  }
  onRemove(explanationOfBenefitId){
    Session.set('explanationOfBenefitPageTabIndex', 1);
    Session.set('selectedExplanationOfBenefitId', '');
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "explanationOfBenefits", recordId: explanationOfBenefitId});
  }
  onCancel(){
    Session.set('explanationOfBenefitPageTabIndex', 1);
  } 
  render() {

    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();

    let layoutContents;
    if(this.data.onePageLayout){
      layoutContents = <StyledCard height="auto" margin={20} >
        <CardHeader title={this.data.explanationOfBenefitsCount + " Explanation Of Benefits"} />
        <CardContent>

          <ExplanationOfBenefitsTable 
            explanationOfBenefits={ this.data.explanationOfBenefits }
            hideCheckbox={true} 
            hideActionIcons={true}
            hideStatus={false}
            hideIdentifier={false}    
            hideType={true}
            hideSubtype={false}
            hideUse={false}
            hidePatientDisplay={true}
            hidePatientReference={false}
            hideBillableStart={false}
            hideBillableEnd={false}
            hideCreated={false}
            hideInsurerDisplay={true}
            hideInsurerReference={false}
            hideProviderDisplay={true}
            hideProviderReference={false}
            hidePayeeType={true}
            hidePayeeDisplay={true}
            hidePayeeReference={false}
            hideOutcome={false}
            hidePaymentType={true}
            hidePaymentAmount={true}
            hidePaymentDate={true}
            hideBarcode={false}
            count={this.data.explanationOfBenefitsCount}
        
            paginationLimit={10}     
            />
          </CardContent>
        </StyledCard>
    } else {
      layoutContents = <Grid container spacing={3}>
        <Grid item lg={6}>
          <StyledCard height="auto" margin={20} >
            <CardHeader title={this.data.explanationOfBenefitsCount + " Explanation Of Benefits"} />
            <CardContent>
              <ExplanationOfBenefitsTable 
                explanationOfBenefits={ this.data.explanationOfBenefits }
                selectedExplanationOfBenefitId={ this.data.selectedExplanationOfBenefitId }
                hideStatus={false}
                hideIdentifier={false}    
                hideType={true}
                hideSubtype={false}
                hideUse={false}
                hidePatientDisplay={true}
                hidePatientReference={false}
                hideBillableStart={true}
                hideBillableEnd={true}
                hideCreated={false}
                hideInsurerDisplay={true}
                hideInsurerReference={false}
                hideProviderDisplay={true}
                hideProviderReference={false}
                hidePayeeType={true}
                hidePayeeDisplay={true}
                hidePayeeReference={false}
                hideOutcome={false}
                hidePaymentType={true}
                hidePaymentAmount={true}
                hidePaymentDate={true}
                hideBarcode={true}
                count={this.data.explanationOfBenefitsCount}
                    
                hideActionIcons={true}
                onRowClick={this.handleRowClick.bind(this) }
                count={this.data.explanationOfBenefitsCount}
                />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item lg={4}>
          <StyledCard height="auto" margin={20} scrollable>
            <h1 className="barcode" style={{fontWeight: 100}}>{this.data.selectedExplanationOfBenefitId }</h1>
            <CardContent>
              <CardContent>
                <ExplanationOfBenefitDetail 
                  id='ExplanationOfBenefitDetails' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  explanationOfBenefit={ this.data.selectedExplanationOfBenefit }
                  explanationOfBenefitId={ this.data.selectedExplanationOfBenefitId } 
                  showexplanationOfBenefitInputs={true}
                  showHints={false}
                />
              </CardContent>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    }

    return (
      <PageCanvas id="ExplanationOfBenefitsPage" headerHeight={headerHeight}>
        <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(ExplanationOfBenefitsPage.prototype, ReactMeteorData);
export default ExplanationOfBenefitsPage;