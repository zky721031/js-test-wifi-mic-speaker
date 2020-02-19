    $(document).ready(function ($) {
        var bars = $('.music-bar .bar');

        var tl = (new TimelineMax()).staggerTo(bars, .3, {
            y: -10,
            repeat: -1,
            paused: false,
            yoyo: true,
            ease: Quad.easeInOut
        }, .25).pause();

        $('.music-bar').on('click', function () {
            tl.isActive() ? pause() : tl.play();
        });

        function pause() {
            tl.pause();
            TweenMax.to(bars, .7, {
                y: 0,
                ease: Quad.easeOut
            });
        }

    });