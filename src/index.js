import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  textInput: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.countryList.style.padding = 0;

refs.textInput.addEventListener(
  'input',
  debounce(onTextInputHandler, DEBOUNCE_DELAY)
);

function onTextInputHandler(event) {
  const text = event.target.value.trim();
  if (text === '' || text === undefined) {
    clearResult();
    return;
  }
  fetchCountries(text)
    .then(countries => {
      clearResult();

      if (countries.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length === 1) {
        displayCountry(countries[0]);
      } else {
        displayCountries(countries);
      }
    })
    .catch(error => {
      clearResult();
      if (error == 'Error: 404') {
        Notify.failure('Oops, there is no country with that name');
      }
    });
}

function clearResult() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function displayCountry(country) {
  const languages = Object.values(country.languages).join(', ');

  const html = `<ul style=" padding: 0">
                    <li style="display: flex; align-items: center; ">
                    <img src="${country.flags.svg}" alt="Flag" width="55px">
                    <h1 style="padding-left: 15px">${country.name.official}</h1>
                    </li>        
                    <li style="padding-bottom: 15px"><span style="font-weight: bold;">Capital: </span>${country.capital}</li>
                    <li style="padding-bottom: 15px"><span style="font-weight: bold;">Population: </span>${country.population}</li>
                    <li style="padding-bottom: 15px"><span style="font-weight: bold;">Languages: </span>${languages}</li>
                </ul>`;

  refs.countryInfo.insertAdjacentHTML('beforeend', html);
}

function displayCountries(countries) {
  let html = '';

  for (const country of countries) {
    html += `<li style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="${country.flags.svg}" alt="Flag" width="35px">
                <span style="padding-left: 10px">${country.name.official}</span>
            </li>`;
  }

  refs.countryList.insertAdjacentHTML('beforeend', html);
}
