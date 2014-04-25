
(function() {


  /* This starts everything
  ----------------------------------------------- */
  function start() {

    // OPTIONAL: Add a button to show more details
    new ShowDetails();

    // OPTIONAL: Add a button to hide tip messages
    new HideTip();

    // OPTIONAL: Present the header navigation as dropdowns
    new NavDropDown();

    // OPTIONAL: Present the do buttons as dropdowns
    new DoDropDown();

    // OPTIONAL: Hide redundant labels in browsers that support the placeholder attribute.
    // http://stackoverflow.com/questions/8263891/simple-way-to-check-if-placeholder-is-supported
    function supportsPlaceholder() {
      var test = document.createElement("input");
      return ("placeholder" in test);
    }
    if (supportsPlaceholder()) {
      var html = document.getElementsByTagName("html")[0];
      html.className += " supports-placeholder";
    }

  }


  /* Utilities
  ----------------------------------------------- */
  function within(needle, haystack) {

    // If the parent element is the target
    if (needle === haystack) {
      return true;

    // If any of the children are the target
    } else if (haystack.firstChild) {
      var child = haystack.firstChild;
      do {
        if (within(needle, child)) return true;
      } while (child = child.nextSibling);
    }

  }
  function closest(element, nodeName) {

    // If the element is the target
    if (nodeName === element.nodeName.toLowerCase()) {
      return element;
    } else {
      if (element.parentNode) return closest(element.parentNode, nodeName);
    }

  }

  // http://stackoverflow.com/questions/3437786/how-to-get-web-page-size-browser-window-size-screen-size-in-a-cross-browser-wa
  function windowWidth() {
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    return w.innerWidth || e.clientWidth || g.clientWidth;
  }


  /* =ShowDetails
  ----------------------------------------------- */
  var ShowDetails = function() {};

  (function() {

    if (!document.addEventListener) return;

    ShowDetails = function() {

      // Save the user’s preference
      function show(e) {
        var target = e.target;
        var name = target.nodeName.toLowerCase();
        var p = closest(e.target, "p");
        if ((p && p.className.indexOf("show") >= 0) || closest(e.target, "h1")) {
          var section = closest(e.target, "section");

          if (section && section.className.indexOf("has-details") >= 0) {
            section.className += " show-details";
            e.preventDefault();
          }
        }
      }

      document.addEventListener("click", show, false);

      // Show buttons
      var html = document.getElementsByTagName("html")[0];
      html.className += " scripted-show-details";
    }

  })();


  /* =HideTip
  -----------------------------------------------
  NOTE: This currently only supports a single tip (the community introduction)
  ----------------------------------------------- */
  var HideTip = function() {};

  (function() {

    if (!window.localStorage || !document.addEventListener) return;

    HideTip = function() {

      // TODO: Find a way to get this id from the HTML
      var id = "community-intro";
      var storageName = "hide_" + id.replace(/-/g, "_");

      // Hide the messages
      function hide(e) {
        if (localStorage[storageName]) {
          var html = document.getElementsByTagName("html")[0];
          html.className += " hide-" + id;
        }
      }

      // Save the user’s preference
      function save(e) {
        var target = e.target;
        var name = target.nodeName.toLowerCase();
        var p = closest(e.target, "p");
        if (p && p.className.indexOf("close") >= 0) {
          var section = closest(e.target, "section");

          // TODO: Support multiple storage names
          if (section && section.id == id) {
            localStorage[storageName] = "hidden";
            hide();
            e.preventDefault();
          }
        }
      }

      hide();
      document.addEventListener("click", save, false);

      // Show the close buttons
      var html = document.getElementsByTagName("html")[0];
      html.className += " scripted-hide-tip";
    }

  })();


  /* =NavDropDown
  ----------------------------------------------- */
  var NavDropDown = function() {};

  (function() {

    if (!document.addEventListener) return;

    NavDropDown = function() {

      var active; // The currently active element

      function hide(element) {

        // KLUDGE: Wait a brief moment before responding to a new event
        // (to work around an issue in Firefox where clicking a link triggers a focus event)
        if (element._data__NavDropDown_lately) return;
        element._data__NavDropDown_lately = true;
        setTimeout(function() { element._data__NavDropDown_lately = false; }, 250);

        element.className = element.className.replace(/active/g, "");
        if (active === element) active = undefined;

        // KLUDGE: For the search form
        var section = element.querySelector("section");
        if (section && section.className.indexOf("search") >= 0) {
          section.className = section.className.replace(/active/g, "");
        }
      }

      function show(element, target) {

        // KLUDGE: Wait a brief moment before responding to a new event
        // (to work around an issue in Firefox where clicking a link triggers a focus event)
        if (element._data__NavDropDown_lately) return;
        element._data__NavDropDown_lately = true;
        setTimeout(function() { element._data__NavDropDown_lately = false; }, 250);

        if (element.className.indexOf("active") < 0) {
          element.className += " active";
        }
        active = element;

        // KLUDGE: For the search form
        var section = closest(target, "section");
        if (section && section.className.indexOf("search") >= 0 && section.className.indexOf("active") < 0) {
          section.className += " active";
        }
      }

      function toggle(e) {

        var target = e.target;
        var name = target.nodeName.toLowerCase();

        // KLUDGE: Make any interaction outside of a dropdown close it on wide screens
        if (windowWidth() >= 900) { // This number is arbitrary, but happens to be a little larger than
                                    // the media query used to switch between inline and positioned dropdowns
          if (active) {
            if (!within(target, active)) {
              hide(active);
            }
          }
        }

        // If the target is link or an image
        if (name == "a"      ||
            name == "img"    ||
            name == "h3"     ||
            name == "h4"     ||
            name == "input"  ||
            name == "button"  ) {

          var nav = closest(target, "nav");

          // If the target is within the “primary” or “account” nav elements
          if (nav && (nav.className.indexOf("primary") >= 0 ||
                      nav.className.indexOf("account") >= 0 )) {

            // If a dropdown is currently open and it’s not the target, close it
            if (active) {
              if (!within(target, active)) {
                hide(active);
              }
            }

            var headline = closest(target, "h3") || closest(target, "h4");

            if (headline) {
              e.preventDefault();
            }

            // Toggle the dropdown
            if (headline && nav.className.indexOf("active") >= 0) {
              hide(nav);
            } else {
              show(nav, target);
            }
          }
        }
      }

      document.addEventListener("click", toggle, false);
      document.addEventListener("focus", toggle, true); // TRICKY: Focus events don’t bubble up, so use capture instead


      // Style the dropdowns
      var html = document.getElementsByTagName("html")[0];
      html.className += " scripted-nav";

    };
      
  })();


  /* =DoDropDown
  ----------------------------------------------- */
  var DoDropDown = function() {};

  (function() {

    if (!document.addEventListener) return;

    DoDropDown = function() {

      var active; // The currently active element

      function hide(element) {
        element.className = element.className.replace(/active/g, "");
        if (active === element) active = undefined;
      }

      function show(element) {
        if (element.className.indexOf("active") < 0) {
          element.className += " active";
        }
        active = element;
      }

      function toggle(e) {
        var target = e.target;
        var name = target.nodeName.toLowerCase();

        // If a dropdown is currently open and it’s not the target, close it
        if (active) {
          if (!within(e.target, active)) {
            hide(active);
          }
        }

        // If the target is a headline or a button
        if (name == "h6" || name == "button") {
          var form = closest(target, "form");

          // If the target is within a “do” form
          if (form && form.className.indexOf("do") >= 0) {

            // Toggle the dropdown
            if (name == "h6" && form.className.indexOf("active") >= 0) {
              hide(form);
            } else {
              show(form);
            }
          }
        }

      }


      document.addEventListener("click", toggle, false);
      document.addEventListener("focus", toggle, true); // TRICKY: Focus events don’t bubble up, so use capture instead


      // Style the dropdowns
      var html = document.getElementsByTagName("html")[0];
      html.className += " scripted-do";

    };
      
  })();


  /* Everything is ready, so start it up
  ----------------------------------------------- */
  start();


})();

