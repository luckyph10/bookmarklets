(async function () {
    try {
        // =====================================================
        // REMOVE EXISTING POPUP IF ALREADY PRESENT
        // =====================================================

        const existingPopup = document.getElementById("openAppIdPopup");
        if (existingPopup) {
            existingPopup.remove();
        }

        // =====================================================
        // CREATE POPUP CONTAINER
        // =====================================================

        const popup = document.createElement("div");
        popup.id = "openAppIdPopup";

        popup.style.position = "fixed";
        popup.style.top = "10px";
        popup.style.left = "10px";
        popup.style.zIndex = "999999999";

        popup.style.display = "flex";
        popup.style.alignItems = "center";
        popup.style.gap = "6px";

        popup.style.padding = "8px";
        popup.style.background = "#222";
        popup.style.borderRadius = "8px";
        popup.style.boxShadow = "0 3px 15px rgba(0,0,0,0.4)";

        popup.style.fontFamily = "Arial, sans-serif";

        // =====================================================
        // CREATE DROPDOWN
        // =====================================================

        const select = document.createElement("select");
        select.id = "openAppIdSelect";

        select.style.minWidth = "160px";
        select.style.maxWidth = "300px";

        select.style.padding = "9px 10px";
        select.style.border = "none";
        select.style.borderRadius = "5px";

        select.style.background = "#fff";
        select.style.color = "#222";

        select.style.fontSize = "14px";
        select.style.cursor = "pointer";
        select.style.outline = "none";

        // =====================================================
        // CREATE OPEN BUTTON
        // =====================================================

        const openButton = document.createElement("button");
        openButton.id = "openAppIdButton";
        openButton.textContent = "OPEN APPID";

        openButton.style.padding = "9px 14px";
        openButton.style.border = "none";
        openButton.style.borderRadius = "5px";

        openButton.style.background = "#007bff";
        openButton.style.color = "#fff";

        openButton.style.fontSize = "14px";
        openButton.style.fontWeight = "bold";

        openButton.style.cursor = "pointer";
        openButton.style.whiteSpace = "nowrap";

        openButton.addEventListener("mouseenter", function () {
            if (!openButton.disabled) {
                openButton.style.background = "#0056b3";
            }
        });

        openButton.addEventListener("mouseleave", function () {
            if (!openButton.disabled) {
                openButton.style.background = "#007bff";
            }
        });

        // =====================================================
        // CREATE REFRESH BUTTON
        // =====================================================

        const refreshButton = document.createElement("button");
        refreshButton.id = "refreshAppIdButton";
        refreshButton.textContent = "↻";

        refreshButton.title = "Refresh IDs from clipboard";

        refreshButton.style.width = "32px";
        refreshButton.style.height = "32px";

        refreshButton.style.border = "none";
        refreshButton.style.borderRadius = "5px";

        refreshButton.style.background = "#444";
        refreshButton.style.color = "#fff";

        refreshButton.style.fontSize = "18px";
        refreshButton.style.cursor = "pointer";

        refreshButton.addEventListener("mouseenter", function () {
            refreshButton.style.background = "#555";
        });

        refreshButton.addEventListener("mouseleave", function () {
            refreshButton.style.background = "#444";
        });

        // =====================================================
        // ADD ELEMENTS TO POPUP
        // =====================================================

        popup.appendChild(select);
        popup.appendChild(openButton);
        popup.appendChild(refreshButton);

        document.body.appendChild(popup);

        // =====================================================
        // CONVERT ID INTO URL
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
        // LOAD IDS FROM CLIPBOARD
        // =====================================================

        async function loadIds() {
            try {
                // Clear dropdown
                select.innerHTML = "";

                // Read clipboard
                let clipboardText = await navigator.clipboard.readText();
                clipboardText = clipboardText.trim();

                // Remove surrounding quotes
                if (
                    clipboardText.startsWith('"') &&
                    clipboardText.endsWith('"')
                ) {
                    clipboardText = clipboardText.slice(1, -1).trim();
                }

                // Split by:
                // newline
                // spaces
                // commas
                // tabs
                // semicolons

                const items = clipboardText
                    .split(/[\s,;]+/)
                    .map(item =>
                        item
                            .replace(/^"|"$/g, "")
                            .trim()
                    )
                    .filter(Boolean);

                if (!items.length) {
                    const option = document.createElement("option");
                    option.value = "";
                    option.textContent = "Clipboard empty";

                    select.appendChild(option);

                    openButton.disabled = true;
                    openButton.style.background = "#777";

                    return;
                }

                // =================================================
                // CREATE VALID URLS
                // =================================================

                const urls = items
                    .map(item => ({
                        item: item,
                        url: getUrl(item)
                    }))
                    .filter(x => x.url);

                if (!urls.length) {
                    const option = document.createElement("option");
                    option.value = "";
                    option.textContent = "No valid ID";

                    select.appendChild(option);

                    openButton.disabled = true;
                    openButton.style.background = "#777";

                    return;
                }

                // =================================================
                // ADD VALID IDS TO DROPDOWN
                // =================================================

                urls.forEach((entry) => {
                    const option = document.createElement("option");

                    option.value = entry.url;
                    option.textContent = entry.item;

                    select.appendChild(option);
                });

                // Select first ID
                select.selectedIndex = 0;

                // Enable button
                openButton.disabled = false;
                openButton.style.background = "#007bff";

                console.log("Loaded IDs:", urls);

            } catch (err) {
                console.error("Unable to read clipboard:", err);

                select.innerHTML = "";

                const option = document.createElement("option");
                option.value = "";
                option.textContent = "Clipboard unavailable";

                select.appendChild(option);

                openButton.disabled = true;
                openButton.style.background = "#777";
            }
        }

        // =====================================================
        // LOAD CLIPBOARD IDS
        // =====================================================

        await loadIds();

        // =====================================================
        // OPEN SELECTED ID
        // =====================================================

        openButton.addEventListener("click", function () {
            const selectedUrl = select.value;

            if (!selectedUrl) {
                return;
            }

            // Open ONLY the selected ID in a new tab
            window.open(selectedUrl, "_blank");
        });

        // =====================================================
        // REFRESH DROPDOWN
        // =====================================================

        refreshButton.addEventListener("click", async function () {
            await loadIds();
        });

        // =====================================================
        // LOG SELECTED ID
        // =====================================================

        select.addEventListener("change", function () {
            const selectedOption =
                select.options[select.selectedIndex];

            if (selectedOption) {
                console.log(
                    "Selected ID:",
                    selectedOption.textContent
                );
            }
        });

    } catch (err) {
        console.error("Something went wrong!", err);
    }
})();
