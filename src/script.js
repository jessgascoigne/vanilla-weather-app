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

function formatForecastDate(forecastTimestamp) {
  let date = new Date(forecastTimestamp * 1000);
  let forecastDay = date.getDay();
  return weekDays[forecastDay];
}

function displayForecast(response) {
  let forecastSection = document.querySelector("#forecast");
  if (response !== undefined) {
    forecast = response.data.daily;
  }
  if (!forecast) return;
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col card-column">
      <h5 class="card-title" id="forecast-day">${formatForecastDate(
        forecastDay.dt
      )}</h5>
      <div class="card">
        <span class="forecast-temp-max" id="forecast-temp-max">${
          celsiusLink.classList.contains("active-link")
            ? Math.round(((forecastDay.temp.max - 32) * 5) / 9)
            : Math.round(forecastDay.temp.max)
        }°</span>
        <span class="forecast-temp-min" id="forecast-temp-min">${
          celsiusLink.classList.contains("active-link")
            ? Math.round(((forecastDay.temp.min - 32) * 5) / 9)
            : Math.round(forecastDay.temp.min)
        }°</span>
        <img
          src="images/${forecastDay.weather[0].icon}.png"
          alt="forecast icon"
          class="forecast-weather-image"
        />
      </div>
    </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastSection.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiEndpoint = `https://api.openweathermap.org/data/2.5/onecall?`;
  let apiUrl = `${apiEndpoint}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  document.querySelector("#header-city").innerHTML = response.data.name;

  currentFahrenheitTemp = response.data.main.temp;
  currentFeelsLikeTemp = response.data.main.feels_like;
  wind = response.data.wind.speed;

  if (celsiusLink.classList.contains("active-link")) {
    displayCelsius();
  } else {
    displayFahrenheit();
  }
  document
    .querySelector("#current-weather-icon")
    .setAttribute("src", `images/${response.data.weather[0].icon}.png`);

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#current-weather-condition").innerHTML =
    response.data.weather[0].description;
  getForecast(response.data.coord);
}

function displayCelsius(event) {
  if (event !== undefined) {
    event.preventDefault();
  }
  celsiusLink.classList.replace("non-active-link", "active-link");
  fahrenheitLink.classList.replace("active-link", "non-active-link");
  let currentCelsiusTemp = ((currentFahrenheitTemp - 32) * 5) / 9;
  let feelsLikeCelsiusTemp = ((currentFeelsLikeTemp - 32) * 5) / 9;
  let kmhWind = wind * 1.609344;
  currentTempHeading.innerHTML = Math.round(currentCelsiusTemp);
  feelsLikeTempHeading.innerHTML = `${Math.round(feelsLikeCelsiusTemp)}℃`;
  windHeading.innerHTML = `${Math.round(kmhWind)} km/h`;
  displayForecast();
}

function displayFahrenheit(event) {
  if (event !== undefined) {
    event.preventDefault();
  }
  fahrenheitLink.classList.replace("non-active-link", "active-link");
  celsiusLink.classList.replace("active-link", "non-active-link");
  currentTempHeading.innerHTML = Math.round(currentFahrenheitTemp);
  feelsLikeTempHeading.innerHTML = `${Math.round(currentFeelsLikeTemp)}℉`;
  windHeading.innerHTML = `${Math.round(wind)} mph`;
  displayForecast();
}

function searchCity(location) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}${location}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}

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

let apiKey = "6e2f14a60b2f5be57b160a6148235b2f";
let units = "imperial";

let currentFahrenheitTemp = null;
let currentFeelsLikeTemp = null;
let wind = null;
let forecast = null;

let currentTempHeading = document.querySelector("#current-temp");
let feelsLikeTempHeading = document.querySelector("#feels-like-temp");
let windHeading = document.querySelector("#wind");

let currentLocationButton = document.querySelector("#current-city-button");
currentLocationButton.addEventListener("click", getCurrentPosition);

let citySearchForm = document.querySelector("#search-form");
citySearchForm.addEventListener("submit", handleSubmit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);

searchCity("q=seattle");
