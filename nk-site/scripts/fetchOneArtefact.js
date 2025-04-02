window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    const artefactID = params.get("artefactSelected");

    if (!artefactID) {
        console.error("No artefact ID found in URL.");
        return;
    }

    artefactSelection(artefactID);
});


async function artefactSelection(artefactID) {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/artefacts.php?artefactSelected=" + encodeURIComponent(artefactID));

        if (response.status === 401) {
            // Redirect to login if unauthorised
            window.location.href = "https://20.108.25.134/NorthernKingdoms/nk-site/login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(`Error fetching artefacts: ${response.status}`);
        }

        const artefacts = await response.json();
        if (!artefacts || artefacts.error) throw new Error(artefacts.error || "Invalid response data");

        writeArtefacts(artefacts[0]);
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

function writeArtefacts(artefact) {
    if (!artefact) return;

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.innerText = value || "N/A";
    };

    setText("artefact_date_found", artefact.artefact_date_found);
    setText("artefact_broad_subperiod", artefact.artefact_broad_subperiod);
    setText("artefact_date_earliest", artefact.artefact_date_earliest);
    setText("artefact_date_latest", artefact.artefact_date_latest);
    setText("artefact_weight", artefact.artefact_weight);
    setText("artefact_height", artefact.artefact_height);
    setText("artefact_length", artefact.artefact_length);
    setText("artefact_breadth", artefact.artefact_breadth);
    setText("artefact_classification", artefact.artefact_classification);
    setText("artefact_functional_group", artefact.artefact_functional_group);
    setText("artefact_material", artefact.artefact_material);
    setText("artefact_decorative_style", artefact.artefact_decorative_style);
    setText("artefact_desc", artefact.artefact_desc);
    setText("artefact_id", artefact.artefact_id);
    setText("artefact_location_id", artefact.artefact_location_id);
    setText("artefact_dig_site_no", artefact.artefact_dig_site_no);

    // Set image
    const imgElement = document.getElementById("artefact_image");
    if (imgElement) {
        imgElement.src = artefact.artefact_image || "https://20.108.25.134/NorthernKingdoms/nk-site/img/nk-logo.jpeg";
        imgElement.alt = "Artefact Image";
    }
}
