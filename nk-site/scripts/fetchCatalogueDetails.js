window.addEventListener('load', () => {
    fetchLocations();
    fetchDigs();
    fetchArtefacts();
});


$(document).ready(function() {
    $('#artefact_id, #artefact_location_id, #artefact_dig_site_no').select2();
    console.log("Select2 initialised!"); // Debugging message
});

$(document).ready(function() {
    $('#storage_type').select2({
        dropdownParent: $('#location-popup') // Ensure it opens inside the popup
    });
});

$(document).ready(function() {
    $('#dig-submit').click(digSubmit);
    console.log("Dig Submit Initialised!");

    $('#location-submit').click(locationSubmit);
    console.log("Location Submit Initialised!");

    $('#artefact-submit').click(artefactSubmit);
    console.log("Artefact Submit Initialised!");
});


// Event listeners for dropdown selection
$(document).on('select2:select', '#artefact_id', function(){
    console.log("Artefact changed.");

    if ($('#artefact_id').val() === "0")
    {
        showArtefactPopup();
    }
    else
    {
        fetchArtefacts();
    }
});

$(document).on('select2:select', '#artefact_location_id', function(){
    console.log("Location changed.");
    showLocationPopup();
});

$(document).on('select2:select', '#artefact_dig_site_no', function(){
    console.log("Dig site changed.");
    showDigPopup();
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
    const locationSelect = $("#artefact_location_id");  // jQuery selector for select2

    if (locationSelect.length) {
        locationSelect.empty();  // Clear existing options

        // Add a blank placeholder option
        const placeholderOption = new Option("", "", true, true);
        locationSelect.append(placeholderOption);

        // Add the "Add New Location" option
        const addNewOption = new Option("Add New Location", "0", false, false);
        locationSelect.append(addNewOption);

        // Add location options
        locations.forEach(location => {
            const locationOption = new Option(location.location_id + " - " + location.location_type, location.location_id);
            locationSelect.append(locationOption);
        });

        locationSelect.trigger('change');  // Trigger select2 to update the dropdown
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
            console.log(digs);
            showDigs(digs);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function showDigs(digs) {
    const digSelect = $("#dig_site_no");  // jQuery selector for select2

    if (digSelect.length) {
        digSelect.empty();  // Clear existing options

        // Add a blank placeholder option
        const placeholderOption = new Option("", "", true, true);
        digSelect.append(placeholderOption);

        // Add the "Add New Dig" option
        const addNewOption = new Option("Add New Dig", "0", false, false);
        digSelect.append(addNewOption);

        // Add dig options
        digs.forEach(dig => {
            const digOption = new Option(dig.dig_site_no, dig.dig_site_no);
            digSelect.append(digOption);
        });

        digSelect.trigger('change');  // Trigger select2 to update the dropdown
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
    const artefactSelect = $("#artefact_id");  // jQuery selector for select2

    if (artefactSelect.length) {
        artefactSelect.empty();  // Clear existing options

        // Add a blank placeholder
        const placeholderOption = new Option("", "", true, true);
        artefactSelect.append(placeholderOption);

        // Add the "Add New Artefact" option
        const addNewOption = new Option("Add New Artefact", "add_new", false, false);
        artefactSelect.append(addNewOption);

        // Add artefact options
        artefacts.forEach(artefact => {
            const artefactOption = new Option(artefact.artefact_id, artefact.artefact_id);
            artefactSelect.append(artefactOption);
        });

        artefactSelect.trigger('change');  // Trigger select2 to update the dropdown
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

    $('#artefact_location_id').val() = artefact.artefact_location_id || "";
    $('#artefact_dig_site_no').val() = artefact.artefact_dig_site_no || "";
}



// Popups
// Functions to show popups
function showLocationPopup() {
    let locationInput = $("#artefact_location_id");
    if (locationInput && locationInput.val() === "0") {
        closeAllPopups();
        document.getElementById("location-popup").style.display = "block";
    }
}

function showDigPopup() {
    let digSiteInput = $("#artefact_dig_site_no");
    if (digSiteInput && digSiteInput.val() === "0") {
        closeAllPopups();
        document.getElementById("dig-popup").style.display = "block";
    }
}

function showArtefactPopup() {
    let artefactInput = $("#artefact_id");
    if (artefactInput && artefactInput.val() === "0") {
        closeAllPopups();
        document.getElementById("artefact-popup").style.display = "block";
    }
}

// Function to close all popups
function closeAllPopups() {
    document.querySelectorAll(".popup-form").forEach(popup => {
        popup.style.display = "none";
    });
}

// Close popups when clicking outside
document.addEventListener("click", function(event) {
    let isPopup = event.target.closest(".popup-form");
    if (!isPopup) {
        closeAllPopups();
    }
});

// Popup Submits

// Dig Submit
async function digSubmit() {
    const dig_site_no = document.getElementById("new_dig_site_no").value;
    const dig_town = document.getElementById("dig_town").value;
    const dig_county = document.getElementById("dig_county").value;

    if (dig_site_no === null || dig_town === null || dig_county === null)
    {
        alert("Please fill in all fields.");
        return;
    }
    else 
    {
        try {
            const response = await fetch("https://20.108.25.134/NorthernKindoms/nk-webservice/addDig.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ digSiteNO: dig_site_no, digTown: dig_town, digCounty: dig_county}),
            });

            if (response.status === 401) {
                // Redirect to login if unauthorized
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
            console.error("Error", error);
        }

    }
}   


// Location Submit
async function locationSubmit() {
    const location_type = $("#location_type").val();
    console.log(location_type);

    if (location_type === null)
    {
        alert("Please fill in all fields.");
        return;
    }
    else 
    {
        try {
            const response = await fetch("https://20.108.25.134/NorthernKindoms/nk-webservice/addLocation.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ locationType: location_type}),
            });

            if (response.status === 401) {
                // Redirect to login if unauthorized
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
        } else {
            alert("Artefact ID already exists.");
        }
    } else {
        alert("Enter an Artefact ID.");
    }
}



