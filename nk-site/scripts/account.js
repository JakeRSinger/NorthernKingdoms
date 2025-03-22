let loggedIn = false;

window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    if (params.get("loggedIn") === "true") {
        sessionStorage.setItem("loggedIn", "true");
    }

    checkLoggedIn();
});


function checkLoggedIn() {
    // Ensure boolean value for loggedIn state
    loggedIn = sessionStorage.getItem("loggedIn") === "true";

    if (loggedIn) {
        logoutLink();
    }
}

function logoutLink() {
    const loginLink = document.getElementById("login-link");

    if (loginLink && loggedIn) {
        loginLink.href = "https://20.128.25.134/NorthernKingdoms/nk-webservice/logout.php";
        loginLink.textContent = "Logout";

        // Add logout event to clear sessionStorage
        loginLink.addEventListener("click", function () {
            sessionStorage.removeItem("loggedIn");
        });
    }
}
