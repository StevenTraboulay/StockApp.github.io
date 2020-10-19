# StockApp.github.io
StockApp Project1


------------
GROUP PROCESS
-------------
1) idea concept creation
    a) Movie API
    b) Stock API
    c) Sports API

2) Chose Stock API

3) create skeletal framework, folders git repo and repo rules
    a) created repo rule to protect main branch
4) Create boilerplate/ skeleton
5) Index creation, CSS framework selection and J script creation
6) craeted a script for rough work which is using // for us to play with code testing and rough ideas. 


------------------------
index creation and styling
-------------------------


-------------
Java Scripting
-------------
1) created display data function to return data
    a) within function shows the stock price call
    b) the stock name call
    c) the growth percentage call
    d) the opening price call
    ***issue came up but found fix and resolution***
2) create indiviidual information calls
3) append the calls to div
4) get market cap info  by multiplying current stock price by the outstanding shares
5) create variables to open the openingprice, currentprice, change percentage and market cap to append into DIV
6) append into DIV
*** Issue came up but found fix and resolution***
7) Market cap issue wasnt displaying well, was able to input a new return data point to allow it to flow through
8) fixed the percetange returns and prolonged 0.%





-------------
ISSUES
-------------

1) cannot pull price from the API in the way we want as it pulls the price opena and close for that moment in time.
Fix: get the last refresh time as variable and get last refreh variable but need to get day open price
(note: dont hardcode the query name)
    1. a) need to mathematically determine which one was the earliest one in the day
    1. b)get the lastrefreshed time create that variable which is pulled from API
    1. c)then get current closed price variable which is returned data using lastrefreshed time
    1. d)create a variable list of times data array using Object.keys
    1. e) use .sort fort he listoftimes variable
    1. f)create a new variable called openingTime = listofTimes[0]; which allows us to start from the begining of the array 
    1. g)created a new variable to get open stock price by using open time
    1. h) craeted growth and percentage variables based of open stock price and percentage
2) API Problem:
    2. a) the API is limited to 5 calls every 5 mins. and 500 calls a day.
    2. b) the work around for this is to limit your calls. please be cognizant of this. 

3) Market Cap value was not coming back with a usable value, or if it did it was too long of a number.
    3. a) there needed to be a return object in the if statement. 
    3. b) adding multiple points of return adds a reference point and lets us have a point for the data so it doesn't get lost. 






