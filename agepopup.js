(function () {
    var selector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.small.text-muted.d-inline-flex.align-items-center.gap-1.user-select-none";

    var tries = 0,
        maxTries = 20;

    function showAgePopup() {
        var e = document.querySelector("#DOB");
        if (!e) return;

        var dob = e.value || e.textContent || e.innerText;
        var d = new Date(dob);

        if (isNaN(d)) return;

        var today = new Date();

        // Calculate current age
        var age = today.getFullYear() - d.getFullYear();

        if (
            today.getMonth() < d.getMonth() ||
            (today.getMonth() === d.getMonth() &&
                today.getDate() < d.getDate())
        ) {
            age--;
        }

        // Calculate 65th birthday
        var sixtyFifthBirthday = new Date(d);
        sixtyFifthBirthday.setFullYear(d.getFullYear() + 65);

        // Remove time values for accurate day count
        var currentDate = new Date(today);
        currentDate.setHours(0, 0, 0, 0);

        var birthday65 = new Date(sixtyFifthBirthday);
        birthday65.setHours(0, 0, 0, 0);

        var diffDays = Math.ceil(
            (birthday65.getTime() - currentDate.getTime()) /
                (1000 * 60 * 60 * 24)
        );

        var ageInfo = "";

        if (age >= 65) {
            ageInfo =
                '<div style="font-size:14px;color:#ffb3b3;margin-top:4px;">✅ 65+ Eligible</div>';
        } else {
            if (diffDays === 1) {
                ageInfo =
                    '<div style="font-size:14px;color:#ffd666;margin-top:4px;">🎂 Turns 65: Tomorrow</div>';
            } else {
                ageInfo =
                    '<div style="font-size:14px;color:#ffd666;margin-top:4px;">🎂 Turns 65 in <b>' +
                    diffDays +
                    '</b> days</div>';
            }
        }

        var old = document.getElementById("agePopupBookmarklet");
        if (old) old.remove();

        var color = age >= 65 ? "#ff4d4f" : "#2ecc71";

        var popup = document.createElement("div");
        popup.id = "agePopupBookmarklet";

        popup.style.cssText =
            "position:fixed;" +
            "top:100px;" +
            "left:50%;" +
            "transform:translateX(-50%);" +
            "z-index:99999999;" +
            "background:rgba(0,0,0,.85);" +
            "backdrop-filter:blur(8px);" +
            "padding:14px 22px;" +
            "border-radius:14px;" +
            "box-shadow:0 8px 24px rgba(0,0,0,.4);" +
            "display:flex;" +
            "align-items:center;" +
            "gap:12px;" +
            "font-family:Segoe UI,Arial,sans-serif;" +
            "color:#fff;";

        popup.innerHTML =
            '<span style="width:14px;height:14px;border-radius:50%;background:' +
            color +
            ";box-shadow:0 0 10px " +
            color +
            ';"></span>' +
            '<div>' +
            '<div style="font-size:28px;font-weight:900;line-height:1;">AGE: ' +
            age +
            "</div>" +
            ageInfo +
            "</div>" +
            '<button style="margin-left:8px;background:none;border:none;color:#fff;font-size:24px;font-weight:bold;cursor:pointer;padding:0 4px;">&times;</button>';

        document.body.appendChild(popup);

        popup.querySelector("button").onclick = function () {
            popup.remove();
        };

        setTimeout(function () {
            var p = document.getElementById("agePopupBookmarklet");
            if (p) p.remove();
        }, 4000);
    }

    var interval = setInterval(function () {
        var el = document.querySelector(selector);

        if (el) {
            clearInterval(interval);

            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            el.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                })
            );

            el.style.outline = "3px solid orange";

            showAgePopup();
        }

        if (++tries > maxTries) {
            clearInterval(interval);
            alert("Element not found after waiting");
        }
    }, 300);
})();
