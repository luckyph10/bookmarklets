(async () => {

const CONFIG_URL =
"https://luckyph10.github.io/feeling_pogi_yarn/users.json";

const username =
localStorage.getItem("fpy_username");

const accessKey =
localStorage.getItem("fpy_key");

/* no credentials */

if(!username || !accessKey){

    alert(
        "Setup Required.\n\nPlease complete registration."
    );

    window.open(
        "https://luckyph10.github.io/feeling_pogi_yarn/users.html",
        "_blank"
    );

    return;
}

/* load users */

const cfg = await fetch(CONFIG_URL)
.then(r => r.json());

const user = cfg.users.find(
u => u.username.toLowerCase() ===
username.toLowerCase()
);

/* user not found */

if(!user){

    alert(
        "Access denied.\nUser not found."
    );

    return;
}

/* disabled */

if(user.enabled !== true){

    alert(
        "Your account has been disabled."
    );

    return;
}

/*
ACCESS KEY MODES

mixed
- User can use either the Global Key or their Personal Key.

personal
- User can only use their assigned Personal Key.
- Global Key will not work.

global
- User can only use the Global Key.
- Personal Keys will not work.
*/

let validKey = false;

switch(cfg.settings.mode){

    case "global":

        validKey =
        accessKey ===
        cfg.settings.globalKey;

    break;

    case "personal":

        validKey =
        accessKey === user.key;

    break;

    case "mixed":

        validKey =
        accessKey === user.key ||
        accessKey === cfg.settings.globalKey;

    break;
}

if(!validKey){

    alert(
        "Invalid Access Key."
    );

    return;
}

/* AUTHORIZED */

console.log(
    "Authorized User:",
    username
);

/* ==========================
   YOUR AUTOMATION CODE BELOW
   ========================== */



})();



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
