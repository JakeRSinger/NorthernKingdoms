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
    const xArray = [];
    const yArray = [];

    for (const artefact of artefacts) {
        xArray.push(artefact.artefact_dig_site_no);
        yArray.push(artefact.count);
    }

    const data = [{ labels: xArray, values: yArray, type: "pie" }];
    const layout = { title: "Artefacts From Each Dig" };

    Plotly.newPlot('dig-artefacts', data, {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            family: 'Epilogue, sans-serif',
            color: 'var(--primary-heading-colour)'
        }
    });
}
