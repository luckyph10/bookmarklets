(() => {

if (window.POGI_MODE_ACTIVE) return;
window.POGI_MODE_ACTIVE = true;

// ======================================
// CREATE HERO IMAGE
// ======================================

const hero = document.createElement("img");

hero.style.position = "fixed";
hero.style.left = "100px";
hero.style.top = "100px";
hero.style.width = "220px";
hero.style.height = "auto";
hero.style.zIndex = "999999999";
hero.style.pointerEvents = "auto";
hero.style.userSelect = "none";
hero.style.cursor = "pointer";

document.body.appendChild(hero);

// ======================================
// CREATE CAPE
// ======================================

const cape = document.createElement("div");

cape.style.position = "fixed";
cape.style.width = "90px";
cape.style.height = "140px";
cape.style.background = "linear-gradient(#ff0000,#880000)";
cape.style.clipPath =
  "polygon(25% 0%,75% 0%,100% 100%,0% 100%)";

cape.style.zIndex = "999999998";
cape.style.pointerEvents = "none";

document.body.appendChild(cape);

// ======================================
// REMOVE BACKGROUND
// ======================================

const sourceImage = new Image();
sourceImage.crossOrigin = "anonymous";

sourceImage.src =
"https://luckyph10.github.io/feeling_pogi_yarn/image.png";

let imageWidth = 220;
let imageHeight = 400;

sourceImage.onload = () => {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;

    ctx.drawImage(sourceImage, 0, 0);

    const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Remove white & checkerboard

        if (
            r > 180 &&
            g > 180 &&
            b > 180
        ) {
            data[i + 3] = 0;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    hero.src = canvas.toDataURL("image/png");

    imageHeight =
        (sourceImage.height /
        sourceImage.width)
        * imageWidth;
};

// ======================================
// MOVEMENT
// ======================================

let x = 100;
let y = 100;

let dx = 15;
let dy = 12;

let speed = 1;

// ======================================
// BOOST TEXT
// ======================================

function showText(msg, px, py) {

    const div = document.createElement("div");

    div.textContent = msg;

    div.style.position = "fixed";
    div.style.left = px + "px";
    div.style.top = py + "px";
    div.style.color = "red";
    div.style.fontWeight = "bold";
    div.style.fontSize = "28px";
    div.style.zIndex = "999999999";

    document.body.appendChild(div);

    let opacity = 1;

    const id = setInterval(() => {

        py -= 2;
        opacity -= 0.03;

        div.style.top = py + "px";
        div.style.opacity = opacity;

        if (opacity <= 0) {

            clearInterval(id);
            div.remove();
        }

    }, 16);
}

// ======================================
// SPEED TRAIL
// ======================================

function createTrail() {

    const t = document.createElement("div");

    t.innerHTML = "💨";

    t.style.position = "fixed";
    t.style.left = (x + 50) + "px";
    t.style.top = (y + 100) + "px";
    t.style.fontSize = "28px";
    t.style.pointerEvents = "none";
    t.style.zIndex = "999999990";

    document.body.appendChild(t);

    setTimeout(() => t.remove(), 500);
}

// ======================================
// MOUSE BOOST
// ======================================

hero.addEventListener("mouseenter", () => {

    speed += 1;

    if (speed > 6)
        speed = 6;

    showText("🚀 POGI BOOST!", x, y);

});

// ======================================
// TURBO MODE
// ======================================

hero.addEventListener("dblclick", () => {

    speed = 10;

    showText("⚡ TURBO POGI ⚡", x, y);

    setTimeout(() => {
        speed = 2;
    }, 3000);

});

// ======================================
// MAIN ANIMATION
// ======================================

function animate() {

    x += dx * speed;
    y += dy * speed;

    if (x <= 0) {
        dx = Math.abs(dx);
        showText("💥", x, y);
    }

    if (x + imageWidth >= innerWidth) {
        dx = -Math.abs(dx);
        showText("💥", x, y);
    }

    if (y <= 0) {
        dy = Math.abs(dy);
        showText("💥", x, y);
    }

    if (y + imageHeight >= innerHeight) {
        dy = -Math.abs(dy);
        showText("💥", x, y);
    }

    hero.style.left = x + "px";
    hero.style.top = y + "px";

    const angle =
      Math.atan2(dy, dx) * 180 / Math.PI;

    hero.style.transform =
      `rotate(${angle * 0.08}deg)`;

    cape.style.left =
      (x + imageWidth / 2 - 45 - Math.sign(dx) * 25)
      + "px";

    cape.style.top =
      (y + 20)
      + "px";

    cape.style.transform =
      `rotate(${Math.sin(Date.now()/100)*15}deg)`;

    if (Math.random() < 0.15)
        createTrail();

    requestAnimationFrame(animate);
}

animate();

// ======================================
// ESC TO REMOVE
// ======================================

window.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        hero.remove();
        cape.remove();

        window.POGI_MODE_ACTIVE = false;
    }

});

console.log("🦸 SUPER POGI MODE ACTIVATED");

})();







(function () {

    var KEY = "commentPopupAuthorized";

    if (localStorage.getItem(KEY) !== "yes") {

        var pwd = document.createElement("input");

        pwd.type = "password";
        pwd.placeholder = "Enter password";

        pwd.style.cssText =
            "position:fixed;" +
            "top:50%;" +
            "left:50%;" +
            "transform:translate(-50%,-50%);" +
            "z-index:9999999;" +
            "padding:10px;" +
            "font-size:16px;" +
            "border:2px solid #333;" +
            "background:#fff;" +
            "border-radius:6px;";

        document.body.appendChild(pwd);

        pwd.focus();

        pwd.addEventListener("keydown", function (e) {

            if (e.key === "Enter") {

                if (pwd.value === "202608") {

                    localStorage.setItem(KEY, "yes");

                    document.body.removeChild(pwd);

                    runScript();

                } else {

                    alert("Incorrect password");

                    document.body.removeChild(pwd);
                }
            }
        });

        return;
    }

    runScript();

    function runScript() {

        const el =
            document.querySelector('#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > textarea') ||
            document.querySelector('#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(7) > textarea');

        if (!el) {
            alert('Textarea not found');
            return;
        }

        const comments = [
            'VOB verified, no change to NSA jurisdiction',
            'Completed: VOB is verified Brief Ready to submit.',
            'Completed: VOB verified. Dispute status is closed. Payment determination is uploaded.',
            'Ineligible to Submit: Case was withdrawn by HaloMD.',
            'Ineligible to Submit: Case (Ineligibility reason)',
            'Ineligible to Submit: Government Plan.',
            'Ineligible to Submit: Patient is not over 65 years old, Insurance Type is Medicaid.',
            'Ineligible to Submit: Patient is over 65 years old. Primary Payer: Medicare.',
            'Ineligible to Submit: Ineligible Plan.',
            'Ineligible to Submit: Provider is in-Network.',
            'Ineligible to Submit: State Arbitration.',
            'Ineligible to Submit: Self Pay Plan type.',
            'Ineligible to Submit: Plan type did not match.',
            'Ineligible to Submit: State-based marketplace-State.',
            'Ineligible to Submit: Self-Funded Opt - In.',
            'Ineligible to Submit:Unable to find withdrawn email.',
            'Ineligible to Submit: Case (Unable to find evidence for INN)',
            'Pending Onshore Review: Dispute Status Closed. Patient over 65 years old, VOB is not available. Final payment determination uploaded.',
            'Pending Onshore Review: Incomplete ING evidence.',
            'Pending Onshore Review: Unable to update the dispute tracker c/o Lillian Madison.',
            'Pending Onshore Review: Plan type is Self funded, Policy Type is Medicaid.',
            'Dispute is pending VOB: No VOB checkmark AND no case notes confirming plan type.',
            'Dispute is pending VOB: The patient is over 65 years old. Unable to determine primary payer - VOB is not available.',
            'Dispute is pending VOB: Technical Error.',
            'Dispute is pending VOB: 100% of billed charges went to PR indicated in Ineligibility reason in Arbit.',
            'Dispute is Pending: No Plan Type Indicated in Arbit.',
            'Resubmission: CPT codes submitted for resubmission noted in case comments. Awaiting verification.',
            'Resubmission: CPT codes deleted for resubmission.Resubmitted dispute number available.'
        ];

        const oldPopup = document.getElementById('aldCommentPopup');

        if (oldPopup) {
            oldPopup.remove();
        }

        const popup = document.createElement('div');

        popup.id = 'aldCommentPopup';

        popup.style.cssText =
            'position:fixed;' +
            'top:50%;' +
            'left:50%;' +
            'transform:translate(-50%,-50%);' +
            'width:1100px;' +
            'max-width:95vw;' +
            'max-height:85vh;' +
            'overflow:auto;' +
            'background:#ffffff;' +
            'border:4px solid #333;' +
            'padding:15px;' +
            'z-index:999999;' +
            'font-family:Arial,sans-serif;' +
            'border-radius:10px;' +
            'box-shadow:0 0 25px rgba(0,0,0,.5);';

        popup.innerHTML =
            '<div style="font-size:26px;font-weight:900;color:#000;text-align:center;margin-bottom:15px;">VOB COMMENTS</div>';

        const initialsWrap = document.createElement('div');

initialsWrap.style.cssText =
    'position:absolute;' +
    'top:10px;' +
    'left:10px;' +
    'display:flex;' +
    'align-items:center;' +
    'gap:5px;';

const initialsInput = document.createElement('input');

initialsInput.type = 'text';
initialsInput.placeholder = 'Initials';
initialsInput.maxLength = 10;
initialsInput.value =
    localStorage.getItem('vobCommentInitials') || 'ALD';

initialsInput.style.cssText =
    'width:80px;' +
    'padding:6px;' +
    'border:1px solid #333;' +
    'border-radius:4px;' +
    'font-weight:bold;' +
    'text-transform:uppercase;';

const saveBtn = document.createElement('button');

saveBtn.textContent = 'Save';

saveBtn.style.cssText =
    'padding:6px 10px;' +
    'background:#1976d2;' +
    'color:#fff;' +
    'border:none;' +
    'border-radius:4px;' +
    'cursor:pointer;' +
    'font-weight:bold;';

saveBtn.onclick = function () {

    const val = initialsInput.value
        .trim()
        .toUpperCase();

    if (!val) {
        alert('Enter initials first.');
        return;
    }

    localStorage.setItem(
        'vobCommentInitials',
        val
    );

    alert('Initials saved: ' + val);
};

initialsWrap.appendChild(initialsInput);
initialsWrap.appendChild(saveBtn);

popup.appendChild(initialsWrap);
        const topClose = document.createElement('button');

        topClose.textContent = '✕';

        topClose.style.cssText =
            'position:absolute;' +
            'top:10px;' +
            'right:10px;' +
            'width:40px;' +
            'height:40px;' +
            'background:#333;' +
            'color:#fff;' +
            'font-weight:900;' +
            'font-size:22px;' +
            'border:none;' +
            'border-radius:6px;' +
            'cursor:pointer;';

        topClose.onclick = function () {
            popup.remove();
        };

        popup.appendChild(topClose);

        comments.forEach(txt => {
                     const btn = document.createElement('button');

            let bg = '#f0f0f0';

            if (txt.startsWith('Ineligible to Submit:')) {
                bg = '#ff8080';
            } else if (
                txt.startsWith('Dispute is pending VOB:') ||
                txt === 'Dispute is Pending: No Plan Type Indicated in Arbit.'
            ) {
                bg = '#fff176';
            } else if (txt.startsWith('Pending Onshore Review:')) {
                bg = '#ffb6e6';
            }

            btn.style.cssText =
                'display:block;' +
                'width:100%;' +
                'text-align:left;' +
                'margin:4px 0;' +
                'padding:10px;' +
                'border:2px solid #666;' +
                'border-radius:6px;' +
                'background:' + bg + ';' +
                'cursor:pointer;' +
                'font-weight:900;' +
                'color:#000000;' +
                'font-size:16px;' +
                'line-height:1.4;';

            btn.textContent = txt;

            btn.onclick = function () {

                let finalComment = txt;

                if (txt === 'Ineligible to Submit: Case (Ineligibility reason)') {

                    const reason = prompt(
                        'Enter the Ineligibility reason:',
                        ''
                    );

                    if (reason === null) {
                        return;
                    }

                    if (reason.trim() === '') {
                        return;
                    }

                    finalComment =
                        'Ineligible to Submit: Case (' +
                        reason.trim() +
                        ')';
                }

                const existingText = el.value || '';

                if (existingText.includes(finalComment)) {

                    const proceed = confirm(
                        'WARNING:\n\n' +
                        'This comment already exists in the comment box.\n\n' +
                        'Do you want to proceed anyway?'
                    );

                    if (!proceed) {
                        return;
                    }
                }

                const d = new Date();

                const mm = String(
                    d.getMonth() + 1
                ).padStart(2, '0');

                const dd = String(
                    d.getDate()
                ).padStart(2, '0');

                const yy = String(
                    d.getFullYear()
                ).slice(-2);

                const initials =
    (
        localStorage.getItem('vobCommentInitials') ||
        'ALD'
    )
    .trim()
    .toUpperCase();

const note =
    `${mm}/${dd}/${yy} ${finalComment} - ${initials}`;

                el.value =
                    note +
                    (
                        el.value.trim()
                            ? '\n\n' + el.value
                            : ''
                    );

                el.dispatchEvent(
                    new Event(
                        'input',
                        { bubbles: true }
                    )
                );

                el.dispatchEvent(
                    new Event(
                        'change',
                        { bubbles: true }
                    )
                );

                popup.remove();
            };

            btn.onmouseover = function () {
                this.style.filter = 'brightness(95%)';
            };

            btn.onmouseout = function () {
                this.style.filter = 'brightness(100%)';
            };

            popup.appendChild(btn);
        });

        const close = document.createElement('button');

        close.textContent = 'CLOSE';

        close.style.cssText =
            'margin-top:10px;' +
            'padding:10px 25px;' +
            'background:#333;' +
            'color:#fff;' +
            'font-weight:900;' +
            'font-size:15px;' +
            'border:none;' +
            'border-radius:6px;' +
            'cursor:pointer;';

        close.onclick = function () {
            popup.remove();
        };

        popup.appendChild(close);

        document.body.appendChild(popup);
    }

})(); 
