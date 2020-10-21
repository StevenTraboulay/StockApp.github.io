//-------------stevens rough work

//finding the search valu pull from indx
function getSearchVal() {
    var searchValue = document.querySelector("#stock-search").value;
    searchStock(searchValue);
    makeRow(searchValue);
  }

  //create row
function makeRow(searchValue) {
    var listEl = document.createElement("li")
    listEl.classList.add("list-group-item", "list-group-item-action");
    var text = searchValue;
    listEl.textContent = text;
    var historyEl = document.querySelector(".stock-history");
    console.log(event.target);
    historyEl.onclick = function () {
      console.log(event.target.tagName);
      if (event.target.tagName == "LI") {
        searchStock(event.target.textContent)
}
   };
    historyEl.appendChild(listEl);
 }

      //current stock content example rough work
      var stockNameEl = document.createElement("h3")
      stockNameEl.classList.add("#stock-name");
      stockName.textContent =
        data.name + "(" + new Date().toLocaleDateString() + ")";
      var stockBox = document.createElement("div");
      stockBox.classList.add("XXXXXXXX");
      var stockTickerEl = document.createElement("p");

    //alternative 
    

    //-------------THE FIX ----------------------
    //get price
    console.log(data)
    //gett data from API
    var lastRefreshedTime = data['Meta Data']['3. Last Refreshed']; // required spaces IF SPACES ARE TEHRE

    var dayOpenPrice = Object.keys(data['Time Series (5min)']);  // <<<--- returns an array of all the keys
    //console.log (lostOfTimes)
    //  sorting the data returned and default is ascending alphabetically 
    listOfTimes.Sort()
    console.log(listOfTimes)
    //returning the earliest time from the list OfTimes sort in thiis case the [0] array item
    var openingTime = listOfTimes[0];
    console.log(openingTime);
    //getting the opening price data from the earliest time from the array above
    var dayOpeningPrice = data['time Series (5min)'][openingTime]['4. close'];
    console.log(dayOpeningPrice);
    //storting growth percentage from currentclose price and day opening price above
    var growthPercentage = (currentClosePrice / dayOpeningPrice -1) * 100;
    console.log(growthPercentage);
    //storing different from current close pprice and day opening price
    var absoluteGrowth = currentClosePrice = dayOpeningPrice;
    console.log(absoluteGrowth);


    //append to outer container
    outerStockContaainerNameEl.appendchild(stockNameEl);

  ///-----------working with Asghar




//Initiated Variables
var stockSubmit = document.querySelector("#input-group");
var outerStockContainerEl = document.querySelector("")

//This executes when the event listener kicks off to handle the button click
var formSubmitHandler = function(event){
    event.preventDefault();
    var stockInput = document.querySelector("#stock-input").value.trim();
    console.log(stockInput)
    if(stockInput){
        getStockData(stockInput)
        

           
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