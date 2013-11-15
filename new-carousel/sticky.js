
(function() {


    /* This starts everything
    ----------------------------------------------- */
    function start() {

        // Color Bar
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
            
            var Sticky = document.body.getElementsByClassName("color-bar");
            if (Sticky.length <= 0) return;
            Sticky = Sticky[0];

            var StickyTop;
            function calculate() {
                StickyTop = getAbsolutePosition(Sticky).y;
            };

            var fixed = false;
            function update() {
                if (document.body.scrollTop > StickyTop) {

                    // If the target isn’t already fixed in place, fix it.
                    if (!fixed) {
                        Sticky.className += " fixed";
                        fixed = true;
                    }
                } else {

                    // If the target is fixed in place, unfix it.
                    if (fixed) {
                        Sticky.className = Sticky.className.replace(/fixed/g, "");
                        fixed = false;
                    }
                }
            };

            calculate();
            update();

            var throttle;
            window.addEventListener("resize", function() {
                if (throttle) clearTimeout(throttle);
                throttle = setTimeout(calculate, 200);
            }, false);

            window.addEventListener("load", update, false);
            window.addEventListener("scroll", update, false);
        };

    })();



    /* Everything is ready, start it up
    ----------------------------------------------- */
    start();


})();