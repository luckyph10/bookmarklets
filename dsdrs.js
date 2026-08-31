const username = localStorage.getItem("fpy_username");
const accessKey = localStorage.getItem("fpy_key");

if (!username || !accessKey) {

    const existing =
        document.getElementById("fpy-auth-overlay");

    if (existing) {
        throw new Error("Registration Required");
    }

    const overlay = document.createElement("div");

    overlay.id = "fpy-auth-overlay";

    overlay.innerHTML = `

    <div class="fpy-auth-card">

        <button id="fpy-close-btn">✕</button>

        <div class="fpy-logo">🔐</div>

        <h2>Automation Access</h2>

        <div class="fpy-subtitle">
            One-time registration only
        </div>

        <input
            id="fpy-username"
            placeholder="Username">

        <input
            id="fpy-accesskey"
            type="password"
            placeholder="Access Key">

        <button id="fpy-save-btn">
            Save & Continue
        </button>

    </div>

    `;

    const style = document.createElement("style");

    style.textContent = `

    #fpy-auth-overlay{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.75);
        z-index:999999999;
        display:flex;
        justify-content:center;
        align-items:flex-start;
        padding-top:60px;
    }

    .fpy-auth-card{
        width:420px;
        background:#1f1f1f;
        border-radius:22px;
        padding:25px;
        position:relative;
        box-shadow:0 20px 60px rgba(0,0,0,.5);
    }

    #fpy-close-btn{
        position:absolute;
        right:12px;
        top:12px;
        width:32px;
        height:32px;
        border:none;
        border-radius:50%;
        cursor:pointer;
        color:white;
        background:rgba(255,255,255,.08);
    }

    .fpy-logo{
        font-size:40px;
        text-align:center;
        margin-bottom:10px;
    }

    .fpy-auth-card h2{
        color:white;
        text-align:center;
        margin-bottom:5px;
    }

    .fpy-subtitle{
        color:#aaa;
        text-align:center;
        margin-bottom:20px;
        font-size:13px;
    }

    #fpy-username,
    #fpy-accesskey{
        width:100%;
        padding:14px 16px;
        margin-bottom:15px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.15);
        background:rgba(255,255,255,.08);
        color:white;
    }

    #fpy-username::placeholder,
    #fpy-accesskey::placeholder{
        color:#aaa;
    }

    #fpy-save-btn{
        width:100%;
        border:none;
        border-radius:999px;
        padding:14px;
        cursor:pointer;
        color:white;
        font-weight:bold;
        background:linear-gradient(
            135deg,
            #0078d4,
            #00a2ff
        );
    }

    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    document
        .getElementById("fpy-close-btn")
        .onclick = () => {
            overlay.remove();
        };

    document
        .getElementById("fpy-save-btn")
        .onclick = () => {

            const username =
                document
                .getElementById("fpy-username")
                .value
                .trim();

            const accessKey =
                document
                .getElementById("fpy-accesskey")
                .value
                .trim();

            if(!username || !accessKey){

                alert(
                    "Username and Access Key are required."
                );

                return;
            }

            localStorage.setItem(
                "fpy_username",
                username
            );

            localStorage.setItem(
                "fpy_key",
                accessKey
            );

            alert(
                "Registration Successful!"
            );

            overlay.remove();

            location.reload();
        };

    throw new Error("Registration Required");
}

/* AUTH PASSED */
/* YOUR MAIN CODE BELOW */



(function () {
    var KEY = "caseNoteAuthorized";

    if (localStorage.getItem(KEY) !== "yes") {
        var pwd = document.createElement("input");
        pwd.type = "password";
        pwd.placeholder = "Enter password";
        pwd.style.cssText =
            "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999999;padding:10px;font-size:16px;border:2px solid #333;background:#fff;";

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

    function fill(selector, value) {
        var e = document.querySelector(selector);

        if (!e) {
            alert("Element not found:\n" + selector);
            return false;
        }

        e.focus();
        e.value = value;

        e.dispatchEvent(new Event("input", { bubbles: true }));
        e.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true
        }));

        return true;
    }

    function runScript() {
        var owner =
            "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > ng-select > div > div > div.ng-input > input[type=text]";

        var note =
            "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > ng-select > div > div > div.ng-input > input[type=text]";

        fill(owner, "Airrish Dullas");

        setTimeout(function () {
            fill(note, "VOB verified, no change to NSA jurisdiction");
        }, 20);
    }
})();
