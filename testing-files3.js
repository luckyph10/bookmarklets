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

        // Create APPID button
        function addAppIdButton() {
            if (document.getElementById("appid-button")) {
                return;
            }

            const button = document.createElement("button");

            button.id = "appid-button";
            button.innerText = "APPID";

            Object.assign(button.style, {
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: "2147483647",
                padding: "10px 18px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                display: "block",
                visibility: "visible"
            });

            button.onclick = function () {
                // Load singleappid.js WITHOUT removing the button
                const script = document.createElement("script");

                script.src =
                    "https://luckyph10.github.io/bookmarklets/singleappid.js?" +
                    Date.now();

                document.head.appendChild(script);

                // Make absolutely sure button stays visible
                button.style.display = "block";
                button.style.visibility = "visible";
            };

            document.body.appendChild(button);
        }

        // If this is a dispute page, show APPID
        if (/\/dispute\/DISP-\d+/i.test(window.location.href)) {
            if (document.readyState === "loading") {
                document.addEventListener(
                    "DOMContentLoaded",
                    addAppIdButton
                );
            } else {
                addAppIdButton();
            }

            return;
        }

        // Mark that the next dispute page needs the APPID button
        const disputeUrls = urls.filter(x =>
            /^DISP-\d+$/i.test(x.item)
        );

        if (disputeUrls.length) {
            localStorage.setItem(
                "showAppIdButton",
                "true"
            );
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
