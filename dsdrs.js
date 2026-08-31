(function () {

    const USER_KEY = "fpy_username";
    const ACCESS_KEY = "fpy_key";

    const username = localStorage.getItem(USER_KEY);
    const accessKey = localStorage.getItem(ACCESS_KEY);

    if (!username || !accessKey) {

        const overlay = document.createElement("div");

        overlay.innerHTML = `
        <div id="fpy-auth-overlay">

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
            top:12px;
            right:12px;
            width:32px;
            height:32px;
            border:none;
            border-radius:50%;
            cursor:pointer;
            color:#fff;
            background:rgba(255,255,255,.1);
        }

        .fpy-logo{
            font-size:40px;
            text-align:center;
            margin-bottom:10px;
        }

        h2{
            color:white;
            text-align:center;
            margin-bottom:6px;
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
            padding:14px;
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
            padding:14px;
            border:none;
            border-radius:999px;
            cursor:pointer;
            color:#fff;
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

        document.getElementById("fpy-close-btn").onclick = () => {
            overlay.remove();
        };

        document.getElementById("fpy-save-btn").onclick = () => {

            const username =
                document.getElementById("fpy-username")
                .value
                .trim()
                .toLowerCase();

            const accessKey =
                document.getElementById("fpy-accesskey")
                .value
                .trim();

            if (!username || !accessKey) {

                alert(
                    "Username and Access Key are required."
                );

                return;
            }

            localStorage.setItem(
                USER_KEY,
                username
            );

            localStorage.setItem(
                ACCESS_KEY,
                accessKey
            );

            overlay.remove();

            alert(
                "Registration Successful!\n\nClick the bookmarklet again."
            );

        };

        return;
    }

    runScript();

    function fill(selector, value) {

        var e = document.querySelector(selector);

        if (!e) {

            alert(
                "Element not found:\n" +
                selector
            );

            return false;
        }

        e.focus();
        e.value = value;

        e.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );

        e.dispatchEvent(
            new KeyboardEvent(
                "keydown",
                {
                    key: "Enter",
                    code: "Enter",
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                }
            )
        );

        return true;
    }

    function runScript() {

        var owner =
            "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > ng-select > div > div > div.ng-input 
