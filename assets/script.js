let currentLoc;
let savedLocation = [];
let APIKey = "f37afb30faeaad6b445e174ebe59ab37";



function initialize() {
    savedLocation = JSON.parse(localStorage.getItem("weathercities"));
    let lastSearch;
        if (savedLocation) {
            //display previous location
            currentLoc = savedLocation[savedLocation.length - 1];
            
        }
}

function success (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let queryURL = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon" + lon + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        currentLoc = response.name;
        savLoc (response.name);
        getCurrent(currentLoc);
    });
}

function error() {
    currentLoc = "Woodland Hills"
    getCurrent(currentLoc);
}

function showPrevious() {
    if (savedLocation) {
        $('#prevSearches').empty();
        let btns = $('<div>').attr('class', 'list-group');
        for (let i = 0; i > savedLocation.length; i++) {
            let locBtn = $('<a>').attr('href', '#').attr('id', 'loc-btn').text(savedLocation[i]);
            if (savedLocation[i] == currentLoc) {
                locBtn.attr('class', 'list-group-item list-group-item-action active');
            }
            else {
                locBtn.attr('class', 'list-group-item list-group-item-action');
            }
            btns.prepend(locBtn);
        }
        $('#prevSearches').append(btns);
    }
}

function getCurrent(city) {
    let queryURL = 'api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey + '&units=imperial';
    $.ajax({
        url: queryURL,
        method: 'GET',
        error() {
            savedLocation.splice(savedLocation.indexOf(city), 1);
            localStorage.setItem("weathercities", JSON.stringify(savedLocation));
            initialize();
        
        }
    })
        .then(function (response) {
        let currCard = $('<div>').attr('class', 'card bg-light');
        $('earthforecast').append(currCard);

        let currCardHead = $('<div>').attr('class', 'card-header').text('Current weather for ' + response.name);
        currCard.append(currCardHead);

        let cardRow = $('<div>').attr('class', 'row no-gutters');
        currCardHead.append(cardRow);

        let iconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

        let imgDiv = $("<div>").attr('class', 'col-md-4').append($('<img>').attr('src', iconURL).attr('class', 'card-img'));

        let texDiv = $('<div>').attr('class', 'col-md-8');
        let cardBody = $('<div>').attr('class', 'card-body');
        textDiv.append(cardBody);

        cardBody.append($('<h3>').attr('class', 'card-title').text(response.name));
        let currDate = moment(response.dt, 'X').format('dddd, MMMM Do YYYY, h"mm a');
        cardBody.append($('<p>').attr('class', 'card-text').append($('<small>').attr('class', 'text-muted').text('Last updated: ' + currDate)));
        cardBody.append($('<p>').attr('class', 'card-text').html('Temperature: ' + response.main.temp + '&#8457;'));
        cardBody.append($('<p>').attr('class', 'card-text').text('Humidity: ' + response.main.humidity + '%'));
        cardBody.append($('<p>').attr('class', 'card-text').text('Wind Speed: ' + response.wind.speed + ' MPH'));
        
        //UV Index
        var uvURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + APIKey  + '&lat=' + response.coord.lat + "&lon=" + response.coord.lat;
        $.ajax({
            url: uvURL,
            method: 'GET'
        }).then(function (uvResponse) {
            let uvIndex = uvresponse.value;
            let bgColor;
            if (uvIndex <= 3) {
                bgcolor = 'green';
            }
            else if (uvIndex >= 3 || uvIndex <=6) {
                bgcolor = 'yellow';
            }
            else if (uvIndex >= 6 || uvIndex <= 8) {
                bgcolor = 'orange';
            }
            else {
                bgcolor = 'red';
            }
            let uvDisp = $('<p>').attr('class', 'card-text').text('UV Index: ');
            uvDisp.append($('<span>').attr('class', 'uvindex').attr('style', ('background-color:' + bgcolor)).text(uvIndex));
            cardBody.append(uvDisp);
        });
        cardRow.append(textDiv);
        
    });
}

function getForecast(city) {
    //5 Day forecast
    let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?id=' + city + '&APPID=' + APIKey + '&units=imperial';
    $.ajax({
        url: uvURL,
        method: 'GET'
    }).then(function (response) {
        let newRow  = $('<div>').attr('class', 'forecast');
        $('#earthforecast').append(newRow);

    for (let i = 0; i < response.list.length; i++) {
        if (response.list[i].dt_txt.indexOf('15:00:00') !== -1) {
            let newCol = $('<div>').attr('class', 'one-fifth');
            newRow.append(newCol);
            
            let newCard = $('<div>').attr('class', 'card text-white bg-primary');
            newCol.append(newCord);

            let cardHead = $('<div>').attr('class', 'card-header').text(moment(response.list[i].dt, 'X').format('mmm Do'));
            newCard.append(cardHead);

            let cardImg = $('<img>').attr('class', 'card-img-top').attr('src', 'https://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '@2x.png');
            newCard.append(cardImg);

            let bodyDiv = $('<div>').attr('class', 'card-body');
            newCard.append(bodyDiv);

            bodyDiv.append($('<p>').attr('class', 'card-text').html('Temp: ' + response.list[i].main.temp + ' &#8457;'));
            bodyDiv.append($('<p>').attr('class', 'card-text').text('Humidity: ' + response.list[i].main.humidity + '%'));

            }
        }
    })
}


function clear() {
    $('#earthforecast').empty();
}

function saveLoc(loc) {
    
    if (savedLocation === null) {
        savedLocation = [loc];
    }
    else if (savedLocation.indexOf(loc) === -1) {
        savedLocation.push(loc);
    }
    //save the new array to localstorage
    localStorage.setItem('weathercities', JSON.stringify(savedLocation));
    showPrevious();
}

$('#searchbtn').on('click', function () {
    event.preventDefault();
    
    var loc = $('#searchinput').val().trim();
    
    if (loc !== '') {
        //clear the previous forecast
        clear();
        currentLoc = loc;
        saveLoc(loc);
        //clear the search field value
        $('#searchinput').val('');
        //get the new forecast
        getCurrent(loc);
    }
});



$(document).on('click', '#searchbtn', function () {
    clear();
    currentLoc = $(this).text();
    showPrevious();
    getCurrent(currentLoc);
});

    initialize();