(function () {
    const el = document.querySelector(
        '#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > textarea'
    );

    if (!el) {
        console.error('Comment textbox not found');
        return;
    }

    /* =========================================================
       DATE PARSER
       ========================================================= */

    function parseDatesFromText(text) {
        const dates = [];
        let m;

        const patterns = [
            {
                regex: /\b(0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12]\d|3[01])[\/\-\.](\d{4})\b/g,
                type: 'mdy4'
            },
            {
                regex: /\b(0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12]\d|3[01])[\/\-\.](\d{2})\b/g,
                type: 'mdy2'
            },
            {
                regex: /\b(\d{4})[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12]\d|3[01])\b/g,
                type: 'ymd'
            },
            {
                regex: /\b(0?[1-9]|[12]\d|3[01])[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](\d{4})\b/g,
                type: 'dmy4'
            },
            {
                regex: /\b(0?[1-9]|[12]\d|3[01])[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](\d{2})\b/g,
                type: 'dmy2'
            }
        ];

        patterns.forEach(function (pattern) {
            while ((m = pattern.regex.exec(text)) !== null) {
                let date = null;
                const original = m[0];

                if (pattern.type === 'mdy4') {
                    const month = parseInt(m[1], 10);
                    const day = parseInt(m[2], 10);
                    const year = parseInt(m[3], 10);

                    date = new Date(year, month - 1, day);
                }

                if (pattern.type === 'mdy2') {
                    const month = parseInt(m[1], 10);
                    const day = parseInt(m[2], 10);
                    const year = 2000 + parseInt(m[3], 10);

                    date = new Date(year, month - 1, day);
                }

                if (pattern.type === 'ymd') {
                    const year = parseInt(m[1], 10);
                    const month = parseInt(m[2], 10);
                    const day = parseInt(m[3], 10);

                    date = new Date(year, month - 1, day);
                }

                if (pattern.type === 'dmy4') {
                    const day = parseInt(m[1], 10);
                    const month = parseInt(m[2], 10);
                    const year = parseInt(m[3], 10);

                    date = new Date(year, month - 1, day);
                }

                if (pattern.type === 'dmy2') {
                    const day = parseInt(m[1], 10);
                    const month = parseInt(m[2], 10);
                    const year = 2000 + parseInt(m[3], 10);

                    date = new Date(year, month - 1, day);
                }

                if (date && !isNaN(date.getTime())) {
                    date.setHours(0, 0, 0, 0);

                    /*
                     * Make sure JavaScript did not roll an invalid
                     * date into another date.
                     */
                    const originalParts = original.split(/[\/\-\.]/);

                    if (
                        pattern.type === 'mdy4' ||
                        pattern.type === 'mdy2'
                    ) {
                        const expectedMonth = parseInt(
                            originalParts[0],
                            10
                        );

                        const expectedDay = parseInt(
                            originalParts[1],
                            10
                        );

                        if (
                            date.getMonth() + 1 !== expectedMonth ||
                            date.getDate() !== expectedDay
                        ) {
                            continue;
                        }
                    }

                    if (
                        pattern.type === 'dmy4' ||
                        pattern.type === 'dmy2'
                    ) {
                        const expectedDay = parseInt(
                            originalParts[0],
                            10
                        );

                        const expectedMonth = parseInt(
                            originalParts[1],
                            10
                        );

                        if (
                            date.getDate() !== expectedDay ||
                            date.getMonth() + 1 !== expectedMonth
                        ) {
                            continue;
                        }
                    }

                    if (pattern.type === 'ymd') {
                        const expectedYear = parseInt(
                            originalParts[0],
                            10
                        );

                        const expectedMonth = parseInt(
                            originalParts[1],
                            10
                        );

                        const expectedDay = parseInt(
                            originalParts[2],
                            10
                        );

                        if (
                            date.getFullYear() !== expectedYear ||
                            date.getMonth() + 1 !== expectedMonth ||
                            date.getDate() !== expectedDay
                        ) {
                            continue;
                        }
                    }

                    dates.push({
                        date: date,
                        text: original
                    });
                }
            }
        });

        return dates;
    }

    /* =========================================================
       RECENT DATE WARNING
       Only detects dates from 1 to 3 calendar days ago.
       ========================================================= */

    function showRecentDateWarning(recentDates) {
        const oldWarning = document.getElementById(
            'afRecentDateWarning'
        );

        if (oldWarning) {
            oldWarning.remove();
        }

        if (!recentDates || !recentDates.length) {
            return;
        }

        const warning = document.createElement('div');

        warning.id = 'afRecentDateWarning';

        warning.style.cssText =
            'position:fixed;' +
            'top:20px;' +
            'left:50%;' +
            'transform:translateX(-50%);' +
            'width:560px;' +
            'max-width:90vw;' +
            'background:#b36b00;' +
            'color:#fff;' +
            'padding:18px 45px 18px 22px;' +
            'border:3px solid #fff;' +
            'border-radius:10px;' +
            'box-shadow:0 6px 25px rgba(0,0,0,.65);' +
            'z-index:10000001;' +
            'font-family:Arial,sans-serif;' +
            'text-align:center;' +
            'opacity:0;' +
            'transition:opacity .2s ease;';

        const closeBtn = document.createElement('button');

        closeBtn.textContent = '✕';

        closeBtn.style.cssText =
            'position:absolute;' +
            'right:8px;' +
            'top:8px;' +
            'width:32px;' +
            'height:32px;' +
            'background:#000;' +
            'color:#fff;' +
            'border:1px solid #fff;' +
            'border-radius:5px;' +
            'font-size:18px;' +
            'font-weight:bold;' +
            'cursor:pointer;';

        const title = document.createElement('div');

        title.textContent = 'Recent Comment Date Warning';

        title.style.cssText =
            'font-size:22px;' +
            'font-weight:bold;' +
            'margin-bottom:8px;';

        const message = document.createElement('div');

        const dateTexts = recentDates.map(function (x) {
            return x.text;
        });

        message.textContent =
            'Recent date(s) found in the comment box: ' +
            dateTexts.join(', ');

        message.style.cssText =
            'font-size:17px;' +
            'font-weight:bold;' +
            'line-height:1.5;';

        const subMessage = document.createElement('div');

        subMessage.textContent =
            'A date from the previous 3 days was detected.';

        subMessage.style.cssText =
            'font-size:15px;' +
            'margin-top:7px;' +
            'font-weight:normal;';

        warning.appendChild(closeBtn);
        warning.appendChild(title);
        warning.appendChild(message);
        warning.appendChild(subMessage);

        document.body.appendChild(warning);

        requestAnimationFrame(function () {
            warning.style.opacity = '1';
        });

        let removed = false;

        function removeWarning() {
            if (removed) {
                return;
            }

            removed = true;

            warning.style.opacity = '0';

            setTimeout(function () {
                if (warning && warning.parentNode) {
                    warning.remove();
                }
            }, 200);
        }

        closeBtn.onclick = function () {
            removeWarning();
        };

        /*
         * Automatically disappear after 2 seconds.
         */
        setTimeout(function () {
            removeWarning();
        }, 2000);
    }

    function checkForRecentDates() {
        const text = el.value || '';

        if (!text.trim()) {
            return;
        }

        const foundDates = parseDatesFromText(text);

        if (!foundDates.length) {
            return;
        }

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const recentDates = [];

        foundDates.forEach(function (item) {
            const diff =
                (today - item.date) /
                (1000 * 60 * 60 * 24);

            /*
             * Only dates from 1, 2, or 3 days ago.
             */
            if (diff >= 1 && diff <= 3) {
                recentDates.push(item);
            }
        });

        if (recentDates.length) {
            const unique = {};

            recentDates.forEach(function (item) {
                const key =
                    item.date.getTime() +
                    '_' +
                    item.text;

                unique[key] = item;
            });

            showRecentDateWarning(
                Object.keys(unique).map(function (key) {
                    return unique[key];
                })
            );
        }
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
       REMOVE OLD POPUP
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
                'Enter your initials first. Comments cannot be added until your initials are set.'
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
       BUILD COMMENT BUTTONS
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

            /*
             * NO duplicate/existing comment check here.
             */

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

                if (disp.trim() === '') {
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

            function addComment() {
                const d = new Date();

                /*
                 * Existing behavior:
                 * Use tomorrow's date.
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

                /*
                 * Run ONLY the date detector after adding.
                 */
                checkForRecentDates();
            }

            /*
             * IMPORTANT:
             *
             * There is intentionally NO:
             *
             * - duplicate comment detection
             * - existing comment popup
             * - CONTINUE / DECLINE popup
             * - duplicate alert
             *
             * The selected comment is added immediately.
             */

            addComment();
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

    /* =========================================================
       INITIAL DATE CHECK
       ========================================================= */

    checkForRecentDates();

})();
