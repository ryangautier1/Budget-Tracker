# Budget-Tracker

## Description
This application uses mongoDB along with mongoose to store user information, allowing users to track their budget activity. It is deployed through Heroku.

It is also designed as a PWA, so users can access the app's functionality when offline. When offline, entries will be stored in the IndexedDB. When returning online, the database is updated with the offline entries.

The front end of this application was provided as part of the UT Full Stack Coding Bootcamp. Personal contributions include the web manifest, db.js, service-worker.js and the server.js files.

## User Story
AS AN avid traveller
I WANT to be able to track my withdrawals and deposits with or without a data/internet connection
SO THAT my account balance is accurate when I am traveling

## Acceptance Criteria
GIVEN a user is on Budget App without an internet connection
WHEN the user inputs a withdrawal or deposit
THEN that will be shown on the page, and added to their transaction history when their connection is back online.

## Link to deployed application

https://fast-escarpment-22029.herokuapp.com/

## Screenshot of Application
![Screenshot of Application](screenshot.png)