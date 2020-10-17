var searchClick = false;

document.querySelector('#stock-search').addEventListener('click', function() {
    if (searchClick) {
        // reset header-bar


        // perform API search


        //reset searchClick Variable
        searchClick=false;
        console.log(searchClick);
    }
    else {
        // show search bar and hide add-to-watchlist button
        document

        //reset searchClickVariable
        searchClick=true;
        console.log(searchClick);
    }
})