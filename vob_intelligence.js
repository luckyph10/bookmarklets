javascript
(function () {
    "use strict";

    /* ==========================================
       SELECTORS
    ========================================== */

    const openerSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.small.text-muted.d-inline-flex.align-items-center.gap-1.user-select-none";

    const openContentSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show";

    const primaryPlanSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > select";

    const secondaryPlanSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7) > select";

    const historyTextSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.d-flex.flex-wrap.gap-3.mb-1 > span:nth-child(1), " +
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.text-muted.fst-italic";

    /* ==========================================
       SELF-FUNDED KEYWORDS
    ========================================== */

    const selfFundedKeywords = [
        "self funded",
        "self-funded",
        "self insured",
        "self-insured",
        "unitedhealthcare choice plus",
        "united healthcare choice",
        "uhc choice plus",
        "ucqn",
        "umr",
        "boon chapman",
        "boon-chapman",
        "allied benefit systems",
        "oa managed choice pos",
        "aso",
        "meritain",
        "uhss",
        "commercial plans can have tiers with self funded",
        "n859",
        "n860",
        "n862",
        "n863",
        "n864",
        "n865",
        "n866",
        "n869",
        "n870",
        "n874",
        "n875",
        "n876",
        "n877",
        "253",
        "ma44",
        "n599",
        "n858",
        "n867",
        "n871",
        "n883",
        "t97"
    ];

    /* ==========================================
       GET SELECTED PLAN TEXT
    ========================================== */

    function getSelectedPlan(selectElement) {
        if (!selectElement) {
            return "";
        }

        if (
            selectElement.options &&
            selectElement.selectedIndex >= 0 &&
            selectElement.options[selectElement.selectedIndex]
        ) {
            return (
                selectElement.options[selectElement.selectedIndex].text || ""
            ).trim();
        }

        return (selectElement.value || "").trim();
    }

    /* ==========================================
       GET HISTORY TEXT
    ========================================== */

    function getHistoryText() {
        let text = "";

        document
            .querySelectorAll(historyTextSelector)
            .forEach(function (element) {
                text += " " + (element.innerText || element.textContent || "");
            });

        return text.trim().toLowerCase();
    }

    /* ==========================================
       CHECK SELF-FUNDED KEYWORDS
    ========================================== */

    function findSelfFundedEvidence(text) {
        for (let i = 0; i < selfFundedKeywords.length; i++) {
            const keyword = selfFundedKeywords[i];

            if (text.indexOf(keyword.toLowerCase()) > -1) {
                return keyword;
            }
        }

        return "";
    }

    /* ==========================================
       CALCULATE AGE
    ========================================== */

    function calculateAge(dobValue) {
        const dobDate = new Date(dobValue);

        if (isNaN(dobDate.getTime())) {
            return null;
        }

        const today = new Date();

        let age =
            today.getFullYear() -
            dobDate.getFullYear();

        if (
            today.getMonth() < dobDate.getMonth() ||
            (
                today.getMonth() === dobDate.getMonth() &&
                today.getDate() < dobDate.getDate()
            )
        ) {
            age--;
        }

        return age;
    }

    /* ==========================================
       MAIN LOGIC
    ========================================== */

    function runLogic() {
        /* --------------------------------------
           DOB
        -------------------------------------- */

        const dob = document.querySelector("#DOB");

        if (!dob) {
            alert("DOB not found");
            return;
        }

        const dobValue =
            dob.value ||
            dob.textContent ||
            dob.innerText ||
            "";

        const age = calculateAge(dobValue);

        if (age === null) {
            alert("Invalid DOB");
            return;
        }

        /* --------------------------------------
           PLAN TYPES
        -------------------------------------- */

        const primaryPlan =
            document.querySelector(primaryPlanSelector);

        const secondaryPlan =
            document.querySelector(secondaryPlanSelector);

        let planType =
            getSelectedPlan(primaryPlan) || "Unknown";

        const secondaryPlanType =
            getSelectedPlan(secondaryPlan);

        /* --------------------------------------
           HISTORY TEXT
        -------------------------------------- */

        const text = getHistoryText();

        /* --------------------------------------
           PLAN TYPE MATCHING
        -------------------------------------- */

        let ptMatch = false;
        let matchedEvidence = "";

        /*
         * PRIMARY PLAN
         */

        if (
            planType.toLowerCase() === "self funded" ||
            planType.toLowerCase() === "self funded (opt out)"
        ) {
            const evidence =
                findSelfFundedEvidence(text);

            if (evidence) {
                ptMatch = true;
                matchedEvidence = evidence;
            }

        } else if (
            planType !== "Unknown" &&
            planType !== ""
        ) {
            if (
                text.indexOf(
                    planType.toLowerCase()
                ) > -1
            ) {
                ptMatch = true;
                matchedEvidence = planType;
            }
        }

        /*
         * SECONDARY PLAN FALLBACK
         *
         * If the primary plan did not match,
         * check the secondary plan.
         */

        if (
            !ptMatch &&
            secondaryPlanType &&
            secondaryPlanType !== "Unknown"
        ) {
            /*
             * Direct secondary-plan match
             */

            if (
                text.indexOf(
                    secondaryPlanType.toLowerCase()
                ) > -1
            ) {
                ptMatch = true;
                matchedEvidence =
                    secondaryPlanType;
            }

            /*
             * Self-funded keyword fallback
             */

            if (!ptMatch) {
                const evidence =
                    findSelfFundedEvidence(text);

                if (evidence) {
                    ptMatch = true;
                    matchedEvidence = evidence;
                }
            }
        }

        /* --------------------------------------
           COLORS
        -------------------------------------- */

        const ageColor =
            age >= 65
                ? "#ff4d4f"
                : "#2ecc71";

        const ptColor =
            ptMatch
                ? "#2ecc71"
                : "#ff4d4f";

        /* --------------------------------------
           REMOVE EXISTING POPUP
        -------------------------------------- */

        const oldPopup =
            document.getElementById(
                "agePopupBookmarklet"
            );

        if (oldPopup) {
            oldPopup.remove();
        }

        /* --------------------------------------
           CREATE POPUP
        -------------------------------------- */

        const popup =
            document.createElement("div");

        popup.id =
            "agePopupBookmarklet";

        popup.style.cssText =
            "position:fixed;" +
            "top:100px;" +
            "left:50%;" +
            "transform:translateX(-50%);" +
            "background:rgba(0,0,0,.92);" +
            "color:#fff;" +
            "padding:20px 24px;" +
            "border-radius:16px;" +
            "z-index:99999999;" +
            "font-family:Segoe UI,Arial,sans-serif;" +
            "box-shadow:0 10px 30px rgba(0,0,0,.4);" +
            "max-width:500px;" +
            "min-width:280px;" +
            "box-sizing:border-box;";

        popup.innerHTML =
            '<button ' +
            'type="button" ' +
            'style="' +
            'position:absolute;' +
            'top:5px;' +
            'right:10px;' +
            'background:none;' +
            'border:none;' +
            'color:#fff;' +
            'font-size:20px;' +
            'cursor:pointer;' +
            'line-height:1;' +
            '">×</button>' +

            '<div style="' +
            'font-size:24px;' +
            'font-weight:bold;' +
            'display:flex;' +
            'align-items:center;' +
            'gap:10px;' +
            'padding-right:20px;' +
            '">' +
            'AGE: ' +
            age +
            ' <span style="' +
            'width:14px;' +
            'height:14px;' +
            'border-radius:50%;' +
            'background:' +
            ageColor +
            ';' +
            'display:inline-block;' +
            'flex-shrink:0;' +
            '"></span>' +
            '</div>' +

            '<div style="' +
            'margin-top:10px;' +
            'font-size:24px;' +
            'font-weight:bold;' +
            'display:flex;' +
            'align-items:center;' +
            'gap:10px;' +
            'padding-right:20px;' +
            '">' +
            'PT: ' +
            escapeHtml(planType) +
            ' <span style="' +
            'width:14px;' +
            'height:14px;' +
            'border-radius:50%;' +
            'background:' +
            ptColor +
            ';' +
            'display:inline-block;' +
            'flex-shrink:0;' +
            '"></span>' +
            '</div>' +

            (
                matchedEvidence
                    ? '<div style="' +
                      'margin-top:8px;' +
                      'font-size:14px;' +
                      'color:#90ee90;' +
                      'word-break:break-word;' +
                      '">Evidence: ' +
                      escapeHtml(matchedEvidence) +
                      '</div>'
                    : ''
            );

        document.body.appendChild(popup);

        /* --------------------------------------
           CLOSE BUTTON
        -------------------------------------- */

        const closeButton =
            popup.querySelector("button");

        if (closeButton) {
            closeButton.onclick = function () {
                popup.remove();
            };
        }

        /* --------------------------------------
           AUTO CLOSE
        -------------------------------------- */

        setTimeout(function () {
            const currentPopup =
                document.getElementById(
                    "agePopupBookmarklet"
                );

            if (currentPopup) {
                currentPopup.remove();
            }
        }, 7000);
    }

    /* ==========================================
       HTML ESCAPE
       Prevents plan/evidence text from being
       interpreted as HTML.
    ========================================== */

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* ==========================================
       OPEN VOB HISTORY IF NECESSARY
    ========================================== */

    const alreadyOpen =
        document.querySelector(
            openContentSelector
        );

    if (alreadyOpen) {
        runLogic();
        return;
    }

    const opener =
        document.querySelector(
            openerSelector
        );

    if (opener) {
        opener.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        opener.click();

        /*
         * Give Angular/Bootstrap time to
         * render the expanded history.
         */

        setTimeout(function () {
            runLogic();
        }, 250);

    } else {
        runLogic();
    }

})();
