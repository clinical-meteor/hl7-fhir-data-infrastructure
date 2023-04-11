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


#### Rule of Hooks Error

IMPORTANT:  The React components in this package are not pure functional components.  They strive to be.  Some of them look like they are.  But they are not.  

This is because this is an ATMOSPHERE package, not an NPM package.  Unlike NPM packages, the Meteor build tool transpiles React functional components found in Atmosphere packages into a React object component, as part of the Atmosphere package architecture.  It's technical debt from years ago.  

What this means in practical terms, is that you:  

  - cannot use `useEffect` or `useState` hooks in React components in this library
  - have to use `Session` variables and `useTracker` to manage state instead

**Refactor Path**
It's recommended that pure React components in this library be refactored into an NPM library, such as the [fhir-starter](https://github.com/clinical-meteor/fhir-starter) package


#### Dependencies

This Atmosphere package requires the following dependencies added to your `packages.json` file in the parent application project.  

```
"moment": "2.22.2"
"lodash": "4.17.13",
"prop-types": "15.7.2",
"react-mixin": "4.0.0",
"validator": "10.9.0",
"simpl-schema": "1.5.3",
"fhir-starter": "0.10.60"
"react-icons-kit": "1.3.1"
```


#### Licensing  
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
