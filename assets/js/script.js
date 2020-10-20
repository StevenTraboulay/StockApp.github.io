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

var mktCapContainer = document.querySelector('#mkt-cap-vis')
var mktCapTot = document.querySelector('#total-mkt-cap-comp')
var mktCapDay = document.querySelector('#day-mkt-cap-comp')


// Stock Data Storage
var stockDataContainer = {};

// Error Message Container
var errorMessage = '';

// Recursive loop for determining the post-fix for market cap according to the company's valuation.
var magnitudeIterate = function (val, counter) {
  value = parseInt(val);
  var newMag = value / 1000;
  if (newMag >= 1000) {
    return magnitudeIterate(newMag, counter + 1);
  } else {
    magnitude = { 0: " Thousand", 1: " Million", 2: " Billion", 3: " Trillion" };
    var returnVal = newMag.toString() + magnitude[counter];
    return returnVal;
  }
};


//This executes when the event listener kicks off to handle the button click
var formSubmitHandler = function (event) {
  event.preventDefault();
  var stockInput = document.querySelector("#stock-input").value.trim();
  console.log('Fetching Data for: ',stockInput);
  if (stockInput) {
    var clearInput = document.querySelector("#stock-input");
    clearInput.value = "";
    clearOut();
    getStockInfo(stockInput);
  } else {
    return 1;
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
            mktCapVisualize();
          } else {
            console.log(data)
            errorMessage = "Can not fetch Stock Information data on ticker: "+stockInput;
            stockDataContainer = {};
            outerStockContainerCompanyNameEl.innerHTML += errorMessage+'';
            outerStockContainerNameEl.innerHTML = '<br>Please try another ticker or wait for 1 minute before trying another search. See console for details.'
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
    if (absoluteGrowth < 0) {
      stockDataContainer.loss = true;
    }
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
  var sharesTotal = data['SharesOutstanding'];


  var marketCapFormatted = magnitudeIterate(marketCap, 0);
  stockDataContainer.tickerName = ticker;
  stockDataContainer.companyName = companyName;
  stockDataContainer.marketCap = marketCap;
  stockDataContainer.marketCapFormatted = marketCapFormatted;
  stockDataContainer.description = desc;
  stockDataContainer.SharesOutstanding = sharesTotal;
  } else {
    // Produce Error Message
    console.log('Overview API call failed');
    console.log(data);
}};

//clear containers
var clearOut = function () {
  console.log('Clearing Out')
  outerStockContainerEl.classList.remove("blink_text");
  outerStockContainerEl.style = '';
  mktCapContainer.style = '';

  outerStockContainerNameEl.textContent = "";
  outerStockContainerCompanyNameEl.textContent = "";
  outerStockContainerOpeningPriceEl.textContent = "";
  outerStockContainerCurrentPriceEl.textContent = "";
  outerStockContainerChangePercentEl.textContent = "";
  outerStockContainerAbsoluteEl.textContent = "";
  outerStockContainerMarketCapEl.textContent = "";

  mktCapTot.textContent = "";
  mktCapDay.textContent = "";
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
  outerStockContainerMarketCapEl.textContent =  "Market Cap: $ " + stockDataContainer.marketCapFormatted;

  if (stockDataContainer.loss) {
    outerStockContainerEl.style = 'background-color:hsl(348,100%,61%)';
   }
}

// TODO: Add a market-cap Visualizer
var mktCapVisualize = function() {
  var mktCapContainer = document.querySelector('#mkt-cap-vis')
  var mktCapTot = document.querySelector('#total-mkt-cap-comp')
  var mktCapDay = document.querySelector('#day-mkt-cap-comp')
  var keyword = 'gained'
  if (stockDataContainer.loss) {keyword = 'lost'}

  var medianIndividualIncome =  55000;
  /// mktCap / medianIndividualIncome == num of people funded for a year
  /// (dayChange*sharesOutstanding) / medianHouseholdIncome = num of people that can be funded for a year based on today's movements

  mktCapTot.innerHTML = "If each canadian made $"+medianIndividualIncome+" in a year:<br>"+stockDataContainer.tickerName +" is valued at $"+stockDataContainer.marketCapFormatted+". This is equivalent to the salary of <b>"
                        + magnitudeIterate(stockDataContainer.marketCap/medianIndividualIncome, 0) + " canadians.</b>"
  mktCapDay.innerHTML = "The daily change in "+stockDataContainer.tickerName+"'s stock price represents <b>"+
                        Math.abs(parseInt((stockDataContainer.changeAbs*stockDataContainer.SharesOutstanding)/medianIndividualIncome))+" canadians income</b> worth of value "
                        +keyword+'.'
  

}

//On click form submit even handler
stockSubmit.addEventListener("click", formSubmitHandler);
// Trigger the searchbox function when enter is released
document.addEventListener("keyup", function(event) {
    if (event.code == 'Enter') {
        stockSubmit.click();
    }
});
