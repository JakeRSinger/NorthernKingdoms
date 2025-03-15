window.addEventListener('load', () => {
    fetchLocations();
    fetchDigs();
    fetchArtefacts();
});

// Fetch Locations
async function fetchLocations() {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/locations.php");

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

// Fetch Digs
async function fetchDigs() {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/digs.php");

        if (!response.ok) {
            throw new Error(`Error fetching digs: ${response.status}`);
        }

        const digs = await response.json();

        if (digs.Error) {
            console.error("Error in response:", digs.Error);
        } else {
            showDigs(digs);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function showDigs(digs) {
    const digSelect = document.getElementById("artefact_dig_site_no");

    if (digSelect) {
        digs.forEach(dig => {
            const digOption = document.createElement('option');
            digOption.innerText = dig.dig_site_no;
            digOption.value = dig.dig_site_no;
            digSelect.appendChild(digOption);
        });
    }
}

// Fetch Artefacts
var artefactsFetched = false;

async function fetchArtefacts() {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/artefacts.php");

        if (!response.ok) {
            throw new Error(`Error fetching artefacts: ${response.status}`);
        }

        const artefacts = await response.json();

        if (artefacts.Error) {
            console.error("Error in response:", artefacts.Error);
        } else if (!artefactsFetched) {
            artefactsFetched = true;
            showArtefacts(artefacts);
        } else {
            autofillArtefactDetails(artefacts);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function showArtefacts(artefacts) {
    const artefactSelect = document.getElementById("artefact_id");

    if (artefactSelect) {
        artefacts.forEach(artefact => {
            const artefactOption = document.createElement('option');
            artefactOption.innerText = artefact.artefact_id;
            artefactOption.value = artefact.artefact_id;
            artefactSelect.appendChild(artefactOption);
        });
    }
}

// Autofill details when an artefact is selected
function autofillArtefactDetails(artefacts) {
    const selectedArtefactID = document.getElementById("artefact_id").value;
    const artefact = artefacts.find(a => a.artefact_id == selectedArtefactID);

    if (!artefact) return; // Exit if artefact not found

    document.getElementById("artefact_date_found").value = artefact.artefact_date_found || "";
    document.getElementById("artefact_broad_subperiod").value = artefact.artefact_broad_subperiod || "";
    document.getElementById("artefact_date_earliest").value = artefact.artefact_date_earliest || "";
    document.getElementById("artefact_date_latest").value = artefact.artefact_date_latest || "";
    document.getElementById("artefact_weight").value = artefact.artefact_weight || "";
    document.getElementById("artefact_height").value = artefact.artefact_height || "";
    document.getElementById("artefact_length").value = artefact.artefact_length || "";
    document.getElementById("artefact_breadth").value = artefact.artefact_breadth || "";
    document.getElementById("artefact_classification").value = artefact.artefact_classification || "";
    document.getElementById("artefact_functional_group").value = artefact.artefact_functional_group || "";
    document.getElementById("artefact_material").value = artefact.artefact_material || "";
    document.getElementById("artefact_decorative_style").value = artefact.artefact_decorative_style || "";
    document.getElementById("artefact_desc").value = artefact.artefact_desc || "";
    document.getElementById("artefact_location_id").value = artefact.artefact_location_id || "";
    document.getElementById("artefact_dig_site_no").value = artefact.artefact_dig_site_no || "";
}

// Event listener for artefact location selection
document.getElementById("artefact_location_id").addEventListener('change', fetchArtefacts);
