


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
