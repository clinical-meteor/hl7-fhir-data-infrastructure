import { get } from 'lodash';

Meteor.methods({
    createLocation:function(locationObject){
        check(locationObject, Object);

        if (process.env.NODE_ENV === 'test') {
            console.log('Creating Location...');
            Locations.insert(locationObject, function(error, result){
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log('Location created: ' + result);
            }
            });
        } else {
            console.log('This command can only be run in a test environment.');
            console.log('Try setting NODE_ENV=test');
        }
    },  
    removeLocationById: function(locationId){
        check(locationId, String);
        Locations.remove({_id: locationId});
    },
    dropLocations: function(){
        console.log('-----------------------------------------');
        console.log('Dropping Locations... ');
        if (process.env.NODE_ENV === 'test') {
            Locations.remove({});
        } else {
            console.log('This command can only be run in a test environment.');
            console.log('Try setting NODE_ENV=test');
        }
    },
    // These are Chicago area hospitals
    initializeHospitals: function(){

      var hospitals = [{
            name: "Childrens Memorial Hospital",
            lat: 41.9247546,
            lng: -87.6472764
        }, {
            name: "Bernard Mitchell Hospital",
            lat: 41.7892007,
            lng: -87.6044935
        }, {
            name: "Gottlieb Memorial Hospital",
            lat: 41.9114198,
            lng: -87.843672
        }, {
            name: "Holy Cross Hospital",
            lat: 41.7694777,
            lng: -87.6922738
        }, {
            name: "Lakeside Veterans Administration",
            lat: 41.8944773,
            lng: -87.6189413
        }, { 
            name: "Little Company of Mary Hospital",
            lat: 41.7219779,
            lng: -87.6914393  
        }, { 
            name: "Methodist Hospital",
            lat: 41.9728097,
            lng: -87.6708897
        }, { 
            name: "Northwestern Memorial Hospital",
            lat: 41.8955885,
            lng: -87.6208858     
        }, { 
            name: "Oak Forest Hospital",
            lat: 41.5983672,
            lng: -87.732549     
        }, { 
            name: "Saint Francis Hospital",
            lat: 41.6580896,
            lng:  -87.6781042       
        }, { 
            name: "Sacred Heart Hospital",
            lat: 41.8905879,
            lng: -87.7081111       
        }, { 
            name: "Roseland Community Hospital",
            lat: 41.6922565,
            lng: -87.6253253
        }, { 
            name: "South Shore Hospital",
            lat: 41.7494792,
            lng:  -87.5692135     
        }, { 
            name: "Hartgrove Hospital",
            lat: 41.8905878,
            lng: -87.7203337
        }, { 
            name: "Glenbrook Hospital",
            lat: 42.0925276,
            lng: -87.852566  
        }, { 
            name: "Garfield Park Hospital",
            lat: 41.8814211,
            lng: -87.7220001 
        }, { 
            name: "Mercy",
            lat: 41.8469777,
            lng: -87.6211623     
        }, { 
            name: "Kindred Chicago Hospital",
            lat: 41.9400318,
            lng:  -87.7292243 
        }, { 
            name: "Norwegian - American Hospital",
            lat:  41.9005879,
            lng:  -87.7000555   
        }, { 
            name: "Oak Park Hospital",
            lat: 41.8786426,
            lng: -87.8031141   
        }, { 
            name: "Passavant Hospital",
            lat: 41.8953107,
            lng:  -87.6197747  
        }, { 
            name: "Reese Hospital",
            lat: 41.8397557,
            lng: -87.6131063 
        }, { 
            name: "Ronald McDonald Childrens Hospital",
            lat: 41.8605869,
            lng: -87.8350591
        }, { 
            name: "Saint Anthony Hospital",
            lat:  41.8553104,
            lng:  -87.697832    
        }, { 
            name: "Shriners Hospital",
            lat: 41.9197536,
            lng: -87.7933926     
        }];

        hospitals.forEach(function(hospital){
            if(!Locations.findOne({name: hospital.name})){
                var newLocation = {
                    name: hospital.name,
                    type: {
                        text: "Hospital"
                    },
                    position: {
                        latitude: hospital.lat,
                        longitude: hospital.lng,
                        altitude: 594
                    },
                    location: {
                        type: "Point",
                        coordinates: [hospital.lng, hospital.lat]
                    }
                }

                // if we have the autopublish package installed
                // create the Locations on both client and server
                if(Package['clinical:autopublish']){
                    Locations.insert(newLocation);
                } else {
                    // otherwise, only install on the client
                    if(Meteor.isClient){
                        Locations.insert(newLocation);
                    }
                }
            }
        });

    }
});


