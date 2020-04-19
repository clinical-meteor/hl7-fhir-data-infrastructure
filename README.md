##  clinical:hl7-fhir-data-infrastructure   


#### Installation  

```bash
# clone the boilerplate app
git clone https://github.com/symptomatic/node-on-fhir  

# permanently add to your application
meteor add clinical:hl7-fhir-data-infrastructure  

# temporarily use application
meteor run --extra-packages clinical:hl7-fhir-data-infrastructure  
```

#### Dependencies

This Atmosphere package requires the following dependencies added to your `packages.json` file in the parent application project.  

```
"moment": "2.22.2"
"lodash": "4.17.13",
"prop-types": "15.7.2",
"react-mixin": "4.0.0",
"validator": "10.9.0",
"simpl-schema": "1.5.3",
"material-fhir-ui": "0.9.43"
"react-icons-kit": "1.3.1"
```


#### Licensing  
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
