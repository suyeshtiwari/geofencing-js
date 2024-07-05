const map = L.map('mapid').setView([37.8, -96], 4); // Center of the US

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Object to keep track of selected states
const selectedStates = {};

// Load GeoJSON from an external file
$.getJSON("us-states.json", function(geoJsonData) {
    L.geoJson(geoJsonData, {
        style: function (feature) {
            return {color: 'blue', weight: 2};
        },
        onEachFeature: function (feature, layer) {
            // Add state names on the map
            const bounds = layer.getBounds();
            const center = bounds.getCenter();
            L.marker(center, {
                icon: L.divIcon({
                    className: 'state-label',
                    html: feature.properties.name,
                    iconSize: [100, 40]
                })
            }).addTo(map);

            // Click handler for each state
            layer.on('click', function () {
                const stateName = feature.properties.name;
                // Toggle selection
                if (selectedStates[stateName]) {
                    delete selectedStates[stateName];
                    layer.setStyle({color: 'blue'});
                } else {
                    selectedStates[stateName] = true;
                    layer.setStyle({color: 'red'});
                }
                console.log(feature);
                updateSidebar();
            });
        }
    }).addTo(map);
});

function updateSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = 'Selected States:<br>';
    for (const state in selectedStates) {
        sidebar.innerHTML += `<div class="state-name">${state}</div>`;
    }
}
