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

        // Create persistent APPID button
        function addAppIdButton() {
            if (document.getElementById("appid-bookmarklet-button")) {
                return;
            }

            const button = document.createElement("button");

            button.id = "appid-bookmarklet-button";
            button.textContent = "APPID";

            Object.assign(button.style, {
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: "2147483647",
                padding: "10px 18px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                opacity: "1",
                display: "block"
            });

            button.addEventListener("click", function () {

                // Keep button visible
                button.style.display = "block";
                button.style.visibility = "visible";
                button.style.opacity = "1";

                // Load singleappid.js
                const script = document.createElement("script");

                script.src =
                    "https://luckyph10.github.io/bookmarklets/singleappid.js?" +
                    Date.now();

                // Keep button after script loads
                script.onload = function () {
                    button.style.display = "block";
                    button.style.visibility = "visible";
                };

                script.onerror = function () {
                    console.error("Failed to load singleappid.js");

                    button.style.display = "block";
                    button.style.visibility = "visible";
                };

                document.head.appendChild(script);
            });

            document.body.appendChild(button);
        }

        // If current page is a dispute page,
        // create the APPID button.
        if (/\/dispute\/DISP-\d+/i.test(window.location.href)) {
            if (document.readyState === "loading") {
                document.addEventListener(
                    "DOMContentLoaded",
                    addAppIdButton
                );
            } else {
                addAppIdButton();
            }
        }

        // Open first URL in current tab
        window.location.href = urls[0].url;

        // Open remaining URLs in new tabs
        for (let i = 1; i < urls.length; i++) {
            window.open(urls[i].url, "_blank");
        }

    } catch (err) {
        console.error("Something went wrong!", err);
    }
})();
