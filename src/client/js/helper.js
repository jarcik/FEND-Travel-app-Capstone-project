//if webpack-dev-server is runnig, navigate to localhost 8081
const getEnvLocalUrl = () => {
    if(process.env.NODE_ENV == 'development') {
        return 'http://localhost:8081';
    }
    return '';
};

//returns differece between two days
const differenceDays = (date1, date2) => {
    let difference = date2.getTime() - date1.getTime();
    return difference / (1000 * 3600 * 24);
};

//get current date for the server daata as a string format YYYY-MM-
const getCurrentDate = (addDate = 0) => {
    let newDate = new Date().addDays(addDate);
    let month = newDate.getMonth();
    if(month < 10) {
        month = `0${month+1}`;
    } else month++;
    let date = newDate.getDate();
    if(date < 10) date = `0${date}`;
    return `${newDate.getFullYear()}-${month}-${date}`;
};

//hide potencially visible error message
const hideErrorMessage = () => {    
    let errorElement = document.getElementById('errorMessage');
    errorElement.innerHTML = '';
    errorElement.style.display = 'none';
};

//show error message
const errorHandling = errorMessage => {
    let errorElement = document.getElementById('errorMessage');
    errorElement.innerHTML = errorMessage;
    errorElement.style.display = 'block';
};

export { errorHandling, hideErrorMessage, getCurrentDate, differenceDays, getEnvLocalUrl }
