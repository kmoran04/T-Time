var myLat = 0;
var myLng = 0;


var myOptions = {
    zoom: 13, // The larger the zoom number, the bigger the zoom
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
var cycle = 0;

var count = 30;
    var x = setInterval(function() {
        if (count == 0)
            count = 30;
        count = count - 1;
        document.getElementById("timer").innerHTML = count + " seconds until refresh";

    }, 1000);

var intervalID = window.setInterval(vehicle_helper, 30000); //refreshes every 30 seconds




function init() {
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    south = new google.maps.LatLng(42.3519, -71.0551);
    map.panTo(south);
    renderMap();

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
    vehicle_helper();
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
                    title: "<h1>" + paths.included[j].attributes.name + "</h1>",
                    zIndex: 0
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

function vehicle_helper(){
    cycle++;
    red_vehicles("Red");
    blue_vehicles("Blue");
    orange_vehicles("Orange");
    gb_vehicles("Green-B");
    gc_vehicles("Green-C");
    gd_vehicles("Green-D");
    ge_vehicles("Green-E");
}


function red_vehicles(route){

    info = new google.maps.InfoWindow();
    var train_icon = "train_" + route + ".png";

    if(cycle > 1){
        rold_ray = new Array(rtrain_ray.length);
         for(i = 0; i  < rtrain_ray.length; i++)
            rold_ray[i] =  rtrain_ray[i];
        //console.log("old length: ", old_ray.length);
        i = 0;
        while (rold_ray[i] != undefined){
            rold_ray[i].setMap(null);
            i++;
        }

        rold_ray = [];
    }

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/vehicles?include=stop&filter[route]=" + route;

    request.open("GET", address, true);


    request.onreadystatechange = function() {

        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            trains = JSON.parse(theData);
            //console.log(cycle);  

            rtrain_ray = new Array(trains.data.length);
            //console.log("length: ", trains.data.length);
           
            for (i = 0; i < trains.data.length; i++) {
                lat = trains.data[i].attributes.latitude;
                lon = trains.data[i].attributes.longitude;
                var loc = new google.maps.LatLng(lat, lon);
                for (j = 0; j < trains.included.length; j++){
                    if(trains.included[j].id == trains.data[i].relationships.stop.data.id){
                        name = trains.included[j].attributes.name;
                        break;
                    }
                }

                status = trains.data[i].attributes.current_status;
                console.log(status);
        
                rtrain_ray[i] = new google.maps.Marker({
                    position: loc,
                    icon: train_icon,
                    title: "<h1>" + status + " " + name + "</h1>"
                });

                content =  "<p>" + status + " " + name + "</p>";
                addInfoWindow(rtrain_ray[i], content);

                rtrain_ray[i].setMap(map);
            }
            
        }
    }

    request.send();

    

}



function blue_vehicles(route){

    info = new google.maps.InfoWindow();

    var train_icon = "train_" + route + ".png";

    if(cycle > 1){
        bold_ray = new Array(btrain_ray.length);
         for(i = 0; i  < btrain_ray.length; i++)
            bold_ray[i] =  btrain_ray[i];
        //console.log("old length: ", old_ray.length);
        i = 0;
        while (bold_ray[i] != undefined){
            bold_ray[i].setMap(null);
            i++;
        }

        bold_ray = [];
    }

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/vehicles?include=stop&filter[route]=" + route;

    request.open("GET", address, true);


    request.onreadystatechange = function() {

        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            trains = JSON.parse(theData);
            //console.log(cycle);  

            btrain_ray = new Array(trains.data.length);
            //console.log("length: ", trains.data.length);
           
            for (i = 0; i < trains.data.length; i++) {
                lat = trains.data[i].attributes.latitude;
                lon = trains.data[i].attributes.longitude;
                var loc = new google.maps.LatLng(lat, lon);
                for (j = 0; j < trains.included.length; j++){
                    if(trains.included[j].id == trains.data[i].relationships.stop.data.id){
                        name = trains.included[j].attributes.name;
                        break;
                    }
                }

                status = trains.data[i].attributes.current_status;
        
                btrain_ray[i] = new google.maps.Marker({
                    position: loc,
                    icon: train_icon,
                    title: "<h1>" + status + " " + name + "</h1>"
                });

                content =  "<p>" + status + " " + name + "</p>";
                addInfoWindow(btrain_ray[i], content);

                btrain_ray[i].setMap(map);
            }
            
        }
    }

    request.send();

}

function orange_vehicles(route){

    var train_icon = "train_" + route + ".png";

    if(cycle > 1){
        oold_ray = new Array(otrain_ray.length);
         for(i = 0; i  < otrain_ray.length; i++)
            oold_ray[i] =  otrain_ray[i];
        //console.log("old length: ", old_ray.length);
        i = 0;
        while (oold_ray[i] != undefined){
            oold_ray[i].setMap(null);
            i++;
        }

        oold_ray = [];
    }

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/vehicles?include=stop&filter[route]=" + route;

    request.open("GET", address, true);


    request.onreadystatechange = function() {

        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            trains = JSON.parse(theData);
            //console.log(cycle);  

            otrain_ray = new Array(trains.data.length);
            //console.log("length: ", trains.data.length);
           
            for (i = 0; i < trains.data.length; i++) {
                lat = trains.data[i].attributes.latitude;
                lon = trains.data[i].attributes.longitude;
                var loc = new google.maps.LatLng(lat, lon);
                for (j = 0; j < trains.included.length; j++){
                    if(trains.included[j].id == trains.data[i].relationships.stop.data.id){
                        name = trains.included[j].attributes.name;
                        break;
                    }
                }

                status = trains.data[i].attributes.current_status;
        
                otrain_ray[i] = new google.maps.Marker({
                    position: loc,
                    icon: train_icon,
                    title: "<h1>" + status + " " + name + "</h1>"
                });

                content =  "<p>" + status + " " + name + "</p>";
                addInfoWindow(otrain_ray[i], content);

                otrain_ray[i].setMap(map);
            }
            
        }
    }

    request.send();

}

function gb_vehicles(route){

    var train_icon = "train_" + route + ".png";

    if(cycle > 1){
        gbold_ray = new Array(gbtrain_ray.length);
         for(i = 0; i  < gbtrain_ray.length; i++)
            gbold_ray[i] =  gbtrain_ray[i];
        //console.log("old length: ", old_ray.length);
        i = 0;
        while (gbold_ray[i] != undefined){
            gbold_ray[i].setMap(null);
            i++;
        }

        gbold_ray = [];
    }

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/vehicles?include=stop&filter[route]=" + route;

    request.open("GET", address, true);


    request.onreadystatechange = function() {

        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            trains = JSON.parse(theData);
            //console.log(cycle);  

            gbtrain_ray = new Array(trains.data.length);
            //console.log("length: ", trains.data.length);
           
            for (i = 0; i < trains.data.length; i++) {
                lat = trains.data[i].attributes.latitude;
                lon = trains.data[i].attributes.longitude;
                var loc = new google.maps.LatLng(lat, lon);
                for (j = 0; j < trains.included.length; j++){
                    if(trains.included[j].id == trains.data[i].relationships.stop.data.id){
                        name = trains.included[j].attributes.name;
                        break;
                    }
                }

                status = trains.data[i].attributes.current_status;
        
                gbtrain_ray[i] = new google.maps.Marker({
                    position: loc,
                    icon: train_icon,
                    title: "<h1>" + status + " " + name + "</h1>"
                });

                content =  "<p>" + status + " " + name + "</p>";
                addInfoWindow(gbtrain_ray[i], content);

                gbtrain_ray[i].setMap(map);
            }
            
        }
    }

    request.send();

}

function gc_vehicles(route){

    var train_icon = "train_" + route + ".png";

    if(cycle > 1){
        gcold_ray = new Array(gctrain_ray.length);
         for(i = 0; i  < gctrain_ray.length; i++)
            gcold_ray[i] =  gctrain_ray[i];
        //console.log("old length: ", old_ray.length);
        i = 0;
        while (gcold_ray[i] != undefined){
            gcold_ray[i].setMap(null);
            i++;
        }

        gcold_ray = [];
    }

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/vehicles?include=stop&filter[route]=" + route;

    request.open("GET", address, true);


    request.onreadystatechange = function() {

        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            trains = JSON.parse(theData);
            //console.log(cycle);  

            gctrain_ray = new Array(trains.data.length);
            //console.log("length: ", trains.data.length);
           
            for (i = 0; i < trains.data.length; i++) {
                lat = trains.data[i].attributes.latitude;
                lon = trains.data[i].attributes.longitude;
                var loc = new google.maps.LatLng(lat, lon);
                for (j = 0; j < trains.included.length; j++){
                    if(trains.included[j].id == trains.data[i].relationships.stop.data.id){
                        name = trains.included[j].attributes.name;
                        break;
                    }
                }

                status = trains.data[i].attributes.current_status;
        
                gctrain_ray[i] = new google.maps.Marker({
                    position: loc,
                    icon: train_icon,
                    title: "<h1>" + status + " " + name + "</h1>"
                });

                content =  "<p>" + status + " " + name + "</p>";
                addInfoWindow(gctrain_ray[i], content);

                gctrain_ray[i].setMap(map);
            }
            
        }
    }

    request.send();

}

function gd_vehicles(route){

    var train_icon = "train_" + route + ".png";

    if(cycle > 1){
        gdold_ray = new Array(gdtrain_ray.length);
         for(i = 0; i  < gdtrain_ray.length; i++)
            gdold_ray[i] =  gdtrain_ray[i];
        //console.log("old length: ", old_ray.length);
        i = 0;
        while (gdold_ray[i] != undefined){
            gdold_ray[i].setMap(null);
            i++;
        }

        gdold_ray = [];
    }

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/vehicles?include=stop&filter[route]=" + route;

    request.open("GET", address, true);


    request.onreadystatechange = function() {

        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            trains = JSON.parse(theData);
            //console.log(cycle);  

            gdtrain_ray = new Array(trains.data.length);
            //console.log("length: ", trains.data.length);
           
            for (i = 0; i < trains.data.length; i++) {
                lat = trains.data[i].attributes.latitude;
                lon = trains.data[i].attributes.longitude;
                var loc = new google.maps.LatLng(lat, lon);
                for (j = 0; j < trains.included.length; j++){
                    if(trains.included[j].id == trains.data[i].relationships.stop.data.id){
                        name = trains.included[j].attributes.name;
                        break;
                    }
                }

                status = trains.data[i].attributes.current_status;
        
                gdtrain_ray[i] = new google.maps.Marker({
                    position: loc,
                    icon: train_icon,
                    title: "<h1>" + status + " " + name + "</h1>"
                });

                content =  "<p>" + status + " " + name + "</p>";
                addInfoWindow(gdtrain_ray[i], content);

                gdtrain_ray[i].setMap(map);
            }
            
        }
    }

    request.send();

}

function ge_vehicles(route){

    var train_icon = "train_" + route + ".png";

    if(cycle > 1){
        geold_ray = new Array(getrain_ray.length);
         for(i = 0; i  < getrain_ray.length; i++)
            geold_ray[i] =  getrain_ray[i];
        //console.log("old length: ", old_ray.length);
        i = 0;
        while (geold_ray[i] != undefined){
            geold_ray[i].setMap(null);
            i++;
        }

        geold_ray = [];
    }

    var request = new XMLHttpRequest();
    address = "https://api-v3.mbta.com/vehicles?include=stop&filter[route]=" + route;

    request.open("GET", address, true);


    request.onreadystatechange = function() {

        if (request.readyState == 4 && request.status == 200) 
        {
            theData = request.responseText;
            trains = JSON.parse(theData);
            //console.log(cycle);  

            getrain_ray = new Array(trains.data.length);
            //console.log("length: ", trains.data.length);
           
            for (i = 0; i < trains.data.length; i++) {
                lat = trains.data[i].attributes.latitude;
                lon = trains.data[i].attributes.longitude;
                var loc = new google.maps.LatLng(lat, lon);
                for (j = 0; j < trains.included.length; j++){
                    if(trains.included[j].id == trains.data[i].relationships.stop.data.id){
                        name = trains.included[j].attributes.name;
                        break;
                    }
                }

                status = trains.data[i].attributes.current_status;
        
                getrain_ray[i] = new google.maps.Marker({
                    position: loc,
                    icon: train_icon,
                    title: "<h1>" + status + " " + name + "</h1>"
                });

                content =  "<p>" + status + " " + name + "</p>";
                addInfoWindow(getrain_ray[i], content);

                getrain_ray[i].setMap(map);
            }
            
        }
    }

    request.send();

}