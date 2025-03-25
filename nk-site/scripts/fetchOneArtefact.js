window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    artefactID = params.get("artefactSelected");
     
    artefactSelection(artefactID);
});

async function artefactSelection(artefactID) {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/artefacts.php?artefactSelected=" + encodeURIComponent(artefactID));
        if (!response.ok) throw new Error(`Error fetching artefact: ${response.status}`);

        const artefacts = await response.json();
        if (!artefacts || artefacts.error) throw new Error(artefacts.error || "Ininnertext = id response data");

        writeArtefacts(artefacts);
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

function writeArtefacts(artefact) {
    if (!artefact) return;

    // Fill fields from database
    document.getElementById("artefact_date_found").innerText = artefact.artefact_date_found || "";
    document.getElementById("artefact_broad_subperiod").innerText = artefact.artefact_broad_subperiod || "";
    document.getElementById("artefact_date_earliest").innerText = artefact.artefact_date_earliest || "";
    document.getElementById("artefact_date_latest").innerText = artefact.artefact_date_latest || "";
    document.getElementById("artefact_weight").innerText = artefact.artefact_weight || "";
    document.getElementById("artefact_height").innerText = artefact.artefact_height || "";
    document.getElementById("artefact_length").innerText = artefact.artefact_length || "";
    document.getElementById("artefact_breadth").innerText = artefact.artefact_breadth || "";
    document.getElementById("artefact_classification").innerText = artefact.artefact_classification || "";
    document.getElementById("artefact_functional_group").innerText = artefact.artefact_functional_group || "";
    document.getElementById("artefact_material").innerText = artefact.artefact_material || "";
    document.getElementById("artefact_decorative_style").innerText = artefact.artefact_decorative_style || "";
    document.getElementById("artefact_desc").innerText = artefact.artefact_desc || "";
    document.getElementById("artefact_location_id").innerText = artefact.artefact_location_id || "";
    document.getElementById("artefact_dig_site_no").innerText = artefact.artefact_dig_site_no || "";

    // Set image source
    document.getElementById("artefact_image").src = artefact.artefact_image || "https://20.108.25.134/NorthernKingdoms/nk-site/img/nk-logo.jpeg";
}
