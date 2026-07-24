(function () {
    var KEY = "disputeDetailAuthorized";

    if (localStorage.getItem(KEY) !== "yes") {
        var pwd = document.createElement("input");

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
        var btn1 = document.querySelector(
            "body > app-root > div > div.container-fluid.ps-0.pe-0.h-100.pb-4 > app-dispute-detail > div > div.card-header > div > div.col-auto.text-center.bg-dirty > button.btn.btn-sm.btn-royal-blue"
        );

        if (!btn1) {
            alert("Main button not found");
            return;
        }

        btn1.click();

        var tries = 0;

        var interval = setInterval(function () {
            var btn2 = document.querySelector(
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
