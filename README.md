# comp86 final project group 5

Group members: Kristen Moran, Sarah Park, and Claire Boals
kmoran04, spark17, cboals01
We all worked on the same code remotely, each contributing to every aspect of the program. 

We came up with an interactive MBTA map that uses the Google Maps API and the MBTA API to display current locations of all the vehicles on each MBTA line. To do this we used Google Polylines and infowindows to display updated information and show the train routes in their corresponding colors. Each vehicle is clickable to display its current status, next station, and direction. The stations are also clickable to display their names, and double-clickable to display the next 5 departure times. All of the data is live from the MBTA, updated every 20 seconds or upon manual refresh.  

An issue we ran into was that our app was making too many requests on the MBTA API key. We fixed this by using more filters and includes to get more information from single API requests. We requested to raise our limit from the MBTA, as more requests would allow us to get even more information, like predicted arrival times and schedules on each click, but unfortunately we have to limit how many times we call this so it requires a double click, and if the user spams the server with double clicks the whole program stops working due to the request limit.


Good aspects of the UI Design:
The biggest issue we had with UI was how to prevent the user from hard refreshing constantly, which
would overload our requests and break the program. We settled on a countdown timer that lets the user
know the program is working and how long until the next refresh. The timer also conveys a sense of
constant motion, even if the cars themselves aren't constantly moving, which is important for a live
feed of the MBTA.

# To use:

Click on a subway car to see it's current status (still or moving) and its nearest station.
Click on a subway stop to see it's name.
Double click on a subway stop to see time of the next 5 trains.
