# [StockApp.github.io](https://steventraboulay.github.io/StockApp.github.io/)
StockApp Project1

-------------
## Description

Stockapp is a group project made by Steven, Asghar and Kumash for the University of Toronto Coding Bootcamp. The app aims to be a dashboard that displays information about the daily change in a particular ticker, and compares the size of that stock's valuation to others in your watchlist for a visual perspective on how the two (or more) companies compare in the eyes of the stock market.


## Dependencies and Technologies Used

- Bulma: An opensource CSS framework
- AlphaVantage: A free (but restricted) API for getting stock information
- - Google Charts: Used for the Market Cap Visualization
- JQuery: QOL code, very useful for all things JS.
- Font Awesome: icon SVGs. Search icon, dropdown and more!

How To Use App
-------------

1. Launch application /  click link: https://steventraboulay.github.io/StockApp.github.io/
2. Input stock ticker symbol in search bar
3. Checks against APIs NASDAQ or NYSE database tickers
4. Correct symbol input results in displayed information consisting of: Opening day price, current price, change percentage, change in dollars and market cap
5. An incorrect symbol input will result in displayed error.
6. App will store last stock calls to be recalled into view. 
7. Mosaic of previously called stocks
8. A chart displaying stock data

------------
GROUP PROCESS
-------------
1. idea concept creation.
    - Movie API
    - Stock API
    - Sports API

2. Chose Stock API

3. create skeletal framework, folders, git repo and repo rules
    - created repo rule to protect main branch
4. Create boilerplate/ skeleton
5. Index creation, CSS framework selection and J script creation
6. created a script for rough work which is using // for us to play with code testing and rough ideas. 


------------------------
index creation and styling
-------------------------


-------------
Java Scripting
-------------
1. created display data function to return data
   - within function shows the stock price call
   - the stock name call
   - the growth percentage call
   - the opening price call
    ***issue came up but found fix and resolution***
2. create individual information calls
3. append the calls to div
4. get market cap info  by multiplying current stock price by the outstanding shares
5. create variables to open the opening price, current price, change percentage and market cap to append into DIV
6. append into DIV
*** Issue came up but found fix and resolution**
7. Market cap issue wasn't displaying well, was able to input a new return data point to allow it to flow through
8. fixed the percentage returns and prolonged 0.%
9. fixed an issue with our array dates 





-------------
ISSUES
-------------

1. cannot pull price from the API in the way we want as it pulls the price open and close for that moment in time.
Fix: get the last refresh time as variable and get last refresh variable but need to get day open price
(note: don't hardcode the query name)
       - need to mathematically determine which one was the earliest one in the day
       - get the last refreshed time create that variable which is pulled from API.
       - then get current closed price variable which is returned data using last refreshed time
       - create a variable list of times data array using Object.keys
       - use .sort fort he listoftimes variable
       - create a new variable called openingTime = listofTimes[0]; which allows us to start from the beginning of the array 
       - created a new variable to get open stock price by using open time
       - created growth and percentage variables based of open stock price and percentage
2. API Problem:
        - the API is limited to 5 calls every 5 mins. and 500 calls a day.
        - the work around for this is to limit your calls. please be cognizant of this. 

3. Market Cap value was not coming back with a usable value, or if it did it was too long of a number.
    -  there needed to be a return object in the if statement. 
    - -  adding multiple points of return adds a reference point and lets us have a point for the data so it doesn't get lost. 

4.  Error message weren't catching or appearing when needed

    - the original fix was to run a catch function for when the 

-------
USER STORY
-------
Who: A novice Stockholder

What: I want to see what all the big numbers in the billions and trillions mean in a more relatable manner.

Why: So I can get a better understanding of what companies are undervalued or overvalued relative to oneanother. 


----------
LINKS
----------
GITHUB: https://github.com/StevenTraboulay/StockApp.github.io

Website: https://steventraboulay.github.io/StockApp.github.io/

-------------
Screenshot
-------------

![Alt text](/assets/img/screenshot.PNG "Screenshot 1")
