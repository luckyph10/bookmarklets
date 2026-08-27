(function () {
    try {
        const label = [...document.querySelectorAll("*")]
            .find(el => el.textContent.trim() === "DISPUTE NUMBER");

        if (!label) {
            alert("DISPUTE NUMBER label not found.");
            return;
        }

        let disputeNumber = "";

        // Try next sibling first
        if (label.nextElementSibling) {
            disputeNumber = label.nextElementSibling.textContent.trim();
        }

        // Fallback: search within parent
        if (!disputeNumber && label.parentElement) {
            const texts = [...label.parentElement.querySelectorAll("*")]
                .map(el => el.textContent.trim())
                .filter(Boolean);

            const idx = texts.indexOf("DISPUTE NUMBER");
            if (idx > -1 && texts[idx + 1]) {
                disputeNumber = texts[idx + 1];
            }
        }

        if (!disputeNumber) {
            alert("Could not find dispute number.");
            return;
        }

        navigator.clipboard.writeText(disputeNumber)
            .then(() => alert(`Dispute Number Copied:\n${disputeNumber}`))
            .catch(() => alert(`Dispute Number:\n${disputeNumber}`));

    } catch (err) {
        console.error(err);
        alert("Error extracting dispute number.");
    }
})();
