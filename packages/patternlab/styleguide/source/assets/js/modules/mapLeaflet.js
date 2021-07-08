import getTemplate from "../helpers/getHandlebarTemplate.js";
// import * as L from 'leaflet/dist/leaflet-src.js'; // safari bug exists in this version https://github.com/Leaflet/Leaflet/issues/7255
import * as L from '../vendor/leaflet-src.js'; // wait for the bug fix to get into a released version to remove this local JS file and import from the leaflet package

export default (function (window,document) {
  // Only run this code if there is a leaflet map component on the page.
  if(!document.querySelectorAll('.js-leaflet-map').length){
    return;
  }

  // Initialize the map
  function initMaps (el, i) {
    // Timestamp for testing purposes
    console.log(new Date().toLocaleTimeString())

    const mapWrapper = el;

    const compiledTemplate = getTemplate('mapMarkerInfo');

    // Get the maps data (this could be replaced with an api)
    const { map, markers, isStatic=0, hideAttribution=0 } = ma.leafletMapData[i]; // Data object created in @molecules/leaflet-map.twig

    // max bounds
    // const corner1 = L.latLng(43.12916191721289, -67.40279674530031); //northEast
    // const corner2 = L.latLng(41.09188542307055, -76.28524303436281); //southWest
    // const maxBounds = L.latLngBounds(corner1, corner2);

    const mymap = L
      .map(mapWrapper, {
        center: [map.center.lat, map.center.lng],
        zoom: map.zoom || 0,
        zoomControl: false,
        minZoom: 8,
        scrollWheelZoom: false,
        dragging: false
        // maxBounds is disabled due to unexpected shifting when popups are hitting the boundaries.
        // This can be turned back on when the tiles are large enough so that the min zoom level shows the whole state and have enough tiles padded for popups.
        // maxBounds, 
      });
      
    // if map is not static, add zoom control with custom position
    if (!isStatic) {
      L.control.zoom({
          position: 'bottomleft'
      })
      .addTo(mymap);
    }

    // add tile layer image to map
    L
    .tileLayer('https://tiles.arcgis.com/tiles/hGdibHYSPO59RG1h/arcgis/rest/services/MassGISBasemap/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Source: <a href ="https://www.mass.gov/service-details/about-massgis">MassGIS</a>'
    })
    .addTo(mymap);

    if (hideAttribution) {
      mapWrapper.querySelector('.leaflet-control-attribution').style.display = 'none';
    }
    
    // if zoom is not specified, set map bounds automatically by markers
    if (!map.zoom) {
      // set bounds by markers
      const markerArray = markers.map((marker) => [marker.position.lat, marker.position.lng]); // Array of [lat, lng] coordinates to be used as bounds in fitBounds()
      function setMapBounds() {
        mymap.fitBounds(markerArray, {
          padding: [60, 60]
        })
      }
      setMapBounds();

      // Store the window width
      let windowWidth = window.innerWidth
      // Resize Event
      window.addEventListener("resize", function() {
          // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
          if (window.innerWidth != windowWidth) {
              // Update the window width for next time
              windowWidth = window.innerWidth
              window.addEventListener('resize', setMapBounds);
          }
      })
    }

    // custom marker icon 
    var markerIcon = L.icon({
      iconUrl: `${ma.iconPath}/marker-blue.svg`,

      iconSize: [50, 50],
      iconAnchor: [25, 50], 
      /* The coordinates of the "tip" of the icon (relative to its top left corner). The icon will be aligned so that this point is at the marker's geographical location. Centered by default if size is specified, also can be set in CSS with negative margins.
        see leaflet docs: https://leafletjs.com/reference-1.7.1.html#icon-iconanchor
      */
      popupAnchor: [0, -50],
      shadowUrl: ''
    });

    // add markers to map 
    markers.forEach(({ position, infoWindow}) => {
      const mymarker = L.marker(
        L.latLng(
          +position.lat,
          +position.lng
        ), {
          icon: markerIcon,
          interactive: !isStatic
        })
      .addTo(mymap)
      .bindPopup(compiledTemplate(infoWindow));

      if (!isStatic) {
        // popup close onclick is not recognized as a click event inside of the map in order to regain focus
        // Fire the map focus callback on popup close
        mymarker.on('popupclose', function() {
          mymap.fire('focus');
        });
      }
    })


    // disable map interactions if is static 
    if (isStatic) {
      mymap.touchZoom.disable();
      mymap.doubleClickZoom.disable();
      mymap.boxZoom.disable();
      mymap.keyboard.disable();
      if (mymap.tap) mymap.tap.disable();
      mapWrapper.style.cursor='default';
    } else {
      let locked = true;
      const containerID = `map${i}_lockStatus`;
      const setStatusText = (status) => status ? 'Click or tap INSIDE map to move the map' : 'Click or tap OUTSIDE map to scroll the page';
      const customControl =  L.Control.extend({
        options: {
          position: 'topleft'
        }, 
        onAdd: function (map) {
          var container = L.DomUtil.create('div', 'leaflet-control-attribution');
          container.id=containerID;
          container.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';   
          container.style.padding = '3px';
          container.innerHTML = setStatusText(locked)
      
          return container;
        }
      });

      mymap.addControl(new customControl());

      const disablePageScroll = () => {
        // Get the current page scroll position
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  
        // if any scroll is attempted, set this to the previous value
        window.onscroll = function() {
            window.scrollTo(scrollLeft, scrollTop);
        };
      }
      
      const enablePageScroll = () => {
          window.onscroll = function() {};
      }
      
      const container = L.DomUtil.get(containerID);

      const unlockMove = () => {
        const target = document.activeElement;
        console.log(target, 'unlock')
        locked = false;
        container.innerHTML = setStatusText(locked);
        //mymap.scrollWheelZoom.enable(); 
        mymap.dragging.enable();
      }

      const lockMove = (target) => {
        console.log(target, 'lock')
        locked = true;
        container.innerHTML = setStatusText(locked);
        mymap.scrollWheelZoom.disable(); 
        mymap.dragging.disable();
      }
      /* Prevent scolling/swiping ambiguity
      ** Only enable scroll zoom and pane if map is in focus, and disable after user click outside of the map */
      mymap.on('focus', unlockMove);

      // Markers and popup are not recognized as part of the map object on events, hence needs custom events to simulate onblur on the map and its children elements.
      const customBlur = (target) => {
        const inMap = mapWrapper.contains(target)
        if (!inMap) {
          lockMove(target);
        }
      }

      document.onclick = (e) => {
        const { target } = e;
        customBlur(target)
      };

      document.onkeyup = (e) => {
        if (e.key == 'Tab') {
          console.log('on tab blur')
          const target = document.activeElement;
          customBlur(target)
        }
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll(".js-leaflet-map").forEach(function(el, i) {
      initMaps(el, i);
    })
  })

})(window,document);
