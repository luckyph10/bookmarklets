(function () {
    var selector =
        "#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.small.text-muted.d-inline-flex.align-items-center.gap-1.user-select-none";

    var tries = 0;
    var maxTries = 20;

    function showAgePopup() {
        var dobElement = document.querySelector("#DOB");
        if (!dobElement) return;

        var dobValue =
            dobElement.value ||
            dobElement.textContent ||
            dobElement.innerText;

        var dob = new Date(dobValue);

        if (isNaN(dob)) return;

        var today = new Date();

        // Calculate age
        var age = today.getFullYear() - dob.getFullYear();

        if (
            today.getMonth() < dob.getMonth() ||
            (today.getMonth() === dob.getMonth() &&
                today.getDate() < dob.getDate())
        ) {
            age--;
        }

        // Calculate 65th birthday (logic preserved)
        var sixtyFifthBirthday = new Date(dob);
        sixtyFifthBirthday.setFullYear(dob.getFullYear() + 65);

        var todayOnly = new Date();
        todayOnly.setHours(0, 0, 0, 0);

        var birthdayOnly = new Date(sixtyFifthBirthday);
        birthdayOnly.setHours(0, 0, 0, 0);

        var diffDays = Math.ceil(
            (birthdayOnly - todayOnly) /
                (1000 * 60 * 60 * 24)
        );

        // Indicator logic preserved
        var indicatorColor = "#2ecc71";

        if (age >= 65) {
            indicatorColor = "#ff4d4f";
        }

        // Remove existing popup
        var existingPopup = document.getElementById(
            "agePopupBookmarklet"
        );

        if (existingPopup) {
            existingPopup.remove();
        }

        // Create popup
        var popup = document.createElement("div");
        popup.id = "agePopupBookmarklet";

        popup.style.cssText =
            "position:fixed;" +
            "top:100px;" +
            "left:50%;" +
            "transform:translateX(-50%);" +
            "z-index:99999999;" +
            "background:rgba(0,0,0,0.88);" +
            "backdrop-filter:blur(10px);" +
            "padding:20px 28px;" +
            "border-radius:16px;" +
            "box-shadow:0 10px 30px rgba(0,0,0,.45);" +
            "font-family:'Segoe UI',Arial,sans-serif;" +
            "color:#fff;" +
            "text-align:center;" +
            "min-width:250px;";

        popup.innerHTML = `
            <button
                style="
                    position:absolute;
                    top:8px;
                    right:10px;
                    background:none;
                    border:none;
                    color:white;
                    font-size:20px;
                    cursor:pointer;
                    font-weight:bold;
                "
            >&times;</button>

            <div
                style="
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:center;
                "
            >
                <div
                    style="
                        width:16px;
                        height:16px;
                        border-radius:50%;
                        background:${indicatorColor};
                        box-shadow:0 0 12px ${indicatorColor};
                        margin-bottom:10px;
                    "
                ></div>

                <div
                    style="
                        font-size:32px;
                        font-weight:900;
                        line-height:1;
                    "
                >
                    AGE: ${age}
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        popup.querySelector("button").onclick = function () {
            popup.remove();
        };

        setTimeout(function () {
            var popupExists =
                document.getElementById("agePopupBookmarklet");

            if (popupExists) {
                popupExists.remove();
            }
        }, 5000);
    }

    var interval = setInterval(function () {
        var element = document.querySelector(selector);

        if (element) {
            clearInterval(interval);

            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            element.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );

            element.style.outline = "3px solid orange";

            showAgePopup();
        }

        if (++tries > maxTries) {
            clearInterval(interval);
            alert("Element not found after waiting");
        }
    }, 300);
})();
