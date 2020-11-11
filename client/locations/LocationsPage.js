import { 
  Divider,
  Card,
  Checkbox,
  CardHeader,
  CardContent,
  Button,
  Tab, 
  Tabs,
  Typography,
  Box
} from '@material-ui/core';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import LocationDetail from './LocationDetail';
import LocationsTable from './LocationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get } from 'lodash';

//=============================================================================================================================================
// Session Variables

Session.setDefault('locationPageTabIndex', 1); 
Session.setDefault('locationSearchFilter', ''); 
Session.setDefault('shapefileDataLayer', false);
Session.setDefault('tspRoute', []);
Session.setDefault('mortalityLayer', true);
Session.setDefault('proximityDistance', '5000');
Session.setDefault('priximityLocations', false);

Session.setDefault('selectedLocationId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

Session.setDefault('LocationsPage.onePageLayout', true)


//=============================================================================================================================================
// GLOBAL THEMING

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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


//=============================================================================================================================================
// TABS

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


//=============================================================================================================================================
// MAIN COMPONENT


export class LocationsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        },
        page: {
          position: 'fixed',
          top: '0px',
          left: '0px',
          height: Session.get('appHeight'),
          width: Session.get('appWidth')
        },
        canvas: {
          left: '0px',
          top: '0px',
          position: 'fixed'
        }
      },
      tabIndex: Session.get('locationPageTabIndex'),
      locationSearchFilter: Session.get('locationSearchFilter'),
      selectedLocationId: Session.get('selectedLocationId'),
      currentLocation: null,
      fhirVersion: Session.get('fhirVersion') ,
      locations: Locations.find().fetch(),
      locationsCount: Locations.find().count(),
      onePageLayout: Session.get('MeasureReportsPage.onePageLayout')
    };

    
    if(process.env.NODE_ENV === "test") console.log("LocationsPage[data]", data);
    return data;
  }

  render() {
    var self = this;
    var markers = [];

    let headerHeight = LayoutHelpers.calcHeaderHeight();
    const rowsPerPage = get(Meteor, 'settings.public.defaults.rowsPerPage', 20);

    let layoutContents;
    if(this.data.onePageLayout){
      layoutContents = <StyledCard height="auto" scrollable={true} margin={20}  >
        <CardHeader
          title="Locations"
        />
        <CardContent>
          <LocationsTable 
            locations={this.data.locations}
            rowsPerPage={ LayoutHelpers.calcTableRows("medium", this.props.appHeight) }
            tableRowSize="medium"
            count={this.data.locationsCount}      
          />
        </CardContent>
      </StyledCard>
    } else {
      layoutContents = <Grid container spacing={3}>
        <Grid item lg={6}>
          <StyledCard height="auto" scrollable={true} margin={20} >
            <CardHeader
              title="Locations"
            />
            <CardContent>
              <LocationsTable 
                locations={this.data.locations}
                rowsPerPage={ LayoutHelpers.calcTableRows("medium", this.props.appHeight) }
                // tableRowSize="medium"
                count={this.data.locationsCount}       
              />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item lg={4}>
          <StyledCard height="auto" margin={20}  scrollable>
            <h1 className="barcode" style={{fontWeight: 100}}>{this.data.selectedMeasureReportId }</h1>
            <CardContent>
              <CardContent>
                <LocationDetail 

                />                
              </CardContent>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    }

          
    return (
      <PageCanvas id="locationsPage" headerHeight={headerHeight} >
        <MuiThemeProvider theme={muiTheme} >
          { layoutContents }
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}



ReactMixin(LocationsPage.prototype, ReactMeteorData);

export default LocationsPage;