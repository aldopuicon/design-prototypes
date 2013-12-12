(function() {

  // Fade the blurred background in, as the page scrolls down

  var blur = document.querySelector(".background .blur");
  if (blur) {
    blur.style.opacity = 0;

    function doBlur() {

      // We want the target to be relative to the window size
      var opacity = window.pageYOffset / (window.innerHeight / 2);
      if (opacity > 1) opacity = 1;
      if (opacity < 0) opacity = 0;

      if (document.body.offsetHeight < window.innerHeight) opacity = 1;

      blur.style.opacity = opacity;

    };

    window.addEventListener("scroll", doBlur, false);
  }
  doBlur();

})();
