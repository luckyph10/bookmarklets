(function () {
    var selector = "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.small.text-muted.d-inline-flex.align-items-center.gap-1.user-select-none";

    var tries = 0, maxTries = 20;

    function showAgePopup() {
        var e = document.querySelector("#DOB");
        if (!e) return;

        var dob = e.value || e.textContent || e.innerText;
        var d = new Date(dob);
        if (isNaN(d)) return;

        var t = new Date();
        var age = t.getFullYear() - d.getFullYear();

        if (
            t.getMonth() < d.getMonth() ||
            (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())
        ) {
            age--;
        }

        // ...rest of your code...
    }

    // ...rest of your code...
})();
