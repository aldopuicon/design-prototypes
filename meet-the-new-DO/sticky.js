
(function() {


    /* This starts everything
    ----------------------------------------------- */
    function start() {

        // Sticky
        new Sticky();

    };


    /* =Utilities
    ----------------------------------------------- */
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


    /* =Sticky
    -----------------------------------------------
    Make the target element stick to the window
    ----------------------------------------------- */
    var Sticky = function() {};

    (function() {

        if (!document.body.getElementsByClassName || !document.body.addEventListener) return;

        Sticky = function() {
            
            var element = document.getElementById("nav");
            if (!element) return;

            var elementTop;
            function calculate() {
                elementTop = getAbsolutePosition(element).y;
            };

            var fixed = false;

            var showTimer;

            function show() {
                if (document.body.scrollTop > 71) {
                    // If the target isn’t already fixed in place, fix it.
                    if (!fixed) {
                        element.className += "fixed";
                        fixed = true;
                    }
                }
            }

            function update() {
                if (document.body.scrollTop > 71) {

                    showTimer = setTimeout(show, 1000);

                } else {

                    if (showTimer) clearTimeout(showTimer);

                    // If the target is fixed in place, unfix it.
                    if (fixed) {
                        element.className = element.className.replace(/fixed/g, "");
                        fixed = false;
                    }
                }
            };

            calculate();
            update();

            var throttle;
            window.addEventListener("resize", function() {
                if (throttle) clearTimeout(throttle);
                throttle = setTimeout(calculate, 1000);
            }, false);

            window.addEventListener("load", update, false);
            window.addEventListener("scroll", update, false);
        };

    })();



    /* Everything is ready, start it up
    ----------------------------------------------- */
    start();


})();