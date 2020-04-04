import { geoNamesApiUrl, weatherBitApiUrl, pixaBayApiUrl } from './apiUrls';
import { errorHandling, hideErrorMessage, getCurrentDate, differenceDays, getEnvLocalUrl } from './helper';

/* FUNCTIONS */

/* API Functions */

//fetch data from getGeoNames api
const getGeoNames = async (cityName) => {
    //get url for request
    const geoUrl = geoNamesApiUrl(cityName);
    //fetch data from the geo names API
    const res = await fetch(geoUrl);
    try {
        //get data from json
        const data = await res.json();
        console.log(data);
        //return recieved data
        return data;
    } catch (error) {
        //deal with the error
        console.log('getGeoNames error: ', error);
        errorHandling(`There was and error: ${error}`);
    }
};

//fetch data from WeatherBit api
const getWeatherBit = async (days, lat, lot) => {
    //get url for request
    const weatherUrl = weatherBitApiUrl(days, lat, lot);
    //fetch data from the weather API
    const res = await fetch(weatherUrl);
    try {
        //get data from json
        const data = await res.json();
        console.log(data);
        //return recieved data
        return data;
    } catch (error) {
        //deal with the error
        console.log('getWeatherBit error: ', error);
        errorHandling(`There was and error: ${error}`);
    }
};

//fetch data from WeatherBit api
const getPixabay = async (cityCountry) => {
    //get url for request
    const pixabayUrl = pixaBayApiUrl(cityCountry);
    //fetch data from the weather API
    const res = await fetch(pixabayUrl);
    try {
        //get data from json
        const data = await res.json();
        console.log(data);
        //return recieved data
        return data;
    } catch (error) {
        //deal with the error
        console.log('getPixabay error: ', error);
        errorHandling(`There was and error: ${error}`);
    }
};

//post recieved and user data to server
const postDataToServer = async (url = '', data = {}) => {
    //body of the response
    const response = await fetch(getEnvLocalUrl()+url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)   
    });

    try {
        //wait for data from server
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log('postData error: ', error);
        errorHandling('There was and error. Please, try it again.');
    }
};


/* APP functions */

//handle submit the form
const handleSubmit = event => {
    event.preventDefault();
    //hide potencially visible error block
    hideErrorMessage();

    //entered city name
    const cityName = document.getElementById('cityName').value;
    //entered trip date
    const tripDate = document.getElementById('tripDate').value;

    //how many days from now is trip?
    //plus one because weather count even today
    let howManyDays = Math.round(differenceDays(new Date(), new Date(tripDate))) + 1;
    console.log(howManyDays);

    //check for empty inputs
    if(!cityName) {
        errorHandling('Fill the city name you want to travel to.');
        return;
    }
    if(!tripDate) {
        errorHandling('Fill the date trip.');
        return;
    }

    //get getGeoNames
    getGeoNames(cityName)
        //get weather info
        .then(function (gData) {
            if(gData && gData.totalResultsCount && gData.totalResultsCount > 0 && gData.geonames[0]){
                getWeatherBit(howManyDays, gData.geonames[0].lat, gData.geonames[0].lng)
                .then(function (wData) {
                    if(wData && wData.data) {
                        getPixabay(gData.geonames[0].name + '+' + gData.geonames[0].countryName)
                        //post data to server
                        .then(function (pData) {     
                            let postData = {
                                latitude: wData.lat,
                                longitude: wData.lon,
                                cityName: gData.geonames[0].name,
                                country: gData.geonames[0].countryName,                        
                                max_temp: wData.data[wData.data.length - 1].max_temp,
                                min_temp: wData.data[wData.data.length - 1].min_temp,
                                weatherDesc: wData.data[wData.data.length - 1].weather.description,
                                weatherIcon: wData.data[wData.data.length - 1].weather.icon,
                                tripDate: wData.data[wData.data.length - 1].valid_date,
                                imageUrl: pData.hits[0] ? pData.hits[0].webformatURL : null
                            }; 
                            postDataToServer('/addTripData', postData);
                        })                
                        //update ui
                        .then(updateUI);
                    }
                })
            }
            else errorHandling('Sorry, not found your city. Please enter different one');
        })
};

//update IU based on recieved data
const updateUI = async () => {
    //request to server for user data input
    const request = await fetch(getEnvLocalUrl() + '/tripData');
    try {
        //wait for all data from server
        const allData = await request.json();
        console.log(allData);
        //fill the UI with user data
        document.getElementById('city').innerHTML = `City name: ${allData.cityName}`;
        document.getElementById('date').innerHTML = `Trip date: ${allData.tripDate}`;
        document.getElementById('country').innerHTML = `Country: ${allData.country}`;
        if(allData.imageUrl) {
            document.getElementById('tripImage').setAttribute('src', allData.imageUrl);
        } else {            
            document.getElementById('tripImage').classList.add('hidden');
        }
        document.getElementById('obj').innerHTML = JSON.stringify(allData);

    } catch (error) {
        console.log('update UI error: ', error);
        errorHandling('There was and error. Please, try it again.');
    }
};   

//initializaton of the app - listeners
const init = () => {
    //listener for the submit button of the form
    document.getElementById('submitForm').addEventListener('click', handleSubmit);

    //get the list of countries
    //generateCountryList();

    //edit trip date input 
    let dateInput = document.getElementById('tripDate');
    //set the date as a value
    dateInput.value = getCurrentDate();
    //set min date value for today
    dateInput.setAttribute('min', getCurrentDate());
    //set max date value for today (weather api has only 16day forecast)
    dateInput.setAttribute('max', getCurrentDate(16));
};

//add a method addDays for Date prototype
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

export { handleSubmit, init }