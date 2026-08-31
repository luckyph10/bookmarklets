(async () => {

const CONFIG_URL =
"https://luckyph10.github.io/feeling_pogi_yarn/users.json";

const cfg = await fetch(CONFIG_URL)
    .then(r => r.json());

const username =
    localStorage.getItem("fpy_username");

const accessKey =
    localStorage.getItem("fpy_key");

if (!username || !accessKey) {

    alert(
        "Please register first.\n\n" +
        "Open users.html and save your credentials."
    );

    return;
}

const user = cfg.users.find(
    x => x.username.toLowerCase() === username.toLowerCase()
);

if (!user) {
    alert("User not found.");
    return;
}

if (!user.enabled) {
    alert("Access Disabled.");
    return;
}

let validKey = false;

switch(cfg.settings.mode){

    case "global":
        validKey =
            accessKey === cfg.settings.globalKey;
        break;

    case "personal":
        validKey =
            accessKey === user.key;
        break;

    case "mixed":
        validKey =
            accessKey === cfg.settings.globalKey ||
            accessKey === user.key;
        break;
}

if (!validKey){
    alert("Invalid Key.");
    return;
}

console.log(
    "Authenticated:",
    username
);

/* PUT THE REST OF YOUR
   AUTOMATION CODE BELOW */

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
