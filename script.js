// below contains API Key and URL 
//end point added
const apiKey = '60324a49ed03a3780c2ddec7ca142174';
const apiUrl = 'https://api.openweathermap.org';
let endpoint = '/data/2.5/onecall?';




// DOM elements
const searchedBadges = document.querySelector('#search-badges');
const searchButton = document.querySelector('#searchBtn');
const searchInput = document.querySelector('#city-search');
const searchedCitiesButton = document.querySelectorAll('.searched-cities-btn');

// below contains elements for main weather card
const cityCard = document.querySelector('#city-card');
const dateCard = document.querySelector('#date-card');
const iconCard = document.querySelector('#icon-card');
const tempCard = document.querySelector('#temp-card');
const windCard = document.querySelector('#wind-card');
const humidityCard = document.querySelector('#humidity-card');
const uvCard = document.querySelector('#uv-card');


//below contains default search cards
let defaultCards = [
    'Miami',
    'New York',
    'Los Angeles',
    'Atlanta',
    'Chicago',
    'Dallas'
]

//below contains the time/date function from moment
let today = moment().format('M/DD/YYYY')

// Below sets the local storage
//local storage should be set before other functions 
let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));

let cityName;


//function needed to get coordinates

getCoordinates = () => {
	let geocodingEndpoint = '/geo/1.0/direct?';
	let apiParam = `q=${cityName}`;

	// pulls location from geocode
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


getWeather = (weatherData) => {
	let latParam = weatherData[0].lat;
	let lonParam = weatherData[0].lon;

	// pulls weather based on coordinates function above
	fetch(
		`${weatherApiUrl}${oneCallEndpoint}lat=${latParam}&lon=${lonParam}&units=imperial${weatherApiKey}`
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








