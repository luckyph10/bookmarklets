(function () {

    const openerSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.small.text-muted.d-inline-flex.align-items-center.gap-1.user-select-none";

    const openContentSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show";

    const caseNotesSelector =
        "#ngForm > fieldset > div:nth-child(24) > div.collapse.show > div > div:nth-child(3) > div > div > table > tbody";

    const caseNotesButtonSelector =
        "#ngForm > fieldset > div:nth-child(24) > div.d-flex.mb-2 > button";

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

        /* Plan Type selector - KEEPING YOUR WORKING LOGIC */
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

        var historyText = "";

        document.querySelectorAll(
            "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.d-flex.flex-wrap.gap-3.mb-1 > span:nth-child(1), #ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.text-muted.fst-italic"
        ).forEach(function (e) {
            historyText += " " + e.innerText;
        });

        historyText =
            historyText.toLowerCase();

        var caseNotesText = "";

        var caseNotesElement =
            document.querySelector(
                caseNotesSelector
            );

        if (caseNotesElement) {
            caseNotesText =
                caseNotesElement.innerText.toLowerCase();
        }

        var ptMatch = false;

        var historyEvidence = [];
        var caseNotesEvidence = [];

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

        var ageColor =
            age >= 65
                ? "#ff4d4f"
                : "#2ecc71";

        var ptColor =
            ptMatch
                ? "#2ecc71"
                : "#ff4d4f";

        var old =
            document.getElementById(
                "agePopupBookmarklet"
            );

        if (old) {
            old.remove();
        }

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
            '<button style="position:absolute;top:5px;right:10px;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">×</button>' +

            '<div style="font-size:24px;font-weight:bold;display:flex;align-items:center;gap:10px;">AGE: ' +
            age +
            ' <span style="width:14px;height:14px;border-radius:50%;background:' +
            ageColor +
            ';display:inline-block;"></span></div>' +

            '<div style="margin-top:10px;font-size:24px;font-weight:bold;display:flex;align-items:center;gap:10px;">PT: ' +
            planType +
            ' <span style="width:14px;height:14px;border-radius:50%;background:' +
            ptColor +
            ';display:inline-block;"></span></div>' +

            (
                historyEvidence.length
                    ? '<div style="margin-top:10px;font-size:14px;color:#90ee90;"><strong>History Evidence:</strong><br>' +
                    historyEvidence.join("<br>") +
                    "</div>"
                    : ""
            ) +

            (
                caseNotesEvidence.length
                    ? '<div style="margin-top:10px;font-size:14px;color:#90ee90;"><strong>Case Notes:</strong><br>' +
                    caseNotesEvidence.join("<br>") +
                    "</div>"
                    : ""
            );

        document.body.appendChild(
            popup
        );

        popup.querySelector(
            "button"
        ).onclick = function () {
            popup.remove();
        };

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

    const historyIsOpen =
        document.querySelector(
            openContentSelector
        );

    const caseNotesIsOpen =
        document.querySelector(
            caseNotesSelector
        );

    const historyButton =
        document.querySelector(
            openerSelector
        );

    const caseNotesButton =
        document.querySelector(
            caseNotesButtonSelector
        );

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

    setTimeout(
        function () {
            runLogic();
        },
        500
    );

})();