import React  from 'react';
import ReactMixin  from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

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

// import DeviceDetail from './DeviceDetail';
import DevicesTable from './DevicesTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { get } from 'lodash';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import LayoutHelpers from '../../lib/LayoutHelpers';


//=============================================================================================================================================
// Session Variables

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedDeviceId', false);


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
// COMPONENTS

export class DevicesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('devicePageTabIndex'),
      deviceSearchFilter: Session.get('deviceSearchFilter'),
      currentDeviceId: Session.get('selectedDeviceId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedDevice: false,
      devices: Devices.find().fetch(),
      deviceCount: Devices.find().count()
    };

    if (Session.get('selectedDeviceId')){
      data.selectedDevice = Devices.findOne({_id: Session.get('selectedDeviceId')});
    } else {
      data.selectedDevice = false;
    }

    return data;
  }

  handleTabChange(index){
    Session.set('devicePageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedDeviceId', false);
    Session.set('deviceUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In DevicesPage render');

    let headerHeight = LayoutHelpers.calcHeaderHeight();
    let formFactor = LayoutHelpers.determineFormFactor();

    let paddingWidth = 84;
    if(Meteor.isCordova){
      paddingWidth = 20;
    }
    let cardWidth = window.innerWidth - paddingWidth;
    
    return (
      <PageCanvas id="devicesPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>
        <MuiThemeProvider theme={muiTheme} >
          <StyledCard height="auto" scrollable={true} margin={20} width={cardWidth + 'px'}>
            <CardHeader title='Devices' />
            <CardContent>
              <DevicesTable 
                devices={this.data.devices}
                count={this.data.devicesCount}
                formFactorLayout={formFactor}
              />
            </CardContent>
        </StyledCard>
        </MuiThemeProvider>
      </PageCanvas>
    );
  }
}

ReactMixin(DevicesPage.prototype, ReactMeteorData);
export default DevicesPage;