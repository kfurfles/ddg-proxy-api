Specification  

API Proxy: 

Objective: Create an API proxy to: 

GET Results: Retrieve results based on a query parameter from DuckDuckGo (http://api.duckduckgo.com/?q=x&format=json)
 via a GET request. 

Response: Return a JSON response with an array of objects containing only the URL and title fields. 

Front-End: 

Build a Front-End: Based on the API, create a front-end with the following functionalities: 

Submit Query: Allow users to submit a query parameter to the API. 

Display Results: Show results on the page from the API, where each title is a clickable link. 

Support Paging: Implement paging to navigate through the results. 

Query History: Store and display a list of past queries in a sidebar. Clicking on a query should repeat the API request, show the results below the search input, and populate the search input with the selected query. 

Search Highlight: Implement a search field similar to "Find" in Google Chrome, highlighting the searched term in the result list with yellow and counting its appearance. 

Requirements: 

API: Must be built with Node.js. You may use any libraries you prefer. 

Front-End: Must be built with React and Redux(optional). You may use any additional libraries as needed. 

Additional API Endpoint: Create an additional endpoint that retrieves information from DuckDuckGo using POST. 

Persist Query History: Persist the history of queries in a local file and load them when the application restarts. 
