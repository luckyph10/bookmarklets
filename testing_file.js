(async function () {
    try {
        let clipboardText = await navigator.clipboard.readText();

        // Remove surrounding quotes if they exist
        clipboardText = clipboardText.trim();

        if (
            clipboardText.startsWith('"') &&
            clipboardText.endsWith('"')
        ) {
            clipboardText = clipboardText.slice(1, -1).trim();
        }

        // Split by new lines, spaces, commas, tabs, or semicolons
        const items = clipboardText
            .split(/[\s,;]+/)
            .map(item => item.replace(/^"|"$/g, "").trim())
            .filter(Boolean);

        if (!items.length) {
            console.error("Clipboard is empty.");
            return;
        }

        items.forEach(item => {
            let url = null;

            // App ID (1-8 digits)
            if (/^\d{1,8}$/.test(item)) {
                url = `https://arbit.halomd.com/calculator/${item}`;
            }

            // Dispute ID
            else if (/^DISP-\d+$/i.test(item)) {
                url = `https://arbit.halomd.com/dispute/${item}`;
            }

            if (url) {
                window.open(url, "_blank");
            } else {
                console.error("Unrecognized format:", item);
            }
        });

    } catch (err) {
        console.error("Something went wrong!", err);
    }
})();
