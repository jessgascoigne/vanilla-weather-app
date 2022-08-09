let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let now = new Date();

let currentWeekday = weekDays[now.getDay()];
let headerWeekday = document.querySelector("#current-weekday");
headerWeekday.innerHTML = currentWeekday;

let currentMonth = months[now.getMonth()];
let headerMonth = document.querySelector("#current-month");
headerMonth.innerHTML = currentMonth;

let currentDate = now.getDate();
let headerDate = document.querySelector("#current-date");
headerDate.innerHTML = currentDate;

function replaceHeaderHour() {
  let currentHour = now.getHours();
  let headerHour = document.querySelector("#current-hour");
  let timestamp = document.querySelector("#timestamp");
  if (currentHour === 0) {
    headerHour.innerHTML = 12;
    timestamp.innerHTML = "AM";
  } else if (currentHour >= 13) {
    headerHour.innerHTML = currentHour - 12;
    timestamp.innerHTML = "PM";
  } else if (currentHour === 12) {
    headerHour.innerHTML = currentHour;
    timestamp.innerHTML = "PM";
  } else {
    headerHour.innerHTML = currentHour;
    timestamp.innerHTML = "AM";
  }
}
replaceHeaderHour();

function replaceHeaderMinutes() {
  let currentMinutes = now.getMinutes();
  let headerMinutes = document.querySelector("#current-minutes");
  if (currentMinutes <= 9) {
    headerMinutes.innerHTML = `0${currentMinutes}`;
  } else {
    headerMinutes.innerHTML = currentMinutes;
  }
}
replaceHeaderMinutes();

function handleSubmit(event) {
  event.preventDefault();
  let citySearchInput = `q=${document.querySelector("#city-search").value}`;
  searchCity(citySearchInput);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function searchCurrentLocation(position) {
  let currentCoords = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
  searchCity(currentCoords);
}

function searchCity(location) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiKey = "6e2f14a60b2f5be57b160a6148235b2f";
  let units = "imperial";
  let apiUrl = `${apiEndpoint}${location}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}

function displayWeather(response) {
  document.querySelector("#header-city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#feels-like-temp").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#current-weather-condition").innerHTML =
    response.data.weather[0].main;
}

let currentLocationButton = document.querySelector("#current-city-button");
currentLocationButton.addEventListener("click", getCurrentPosition);

let citySearchForm = document.querySelector("#search-form");
citySearchForm.addEventListener("submit", handleSubmit);

searchCity("q=seattle");
