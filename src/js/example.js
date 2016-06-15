(function() {
    window.requestAnimationFrame = window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || function(callback) { window.setTimeout(callback, 1000 / 60); };

    var canvas = document.getElementById('bg');
    var context = canvas.getContext('2d');
    var looping = false;
    var totalSeconds = 0;

    var img = new Image();
    img.onload = imageLoaded;
    img.src = 'IMG_SOURCE';

    function imageLoaded() {
        draw(0);

        var btn = document.getElementById('btnStart');
        btn.addEventListener('click', function() {
            startStop();
        });
    }

    var lastFrameTime = 0;

    function startStop() {
        looping = !looping;

        if (looping) {
            lastFrameTime = Date.now();
            requestAnimationFrame(loop);
        }
    }

    function loop() {
        if (!looping) {
            return;
        }

        requestAnimationFrame(loop);

        var now = Date.now();
        var deltaSeconds = (now - lastFrameTime) / 1000;
        lastFrameTime = now;
        draw(deltaSeconds);
    }


    function draw(delta) {
        /* Here happens some magic. */
    }
}());