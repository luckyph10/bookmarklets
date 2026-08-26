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

        // Split IDs
        const items = clipboardText
            .split(/[\s,;]+/)
            .map(item => item.replace(/^"|"$/g, "").trim())
            .filter(Boolean);

        if (!items.length) {
            console.error("Clipboard is empty.");
            return;
        }

        // Convert ID to URL
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

        // =====================================================
        // APPID BUTTON
        // =====================================================

        function addAppIdButton() {
            if (!document.body) {
                setTimeout(addAppIdButton, 100);
                return;
            }

            // Don't create duplicates
            if (document.getElementById("appid-floating-button")) {
                return;
            }

            const button = document.createElement("button");

            button.id = "appid-floating-button";
            button.textContent = "APPID";

            button.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                z-index: 2147483647 !important;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                padding: 10px 18px !important;
                background: #007bff !important;
                color: white !important;
                border: 0 !important;
                border-radius: 6px !important;
                font-size: 14px !important;
                font-weight: bold !important;
                cursor: pointer !important;
                box-shadow: 0 2px 8px rgba(0,0,0,.3) !important;
            `;

            button.onclick = function () {
                const script = document.createElement("script");

                script.src =
                    "https://luckyph10.github.io/bookmarklets/singleappid.js?" +
                    Date.now();

                document.head.appendChild(script);

                // Keep APPID visible
                button.style.display = "block";
                button.style.visibility = "visible";
                button.style.opacity = "1";
            };

            document.body.appendChild(button);
        }

        // =====================================================
        // IF ALREADY ON A DISPUTE PAGE
        // =====================================================

        if (/\/dispute\/DISP-\d+/i.test(location.href)) {
            addAppIdButton();
            return;
        }

        // =====================================================
        // OPEN URLs
        // =====================================================

        // First URL → current tab
        window.location.href = urls[0].url;

        // Remaining URLs → new tabs
        for (let i = 1; i < urls.length; i++) {
            setTimeout(() => {
                window.open(urls[i].url, "_blank");
            }, 100);
        }

    } catch (err) {
        console.error("Something went wrong!", err);
    }
})();
