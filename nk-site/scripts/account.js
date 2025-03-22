let loggedIn = false;

window.addEventListener('load', checkLoggedIn);

function checkLoggedIn() {
    // Load login state from localStorage
    loggedIn = JSON.parse(SessionStorage.getItem("loggedIn")) || false;
    
    if (loggedIn) logoutLink();
}

function logoutLink() {
    const loginLink = document.getElementById("login-link");

    // Change link if logged in
    if (loginLink && loggedIn) {
        loginLink.href = "https://20.128.25.134/NorthernKingdoms/nk-webservice/logout.php";
        loginLink.textContent = `Logout`;
    }
}