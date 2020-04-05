
import { getCurrentDate, differenceDays, getEnvLocalUrl } from './helper';

describe('Check getCurrentDate', () => {
    test('add 0', () => {
        
        //add a method addDays for Date prototype
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };

        expect(getCurrentDate()).toEqual('2020-04-05');
    });
    test('add 5', () => {
        
        //add a method addDays for Date prototype
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };

        expect(getCurrentDate(5)).toEqual('2020-04-10');
    });
});

describe('Check differenceDays', () => {
    test('differenceDays', () => {
        expect(differenceDays(new Date('2020-04-04'), new Date('2020-04-05'))).toEqual(1);
    });
    test('differenceDays 2', () => {
        expect(differenceDays(new Date('2020-04-04'), new Date('2020-04-06'))).toEqual(2);
    });
});

describe('Check getEnvLocalUrl', () => {
    test('url', () => {
        expect(getEnvLocalUrl()).toEqual('');
    });
});