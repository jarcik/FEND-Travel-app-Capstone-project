//JS
import { handleSubmit } from './js/app.js';

//CSS
import './styles/style.scss';

//export
export { handleSubmit }

//init the application - listeners
init();

//initializaton of the app - listeners
function init(){
    //listener for the submit button of the form
    document.getElementById('submitForm').addEventListener('click', handleSubmit);
}