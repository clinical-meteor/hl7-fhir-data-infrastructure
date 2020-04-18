import { CardText, CardTitle } from 'material-ui';
import { Tab, Tabs } from 'material-ui/Tabs';
import { Glass, GlassCard, VerticalCanvas, FullPageCanvas } from 'meteor/clinical:glass-ui';

import QuestionnaireResponseDetail from './QuestionnaireResponseDetail';
import QuestionnaireResponseTable from './QuestionnaireResponseTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';


import { Session } from 'meteor/session';

let defaultQuestionnaireResponse = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('questionnaireResponseFormData', defaultQuestionnaireResponse);
Session.setDefault('questionnaireResponseSearchFilter', '');

export class QuestionnaireResponsesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('questionnaireResponsePageTabIndex'),
      questionnaireResponse: defaultQuestionnaireResponse,
      questionnaireResponseId: Session.get('selectedQuestionnaireResponse'),
      questionnaireResponseSearchFilter: '',
      currentQuestionnaireResponse: null
    };

    if (Session.get('questionnaireResponseFormData')) {
      data.questionnaireResponse = Session.get('questionnaireResponseFormData');
    }
    if (Session.get('questionnaireResponseSearchFilter')) {
      data.questionnaireResponseSearchFilter = Session.get('questionnaireResponseSearchFilter');
    }
    if (Session.get("selectedQuestionnaireResponse")) {
      data.currentQuestionnaireResponse = QuestionnaireResponses.findOne(Session.get("selectedQuestionnaireResponse"));
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    //if(process.env.NODE_ENV === "test") 
    console.log("QuestionnaireResponsesPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('questionnaireResponsePageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedQuestionnaireResponse', false);
    Session.set('questionnaireResponseUpsert', false);
  }

  render() {
    // console.log('React.version: ' + React.version);
    return (
      <div id="questionnaireResponsesPage">
        <FullPageCanvas>
          <GlassCard height="auto">
            <CardTitle
              title="Questionnaire Responses"
            />
            <CardText>
              <Tabs id='questionnaireResponsesPageTabs' default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                 <Tab className="newQuestionnaireResponseTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                   <QuestionnaireResponseDetail id='newQuestionnaireResponse' />
                 </Tab>
                 <Tab className="questionnaireResponseListTab" label='QuestionnaireResponses' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                   <QuestionnaireResponseTable 
                    showBarcodes={true} 
                    showAvatars={true} 
                    onCellClick={function(responseId){
                      console.log('responseId', responseId)
                      Session.set('selectedQuestionnaireResponse', responseId)
                      Session.set('questionnaireResponsePageTabIndex', 2)
                    }}
                    onRemoveRecord={function(responseId){
                      console.log('onRemoveRecord()')
                      QuestionnaireResponses.remove({_id: responseId});                      
                    }}
                    />
                 </Tab>
                 <Tab className="questionnaireResponseDetailTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                   <QuestionnaireResponseDetail 
                    id='questionnaireResponseDetails' 
                    currentQuestionnaireResponse={this.data.currentQuestionnaireResponse} />
                 </Tab>
             </Tabs>


            </CardText>
          </GlassCard>
        </FullPageCanvas>
      </div>
    );
  }
}


ReactMixin(QuestionnaireResponsesPage.prototype, ReactMeteorData);
export default QuestionnaireResponsesPage;