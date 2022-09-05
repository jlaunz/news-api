# News API project

## Starting the Server

```
$ yarn
$ yarn start:dev
```

## Key Dependencies

This application has dependencies on the following, make sure each is installed locally for development and automated testing:

* Node.js
* Nest.js


## Overview
### Tech Stack:
* `Nest.js`: Backend framework.
* `Swagger`: Used for automatically generating the API docs and provide interactive UI for API testing. To view the swagger UI, after starting the application, visit http://localhost:8000/api


  ### Endpoints
  Endpoints are defined in `news.controller.ts`. 
  To test and view the endpoints (Swagger UI), please start the server and then visit `http://localhost:8000/api`

  ### Open API Doc
  The YAML file can be found in `file://./swagger/api.yaml`  
  To check Swagger UI, please start the server and visit `http://localhost:8000/api`  
  To generate Swagger API doc, please visit `http://localhost:8000/api-yaml`  

  ### Implemented frontend requirements
  - Created an endpoint which will contain a list of articles with the required data.  









