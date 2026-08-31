

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
