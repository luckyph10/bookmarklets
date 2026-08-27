(async function () {
    try {
        // =====================================================
        // READ CLIPBOARD
        // =====================================================

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

        // =====================================================
        // CONVERT ID TO URL
        // =====================================================

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

        // =====================================================
        // CREATE VALID URL LIST
        // =====================================================

        const urls = items
            .map(item => ({
                item: item,
                url: getUrl(item)
            }))
            .filter(x => x.url);

        if (!urls.length) {
            console.error(
                "No valid App IDs or Dispute IDs found."
            );
            return;
        }

        // =====================================================
        // CREATE APPID BUTTON
        // =====================================================

        function createAppIdButton() {

            // Don't create it twice
            if (
                document.getElementById(
                    "floating-appid-button"
                )
            ) {
                return;
            }

            const button = document.createElement("button");

            button.id = "floating-appid-button";
            button.textContent = "APPID";

            button.style.position = "fixed";
            button.style.top = "20px";
            button.style.right = "20px";
            button.style.zIndex = "2147483647";

            button.style.padding = "10px 18px";
            button.style.background = "#007bff";
            button.style.color = "#ffffff";

            button.style.border = "none";
            button.style.borderRadius = "6px";

            button.style.fontSize = "14px";
            button.style.fontWeight = "bold";

            button.style.cursor = "pointer";

            button.style.boxShadow =
                "0 2px 8px rgba(0,0,0,0.3)";

            button.style.display = "block";
            button.style.visibility = "visible";
            button.style.opacity = "1";

            // =================================================
            // APPID BUTTON CLICK
            // =================================================

            button.addEventListener("click", function () {

                // Load your singleappid.js
                const script =
                    document.createElement("script");

                script.src =
                    "https://luckyph10.github.io/bookmarklets/singleappid.js?" +
                    Date.now();

                document.head.appendChild(script);

                // NEVER hide the button
                button.style.display = "block";
                button.style.visibility = "visible";
                button.style.opacity = "1";
            });

            document.body.appendChild(button);
        }

        // =====================================================
        // DISPUTE DETECTION
        // =====================================================

        const firstIsDispute =
            /^DISP-\d+$/i.test(urls[0].item);

        // =====================================================
        // IF FIRST ITEM IS A DISPUTE
        // =====================================================

        if (firstIsDispute) {

            // Create APPID button FIRST
            createAppIdButton();

            // Open dispute in a NEW TAB
            const disputeTab =
                window.open(urls[0].url, "_blank");

            if (!disputeTab) {
                console.error(
                    "The browser blocked the new tab. Please allow popups for this site."
                );
                return;
            }

            // Keep APPID button in this tab
            // Do NOT navigate this tab away.
        }

        // =====================================================
        // IF FIRST ITEM IS AN APP ID
        // =====================================================

        else {

            // Original behavior:
            // first App ID → current tab
            window.location.href = urls[0].url;
        }

        // =====================================================
        // REMAINING IDs → NEW TABS
        // =====================================================

        const startIndex = firstIsDispute ? 1 : 1;

        for (let i = startIndex; i < urls.length; i++) {

            window.open(
                urls[i].url,
                "_blank"
            );
        }

    } catch (err) {

        console.error(
            "Something went wrong!",
            err
        );
    }
})();
