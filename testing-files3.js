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

        // Add APPID button to the current page
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
                padding: "10px 16px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
            });

            button.addEventListener("click", function () {
                const script = document.createElement("script");

                script.src =
                    "https://luckyph10.github.io/bookmarklets/singleappid.js?" +
                    Date.now();

                document.head.appendChild(script);
            });

            document.body.appendChild(button);
        }

        // Open the URLs
        for (let i = 0; i < urls.length; i++) {
            const tab = i === 0
                ? window
                : window.open("about:blank", "_blank");

            if (!tab) {
                console.error("Popup blocked by browser.");
                continue;
            }

            tab.location.href = urls[i].url;

            // For dispute pages, add the APPID button after navigation.
            if (/^DISP-\d+$/i.test(urls[i].item)) {
                if (tab === window) {
                    // Current tab will reload, so the button must be
                    // recreated by this script when the dispute page loads.
                    sessionStorage.setItem("addAppIdButton", "1");
                } else {
                    try {
                        const timer = setInterval(() => {
                            try {
                                if (
                                    tab.document &&
                                    tab.document.readyState === "complete"
                                ) {
                                    clearInterval(timer);

                                    const buttonScript = `
                                        (() => {
                                            if (document.getElementById("appid-bookmarklet-button")) return;

                                            const button = document.createElement("button");
                                            button.id = "appid-bookmarklet-button";
                                            button.textContent = "APPID";

                                            Object.assign(button.style, {
                                                position: "fixed",
                                                top: "20px",
                                                right: "20px",
                                                zIndex: "2147483647",
                                                padding: "10px 16px",
                                                background: "#007bff",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                                            });

                                            button.onclick = () => {
                                                const script = document.createElement("script");
                                                script.src =
                                                    "https://luckyph10.github.io/bookmarklets/singleappid.js?" +
                                                    Date.now();
                                                document.head.appendChild(script);
                                            };

                                            document.body.appendChild(button);
                                        })();
                                    `;

                                    tab.eval(buttonScript);
                                }
                            } catch (e) {
                                // Wait until the dispute page is accessible.
                            }
                        }, 500);
                    } catch (e) {
                        console.error("Could not add APPID button:", e);
                    }
                }
            }
        }

        // If this script runs again on the dispute page,
        // create the button.
        if (sessionStorage.getItem("addAppIdButton") === "1") {
            sessionStorage.removeItem("addAppIdButton");

            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", addAppIdButton);
            } else {
                addAppIdButton();
            }
        }

    } catch (err) {
        console.error("Something went wrong!", err);
    }
})();
