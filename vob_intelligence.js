(function () {

    const openerSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.small.text-muted.d-inline-flex.align-items-center.gap-1.user-select-none";

    const openContentSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show";

    const caseNotesSelector =
        "#ngForm > fieldset > div:nth-child(24) > div.collapse.show > div > div:nth-child(3) > div > div > table > tbody";

    const caseNotesButtonSelector =
        "#ngForm > fieldset > div:nth-child(24) > div.d-flex.mb-2 > button";

    /* Ineligibility Reasons textarea */
    const ineligibilityReasonsSelector =
        "#ngForm > fieldset > div:nth-child(15) > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > textarea";

    /* State selector */
    const stateSelector =
        "#ngForm > fieldset > div:nth-child(15) > div:nth-child(3) > div.col-lg-6.justify-content-end.mb-4 > div:nth-child(1) > select";


    function runLogic() {

        var dob = document.querySelector("#DOB");

        if (!dob) {
            alert("DOB not found");
            return;
        }

        var dobValue =
            dob.value ||
            dob.textContent ||
            dob.innerText;

        var dobDate = new Date(dobValue);

        if (isNaN(dobDate)) {
            alert("Invalid DOB");
            return;
        }

        var today = new Date();

        var age =
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

        var planType = "Unknown";


        /* ==========================================
           PLAN TYPE
           ========================================== */

        var plan = Array.from(
            document.querySelectorAll("select")
        ).find(function (s) {

            return (
                s.parentElement &&
                s.parentElement.innerText.indexOf("Plan Type") > -1
            );

        });

        if (plan) {

            planType =
                plan.options[plan.selectedIndex].text;

        }


        /* ==========================================
           STATE
           ========================================== */

        var state = "Unknown";

        var stateElement =
            document.querySelector(
                stateSelector
            );

        if (stateElement) {

            state =
                stateElement.selectedOptions[0]?.text ||
                stateElement.value ||
                "Unknown";

            state =
                state.trim();

        }


        /* ==========================================
           BIFURCATED STATES
           ========================================== */

        var bifurcatedStates = [
            "Alaska",
            "California",
            "Colorado",
            "Connecticut",
            "Delaware",
            "Florida",
            "Georgia",
            "Illinois",
            "Maine",
            "Maryland",
            "Michigan",
            "Missouri",
            "Nebraska",
            "Nevada",
            "New Hampshire",
            "New Jersey",
            "New Mexico",
            "New York",
            "Ohio",
            "Texas",
            "Virginia",
            "Washington"
        ];


        var stateLower =
            state.toLowerCase().trim();


        var isBifurcated =
            bifurcatedStates.some(function (bifurcatedState) {

                return (
                    stateLower ===
                    bifurcatedState.toLowerCase().trim()
                );

            });


        /* ==========================================
           STATE INDICATOR
           ========================================== */

        var stateColor;

        if (isBifurcated) {

            stateColor = "#ff4d4f";

        } else {

            stateColor = "#2ecc71";

        }


        var stateStatus =
            isBifurcated
                ? "Bifurcated"
                : "Non-Bifurcated";


        /* ==========================================
           HISTORY TEXT
           ========================================== */

        var historyText = "";

        document.querySelectorAll(
            "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.d-flex.flex-wrap.gap-3.mb-1 > span:nth-child(1), #ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.text-muted.fst-italic"
        ).forEach(function (e) {

            historyText +=
                " " + e.innerText;

        });

        historyText =
            historyText.toLowerCase();


        /* ==========================================
           CASE NOTES TEXT
           ========================================== */

        var caseNotesText = "";

        var caseNotesElement =
            document.querySelector(
                caseNotesSelector
            );

        if (caseNotesElement) {

            caseNotesText =
                caseNotesElement.innerText.toLowerCase();

        }


        /* ==========================================
           INELIGIBILITY REASONS
           ========================================== */

        var ineligibilityReasonsText = "";

        var ineligibilityReasonsElement =
            document.querySelector(
                ineligibilityReasonsSelector
            );

        if (ineligibilityReasonsElement) {

            ineligibilityReasonsText =
                ineligibilityReasonsElement.value ||
                ineligibilityReasonsElement.textContent ||
                "";

            ineligibilityReasonsText =
                ineligibilityReasonsText.trim();

        }


        var ptMatch = false;

        var historyEvidence = [];

        var caseNotesEvidence = [];


        /* ==========================================
           SELF FUNDED KEYWORDS
           ========================================== */

        var selfFundedKeywords = [
            "N859",
            "RARC code N859 is present, indicating NSA jurisdiction",
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
            "oos",
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
           EXISTING PT EVIDENCE LOGIC
           ========================================== */

        if (
            planType === "Self Funded" ||
            planType === "Self Funded (Opt Out)"
        ) {

            selfFundedKeywords.forEach(function (keyword) {

                var search =
                    keyword.toLowerCase();

                if (
                    historyText.indexOf(search) > -1
                ) {

                    ptMatch = true;

                    if (
                        historyEvidence.indexOf(keyword) === -1
                    ) {

                        historyEvidence.push(keyword);

                    }

                }


                if (
                    caseNotesText.indexOf(search) > -1
                ) {

                    ptMatch = true;

                    if (
                        caseNotesEvidence.indexOf(keyword) === -1
                    ) {

                        caseNotesEvidence.push(keyword);

                    }

                }

            });

        } else {

            var search =
                planType.toLowerCase();

            if (
                historyText.indexOf(search) > -1
            ) {

                ptMatch = true;

                historyEvidence.push(planType);

            }


            if (
                caseNotesText.indexOf(search) > -1
            ) {

                ptMatch = true;

                caseNotesEvidence.push(planType);

            }

        }


        /* ==========================================
           PT INDICATOR LOGIC
           ========================================== */

        var redPlanTypeKeywords = [
            "exchange/marketplace-state",
            "other",
            "unknown",
            "government",
            "state",
            "federal",
            "medicaid",
            "medicare"
        ];


        var planTypeLower =
            planType.toLowerCase();


        var isRedPlanType =
            redPlanTypeKeywords.some(function (keyword) {

                return (
                    planTypeLower.indexOf(keyword) > -1
                );

            });


        var ptColor;

        if (isRedPlanType) {

            ptColor = "#ff4d4f";

        } else if (ptMatch) {

            ptColor = "#2ecc71";

        } else {

            ptColor = "#f39c12";

        }


        /* ==========================================
           AGE INDICATOR
           ========================================== */

        var ageColor =
            age >= 65
                ? "#ff4d4f"
                : "#2ecc71";


        /* ==========================================
           INELIGIBILITY REASONS INDICATOR
           ========================================== */

        var ineligibilityColor =
            ineligibilityReasonsText
                ? "#2ecc71"
                : "#ff4d4f";


        /* ==========================================
           REMOVE OLD POPUP
           ========================================== */

        var old =
            document.getElementById(
                "agePopupBookmarklet"
            );

        if (old) {
            old.remove();
        }


        /* ==========================================
           CREATE POPUP
           ========================================== */

        var popup =
            document.createElement("div");

        popup.id =
            "agePopupBookmarklet";

        popup.style.cssText =
            "position:fixed;" +
            "top:100px;" +
            "left:50%;" +
            "transform:translateX(-50%);" +
            "background:rgba(0,0,0,.9);" +
            "color:#fff;" +
            "padding:20px;" +
            "border-radius:16px;" +
            "z-index:99999999;" +
            "font-family:Segoe UI;" +
            "box-shadow:0 10px 30px rgba(0,0,0,.4);" +
            "max-width:500px;";


        popup.innerHTML =

            /* CLOSE BUTTON */

            '<button style="position:absolute;top:5px;right:10px;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">×</button>' +


            /* AGE */

            '<div style="font-size:24px;font-weight:bold;display:flex;align-items:center;gap:10px;">AGE: ' +
            age +
            ' <span style="width:14px;height:14px;border-radius:50%;background:' +
            ageColor +
            ';display:inline-block;"></span></div>' +


            /* PT */

            '<div style="margin-top:10px;font-size:24px;font-weight:bold;display:flex;align-items:center;gap:10px;">PT: ' +
            planType +
            ' <span style="width:14px;height:14px;border-radius:50%;background:' +
            ptColor +
            ';display:inline-block;"></span></div>' +


            /* HISTORY EVIDENCE */

            (
                historyEvidence.length
                    ? '<div style="margin-top:10px;font-size:14px;color:#90ee90;">' +
                    '<strong style="color:#ffffff;">History Evidence:</strong><br>' +
                    historyEvidence.join("<br>") +
                    "</div>"
                    : ""
            ) +


            /* CASE NOTES EVIDENCE */

            (
                caseNotesEvidence.length
                    ? '<div style="margin-top:10px;font-size:14px;color:#90ee90;">' +
                    '<strong style="color:#ffffff;">Case Notes:</strong><br>' +
                    caseNotesEvidence.join("<br>") +
                    "</div>"
                    : ""
            ) +


            /* INELIGIBILITY REASONS */

            '<div style="margin-top:14px;font-size:16px;font-weight:bold;display:flex;align-items:center;gap:8px;">' +
            'Ineligibility Reasons:' +
            '<span style="width:14px;height:14px;border-radius:50%;background:' +
            ineligibilityColor +
            ';display:inline-block;"></span>' +
            '</div>' +


            (
                ineligibilityReasonsText

                    ? '<div style="margin-top:6px;font-size:14px;color:#90ee90;white-space:pre-wrap;word-break:break-word;">' +
                    ineligibilityReasonsText
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;") +
                    "</div>"

                    : '<div style="margin-top:6px;font-size:14px;color:#ff6b6b;">No evidence found / textarea is empty.</div>'
            ) +


            /* STATE */

            '<div style="margin-top:14px;font-size:20px;font-weight:bold;display:flex;align-items:center;gap:10px;">' +
            'STATE: ' +
            '<span style="width:14px;height:14px;border-radius:50%;background:' +
            stateColor +
            ';display:inline-block;"></span>' +
            '</div>' +

            '<div style="margin-top:4px;font-size:16px;color:#fff;">' +
            state +
            ' (' +
            stateStatus +
            ')' +
            '</div>';


        document.body.appendChild(
            popup
        );


        /* ==========================================
           CLOSE BUTTON
           ========================================== */

        popup.querySelector(
            "button"
        ).onclick = function () {

            popup.remove();

        };


        /* ==========================================
           AUTO CLOSE AFTER 7 SECONDS
           ========================================== */

        setTimeout(function () {

            var p =
                document.getElementById(
                    "agePopupBookmarklet"
                );

            if (p) {
                p.remove();
            }

        }, 7000);

    }


    /* ==========================================
       CHECK IF HISTORY IS OPEN
       ========================================== */

    const historyIsOpen =
        document.querySelector(
            openContentSelector
        );


    /* ==========================================
       CHECK IF CASE NOTES ARE OPEN
       ========================================== */

    const caseNotesIsOpen =
        document.querySelector(
            caseNotesSelector
        );


    /* ==========================================
       FIND HISTORY BUTTON
       ========================================== */

    const historyButton =
        document.querySelector(
            openerSelector
        );


    /* ==========================================
       FIND CASE NOTES BUTTON
       ========================================== */

    const caseNotesButton =
        document.querySelector(
            caseNotesButtonSelector
        );


    /* ==========================================
       OPEN HISTORY
       ========================================== */

    if (
        !historyIsOpen &&
        historyButton
    ) {

        historyButton.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        historyButton.click();

    }


    /* ==========================================
       OPEN CASE NOTES
       ========================================== */

    if (
        !caseNotesIsOpen &&
        caseNotesButton
    ) {

        caseNotesButton.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        caseNotesButton.click();

    }


    /* ==========================================
       RUN MAIN LOGIC AFTER CONTENT OPENS
       ========================================== */

    setTimeout(
        function () {

            runLogic();

        },
        100
    );

})();


/* ============================================================
   VOB OPENER
   ============================================================ */

(function () {

    /* ==========================================
       OPEN FILES LIST
       ========================================== */

    const filesBtn =
        document.querySelector(
            'button[title="Toggle the Files list"]'
        );

    if (filesBtn) {

        if (
            filesBtn.getAttribute("aria-expanded") === "false"
        ) {

            filesBtn.click();

        }

        filesBtn.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /* ==========================================
       OPEN NOTES SECTION
       ========================================== */

    const notesBtn =
        document.querySelector(
            'button[title="Toggle Notes section"]'
        );

    if (notesBtn) {

        if (
            notesBtn.getAttribute("aria-expanded") === "false"
        ) {

            notesBtn.click();

        }

        const container =
            notesBtn.closest("div");

        if (container) {

            container.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            window.scrollBy(0, 500);

        }

    }


    /* ==========================================
       REMOVE OLD VOB POPUP
       ========================================== */

    const old =
        document.getElementById(
            "vobPopup"
        );

    if (old) {

        old.remove();

    }


    /* ==========================================
       FIND VOB BUTTONS
       ========================================== */

    const vobs =
        [...document.querySelectorAll("button.btn-modal")]
            .filter(function (btn) {

                return (
                    btn.title?.toLowerCase().includes("view vob") ||
                    btn.textContent.toLowerCase().includes("vob")
                );

            });


    /* ==========================================
       NO VOB BUTTONS FOUND
       ========================================== */

    if (!vobs.length) {

        alert("No VOB buttons found.");

        return;

    }


    /* ==========================================
       CREATE VOB POPUP
       ========================================== */

    const popup =
        document.createElement("div");

    popup.id =
        "vobPopup";


    popup.style.cssText =
        "position:fixed;" +
        "top:20px;" +
        "left:50%;" +
        "transform:translateX(-50%);" +
        "width:220px;" +
        "background:#111827;" +
        "border:1px solid #374151;" +
        "border-radius:10px;" +
        "box-shadow:0 6px 18px rgba(0,0,0,.5);" +
        "z-index:999999999;" +
        "font-family:Segoe UI,Arial;" +
        "font-size:12px;" +
        "color:#e5e7eb;";


    /* ==========================================
       CREATE POPUP HTML
       ========================================== */

    let html =

        '<div style="padding:8px;border-bottom:1px solid #374151;font-weight:600;text-align:center;">' +

        'VOB Opener' +

        '<span id="closeVob" style="float:right;cursor:pointer;">✕</span>' +

        '</div>' +

        '<div style="padding:10px;">';


    /* ==========================================
       CREATE VOB BUTTONS
       ========================================== */

    vobs.forEach(function (v, i) {

        html +=

            '<button class="vobBtn" data-index="' +
            i +
            '" style="width:100%;padding:8px;background:#2563eb;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:600;margin-bottom:5px;">' +

            '📄 VOB ' +

            (i + 1) +

            '</button>';

    });


    html +=
        "</div>";


    popup.innerHTML =
        html;


    document.body.appendChild(
        popup
    );


    /* ==========================================
       AUTO CLOSE VOB POPUP
       ========================================== */

    setTimeout(function () {

        const p =
            document.getElementById(
                "vobPopup"
            );

        if (p) {

            p.remove();

        }

    }, 5000);


    /* ==========================================
       CLOSE VOB POPUP
       ========================================== */

    const closeVob =
        document.getElementById(
            "closeVob"
        );

    if (closeVob) {

        closeVob.onclick =
            function () {

                popup.remove();

            };

    }


    /* ==========================================
       VOB BUTTON CLICK LOGIC
       ========================================== */

    popup
        .querySelectorAll(".vobBtn")
        .forEach(function (btn) {

            btn.onclick =
                function () {

                    const index =
                        parseInt(
                            btn.dataset.index,
                            10
                        );

                    const v =
                        vobs[index];

                    if (v) {

                        v.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                        v.click();

                    }

                };

        });

})();
