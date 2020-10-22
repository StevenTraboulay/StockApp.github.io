// Watchlist Dropdown
watchlistButton = document.querySelector('#stock-watchlist-btn');

// toggle dropdown
watchlistButton.addEventListener('click', function(event) {
  event.stopPropagation();
  event.preventDefault();
  watchlistButton.classList.toggle('is-active');
});

var treeMapDataGenerator = function() {
  // starting data array according to the treemap-data-format
  var dataArr = [['Ticker', 'Parent', 'Market Cap (USD)', 'marketCap:Employees ratio'],
               ['Watchlisted Stocks',null,0,0]];

  // Pull data from Localstorage
    watchList = localStorage.getItem('stock-list')
    watchList = JSON.parse(watchList);
    if (!(jQuery.isEmptyObject(watchList))) {

        // Formatting Data
        // myRow = [ticker, empty, marketCap, numEmployees-to-marketCap]
        // See https://developers.google.com/chart/interactive/docs/gallery/treemap#data-format for details
        for (x in watchList) {
          var ratio = parseInt(watchList[x].marketCap)/parseInt(watchList[x].employees)
          dataArr.push([watchList[x].tickerName,'Watchlisted Stocks',parseInt(watchList[x].marketCap), ratio.toFixed(2)])
        }
        return dataArr;
        
    } else{
      // if localstorage is empty, clear out the chart element and return false
      $('#mkt-cap-vis-chart').html('')
      return false;
    }
}

// Once the treemap package has been loaded, draw a graph from localstorage
google.charts.load('current', {'packages':['treemap']});
google.charts.setOnLoadCallback(visualizeMarketCap);

// Draw treemap
function visualizeMarketCap() {
  // pull updated data from localstorage
  var dataToDraw = treeMapDataGenerator();

  //Cut off further code if there's nothing to draw
  if (dataToDraw === false) {return 0};

  // Convert the data into a format usable by google visualization
  var data = google.visualization.arrayToDataTable(dataToDraw);

  // Visual flair options
  var options =  {
    headerColor: '#f5f5f5',
    minColor: '#ff3860',
    minColorValue: 50000,
    maxColor: '#00d1b2',
    maxColorValue: 2000000,
    headerHeight: 0,
    fontColor: '#363636',
    title: 'Market Cap Visualization',
    titleTextStyle: {color:'#363636', fontSize: '24'},

    // showToolTip function (hover effects)
    // https://developers.google.com/chart/interactive/docs/gallery/treemap#tooltips
    showTooltips: true,
    generateTooltip: showFullTooltip
  }

  // tooltip HTML
  function showFullTooltip(row, size, value) {
    return '<div style="background:hsl(0, 0%, 100%); padding:1rem;">' +
    '<b>Ticker:</b> ' + data.getValue(row, 0) + '<br>'+
    '<b>Market Cap:</b> '+magnitudeIterate(size, 0) + '<br>' +
    '<b>Market Cap to Employees ratio:</b> $'+ magnitudeIterate(data.getValue(row, 3),0) + ' per employee</div>';
  }

  // Make a new Treemap object at chart container
  tree = new google.visualization.TreeMap(document.getElementById('mkt-cap-vis-chart'));

  // Disable clicking to go further down in the 'tree'
  google.visualization.events.addListener(tree, 'select', function () {
    tree.setSelection([]);
  });

  // draw the data with options
  tree.draw(data, options)

  }