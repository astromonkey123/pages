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

    const pageBody = document.getElementById("page-body");
    pageBody.style.opacity = 1;
    pageBody.style.paddingLeft = 0;
});

let prevScrollY = window.scrollY;

// Add shadow to navbar and context when you scroll down
// Also expand the info section on return to 0 and contract when leaving 0
window.addEventListener('scroll', ()=>{
    const nav = document.getElementById('navbar');
    const context = document.getElementsByClassName('context')[0];

    const currentScrollY = window.scrollY;

    if (currentScrollY > 0){
        nav.classList.add("navbar-shadow");
        if (context != null) {
            context.classList.add("context-shadow");
            if (prevScrollY === 0) {
                context.classList.remove("context-expanded");
            }
        }
    } else {
        nav.classList.remove("navbar-shadow");
        if (context != null) {
            context.classList.remove("context-shadow");
            if (prevScrollY > 0) {
                context.classList.add("context-expanded");
            }
        }
    }

    prevScrollY = currentScrollY
});

function showHideId(id) {
    let element = document.getElementById(id);

    if (element.style.gridTemplateRows === "1fr") {
        element.style.gridTemplateRows = "0fr";
    } else {
        element.style.gridTemplateRows = "1fr";
    }
}

function showHideInfoId(id) {
    const element = document.getElementById(id);

    element.classList.toggle("asset-info-expanded");
}

function showHideContext(id) {
    const element = document.getElementById(id)

    element.classList.toggle("context-expanded");
}