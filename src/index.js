import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getRefs from './js/getRefs';
import countryCard from './js/templates/country-card.hbs';
import infoCountries from './js/templates/infoCountries.hbs';
import { fetchCountries } from './js/api/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

let countryName = '';

refs.inputEl.addEventListener('input', debounce(inputCountryName, DEBOUNCE_DELAY));

function inputCountryName(evt) {

    countryName = evt.target.value.trim();
    clearInput();

    fetchCountries(countryName)
        .then(specificName)
        .catch(onFetchError);
}

function specificName(data){
    let position = data.length;
    console.log(position);
    
    if (position > 10) {
        return Notify.info(`Too many matches found. Please enter a more specific name`);
    }

    else if (position >= 2 && position <= 10) {
        renderCountriesInfo(data);
    }

    else if (position === 1) {
        renderCountriesList(data);
    }
}

function onFetchError(error) {
    console.log(error);

    if (countryName === '') {
        Notify.failure(`Oops, there is no country with that name`);
    }
}

function clearInput() {
    refs.listEl.innerHTML = '';
    refs.infoEl.innerHTML = '';
}

function renderCountriesInfo(data) {
    refs.infoEl.insertAdjacentHTML('beforeend', infoCountries(data));
}

function renderCountriesList(data) {
    refs.listEl.insertAdjacentHTML('beforeend', countryCard(data));
}
