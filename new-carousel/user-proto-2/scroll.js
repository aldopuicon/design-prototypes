
(function() {


  /* =requestAnimationFrame
  -----------------------------------------------
  Provides requestAnimationFrame in a cross browser way.
  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  ----------------------------------------------- */
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = ( function() {
      return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
        window.setTimeout( callback, 1000 / 60 );
      };
    } )();
  }


  // KUDOS: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
  function getViewportDimensions() {
    var width  = 0;
    var height = 0;

    try {
      // Gecko, WebKit & Opera
      if (window.innerWidth) {
        width  = window.innerWidth;
        height = window.innerHeight;
      } else {

        // IE
        if (document.documentElement &&
          document.documentElement.clientWidth &&
          document.documentElement.clientWidth > 0) {
          width  = document.documentElement.clientWidth;
          height = document.documentElement.clientHeight;

        // IE (Quirks-mode)
        } else {
          width  = document.body.clientWidth;
          height = document.body.clientHeight;
        }
      }
    } catch(e) {}

    return {
      width : width,
      height: height
    };
  };
  function getDimensions() {
    var width  = 0;
    var height = 0;

    try {
      var pageDimensions = {
        width : document.body.offsetWidth,
        height: document.body.offsetHeight
      };

      // Special case, for IE in quirksmode
      if (document.body.scrollHeight > pageDimensions.height) {
        pageDimensions = {
          width : document.body.scrollWidth,
          height: document.body.scrollHeight
        };
      }

      var viewportDimensions = getViewportDimensions();

      width  = (pageDimensions.width  > viewportDimensions.width  ? pageDimensions.width  : viewportDimensions.width);
      height = (pageDimensions.height > viewportDimensions.height ? pageDimensions.height : viewportDimensions.height);
    } catch(e) {}

    return {
      width : width,
      height: height
    };
  };
  function getCumulativeOffset(element) {
    var top = 0;
    var left = 0;
    do {
      top     += element.offsetTop  || 0;
      left    += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return {
      top: top,
      left: left
    };
  };
  function getScrollOffsets() {
    var top  = 0;
    var left = 0;

    try {
      if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
        top  = document.body.scrollTop;
        left = document.body.scrollLeft;
      }
      if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
        if (document.documentElement.scrollTop > document.body.scrollTop) {
          top = document.documentElement.scrollTop;
        }
        if (document.documentElement.scrollLeft > document.body.scrollLeft) {
          left = document.documentElement.scrollLeft;
        }
      }
    } catch(e) {}

    return {
      top : top,
      left: left
    };
  };
  function getAbsolutePosition(target) {
    var position = {
      x: 0,
      y: 0
    };
    do {
      position.x += target.offsetLeft;
      position.y += target.offsetTop;
    } while (target = target.offsetParent);
    return position;
  };


  /* This starts everything
  ----------------------------------------------- */
  function start() {

      var carousel = document.querySelector(".carousel");

      if (window._doScroll !== false) {
        var content = document.getElementById("content");
        if (content) new ScrollToContent(content);

        if (carousel) {
          carousel.scrollLeft = 600;

          function showCarousel() {
            if (document.body.scrollTop > 0) {
              //window.scrollTo(0, 0);
              ScrollTop(0);
            }
          }

          var throttle;
          carousel.addEventListener("mouseover", function(e) {
            if (throttle) clearTimeout(throttle);
            throttle = setTimeout(showCarousel, 200);
          });
        }
      }

      var next = document.querySelector(".next");
      if (next) {
        next.addEventListener("click", function(e) {
          e.preventDefault();
          //carousel.scrollLeft = carousel.scrollLeft + 262 * 5;
          ScrollLeft(carousel, carousel.scrollLeft + 262 * 5);
        }, false);
      }

      var prev = document.querySelector(".prev");
      if (prev) {
        prev.addEventListener("click", function(e) {
          e.preventDefault();
          //carousel.scrollLeft = carousel.scrollLeft - 262 * 5;
          ScrollLeft(carousel, carousel.scrollLeft - 262 * 5, -1);
        }, false);
      }  

  };


  /* =Scroll Timer
  ----------------------------------------------- */
  var scrollTimer;


  /* =Scroll Left
  ----------------------------------------------- */
  var ScrollLeft = function(element, targetX, direction) {
    if (!element) return;
    if (!direction) direction = 1;

    var duration = 5;
    var lastScrollLeft;

    function scrollTowards() {

      // Handle case where user is scrolling
      /*
      if (lastScrollLeft && element.scrollLeft < lastScrollLeft) {
        if (scrollTimer) clearTimeout(scrollTimer);
        return;
      }
      */

      var increment = Math.abs(element.scrollLeft - targetX) / duration;

      // If we're getting close (or if we've scrolled as far as we can), jump straight to it and stop.
      var stop = false;
      if (increment < 1) {
        increment = Math.abs(element.scrollLeft - targetX);
        stop = true;
      }
      element.scrollLeft = element.scrollLeft + direction * Math.ceil(increment);
      if (lastScrollLeft == element.scrollLeft) {
        stop = true;
      }
      if (!stop && direction * element.scrollLeft < direction * targetX) {
        requestAnimationFrame(function() {
          scrollTowards();
        });
      }

      lastScrollLeft = element.scrollLeft;
    };

    function initialize() {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() {
        scrolling = false;
        lastScrollLeft = undefined;

        scrollTowards();
      }, 100);
    };

    initialize();
  };


  /* =Scroll Top
  ----------------------------------------------- */
  var ScrollTop = function(targetY) {

    var duration = 5;
    var lastScrollTop;

    function scrollTowards() {
      console.log("scrollTowards(" + targetY + ")");
      var scroll = getScrollOffsets();
      var scrollTop = scroll.top;

      // Handle case where user scrolls up
      if (lastScrollTop && scroll.top > lastScrollTop) {
        if (scrollTimer) clearTimeout(scrollTimer);
        return;
      }

      var increment = Math.abs(scroll.top - targetY) / duration;

      // If we're getting close (or if we've scrolled as far as we can), jump straight to it and stop.
      var stop = false;
      if (increment < 1) {
        increment = Math.abs(scroll.top - targetY);
        stop = true;
      }
      window.scrollTo(scroll.left, scroll.top - Math.ceil(increment));
      if (lastScrollTop == scroll.top) {
        stop = true;
      }

      console.log("scroll.top: " + scroll.top);
      console.log("targetY: " + targetY);
      if (!stop && scroll.top > targetY) {
        requestAnimationFrame(function() {
          scrollTowards(targetY);
        });
      }

      lastScrollTop = scrollTop;
    };

    function initialize() {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() {
        scrolling = false;
        lastScrollTop = undefined;

        scrollTowards();
      }, 100);
    };

    initialize();
  };


  /* =Scroll to Content
  ----------------------------------------------- */
  var ScrollToContent = function() {};

  (function() {

    ScrollToContent = function(element, callback) {
      if (!element) return;

      var scrollTimer;
      var duration = 5;
      var lastScrollTop;

      function scrollTowards(targetY) {
        var scroll = getScrollOffsets();
        var scrollTop = scroll.top;

        // Handle case where user scrolls up
        if (lastScrollTop && scroll.top < lastScrollTop) {
          if (scrollTimer) clearTimeout(scrollTimer);
          if (callback) callback();
          return;
        }

        var increment = Math.abs(scroll.top - targetY) / duration;

        // If we're getting close (or if we've scrolled as far as we can), jump straight to it and stop.
        var stop = false;
        if (increment < 1) {
          increment = Math.abs(scroll.top - targetY);
          stop = true;
        }
        window.scrollTo(scroll.left, scroll.top + Math.ceil(increment));
        if (lastScrollTop == scroll.top) {
          stop = true;
        }
        if (!stop && scroll.top < targetY) {
          requestAnimationFrame(function() {
            scrollTowards(targetY);
          });
        } else {
          if (callback) callback();
        }

        lastScrollTop = scrollTop;
      };

      function initialize() {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
          var y = getCumulativeOffset(element).top + (getViewportDimensions().height / 2);
          var scroll = getScrollOffsets();
          scrolling = false;
          //if (getViewportDimensions().height + scroll.top < y) {
            lastScrollTop = undefined;
            var magicNumber = window.magicNumber || -260 ;  // Move a little bit above the target. (This number is arbitrary.)
            var targetY = getCumulativeOffset(element).top - magicNumber;

            var footer = document.getElementById("footer");
            if (footer) {
              var maxScrollableDistance = Math.abs(footer.offsetTop + footer.offsetHeight - getViewportDimensions().height);

              if (maxScrollableDistance < targetY) {
                targetY = maxScrollableDistance;
              }
            }

            scrollTowards(targetY, y, scroll);
          //} else {
            //if (callback) callback();
          //}
        }, 100);
      };

      initialize();
    };
  })();


  /* Everything is ready, so start it up
  ----------------------------------------------- */
  start();


})();