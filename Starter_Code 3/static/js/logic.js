// store API endpoint
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
//perform GET request to URL
d3.json(url).then(function (data) {
    // send data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData, platesData) {
    // define function for each feature
    //give each feature a popup that describes the place/time of earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Number of "Felt" Reports: ${feature.properties.felt}`);  
    }
    //create GeoJSON layer containing features array on earthquakeData object
    function createCircleMarker(feature, latlng){
        let options = {
            radius: feature.properties.mag*5,
            fillColor: chooseColor(feature.properties.mag),
            color: chooseColor(feature.properties.mag),
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.35
        }
        return L.circleMarker(latlng, options);
    }
    //run the onEachFeature function once for each piece of data in array
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });
    //send earthquakes layer to createMap function
    createMap(earthquakes);
};

function createMap(earthquakes) {
    //create base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    //create baseMaps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
    //create overlay object to hold overlay
    let overlayMaps = {
        Earthquakes: earthquakes
    };
    //create map, giving it the streetmap and earthquales layers
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });
    // create layer control
    // pass it baseMaps and overlayMaps
    //add layer control to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // create legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        let depths = [0, 10, 30, 50, 70, 90];
        let colors = ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d", "#023858"];
      
        for (let i = 0; i < depths.length; i++) {
          let legendItem = document.createElement("div");
          legendItem.classList.add("legend-item");
      
          let legendColor = document.createElement("span");
          legendColor.classList.add("legend-color");
          legendColor.style.backgroundColor = colors[i];
          legendColor.style.display = "inline-block";
          legendColor.style.width = "20px";
          legendColor.style.height = "20px";
      
          let legendText = document.createElement("span");
          legendText.innerText = `${depths[i]} km ${depths[i + 1] ? "-" + depths[i + 1] + " km" : "+"}`;
      
          legendItem.appendChild(legendColor);
          legendItem.appendChild(legendText);
          div.appendChild(legendItem);
        }
      
        return div;
      };

        //add legend to  map
        legend.addTo(myMap)

        console.log(legend)
};
//function to determine color based one earthquakes
function chooseColor(depth) {
    if (depth <= 10) {
        return "#2A81CB";
    } else if (depth <= 30) {
        return "#2AAD27";
    } else if (depth <=50) {
        return "#FFD326";
    } else if (depth <= 70)  {
        return "#CB8427";
    }  else if (depth <= 90) {
        return "#CB2B3E";
    } else {
        return "#9C2BCB";
    }
}