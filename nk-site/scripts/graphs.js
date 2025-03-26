window.addEventListener('load', function() {
    fetchDigArtefacts();
});

async function fetchDigArtefacts() {
    try {
        const response = await fetch("https://20.108.25.134/NorthernKingdoms/nk-webservice/digArtefact.php");

        if (response.status === 401) {
            // Redirect to login if unauthorised
            window.location.href = "https://20.108.25.134/NorthernKingdoms/nk-site/login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(`Error fetching artefacts: ${response.status}`);
        }

        const artefacts = await response.json();
        if (!Array.isArray(artefacts) || artefacts.length === 0) {
            throw new Error("Invalid response data");
        }

        writeDigArtefacts(artefacts);
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

function writeDigArtefacts(artefacts) {
    console.log("Artefacts data received:", artefacts);

    const xArray = artefacts.map(a => a.artefact_dig_site_no);
    const yArray = artefacts.map(a => a.count);

    const data = [{ labels: xArray, values: yArray, type: "pie" }];
    
    const layout = {
        title: {
            text: "Artefacts From Each Dig", 
            font: {
                family: "Epilogue, sans-serif",
                color: "var(--primary-heading-colour)"
            }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    console.log("Plotting data...");
    Plotly.newPlot("dig-artefacts", data, layout);
}

