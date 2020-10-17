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





-------------
ISSUES
-------------

1) cannot pull price from the API in the way we want as it pulls the price opena and close for that moment in time.
Fix: get the last refresh time as variable and get last refreh variable but need to get day open price
(note: dont hardcode the query name)
    a) need to mathematically determine which one was the earliest one in the day
    b)get the lastrefreshed time create that variable which is pulled from API
    c)then get current closed price variable which is returned data using lastrefreshed time
    d)create a variable list of times data array using Object.keys
    e) use .sort fort he listoftimes variable
    f)create a new variable called openingTime = listofTimes[0]; which allows us to start from the begining of the array 
    g)created a new variable to get open stock price by using open time
    h) craeted growth and percentage variables based of open stock price and percentage



