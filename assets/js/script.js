//Initiated Variables
var stockSubmit = document.querySelector("#input-group");
var outerStockContainerEl = document.querySelector("#stock-info");
var outerStockContainerNameEl = document.querySelector("#stock-name");
var outerStockContainerOpeningPriceEl = document.querySelector("#stock-open-price");
var outerStockContainerCurrentPriceEl = document.querySelector("#stock-last-price");
var outerStockContainerChangePercentEl = document.querySelector("#stock-change-percent");
var outerStockContainerAbsoluteEl = document.querySelector("#stock-change-absolute");
var outerStockContainerMarketCapEl = document.querySelector("#stock-market-cap");

//This executes when the event listener kicks off to handle the button click
var formSubmitHandler = function(event){
    event.preventDefault();
    var stockInput = document.querySelector("#stock-input").value.trim();
    console.log(stockInput)
    if(stockInput){
        outerStockContainerEl.textContent = "";
        getStockData(stockInput)
        getMarketCap(stockInput)
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
                displayStockData(data, stockInput);
                console.log(data);
            });
        }else{
            alert("Error Returned: " + response.statusText);
        }
    })
};

var getMarketCap = function(stockInput){
    //var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=443d53b576fbee38c5cf0db4dbe2ff2b";
    var ApiKey = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + stockInput + "&apikey=EME3FI6FSOTMXXLD";
    fetch(ApiKey)
    .then(res=> res.json())
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                displayMarketCap(data);
                console.log(data);
            });
        }else{
            alert("Error Returned: " + response.statusText);
        }
    })
};


var displayStockData = function(data, stockInput){
    //citySearchEl.textContent = cityname + ", " + "(" + moment().format('MMMM Do YYYY') + ")";

    //check if api returned any repos
    if(data.length === 0){
        outerStockContainerEl.textContent = "No repos found, try again";
        return;
    }

        //get stock name
        var stockName = stockInput;
        var StockNameEl = document.createElement("div");
        StockNameEl.textContent = "Ticker: " + stockName;

        //get price
        console.log(data)
        //getting this from the returned API
        var lastRefreshedTime = data['Meta Data']['3. Last Refreshed']; //this has spaces
        console.log(lastRefreshedTime);
        //getting this from returned data using lastRefreshedTime
        var currentClosePrice = data['Time Series (5min)'][lastRefreshedTime]['4. close'];
        var currentClosePriceEl = document.createElement("div");
        currentClosePriceEl.textContent = "Current Price: " + currentClosePrice;


        //Objects.keys returns an array of all the keys from the data [time Series]
        var listOfTimes = Object.keys(data['Time Series (5min)']);
        console.log(listOfTimes)
        //sorting the data returned and the default is asc alphabitcally
        listOfTimes.sort()
        console.log(listOfTimes)
        //returning the earliest time from the listOfTimes sort in this case the [0] array item
        var openingTime = listOfTimes[0];
        console.log(openingTime);
        //getting the opening time using the opening time from the array above
        var dayOpeningPrice = data['Time Series (5min)'][openingTime]['4. close'];
        //var dayOpeningPrice = parseFloat(dayOpeningPrice).toFixed(2);
        var dayOpeningPriceEl = document.createElement("div");
        dayOpeningPriceEl.textContent = "Opening Day Price: " + dayOpeningPrice;
       

        //calculations
        //storing the percentage growth from the currentClosePrice and the dayOpeningPrice from above
        var growthPercentage = (currentClosePrice / dayOpeningPrice -1) * 100;
        var growthPercentageEl = document.createElement("div");
        growthPercentageEl.textContent = "Change Percentage: " + growthPercentage + "%";

        //storing the difference from currentClosePricee and dayOpeningPrice
        var absoluteGrowth = currentClosePrice - dayOpeningPrice;
        var absoluteGrowthEl = document.createElement("div");
        absoluteGrowthEl.textContent = "Change: " + absoluteGrowth;

        //append to outer container
        outerStockContainerNameEl.appendChild(StockNameEl);
        outerStockContainerOpeningPriceEl.appendChild(dayOpeningPriceEl);
        outerStockContainerCurrentPriceEl.appendChild(currentClosePriceEl);
        outerStockContainerChangePercentEl.appendChild(growthPercentageEl);
        outerStockContainerAbsoluteEl.appendChild(absoluteGrowthEl);


        //outer container big one
        outerStockContainerEl.appendChild(outerStockContainerNameEl);
        outerStockContainerEl.appendChild(outerStockContainerOpeningPriceEl);
        outerStockContainerEl.appendChild(outerStockContainerCurrentPriceEl);
        outerStockContainerEl.appendChild(outerStockContainerChangePercentEl);
        outerStockContainerEl.appendChild(outerStockContainerAbsoluteEl);
   
}

var displayMarketCap = function(data){
    console.log(data)
    var marketCap = data.MarketCapitalization;
    console.log(marketCap);
    var marketCapEl = document.createElement("div");
    marketCapEl.textContent = "Market Cap: " + marketCap;
    outerStockContainerMarketCapEl.appendChild(marketCapEl);

    outerStockContainerEl.appendChild(outerStockContainerMarketCapEl);

}


//On click form submit even handler
stockSubmit.addEventListener("submit", formSubmitHandler);