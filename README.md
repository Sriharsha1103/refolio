# Refolio - Research Publications Portal by BVRITH
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


## **MODULE-1: Landing Page**

As the project is a web application there is a need for the landing page.
This Module has 2 phases
 - Login Page
 - Home Page
 
We used React for the frontend. For the login Service we used the OAuth2 library for the google login.
 
## **MODULE-2: Publications Page**
 
In this module, we created a publication display page wher we display the data in a table format.

We provided the search options on the publications and download as csv option.
We used MongoDB as our database. The connection to the database was established and schema of the database is also defined.

## **MODULE-3: Data Insertion Page**

In this module, we created a page that would help the user to insert a new publication into database. 
For better user experiance we used mdb-react-ui-kit for the new publications page. The data is inserted into the mongodb by making a backend call from the frontend.

## **MODULE-4: Data Population**


Here, we have added some publications data of the college into the database from the web application.
The data used is the college publications data.


# Steps to run the forked repository.
>**_NOTE :_** Make sure your system have following installed before you run the project 
> - VSCode latest version
> - NodeJS
> - MongoDB
>
>Make sure you have your own
> 1. Google Client Id
> 2. MongoDB Coneection string.
>
>replace the ` Client-ID ` with your google client id and ` connection-string ` with your mongoDB connection string

  - Fork the repository.
  - Clone to the forked repository in your local sysytem.
  - Open the code in vscode.
  - Two modes of running.
    - Frontend running.
      - Open the terminal and type the command `cd frontend` and then `npm i --legacy-peer-deps or npm install --legacy-peer-deps`
      - After successfull installation run the command ` npm start ` to run your frontend.
    - Backend running.
      - Open the terminal and type the command `cd backend` and then `npm i or npm install `
      - After successfull installation eun the command ` npm run dev ` to run your backend.


