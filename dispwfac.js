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
    function showToast(message, success = true) {
        const old = document.getElementById("dispwfa-toast");
        if (old) old.remove();

        const toast = document.createElement("div");
        toast.id = "dispwfa-toast";

        toast.innerHTML = `
            <div style="
                display:flex;
                align-items:center;
                gap:10px;
            ">
                <span style="
                    font-size:22px;
                    font-weight:bold;
                ">
                    ${success ? "✅" : "❌"}
                </span>
                <span>${message}</span>
            </div>
        `;

        Object.assign(toast.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            background: success ? "#16a34a" : "#dc2626",
            color: "#fff",
            padding: "14px 18px",
            borderRadius: "10px",
            fontFamily: "Arial,sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
            zIndex: "999999",
            boxShadow: "0 4px 12px rgba(0,0,0,.3)",
            transition: "opacity .3s ease"
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    try {
        const label = [...document.querySelectorAll("*")]
            .find(el => el.textContent.trim() === "DISPUTE NUMBER");

        if (!label) {
            showToast("DISPUTE NUMBER not found", false);
            return;
        }

        let disputeNumber = "";

        if (label.nextElementSibling) {
            disputeNumber = label.nextElementSibling.textContent.trim();
        }

        if (!disputeNumber && label.parentElement) {
            const items = [...label.parentElement.querySelectorAll("*")]
                .map(el => el.textContent.trim())
                .filter(Boolean);

            const idx = items.indexOf("DISPUTE NUMBER");

            if (idx > -1 && items[idx + 1]) {
                disputeNumber = items[idx + 1];
            }
        }

        if (!disputeNumber) {
            showToast("Dispute number not found", false);
            return;
        }

        navigator.clipboard.writeText(disputeNumber)
            .then(() => {
                showToast(`Copied: ${disputeNumber}`, true);
                console.log("Dispute Number:", disputeNumber);
            })
            .catch(() => {
                showToast("Clipboard copy failed", false);
            });

    } catch (e) {
        console.error(e);
        showToast("Script error", false);
    }
})();
