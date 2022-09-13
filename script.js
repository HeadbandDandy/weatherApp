// below contains API Key and URL 
//end point added
const apiKey = '60324a49ed03a3780c2ddec7ca142174';
const apiUrl = 'api.openweathermap.org/data/2.5/forecast?q={city name}&appid={60324a49ed03a3780c2ddec7ca142174}';
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

//below contains the cards for the upcoming forecasts
const castCard = document.querySelectorAll('.forecast-card');
const castDate = document.querySelectorAll('.forecast-date');
const castIcon = document.querySelectorAll('.forecast-icon');
const castTemp = document.querySelectorAll('.forecast-temp');
const castWind = document.querySelectorAll('.forecast-wind');
const castHumidity = document.querySelectorAll('.forecast-humidity');


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


//function below renders weather and places them in their cards
renderCurrentWeather = (coordinatesData, openWeatherData) => {
	// sets card content
	cityCard.textContent = coordinatesData[0].name;
	iconCard.src = `http://openweathermap.org/img/wn/${openWeatherData.current.weather[0].icon}@2x.png`;
	tempCard.textContent = `${Math.trunc(
		openWeatherData.current.temp
	)}\xB0F`;
	windCard.textContent = `${openWeatherData.current.wind_speed} mph`;
	humidityCard.textContent = `${openWeatherData.current.humidity}%`;
	uvCard.textContent = Math.trunc(openWeatherData.current.uvi);

	// clears previous classes
	uvCard.parentElement.classList.remove('favorable');
	uvCard.parentElement.classList.remove('moderate');
	uvCard.parentElement.classList.remove('severe');

	// adds class based on uv index
	if (uvCard.textContent <= 2) {
		uvCard.parentElement.classList.add('favorable');
	} else if (uvCard.textContent <= 7) {
		uvCard.parentElement.classList.add('moderate');
	} else {
		uvCard.parentElement.classList.add('severe');
	}
};


//function below should render upcoming forecast cards
renderForecast = (openWeatherData) => {
	for (let i = 0; i < castCard.length; i++) {
		// below is a moment method being used to cast data
		castDate[i].textContent = moment()
			.add(i + 1, 'days')
			.format('M/DD/YYYY');
		castIcon[
			i
		].src = `http://openweathermap.org/img/wn/${openWeatherData.daily[i].weather[0].icon}@2x.png`;
		castTemp[i].textContent = `${Math.trunc(
			openWeatherData.daily[i].temp.day
		)}\xB0F`;
		castWind[
			i
		].textContent = `${openWeatherData.daily[i].wind_speed} mph`;
		castHumidity[
			i
		].textContent = `${openWeatherData.daily[i].humidity}%`;
	}
};


// below adds data to search history
appendToSearchHistory = (weatherData) => {
	let city = weatherData[0].name;
	let searchArray = JSON.parse(localStorage.getItem('searchHistory'));

  // monitors multiple searches with same city name
	if (!searchArray.includes(city)) {
		searchArray.unshift(city);
		searchArray.pop();
		localStorage.setItem('searchHistory', JSON.stringify(searchArray));
		searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
	}
	renderSearchHistory();
};


//below should render search history to the user

renderSearchHistory = () => {
	searchButton.textContent = '';

	if (searchHistory === undefined || searchHistory === null) {
		localStorage.setItem('searchHistory', JSON.stringify(defaultCards));
	}

	searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
	cityName = searchHistory[0];

	// adds a button upon entry
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
			getCoordinates();
		});
		searchButton.appendChild(button);
	}
};




searchButton.addEventListener('click', function (event) {
	event.preventDefault();

	cityName = searchInput.value.toLowerCase().trim();
	getCoordinates();

	searchInput.value = '';
});



//initializes the application
init = () => {
	dateCard.textContent = `${today}`;
	renderSearchHistory();
	getCoordinates();
};

init();


console.log(moment().format('M/DD/YYYY'))



