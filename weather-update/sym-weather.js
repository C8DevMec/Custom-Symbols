(function (PV){
    function symbolVis() { }
    PV.deriveVisualizationFromBase(symbolVis);

    var definition = {
        typeName: 'weather',
        displayName: 'Weather Updates',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
        iconUrl: 'Images/weather_icon.png',
        configTitle: 'Configure Table',
        getDefaultConfig: function () {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModeEvents,
                Height: 400,
                Width: 400,
                Interval: 5000,
                weatherDesc: {},
                currentTemp:{},
                currentTime:{},
                currentDate:{},
                currentIcon:{},
                LocationFontSize : 11,
                weatherUpdateCurrentDateFontSize: 9,
                temperatureFontSize: 21,
                location:'Malita, Davao Ocidental'
            };
        },
        visObjectType: symbolVis
    };

    symbolVis.prototype.init = function init(scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onConfigChange = configChanged;
        scope.runtimeData.location = scope.config.location;
        scope.runtimeData.LocationFontSize = scope.config.LocationFontSize;
        scope.runtimeData.temperatureFontSize = scope.config.temperatureFontSize;
        scope.runtimeData.weatherUpdateCurrentDateFontSize = scope.config.weatherUpdateCurrentDateFontSize;

        this.onResize = resize;

        function dataUpdate(output){
            data = output.Data;
        }

        function configChanged(oldConfig, newConfig) {
            console.info(oldConfig, newConfig)
            scope.runtimeData.DisplayColumn = scope.config.DisplayColumn;
        }
        scope.runtimeData.locationFontSize = function(fontSize) {
            scope.config.LocationFontSize = fontSize;
        }
        scope.runtimeData.WeatherUpdateCurrentDate = function(fontSize) {
            scope.config.weatherUpdateCurrentDateFontSize = fontSize;
        }
        scope.runtimeData.TemperatureFontSize = function(fontSize) {
            scope.config.temperatureFontSize = fontSize;
        }

     
        function resize(width, height) {  

        }
       
      // Function to make the API request and update the weather data
        function getWeatherData() {
            var apiKey = window.apiKey;  // Retrieve the API key from a global variable
            var city = scope.runtimeData.location;  // Set the city for which to retrieve weather updates
            var url = "https://api.weatherapi.com/v1/current.json?key=" + apiKey + "&q=" + city;  // Construct the API request URL

            var xhr = new XMLHttpRequest();  // Create a new XMLHttpRequest object
            xhr.onreadystatechange = function() {  // Define the function to be called when the API response is received
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {  // Check that the API response is complete and successful
                    var response = JSON.parse(this.responseText);  // Parse the JSON response into a JavaScript object
                    var description = response.current.condition.text;  // Retrieve the weather description from the response
                    var temperature = Math.round(response.current.temp_c);  // Retrieve the temperature in Celsius from the response and round to the nearest integer
                    var now = new Date();  // Get the current date and time
                    var currentDate = now.toDateString();  // Convert the current date to a human-readable string
                    var currentTime = now.toLocaleTimeString();  // Convert the current time to a human-readable string
                    var weatherIconUrl = "https:" + response.current.condition.icon;  // Retrieve the URL of the weather icon from the response and prepend "https:" to ensure it's a secure URL

                    // Update config with weather description, temperature, and current date
                    scope.config.weatherDesc = description;
                    scope.config.currentTemp = temperature;
                    scope.config.currentTime = currentTime;
                    scope.config.currentDate = currentDate;
                    scope.config.currentIcon = weatherIconUrl;

                    // Set the src attribute of the HTML img tag to the weather icon URL
                    var weatherIconImg = document.getElementById("weather-icon-image");
                    weatherIconImg.setAttribute("src", weatherIconUrl);
                }
            };
            xhr.open("GET", url);  // Open the API request with the GET method and the constructed URL
            xhr.send();  // Send the API request
        }
        getWeatherData();
       
         // Call the function every 10 munites
         setInterval (function() { 
            getWeatherData();
            console.log(scope.config.weatherDesc + "\n" + scope.config.currentTemp);
         }, 60000)

         
        //  setInterval(getWeatherData(), 600000);


        scope.runtimeData.changeLocation = function(location) {
            scope.config.location = location;
        }

    } 

    
    

    PV.symbolCatalog.register(definition); 
})(window.PIVisualization);