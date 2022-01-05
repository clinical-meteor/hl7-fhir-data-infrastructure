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

// import ListDetail from './ListDetail';
import ListsTable from './ListsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { StyledCard, PageCanvas } from 'fhir-starter';

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

export function ListsPage(props){

  let data = {
    selectedListId: '',
    selectedList: null,
    lists: [],
    query: {},
    options: {
      limit: get(Meteor, 'settings.public.defaults.paginationLimit', 5)
    },
    onePageLayout: true
  };

  data.onePageLayout = useTracker(function(){
    return Session.get('ListsPage.onePageLayout');
  }, [])
  data.selectedListId = useTracker(function(){
    return Session.get('selectedListId');
  }, [])
  data.selectedList = useTracker(function(){
    return Lists.findOne(Session.get('selectedListId'));
  }, [])
  data.lists = useTracker(function(){
    return Lists.find().fetch();
  }, [])


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();


  let cardWidth = window.innerWidth - paddingWidth;

  let layoutContents;
  if(data.onePageLayout){
    layoutContents = <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
      <CardHeader title={data.lists.length + " Lists"} />
      <CardContent>

        <ListsTable 
          lists={ data.lists }
          hideCheckbox={true} 
          hideActionIcons={true}
          hideIdentifier={true} 
          hideTitle={false} 
          hideItemCount={false}
          paginationLimit={10}     
          />
        </CardContent>
      </StyledCard>
  } else {
    layoutContents = <Grid container spacing={3}>
      <Grid item lg={6}>
        <StyledCard height="auto" margin={20} width={cardWidth + 'px'}>
          <CardHeader title={data.lists.length + " Lists"} />
          <CardContent>
            <ListsTable 
              lists={ data.lists }
              selectedListId={ data.selectedListId }
              hideIdentifier={true} 
              hideCheckbox={true} 
              hideItemCount={false}
              paginationLimit={10}            
              hideActionIcons={true}
              onRowClick={this.handleRowClick.bind(this) }
              count={data.listsCount}
              />
          </CardContent>
        </StyledCard>
      </Grid>
      <Grid item lg={4}>
        <StyledCard height="auto" margin={20} scrollable width={cardWidth + 'px'}>
          <h1 className="barcode" style={{fontWeight: 100}}>{data.selectedListId }</h1>
          <CardContent>
            <CardContent>
              {/* <ListDetail 
                id='listDetails' 
                displayDatePicker={true} 
                displayBarcodes={false}
                list={ data.selectedList }
                listId={ data.selectedListId } 
                showListInputs={true}
                showHints={false}
              /> */}
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


export default ListsPage;