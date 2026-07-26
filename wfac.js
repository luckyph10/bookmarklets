(function () {

    function showPopup(title, message, color, autoClose = false, callback = null) {
        const old = document.getElementById('af-popup');
        if (old) old.remove();

        const popup = document.createElement('div');
        popup.id = 'af-popup';

        popup.innerHTML = `
            <div style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.7);
                z-index:99999999;
                display:flex;
                justify-content:center;
                align-items:center;
            ">
                <div style="
                    background:#fff;
                    width:450px;
                    max-width:90%;
                    border-radius:14px;
                    overflow:hidden;
                    box-shadow:0 15px 40px rgba(0,0,0,.35);
                    font-family:Arial,sans-serif;
                ">
                    <div style="
                        background:${color};
                        color:#fff;
                        padding:15px;
                        text-align:center;
                        font-size:24px;
                        font-weight:bold;
                    ">
                        ${title}
                    </div>

                    <div style="
                        padding:25px;
                        text-align:center;
                        font-size:16px;
                        color:#333;
                        line-height:1.6;
                    ">
                        ${message}
                    </div>

                    ${!autoClose ? `
                        <div style="
                            padding:15px;
                            text-align:center;
                            border-top:1px solid #eee;
                        ">
                            <button id="af-popup-close" style="
                                background:${color};
                                color:#fff;
                                border:none;
                                padding:10px 26px;
                                border-radius:6px;
                                cursor:pointer;
                                font-size:15px;
                                font-weight:bold;
                            ">
                                OK
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        if (autoClose) {
            setTimeout(function () {
                popup.remove();

                if (typeof callback === 'function') {
                    callback();
                }
            }, 2000);
        } else {
            const btn = document.getElementById('af-popup-close');

            if (btn) {
                btn.onclick = function () {
                    popup.remove();

                    if (typeof callback === 'function') {
                        callback();
                    }
                };
            }
        }
    }

    function checkRecentComment(textarea) {
        const matches = (textarea.value || '').match(/\b\d{2}\/\d{2}\/\d{2}\b/g);

        if (!matches || !matches.length) {
            return true;
        }

        let newest = null;
        let newestText = '';

        matches.forEach(function (dt) {
            const p = dt.split('/');

            const d = new Date(
                2000 + parseInt(p[2], 10),
                parseInt(p[0], 10) - 1,
                parseInt(p[1], 10)
            );

            if (!newest || d > newest) {
                newest = d;
                newestText = dt;
            }
        });

        if (!newest) {
            return true;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        newest.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
            (today.getTime() - newest.getTime()) / 86400000
        );

        if (diffDays <= 2) {
            return confirm(
                'WARNING\n\n' +
                'Recent comment found.\n\n' +
                'Date: ' + newestText +
                '\nDays: ' + diffDays +
                '\n\nContinue?'
            );
        }

        return true;
    }

    const el = document.querySelector(
        '#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > textarea'
    );

    if (!el) {
        showPopup(
            'ERROR',
            'Comment textbox not found.',
            '#d32f2f'
        );
        return;
    }

    const text = el.value || '';

    const m = text.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);

    if (!m) {
        showPopup(
            '✅ GOOD TO PROCESS',
            `
                <b>No MM/DD/YYYY date found.</b>
                <br><br>
                Continuing to comment selection...
            `,
            '#2e7d32',
            true,
            startCommentProcess
        );
        return;
    }

    const p = m[1].split('/');

    const foundDate = new Date(
        p[2],
        p[0] - 1,
        p[1]
    );

    const phNow = new Date(
        new Date().toLocaleString(
            'en-US',
            {
                timeZone: 'Asia/Manila'
            }
        )
    );

    const days = Math.floor(
        (phNow - foundDate) / (1000 * 60 * 60 * 24)
    );

    if (days < 3) {
        showPopup(
            '⚠ WARNING',
            `
                <b>Date Found:</b><br>${m[1]}<br><br>

                <span style="
                    color:#d32f2f;
                    font-size:22px;
                    font-weight:bold;
                ">
                    GAGO 2 DAYS PA LANG YAN NGANI 😫
                </span>

                <br><br>

                Age: <b>${days}</b> day(s)
            `,
            '#d32f2f'
        );

        return;
    }

    showPopup(
        '✅ GOOD TO PROCESS',
        `
            <b>Date:</b> ${m[1]}<br><br>
            <b>Age:</b> ${days} day(s)
        `,
        '#2e7d32',
        true,
        startCommentProcess
    );

    function startCommentProcess() {

          const items = [
            'Self-Funded NSA eligible - Plan type review',
            'Balanced Funding NSA eligible - Plan type review',
            'Fully Insured NSA eligible - Plan type review',
            'Fully Insured (Opt In) NSA eligible - Plan type review',
            'Exchange/Marketplace NSA eligible - Plan type review',
            'Fully Insured BlueCard NSA eligible - Plan type review',
            'VOB pending. Verified, no evidence',
            'Additional Information Requested',
            'Plan type review',
            'Reviewed, no action required',
            'VOB verified, no change to NSA jurisdiction',
            'Reviewed. Eligible. IDR Initiation document attached',
            'Email sent for closure',
            'Arbit ID AppID - Ineligible, closure has been verified',
            'IDRE sent email. DISP-XXXX has been closed'
        ];

        let menu = 'WFA COMMENTS\n\n';

        items.forEach(function (item, index) {
            menu += (index + 1) + '. ' + item + '\n';
        });

        const choice = prompt(menu, '');

        if (choice === null) {
            return;
        }

        const idx = parseInt(choice, 10) - 1;

        if (idx < 0 || idx >= items.length) {
            showPopup(
                'ERROR',
                'Invalid selection.',
                '#d32f2f'
            );
            return;
        }

        if (!checkRecentComment(el)) {
            return;
        }

        let finalComment = items[idx];

        if (finalComment.includes('DISP-XXXX')) {
            const disp = prompt(
                'Enter Dispute Number',
                ''
            );

            if (disp === null) {
                return;
            }

            if (!disp.trim()) {
                showPopup(
                    'ERROR',
                    'Dispute Number is required.',
                    '#d32f2f'
                );
                return;
            }

            finalComment = finalComment.replace(
                'DISP-XXXX',
                disp.trim()
            );
        }

        if ((el.value || '').includes(finalComment)) {
            const proceed = confirm(
                'WARNING\n\n' +
                'This comment already exists.\n\n' +
                'Do you want to continue anyway?'
            );

            if (!proceed) {
                return;
            }
        }

        const initials = (
            localStorage.getItem('afCommentInitials') || 'AF'
        )
            .trim()
            .toUpperCase();

        const parts = new Intl.DateTimeFormat(
            'en-US',
            {
                timeZone: 'Asia/Manila',
                month: '2-digit',
                day: '2-digit',
                year: '2-digit'
            }
        ).formatToParts(new Date());

        const mm = parts.find(x => x.type === 'month').value;
        const dd = parts.find(x => x.type === 'day').value;
        const yy = parts.find(x => x.type === 'year').value;

        const note =
            mm +
            '/' +
            dd +
            '/' +
            yy +
            ' - ' +
            finalComment +
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

        showPopup(
            '✅ SUCCESS',
            `
                Comment added successfully.
                <br><br>
                <b>${finalComment}</b>
            `,
            '#2e7d32'
        );
    }

})();
