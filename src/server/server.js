//environment variales
const dotenv = require('dotenv');
dotenv.config();

//espress
var path = require('path');
const express = require('express');
let projectData = {};

//application
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');
//Cors for cross origin allowance
const cors = require('cors');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//use cors
app.use(cors());

//init the main project folder
app.use(express.static('dist'));

//server the home page index.html
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
});

//designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!');
});

//handle the recieved data from geo names API
app.post('/addGeoNamesData', addGeoNamesData);
//GET request returns the project data
app.get('/tripData', getTripData);

//get project data from server
function getTripData(req, res) {
    console.log(projectData);
    res.send(JSON.stringify(projectData));
}

//store project data to server
function addGeoNamesData(req, res) {
    projectData = req.body;
    console.log(projectData);
}