const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
    
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
    const mini_nav = document.getElementById('mini-navbar');
    const context = document.getElementsByClassName('context')[0];
    const pdf_viewer = document.getElementById("pdv");

    const currentScrollY = window.scrollY;

    if (currentScrollY > 0){
        nav.classList.add("navbar-shadow");
        if (context != null) {
            context.classList.add("context-shadow");
            if (prevScrollY === 0) {
                context.classList.remove("context-expanded");
            }
        }
        if (pdf_viewer != null) {
            pdf_viewer.classList.add("pdf-viewer-shadow");
        }
        if (mini_nav != null) {
            mini_nav.classList.add("mini-navbar-shadow");
        }
    } else {
        nav.classList.remove("navbar-shadow");
        if (context != null) {
            context.classList.remove("context-shadow");
            if (prevScrollY > 0) {
                context.classList.add("context-expanded");
            }
        }
        if (pdf_viewer != null) {
            pdf_viewer.classList.remove("pdf-viewer-shadow");
        }
        if (mini_nav != null) {
            mini_nav.classList.remove("mini-navbar-shadow");
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

// Show the viewer and load the selected pdf
function showViewer(id, filename) {
    const element = document.getElementById(id);

    element.classList.remove("pdf-viewer-hide");
    element.style.transitionDuration = 0.4 + "s";

    const viewer = element.children[2]

    viewer.style.transitionDuration = 0.2 + "s";
    viewer.style.opacity = 0;
    setTimeout(() => {
        viewer.data = "../assets/docs/" + filename;
    }, 200);
    setTimeout(() => {
        viewer.style.opacity = 1;
    }, 300);
}

// Hide the viewer
function hideViewer(id) {
    const element = document.getElementById(id);

    element.classList.add("pdf-viewer-hide");
    element.style.transitionDuration = 0.4 + "s";
}

// Animate the dragging of the viewer
function dragElement(id) {
    const element = document.getElementById(id);
    let mouseUp = false;
    
    let x = 0;
    let y = 0;

    window.addEventListener('mouseup', ()=>{
        mouseUp = true;
    });

    window.addEventListener('mousemove', (mouse)=>{
        x = windowWidth - mouse.clientX;
        y = mouse.clientY;
        x = (x < 300) ? 300 : (x > windowWidth - 300) ? windowWidth - 300 : x;
        y = (y < 75) ? 75 : (y > windowHeight - 500 + 25) ? windowHeight - 500 + 25 : y;

        if (! mouseUp && element != null) {
            console.log(`${x}, ${y}`);
            element.style.right = x - 300 + "px";
            element.style.top = y - 25 + "px";
            element.style.transitionDuration = 0 + "s";
        }
    });
}

// Reset the pdf viewer's position when double clicked
function resetElement(id) {
    const element = document.getElementById(id);

    element.style.right = 25 + "px";
    element.style.top = 75 + "px";
    element.style.transitionDuration = 0.6 + "s";
}