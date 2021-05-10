
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React  from 'react';
import { ReactMeteorData, useTracker } from 'meteor/react-meteor-data';

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

import { get, has } from 'lodash';

export function SearchConsentsDialog(props){
    return(<Dialog
        title="Search Consent Records"
        actions={actions}
        modal={false}
        open={data.dialogOpen}
        onRequestClose={handleClose}
      >
        <Grid container spacing={3}>
          <Grid item md={6}>
            <TextField
              id='givenNameInput'
              ref='givenName'
              name='givenName'
              floatingLabelText='Given Name'
              hintText='Jane'
              value={ get(this, 'state.searchForm.givenName', '')}
              onChange={ changeState.bind(this, 'givenName')}
              floatingLabelFixed={true}
              fullWidth
              /><br/>
          </Grid>
          <Grid item md={6}>
            <TextField
              id='familyNameInput'
              ref='familyName'
              name='familyName'
              floatingLabelText='Family Name'
              hintText='Doe'
              value={ get(this, 'state.searchForm.familyName', '')}
              onChange={ changeState.bind(this, 'familyName')}
              floatingLabelFixed={true}
              fullWidth
              /><br/>

          </Grid>
        </Grid>
        <SelectField
            floatingLabelText="Category"
            value={ state.searchForm.category }
            onChange={changeSelectedCategory.bind(this)}
            fullWidth={true}
          >
            <MenuItem value={0} primaryText="" />
            <MenuItem value={1} primaryText="Patient Authorization for Text Communications" />
            <MenuItem value={2} primaryText="OAuth 2.0" />
            <MenuItem value={3} primaryText="Do Not Resuscitate" />
            <MenuItem value={4} disabled primaryText="Illinois Consent by Minors to Medical Procedures" />
            <MenuItem value={5} disabled primaryText="42 CFR Part 2 Form of Written Consent" />
            <MenuItem value={6} disabled primaryText="Common rule informed consent" />
            <MenuItem value={7} disabled primaryText="HIPAA Authorization" />
            <MenuItem value={8} disabled primaryText="HIPAA Notice of Privacy Practices" />
            <MenuItem value={9} disabled primaryText="HIPAA Restrictions" />
            <MenuItem value={10} disabled primaryText="HIPAA Research Authorization" />
            <MenuItem value={11} primaryText="Authorization to Disclose Information to the Social Security Administration" />
            <MenuItem value={12} primaryText="Authorization and Consent to Release Information to the Department of Veterans Affairs (VA)" />               
          </SelectField>
      </Dialog>)
}