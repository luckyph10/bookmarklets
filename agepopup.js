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

        // Calculate Age
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

        var currentDate = new Date(today);
        currentDate.setHours(0, 0, 0, 0);

        var birthday65 = new Date(sixtyFifthBirthday);
        birthday65.setHours(0, 0, 0, 0);

        var diffDays = Math.ceil(
            (birthday65.getTime() - currentDate.getTime()) /
                (1000 * 60 * 60 * 24)
        );

        var rangeText = "";

        if (age >= 65) {
            rangeText = "✅ 65+ Eligible";
        } else if (diffDays === 1) {
            rangeText = "🎂 Turns 65 Tomorrow";
        } else {
            rangeText = "🎂 Turns 65 in " + diffDays + " days";
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
            "background:rgba(0,0,0,.88);" +
            "backdrop-filter:blur(10px);" +
            "padding:18px 26px;" +
            "border-radius:16px;" +
            "box-shadow:0 10px 30px rgba(0,0,0,.45);" +
            "font-family:Segoe UI,Arial,sans-serif;" +
            "color:#fff;" +
            "text-align:center;" +
            "position:relative;" +
            "min-width:240px;";

        popup.innerHTML =
            '<button style="' +
            'position:absolute;' +
            'top:6px;' +
            'right:10px;' +
            'background:none;' +
            'border:none;' +
            'color:#fff;' +
            'font-size:22px;' +
            'font-weight:bold;' +
            'cursor:pointer;' +
            'padding:0;">&times;</button>' +

            '<div style="display:flex;flex-direction:column;align-items:center;">' +

            '<span style="' +
            'width:16px;' +
            'height:16px;' +
            'border-radius:50%;' +
            'background:' + color + ';' +
            'box-shadow:0 0 12px ' + color + ';' +
            'margin-bottom:10px;">' +
            '</span>' +

            '<div style="' +
            'font-size:32px;' +
            'font-weight:900;' +
            'line-height:1.1;">' +
            'AGE: ' + age +
            '</div>' +

            '<div style="' +
            'font-size:15px;' +
            'margin-top:8px;' +
            'font-weight:600;' +
            'color:#ffd666;">' +
            rangeText +
            '</div>' +

            '</div>';

        document.body.appendChild(popup);

        popup.querySelector("button").onclick = function () {
            popup.remove();
        };

        setTimeout(function () {
            var p = document.getElementById("agePopupBookmarklet");
            if (p) p.remove();
        }, 5000);
    }

    var interval = setInterval(function () {
        var el = document.querySelector(selector);

        if (el) {
            clearInterval(interval);

            el.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            el.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
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
