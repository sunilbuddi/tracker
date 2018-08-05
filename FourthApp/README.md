st-node-express-angular-demo
===============

A CRUD Application to demonstrate create/read/update/delete using Node.js, Express, MySQL and Angular.  Node.js is used for API, Express as web server, MySQL as data store, and Angular for presentation.

#Required
-nodejs version 4.4.1 or higher

#NPM Packages
express: ^4.10.6

mysql: ^2.5.4

body-parser: ^1.15.1

log4js: ^0.6.36

#Install
1.  Download code.

2.  Run angulartest.sql in **schema** folder, preferably in PHPMyAdmin or command line.  This will create database and table.

3.  Edit **server.js** lines **40 & 41** with the username and password of the MySQL database.

3.  Via command line, change directory to project root and run **npm install**, this will install dependencies. 

4.  **npm start** to run application.

5.  Browse to http://localhost:8081

#Helpful sources
http://code.ciphertrick.com/2015/02/27/create-restful-api-using-node-js-express-4/
http://bigspaceship.github.io/blog/2014/05/14/how-to-create-a-rest-api-with-node-dot-js/
https://www.codementor.io/nodejs/tutorial/node-js-mysql

#Website
www.drewlenhart.com