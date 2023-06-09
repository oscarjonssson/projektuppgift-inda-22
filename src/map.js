window.onload = function () {
  // Get the location input element from the HTML
  var locationInput = document.querySelector('input[name="location"]');

  // Create a new Leaflet map object and add a tile layer to it
  var myMap = L.map("map").setView([59.3293, 18.0686], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "https://api.protomaps.com/tiles/v2/{z}/{x}/{y}.pbf?key=e732aade34382989",
    maxZoom: 18,
  }).addTo(myMap);

  // Create a precipitation layer based on OpenWeatherMap API key data
  var precipitationLayer = L.tileLayer("https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=98374256fb4b7a1bd17c4163753707c1", {
    attribution: '<a href="https://openweathermap.org/">OpenWeatherMap</a>',
    maxZoom: 18,
  });

  // Create a function that will update the map based on the user's input
  function updateMap(location) {
    // Make a request to OpenWeatherMap API that returns the latitude and longitude for the given location
    var API_URL = "https://api.openweathermap.org/data/2.5/weather";
    var apiKey = "98374256fb4b7a1bd17c4163753707c1";
    fetch(`${API_URL}?q=${location}&appid=${apiKey}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        // Update the map center with the latitude and longitude values from the OpenWeatherMap API
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        myMap.setView([lat, lon], 13);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  // Add an event listener to the location input element to update the map when the user submits the form
  var form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var location = locationInput.value;
    updateMap(location);
  });

  // Add the precipitation layer to the map
  precipitationLayer.addTo(myMap);

  // Get the user's current location and update the map view accordingly
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      myMap.setView([lat, lon], 13);

      // Add a marker to the map at the current location
      L.marker([lat, lon]).addTo(myMap);
    },
    function (error) {
      console.error("Error getting current position:", error);
    }
  );
};