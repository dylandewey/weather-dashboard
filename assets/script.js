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

function getCurrent(city) {
    let queryURL = "api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
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
        let currDate = moment(response.dt, 'X').format('ddd, MMMM Do YYYY, h"mm a');
        cardBody.append($('<p>').attr('class', 'card-text').append($('<small>').attr('class', 'text-muted').text('Last updated: ' + currDate)));
        cardBody.append($('<p>').attr('class', 'card-text').html('Temperature: ' + response.main.temp + '&#8457;'));

    })
}

function clear() {
    $('#earthforecast').empty();
}

$(document).on('click', '#searchbtn', function () {
    clear();
    currentLoc = $(this).text();
    showPrevious();
    getCurrent(currentLoc);
})