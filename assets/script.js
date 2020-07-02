let currentLoc;
let savedLocation = [];
let APIKey = "f37afb30faeaad6b445e174ebe59ab37";



function initialize() {
    savedLocation = JSON.parse(localStorage.getItem("weathercities"));
    let lastSearch
        if (savedLocation) {
            //display previous location
            currentLoc = savedLocation[savedLocation.length - 1];
            
        }
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
    })
}
