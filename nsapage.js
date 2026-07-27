(function () {

    const target = document.querySelector(
        "#ngForm > fieldset > div.row.mt-2.justify-content-between.mb-2 > h5"
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

    } else {

        alert("Target not found");
    }

})();
