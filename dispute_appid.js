(async function () {
    try {
        let clipboardText = await navigator.clipboard.readText();
        clipboardText = clipboardText.trim();

        if (
            clipboardText.startsWith('"') &&
            clipboardText.endsWith('"')
        ) {
            clipboardText = clipboardText.slice(1, -1).trim();
        }

        if (/^\d{1,8}$/.test(clipboardText)) {
            window.location.href =
                "https://arbit.halomd.com/calculator/" + clipboardText;
            return;
        }

        if (/^DISP-\d+$/.test(clipboardText)) {
            window.location.href =
                "https://arbit.halomd.com/dispute/" + clipboardText;
            return;
        }

        console.error("Unrecognized clipboard format:", clipboardText);

    } catch (err) {
        console.error("Something went wrong!", err);
    }
})();
