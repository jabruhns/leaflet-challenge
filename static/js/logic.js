var query = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("map", {
    center: [40, -100],
    zoom: 4.75
})

var baseMap = L.tileLayer(MAPBOX_URL, {
    attribution: ATTRIBUTION,
    maxZoom: 10,
    id: "mapbox.streets",
    accessToken: API_KEY
})

baseMap.addTo(myMap)

function markers(response) {
    for (var i = 0; i < response.length; i++) {
        var coord = [response[i].geometry.coordinates[1], response[i].geometry.coordinates[0]]
        L.circle(coord, {
            radius: size(response[i].properties.mag),
            fillColor: color(response[i].properties.mag),
            fillOpacity: 0.75,
            weight: 0.75,
            color: "black"
        }).bindPopup(response[i].properties.place + " " + response[i].properties.mag).addTo(myMap)
    }
    legend()
}

function size(magnitude) {
    return magnitude * 12000
}

function color(magnitude) {
    if (magnitude < 1) {
        var color = "blue"
    } else if (magnitude < 2) {
        var color = "green"
    } else if (magnitude < 3) {
        var color = "greenyellow"
    } else if (magnitude < 4) {
        var color = "yellow"
    } else if (magnitude < 5) {
        var color = "orange"
    } else {
        var color = "red"
    }
    return color
}

function legend() {
    var legend = L.control({ position: "bottomright" })
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend")
        var ul = L.DomUtil.create("ul", "", div)
        var mags = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"]
        var color = ["blue", "green", "greenyellow", "yellow", "orange", "red"]
        for (var i = 0; i < mags.length; i++) {
            var list = L.domUtil.create("li", "", ul)
            list.innerHMTML = "<div class='container' style='background-color:" + color(i)
            "'></div>" + labels[i]
        }
        return div
    }
    legend.addTo(myMap)
}

d3.json(query, data => {
    markers(data.features)
})