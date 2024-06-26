import { 
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
  Box,
  Dialog,
  TextField
} from '@material-ui/core';
import { StyledCard, PageCanvas } from 'fhir-starter';


import PatientsTable from './PatientsTable';
import React from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';

import { Patients } from '../../lib/Patients';
import { Session } from 'meteor/session';


Session.setDefault('patientDialogOpen', false);
export class PatientPickList extends React.Component {
  constructor(props) {
    super(props);
  }
  getMeteorData() {
    return {
      patientDialog: {
        open: Session.get('patientDialogOpen'),
        patient: {
          display: '',
          reference: ''
        }
      }
    };
  }
  changeInput(variable, event, value){
    Session.set(variable, value);
  }
  handleOpenPatients(){
    console.log('handleOpenPatients')
    Session.set('patientDialogOpen', true);
  }  
  handleClosePatients(){
    Session.set('patientDialogOpen', false);
  }  
  render() {
    const patientActions = [
      <Button
        primary={true}
        onClick={this.handleClosePatients}
      >Clear</Button>,
      <Button
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClosePatients}
      >Select</Button>
    ];
    return(
      <StyledCard>
        <CardHeader
          title="Patient Pick List"
        />
        <CardContent>

          <TextField
            hintText="Jane Doe"
            errorText="Patient Search"
            onChange={this.changeInput.bind(this, 'description')}
            value={this.data.patientDialog.patient.display}
            fullWidth>
              <Button                
                className="patientsButton"
                primary={true}
                onClick={this.handleOpenPatients}
                // icon={ <AccountCircle /> }
                style={{textAlign: 'right', cursor: 'pointer'}}
              >Patients</Button>
            </TextField>

          <Dialog
            title="Patient Search"
            actions={patientActions}
            modal={false}
            open={this.data.patientDialog.open}
            onRequestClose={this.handleClosePatients}
          >
            <CardContent style={{overflowY: "auto"}}>
            <TextField
              hintText="Jane Doe"
              errorText="Patient Search"
              onChange={this.changeInput.bind(this, 'description')}
              value={this.data.patientDialog.patient.display}
              fullWidth />
              <PatientsTable />
            </CardContent>
          </Dialog>
        </CardContent>
      </StyledCard>
    );
  }
}