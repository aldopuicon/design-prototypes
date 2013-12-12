
// Move the content down a little
(function() {

  var header = document.querySelector("header");
  var list = document.querySelector(".activity-list");
  if (header && list) {
    function position() {
      console.log("window: " + window.innerHeight);
      console.log("header: " + header.offsetHeight);
      if (window.innerHeight > header.offsetHeight) {
        list.className += " positioned";
      } else {
        list.className = document.body.className.replace(/positioned/g, "");
      }
    }
    window.addEventListener("resize", position, false);
    position();
  }

})();


// Fade the blurred background in, as the page scrolls down
(function() {

  var header = document.querySelector("header");
  var blur = document.querySelector(".background .blur");
  if (blur && header) {
    blur.style.opacity = 0;

    function doBlur() {

      // We want the target to be relative to the window size
      var opacity = window.scrollY / (window.innerHeight / 2);
      if (opacity > 1) opacity = 1;
      if (opacity < 0) opacity = 0;

      if (window.innerHeight < header.offsetHeight) opacity = 1;

      blur.style.opacity = opacity;

    };

    window.addEventListener("scroll", doBlur, false);
    doBlur();
  }

})();


// Fix the position of the header, until the content bumps into it
/*
(function() {

  var header = document.querySelector("header");
  if (!header) return;

  var offset = header.offsetHeight;

  window.addEventListener("scroll", function(e) {
    if (window.scrollY < offset) {
      header.className += " fixed";
    } else {
      header.className = header.className.replace(/fixed/g, "");
    }
  });

})();
*/

