(function () {
    var selectors = [
        "#ngForm > fieldset > div:nth-child(22) > div.d-flex.mb-2 > button",
        "#ngForm > fieldset > div:nth-child(24) > div.d-flex.mb-2 > button"
    ];

    selectors.forEach(function (selector) {
        var el = document.querySelector(selector);

        if (el) {
            el.click();

            el.style.outline = "3px solid orange";

            setTimeout(function () {
                el.style.outline = "";
            }, 3000);
        }
    });

    setTimeout(function () {
        var target = document.querySelector(
            "body > app-root > div > div.container-fluid.ps-0.pe-0.h-100.pb-4 > app-calculator > div > div.card-body > div:nth-child(3) > div.d-flex.mb-2.align-items-center"
        );

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            target.style.outline = "3px solid red";

            setTimeout(function () {
                target.style.outline = "";
            }, 3000);
        }
    }, 300);
})();
