javascript
(function () {
    "use strict";

    const POPUP_ID = "agePopupBookmarklet";

    const SELF_FUNDED_KEYWORDS = [
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

    function clean(value) {
        return String(value || "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getValue(element) {
        if (!element) {
            return "";
        }

        if (
            typeof element.value !== "undefined" &&
            element.value
        ) {
            return clean(element.value);
        }

        return clean(
            element.textContent ||
            element.innerText ||
            ""
        );
    }

    function getSelectedText(select) {
        if (!select) {
            return "";
        }

        if (
            select.options &&
            select.selectedIndex >= 0 &&
            select.options[select.selectedIndex]
        ) {
            return clean(
                select.options[select.selectedIndex].text
            );
        }

        return clean(select.value);
    }

    function getAge(value) {
        if (!value) {
            return null;
        }

        let date = null;

        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const parts = value.split("-");
            date = new Date(
                Number(parts[0]),
                Number(parts[1]) - 1,
                Number(parts[2])
            );
        } else {
            date = new Date(value);
        }

        if (isNaN(date.getTime())) {
            return null;
        }

        const today = new Date();

        let age =
            today.getFullYear() -
            date.getFullYear();

        const birthdayPassed =
            today.getMonth() > date.getMonth() ||
            (
                today.getMonth() === date.getMonth() &&
                today.getDate() >= date.getDate()
            );

        if (!birthdayPassed) {
            age--;
        }

        return age;
    }

    function findDOB() {
        const selectors = [
            "#DOB",
            "input#DOB",
            "input[name='DOB']",
            "input[name='dob']",
            "input[formcontrolname='DOB']",
            "input[formControlName='DOB']",
            "input[formcontrolname='dob']",
            "input[formControlName='dob']"
        ];

        for (let i = 0; i < selectors.length; i++) {
            const element =
                document.querySelector(selectors[i]);

            if (element) {
                const value = getValue(element);

                if (value) {
                    return {
                        element: element,
                        value: value
                    };
                }
            }
        }

        return null;
    }

    function findPlanSelects() {
        const selects =
            Array.from(document.querySelectorAll("select"));

        let primary = null;
        let secondary = null;

        const primarySelector =
            "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(6) > select";

        const secondarySelector =
            "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7) > select";

        primary =
            document.querySelector(primarySelector);

        secondary =
            document.querySelector(secondarySelector);

        if (!primary || !secondary) {
            const ngForm =
                document.querySelector("#ngForm");

            if (ngForm) {
                const nearbySelects =
                    Array.from(
                        ngForm.querySelectorAll("select")
                    );

                const insuranceSelects =
                    nearbySelects.filter(function (select) {
                        const text =
                            clean(
                                select.parentElement
                                    ? select.parentElement.parentElement
                                        ?.innerText
                                    : ""
                            ).toLowerCase();

                        return (
                            text.includes("plan") ||
                            text.includes("insurance") ||
                            text.includes("primary") ||
                            text.includes("secondary")
                        );
                    });

                if (!primary && insuranceSelects[0]) {
                    primary = insuranceSelects[0];
                }

                if (!secondary && insuranceSelects[1]) {
                    secondary = insuranceSelects[1];
                }
            }
        }

        if (!primary && selects.length >= 6) {
            primary = selects[5];
        }

        if (!secondary && selects.length >= 7) {
            secondary = selects[6];
        }

        return {
            primary: primary,
            secondary: secondary
        };
    }

    function findHistoryComponent() {
        return document.querySelector(
            "app-vob-history"
        );
    }

    function getHistoryText() {
        const component =
            findHistoryComponent();

        if (!component) {
            return "";
        }

        const visible =
            Array.from(
                component.querySelectorAll("*")
            ).filter(function (element) {
                const style =
                    window.getComputedStyle(element);

                return (
                    style.display !== "none" &&
                    style.visibility !== "hidden" &&
                    element.offsetParent !== null
                );
            });

        let text = "";

        visible.forEach(function (element) {
            const value =
                clean(
                    element.innerText ||
                    element.textContent ||
                    ""
                );

            if (value) {
                text += " " + value;
            }
        });

        if (!text.trim()) {
            text =
                clean(
                    component.innerText ||
                    component.textContent ||
                    ""
                );
        }

        return text
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();
    }

    function findEvidence(text) {
        for (
            let i = 0;
            i < SELF_FUNDED_KEYWORDS.length;
            i++
        ) {
            const keyword =
                SELF_FUNDED_KEYWORDS[i];

            if (
                text.indexOf(
                    keyword.toLowerCase()
                ) !== -1
            ) {
                return keyword;
            }
        }

        return "";
    }

    function isSelfFunded(plan) {
        const value =
            clean(plan).toLowerCase();

        return (
            value === "self funded" ||
            value === "self-funded" ||
            value === "self funded (opt out)" ||
            value === "self-funded (opt out)"
        );
    }

    function getPlanMatch(
        primaryPlan,
        secondaryPlan,
        historyText
    ) {
        let matched = false;
        let evidence = "";

        if (isSelfFunded(primaryPlan)) {
            evidence =
                findEvidence(historyText);

            if (evidence) {
                matched = true;
            }
        } else if (
            primaryPlan &&
            primaryPlan.toLowerCase() !== "unknown"
        ) {
            if (
                historyText.indexOf(
                    primaryPlan.toLowerCase()
                ) !== -1
            ) {
                matched = true;
                evidence = primaryPlan;
            }
        }

        if (!matched && secondaryPlan) {
            if (
                historyText.indexOf(
                    secondaryPlan.toLowerCase()
                ) !== -1
            ) {
                matched = true;
                evidence = secondaryPlan;
            }
        }

        if (!matched && secondaryPlan) {
            evidence =
                findEvidence(historyText);

            if (evidence) {
                matched = true;
            }
        }

        return {
            matched: matched,
            evidence: evidence
        };
    }

    function removePopup() {
        const popup =
            document.getElementById(POPUP_ID);

        if (popup) {
            popup.remove();
        }
    }

    function showPopup(
        age,
        planType,
        ptMatch,
        evidence
    ) {
        removePopup();

        const popup =
            document.createElement("div");

        popup.id = POPUP_ID;

        const ageColor =
            age >= 65
                ? "#ff4d4f"
                : "#2ecc71";

        const ptColor =
            ptMatch
                ? "#2ecc71"
                : "#ff4d4f";

        popup.style.cssText =
            "position:fixed;" +
            "top:100px;" +
            "left:50%;" +
            "transform:translateX(-50%);" +
            "background:rgba(0,0,0,.94);" +
            "color:white;" +
            "padding:20px 24px;" +
            "border-radius:16px;" +
            "z-index:2147483647;" +
            "font-family:Segoe UI,Arial,sans-serif;" +
            "box-shadow:0 10px 35px rgba(0,0,0,.5);" +
            "min-width:300px;" +
            "max-width:520px;" +
            "box-sizing:border-box;";

        popup.innerHTML =
            '<button type="button" ' +
            'style="' +
            'position:absolute;' +
            'right:8px;' +
            'top:5px;' +
            'background:none;' +
            'border:0;' +
            'color:white;' +
            'font-size:24px;' +
            'cursor:pointer;' +
            '">×</button>' +

            '<div style="' +
            'font-size:24px;' +
            'font-weight:700;' +
            'display:flex;' +
            'align-items:center;' +
            'gap:10px;' +
            '">' +
            'AGE: ' +
            escapeHtml(age) +
            '<span style="' +
            'width:14px;' +
            'height:14px;' +
            'border-radius:50%;' +
            'background:' +
            ageColor +
            ';' +
            'display:inline-block;' +
            '"></span>' +
            '</div>' +

            '<div style="' +
            'font-size:24px;' +
            'font-weight:700;' +
            'display:flex;' +
            'align-items:center;' +
            'gap:10px;' +
            'margin-top:10px;' +
            '">' +
            'PT: ' +
            escapeHtml(planType) +
            '<span style="' +
            'width:14px;' +
            'height:14px;' +
            'border-radius:50%;' +
            'background:' +
            ptColor +
            ';' +
            'display:inline-block;' +
            '"></span>' +
            '</div>' +

            (
                evidence
                    ? '<div style="' +
                      'margin-top:10px;' +
                      'font-size:14px;' +
                      'color:#90ee90;' +
                      'word-break:break-word;' +
                      '">' +
                      'Evidence: ' +
                      escapeHtml(evidence) +
                      '</div>'
                    : ""
            );

        document.body.appendChild(popup);

        const button =
            popup.querySelector("button");

        if (button) {
            button.onclick =
                removePopup;
        }

        setTimeout(function () {
            removePopup();
        }, 7000);
    }

    function run() {
        const dob =
            findDOB();

        if (!dob) {
            alert("DOB not found");
            return;
        }

        const age =
            getAge(dob.value);

        if (
            age === null ||
            age < 0 ||
            age > 130
        ) {
            alert(
                "Invalid DOB: " +
                dob.value
            );
            return;
        }

        const plans =
            findPlanSelects();

        const primaryPlan =
            getSelectedText(
                plans.primary
            ) || "Unknown";

        const secondaryPlan =
            getSelectedText(
                plans.secondary
            );

        const historyText =
            getHistoryText();

        const result =
            getPlanMatch(
                primaryPlan,
                secondaryPlan,
                historyText
            );

        showPopup(
            age,
            primaryPlan,
            result.matched,
            result.evidence
        );
    }

    function openHistory() {
        const component =
            findHistoryComponent();

        if (!component) {
            run();
            return;
        }

        const openContent =
            component.querySelector(
                ".collapse.show"
            );

        if (openContent) {
            waitForHistory();
            return;
        }

        const possibleOpeners =
            Array.from(
                component.querySelectorAll("*")
            ).filter(function (element) {
                const text =
                    clean(
                        element.innerText ||
                        element.textContent ||
                        ""
                    ).toLowerCase();

                return (
                    text.includes("history") ||
                    element.classList.contains(
                        "user-select-none"
                    )
                );
            });

        let opener =
            possibleOpeners[
                possibleOpeners.length - 1
            ];

        if (!opener) {
            opener =
                component.querySelector(
                    "[data-bs-toggle='collapse']"
                );
        }

        if (opener) {
            try {
                opener.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            } catch (e) {}

            opener.click();
        }

        waitForHistory();
    }

    function waitForHistory() {
        let attempts = 0;

        const timer =
            setInterval(function () {
                attempts++;

                const component =
                    findHistoryComponent();

                const text =
                    getHistoryText();

                const openContent =
                    component
                        ? component.querySelector(
                            ".collapse.show"
                        )
                        : null;

                if (
                    text.length > 0 ||
                    openContent ||
                    attempts >= 20
                ) {
                    clearInterval(timer);
                    run();
                }
            }, 150);
    }

    openHistory();
})();

