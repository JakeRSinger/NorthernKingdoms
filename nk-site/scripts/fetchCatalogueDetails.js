window.addEventListener('load', () => {
    fetchLocations();
    fetchDigs();
    fetchArtefacts();
});

$(document).ready(function() {
    // Initialize select2 for dropdowns
    $('#artefact_id, #artefact_location_id, #artefact_dig_site_no').select2();
    console.log("Select2 initialized!");

    $('#storage_type').select2({
        dropdownParent: $('#location-popup') // Ensures it opens inside the popup
    });

    // Attach event listeners to buttons
    $('#dig-submit').click(digSubmit);
    $('#location-submit').click(locationSubmit);
    $('#artefact-submit').click(artefactSubmit);
});

// Event Listeners for dropdown selection
$(document).on('select2:select', '#artefact_id', function() {
    if ($('#artefact_id').val() === "add_new") {
        showArtefactPopup();
    } else {
        fetchArtefacts();
    }
});

$(document).on('select2:select', '#artefact_location_id', function() {
    if ($('#artefact_location_id').val() === "0") {
        showLocationPopup();
    }
});

$(document).on('select2:select', '#artefact_dig_site_no', function() {
    if ($('#artefact_dig_site_no').val() === "0") {
        showDigPopup();
    }
});

// Fetch Locations from API
async function fetchLocations() {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/locations.php");

        if (response.status === 401) {
            // Redirect to login if unauthorised
            window.location.href = "https://20.108.25.134/NorthernKingdoms/nk-site/login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(`Error fetching artefacts: ${response.status}`);
        }

        const locations = await response.json();
        if (!locations || locations.Error) throw new Error(locations.Error || "Invalid response data");

        showLocations(locations);
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

// Populate Locations Dropdown
function showLocations(locations) {
    const locationSelect = $("#artefact_location_id").empty();
    locationSelect.append(new Option("", "", true, true));
    locationSelect.append(new Option("Add New Location", "0", false, false));

    locations.forEach(location => {
        locationSelect.append(new Option(`${location.location_id} - ${location.location_type}`, location.location_id));
    });

    locationSelect.trigger('change');
}

// Fetch Digs from API
async function fetchDigs() {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/digs.php");

        if (response.status === 401) {
            // Redirect to login if unauthorised
            window.location.href = "https://20.108.25.134/NorthernKingdoms/nk-site/login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(`Error fetching artefacts: ${response.status}`);
        }

        const digs = await response.json();
        if (!digs || digs.Error) throw new Error(digs.Error || "Invalid response data");

        showDigs(digs);
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

// Populate Digs Dropdown
function showDigs(digs) {
    const digSelect = $("#artefact_dig_site_no").empty();
    digSelect.append(new Option("", "", true, true));
    digSelect.append(new Option("Add New Dig", "0", false, false));

    digs.forEach(dig => {
        digSelect.append(new Option(dig.dig_site_no, dig.dig_site_no));
    });

    digSelect.trigger('change');
}

// Fetch Artefacts from API
var artefactsFetched = false;
async function fetchArtefacts() {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/artefacts.php");

        if (response.status === 401) {
            // Redirect to login if unauthorised
            window.location.href = "https://20.108.25.134/NorthernKingdoms/nk-site/login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(`Error fetching artefacts: ${response.status}`);
        }

        const artefacts = await response.json();
        if (!artefacts || artefacts.Error) throw new Error(artefacts.Error || "Invalid response data");

        if (!artefactsFetched) {
            artefactsFetched = true;
            showArtefacts(artefacts);
        } else {
            autofillArtefactDetails(artefacts);
        }
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

// Populate Artefacts Dropdown
function showArtefacts(artefacts) {
    const artefactSelect = $("#artefact_id").empty();
    artefactSelect.append(new Option("", "", true, true));
    artefactSelect.append(new Option("Add New Artefact", "add_new", false, false));

    artefacts.forEach(artefact => {
        artefactSelect.append(new Option(artefact.artefact_id, artefact.artefact_id));
    });

    artefactSelect.trigger('change');
}

// Autofill Artefact Details
function autofillArtefactDetails(artefacts) {
    const selectedArtefactID = $("#artefact_id").val();
    const artefact = artefacts.find(a => a.artefact_id == selectedArtefactID);

    if (!artefact) return;

    $("#artefact_date_found").val(artefact.artefact_date_found || "");
    $("#artefact_broad_subperiod").val(artefact.artefact_broad_subperiod || "");
    $("#artefact_date_earliest").val(artefact.artefact_date_earliest || "");
    $("#artefact_date_latest").val(artefact.artefact_date_latest || "");
    $("#artefact_weight").val(artefact.artefact_weight || "");
    $("#artefact_height").val(artefact.artefact_height || "");
    $("#artefact_length").val(artefact.artefact_length || "");
    $("#artefact_breadth").val(artefact.artefact_breadth || "");
    $("#artefact_classification").val(artefact.artefact_classification || "");
    $("#artefact_functional_group").val(artefact.artefact_functional_group || "");
    $("#artefact_material").val(artefact.artefact_material || "");
    $("#artefact_decorative_style").val(artefact.artefact_decorative_style || "");
    $("#artefact_desc").val(artefact.artefact_desc || "");

    $('#artefact_location_id').val(artefact.artefact_location_id || "").trigger('change');
    $('#artefact_dig_site_no').val(artefact.artefact_dig_site_no || "").trigger('change');
}

// Popup Handling
function showLocationPopup() {
    closeAllPopups();
    $("#location-popup").show();
}

function showDigPopup() {
    closeAllPopups();
    $("#dig-popup").show();
}

function showArtefactPopup() {
    closeAllPopups();
    $("#artefact-popup").show();
}

function closeAllPopups() {
    $(".popup-form").hide();
}

document.addEventListener("click", function(event) {
    if (!event.target.closest(".popup-form")) {
        closeAllPopups();
    }
});

// Popup Submits

// Dig Submit
async function digSubmit() {
    let dig_site_no = document.getElementById("new_dig_site_no").value.trim();
    let dig_town = document.getElementById("dig_town").value.trim();
    let dig_county = document.getElementById("dig_county").value.trim();

    // Check for empty values
    if (!dig_site_no || !dig_town || !dig_county) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/addDig.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                digSiteNo: dig_site_no, 
                digTown: dig_town, 
                digCounty: dig_county
            }),
        });

        if (response.status === 401) {
            window.location.href = "https://20.108.25.134/NorthernKingdoms/nk-site/login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response Data:", data);

        closeAllPopups();
        fetchDigs();
    }
    catch (error) {
        console.error("Error submitting dig site:", error);
        alert("An error occurred while submitting the dig site.");
    }
}



// Location Submit
async function locationSubmit() {
    let location_type = $("#location_type").val();
    console.log(location_type);

    if (location_type === null)
    {
        alert("Please fill in all fields.");
        return;
    }
    else 
    {
        try {
            const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/addLocation.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ locationType: location_type}),
            });

            if (response.status === 401) {
                // Redirect to login if unauthorised
                window.location.href = "https://20.108.25.134/NorthernKingdoms/nk-site/login.html";
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response Data:", data);

            closeAllPopups();
            fetchLocations();
        }
        catch (error) {
            console.error("Error", error);
        }

    }
}   

function artefactSubmit() {
    const artefact_id = $('#new_artefact_id').val().trim(); // Get the value and remove spaces

    if (artefact_id) { // Check if it's not empty
        const artefactSelect = $("#artefact_id");

        // Check if the artefact ID already exists in the dropdown
        if (artefactSelect.find(`option[value='${artefact_id}']`).length === 0) {
            const addNewID = new Option(artefact_id + " - (NEW)", artefact_id, false, true);
            artefactSelect.append(addNewID).trigger('change'); // Append and update Select2
            console.log(`Artefact ID ${artefact_id} added.`);

            closeAllPopups();
        } else {
            alert("Artefact ID already exists.");
        }
    } else {
        alert("Enter an Artefact ID.");
    }
}

