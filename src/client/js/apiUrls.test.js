
import { geoNamesApiUrl, weatherBitApiUrl, pixaBayApiUrl } from './apiUrls.js';

describe('Check GeoNames', () => {
    test('url', () => {
        expect(geoNamesApiUrl('Prague')).toEqual('http://api.geonames.org/searchJSON?username=jarcik&fuzzy=0.8&maxRows=10&name=Prague');
    });
});

describe('Check WeatherBit', () => {
    test('url', () => {
        expect(weatherBitApiUrl(6, '50.3', '50.3')).toEqual('http://api.weatherbit.io/v2.0/forecast/daily?units=M&key=b659f19b11674913acac5350a9500b16&days=6&lat=50.3&lon=50.3');
    });
});

describe('Check Pixabay', () => {
    test('url', () => {
        expect(pixaBayApiUrl('Prague+Czech')).toEqual('https://pixabay.com/api/?key=15886612-cbf9c28942d4e277c9fa34531&per_page=3&image_type=photo&q=Prague+Czech');
    });
});