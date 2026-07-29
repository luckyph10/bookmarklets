(function () {
    var s = document.createElement('script');

    s.src =
        'https://buttons.airrishlucky-dullas.workers.dev/docsopener?v=' +
        Date.now();

    s.onerror = function () {
        alert('Failed to load Docs Opener');
    };

    document.head.appendChild(s);
})();
