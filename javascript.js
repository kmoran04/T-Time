var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);


var myOptions = {
    zoom: 13, // The larger the zoom number, the bigger the zoom
    center: me,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map;
var marker;
var address;
var path;
var infowindow;

var marker_ray;
var stations;

var station_icon = "MBTA_icon.png";
var train_icon = "train.png";
var cycle = 0;

var count = 30;
    var x = setInterval(function() {
        if (count == 0)
            count = 30;
        count = count - 1;
        document.getElementById("timer").innerHTML = count + " seconds until refresh";

    }, 1000);

var intervalID = window.setInterval(vehicle, 30000); //refreshes every 30 seconds




function init() {
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    south = new google.maps.LatLng(42.3519, -71.0551);
    map.panTo(south);
    renderMap();


    //getMyLocation();
}


function getMyLocation() {
    if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            centerOnMe();
        });
    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }

}

function renderMap() {

    /*marker_ray = new Array(stations.stops.length);
    var i;

    infowindow = new google.maps.InfoWindow();

    for (i = 0; i < stations.stops.length; i++){

        var stop = new google.maps.LatLng(stations.stops[i].lat, stations.stops[i].long);
        marker_ray[i] = new google.maps.Marker({
            position: stop,
            icon: station_icon,
            title: "<h1>" + stations.stops[i].name + "</h1>"
        });
        marker_ray[i].setMap(map);
        
        windows(stations.stops[i].id, marker_ray[i]);
        
    }*/
    
    var temp = new google.maps.Polyline({});
    orange_line();
    blue();
    red();
    green();
    vehicle();
}


function windows(id, marker) {
    var content = '<p>';

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/predictions?filter[route]=Red&filter[stop]=" + id + "&page[limit]=10&page[offset]=0&sort=departure_time&api_key=6cce7cd3b50f43d28e450bf98d43e4d7";

    request.open("GET", address, true);

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) 
        {
            var time;
            var direction;
            theData = request.responseText;
            station = JSON.parse(theData);


            for (j = 0; j < station.data.length; j++) {

                current = station.data[j];

                if (current.attributes.direction_id == 1)
                    direction = "Northbound (Alewife)";
                else
                    direction = "Southbound (Ashmont/Braintree)";

                time = current.attributes.departure_time;

                var dir = "Departing";

                if (time == null){
                    time = current.attributes.arrival_time;
                    dir = "Arriving";
                }

                if (time != null)
                    time = time.substr(11, 8);
                else
                    time = "No time available";

                content += '<p>' +dir + ': ' + time + ', ' + direction + '</p>';
            }
            content += '</p>';

            if (content == '<p></p>')
                content = "Not available";

            addInfoWindow(marker, content);
            
        }
    }

    request.send();
}

function addInfoWindow(marker, message) {
    var infoWindow = new google.maps.InfoWindow({
        content: marker.title + message 
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
    });
}

function centerOnMe() {

    getMyLocation();

    me = new google.maps.LatLng(myLat, myLng);
    // Update map and go there...
    map.panTo(me);

}

function m_miles(m){
    return (m/1609.344).toFixed(3);
}


function orange_line(){

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/shapes?include=stops&filter[route]=Orange";

    request.open("GET", address, true);

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            paths = JSON.parse(theData);


            for (i = 0; i < paths.data.length; i++) {
                var line = paths.data[i].attributes.polyline;
                //console.log(line);
                var decoded = google.maps.geometry.encoding.decodePath(line);
                var orange_path = new google.maps.Polyline( {
                    strokeColor: "#FFA500",
                    path: decoded

                });
                orange_path.setMap(map);
            }

            orange_ray = new Array(paths.included.length);

            for (j = 0; j < paths.included.length; j++){
                var stop = new google.maps.LatLng(paths.included[j].attributes.latitude, paths.included[j].attributes.longitude);
                orange_ray[j] = new google.maps.Marker({
                    position: stop,
                    icon: station_icon,
                    title: "<h1>" + paths.included[j].attributes.name + "</h1>"
                });
            
                orange_ray[j].setMap(map);
                
            
            }
        }
    }

    request.send();

}

function blue() {
    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/shapes?include=stops&filter[route]=Blue";

    request.open("GET", address, true);

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            paths = JSON.parse(theData);

            for (i = 0; i < paths.data.length; i++) {
                var line = paths.data[i].attributes.polyline;
                //console.log(line);
                var decoded = google.maps.geometry.encoding.decodePath(line);
                var blue_path = new google.maps.Polyline( {
                    strokeColor: "#0080ff",
                    path: decoded

                });
                blue_path.setMap(map);
            }
                
            blue_ray = new Array(paths.included.length);

            for (j = 0; j < paths.included.length; j++){
                var stop = new google.maps.LatLng(paths.included[j].attributes.latitude, paths.included[j].attributes.longitude);
                blue_ray[j] = new google.maps.Marker({
                    position: stop,
                    icon: station_icon,
                    title: "<h1>" + paths.included[j].attributes.name + "</h1>"
                });
            
                blue_ray[j].setMap(map);
            
            }
        }
    }

    request.send();

}

function red() {
    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/shapes?include=stops&filter[route]=Red";

    request.open("GET", address, true);

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            paths = JSON.parse(theData);

            for (i = 0; i < paths.data.length; i++) {
                var line = paths.data[i].attributes.polyline;
                //console.log(line);
                var decoded = google.maps.geometry.encoding.decodePath(line);
                var red_path = new google.maps.Polyline( {
                    strokeColor: "#cd0000",
                    path: decoded

                });
                red_path.setMap(map);
            }

            red_ray = new Array(paths.included.length);

            for (j = 0; j < paths.included.length; j++){
                var stop = new google.maps.LatLng(paths.included[j].attributes.latitude, paths.included[j].attributes.longitude);
                    red_ray[j] = new google.maps.Marker({
                    position: stop,
                    icon: station_icon,
                    title: "<h1>" + paths.included[j].attributes.name + "</h1>"
                });
            
                red_ray[j].setMap(map);
            }
                
            
        }
    }

    request.send();

}

function green(){

    green_helper("B");
    green_helper("C");
    green_helper("D");
    green_helper("E");

}

function green_helper(line)
{
    
    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/shapes?include=stops&filter[route]=Green-" + line;
   

    request.open("GET", address, true);

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            paths = JSON.parse(theData);

            for (i = 0; i < paths.data.length; i++) {
                var line = paths.data[i].attributes.polyline;
                //console.log(line);
                var decoded = google.maps.geometry.encoding.decodePath(line);
                var green_path = new google.maps.Polyline( {
                    strokeColor: "#458B00",
                    path: decoded

                });
                green_path.setMap(map);
            }

            green_ray = new Array(paths.included.length);

            for (j = 0; j < paths.included.length; j++){
                var stop = new google.maps.LatLng(paths.included[j].attributes.latitude, paths.included[j].attributes.longitude);
                    green_ray[j] = new google.maps.Marker({
                    position: stop,
                    icon: station_icon,
                    title: "<h1>" + paths.included[j].attributes.name + "</h1>"
                });
            
                green_ray[j].setMap(map);
            }
                
            
        }
    }

    request.send();
}

function vehicle(){

    cycle++;

    

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/vehicles?include=stop&filter[route]=Red";

    request.open("GET", address, true);


    request.onreadystatechange = function() {

        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            trains = JSON.parse(theData);
            //console.log(cycle);
            
            

            train_ray = new Array(trains.data.length);
            //console.log("length: ", trains.data.length);
           
            for (i = 0; i < trains.data.length; i++) {
                lat = trains.data[i].attributes.latitude;
                lon = trains.data[i].attributes.longitude;
                var loc = new google.maps.LatLng(lat, lon);
                station = trains.included[i].attributes.name;
        
                train_ray[i] = new google.maps.Marker({
                    position: loc,
                    icon: train_icon,
                    title: "<h1>" + station + "</h1>"
                });

                train_ray[i].setMap(map);
            }
            
        }
    }

    request.send();

    if(cycle > 1){
                old_ray = new Array(train_ray.length);
                for(i = 0; i  < train_ray.length; i++)
                    old_ray[i] =  train_ray[i];
                //console.log("old length: ", old_ray.length);
                i = 0;
                while (old_ray[i] != undefined){
                    old_ray[i].setMap(null);
                    i++;
                }

                old_ray = [];
            }

}



