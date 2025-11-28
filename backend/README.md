# BVRITH Search Engine for Research Publications
It is a web application that shows the publications information in a formatted way and also can perform searches on the publication according to the filter, the user can also insert a new publication data into the web application.
The resources required for developing this project include:
  1. Visual Studio
  2. MongoDB Connection String
  3. Google Auth ClientId
  4. NodeJS
The whole project is divided into 4 modules:
Module 1: Landing Page
Module 2: Publications Page
Module 3: Data Insertion Page
Module 4: Data Population

MODULE-1: Landing Page

As the project is a web application there is a need for the landing page.
This Module has 2 phases
 -Login Page
 -Home Page
We used React for the frontend. For the login Service we used the OAuth2 library for the google login.
 
MODULE-2: Publications Page
 
 In this module, we created a publication display page where we display the data in a table format.
We provided the search options on the publications and download as csv option.
We used MongoDB as our database. The connection to the database was established and schema of the database is also defined.


MODULE-3: Data Insertion Page

 In this module, we created a page that would help the user to insert a new publication into database. 
For better user experiance we used mdb-react-ui-kit for the new publications page. The data is inserted into the mongodb by making a backend call from the frontend.

MODULE-4: Data Population

Here, we have added some publications data of the college into the database from the web application.
The data used is the college publications data.

