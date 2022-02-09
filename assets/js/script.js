
//load leaflet API
//Modal Prompt
//set buttons and items to visible as applicable for iinitial functionality

//set default date range to 7 days

//check for recent location in local storage, if not set default location to Denver


//??EONET search filtering? Do we have to pull data into arrays then have ready for user selections, or can we API pull based on filter criteria??//

//set background to leaflett map

//search bar with clickable search button

//hamburger menu
   //two date pickers
      //datepicker FROM
      //datepicker TO
   //checkboxes for Event Types
      //API call to determine different event types available then dynamically create checkboxes

//help and about div “buttons” bottom right - clickable with modal popup?

//Invisible DIV created for errors, will be set visible when error is needed
   //div section left(small) is for error icon
   //div section middle is for error text
   //div section right(small)

//when a user searches location
   //convert to string
   //use API to convert city to coordinates
   //check if status returns OK - Error IF not.
   //Pass Coordinates to Leaflet - refresh screen with new location

//when user changes Date FROM
   //Error check to see if FROM is earlier than TO
   //Get new data based on new date range and map scope - REFRESH
//when user changes Date TO
   //Error check to see if TO is earlier than FROM
   //Get new data based on new date range  and map scope - REFRESH 

//when user selects a checkbox option
   //Get new data based on current date range and map scope - REFRESH

//when item is on map
   //item hover shows the summary of event

console.log("Start of JS");
let eventCount = 20;
let searchBtn = document.getElementById("search-btn");
let searchText = document.getElementById("search-city");
let dataRefreshBtn = document.getElementById("data-refresh-btn");


//initial pull of data points from EONET
dataPull();

let layerGroup = L.layerGroup().addTo(map)

var map = L.map('map').setView([39.85, -104.67], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);





// NM - working on getting the boundaries of the map when moving or zooming...

// This runs whenever the map stops moving
// This signle event appears to capture both panning and zooming
map.on('moveend', () => {

   // Storing the bounds in variable
   let bounds = map.getBounds();

   // Console logging the bounds in its default state
   // Which appears to be two arrays in an object
   // One for the northeast corner, and the other for the southwest
   console.log('---- NE and SW corners only ----')
   console.log(bounds);

   // Found a way to convert it to a single string
   // which may be helpful if we are passing this off to an API as a parameter
   console.log('---- NE and SW corners only, but all four values as one continuous string ----')
   console.log(bounds.toBBoxString());

   // now that bounds is set in a variable - can run the additional methods below

   // This is how we can the other corners that aren't returned by the default getBounds()
   console.log('---- lats and longs of the four corners of the viewport starting with NW and going clockwise ----')
   console.log(bounds.getNorthWest());
   console.log(bounds.getNorthEast());
   console.log(bounds.getSouthEast());
   console.log(bounds.getSouthWest());
   
   // This will return that lat/longs of the four borders of the viewport
   console.log('---- lats and longs of the four sides of the viewport ----')
   console.log(bounds.getNorth());
   console.log(bounds.getSouth());
   console.log(bounds.getEast());
   console.log(bounds.getWest());
});

 

function closeModal() {
   $('.modal').addClass('hidden');
   $('header, #map, main.overlay').removeClass('blur');
}

function openModal(evt) {
   $('.modal').removeClass('hidden');
   $('header, #map, main.overlay').addClass('blur');

   let selectedModal = evt.target.getAttribute('data-modal');
   
   $('.modal-header h2').text(selectedModal);
   };

function dataPull(){
   //query eonet API
   let queryEONET = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?limit=${eventCount}&status=open`;
   fetch(queryEONET)
   .then(response => response.json())
      .then(data => {
         let eventData = data.events;
         console.log(eventData);//DELETE LATER
         console.log(`eventdata length is ${eventData.length}`);//DELETE LATER
   //add markers to map based on eventData length
         for (let index = 0; index < eventData.length; index++) {
            var date = new Date(data.events[index].geometry[0].date);
            L.marker([data.events[index].geometry[0].coordinates[1], data.events[index].geometry[0].coordinates[0]])
            .addTo(map)
            .bindPopup(`${data.events[index].title} -\n Date/Time: ${date.toString()}`); //marker description with date
         }   
      });
   console.log("API call complete");//DELETE later
};

function getCityCoord(event) {
   event.preventDefault();

   let newCity = searchText.value;

   console.log(`getting city coordinates from ${searchText.value}`); //Test code
   //psuedo code: get coordinates from user input with API.

   if (newCity) {

      const myApiKey = "b9d312a1f35b1b477f63e4d5e699509c";

      const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${newCity}&limit=1&appid=${myApiKey}`;

      fetch(weatherUrl)
         .then(function (response) {
            if (response.ok) {
               response.json().then(function (data) {
                  console.log(data); 
                  if (data.length > 0) {  // checks if the city found 
                     const checkCity = data[0].name;
                     console.log(checkCity);
                     const nameArray = newCity.split('');
                     nameArray[0] = nameArray[0].toUpperCase();
                     newCity = nameArray.join('');
                     if (checkCity.toLowerCase() == newCity.toLowerCase()) {  // checks (found city === entered city)
                        console.log(data);
                        const lat = data[0].lat;
                        const lon = data[0].lon;
                        console.log(lat);
                        console.log(lon);

                        L.marker([data[0].lat, data[0].lon])
                          .addTo(layerGroup)
                          .bindPopup(`${checkCity} - ${newCity}`); // add marker
                        map.setView([lat, lon], 10) //set map to location, zoom to 10
                     } 
                  } else {
                     alert("The city is not found!");
                  }
               });
            }
         });
         // cc
   }
};

function dataRefresh(){
   console.log("getting and setting new variable options then calling dataPull");
   //clear all existing point
   layerGroup.clearLayers();
   // dataPull();
};


// Function for toggling visibility of the options menu
function menuToggleHide() {
   var optionsMenu = $('#option-menu');
   if (optionsMenu.css('display') === 'none') {
      optionsMenu.css('display', 'block');
   } else {
      optionsMenu.css('display', 'none')
   }
};


////// EVENT HANDLERS //////

//Open Modal
$('.modal-btn').on('click', function (evt) {
   openModal(evt);
});

// Close Modal
$('#modal-close-btn').on('click', closeModal);
$('.modal-background').on('click', closeModal);

// Prevents clicking through the modal container and onto to back to close it
$('.modal-container').on('click', function (evt) {
   evt.stopPropagation();
});

$("#search-bar").on("submit", function (event) {
getCityCoord(event);
$("#search-city").val("");
});

dataRefreshBtn.addEventListener("click", dataRefresh);
//Open Options Menu
$('#menu-open-btn').on('click', menuToggleHide);

//Close Options Menu
$('#menu-close-btn').on('click', menuToggleHide);








