(function () {
    const AUTH_KEY = "caseNoteAuthorized";
    const USER_KEY = "disputeUser";
    const STATUS_KEY = "disputeReviewStatus";

    const DRS_OPTIONS = [
        "Plan Type Validated Post IDR Initiation",
        "VOB verified, no change to NSA jurisdiction",
        "Timeline Enforcement Submitted to IDRE",
        "Plan Type Objection Submitted",
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
        `;

        document.body.appendChild(pwd);

        pwd.focus();

        pwd.addEventListener("keydown", function (e) {
            if (e.key !== "Enter") return;

            if (pwd.value === "202608") {
                localStorage.setItem(AUTH_KEY, "yes");
                pwd.remove();

                createPanel();
                runScript();
            } else {
                alert("Incorrect password");
                pwd.remove();
            }
        });

        return;
    }

    createPanel();
    runScript();

    // ================= PANEL =================

    function createPanel() {
        const oldPanel = document.getElementById("dispute-panel");

        if (oldPanel) oldPanel.remove();

        const savedUser = localStorage.getItem(USER_KEY) || "";
        const savedStatus = localStorage.getItem(STATUS_KEY) || "";

        const panel = document.createElement("div");

        panel.id = "dispute-panel";

        panel.style.cssText = `
            position:fixed;
            top:10px;
            left:10px;
            width:340px;
            padding:15px;
            background:rgba(0,0,0,.85);
            color:white;
            border-radius:12px;
            z-index:999999;
            font-family:Arial,sans-serif;
            backdrop-filter:blur(8px);
            box-shadow:0 4px 20px rgba(0,0,0,.5);
        `;

        const options = DRS_OPTIONS.map(function (option) {
            return `<option value="${option}">${option}</option>`;
        }).join("");

        panel.innerHTML = `
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:12px;
                font-size:18px;
                font-weight:bold;
            ">
                <span>Dispute Settings</span>

                <span id="saved-status" style="
                    color:${savedUser && savedStatus ? "#00ff00" : "#ff5555"};
                    font-size:12px;
                ">
                    ${savedUser && savedStatus ? "Saved ✓" : "Not Saved"}
                </span>
            </div>

            <div style="margin-bottom:10px;">
                <div style="margin-bottom:5px;">
                    Dispute User
                </div>

                <input
                    id="dispute-user"
                    value="${savedUser}"
                    style="
                        width:100%;
                        padding:8px;
                        box-sizing:border-box;
                        border-radius:6px;
                        border:1px solid #444;
                    "
                >
            </div>

            <div style="margin-bottom:15px;">
                <div style="margin-bottom:5px;">
                    Dispute Review Status
                </div>

                <select
                    id="dispute-status"
                    style="
                        width:100%;
                        padding:8px;
                        box-sizing:border-box;
                        border-radius:6px;
                        border:1px solid #444;
                    "
                >
                    <option value="">Select DRS...</option>

                    ${options}
                </select>
            </div>

            <div style="
                display:flex;
                gap:8px;
            ">
                <button
                    id="save-btn"
                    style="
                        flex:1;
                        padding:10px;
                        border:none;
                        border-radius:6px;
                        background:#00aa55;
                        color:white;
                        cursor:pointer;
                        font-weight:bold;
                    "
                >
                    Save
                </button>

                <button
                    id="edit-btn"
                    style="
                        flex:1;
                        padding:10px;
                        border:none;
                        border-radius:6px;
                        background:#ff8800;
                        color:white;
                        cursor:pointer;
                        font-weight:bold;
                    "
                >
                    Edit
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        const userInput = document.getElementById("dispute-user");
        const statusInput = document.getElementById("dispute-status");

        statusInput.value = savedStatus;

        if (savedUser && savedStatus) {
            userInput.disabled = true;
            statusInput.disabled = true;
        }

        document.getElementById("save-btn").onclick = function () {
            const user = userInput.value.trim();
            const status = statusInput.value;

            if (!user || !status) {
                alert(
                    "You must set both Dispute User and Dispute Review Status before using this script."
                );

                return;
            }

            localStorage.setItem(USER_KEY, user);
            localStorage.setItem(STATUS_KEY, status);

            userInput.disabled = true;
            statusInput.disabled = true;

            document.getElementById("saved-status").textContent = "Saved ✓";
            document.getElementById("saved-status").style.color =
                "#00ff00";

            runScript();
        };

        document.getElementById("edit-btn").onclick = function () {
            userInput.disabled = false;
            statusInput.disabled = false;
        };
    }

    // ================= FILL FUNCTION =================

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

    // ================= MAIN =================

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
        }, 20);
    }
})();
