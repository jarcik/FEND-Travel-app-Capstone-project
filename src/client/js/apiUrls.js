/* GeoNames */
const geoNamesApiUrl = name => {
    const baseUrl = 'http://api.geonames.org/searchJSON';
    const urlParts = '?username=jarcik&fuzzy=0.8&maxRows=10&name=';

    return baseUrl + urlParts + name;
};


/* WeatherBit */
const weatherBitApiUrl = (day, lat, lon) => {
    const baseUrl = 'http://api.weatherbit.io/v2.0/forecast/daily';
    const urlParts = '?units=M&key=b659f19b11674913acac5350a9500b16';
    const dayPart = '&days=';
    const latPart = '&lat=';
    const lonPart = '&lon=';

    return baseUrl + urlParts + dayPart + day + latPart + lat + lonPart + lon;
};

/* Pixabay */
const pixaBayApiUrl = query => {
    const baseUrl = 'https://pixabay.com/api/';
    const urlParts = '?key=15886612-cbf9c28942d4e277c9fa34531&per_page=3&image_type=photo&q=';

    return baseUrl + urlParts + query;
};

export { geoNamesApiUrl, weatherBitApiUrl, pixaBayApiUrl }