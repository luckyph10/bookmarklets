(function () {
    const el = document.querySelector(
        '#table-body > tr > td:nth-child(2) > a'
    );

    if (el) {
        window.open(el.href, '_blank');
    } else {
        alert('Element not found');
    }
})();
