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

// Stock time-series contaienr from 9:30-4:00
// TODO: implement data addition to this while looking for 9:30 and 4:00 values in the time-series data
var stockTimeSeries = {};

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
    getStockInfo(stockInput);
  } else {
    return 1;
  }
};

//fetch call for stockdata from API
var getStockInfo = function (stockInput) {
  var timeSeries =
    "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stockInput + "&interval=15min&apikey=EME3FI6FSOTMXXLD";
  var overview =
    "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + stockInput + "&apikey=OUE8TXQ1L0CBMKMQ";
  var clearInput = document.querySelector("#stock-input");
  clearInput.value = "";
  clearOut();
  fetch(timeSeries)
    .then((res) => res)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          if (data['Meta Data']) {
            storeDailyData(data);
          } else {
            console.log('Timeseries API call failed on:', stockInput);
            console.log(data)
            stockDataContainer = {};
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
            saveToLocalStorage();
          } else {
            console.log('Overview API call failed on: ', stockInput);
            console.log(data)
            errorMessage = "Failed to find data on ticker: "+stockInput;
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
    console.log('Time Series API Succeeded');
    console.log(data);

    // add stuff to stockDataContainer)
    var lastRefreshedTime = data["Meta Data"]["3. Last Refreshed"];
    var currentClosePrice = data["Time Series (15min)"][lastRefreshedTime]["4. close"];
    currentClosePrice = parseFloat(currentClosePrice).toFixed(2);

    //Objects.keys returns an array of all the keys from the data [time Series]
    var listOfTimes = Object.keys(data["Time Series (15min)"]);

    //sorting the data returned and the default is asc alphabitcally
    listOfTimes.sort();

    //returning the earliest time from the listOfTimes sort in this case the [0] array item
    var openingTime = listOfTimes[0];

    //getting the opening time using the opening time from the array above
    var dayOpeningPrice = data["Time Series (15min)"][openingTime]["4. close"];
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
    } else {stockDataContainer.loss = false;}
  }else{
    // Produce Error Message
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
  var emp = data["FullTimeEmployees"];


  var marketCapFormatted = magnitudeIterate(marketCap, 0);
  stockDataContainer.tickerName = ticker;
  stockDataContainer.companyName = companyName;
  stockDataContainer.marketCap = marketCap;
  stockDataContainer.marketCapFormatted = marketCapFormatted;
  stockDataContainer.description = desc;
  stockDataContainer.SharesOutstanding = sharesTotal;
  stockDataContainer.employees = emp;
  } else {
    // Produce Error Message
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

  $('#mkt-cap-hdr').html("");
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
  outerStockContainerChangePercentEl.textContent = "Change Percentage: " + stockDataContainer.changePerc +"%";
  outerStockContainerAbsoluteEl.textContent = "Change: " + stockDataContainer.changeAbs +' Dollars';
  outerStockContainerMarketCapEl.textContent =  "Market Cap: $ " + stockDataContainer.marketCapFormatted;

  if (stockDataContainer.loss) {
    outerStockContainerEl.style = 'background-color:hsl(348,100%,61%);';
   } else {
    outerStockContainerEl.style = 'background-color:hsl(171, 100%, 41%);';
   }
}

// TODO: Add a market-cap Visualizer
var mktCapVisualize = function() {
  var keyword = 'gained'
  if (stockDataContainer.loss) {keyword = 'lost'}

  var medianIndividualIncome =  36400;
  var exchangeRate = 0.77;

  var diffCalculator = function(value) {
    var totalEquivalence = stockDataContainer.marketCap / value;
    var dailyEquivalence = Math.abs(parseInt((stockDataContainer.changeAbs*stockDataContainer.SharesOutstanding)/value))

    return [totalEquivalence, dailyEquivalence]
  }
  /// mktCap / medianIndividualIncome == num of people funded for a year
  /// (dayChange*sharesOutstanding) / medianHouseholdIncome = num of people that can be funded for a year based on today's movements
  var medianIncomeComp = diffCalculator(medianIndividualIncome*exchangeRate);

  $('#mkt-cap-hdr').html("The median Canadian makes $"+medianIndividualIncome+" CAD per year (2018):");
  mktCapTot.innerHTML = stockDataContainer.tickerName +"'s valuation would be equivalent to the salary of <b>"
                        + magnitudeIterate(medianIncomeComp[0], 0) + " Canadians.</b>";
  mktCapDay.innerHTML = "The daily change in "+stockDataContainer.tickerName+"'s stock price represents <b>"+
                       medianIncomeComp[1]+" Canadians income</b> worth of value "
                        +keyword+'. In real dollars, that would be <b>$'+
                        magnitudeIterate(medianIncomeComp[1]*medianIndividualIncome, 0)+'</b>.';
  

}

var appendToHistoryList = function (ticker) {
  // adds to history-list
  var link = $('<a>').attr('class','dropdown-item watchlist-item').attr("href","#").attr('id',ticker+'-container');
  var button = $('<span>').attr('class', 'stock-search-button').html(ticker);
  var remove = $('<span>').attr('class', 'icon is-medium p-3 trash-item')
              .html('<i class="fa fa-trash" id="'+ticker+'-rmv"></i>');

  link.append(button).append(remove);
  $("#inner-history").append(link);

  remove.on('click', function(event) {removeFromWatchlist($(event.target))});
  button.on('click', function(event) {getStockInfo(event.target.textContent)});
};

var removeFromWatchlist = function(target) {
  // Get parent Container and remove it
  console.log(target)
  console.log(target.attr('id').split('-rmv')[0])
  var ticker = (target.attr('id').split('-rmv')[0]);
  $('#'+ticker+'-container').remove();  

  // Remove from Localstorage
  watchList = localStorage.getItem('stock-list')
  watchList = JSON.parse(watchList);
  delete watchList[ticker]
  watchList = JSON.stringify(watchList);
  localStorage.setItem('stock-list', watchList);

  // Redraw the Visualization
  visualizeMarketCap();

};

var saveToLocalStorage = function() {
  var searchHistory = localStorage.getItem('stock-list')
  var name = stockDataContainer.tickerName;

  if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
      if (searchHistory[name]){
        console.log(name)
        searchHistory[name] = stockDataContainer;
        searchHistory = JSON.stringify(searchHistory);
        localStorage.setItem('stock-list',searchHistory);
        visualizeMarketCap();
      }
      else {
      searchHistory[name] = stockDataContainer;
      searchHistory = JSON.stringify(searchHistory);
      localStorage.setItem('stock-list',searchHistory);
      appendToHistoryList(name);
      visualizeMarketCap();
      }
  }

  else {
      searchHistory = {};
      searchHistory[name] = stockDataContainer;
      searchHistory = JSON.stringify(searchHistory);
      localStorage.setItem('stock-list',searchHistory);
      appendToHistoryList(name);
      visualizeMarketCap();
  }
}

var loadFromLocalStorage = function() {
  searchHistory = localStorage.getItem('stock-list')
  if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
      for (x in searchHistory) {
        appendToHistoryList(x)
      }
  }
}

loadFromLocalStorage();

//On click form submit even handler
stockSubmit.addEventListener("click", formSubmitHandler);
// Trigger the searchbox function when enter is released
document.addEventListener("keyup", function(event) {
    if (event.code == 'Enter') {
        stockSubmit.click();
    }
});

window.onresize = visualizeMarketCap;

//////////////////////////