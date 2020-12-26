

import { 
  CardHeader,
  CardContent
} from '@material-ui/core';

import { StyledCard, PageCanvas } from 'material-fhir-ui';

import CommunicationsTable from './CommunicationsTable';
import LayoutHelpers from '../../lib/LayoutHelpers';

import React, { useState }  from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Session } from 'meteor/session';
import moment from 'moment';

import { get } from 'lodash';




// //=============================================================================================================================================
// // GLOBAL THEMING

// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// // This is necessary for the Material UI component render layer
// let theme = {
//   primaryColor: "rgb(108, 183, 110)",
//   primaryText: "rgba(255, 255, 255, 1) !important",

//   secondaryColor: "rgb(108, 183, 110)",
//   secondaryText: "rgba(255, 255, 255, 1) !important",

//   cardColor: "rgba(255, 255, 255, 1) !important",
//   cardTextColor: "rgba(0, 0, 0, 1) !important",

//   errorColor: "rgb(128,20,60) !important",
//   errorText: "#ffffff !important",

//   appBarColor: "#f5f5f5 !important",
//   appBarTextColor: "rgba(0, 0, 0, 1) !important",

//   paperColor: "#f5f5f5 !important",
//   paperTextColor: "rgba(0, 0, 0, 1) !important",

//   backgroundCanvas: "rgba(255, 255, 255, 1) !important",
//   background: "linear-gradient(45deg, rgb(108, 183, 110) 30%, rgb(150, 202, 144) 90%)",

//   nivoTheme: "greens"
// }

// // if we have a globally defined theme from a settings file
// if(get(Meteor, 'settings.public.theme.palette')){
//   theme = Object.assign(theme, get(Meteor, 'settings.public.theme.palette'));
// }

// const muiTheme = createMuiTheme({
//   typography: {
//     useNextVariants: true,
//   },
//   palette: {
//     primary: {
//       main: theme.primaryColor,
//       contrastText: theme.primaryText
//     },
//     secondary: {
//       main: theme.secondaryColor,
//       contrastText: theme.errorText
//     },
//     appBar: {
//       main: theme.appBarColor,
//       contrastText: theme.appBarTextColor
//     },
//     cards: {
//       main: theme.cardColor,
//       contrastText: theme.cardTextColor
//     },
//     paper: {
//       main: theme.paperColor,
//       contrastText: theme.paperTextColor
//     },
//     error: {
//       main: theme.errorColor,
//       contrastText: theme.secondaryText
//     },
//     background: {
//       default: theme.backgroundCanvas
//     },
//     contrastThreshold: 3,
//     tonalOffset: 0.2
//   }
// });


//=============================================================================================================================================
// STATIC DATA??

let defaultCommunication = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};

//=============================================================================================================================================
// SESSION VARIABLES


Session.setDefault('communicationSearchFilter', '');



//=============================================================================================================================================
// MAIN COMPONENT

export function CommunicationsPage(props){

  let data = {   
    communication: defaultCommunication,
    selectedCommunication: null,
    selectedCommunicationId: ''
  };

  data.selectedCommunicationId = useTracker(function(){
    return Session.get('selectedCommunicationId');
  }, [])
  data.selectedCommunication = useTracker(function(){
    return AuditEvents.findOne(Session.get('selectedCommunicationId'));
  }, [])
  data.communications = useTracker(function(){
    return Communications.find().fetch();
  }, [])


  let headerHeight = LayoutHelpers.calcHeaderHeight();
  let formFactor = LayoutHelpers.determineFormFactor();
  let paddingWidth = LayoutHelpers.calcCanvasPaddingWidth();

  return (
    <PageCanvas id="communicationsPage" headerHeight={headerHeight} paddingLeft={paddingWidth} paddingRight={paddingWidth}>

      <StyledCard height="auto" margin={20} >
        <CardHeader
          title="Communication Log"
        />
        <CardContent>
          <CommunicationsTable 
            communications={data.communications}
            hideIdentifier={true}
            hideCheckbox={true}
            hideActionIcons={true}
            hideBarcode={false} 
            onRemoveRecord={function(recordId){
              Communications.remove({_id: recordId})
            }}
            actionButtonLabel="Enroll"
          />
        </CardContent>
      </StyledCard>
    </PageCanvas>
  );
}



export default CommunicationsPage;