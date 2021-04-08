import getTemplate from "../helpers/getHandlebarTemplate.js";
import * as L from 'leaflet/dist/leaflet-src.js';

export default (function (window,document,$) {
  // Only run this code if there is a leaflet map component on the page.
  if(!$('.js-leaflet-map').length){
    return;
  }
  console.log('render leaflet map!')

  // Initialize the map
  function initMaps () {

    const compiledTemplate = getTemplate('mapMarkerInfo');

    document.querySelectorAll(".js-leaflet-map").forEach(function(el, i) {
      
      // Get the maps data (this could be replaced with an api)
      const { map, markers, isStatic } = ma.leafletMapData && ma.leafletMapData[i]; // Data object created in @molecules/leaflet-map.twig



      const markerArray = markers.map((marker) => [marker.position.lat, marker.position.lng]) ;
      console.log(isStatic)

      let mymap = L
        .map(el, {
          center: [map.center.lat, map.center.lng],
          zoom: 0,
          zoomControl: !isStatic
        });
      
      mymap.fitBounds(markerArray, {
        padding: [50, 50]
      });

      if (isStatic) {
        mymap.dragging.disable();
        mymap.touchZoom.disable();
        mymap.doubleClickZoom.disable();
        mymap.scrollWheelZoom.disable();
        mymap.boxZoom.disable();
        mymap.keyboard.disable();
        if (mymap.tap) map.tap.disable();
        el.style.cursor='default';
      }


      

      L
        .tileLayer('https://tiles.arcgis.com/tiles/hGdibHYSPO59RG1h/arcgis/rest/services/MassGISBasemap/MapServer/tile/{z}/{y}/{x}', {
            attribution: '<a href ="https://www.mass.gov/service-details/about-massgis">MassGIS (Bureau of Geographic Information)</a>, Commonwealth of Massachusetts EOTSS'
        })
        .addTo(mymap);


      // custom marker icon 
      var markerIcon = L.icon({
        iconUrl: `${ma.iconPath}marker.svg`,
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: '',
        shadowSize: [0, 0],
        shadowAnchor: [22, 94]
    });

      markers.forEach(({ position, infoWindow}) => {
        L.marker(
          L.latLng(
            +position.lat,
            +position.lng
          ), {icon: markerIcon})
        .addTo(mymap)
        .bindPopup(compiledTemplate(infoWindow));
      })

    })
  }

  initMaps();

})(window,document,jQuery);
