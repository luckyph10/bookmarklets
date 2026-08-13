(function () {

    const openerSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.small.text-muted.d-inline-flex.align-items-center.gap-1.user-select-none";

    const ptSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(7) > select";

    const openContentSelector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show";

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

        var plan = document.querySelector(ptSelector);

        if (plan) {
            planType =
                (
                    plan.options &&
                    plan.options[plan.selectedIndex]
                        ? plan.options[plan.selectedIndex].text
                        : plan.value || ""
                ).trim();
        }

        var text = "";

        document.querySelectorAll(
            "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.d-flex.flex-wrap.gap-3.mb-1 > span:nth-child(1), #ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.text-muted.fst-italic"
        ).forEach(function (e) {
            text += " " + e.innerText;
        });

        text = text.toLowerCase();

        var ptMatch = false;
        var matchedEvidence = [];

        if (
            planType === "Self Funded" ||
            planType === "Self Funded (Opt Out)"
        ) {

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

            for (
    var i = 0;
    i < selfFundedKeywords.length;
    i++
) {

    if (
        text.indexOf(
            selfFundedKeywords[i]
                .toLowerCase()
        ) > -1
    ) {

        ptMatch = true;

        matchedEvidence.push(
            selfFundedKeywords[i]
        );
    }
}

        } else {

            ptMatch =
                planType !== "Unknown" &&
                text.indexOf(
                    planType.toLowerCase()
                ) > -1;

            if (ptMatch) {
    matchedEvidence.push(planType);
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
    matchedEvidence.length
        ? '<div style="margin-top:8px;font-size:14px;color:#90ee90;">Evidence:<br>' +
          matchedEvidence.join("<br>") +
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

    const alreadyOpen =
        document.querySelector(
            openContentSelector
        );

    if (alreadyOpen) {

        runLogic();

    } else {

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

            setTimeout(
                runLogic,
                300
            );

        } else {

            runLogic();

        }
    }

})();
