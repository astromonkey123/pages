const body = document.getElementById("body");
const navbar = document.getElementById("navbar");

// Fade-in effect on page load
window.addEventListener("DOMContentLoaded", () => {
    body.style.opacity = 1;
});

// Navbar hiding
document.addEventListener("wheel", (e) => {
    // At the top, the navbar should be fixed
    if (window.scrollY == 0) {
        navbar.style.position = "absolute";
        navbar.style.top = 0 + "px";
    // Otherwise it depends on scroll direction
    } else {
        navbar.style.position = "fixed";
        // If scrolling down, hide the navbar
        if (e.deltaY > 0 && window.scrollY > 60) {
            navbar.style.top = -60 + "px";
        // If scrolling up, show the navbar
        } else {
            navbar.style.top = 0 + "px";
        }
    }
})