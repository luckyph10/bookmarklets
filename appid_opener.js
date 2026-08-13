(function () {
    const el = document.querySelector(
        '#table-body > tr > td:nth-child(2) > a'
    );



    if (el) {
        el.target = '_self';   // open in current tab
        el.removeAttribute('target');
        el.click();
    } else {
        alert('Element not found');
    }
})();
