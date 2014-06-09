
[![Build Status](https://travis-ci.org/dtornow/Hello-World.svg?branch=master)](https://travis-ci.org/dtornow/Hello-World)

[![Dependencies](https://david-dm.org/dtornow/Hello-World.png)](https://david-dm.org/dtornow/Hello-World)

Hello-World
===========

[![Nodejitsu Deploy Status Badges](https://webhooks.nodejitsu.com/dtornow/Hello-World.png)](https://webops.nodejitsu.com#dtornow/hello-world.png)

Structure

    |-- src
    |   |-- bower
    |	|	|-- bower component
    |	|	|-- ...
    |   |-- client
    |	|	|-- controller
    |	|	|	|-- angular controller
    |	|	|	|-- ...
    |	|	|-- directives
    |	|	|	|-- angular directive
    |	|	|	|-- ...
    |	|	|-- templates
    |	|	|	|-- html template
    |	|	|	|-- ...
    |	|	|-- index.html
    |   |-- server
    |	|	|-- api
    |	|	|	|-- api
    |   |   |   |-- ...
    |	|	|-- controller
    |	|	|	|-- controller
    |   |   |   |-- ...
    |	|	|-- documents
    |	|	|	|-- mongoose documents
    |   |   |   |-- ...
    |	|	|-- middleware
    |	|	|	|-- middleware
    |   |   |   |-- ...
    |	|	|-- passports
    |	|	|	|-- authentication strategy
    |   |   |   |-- ...
    |	|	|-- services
    |	|	|	|-- utility
    |   |   |   |-- ...
    |	|	|-- app.js    
    |   |-- tests
    |   |   |-- client
    |   |   |   |-- client tests
    |   |   |   |-- ...
    |   |   |-- server
    |   |   |   |-- server tests
    |   |   |   |-- ...
    |-- .gitignore
    |-- .travis.yml
    |-- app.js
    |-- Gruntfile.js
    |-- package.json