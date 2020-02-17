// import { Meteor } from 'meteor/meteor';

// PractitionerActions = {
//     queryBigchain(text){
//         console.log("queryBigchain", text);

//         Meteor.call('searchBigchainForPractitioners', text, function(error, data){
//             if(error) console.log('error', error);
//             // console.log(data)

//             var parsedResults = [];

//             data.forEach(function(result){
//             parsedResults.push(result.data);
//             });
            
//             Session.set('practitionerBlockchainData', parsedResults);
//         });
//     }
// }