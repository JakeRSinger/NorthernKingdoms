document.addEventListener('DOMContentLoaded', function () {
    let search = "";

    window.addEventListener('load', fetchArtefacts);

    document.getElementById('search-button').addEventListener('click', function () {
        search = document.getElementById('searchbar').value;
        fetchArtefacts();
    });

    async function fetchArtefacts() {
        try {
            const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/artefactSearch.php?search=" + encodeURIComponent(search));
            if (!response.ok) throw new Error(`Error fetching artefacts: ${response.status}`);

            const artefacts = await response.json();
            if (!artefacts || artefacts.error) throw new Error(artefacts.error || "Invalid response data");

            writeArtefacts(artefacts);
        } catch (error) {
            console.error("Fetch error:", error.message);
        }
    }

    function writeArtefacts(artefacts) {
        const container = document.getElementById('artefacts-container');
        container.innerHTML = ""; // Clear previous results

        for (const artefact of artefacts) {
            const artefactDiv = document.createElement('div');
            artefactDiv.classList.add('artefactDiv');

            // Event listener for details page
            artefactDiv.addEventListener('click', function(){
                console.log("Clicked: " + artefact.artefact_id);
                window.location.replace("https://20.108.25.134/NorthernKingdoms/nk-site/artefactDetails.html?artefactSelected=" + artefact.artefact_id);
            });

            var imageSource = !artefact.artefact_image ? "img/nk-logo.jpeg" : artefact.artefact_image;

            const img = document.createElement('img');
            img.src = imageSource;
            img.alt = "Artefact Image";

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('detailsDiv');

            const artefactPair = document.createElement('div');
            artefactPair.classList.add('artefact-pairing');

            const digPair = document.createElement('div');
            digPair.classList.add('artefact-pairing');

            const artefactHeading = document.createElement('div');
            artefactHeading.innerText = 'Artefact ID:';
            artefactHeading.classList.add('artefact-heading');

            const artefactID = document.createElement('div');
            artefactID.classList.add('artefactID');
            artefactID.id = `artefact-${artefact.artefact_id}`;
            artefactID.innerText = artefact.artefact_id;

            const digHeading = document.createElement('div');
            digHeading.innerText = 'Dig Site:';
            digHeading.classList.add('artefact-heading');

            const digSiteNo = document.createElement('div');
            digSiteNo.classList.add('digSiteNo');
            digSiteNo.id = `dig-${artefact.artefact_dig_site_no}`;
            digSiteNo.innerText = artefact.artefact_dig_site_no;

            // Append elements
            artefactDiv.appendChild(img);
            artefactDiv.appendChild(detailsDiv);

            detailsDiv.appendChild(artefactPair);
            detailsDiv.appendChild(digPair);

            artefactPair.appendChild(artefactHeading);
            artefactPair.appendChild(artefactID);

            digPair.appendChild(digHeading);
            digPair.appendChild(digSiteNo);

            // Append artefactDiv to the container
            container.appendChild(artefactDiv);
        }
    }



});

