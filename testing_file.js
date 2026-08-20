(function () {
    const el = document.querySelector(
        '#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > textarea'
    );

    if (!el) {
        console.error('Comment textbox not found');
        return;
    }

    /* =========================================================
       COMMENT LIST
       ========================================================= */

    const items = [
        {
            header: true,
            text: 'REVIEW'
        },
        {
            header: false,
            text: 'Reviewed, no action required'
        },
        {
            header: false,
            text: 'Reviewed. Eligible. IDR Initiation document attached'
        },
        {
            header: false,
            text: 'VOB verified, no change to NSA jurisdiction'
        },

        {
            header: true,
            text: 'BATCH CASE DIFFERENT PLAN TYPE'
        },
        {
            header: false,
            text: 'Plan type review'
        },
        {
            header: false,
            text: 'Self-Funded NSA eligible - Plan type review'
        },
        {
            header: false,
            text: 'Balanced Funding NSA eligible - Plan type review'
        },
        {
            header: false,
            text: 'Fully Insured NSA eligible - Plan type review'
        },
        {
            header: false,
            text: 'Fully Insured (Opt In) NSA eligible - Plan type review'
        },
        {
            header: false,
            text: 'Exchange/Marketplace NSA eligible - Plan type review'
        },
        {
            header: false,
            text: 'Fully Insured BlueCard NSA eligible - Plan type review'
        },
        {
            header: false,
            text: 'VOB pending. Verified, no evidence'
        },
        {
            header: false,
            text: 'Additional Information Requested'
        },

        {
            header: true,
            text: 'CLOSURE/CLOSED'
        },
        {
            header: false,
            text: 'Email sent for closure'
        },
        {
            header: false,
            text: 'Arbit ID AppID - Ineligible, closure has been verified'
        },
        {
            header: false,
            text: 'IDRE sent email. DISP-XXXX has been closed',
            needsDisp: true
        }
    ];

    /* =========================================================
       REMOVE EXISTING POPUP
       ========================================================= */

    const old = document.getElementById(
        'afCommentPopup'
    );

    if (old) {
        old.remove();
    }

    /* =========================================================
       CREATE POPUP
       ========================================================= */

    const popup = document.createElement('div');

    popup.id = 'afCommentPopup';

    popup.style.cssText =
        'position:fixed;' +
        'top:50%;' +
        'left:50%;' +
        'transform:translate(-50%,-50%);' +
        'width:1100px;' +
        'max-width:95vw;' +
        'max-height:85vh;' +
        'overflow:auto;' +
        'background:rgba(0,0,0,.75);' +
        'border:4px solid #fff;' +
        'padding:15px;' +
        'z-index:9999999;' +
        'font-family:Arial,sans-serif;' +
        'border-radius:10px;' +
        'box-shadow:0 0 25px rgba(0,0,0,.6);' +
        'color:#fff;';

    popup.innerHTML =
        '<div style="' +
        'font-size:30px;' +
        'font-weight:bold;' +
        'color:#fff;' +
        'text-align:center;' +
        'margin-bottom:15px;' +
        '">' +
        'Plan Type Comment List' +
        '</div>';

    /* =========================================================
       INITIALS
       ========================================================= */

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
        localStorage.getItem('afCommentInitials') || '';

    initialsInput.style.cssText =
        'width:80px;' +
        'padding:6px;' +
        'border:1px solid #fff;' +
        'border-radius:4px;' +
        'font-weight:bold;' +
        'text-transform:uppercase;' +
        'background:rgba(0,0,0,.5);' +
        'color:#fff;';

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
        const val =
            initialsInput.value
                .trim()
                .toUpperCase();

        if (!val) {
            console.error(
                'Enter your initials first.'
            );

            initialsInput.focus();

            return;
        }

        localStorage.setItem(
            'afCommentInitials',
            val
        );

        initialsInput.value = val;
    };

    initialsWrap.appendChild(initialsInput);
    initialsWrap.appendChild(saveBtn);

    popup.appendChild(initialsWrap);

    /* =========================================================
       CLOSE BUTTON
       ========================================================= */

    const topClose = document.createElement('button');

    topClose.textContent = '✕';

    topClose.style.cssText =
        'position:absolute;' +
        'top:10px;' +
        'right:10px;' +
        'width:40px;' +
        'height:40px;' +
        'background:#000;' +
        'color:#fff;' +
        'border:none;' +
        'border-radius:6px;' +
        'font-size:22px;' +
        'font-weight:bold;' +
        'cursor:pointer;';

    topClose.onclick = function () {
        popup.remove();
    };

    popup.appendChild(topClose);

    /* =========================================================
       COMMENT BUTTONS
       ========================================================= */

    items.forEach(function (item) {

        if (item.header) {
            const h = document.createElement('div');

            h.textContent = item.text;

            h.style.cssText =
                'background:#1976d2;' +
                'color:#fff;' +
                'font-weight:bold;' +
                'font-size:20px;' +
                'text-align:center;' +
                'padding:10px;' +
                'margin:10px 0 5px;' +
                'border-radius:6px;';

            popup.appendChild(h);

            return;
        }

        const btn = document.createElement('button');

        btn.textContent = item.text;

        btn.style.cssText =
            'display:block;' +
            'width:100%;' +
            'text-align:left;' +
            'margin:5px 0;' +
            'padding:12px;' +
            'border:2px solid #fff;' +
            'border-radius:6px;' +
            'background:rgba(0,0,0,.45);' +
            'cursor:pointer;' +
            'font-weight:bold;' +
            'font-size:18px;' +
            'line-height:1.5;' +
            'color:#fff;' +
            'transition:background .15s ease;';

        btn.onmouseover = function () {
            this.style.background = '#003366';
        };

        btn.onmouseout = function () {
            this.style.background =
                'rgba(0,0,0,.45)';
        };

        btn.onclick = function () {

            /* =================================================
               INITIALS ARE REQUIRED
               ================================================= */

            const initials =
                (
                    localStorage.getItem(
                        'afCommentInitials'
                    ) || ''
                )
                    .trim()
                    .toUpperCase();

            if (!initials) {
                console.error(
                    'Your initials are not set yet. Please enter your initials and click Save before adding a comment.'
                );

                initialsInput.focus();

                return;
            }

            let finalComment = item.text;

            /* =================================================
               DISPUTE NUMBER
               ================================================= */

            if (item.needsDisp) {

                const disp = prompt(
                    'Enter Dispute Number (example: DISP-6731470)',
                    ''
                );

                if (disp === null) {
                    return;
                }

                if (!disp.trim()) {
                    console.error(
                        'Dispute Number is required.'
                    );

                    return;
                }

                finalComment =
                    finalComment.replace(
                        'DISP-XXXX',
                        disp.trim()
                    );
            }

            /* =================================================
               ADD COMMENT
               ================================================= */

            const d = new Date();

            /*
             * Keep the existing behavior:
             * comment date = tomorrow.
             */

            d.setDate(
                d.getDate() + 1
            );

            const mm = String(
                d.getMonth() + 1
            ).padStart(2, '0');

            const dd = String(
                d.getDate()
            ).padStart(2, '0');

            const yy = String(
                d.getFullYear()
            ).slice(-2);

            const note =
                finalComment +
                ' - ' +
                mm +
                '/' +
                dd +
                '/' +
                yy +
                ' - ' +
                initials;

            el.value =
                note +
                (
                    el.value.trim()
                        ? '\n\n' + el.value
                        : ''
                );

            el.dispatchEvent(
                new Event('input', {
                    bubbles: true
                })
            );

            el.dispatchEvent(
                new Event('change', {
                    bubbles: true
                })
            );

            popup.remove();
        };

        popup.appendChild(btn);
    });

    /* =========================================================
       CLOSE
       ========================================================= */

    const close = document.createElement('button');

    close.textContent = 'CLOSE';

    close.style.cssText =
        'margin-top:10px;' +
        'padding:12px 25px;' +
        'background:#000;' +
        'color:#fff;' +
        'font-weight:bold;' +
        'font-size:16px;' +
        'border:none;' +
        'border-radius:6px;' +
        'cursor:pointer;';

    close.onclick = function () {
        popup.remove();
    };

    popup.appendChild(close);

    document.body.appendChild(popup);

})();
