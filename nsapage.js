(function () {
    let attempts = 0;
    const maxAttempts = 20;

    function findTarget() {

        // Try original selector first
        let target = document.querySelector(
            "#ngForm > fieldset > div.row.mt-2.justify-content-between.mb-2 > h5"
        );

        // Backup: find first h5 inside ngForm
        if (!target) {
            target = document.querySelector("#ngForm h5");
        }

        if (target) {

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            target.style.outline = "3px solid red";
            target.style.backgroundColor = "yellow";

            setTimeout(() => {
                target.style.outline = "";
                target.style.backgroundColor = "";
            }, 3000);

            console.log("NSA Bookmarklet: Target found");
            return;
        }

        attempts++;

        if (attempts < maxAttempts) {
            setTimeout(findTarget, 500);
        } else {
            alert("Target not found");
            console.error("NSA Bookmarklet: Target not found");
        }
    }

    findTarget();
})();
