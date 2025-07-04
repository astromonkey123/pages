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
