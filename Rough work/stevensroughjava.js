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
    //console.log(event.target);
    historyEl.onclick = function () {
      //console.log(event.target.tagName);
      if (event.target.tagName == "LI") {
        searchStock(event.target.textContent)
      }
    };
    historyEl.appendChild(listEl);
  }

  ///-----------working with Asghar


  var stockSubmit = document.querySelector("input-group");
  var stockAPIkey = "EM3FI6FS0TMXXLD";
  var ApiKey = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + stockInput + "&interval=5min&apikey=" + stockAPIkey;


  var formSubmitHandler = function(event){
      event.preventDefault();
      var stockInput = document.querySelector("#stock-input").value.trim();
      console.log(stockInput)
      if(stockInput){
          getStockData(stockInput)
          //get
          //save
          var clearInput = document.querySelector("#stock-input");
          clearInput.value="";
    
      }else{
          alert ("Enter a Correct Symbol!");
      }

  }


  var getStockaData = function (Stock){

  }

  stockSubmit.addEventListener("submit", formSubmitHandler);