const fetch = require("node-fetch");
import { getGeoNames, getPixabay } from './app';

describe('Check getGeoNames', () => {
    test('data', () => {
        expect(getGeoNames('Prague')).toBeDefined();
    });
});

describe('Check getPixabay', () => {
    test('data', () => {
        expect(getPixabay('Prague+Czech')).toBeDefined();
    });
});