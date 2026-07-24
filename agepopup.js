(function () {
    var selector = "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.small.text-muted.d-inline-flex.align-items-center.gap-1.user-select-none";

    var tries = 0,
        maxTries = 20;

    function showAgePopup() {
        var e = document.querySelector("#DOB");
        if (!e) return;

        var dob = e.value || e.textContent || e.innerText;
        var d = new Date(dob);

        if (isNaN(d)) return;

        var t = new Date();
        var age = t.getFullYear() - d.getFullYear();

        if (
            t.getMonth() < d.getMonth() ||
            (t.getMonth() === d.getMonth() && t.getDate() < d.getDate())
        ) {
            age--;
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
            '<span style="font-size:28px;font-weight:900;line-height:1;">AGE: ' +
            age +
            "</span>" +
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
