window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    params.get("artefactSelected");
     
    artefactSelection(params);
});

async function artefactSelection(artefactID) {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/artefact.php?artefactSelected=" + encodeURIComponent(artefactID));
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

    $("#artefact_date_found").innertext = (artefact.artefact_date_found || "");
    $("#artefact_broad_subperiod").innertext = (artefact.artefact_broad_subperiod || "");
    $("#artefact_date_earliest").innertext = (artefact.artefact_date_earliest || "");
    $("#artefact_date_latest").innertext = (artefact.artefact_date_latest || "");
    $("#artefact_weight").innertext = (artefact.artefact_weight || "");
    $("#artefact_height").innertext = (artefact.artefact_height || "");
    $("#artefact_length").innertext = (artefact.artefact_length || "");
    $("#artefact_breadth").innertext = (artefact.artefact_breadth || "");
    $("#artefact_classification").innertext = (artefact.artefact_classification || "");
    $("#artefact_functional_group").innertext = (artefact.artefact_functional_group || "");
    $("#artefact_material").innertext = (artefact.artefact_material || "");
    $("#artefact_decorative_style").innertext = (artefact.artefact_decorative_style || "");
    $("#artefact_desc").innertext = (artefact.artefact_desc || "");
    $('#artefact_location_id').innertext = (artefact.artefact_location_id || "");
    $('#artefact_dig_site_no').innertext = (artefact.artefact_dig_site_no || "");
    $('#artefact_image').src = (artefact.artefact_image || "https://20.108.25.134/NorthernKingdoms/nk-site/img/nk-logo.jpeg");
}