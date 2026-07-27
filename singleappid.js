(function () {

    const el = document.querySelector(
        '#table-body > tr > td:nth-child(2) > a'
    );

    if (el) {
        el.click();
    } else {
        alert('Element not found');
    }

})();
