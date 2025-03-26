window.addEventListener('load', function(){
    fetchDigArtefacts();
});

async function fetchDigArtefacts() {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/digArtefact.php");
        if (!response.ok) throw new Error(`Error fetching artefacts: ${response.status}`);

        if (response.status === 401) {
            // Redirect to login if unauthorised
            window.location.href = "https://20.108.25.134/NorthernKingdoms/nk-site/login.html";
            return;
        }

        const artefacts = await response.json();
        if (!artefacts || artefacts.error) throw new Error(artefacts.error || "Invalid response data");

        writeDigArtefacts(artefacts);
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

function writeDigArtefacts(artefacts) {
    const xArray = [];
    const yArray = [];
    const layout = {title:"Artefacts From Each Dig"}
    const data = [{labels:xArray, values:yArray, type:"pie"}];

    for (const artefact in artefacts) {
        xArray.push(artefact.artefact_dig_site_no);
        yArray.push(artefact.count);
    }

    Plotly.newPlot("dig-artefacts", data, layout);
}