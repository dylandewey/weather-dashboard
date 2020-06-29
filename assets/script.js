let currentLoc;
let savedLocation = [];
let APIKey = "f37afb30faeaad6b445e174ebe59ab37";
let queryURL = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=" + APIKey;


function initialize() {
    savedLocation = JSON.parse(localStorage.getItem("weathercities"));
    let lastSearch;
        if (savedLocation) {
            //display previous location
            currentLoc = savedLocation[savedLocation.length - 1];
            
        }
}