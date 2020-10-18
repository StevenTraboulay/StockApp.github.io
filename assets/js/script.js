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
    if(stockInput){
        clearOut();
        getStockData(stockInput)
        getMarketCap(stockInput)
        var clearInput = document.querySelector("#stock-input");
        clearInput.value = "";
    }else{
        alert("Enter a correct Symbol!");
    }
}

var clearOut = function(){
    //outerStockContainerEl.textContent = "";
    outerStockContainerNameEl.textContent = "";
    outerStockContainerOpeningPriceEl.textContent = "";
    outerStockContainerCurrentPriceEl.textContent = "";
    outerStockContainerChangePercentEl.textContent = "";
    outerStockContainerAbsoluteEl.textContent = "";
    outerStockContainerMarketCapEl.textContent = "";
}

var getStockData = function(stockInput){
    var ApiKey = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stockInput + "&interval=5min&apikey=EME3FI6FSOTMXXLD";
    fetch(ApiKey)
    .then(res => res)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                displayStockData(data, stockInput);
            });
        }else{
            alert("No Stock Data Returned: " + response.statusText);
        }
    })
};

var getMarketCap = function(stockInput){
    var ApiKey = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + stockInput + "&apikey=EME3FI6FSOTMXXLD";
    fetch(ApiKey)
    .then(res => res)
    .then(function(response){
        if(response.ok){
            response.json()
            .then(function(data){
                displayMarketCap(data);    
            });
        }else{
            alert("No Market Cap Returned " + response.statusText);
        }
    })
};


var displayStockData = function(data, stockInput){
    console.log(data);

    //check if api returned any repos
    if(data.length === 0){
        outerStockContainerEl.textContent = "No repos found, try again";
        return;
    }
        //get stock name
        var stockName = stockInput;
        var StockNameEl = document.createElement("div");
        StockNameEl.textContent = "Ticker: " + stockName.toUpperCase();

        //get price starts here
        //getting this from the returned API
        var lastRefreshedTime = data['Meta Data']['3. Last Refreshed']; //this has spaces so we use [] to get to data

        //getting this from returned data using lastRefreshedTime
        var currentClosePrice = data['Time Series (5min)'][lastRefreshedTime]['4. close'];
        currentClosePrice = parseFloat(currentClosePrice).toFixed(2);
        var currentClosePriceEl = document.createElement("div");
        currentClosePriceEl.textContent = "Current Price: $" + currentClosePrice;

        //objects.keys returns an array of all the keys from the data [time Series]
        var listOfTimes = Object.keys(data['Time Series (5min)']);

        //sorting the data returned and the default is asc alphabitcally
        listOfTimes.sort()
   
        //returning the earliest time from the listOfTimes sort in this case the [0] array item
        var openingTime = listOfTimes[0];
    
        //getting the opening time using the opening time from the array above
        var dayOpeningPrice = data['Time Series (5min)'][openingTime]['4. close'];
        var dayOpeningPrice = parseFloat(dayOpeningPrice).toFixed(2);
        var dayOpeningPriceEl = document.createElement("div");
        dayOpeningPriceEl.textContent = "Opening Day Price: $" + dayOpeningPrice;
       
        //calculations start here
        //storing the percentage growth from the currentClosePrice and the dayOpeningPrice from above
        var growthPercentage = (currentClosePrice / dayOpeningPrice -1) * 100;
        growthPercentage = parseFloat(growthPercentage).toFixed(2);
        var growthPercentageEl = document.createElement("div");
        growthPercentageEl.textContent = "Change Percentage: " + growthPercentage + "%";

        //storing the difference from currentClosePricee and dayOpeningPrice
        var absoluteGrowth = currentClosePrice - dayOpeningPrice;
        absoluteGrowth = parseFloat(absoluteGrowth).toFixed(2);
        var absoluteGrowthEl = document.createElement("div");
        if(absoluteGrowth < 1){
            absoluteGrowthEl.textContent = "Change: " + absoluteGrowth + " cents";
        }else{
            absoluteGrowthEl.textContent = "Change: $" + absoluteGrowth;
        }

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
        outerStockContainerEl.appendChild(outerStockContainerMarketCapEl);
}

var displayMarketCap = function(data){
    var marketCap = data.MarketCapitalization;

    //The marketCap split may cause issues with the output of the data, there seems to be a delay in the marketCap
    marketCap = marketCap.split("");
    marketCap = marketCap[0] + marketCap[1] + marketCap[2];

    //3rd part library to convert to currency
    marketCap = currency(marketCap);

    var marketCapEl = document.createElement("div");
    marketCapEl.textContent = "Market Cap: $ " + marketCap;
    outerStockContainerMarketCapEl.appendChild(marketCapEl);
}


//On click form submit even handler
stockSubmit.addEventListener("submit", formSubmitHandler);