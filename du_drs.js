

(function () {
    const AUTH_KEY = "caseNoteAuthorized";
    const USER_KEY = "disputeUser";
    const STATUS_KEY = "disputeReviewStatus";

    const DRS_OPTIONS = [
        "Plan Type Validated Post IDR Initiation",
        "VOB verified, no change to NSA jurisdiction",
        "VOB pending",
        "VOB verified dispute is not valid under NSA jurisdiction, requested closure",
        "Additional Info provided to IDRE through email"
    ];

    // ================= PASSWORD =================

    if (localStorage.getItem(AUTH_KEY) !== "yes") {
        const pwd = document.createElement("input");

        pwd.type = "password";
        pwd.placeholder = "Enter password";

        pwd.style.cssText = `
            position:fixed;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            z-index:999999;
            padding:12px;
            font-size:16px;
            border:2px solid #333;
            border-radius:8px;
            outline:none;
        `;

        document.body.appendChild(pwd);
        pwd.focus();

        pwd.addEventListener("keydown", function (e) {
            if (e.key !== "Enter") return;

            if (pwd.value === "202608") {
                localStorage.setItem(AUTH_KEY, "yes");
                pwd.remove();
                initialize();
            } else {
                alert("Incorrect password");
                pwd.remove();
            }
        });

        return;
    }

    initialize();

    // ================= INITIALIZE =================

    function initialize() {
        const savedUser = localStorage.getItem(USER_KEY);
        const savedStatus = localStorage.getItem(STATUS_KEY);

        if (savedUser && savedStatus) {
            showMiniPanel();
            runScript();
        } else {
            createPanel();
        }
    }

    // ================= MINI PANEL =================

    function showMiniPanel() {
        const existing = document.getElementById("dispute-mini-panel");

        if (existing) {
            existing.remove();
        }

        const mini = document.createElement("div");

        mini.id = "dispute-mini-panel";

        mini.style.cssText = `
            position:fixed;
            top:10px;
            left:10px;
            z-index:999999;
            background:rgba(0,0,0,.85);
            color:white;
            padding:8px 12px;
            border-radius:10px;
            font-family:Arial,sans-serif;
            display:flex;
            align-items:center;
            gap:10px;
            box-shadow:0 4px 20px rgba(0,0,0,.5);
            transition:opacity .5s;
        `;

        mini.innerHTML = `
            <span style="font-size:12px;">✓ Saved</span>

            <button
                id="mini-edit-btn"
                style="
                    border:none;
                    padding:5px 10px;
                    border-radius:6px;
                    background:#ff9800;
                    color:white;
                    cursor:pointer;
                    font-weight:bold;
                "
            >
                Edit
            </button>
        `;

        document.body.appendChild(mini);

        document
            .getElementById("mini-edit-btn")
            .addEventListener("click", function () {
                mini.remove();
                createPanel();
            });

        setTimeout(function () {
            mini.style.opacity = "0";

            setTimeout(function () {
                if (mini.parentNode) {
                    mini.remove();
                }
            }, 500);
        }, 2000);
    }

    // ================= SETTINGS PANEL =================

    function createPanel() {
        const oldPanel = document.getElementById("dispute-settings-panel");

        if (oldPanel) {
            oldPanel.remove();
        }

        const savedUser = localStorage.getItem(USER_KEY) || "";
        const savedStatus = localStorage.getItem(STATUS_KEY) || "";

        const panel = document.createElement("div");

        panel.id = "dispute-settings-panel";

        panel.style.cssText = `
            position:fixed;
            top:10px;
            left:10px;
            width:360px;
            background:rgba(0,0,0,.9);
            color:white;
            padding:18px;
            border-radius:12px;
            z-index:999999;
            font-family:Arial,sans-serif;
            box-shadow:0 6px 25px rgba(0,0,0,.6);
            backdrop-filter:blur(8px);
        `;

        const options = DRS_OPTIONS.map(function (item) {
            return `
                <option value="${item}">
                    ${item}
                </option>
            `;
        }).join("");

        panel.innerHTML = `
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:15px;
            ">
                <div style="
                    font-size:18px;
                    font-weight:bold;
                ">
                    Dispute Settings
                </div>

                <div style="
                    color:${savedUser && savedStatus ? "#00ff66" : "#ff5555"};
                    font-size:12px;
                ">
                    ${savedUser && savedStatus ? "Saved ✓" : "Required"}
                </div>
            </div>

            <div style="margin-bottom:12px;">
                <div style="
                    margin-bottom:5px;
                    font-size:13px;
                ">
                    Dispute User
                </div>

                <input
                    id="dispute-user"
                    value="${savedUser}"
                    style="
                        width:100%;
                        padding:10px;
                        border:none;
                        border-radius:8px;
                        box-sizing:border-box;
                    "
                >
            </div>

            <div style="margin-bottom:15px;">
                <div style="
                    margin-bottom:5px;
                    font-size:13px;
                ">
                    Dispute Review Status
                </div>

                <select
                    id="dispute-status"
                    style="
                        width:100%;
                        padding:10px;
                        border:none;
                        border-radius:8px;
                        box-sizing:border-box;
                    "
                >
                    <option value="">
                        Select DRS...
                    </option>

                    ${options}
                </select>
            </div>

            <div style="
                display:flex;
                gap:10px;
            ">
                <button
                    id="save-dispute-settings"
                    style="
                        flex:1;
                        border:none;
                        padding:10px;
                        border-radius:8px;
                        background:#00c853;
                        color:white;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    Save
                </button>

                <button
                    id="close-dispute-settings"
                    style="
                        flex:1;
                        border:none;
                        padding:10px;
                        border-radius:8px;
                        background:#f44336;
                        color:white;
                        font-weight:bold;
                        cursor:pointer;
                    "
                >
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        const userInput = document.getElementById("dispute-user");
        const statusInput = document.getElementById("dispute-status");

        statusInput.value = savedStatus;

        document
            .getElementById("save-dispute-settings")
            .addEventListener("click", function () {
                const user = userInput.value.trim();
                const status = statusInput.value;

                if (!user || !status) {
                    alert(
                        "You must set both Dispute User and Dispute Review Status before continuing."
                    );

                    return;
                }

                localStorage.setItem(USER_KEY, user);
                localStorage.setItem(STATUS_KEY, status);

                panel.remove();

                showMiniPanel();

                runScript();
            });

        document
            .getElementById("close-dispute-settings")
            .addEventListener("click", function () {
                if (
                    localStorage.getItem(USER_KEY) &&
                    localStorage.getItem(STATUS_KEY)
                ) {
                    panel.remove();
                } else {
                    alert(
                        "You must save the settings before closing."
                    );
                }
            });
    }

    // ================= INPUT FILL =================

    function fill(selector, value) {
        const element = document.querySelector(selector);

        if (!element) {
            return false;
        }

        element.focus();

        element.value = value;

        element.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        element.dispatchEvent(
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

    // ================= MAIN SCRIPT =================

    function runScript() {
        const disputeUser = localStorage.getItem(USER_KEY);
        const disputeStatus = localStorage.getItem(STATUS_KEY);

        if (!disputeUser || !disputeStatus) {
            return;
        }

        const ownerSelector =
            "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > ng-select > div > div > div.ng-input > input[type=text]";

        const noteSelector =
            "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > ng-select > div > div > div.ng-input > input[type=text]";

        fill(ownerSelector, disputeUser);

        setTimeout(function () {
            fill(noteSelector, disputeStatus);
        }, 0);
    }
})();
