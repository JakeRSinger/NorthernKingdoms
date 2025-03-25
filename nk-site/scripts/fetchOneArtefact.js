window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    artefactID = params.get("artefactSelected");
     
    artefactSelection(artefactID);
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

    $("#artefact_date_found").innerText = (artefact.artefact_date_found || "");
    $("#artefact_broad_subperiod").innerText = (artefact.artefact_broad_subperiod || "");
    $("#artefact_date_earliest").innerText = (artefact.artefact_date_earliest || "");
    $("#artefact_date_latest").innerText = (artefact.artefact_date_latest || "");
    $("#artefact_weight").innerText = (artefact.artefact_weight || "");
    $("#artefact_height").innerText = (artefact.artefact_height || "");
    $("#artefact_length").innerText = (artefact.artefact_length || "");
    $("#artefact_breadth").innerText = (artefact.artefact_breadth || "");
    $("#artefact_classification").innerText = (artefact.artefact_classification || "");
    $("#artefact_functional_group").innerText = (artefact.artefact_functional_group || "");
    $("#artefact_material").innerText = (artefact.artefact_material || "");
    $("#artefact_decorative_style").innerText = (artefact.artefact_decorative_style || "");
    $("#artefact_desc").innerText = (artefact.artefact_desc || "");
    $('#artefact_location_id').innerText = (artefact.artefact_location_id || "");
    $('#artefact_dig_site_no').innerText = (artefact.artefact_dig_site_no || "");
    $('#artefact_image').attr('src', artefact.artefact_image || "https://20.108.25.134/NorthernKingdoms/nk-site/img/nk-logo.jpeg");

}