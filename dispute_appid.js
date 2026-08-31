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

(async function () {
    try {
        let clipboardText = await navigator.clipboard.readText();
        clipboardText = clipboardText.trim();

        // Remove surrounding quotes
        if (
            clipboardText.startsWith('"') &&
            clipboardText.endsWith('"')
        ) {
            clipboardText = clipboardText.slice(1, -1).trim();
        }

        // Split by newline, spaces, commas, tabs, or semicolons
        const items = clipboardText
            .split(/[\s,;]+/)
            .map(item => item.replace(/^"|"$/g, "").trim())
            .filter(Boolean);

        if (!items.length) {
            console.error("Clipboard is empty.");
            return;
        }

        // Convert an ID into its URL
        function getUrl(item) {
            // App ID
            if (/^\d{1,8}$/.test(item)) {
                return `https://arbit.halomd.com/calculator/${item}`;
            }

            // Dispute ID
            if (/^DISP-\d+$/i.test(item)) {
                return `https://arbit.halomd.com/dispute/${item}`;
            }

            return null;
        }

        // Create valid URLs
        const urls = items
            .map(item => ({
                item,
                url: getUrl(item)
            }))
            .filter(x => x.url);

        if (!urls.length) {
            console.error("No valid App IDs or Dispute IDs found.");
            return;
        }

        // First ID → current tab
        window.location.href = urls[0].url;

        // Remaining IDs → new tabs
        for (let i = 1; i < urls.length; i++) {
            window.open(urls[i].url, "_blank");
        }

    } catch (err) {
        console.error("Something went wrong!", err);
    }
})();
