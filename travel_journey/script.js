/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    const itineraryData = getTestData(); // Fetch test data
    renderItinerary(itineraryData);
    initializeMap(itineraryData);
});

/**
 * Function to render the itinerary
 * @param {Array} data - Array of cruise days
 */
function renderItinerary(data) {
    const container = document.getElementById('itinerary-container');

    data.forEach((day, index) => {
        const item = document.createElement('div');
        item.className = 'itinerary-item';
        item.setAttribute('data-index', index); // For synchronization

        // Header
        const header = document.createElement('div');
        header.className = 'itinerary-header';

        const icon = document.createElement('img');
        icon.src = day.icon;
        icon.alt = day.title;

        const title = document.createElement('h2');
        title.textContent = day.title;

        header.appendChild(icon);
        header.appendChild(title);

        // Body
        const body = document.createElement('div');
        body.className = 'itinerary-body';

        const date = document.createElement('p');
        date.innerHTML = `<strong>Datum:</strong> ${day.date}`;

        const description = document.createElement('p');
        description.innerHTML = `<strong>Aktivitäten:</strong> ${day.description}`;

        body.appendChild(date);
        body.appendChild(description);

        item.appendChild(header);
        item.appendChild(body);

        // Add click event to focus on the map marker
        item.addEventListener('click', () => {
            focusOnMarker(index);
        });

        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', day.title);
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                focusOnMarker(index);
            }
        });

        container.appendChild(item);
    });
}

let map; // Leaflet map instance
let markers = []; // Array to store markers

/**
 * Function to initialize the map and add markers
 * @param {Array} data - Array of cruise days
 */
function initializeMap(data) {
    // Initialize the map centered at the first location
    // Swap [lng, lat] to [lat, lng] for Leaflet
    const initialCoordinates = [data[0].coordinates[1], data[0].coordinates[0]] || [51.2194, 4.4025]; // [lat, lng]
    map = L.map('map').setView(initialCoordinates, 6); // Zoom level adjusted for European river

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom Icons
    const portIcon = L.icon({
        iconUrl: 'images/beach.png', // Local port icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const busIcon = L.icon({
        iconUrl: 'images/bus.png', // Local bus icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    // Add markers for each day
    data.forEach((day, index) => {
        if (day.coordinates) { // All days have coordinates now
            let icon;
            if (day.type === 'departure' || day.type === 'return') {
                icon = busIcon;
            } else {
                icon = portIcon;
            }

            // Swap coordinates from [lng, lat] to [lat, lng] for Leaflet
            const markerCoordinates = [day.coordinates[1], day.coordinates[0]];

            const marker = L.marker(markerCoordinates, { icon: icon })
                .addTo(map)
                .bindPopup(`<strong>${day.title}</strong><br>${day.date}`);

            // Store marker with reference to itinerary item index
            markers[index] = marker;

            // Event listener for marker click to highlight itinerary item
            marker.on('click', () => {
                highlightItineraryItem(index);
            });

            // Add tooltip for quick information
            marker.bindTooltip(`${day.title}`, {
                permanent: false,
                direction: 'top'
            });
        }
    });

    // Draw cruise route with arrows using GeoJSON data
    drawCruiseRouteWithPolyLineDecorator();
}

/**
 * Function to draw the cruise route on the map using GeoJSON data with arrows
 */
function drawCruiseRouteWithPolyLineDecorator() {
    // Path to the GeoJSON file
    const geojsonPath = 'data/rhine.geojson';

    fetch(geojsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Add the GeoJSON data to the map
            const riverPath = L.geoJSON(data, {
                style: {
                    color: '#0077be',
                    weight: 4,
                    opacity: 0.7
                }
            }).addTo(map);

            // Add arrowheads to the river path using PolylineDecorator
            const decorator = L.polylineDecorator(riverPath, {
                patterns: [
                    {
                        offset: '0%',
                        repeat: '25%',
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 10,
                            polygon: false,
                            pathOptions: { stroke: true, color: '#0077be' }
                        })
                    }
                ]
            }).addTo(map);

            // Fit the map to the river path bounds
            map.fitBounds(riverPath.getBounds().pad(0.5));
        })
        .catch(error => {
            console.error('Fehler beim Laden der GeoJSON-Daten:', error);
        });
}

/**
 * Function to focus the map on a specific marker
 * @param {number} index - Index of the itinerary item
 */
function focusOnMarker(index) {
    const marker = markers[index];
    if (marker) {
        map.setView(marker.getLatLng(), 12, { animate: true }); // Zoom level adjusted for city view
        marker.openPopup();
    } else {
        console.warn(`Kein Marker für Index: ${index} gefunden.`);
    }
}

/**
 * Function to highlight a specific itinerary item
 * @param {number} index - Index of the itinerary item
 */
function highlightItineraryItem(index) {
    const container = document.getElementById('itinerary-container');
    const items = container.getElementsByClassName('itinerary-item');

    // Remove existing highlights
    Array.from(items).forEach(item => {
        item.style.borderLeft = '5px solid transparent';
        item.style.backgroundColor = '#fff';
    });

    // Highlight the selected item
    const selectedItem = items[index];
    if (selectedItem) {
        selectedItem.style.borderLeft = '5px solid #0077be';
        selectedItem.style.backgroundColor = '#e6f2ff';
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Function to get test data for the river cruise
 * @returns {Array} - Array of cruise day objects with coordinates
 */
function getTestData() {
    return [
        {
            title: "Tag 1: Abfahrt nach Antwerpen",
            date: "2024-07-01",
            description: "Busfahrt nach Antwerpen und Einschiffung auf die VIVA MOMENTS.",
            icon: "images/bus.png", // Local bus icon
            coordinates: [4.4025, 51.2194], // Antwerpen, Belgium (Longitude, Latitude)
            type: "departure"
        },
        {
            title: "Tag 2: Ankunft in Nijmegen",
            date: "2024-07-02",
            description: "Besuch in Nijmegen von 09:00 bis 13:00.",
            icon: "images/beach.png", // Local port icon
            coordinates: [5.8372, 51.8126], // Nijmegen, Netherlands
            type: "port"
        },
        {
            title: "Tag 3: Ankunft in Köln",
            date: "2024-07-03",
            description: "Besuch in Köln von 06:30 bis 15:30.",
            icon: "images/beach.png",
            coordinates: [6.9603, 50.9375], // Köln, Germany
            type: "port"
        },
        {
            title: "Tag 3: Ankunft in Düsseldorf",
            date: "2024-07-03",
            description: "Besuch in Düsseldorf von 12:30 bis 21:00.",
            icon: "images/beach.png",
            coordinates: [6.7735, 51.2277], // Düsseldorf, Germany
            type: "port"
        },
        {
            title: "Tag 4: Ankunft in Dordrecht",
            date: "2024-07-04",
            description: "Besuch in Dordrecht von 12:00 bis 18:00.",
            icon: "images/beach.png",
            coordinates: [4.6695, 51.8051], // Dordrecht, Netherlands
            type: "port"
        },
        {
            title: "Tag 5: Rückkehr nach Antwerpen",
            date: "2024-07-05",
            description: "Ausschiffung nach dem Frühstück und Busfahrt nach Luxemburg.",
            icon: "images/bus.png",
            coordinates: [4.4025, 51.2194], // Antwerpen, Belgium
            type: "return"
        }
    ];
}
