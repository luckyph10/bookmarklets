

(function () {
    const el = document.querySelector('#table-body a[title="Open Arbit"]');

    if (el) {
        const url = el.href.startsWith('http')
            ? el.href
            : new URL(el.getAttribute('href'), window.location.origin).href;

        window.open(url, '_blank');
    } else {
        alert('Open Arbit link not found');
    }
})();
