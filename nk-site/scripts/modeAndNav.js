let darkMode = false; // Global variable for dark mode

window.onload = function () {
    const body = document.querySelector("body");
    const html = document.querySelector("html");
    const navToggle = document.getElementById("nav-toggle");
    const modeToggle = document.getElementById("dark-mode-toggle");
    const nav = document.querySelector("nav");

    // Initialize dark mode from localStorage
    checkdarkMode();

    // Initialize event listeners
    initEventListeners();

    // Event Listeners
    function initEventListeners() {
        navToggle.addEventListener("click", toggleNav);
        modeToggle.addEventListener("click", toggledarkMode);
        setupSwipeHandlers();
    }

    // dark Mode Toggle
    function toggledarkMode() {
        body.classList.toggle("dark-mode");
        html.classList.toggle("dark-mode");
        modeToggle.src = body.classList.contains("dark-mode") ? "img/sun.png" : "img/moon.png";

        darkMode = !darkMode; // Update global variable
        localStorage.setItem("darkMode", darkMode); // Persist state
    }

    function checkdarkMode() {
        // Load dark mode state from localStorage
        darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

        // Apply dark mode if previously enabled
        if (darkMode) {
            body.classList.add("dark-mode");
            html.classList.add("dark-mode");
            modeToggle.src = "img/sun.png";
        }
    }

    // Nav Toggle
    function toggleNav() {
        nav.classList.toggle("show-nav");
        navToggle.src = nav.classList.contains("show-nav") ? "img/close.png" : "img/menu.png";
    }

    // Swipe functions
    function setupSwipeHandlers() {
        const hammer = new Hammer(body);
        hammer.on('swipeleft', handleSwipeLeft);
        hammer.on('swiperight', handleSwipeRight);
    }

    function handleSwipeLeft() {
        if (nav.classList.contains("show-nav")) {
            toggleNav();
        }
    }

    function handleSwipeRight() {
        if (!nav.classList.contains("show-nav")) {
            toggleNav();
        }
    }
};
