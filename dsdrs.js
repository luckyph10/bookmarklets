const username = localStorage.getItem("fpy_username");
const accessKey = localStorage.getItem("fpy_key");

if (!username || !accessKey) {

    if (document.getElementById("fpy-auth-overlay")) {
        throw new Error("Registration Required");
    }

    const overlay = document.createElement("div");
    overlay.id = "fpy-auth-overlay";

    const modal = document.createElement("div");
    modal.className = "fpy-modal";

    const closeBtn = document.createElement("button");
    closeBtn.className = "fpy-close-btn";
    closeBtn.innerHTML = "✕";

    const iframe = document.createElement("iframe");

    iframe.src =
    "https://luckyph10.github.io/feeling_pogi_yarn/users.html";

    modal.appendChild(closeBtn);
    modal.appendChild(iframe);

    overlay.appendChild(modal);

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

    .fpy-modal{
        width:500px;
        height:550px;
        position:relative;
        border-radius:20px;
        overflow:hidden;
        background:transparent;
        box-shadow:0 20px 60px rgba(0,0,0,.5);
    }

    .fpy-modal iframe{
        width:100%;
        height:100%;
        border:none;
        background:transparent;
    }

    .fpy-close-btn{
        position:absolute;
        top:10px;
        right:10px;
        width:35px;
        height:35px;
        border:none;
        border-radius:50%;
        background:rgba(255,255,255,.15);
        color:#fff;
        cursor:pointer;
        font-size:18px;
        z-index:999999;
    }

    .fpy-close-btn:hover{
        background:rgba(255,255,255,.25);
    }

    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    closeBtn.onclick = () => {
        overlay.remove();
    };

    throw new Error("Registration Required");
}

/* ===================================
   AUTH PASSED
   PUT YOUR MAIN AUTOMATION BELOW
=================================== */



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
