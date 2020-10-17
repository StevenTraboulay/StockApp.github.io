//Initiated Variables
var stockSubmit = document.querySelector("#input-group");

//This executes when the event listener kicks off to handle the button click
var formSubmitHandler = function(event){
    event.preventDefault();
    var stockInput = document.querySelector("#stock-input").value.trim();
    console.log(stockInput)
    if(stockInput){
        getStockData(stockInput)
        //getWeatherData(cityInputFormEl);
        //getForcastData(cityInputFormEl);
        //saveLocalStorage(cityInputFormEl);        
        var clearInput = document.querySelector("#stock-input");
        clearInput.value = "";
   
    }else{
        alert("Enter a correct Symbol!");
    }
}

var getStockData = function(stockInput){
    //var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=443d53b576fbee38c5cf0db4dbe2ff2b";
    var ApiKey = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stockInput + "&interval=5min&apikey=EME3FI6FSOTMXXLD";
    fetch(ApiKey)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                //displayWeatherData(data, city);
                console.log(data);
            });
        }else{
            alert("Error Returned: " + response.statusText);
        }
    })
};


//On click form submit even handler
stockSubmit.addEventListener("submit", formSubmitHandler);