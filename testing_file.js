(function () {
    var AUTH_KEY = "caseNoteAuthorized";
    var USER_KEY = "disputeUser";
    var STATUS_KEY = "disputeReviewStatus";

    // ================= PASSWORD =================

    if (localStorage.getItem(AUTH_KEY) !== "yes") {
        var pwd = document.createElement("input");

        pwd.type = "password";
        pwd.placeholder = "Enter password";

        pwd.style.cssText =
            "position:fixed;" +
            "top:50%;" +
            "left:50%;" +
            "transform:translate(-50%,-50%);" +
            "z-index:999999;" +
            "padding:10px;" +
            "font-size:16px;" +
            "border:2px solid #333;" +
            "background:#fff;";

        document.body.appendChild(pwd);
        pwd.focus();

        pwd.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                if (pwd.value === "202608") {
                    localStorage.setItem(AUTH_KEY, "yes");
                    document.body.removeChild(pwd);
                    showSetupPopup();
                } else {
                    alert("Incorrect password");
                    document.body.removeChild(pwd);
                }
            }
        });

        return;
    }

    showSetupPopup();

    // ================= FILL FUNCTION =================

    function fill(selector, value) {
        var e = document.querySelector(selector);

        if (!e) {
            alert("Element not found:\n" + selector);
            return false;
        }

        e.focus();
        e.value = value;

        e.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        e.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true
            })
        );

        return true;
    }

    // ================= POPUP =================

    function showSetupPopup() {
        var savedUser = localStorage.getItem(USER_KEY) || "";
        var savedStatus = localStorage.getItem(STATUS_KEY) || "";

        var overlay = document.createElement("div");

        overlay.style.cssText =
            "position:fixed;" +
            "top:0;" +
            "left:0;" +
            "width:100%;" +
            "height:100%;" +
            "background:rgba(0,0,0,.5);" +
            "z-index:999999;";

        var popup = document.createElement("div");

        popup.style.cssText =
            "position:absolute;" +
            "top:50%;" +
            "left:50%;" +
            "transform:translate(-50%,-50%);" +
            "background:#fff;" +
            "padding:20px;" +
            "border-radius:10px;" +
            "width:350px;" +
            "font-family:Arial;";

        popup.innerHTML = `
            <h3>Dispute Settings</h3>

            <div style="margin-bottom:10px;">
                <label>Dispute User</label>
                <input
                    id="disputeUserInput"
                    type="text"
                    value="${savedUser}"
                    style="width:100%;padding:8px;margin-top:5px;"
                >
            </div>

            <div style="margin-bottom:15px;">
                <label>Dispute Review Status</label>

                <select
                    id="disputeStatusSelect"
                    style="width:100%;padding:8px;margin-top:5px;"
                >
                    <option value="">Select status</option>
                    <option value="Plan Type Validated Post IDR Initiation">
                        Plan Type Validated Post IDR Initiation
                    </option>

                    <option value="Pending Review">
                        Pending Review
                    </option>

                    <option value="Approved">
                        Approved
                    </option>

                    <option value="Rejected">
                        Rejected
                    </option>
                </select>
            </div>

            <button id="setBtn">Set</button>

            <button id="editBtn" style="margin-left:10px;">
                Edit
            </button>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        var userInput = popup.querySelector("#disputeUserInput");
        var statusSelect = popup.querySelector("#disputeStatusSelect");

        statusSelect.value = savedStatus;

        if (savedUser && savedStatus) {
            userInput.disabled = true;
            statusSelect.disabled = true;
        }

        popup.querySelector("#setBtn").onclick = function () {
            var user = userInput.value.trim();
            var status = statusSelect.value;

            if (!user || !status) {
                alert(
                    "You must set BOTH Dispute User and Dispute Review Status before continuing."
                );

                return;
            }

            localStorage.setItem(USER_KEY, user);
            localStorage.setItem(STATUS_KEY, status);

            userInput.disabled = true;
            statusSelect.disabled = true;

            document.body.removeChild(overlay);

            runScript();
        };

        popup.querySelector("#editBtn").onclick = function () {
            userInput.disabled = false;
            statusSelect.disabled = false;
        };

        if (savedUser && savedStatus) {
            document.body.removeChild(overlay);
            runScript();
        }
    }

    // ================= MAIN SCRIPT =================

    function runScript() {
        var disputeUser = localStorage.getItem(USER_KEY);
        var disputeStatus = localStorage.getItem(STATUS_KEY);

        if (!disputeUser || !disputeStatus) {
            alert(
                "Dispute User and Dispute Review Status must be configured first."
            );

            showSetupPopup();
            return;
        }

        var ownerSelector =
            "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > ng-select > div > div > div.ng-input > input[type=text]";

        var noteSelector =
            "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > ng-select > div > div > div.ng-input > input[type=text]";

        fill(ownerSelector, disputeUser);

        setTimeout(function () {
            fill(noteSelector, disputeStatus);
        }, 20);
    }
})();
