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

    const ineligibilityReasonsSelector =
        "#ngForm > fieldset > div:nth-child(15) > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > textarea";

    const stateSelector =
        "#ngForm > fieldset > div:nth-child(15) > div:nth-child(3) > div.col-lg-6.justify-content-end.mb-4 > div:nth-child(1) > select";

    const vobSectionButtonSelector =
        "#ngForm > fieldset > div:nth-child(22) > div.d-flex.mb-2 > button";

    const filesButtonSelector =
        'button[title="Toggle the Files list"]';

    const notesButtonSelector =
        'button[title="Toggle Notes section"]';


    /* ============================================================
       OPEN VOB SECTION
       ============================================================ */

    function openVobSection() {

        const button =
            document.querySelector(
                vobSectionButtonSelector
            );

        if (!button) {
            return;
        }

        const expanded =
            button.getAttribute(
                "aria-expanded"
            );

        if (
            expanded === "false" ||
            expanded === null
        ) {

            button.click();

        }

    }


    /* ============================================================
       OPEN FILES
       ============================================================ */

    function openFilesSection() {

        const button =
            document.querySelector(
                filesButtonSelector
            );

        if (!button) {
            return;
        }

        const expanded =
            button.getAttribute(
                "aria-expanded"
            );

        if (
            expanded === "false" ||
            expanded === null
        ) {

            button.click();

        }

    }


    /* ============================================================
       OPEN NOTES
       ============================================================ */

    function openNotesSection() {

        const button =
            document.querySelector(
                notesButtonSelector
            );

        if (!button) {
            return;
        }

        const expanded =
            button.getAttribute(
                "aria-expanded"
            );

        if (
            expanded === "false" ||
            expanded === null
        ) {

            button.click();

        }

    }


    /* ============================================================
       NORMALIZE TEXT
       ============================================================ */

    function normalizeFileText(text) {

        return String(text || "")
            .toLowerCase()
            .replace(/[_\-]+/g, " ")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }


    /* ============================================================
       ESCAPE HTML
       ============================================================ */

    function escapeHtml(text) {

        return String(text || "")
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


    /* ============================================================
       GET ELEMENT ATTRIBUTES
       ============================================================ */

    function getElementAttributes(
        element
    ) {

        if (!element) {
            return [];
        }

        return [

            element.innerText,

            element.textContent,

            element.title,

            element.getAttribute(
                "aria-label"
            ),

            element.getAttribute(
                "data-title"
            ),

            element.getAttribute(
                "data-name"
            ),

            element.getAttribute(
                "data-file-name"
            ),

            element.getAttribute(
                "data-filename"
            ),

            element.getAttribute(
                "data-document-name"
            ),

            element.getAttribute(
                "data-document"
            ),

            element.getAttribute(
                "filename"
            ),

            element.getAttribute(
                "name"
            ),

            element.getAttribute(
                "alt"
            )

        ].filter(Boolean);

    }


    /* ============================================================
       FILE DEFINITIONS
       ============================================================ */

    const fileDefinitions = [

        {
            key:
                "proofOfIdInitiation",

            label:
                "Proof of ID Initiation",

            icon:
                "🪪",

            /*
             * Important:
             * Include multiple possible spellings.
             */

            keywords: [

                "proof of id initiation",

                "proof of id",

                "proof of id init",

                "proof id initiation",

                "proof id init",

                "proofofidinitiation",

                "proofofid",

                "proofidinitiation",

                "proofid",

                "id initiation",

                "id initiation document",

                "id proof",

                "proof of identification",

                "identification proof"

            ]

        },


        {
            key:
                "insuranceCard",

            label:
                "Insurance Card",

            icon:
                "💳",

            keywords: [

                "insurance card",

                "insurancecard",

                "insurance-card",

                "ins card",

                "inscard"

            ]

        },


        {
            key:
                "eob",

            label:
                "EOB",

            icon:
                "📄",

            keywords: [

                "eob",

                "eob file",

                "eob document",

                "eob report",

                "explanation of benefits",

                "explanation benefits"

            ]

        }

    ];


    /* ============================================================
       GET SEARCH TEXT
       ============================================================ */

    function getSearchText(
        element
    ) {

        return normalizeFileText(

            getElementAttributes(
                element
            ).join(" ")

        );

    }


    /* ============================================================
       STRICT FILE MATCH
       ============================================================ */

    function matchesFileDefinition(
        text,
        definition
    ) {

        const normalized =
            normalizeFileText(
                text
            );

        if (!normalized) {
            return false;
        }


        /* ========================================================
           EOB
           ======================================================== */

        if (
            definition.key ===
            "eob"
        ) {

            /*
             * EOB must be its own meaningful label.
             *
             * This prevents a parent containing:
             *
             * VOB
             * Insurance Card
             * EOB
             *
             * from being selected.
             */

            const eobExactValues = [

                "eob",

                "eob file",

                "eob document",

                "eob report",

                "explanation of benefits",

                "explanation benefits"

            ];

            if (
                eobExactValues.indexOf(
                    normalized
                ) > -1
            ) {

                return true;

            }


            /*
             * Also allow a filename such as:
             *
             * EOB_2026.pdf
             *
             * EOB-123.pdf
             */

            if (
                /^eob\s*\d+$/.test(
                    normalized
                )
            ) {

                return true;

            }


            if (
                /^eob\s+file\s*\d+$/.test(
                    normalized
                )
            ) {

                return true;

            }


            if (
                normalized.startsWith(
                    "explanation of benefits"
                )
            ) {

                return true;

            }


            return false;

        }


        /* ========================================================
           PROOF OF ID
           ======================================================== */

        if (
            definition.key ===
            "proofOfIdInitiation"
        ) {

            return (

                normalized ===
                    "proof of id initiation" ||

                normalized ===
                    "proof of id" ||

                normalized ===
                    "proof of id init" ||

                normalized ===
                    "proof id initiation" ||

                normalized ===
                    "proof id init" ||

                normalized ===
                    "proofofidinitiation" ||

                normalized ===
                    "proofofid" ||

                normalized ===
                    "proofidinitiation" ||

                normalized ===
                    "proofid" ||

                normalized ===
                    "id initiation" ||

                normalized ===
                    "id proof" ||

                normalized ===
                    "proof of identification"

            );

        }


        /* ========================================================
           INSURANCE CARD
           ======================================================== */

        if (
            definition.key ===
            "insuranceCard"
        ) {

            return (

                normalized ===
                    "insurance card" ||

                normalized ===
                    "insurancecard" ||

                normalized ===
                    "ins card" ||

                normalized ===
                    "inscard"

            );

        }


        return false;

    }


    /* ============================================================
       GET CLICKABLE ELEMENTS
       ============================================================ */

    function getClickableElements() {

        const selector = [

            "button",

            "a",

            '[role="button"]',

            "input[type='button']",

            "input[type='submit']"

        ].join(",");


        return [
            ...document.querySelectorAll(
                selector
            )
        ];

    }


    /* ============================================================
       FIND FILE ROW
       ============================================================ */

    function findFileRow(
        element
    ) {

        if (!element) {
            return null;
        }


        /*
         * Try common table/list/card structures.
         */

        const row =
            element.closest(
                "tr, li, .row, .list-group-item, .card, .file-item"
            );


        if (row) {
            return row;
        }


        /*
         * Otherwise use immediate parent.
         */

        return element.parentElement;

    }


    /* ============================================================
       FILE CONTROL LOOKUP
       ============================================================ */

    function findFileControlsForDefinition(
        definition
    ) {

        const allControls =
            getClickableElements();


        const results =
            [];


        const seen =
            new Set();


        /* ========================================================
           PASS 1
           DIRECT CONTROL TEXT
           ======================================================== */

        allControls.forEach(
            function (control) {

                if (
                    seen.has(
                        control
                    )
                ) {

                    return;

                }


                const attributes =
                    getElementAttributes(
                        control
                    );


                for (
                    let i = 0;
                    i < attributes.length;
                    i++
                ) {

                    if (
                        matchesFileDefinition(
                            attributes[i],
                            definition
                        )
                    ) {

                        seen.add(
                            control
                        );

                        results.push(
                            control
                        );

                        return;

                    }

                }

            }
        );


        /* ========================================================
           PASS 2
           CHILD TEXT
           ======================================================== */

        allControls.forEach(
            function (control) {

                if (
                    seen.has(
                        control
                    )
                ) {

                    return;

                }


                const children =
                    control.querySelectorAll(
                        "span, div, label, strong, small, p"
                    );


                for (
                    let i = 0;
                    i < children.length;
                    i++
                ) {

                    const child =
                        children[i];


                    const childText =
                        getElementAttributes(
                            child
                        );


                    let matched =
                        false;


                    for (
                        let j = 0;
                        j < childText.length;
                        j++
                    ) {

                        if (
                            matchesFileDefinition(
                                childText[j],
                                definition
                            )
                        ) {

                            matched =
                                true;

                            break;

                        }

                    }


                    if (matched) {

                        seen.add(
                            control
                        );

                        results.push(
                            control
                        );

                        return;

                    }

                }

            }
        );


        /* ========================================================
           PASS 3
           FILE ROW SEARCH
           ======================================================== */

        const possibleRows =
            document.querySelectorAll(
                "tr, li, .row, .list-group-item, .card, .file-item"
            );


        possibleRows.forEach(
            function (row) {

                const rowText =
                    normalizeFileText(
                        row.innerText ||
                        row.textContent ||
                        ""
                    );


                /*
                 * Do not use broad EOB row matching.
                 */

                let rowMatches =
                    false;


                if (
                    definition.key ===
                    "eob"
                ) {

                    const words =
                        rowText.split(
                            " "
                        );


                    /*
                     * Look for an EOB token,
                     * but don't match a row that
                     * contains VOB and Insurance Card
                     * without an actual EOB control.
                     */

                    if (
                        words.indexOf(
                            "eob"
                        ) > -1
                    ) {

                        rowMatches =
                            true;

                    }

                }

                else {

                    rowMatches =
                        matchesFileDefinition(
                            rowText,
                            definition
                        );

                }


                if (!rowMatches) {
                    return;
                }


                const rowControls =
                    row.querySelectorAll(
                        "button, a, [role='button'], input[type='button'], input[type='submit']"
                    );


                /*
                 * Prefer a control whose own text
                 * identifies the file.
                 */

                for (
                    let i = 0;
                    i < rowControls.length;
                    i++
                ) {

                    const control =
                        rowControls[i];


                    const controlText =
                        getSearchText(
                            control
                        );


                    if (
                        matchesFileDefinition(
                            controlText,
                            definition
                        )
                    ) {

                        if (
                            !seen.has(
                                control
                            )
                        ) {

                            seen.add(
                                control
                            );

                            results.push(
                                control
                            );

                        }

                        return;

                    }

                }


                /*
                 * If no exact control was found,
                 * use a small clickable control in
                 * the row.
                 */

                if (
                    rowControls.length ===
                    1
                ) {

                    const control =
                        rowControls[0];


                    if (
                        !seen.has(
                            control
                        )
                    ) {

                        seen.add(
                            control
                        );

                        results.push(
                            control
                        );

                    }

                }

            }
        );


        return results;

    }


    /* ============================================================
       FIND ALL SUPPORTED FILES
       ============================================================ */

    function findSupportedFiles() {

        const results =
            [];


        fileDefinitions.forEach(
            function (definition) {

                const controls =
                    findFileControlsForDefinition(
                        definition
                    );


                controls.forEach(
                    function (control) {

                        results.push({

                            definition:
                                definition,

                            button:
                                control

                        });

                    }
                );

            }
        );


        return results;

    }


    /* ============================================================
       FIND VOB BUTTONS
       ============================================================ */

    function findVobButtons() {

        return [

            ...document.querySelectorAll(
                "button.btn-modal"
            )

        ].filter(
            function (btn) {

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

                    title.includes(
                        "view vob"
                    ) ||

                    text.includes(
                        "vob"
                    )

                );

            }
        );

    }


    /* ============================================================
       CREATE FILE BUTTON LABEL
       ============================================================ */

    function getFileButtonLabel(
        file,
        number
    ) {

        const definition =
            file.definition;


        const originalButton =
            file.button;


        let originalText =
            getSearchText(
                originalButton
            );


        /*
         * Don't display giant parent text.
         */

        if (
            originalText.length >
            80
        ) {

            originalText =
                "";

        }


        let label =
            definition.label;


        /*
         * Multiple files of same type.
         */

        if (
            number > 1
        ) {

            label +=
                " " +
                number;

        }


        return {

            label:
                label,

            originalText:
                originalText

        };

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
            ).find(
                function (s) {

                    return (

                        s.parentElement &&

                        s.parentElement.innerText
                            .indexOf(
                                "Plan Type"
                            ) > -1

                    );

                }
            );


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
                stateElement.selectedOptions[0]?.text ||
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


        var stateColor =
            isBifurcated
                ? "#ff4d4f"
                : "#2ecc71";


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
            "erisa",
            "ERISA/Self Funded",
            "meritain",
            "oos",
            "uhss",
            "commercial plans can have tiers with self funded",
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
            "ma44",
            "n599",
            "n858",
            "n867",
            "n871",
            "n883"

        ];


        /* ========================================================
           PT EVIDENCE LOGIC
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
           FIND VOB
           ======================================================== */

        var vobs =
            findVobButtons();


        /* ========================================================
           FIND FILES
           ======================================================== */

        var supportedFiles =
            findSupportedFiles();


        /* ========================================================
           REMOVE DUPLICATE FILE CONTROLS
           ======================================================== */

        var uniqueFiles =
            [];


        var fileSeen =
            new Set();


        supportedFiles.forEach(
            function (file) {

                if (
                    fileSeen.has(
                        file.button
                    )
                ) {

                    return;

                }


                fileSeen.add(
                    file.button
                );


                uniqueFiles.push(
                    file
                );

            }
        );


        supportedFiles =
            uniqueFiles;


        /* ========================================================
           REMOVE OLD POPUP
           ======================================================== */

        var old =
            document.getElementById(
                "agePopupBookmarklet"
            );


        if (old) {

            old.remove();

        }


        /* ========================================================
           CREATE POPUP
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
           VOB HTML
           ======================================================== */

        var vobHtml =
            "";


        if (vobs.length) {

            vobHtml +=

                '<div style="margin-top:16px;padding-top:12px;border-top:1px solid #374151;">' +

                '<div style="font-size:20px;font-weight:bold;">' +

                "VOB " +

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

                        '<span style="float:right;color:#dbeafe;font-size:11px;max-width:45%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +

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

                '<div style="font-size:18px;font-weight:bold;">VOB</div>' +

                '<div style="margin-top:6px;font-size:13px;color:#ff6b6b;">' +

                "No VOB files found." +

                "</div>" +

                "</div>";

        }


        /* ========================================================
           FILES HTML
           ======================================================== */

        var filesHtml =

            '<div style="margin-top:16px;padding-top:12px;border-top:1px solid #374151;">' +

            '<div style="font-size:20px;font-weight:bold;">' +

            "FILES " +

            '<span style="font-size:12px;color:#9ca3af;font-weight:normal;">' +

            "(" +
            supportedFiles.length +
            " found)" +

            "</span>" +

            "</div>" +

            '<div style="margin-top:8px;">';


        if (
            supportedFiles.length
        ) {

            const counters = {

                proofOfIdInitiation:
                    0,

                insuranceCard:
                    0,

                eob:
                    0

            };


            supportedFiles.forEach(
                function (
                    file,
                    i
                ) {

                    const key =
                        file.definition.key;


                    counters[key] =
                        (
                            counters[key] ||
                            0
                        ) + 1;


                    const display =
                        getFileButtonLabel(
                            file,
                            counters[key]
                        );


                    filesHtml +=

                        '<button class="mainFileBtn" data-file-index="' +
                        i +
                        '" style="' +

                        "display:block;" +
                        "width:100%;" +
                        "padding:9px 10px;" +
                        "margin-bottom:6px;" +
                        "background:#374151;" +
                        "color:#fff;" +
                        "border:none;" +
                        "border-radius:6px;" +
                        "cursor:pointer;" +
                        "font-weight:600;" +
                        "font-size:13px;" +
                        "text-align:left;" +

                        '">' +

                        file.definition.icon +
                        " " +

                        escapeHtml(
                            display.label
                        ) +

                        (
                            display.originalText

                                ?

                                '<span style="float:right;color:#d1d5db;font-size:11px;max-width:42%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +

                                escapeHtml(
                                    display.originalText
                                ) +

                                "</span>"

                                :

                                ""

                        ) +

                        "</button>";

                }
            );

        } else {

            filesHtml +=

                '<div style="font-size:13px;color:#ff6b6b;">' +

                "No Proof of ID Initiation, Insurance Card, or EOB files found." +

                "</div>";

        }


        filesHtml +=
            "</div></div>";


        /* ========================================================
           POPUP HTML
           ======================================================== */

        popup.innerHTML =

            '<button id="closeAgePopup" style="position:absolute;top:5px;right:10px;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">×</button>' +


            /* AGE */

            '<div style="font-size:24px;font-weight:bold;display:flex;align-items:center;gap:10px;">' +

            "AGE: " +

            age +

            '<span style="width:14px;height:14px;border-radius:50%;background:' +

            ageColor +

            ';display:inline-block;"></span>' +

            "</div>" +


            /* PT */

            '<div style="margin-top:10px;font-size:24px;font-weight:bold;display:flex;align-items:center;gap:10px;">' +

            "PT: " +

            escapeHtml(
                planType
            ) +

            '<span style="width:14px;height:14px;border-radius:50%;background:' +

            ptColor +

            ';display:inline-block;"></span>' +

            "</div>" +


            /* HISTORY */

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


            /* STATE */

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


            /* VOB */

            vobHtml +


            /* FILES */

            filesHtml;


        /* ========================================================
           ADD POPUP
           ======================================================== */

        document.body.appendChild(
            popup
        );


        /* ========================================================
           CLOSE
           ======================================================== */

        const closeButton =
            popup.querySelector(
                "#closeAgePopup"
            );


        if (closeButton) {

            closeButton.onclick =
                function () {

                    popup.remove();

                };

        }


        /* ========================================================
           VOB EVENTS
           ======================================================== */

        popup
            .querySelectorAll(
                ".mainVobBtn"
            )
            .forEach(
                function (btn) {

                    btn.onclick =
                        function () {

                            const index =
                                parseInt(
                                    btn.getAttribute(
                                        "data-vob-index"
                                    ),
                                    10
                                );


                            const vob =
                                vobs[index];


                            if (!vob) {
                                return;
                            }


                            popup.remove();


                            setTimeout(
                                function () {

                                    vob.click();

                                },
                                100
                            );

                        };

                }
            );


        /* ========================================================
           FILE EVENTS
           ======================================================== */

        popup
            .querySelectorAll(
                ".mainFileBtn"
            )
            .forEach(
                function (btn) {

                    btn.onclick =
                        function () {

                            const index =
                                parseInt(
                                    btn.getAttribute(
                                        "data-file-index"
                                    ),
                                    10
                                );


                            const file =
                                supportedFiles[index];


                            if (
                                !file ||
                                !file.button
                            ) {

                                return;

                            }


                            /*
                             * Keep the original application
                             * element before removing popup.
                             */

                            const originalButton =
                                file.button;


                            popup.remove();


                            setTimeout(
                                function () {

                                    /*
                                     * Click the REAL
                                     * application control.
                                     */

                                    originalButton.click();

                                },
                                100
                            );

                        };

                }
            );


        /* ========================================================
           AUTO CLOSE
           ======================================================== */

        setTimeout(
            function () {

                const p =
                    document.getElementById(
                        "agePopupBookmarklet"
                    );


                if (p) {

                    p.remove();

                }

            },
            10000
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

        historyButton.click();

    }


    /* ============================================================
       OPEN CASE NOTES
       ============================================================ */

    if (
        !caseNotesIsOpen &&
        caseNotesButton
    ) {

        caseNotesButton.click();

    }


    /* ============================================================
       OPEN VOB
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
       WAIT FOR ANGULAR FILE LIST
       ============================================================ */

    setTimeout(
        function () {

            runLogic();

        },
        1000
    );

})();
