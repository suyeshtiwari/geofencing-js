const map = L.map('mapid').setView([37.8, -96], 4); // Center of the US

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Object to keep track of selected states
const selectedStates = {};

// Load GeoJSON from an external file
$.getJSON("us-states.json", function(geoJsonData) {
    $("#selected-account").val("account1");
    $.ajax({
        type: 'GET',
        url: 'https://mocki.io/v1/58d26a31-df69-4909-9d23-b5a29bdd9e3c',
        success: function (data) {
            console.log(data);
            // Populate account dropdown
            const accountList = data.map(account => `<option value="${account.accountId}">${account.accountName}</option>`);
            $('#selected-account').append(accountList);
        }
    });
    if ($.isEmptyObject(selectedStates)) {
        $('#submit').prop('disabled', true);
    }
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
                if ($.isEmptyObject(selectedStates)) {
                    $('#submit').prop('disabled', true);
                } else {
                    $('#submit').prop('disabled', false);
                }
            });
        }
    }).addTo(map);
});

function updateSidebar() {
    const sidebar = document.getElementById('selected-states');
    sidebar.innerHTML = '';
    for (const state in selectedStates) {
        sidebar.innerHTML += `<div class="state-name">${state}</div>`;
    }
}
function submit () {
    const account = $('#selected-account').val();
    $.ajax({
        type: 'POST',
        url: 'https://api.example.com/submit',
        data: {
            data: JSON.stringify({account, selectedStates})
        },
        success: function (data) {
            console.log(data);
        }
    })
};

$('#selected-account').on('change', function () {
    const account = $(this).val();
    console.log(account);
});