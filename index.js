// Move the navbar underline to the selected option from the previous option
window.addEventListener("DOMContentLoaded", () => {
    const defaultItem = document.getElementById("home");
    const activeItem = document.getElementsByClassName("active")[0];
    const underline = document.getElementById("nav-underline");

    let lastItem = document.getElementById(localStorage.getItem("lastId")) || defaultItem;

    moveUnderline(lastItem)

    moveUnderline(activeItem)

    localStorage.setItem("lastId", activeItem.id)

    function moveUnderline(target) {
        const rect = target.getBoundingClientRect();

        const left = rect.left;
        const width = rect.width;

        underline.style.left = left + "px";
        underline.style.width = width + "px";
    }
});

// Add shadow to navbar and context when you scroll down
window.addEventListener('scroll', ()=>{
    const nav = document.getElementById('navbar');
    const context = document.getElementsByClassName('context')[0];

    if (window.scrollY > 0){
        nav.classList.add("navbar-shadow");
        if (context != null) {
            context.classList.add("context-shadow");
        }
    } else {
        nav.classList.remove("navbar-shadow");
        if (context != null) {
            context.classList.remove("context-shadow");
        }
    }
});

function showHideId(id) {
    let element = document.getElementById(id);
    console.log(element.style.gridTemplateRows);

    if (element.style.gridTemplateRows === "1fr") {
        element.style.gridTemplateRows = "0fr";
    } else {
        element.style.gridTemplateRows = "1fr";
    }
}