(async () => {
    const state = prompt("Enter State:");
    if (state === null) return;

    const stateValue = state.trim().toUpperCase();

    const disputeNumber = document
        .querySelector(
            "#ngForm fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input"
        )
        ?.value?.trim();

    const disputeStatus =
        document
            .querySelector(
                "#ngForm fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > ng-select"
            )
            ?.querySelector(".ng-value-label")
            ?.textContent?.trim() ||
        document
            .querySelector(
                "#ngForm fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > ng-select"
            )
            ?.textContent?.trim() ||
        "";

    const planValue =
        document
            .querySelector(
                "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ng-select"
            )
            ?.querySelector(".ng-value-label")
            ?.innerText?.trim() ||
        document
            .querySelector(
                "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ng-select"
            )
            ?.querySelector(".ng-value")
            ?.innerText?.trim() ||
        document
            .querySelector(
                "#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > ng-select"
            )
            ?.innerText?.trim() ||
        "";

    const ids = [...document.querySelectorAll("#table-body tr td:nth-child(2)")]
        .map((td) => td.textContent.trim())
        .filter(Boolean);

    const planTypes = [...document.querySelectorAll('[id^="planType_"]')]
        .map((el) => (el.innerText || el.textContent || el.value || "").trim())
        .filter(Boolean);

    if (!disputeNumber || !disputeStatus || !ids.length) return;

    const sameId = ids.every((id) => id === ids[0]);

    const output = sameId
        ? `${planTypes[0] || ""}\t${disputeNumber}\t${ids[0]}\t${disputeStatus}\t\t\t\t\t${planValue}\t\t\t${stateValue}`
        : ids
              .map(
                  (id, i) =>
                      `${planTypes[i] || planTypes[0] || ""}\t${disputeNumber}\t${id}\t${disputeStatus}\t\t\t\t\t${planValue}\t\t\t${stateValue}`
              )
              .join("\n");

    try {
        await navigator.clipboard.writeText(output);

        const rowCount = sameId ? 1 : ids.length;

        const t = document.createElement("div");
        t.innerHTML = `✅ Copied ${rowCount} row${rowCount !== 1 ? "s" : ""} | State: ${stateValue}`;

        t.style.cssText =
            "position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:14px;background:rgba(0,0,0,.35);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;font:600 14px Arial,sans-serif;z-index:2147483647;box-shadow:0 8px 32px rgba(0,0,0,.25)";

        document.body.appendChild(t);

        setTimeout(() => {
            t.style.transition = "opacity .3s";
            t.style.opacity = "0";

            setTimeout(() => t.remove(), 300);
        }, 3000);
    } catch (e) {
        console.error(e);
    }
})();
