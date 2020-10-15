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

import ValueSetDetail from './ValueSetDetail';
import ValueSetsTable from './ValueSetsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import { get, cloneDeep } from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

Session.setDefault('valueSetPageTabIndex', 0);
Session.setDefault('valueSetSearchFilter', '');
Session.setDefault('selectedValueSetId', '');
Session.setDefault('selectedValueSet', '');
Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('valueSetsArray', []);
Session.setDefault('ValueSetsPage.onePageLayout', true)

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


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}




export class ValueSetsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueSetId: false,
      valueSet: {}
    }
  }
  getMeteorData() {
    let data = {
      tabIndex: Session.get('valueSetPageTabIndex'),
      valueSetSearchFilter: Session.get('valueSetSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedValueSetId: Session.get("selectedValueSetId"),
      selectedValueSet: Session.get("selectedValueSet"),
      selected: [],
      valueSets: [],
      query: {},
      options: {
        limit: get(Meteor, 'settings.public.defaults.paginationLimit', 5)
      },
      tabIndex: Session.get('valueSetPageTabIndex'),
      onePageLayout: true
    };

    data.onePageLayout = Session.get('ValueSetsPage.onePageLayout');


    console.log('ValueSetsPage.data.query', data.query)
    console.log('ValueSetsPage.data.options', data.options)

    data.valueSets = ValueSets.find(data.query, data.options).fetch();
    data.valueSetsCount = ValueSets.find(data.query, data.options).count();

    // console.log("ValueSetsPage[data]", data);
    return data;
  }



  handleRowClick(valueSetId){
    console.log('ValueSetsPage.handleRowClick', valueSetId)
    let valueSet = ValueSets.findOne({id: valueSetId});
    if(valueSet){
      Session.set('selectedValueSetId', get(valueSet, 'id'));
      Session.set('selectedValueSet', valueSet);  
    }
  }

  onInsert(valueSetId){
    Session.set('selectedValueSetId', '');
    //HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ValueSets", recordId: valueSetId});
  }
  onUpdate(valueSetId){
    Session.set('valueSetPageTabIndex', 1);
    //HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ValueSets", recordId: valueSetId});
  }
  onRemove(valueSetId){
    Session.set('selectedValueSetId', '');
    //HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "ValueSets", recordId: valueSetId});
  }
  onCancel(){
  } 
  render() {

    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();

    let paddingWidth = 84;
    if(Meteor.isCordova){
      paddingWidth = 20;
    }
    let cardWidth = window.innerWidth - paddingWidth;


    let layoutContents;
    if(this.data.onePageLayout){
      layoutContents = <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
        <CardHeader title={this.data.valueSetsCount + " ValueSets"} />
        <CardContent>

          <ValueSetsTable 
            valueSets={ this.data.valueSets }
            formFactorLayout={formFactor}
            paginationLimit={10}     
            />
          </CardContent>
        </StyledCard>
    } else {
      layoutContents = <Grid container spacing={3}>
        <Grid item lg={6}>
        <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
            <CardHeader title={this.data.valueSetsCount + " Value Sets"} />
            <CardContent>
              <ValueSetsTable 
                valueSets={ this.data.valueSets }
                selectedValueSetId={ this.data.selectedValueSetId }
                formFactorLayout={formFactor}
                paginationLimit={10}            
                onRowClick={this.handleRowClick.bind(this) }
                count={this.data.valueSetsCount}
                />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item lg={4}>
        <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
            <h1 className="barcode" style={{fontWeight: 100}}>{this.data.selectedValueSetId }</h1>
            {/* <CardHeader title={this.data.selectedValueSetId } className="helveticas barcode" /> */}
            <CardContent>
              <CardContent>
                <ValueSetDetail 
                  id='valueSetDetails' 
                  displayDatePicker={true} 
                  displayBarcodes={false}
                  valueSet={ this.data.selectedValueSet }
                  valueSetId={ this.data.selectedValueSetId } 
                  showValueSetInputs={true}
                  showHints={false}
                />
              </CardContent>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    }

    return (
      <PageCanvas id="valueSetsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(ValueSetsPage.prototype, ReactMeteorData);
export default ValueSetsPage;