var ApiKey = "977107925a46bf37b11eec5d9f053eb0"
var searchBtn = document.querySelector('#searchBtn')
var dayEl = moment().format('(M/D/YYYY)')
var cityInfo = document.querySelector('#city-info')
var fiveDayForecast = document.querySelector('#fiveday')
var ulEl = document.querySelector('#history')

function searchButton () {
    var inputVal = document.querySelector('#cityInput').value
    if(inputVal.length !== 0) {
        var userInput = document.querySelector('#cityInput')
        
        localStorage.setItem('city', inputVal)
        userInput.value = ''
        
        cityInfo.innerHTML = ''
        fiveDayForecast.innerHTML = ''

        findCords(inputVal)
        displaySearchHistory(inputVal)
    }
}

function findCords(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + ApiKey;

    fetch(queryURL)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        getWeather(data.name, data.coord.lon, data.coord.lat)
    })
    .catch(err => {
        console.log(err)
    })
}

function getWeather(name, lon, lat) {
    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=" + ApiKey
    console.log(lon, lat)

    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {console.log(data)
        displayInfo(name, data.current.temp, data.current.wind_speed, data.current.humidity, data.current.uvi, data.current.weather[0].icon)
        displayForecast(data.daily)
        console.log(data.daily[1])
    })
}

function displayInfo(name, temp, wind_speed, humidity, uvi, icon) {
    console.log(temp, wind_speed, humidity, uvi)
    console.log(name)
    var cityInfo = document.getElementById('city-info')
    var displayDate = document.createElement('h3')
    var emojiCon = document.createElement('img')
    var tempEl = document.createElement('p')
    var windEl = document.createElement('p')
    var humidityEl = document.createElement('p')
    var uvIndexEl = document.createElement('p')
    var span = document.createElement('span')
   
    cityInfo.setAttribute('style', 'border: 1px black solid')
    emojiCon.setAttribute('style', 'display: inline')
    displayDate.setAttribute('style', 'display: inline')
    span.setAttribute('id', 'uvSpan')

    emojiCon.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    
    displayDate.textContent = name + ' ' + dayEl + ' ' 
    tempEl.textContent = 'Temp: ' + temp + '°F'
    windEl.textContent = 'Wind: ' + wind_speed + ' MPH'
    humidityEl.textContent = 'Humidity: ' + humidity + ' %'
    span.textContent = uvi
    uvIndexEl.textContent = 'UV Index: ' 

    function checkUV(uvi){
        if(uvi <= 2){
            span.classList.add('favorable')
        }
        if(uvi > 2 && uvi <= 5) {
            span.classList.add('moderate')
        }
        if(uvi >5) {
            span.classList.add('severe')
        }
    }
    checkUV(uvi);

    cityInfo.appendChild(displayDate)
    cityInfo.appendChild(emojiCon)
    cityInfo.appendChild(tempEl)
    cityInfo.appendChild(windEl)
    cityInfo.appendChild(humidityEl)
    cityInfo.appendChild(uvIndexEl)
    uvIndexEl.appendChild(span)
}

function displayForecast(daily) {
    var fiveDay = document.querySelector('#fiveday')

    for(i = 1; i < 6; i++){
        var divEl = document.createElement('div')
        var dateEl = document.createElement('h3')
        var imageEl = document.createElement('img')
        var tempEl = document.createElement('p')
        var windEl = document.createElement('p')
        var humidityEl = document.createElement('p')
        var fiveDaysDate = moment.unix(daily[i].dt).format('(M/D/YYYY)')

        divEl.setAttribute('class', 'col-3 m-1')
        divEl.setAttribute('id', 'forecastDiv')
        
        dateEl.textContent = fiveDaysDate
        console.log(daily[i].weather[0].icon)
        imageEl.src = "http://openweathermap.org/img/wn/" + daily[i].weather[0].icon + "@2x.png"
        imageEl.setAttribute('style', 'width: 100px', 'height: auto')
        tempEl.textContent = 'Temp: ' + daily[i].temp.day+'°F'
        windEl.textContent = 'Wind: ' + daily[i].wind_speed + ' MPH'
        humidityEl.textContent = 'Humidity: ' + daily[i].humidity + ' %'

        fiveDay.appendChild(divEl)
        divEl.appendChild(dateEl)
        divEl.appendChild(imageEl)
        divEl.appendChild(tempEl)
        divEl.appendChild(windEl)
        divEl.appendChild(humidityEl)
    }
}

function displaySearchHistory(inputVal) {
    for(i = 0; i < localStorage.length; i++) {
        var cityButton = document.createElement('button')
        var result = localStorage.getItem('city', inputVal).charAt(0).toUpperCase() + localStorage.getItem('city', inputVal).slice(1).toLowerCase();

        cityButton.textContent = result
        cityButton.setAttribute('class', 'col-12 btn btn-secondary')
        cityButton.setAttribute('type', 'button')
        cityButton.setAttribute('id', 'historyBtn')

        ulEl.appendChild(cityButton)
    }
}

ulEl.addEventListener('click', function(event){
    console.log(event.target.textContent)
    cityInfo.innerHTML = ''
    fiveDayForecast.innerHTML = ''
    findCords(event.target.textContent)
})

searchBtn.addEventListener('click', searchButton)
