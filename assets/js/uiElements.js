historyButton = document.querySelector('#stock-history-btn');

historyButton.addEventListener('click', function(event) {
  event.stopPropagation();
  event.preventDefault();
  historyButton.classList.toggle('is-active');
});

var tree

var treeMapDataGenerator = function() {
  var setup = [['Ticker', 'Parent', 'Market Cap (USD)', 'marketCap:Employees ratio'],
               ['Watchlisted Stocks',null,0,0]];

  // Pull data from Localstorage
    searchHistory = localStorage.getItem('stock-list')
    if (searchHistory) {
        // Format Data
        // myRow = [ticker, empty, marketCap, numEmployees-to-marketCap]
        // See https://developers.google.com/chart/interactive/docs/gallery/treemap#data-format for details
        searchHistory = JSON.parse(searchHistory);
        for (x in searchHistory) {
          var ratio = parseInt(searchHistory[x].marketCap)/parseInt(searchHistory[x].employees)
          setup.push([searchHistory[x].tickerName,'Watchlisted Stocks',parseInt(searchHistory[x].marketCap), ratio.toFixed(2)])
        }
        console.log(setup)
        return setup;
        
    } else{
      return false;
    }
}

google.charts.load('current', {'packages':['treemap']});
google.charts.setOnLoadCallback(visualizeMarketCap);


function visualizeMarketCap() {
  console.log('drawing')

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
  tree = new google.visualization.TreeMap(document.getElementById('chart_div'));

  // Disable clicking to go further down in the 'tree'
  google.visualization.events.addListener(tree, 'select', function () {
    tree.setSelection([]);
  });

  tree.draw(data, options)

  }