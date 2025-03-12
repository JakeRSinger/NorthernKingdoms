window.addEventListener('load', fetchLocations);

async function fetchLocations() {
    try {
        // Fetch locations
        const response = await fetch("https://20.108.25.134/nk-webservice/locations.php");
        
        if (!response.ok) {
            throw new Error(`Error fetching locations: ${response.status}`);
        }

        const locations = await response.json();

        if (locations.Error) {
            console.error("Error in response:", locations.Error);
        } else {
            showLocations(locations);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function showLocations(locations) {
    const locationSelect = document.getElementById("artefact_location_id");

    if (locationSelect) {

        locations.forEach(location => {
            const locationOption = document.createElement('option');
            locationOption.innerText = location.location_id;
            locationOption.value = location.location_id;
            locationSelect.appendChild(locationOption);
        });
    }
}
