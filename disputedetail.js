(function () {
    const el = document.querySelector(
        "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > textarea"
    );

    if (el) {
        const d = new Date();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yy = String(d.getFullYear()).slice(-2);

        const note = `${mm}/${dd}/${yy} VOB verified, no change to NSA jurisdiction - ALD`;

        el.value = note + (el.value.trim() ? "\n" + el.value : "");

        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const KEY = "disputeDetailAuthorized";

    if (localStorage.getItem(KEY) !== "yes") {
        const pwd = document.createElement("input");

        pwd.type = "password";
        pwd.placeholder = "Enter password";
        pwd.style.cssText =
            "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999999;padding:10px;font-size:16px;";

        document.body.appendChild(pwd);
        pwd.focus();

        pwd.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                if (pwd.value === "202608") {
                    localStorage.setItem(KEY, "yes");
                    document.body.removeChild(pwd);
                    runScript();
                } else {
                    alert("Incorrect password");
                    document.body.removeChild(pwd);
                }
            }
        });

        return;
    }

    runScript();

    function runScript() {
        const btn1 = document.querySelector(
            "body > app-root > div > div.container-fluid.ps-0.pe-0.h-100.pb-4 > app-dispute-detail > div > div.card-header > div > div.col-auto.text-center.bg-dirty > button.btn.btn-sm.btn-royal-blue"
        );

        if (!btn1) {
            alert("Main button not found");
            return;
        }

        btn1.click();

        let tries = 0;

        const interval = setInterval(function () {
            const btn2 = document.querySelector(
                "body > ngb-modal-window button.btn.btn-royal-blue"
            );

            if (btn2) {
                btn2.click();
                clearInterval(interval);
            }

            if (tries++ > 10) {
                clearInterval(interval);
                alert("Popup button not found");
            }
        }, 300);
    }
})();
