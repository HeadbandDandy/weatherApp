// below contains API Key and URL 
//end point added
// const apiKey = '60324a49ed03a3780c2ddec7ca142174';
// const apiUrl = 'api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={60324a49ed03a3780c2ddec7ca142174}';
// // DOM ELEMENTS

// user input
const searchedButtons = document.querySelector('#search-buttons');
const searchButton = document.querySelector('#city-search-btn');
const searchInput = document.querySelector('#city-search');
const searchedCitiesButton = document.querySelectorAll('.searched-cities-btn');
// main card
const cityCard = document.querySelector('#main-card-city');
const dateCard = document.querySelector('#main-card-date');
const iconCard = document.querySelector('#main-card-icon');
const tempCard = document.querySelector('#main-card-temp');
const mainCardWind = document.querySelector('#main-card-wind');
const mainCardHumidity = document.querySelector('#main-card-humidity');
const mainCardUv = document.querySelector('#main-card-uv');
// forecast cards
const forecastCard = document.querySelectorAll('.forecast-card');
const forecastCardDate = document.querySelectorAll('.forecast-date');
const forecastCardIcon = document.querySelectorAll('.forecast-icon');
const forecastCardTemp = document.querySelectorAll('.forecast-temp');
const forecastCardWind = document.querySelectorAll('.forecast-wind');
const forecastCardHumidity = document.querySelectorAll('.forecast-humidity');

// GLOBAL VARIABLES

let apiUrl = 'https://api.openweathermap.org';
let apiKey = '&appid=60324a49ed03a3780c2ddec7ca142174';
let oneCallEndpoint = '/data/2.5/onecall?';
let defaultSearch = [
	'New York',
	'Chicago',
	'Austin',
	'Miami',
	'Atlanta',
	'Dallas',
];
let today = moment().format('M/DD/YYYY');

// LOCAL STORAGE
let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

let cityName;

// FUNCTIONS

fetchCoordinates = () => {
	let geocodingEndpoint = '/geo/1.0/direct?';
	let apiParam = `q=${cityName}`;

	// calls for the coordinates from the geocode api
	fetch(`${apiUrl}${geocodingEndpoint}${apiParam}${apiKey}`)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			fetchWeather(data);
		})
		.catch(function (error) {
			alert('please enter a valid city name');
		});
};

fetchWeather = (weatherData) => {
	let latParam = weatherData[0].lat;
	let lonParam = weatherData[0].lon;

	// calls for weather information with collected lat and lon coordinates
	fetch(
		`${apiUrl}${oneCallEndpoint}lat=${latParam}&lon=${lonParam}&units=imperial${apiKey}`
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendToSearchHistory(weatherData);
			renderCurrentWeather(weatherData, data);
			renderForecast(data);
		});
};

renderCurrentWeather = (coordinatesData, openWeatherData) => {
	// sets card content
	cityCard.textContent = coordinatesData[0].name;
	iconCard.src = `http://openweathermap.org/img/wn/${openWeatherData.current.weather[0].icon}@2x.png`;
	tempCard.textContent = `${Math.trunc(
		openWeatherData.current.temp
	)}\xB0F`;
	mainCardWind.textContent = `${openWeatherData.current.wind_speed} mph`;
	mainCardHumidity.textContent = `${openWeatherData.current.humidity}%`;
	mainCardUv.textContent = Math.trunc(openWeatherData.current.uvi);

	// clears previous classes
	mainCardUv.parentElement.classList.remove('favorable');
	mainCardUv.parentElement.classList.remove('moderate');
	mainCardUv.parentElement.classList.remove('severe');

	// adds class based on uv index
	if (mainCardUv.textContent <= 2) {
		mainCardUv.parentElement.classList.add('favorable');
	} else if (mainCardUv.textContent <= 7) {
		mainCardUv.parentElement.classList.add('moderate');
	} else {
		mainCardUv.parentElement.classList.add('severe');
	}
};

renderForecast = (openWeatherData) => {
	for (let i = 0; i < forecastCard.length; i++) {
		// sets forecast card content
		forecastCardDate[i].textContent = moment()
			.add(i + 1, 'days')
			.format('M/DD/YYYY');
		forecastCardIcon[
			i
		].src = `http://openweathermap.org/img/wn/${openWeatherData.daily[i].weather[0].icon}@2x.png`;
		forecastCardTemp[i].textContent = `${Math.trunc(
			openWeatherData.daily[i].temp.day
		)}\xB0F`;
		forecastCardWind[
			i
		].textContent = `${openWeatherData.daily[i].wind_speed} mph`;
		forecastCardHumidity[
			i
		].textContent = `${openWeatherData.daily[i].humidity}%`;
	}
};

appendToSearchHistory = (weatherData) => {
	let city = weatherData[0].name;
	let searchArray = JSON.parse(localStorage.getItem('searchHistory'));

	// checks to see if the city is already in search history
	if (!searchArray.includes(city)) {
		searchArray.unshift(city);
		searchArray.pop();
		localStorage.setItem('searchHistory', JSON.stringify(searchArray));
		searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
	}
	renderSearchHistory();
};

renderSearchHistory = () => {
	searchedButtons.textContent = '';

	if (searchHistory === undefined || searchHistory === null) {
		localStorage.setItem('searchHistory', JSON.stringify(defaultSearch));
	}

	searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
	cityName = searchHistory[0];

	// creates a button for each entry
	for (let i = 0; i < searchHistory.length; i++) {
		let button = document.createElement('button');
		button.textContent = searchHistory[i];

		button.classList.add('btn');
		button.classList.add('btn-secondary');
		button.classList.add('btn-block');
		button.classList.add('mb-2');
		button.classList.add('searched-cities-btn');
		button.addEventListener('click', function (event) {
			cityName = event.target.textContent;
			fetchCoordinates();
		});
		searchedButtons.appendChild(button);
	}
};

// EVENT LISTENERS
searchButton.addEventListener('click', function (event) {
	event.preventDefault();

	cityName = searchInput.value.toLowerCase().trim();
	fetchCoordinates();

	searchInput.value = '';
});

// INIT

init = () => {
	dateCard.textContent = `${today}`;
	renderSearchHistory();
	fetchCoordinates();
};

init();



