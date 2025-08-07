const button_slider = document.getElementById('slider');
let total_slide = 0;

button_slider.addEventListener('wheel', (e) => slideBar(e));

function slideBar(e) {
    total_slide -= e.deltaY;

    if (total_slide > 6) {
        total_slide = 6;
    } else if (total_slide < -515) {
        total_slide = -515;
    }

    button_slider.style.left = total_slide + "px";
}