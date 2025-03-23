let search = "";

window.addEventListener('load', fetchArtefacts);

document.getElementById('search-button').addEventListener('click', function(){
    search = document.getElementById('searchbar').value;
    fetchArtefacts();
});

async function fetchArtefacts() {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/artefactSearch.php?search=" + search);
        if (!response.ok) throw new Error(`Error fetching artefacts: ${response.status}`);

        const artefacts = await response.json();
        if (!artefacts || artefacts.Error) throw new Error(artefacts.Error || "Invalid response data");

        writeArtefacts(artefacts);
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}


function writeArtefacts(artefacts) {
    document.getElementById('artefacts-container');

    // Create artefact
    for (const artefact of artefacts) {
        const artefactDiv = document.createElement('div');
        artefactDiv.classList.add('artefact');

        const img = document.createElement('img');
        img.src = artefact.artefact_image;

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('detailsDiv');

        const artefactPair = document.createElement('div');
        artefactPair.classList('cataloguing-pairing');
        
        const digPair = document.createElement('div');
        digPair.classList('cataloguing-pairing');

        const artefactHeading = document.createElement('div');
        artefactHeading.innerText('Artefact ID:');
        artefactHeading.classList('artefact-heading');

        const artefactID = document.createElement('div');
        artefactID.classList.add('artefactID');
        artefactID.id(artefact.artefact_id);

        const digHeading = document.createElement('div');
        digHeading.innerText('Dig Site:');
        digHeading.innerHTML('artefact-heading');

        const digSiteNo = document.createElement('div');
        artefactID.classList.add('digSiteNo');
        artefactID.id(artefact.artefact_dig_site_no);

        // Append children
        artefactDiv.appendChild(img);
        artefactDiv.appendChild(detailsDiv);

        detailsDiv.appendChild(artefactPair);
        detailsDiv.appendChild(digPair);

        artefactPair.appendChild(artefactHeading);
        artefactPair.appendChild(artefactID);
        
        digPair.appendChild(digHeading);
        digPair.appendChild(digSiteNo);
        
        
    }
}