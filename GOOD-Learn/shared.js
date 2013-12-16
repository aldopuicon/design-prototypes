
// Move the content down a little
/*
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
*/

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
(function() {

  var container = document.querySelector("body > .container");
  var header    = document.querySelector("header");

  if (container && header) {
    container.className += " positioned";
    var offset = container.offsetTop - header.offsetHeight;

    var fixed;
    function check() {
      if (window.scrollY < offset && window.innerHeight > header.offsetHeight) {
        if (fixed !== true) header.className += " fixed";
        header.style.marginTop = 0;
        fixed = true;
      } else {
        if (fixed === true) header.className = header.className.replace(/fixed/g, "");
        header.style.marginTop = -header.offsetHeight + "px";
        fixed = false;
      }
    };

    window.addEventListener("scroll", check, false);
    window.addEventListener("resize", check, false);
    check();

  }

})();


