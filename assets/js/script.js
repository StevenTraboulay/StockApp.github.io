//Initiated Global Variables
var stockSubmit = document.querySelector("#stock-search");
var outerStockContainerEl = document.querySelector("#stock-info");
var outerStockContainerNameEl = document.querySelector("#stock-ticker-name");
var outerStockContainerCompanyNameEl = document.querySelector("#stock-company-name");
var outerStockContainerOpeningPriceEl = document.querySelector("#stock-open-price");
var outerStockContainerCurrentPriceEl = document.querySelector("#stock-last-price");
var outerStockContainerChangePercentEl = document.querySelector("#stock-change-percent");
var outerStockContainerAbsoluteEl = document.querySelector("#stock-change-absolute");
var outerStockContainerMarketCapEl = document.querySelector("#stock-market-cap");


// Stock Data Storage
var stockDataContainer = {};

// Error Message Container
var errorMessage = '';

//This executes when the event listener kicks off to handle the button click
var formSubmitHandler = function (event) {
  event.preventDefault();
  var stockInput = document.querySelector("#stock-input").value.trim();

  // TODO: remove clearout as rewriteStockInfo takes care of it
  // TODO: store getStockData as a variable, store getMarketCap as a variable
  // TODO: if getStockData + getMarketCap == 0; rewrite stock info
  //       otherwise display the error message from errorMessage and then clear it.
  if (stockInput) {
    var clearInput = document.querySelector("#stock-input");
    clearInput.value = "";
    clearOut();
    getStockInfo(stockInput);
  } else {
    outerStockContainerEl.classList.add("blink_text");
    clearOut();
    outerStockContainerNameEl.textContent = "Symbol does not exist";
  }
};

//fetch call for stockdata from API
var getStockInfo = function (stockInput) {
  var timeSeries =
    "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stockInput + "&interval=5min&apikey=EME3FI6FSOTMXXLD";
  var overview =
  "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + stockInput + "&apikey=EME3FI6FSOTMXXLD";
  fetch(timeSeries)
    .then((res) => res)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          if (data['Meta Data']) {
            storeDailyData(data);
          } else {
            console.log(data)
            errorMessage = "Can not fetch daily change data on ticker: "+stockInput;
            stockDataContainer = {};
            outerStockContainerCompanyNameEl.innerHTML += errorMessage+'<br><br>';
          }
        });
      } 
      else {
        console.log('this should cause the chain to break');
        ;
      }
      return fetch(overview);
    })
    .then((res) => res)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          if (stockDataContainer.openPrice && data['Symbol']) {
            storeStockInfo(data);
            rewriteStockInfo();
          } else {
            console.log(data)
            errorMessage = "Can not fetch Stock Information data on ticker: "+stockInput;
            stockDataContainer = {};
            outerStockContainerCompanyNameEl.innerHTML += errorMessage+'';
            outerStockContainerNameEl.innerHTML = '<br>Please try another ticker or wait for 1 minute before trying another search.'
            errorMessage = '';
          }
        });
      }
    })
};

var storeDailyData = function (data) {
  var content = data['Meta Data']
  // if API call succeeds
  if (content){
    console.log('Time Series API Succeeded')

    // add stuff to stockDataContainer)
    var lastRefreshedTime = data["Meta Data"]["3. Last Refreshed"];
    var currentClosePrice = data["Time Series (5min)"][lastRefreshedTime]["4. close"];
    currentClosePrice = parseFloat(currentClosePrice).toFixed(2);

    //Objects.keys returns an array of all the keys from the data [time Series]
    var listOfTimes = Object.keys(data["Time Series (5min)"]);

    //sorting the data returned and the default is asc alphabitcally
    listOfTimes.sort();

    //returning the earliest time from the listOfTimes sort in this case the [0] array item
    var openingTime = listOfTimes[0];

    //getting the opening time using the opening time from the array above
    var dayOpeningPrice = data["Time Series (5min)"][openingTime]["4. close"];
    var dayOpeningPrice = parseFloat(dayOpeningPrice).toFixed(2);

    //calculations start here
    //storing the percentage growth from the currentClosePrice and the dayOpeningPrice from above
    var growthPercentage = (currentClosePrice / dayOpeningPrice - 1) * 100;
    growthPercentage = parseFloat(growthPercentage).toFixed(2);

    //storing the difference from currentClosePricee and dayOpeningPrice
    var absoluteGrowth = currentClosePrice - dayOpeningPrice;
    absoluteGrowth = parseFloat(absoluteGrowth).toFixed(2);

    stockDataContainer.openPrice = dayOpeningPrice;
    stockDataContainer.lastPrice = currentClosePrice;
    stockDataContainer.changePerc = growthPercentage;
    stockDataContainer.changeAbs = absoluteGrowth;
  }else{
    // Produce Error Message
    console.log('Timeseries API call failed');
    console.log(data);
  }
}

// function to pull and display the stock overview information
var storeStockInfo = function (data) {

  // if API call succeeds
  if (data.Symbol){
    console.log('Overview API Succeeded')
  
  // Could add in things like description, PE, exchange, others from here
  var marketCap = data.MarketCapitalization;
  var companyName = data["Name"];
  var ticker = data["Symbol"];
  var desc = data["Description"];

  // Recursive loop for determining the post-fix for market cap according to the company's valuation.
  var marketCapIterate = function (val, counter) {
    value = parseInt(val);
    var newMag = value / 1000;
    if (newMag >= 1000) {
      return marketCapIterate(newMag, counter + 1);
    } else {
      magnitude = { 0: " Thousand", 1: " Million", 2: " Billion", 3: " Trillion" };
      var returnVal = newMag.toString() + magnitude[counter];
      return returnVal;
    }
  };
    var marketCapFormatted = marketCapIterate(marketCap, 0);
    stockDataContainer.tickerName = ticker;
    stockDataContainer.companyName = companyName;
    stockDataContainer.marketCap = marketCapFormatted;
    stockDataContainer.description = desc;
  } else {
    // Produce Error Message
    console.log('Overview API call failed');
    console.log(data);
}};

//clear containers
var clearOut = function () {
  console.log('Clearing Out')
  outerStockContainerEl.classList.remove("blink_text");
  outerStockContainerEl.style = ''
  outerStockContainerNameEl.textContent = "";
  outerStockContainerCompanyNameEl.textContent = "";
  outerStockContainerOpeningPriceEl.textContent = "";
  outerStockContainerCurrentPriceEl.textContent = "";
  outerStockContainerChangePercentEl.textContent = "";
  outerStockContainerAbsoluteEl.textContent = "";
  outerStockContainerMarketCapEl.textContent = "";
};

// rewrites the stock-info and its contents based on info from stockDataContainer
var rewriteStockInfo = function() {
  console.log('rewriting stock-info')
  outerStockContainerNameEl.textContent = stockDataContainer.tickerName;
  outerStockContainerCompanyNameEl.textContent = stockDataContainer.companyName;
  outerStockContainerOpeningPriceEl.textContent = "Opening Price: $" + stockDataContainer.openPrice;
  outerStockContainerCurrentPriceEl.textContent ="Current Price: $" +  stockDataContainer.lastPrice;
  outerStockContainerChangePercentEl.textContent = "Change Percentage: " + stockDataContainer.changePerc;
  outerStockContainerAbsoluteEl.textContent = "Change: " + stockDataContainer.changeAbs +' Dollars';
  outerStockContainerMarketCapEl.textContent =  "Market Cap: $ " + stockDataContainer.marketCap;
}

// TODO: Add a market-cap Visualizer

//On click form submit even handler
stockSubmit.addEventListener("click", formSubmitHandler);
// Trigger the searchbox function when enter is released
document.addEventListener("keyup", function(event) {
    if (event.code == 'Enter') {
        stockSubmit.click();
    }
});
