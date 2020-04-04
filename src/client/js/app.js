/* VARIABLES */

/* GeoNames */
//base url for weather website
const geoNamesBaseUrl = 'http://api.geonames.org/searchJSON';
//part for city name
const geoNamesCityNamePart = '?name=';
//part for user name
const geoNamesUserNamePart = '&username=jarcik';
//static api request part for geoNames website
let geoNamesApiStaticPart = '&fuzzy=0.8&maxRows=10';

/* WeatherBit */
//url to weatherbit api
const weatherBitBaseUrl = 'http://api.weatherbit.io/v2.0/forecast/daily?units=M';
//api eky to weatherbit API
const weatherBitApiKeyPart = '&key=b659f19b11674913acac5350a9500b16';
//part with the date
const weatherBitDayPart = '&days=';
//part for the city lattitude
const weatherBitLatPart = '&lat=';
//part for the city longitude
const weatherBitLoPart = '&lon=';

/* Pixabay */
//pixabay api base url
const pixabayBaseUrl = 'https://pixabay.com/api/?';
//pixabay api key
const pixabayApiKey = 'key=15886612-cbf9c28942d4e277c9fa34531';
//one image is enought
const pixabayOneImagePart = '&per_page=3';
//just an image type
const pixabayImageTypePart = '&image_type=photo';
//query part
const pixabayQueryPart = '&q=';


/* FUNCTIONS */

/* API Functions */

//fetch data from getGeoNames api
const getGeoNames = async (cityName) => {
    //fetch data from the geo names API
    const res = await fetch(geoNamesBaseUrl + geoNamesCityNamePart + cityName + geoNamesApiStaticPart + geoNamesUserNamePart);
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
}

//fetch data from WeatherBit api
const getWeatherBit = async (days, lat, lot) => {
    //fetch data from the weather API
    const res = await fetch(weatherBitBaseUrl + weatherBitApiKeyPart + weatherBitDayPart + days + weatherBitLatPart + lat + weatherBitLoPart + lot);
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
}

//fetch data from WeatherBit api
const getPixabay = async (cityCountry) => {
    //fetch data from the weather API
    const res = await fetch(pixabayBaseUrl + pixabayApiKey + pixabayImageTypePart + pixabayOneImagePart + pixabayQueryPart + cityCountry);
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
}

//post recieved and user data to server
const postGeoData = async (url = '', data = {}) => {
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
}


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
                            postGeoData('/addGeoNamesData', postData);
                        })                
                        //update ui
                        .then(updateUI);
                    }
                })
            }
            else errorHandling('Sorry, not found your city. Please enter different one');
        })
}

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
}   

//error handling
const errorHandling = errorMessage => {
    let errorElement = document.getElementById('errorMessage');
    errorElement.innerHTML = errorMessage;
    errorElement.style.display = 'block';
}

//hide potencially visible error message
const hideErrorMessage = () => {    
    let errorElement = document.getElementById('errorMessage');
    errorElement.innerHTML = '';
    errorElement.style.display = 'none';
}

//get current date for the server daata
const getCurrentDate = (addDate = 0) => {
    let newDate = new Date().addDays(addDate);
    let month = newDate.getMonth();
    if(month < 10) {
        month = `0${month+1}`;
    } else month++;
    let date = newDate.getDate();
    if(date < 10) date = `0${date}`;
    return `${newDate.getFullYear()}-${month}-${date}`;
}

//if webpack-dev-server is runnig, navigate to localhost 8081
const getEnvLocalUrl = () => {
    if(process.env.NODE_ENV == 'development') {
        return 'http://localhost:8081';
    }
    return '';
}

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
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const differenceDays = (date1, date2) => {
    let difference = date2.getTime() - date1.getTime();
    return difference / (1000 * 3600 * 24);
}

export { handleSubmit, init }