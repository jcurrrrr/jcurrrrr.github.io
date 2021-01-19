var catlist = ["union", "incarceration", "tenant", "racial justice", "test"]
var infoWindow;
var map;
var bounds;
var jsonURL = 'https://jcurrrrr.github.io/res/stores.json';
var markers = [];
var currcircle;
var loclatlng;
var currrad = 40000;
var currzip;


// Dynamically build category selectors
$(document).ready(function(){
   var i;
   for (i = 0; i < catlist.length; i++) {
      var $input = $("<input id ='"+ catlist[i] +"' type='checkbox'>" + catlist[i] + "<br>");
      $('#checkholder').append($input);
   }
});

async function initMap() {
   // Create the map.
   map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: 42.360, lng: -71.0589},
   });

   const apiKey = 'AIzaSyBC9qoUkWr5lhVeqb8agYWE7Gx5zxTT66c';
   bounds = new google.maps.LatLngBounds();
   infoWindow = new google.maps.InfoWindow();

   // Try geolocation. If successful, use users location as center of search
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
         pos = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
         };
         

         //TODO: Make point not infowindow
         var icon = {
            url:'https://www.localguidesconnect.com/t5/image/serverpage/image-id/165436i36DCE8AF5DF64A5A?v=1.0', 
            scaledSize: new google.maps.Size(20, 20)
         };
         var locmark = new google.maps.Marker({
            position: pos,
            map: map
         });
         locmark.setIcon(icon);
         loclatlng = new google.maps.LatLng(pos);
         addPoints('00000', currrad);
      }, () => {
      
      });
   }
}

function addPoints(zipcode, radius) {
   // Determine which catagories are selected
   var selectedcats = [];
   $('#checkholder').children('input').each(function () {
      if (this.checked) { 
         selectedcats.push(this.id);
      }
   });

   var geocoder = new google.maps.Geocoder();
   var address = zipcode;
   geocoder.geocode({ 'address': 'zipcode ' + address, componentRestrictions: {country: "US" }}, function (results, status) {
      // Determines whethere to use zip code as center or user latlng
      var center;
      if (loclatlng) {
         center = loclatlng;
      } else {
         if (status == google.maps.GeocoderStatus.OK) {
            var ziploc = [];
            ziploc[0] = results[0].geometry.location.lat();
            ziploc[1] = results[0].geometry.location.lng();

         } else {
               alert("Request failed. Make sure you enter a US postal code");
         }
         center = new google.maps.LatLng(ziploc[0], ziploc[1]);
      }

      map.setCenter(center);

      currcircle = new google.maps.Circle({
         strokeColor: "#FF0000",
         strokeOpacity: 0.6,
         strokeWeight: 2,
         fillColor: "#FF0000",
         fillOpacity: 0.2,
         map,
         center: center,
         radius: radius,
      });

      map.fitBounds(currcircle.getBounds());
      
      // Pulls JSON, adds each marker within radius.
      $.getJSON(jsonURL, function(json) {
         var i;
         var found = false;
         
         for (i = 0; i < json.features.length; i++) {
            var currEntry = json.features[i].properties;
            var latlng = new google.maps.LatLng(currEntry.coordinates[1], currEntry.coordinates[0]);
            var dist = google.maps.geometry.spherical.computeDistanceBetween(center, latlng);
            

            if (dist < radius) {
               var currcat = currEntry.category;

               // This is shit-- maybe make a random color picker w/ key at chackboxes?
               if (selectedcats.includes(currcat) || selectedcats.length == 0) {
                  var icon;
                  var marker = null;
                  if (currcat == "union") {
                     icon = { url : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' } 
                  } else if (currcat == "racial justice") {
                     icon = { url : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' } 
                  } else if (currcat == "tenant") { 
                     icon = { url : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' } 
                  } else {
                     icon = { url : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png' } 
                  }

                  var marker = new google.maps.Marker({
                     position: latlng,
                     map: map
                  });

                  marker.setIcon(icon)

                  markers.push(marker);
                  bindInfoWindow(marker, currEntry);
                  found = true;
               }
            }
         }
         if (!found) {
            alert('No results found. Broaden search.')
         }
      });
   });
}

function bindInfoWindow(marker, jsonEntry) {
   google.maps.event.addListener(marker, 'click', function () {
      const category = jsonEntry.category;
      const name = jsonEntry.name;
      const description = jsonEntry.description;
      const hours = jsonEntry.hours;
      const phone = jsonEntry.phone;
      const pos = new google.maps.LatLng(jsonEntry.coordinates[1], jsonEntry.coordinates[0]);
      const content = `
         <h2>${name}</h2><p>${description}</p>
         <p><b>Open:</b> ${hours}<br/><b>Phone:</b> ${phone}</p>
      `;

      infoWindow.setContent(content);
      infoWindow.setPosition(pos);
      infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
      infoWindow.open(map);
   });
}


function subSearch() {
   var mapCont = document.getElementById("mapCont");
   mapCont.style.visibility = 'visible';
   var navHeight = document.getElementsByClassName("navigation")[0].offsetHeight;
   console.log(navHeight);
   mapCont.style.top =( navHeight.toString() + 'px');
   
   if (zipcode = $('#zipsearch').val()) {
      currzip = zipcode;
      loclatlng = null;
   }
   if (radius = parseInt($('#radsearch').val())) {
      currrad = radius * 1609.34;
   }

   for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
   }
   markers = [];
   if (currcircle) {
      currcircle.setMap(null);
      currcircle = null;
   }
   addPoints(currzip, currrad);
   return false;
};
