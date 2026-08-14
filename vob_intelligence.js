(function () {

    /* ============================================================
       SELECTORS
       ============================================================ */

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


    /* ============================================================
       VOB SECTION BUTTON
       ============================================================ */

    const vobSectionButtonSelector =
        "#ngForm > fieldset > div:nth-child(22) > div.d-flex.mb-2 > button";


    /* ============================================================
       FILES BUTTON
       ============================================================ */

    const filesButtonSelector =
        'button[title="Toggle the Files list"]';


    /* ============================================================
       NOTES BUTTON
       ============================================================ */

    const notesButtonSelector =
        'button[title="Toggle Notes section"]';


    /* ============================================================
       OPEN VOB SECTION
       ============================================================ */

    function openVobSection() {

        const vobSectionButton =
            document.querySelector(
                vobSectionButtonSelector
            );

        if (vobSectionButton) {

            /*
             * If the button controls an expandable section,
             * attempt to determine whether it is already open.
             */

            const ariaExpanded =
                vobSectionButton.getAttribute(
                    "aria-expanded"
                );

            if (
                ariaExpanded === "false"
            ) {

                vobSectionButton.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                vobSectionButton.click();

            } else if (
                ariaExpanded === null
            ) {

                /*
                 * If aria-expanded does not exist,
                 * click the button so the VOB section opens.
                 */

                vobSectionButton.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                vobSectionButton.click();

            }

        }

    }


    /* ============================================================
       OPEN FILES
       ============================================================ */

    function openFilesSection() {

        const filesBtn =
            document.querySelector(
                filesButtonSelector
            );

        if (filesBtn) {

            if (
                filesBtn.getAttribute(
                    "aria-expanded"
                ) === "false"
            ) {

                filesBtn.click();

            }

            filesBtn.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }


    /* ============================================================
       OPEN NOTES
       ============================================================ */

    function openNotesSection() {

        const notesBtn =
            document.querySelector(
                notesButtonSelector
            );

        if (notesBtn) {

            if (
                notesBtn.getAttribute(
                    "aria-expanded"
                ) === "false"
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

                window.scrollBy(
                    0,
                    500
                );

            }

        }

    }


    /* ============================================================
       FIND VOB BUTTONS
       ============================================================ */

    function findVobButtons() {

        return [
            ...document.querySelectorAll(
                "button.btn-modal"
            )
        ].filter(function (btn) {

            const title =
                (
                    btn.title ||
                    ""
                ).toLowerCase();

            const text =
                (
                    btn.textContent ||
                    ""
                ).toLowerCase();

            return (
                title.includes("view vob") ||
                text.includes("vob")
            );

        });

    }


    /* ============================================================
       MAIN LOGIC
       ============================================================ */

    function runLogic() {

        /* ========================================================
           DOB
           ======================================================== */

        var dob =
            document.querySelector(
                "#DOB"
            );

        if (!dob) {

            alert(
                "DOB not found"
            );

            return;

        }


        var dobValue =
            dob.value ||
            dob.textContent ||
            dob.innerText;


        var dobDate =
            new Date(
                dobValue
            );


        if (isNaN(dobDate)) {

            alert(
                "Invalid DOB"
            );

            return;

        }


        /* ========================================================
           AGE
           ======================================================== */

        var today =
            new Date();


        var age =
            today.getFullYear() -
            dobDate.getFullYear();


        if (
            today.getMonth() <
                dobDate.getMonth() ||
            (
                today.getMonth() ===
                    dobDate.getMonth() &&
                today.getDate() <
                    dobDate.getDate()
            )
        ) {

            age--;

        }


        /* ========================================================
           PLAN TYPE
           ======================================================== */

        var planType =
            "Unknown";


        var plan =
            Array.from(
                document.querySelectorAll(
                    "select"
                )
            ).find(function (s) {

                return (
                    s.parentElement &&
                    s.parentElement.innerText.indexOf(
                        "Plan Type"
                    ) > -1
                );

            });


        if (plan) {

            planType =
                plan.options[
                    plan.selectedIndex
                ].text;

        }


        /* ========================================================
           STATE
           ======================================================== */

        var state =
            "Unknown";


        var stateElement =
            document.querySelector(
                stateSelector
            );


        if (stateElement) {

            state =
                stateElement
                    .selectedOptions[0]
                    ?.text ||
                stateElement.value ||
                "Unknown";


            state =
                state.trim();

        }


        /* ========================================================
           BIFURCATED STATES
           ======================================================== */

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
            state
                .toLowerCase()
                .trim();


        var isBifurcated =
            bifurcatedStates.some(
                function (
                    bifurcatedState
                ) {

                    return (
                        stateLower ===
                        bifurcatedState
                            .toLowerCase()
                            .trim()
                    );

                }
            );


        /* ========================================================
           STATE INDICATOR
           ======================================================== */

        var stateColor;

        if (isBifurcated) {

            stateColor =
                "#ff4d4f";

        } else {

            stateColor =
                "#2ecc71";

        }


        var stateStatus =
            isBifurcated
                ? "Bifurcated"
                : "Non-Bifurcated";


        /* ========================================================
           HISTORY TEXT
           ======================================================== */

        var historyText =
            "";


        document.querySelectorAll(

            "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.d-flex.flex-wrap.gap-3.mb-1 > span:nth-child(1), #ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.text-muted.fst-italic"

        ).forEach(
            function (e) {

                historyText +=
                    " " +
                    e.innerText;

            }
        );


        historyText =
            historyText.toLowerCase();


        /* ========================================================
           CASE NOTES TEXT
           ======================================================== */

        var caseNotesText =
            "";


        var caseNotesElement =
            document.querySelector(
                caseNotesSelector
            );


        if (caseNotesElement) {

            caseNotesText =
                caseNotesElement
                    .innerText
                    .toLowerCase();

        }


        /* ========================================================
           INELIGIBILITY REASONS
           ======================================================== */

        var ineligibilityReasonsText =
            "";


        var ineligibilityReasonsElement =
            document.querySelector(
                ineligibilityReasonsSelector
            );


        if (
            ineligibilityReasonsElement
        ) {

            ineligibilityReasonsText =
                ineligibilityReasonsElement.value ||
                ineligibilityReasonsElement.textContent ||
                "";


            ineligibilityReasonsText =
                ineligibilityReasonsText.trim();

        }


        /* ========================================================
           PT MATCH
           ======================================================== */

        var ptMatch =
            false;


        var historyEvidence =
            [];


        var caseNotesEvidence =
            [];


        /* ========================================================
           SELF FUNDED KEYWORDS
           ======================================================== */

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


        /* ========================================================
           EXISTING PT EVIDENCE LOGIC
           ======================================================== */

        if (
            planType ===
                "Self Funded" ||
            planType ===
                "Self Funded (Opt Out)"
        ) {

            selfFundedKeywords.forEach(
                function (keyword) {

                    var search =
                        keyword.toLowerCase();


                    if (
                        historyText.indexOf(
                            search
                        ) > -1
                    ) {

                        ptMatch =
                            true;


                        if (
                            historyEvidence.indexOf(
                                keyword
                            ) === -1
                        ) {

                            historyEvidence.push(
                                keyword
                            );

                        }

                    }


                    if (
                        caseNotesText.indexOf(
                            search
                        ) > -1
                    ) {

                        ptMatch =
                            true;


                        if (
                            caseNotesEvidence.indexOf(
                                keyword
                            ) === -1
                        ) {

                            caseNotesEvidence.push(
                                keyword
                            );

                        }

                    }

                }
            );

        } else {

            var search =
                planType.toLowerCase();


            if (
                historyText.indexOf(
                    search
                ) > -1
            ) {

                ptMatch =
                    true;


                historyEvidence.push(
                    planType
                );

            }


            if (
                caseNotesText.indexOf(
                    search
                ) > -1
            ) {

                ptMatch =
                    true;


                caseNotesEvidence.push(
                    planType
                );

            }

        }


        /* ========================================================
           PT INDICATOR
           ======================================================== */

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
            redPlanTypeKeywords.some(
                function (keyword) {

                    return (
                        planTypeLower.indexOf(
                            keyword
                        ) > -1
                    );

                }
            );


        var ptColor;


        if (isRedPlanType) {

            ptColor =
                "#ff4d4f";

        } else if (ptMatch) {

            ptColor =
                "#2ecc71";

        } else {

            ptColor =
                "#f39c12";

        }


        /* ========================================================
           AGE INDICATOR
           ======================================================== */

        var ageColor =
            age >= 65
                ? "#ff4d4f"
                : "#2ecc71";


        /* ========================================================
           INELIGIBILITY INDICATOR
           ======================================================== */

        var ineligibilityColor =
            ineligibilityReasonsText
                ? "#2ecc71"
                : "#ff4d4f";


        /* ========================================================
           FIND VOB BUTTONS
           ======================================================== */

        var vobs =
            findVobButtons();


        /* ========================================================
           REMOVE OLD MAIN POPUP
           ======================================================== */

        var old =
            document.getElementById(
                "agePopupBookmarklet"
            );


        if (old) {

            old.remove();

        }


        /* ========================================================
           CREATE MAIN POPUP
           ======================================================== */

        var popup =
            document.createElement(
                "div"
            );


        popup.id =
            "agePopupBookmarklet";


        popup.style.cssText =

            "position:fixed;" +
            "top:100px;" +
            "left:50%;" +
            "transform:translateX(-50%);" +
            "background:rgba(0,0,0,.94);" +
            "color:#fff;" +
            "padding:20px;" +
            "border-radius:16px;" +
            "z-index:99999999;" +
            "font-family:Segoe UI,Arial,sans-serif;" +
            "box-shadow:0 10px 30px rgba(0,0,0,.5);" +
            "max-width:500px;" +
            "width:calc(100% - 40px);" +
            "max-height:80vh;" +
            "overflow-y:auto;";


        /* ========================================================
           ESCAPE HTML HELPER
           ======================================================== */

        function escapeHtml(
            text
        ) {

            return String(
                text
            )
                .replace(
                    /&/g,
                    "&amp;"
                )
                .replace(
                    /</g,
                    "&lt;"
                )
                .replace(
                    />/g,
                    "&gt;"
                )
                .replace(
                    /"/g,
                    "&quot;"
                )
                .replace(
                    /'/g,
                    "&#039;"
                );

        }


        /* ========================================================
           VOB HTML
           ======================================================== */

        var vobHtml =
            "";


        if (
            vobs.length
        ) {

            vobHtml +=

                '<div style="margin-top:16px;padding-top:12px;border-top:1px solid #374151;">' +

                '<div style="font-size:20px;font-weight:bold;display:flex;align-items:center;gap:8px;">' +

                'VOB' +

                '<span style="font-size:12px;color:#9ca3af;font-weight:normal;">' +

                "(" +
                vobs.length +
                " found)" +

                "</span>" +

                "</div>" +

                '<div style="margin-top:8px;">';


            vobs.forEach(
                function (
                    v,
                    i
                ) {

                    var vobTitle =
                        v.title ||
                        v.textContent ||
                        "View VOB";


                    vobHtml +=

                        '<button class="mainVobBtn" data-vob-index="' +
                        i +
                        '" style="' +
                        "display:block;" +
                        "width:100%;" +
                        "padding:9px 10px;" +
                        "margin-bottom:6px;" +
                        "background:#2563eb;" +
                        "color:#fff;" +
                        "border:none;" +
                        "border-radius:6px;" +
                        "cursor:pointer;" +
                        "font-weight:600;" +
                        "font-size:13px;" +
                        "text-align:left;" +
                        '">' +

                        "📄 VOB " +
                        (i + 1) +

                        '<span style="float:right;color:#dbeafe;font-size:11px;">' +

                        escapeHtml(
                            vobTitle
                        ) +

                        "</span>" +

                        "</button>";

                }
            );


            vobHtml +=
                "</div></div>";

        } else {

            vobHtml =

                '<div style="margin-top:16px;padding-top:12px;border-top:1px solid #374151;">' +

                '<div style="font-size:18px;font-weight:bold;">' +

                "VOB" +

                "</div>" +

                '<div style="margin-top:6px;font-size:13px;color:#ff6b6b;">' +

                "No VOB buttons found." +

                "</div>" +

                "</div>";

        }


        /* ========================================================
           POPUP HTML
           ======================================================== */

        popup.innerHTML =

            /* CLOSE BUTTON */

            '<button style="position:absolute;top:5px;right:10px;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">×</button>' +


            /* AGE */

            '<div style="font-size:24px;font-weight:bold;display:flex;align-items:center;gap:10px;">' +

            "AGE: " +

            age +

            ' <span style="width:14px;height:14px;border-radius:50%;background:' +

            ageColor +

            ';display:inline-block;"></span>' +

            "</div>" +


            /* PT */

            '<div style="margin-top:10px;font-size:24px;font-weight:bold;display:flex;align-items:center;gap:10px;">' +

            "PT: " +

            escapeHtml(
                planType
            ) +

            ' <span style="width:14px;height:14px;border-radius:50%;background:' +

            ptColor +

            ';display:inline-block;"></span>' +

            "</div>" +


            /* HISTORY EVIDENCE */

            (

                historyEvidence.length

                    ?

                    '<div style="margin-top:10px;font-size:14px;color:#90ee90;">' +

                    '<strong style="color:#ffffff;">History Evidence:</strong><br>' +

                    historyEvidence
                        .map(
                            escapeHtml
                        )
                        .join(
                            "<br>"
                        ) +

                    "</div>"

                    :

                    ""

            ) +


            /* CASE NOTES */

            (

                caseNotesEvidence.length

                    ?

                    '<div style="margin-top:10px;font-size:14px;color:#90ee90;">' +

                    '<strong style="color:#ffffff;">Case Notes:</strong><br>' +

                    caseNotesEvidence
                        .map(
                            escapeHtml
                        )
                        .join(
                            "<br>"
                        ) +

                    "</div>"

                    :

                    ""

            ) +


            /* INELIGIBILITY */

            '<div style="margin-top:14px;font-size:16px;font-weight:bold;display:flex;align-items:center;gap:8px;">' +

            "Ineligibility Reasons:" +

            '<span style="width:14px;height:14px;border-radius:50%;background:' +

            ineligibilityColor +

            ';display:inline-block;"></span>' +

            "</div>" +


            (

                ineligibilityReasonsText

                    ?

                    '<div style="margin-top:6px;font-size:14px;color:#90ee90;white-space:pre-wrap;word-break:break-word;">' +

                    escapeHtml(
                        ineligibilityReasonsText
                    ) +

                    "</div>"

                    :

                    '<div style="margin-top:6px;font-size:14px;color:#ff6b6b;">No evidence found / textarea is empty.</div>'

            ) +


            /* ====================================================
               STATE
               ==================================================== */

            '<div style="margin-top:14px;font-size:20px;font-weight:bold;display:flex;align-items:center;gap:10px;">' +

            "STATE: " +

            '<span style="width:14px;height:14px;border-radius:50%;background:' +

            stateColor +

            ';display:inline-block;"></span>' +

            "</div>" +


            '<div style="margin-top:4px;font-size:16px;color:#fff;">' +

            escapeHtml(
                state
            ) +

            " (" +

            stateStatus +

            ")" +

            "</div>" +


            /* ====================================================
               VOB SECTION
               DIRECTLY BELOW STATE
               ==================================================== */

            vobHtml;


        /* ========================================================
           ADD POPUP
           ======================================================== */

        document.body.appendChild(
            popup
        );


        /* ========================================================
           CLOSE BUTTON
           ======================================================== */

        var closeButton =
            popup.querySelector(
                "button"
            );


        if (closeButton) {

            closeButton.onclick =
                function () {

                    popup.remove();

                };

        }


        /* ========================================================
           VOB BUTTON CLICK EVENTS
           ======================================================== */

        popup
            .querySelectorAll(
                ".mainVobBtn"
            )
            .forEach(
                function (btn) {

                    btn.onclick =
                        function () {

                            var index =
                                parseInt(
                                    btn.getAttribute(
                                        "data-vob-index"
                                    ),
                                    10
                                );


                            var v =
                                vobs[index];


                            if (v) {

                                /*
                                 * Close the popup first so
                                 * the actual VOB modal is visible.
                                 */

                                popup.remove();


                                v.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center"
                                });


                                setTimeout(
                                    function () {

                                        v.click();

                                    },
                                    150
                                );

                            }

                        };

                }
            );


        /* ========================================================
           AUTO CLOSE MAIN POPUP
           ======================================================== */

        setTimeout(
            function () {

                var p =
                    document.getElementById(
                        "agePopupBookmarklet"
                    );


                if (p) {

                    p.remove();

                }

            },
            7000
        );

    }


    /* ============================================================
       CHECK HISTORY
       ============================================================ */

    const historyIsOpen =
        document.querySelector(
            openContentSelector
        );


    /* ============================================================
       CHECK CASE NOTES
       ============================================================ */

    const caseNotesIsOpen =
        document.querySelector(
            caseNotesSelector
        );


    /* ============================================================
       FIND HISTORY BUTTON
       ============================================================ */

    const historyButton =
        document.querySelector(
            openerSelector
        );


    /* ============================================================
       FIND CASE NOTES BUTTON
       ============================================================ */

    const caseNotesButton =
        document.querySelector(
            caseNotesButtonSelector
        );


    /* ============================================================
       OPEN HISTORY
       ============================================================ */

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


    /* ============================================================
       OPEN CASE NOTES
       ============================================================ */

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


    /* ============================================================
       OPEN VOB SECTION
       ============================================================ */

    openVobSection();


    /* ============================================================
       OPEN FILES
       ============================================================ */

    openFilesSection();


    /* ============================================================
       OPEN NOTES
       ============================================================ */

    openNotesSection();


    /* ============================================================
       RUN MAIN LOGIC
       ============================================================ */

    setTimeout(
        function () {

            runLogic();

        },
        500
    );

})();
