function show_hide(num) {
  var x = document.getElementById("hide_text" + num);
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
} 