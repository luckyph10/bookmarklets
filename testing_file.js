(function () {
    const s = document.createElement('script');
    s.src = 'https://luckyph10.github.io/bookmarklets/heads_up_maintenance.js';
    document.head.appendChild(s);
})();


(function () {
    const el = document.querySelector(
        '#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > textarea'
    );

    if (!el) {
        alert('Comment textbox not found');
        return;
    }

    function businessDaysBetween(startDate, endDate) {
        let count = 0;
        let cur = new Date(startDate);

        cur.setHours(0, 0, 0, 0);

        while (cur < endDate) {
            cur.setDate(cur.getDate() + 1);

            const day = cur.getDay();

            if (day !== 0 && day !== 6) {
                count++;
            }
        }

        return count;
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

        const days = businessDaysBetween(newest, today);

        return true;
    }

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

                    dates.push({
                        date: date,
                        text: original
                    });
                }
            }
        });

        return dates;
    }

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

        setTimeout(function () {
            removeWarning();
        }, 3000);
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

    function showExistingCommentWarning(
        onContinue,
        onDecline
    ) {
        const oldWarning = document.getElementById(
            'afExistingCommentWarning'
        );

        if (oldWarning) {
            oldWarning.remove();
        }

        const warning = document.createElement('div');

        warning.id = 'afExistingCommentWarning';

        warning.style.cssText =
            'position:fixed;' +
            'top:20px;' +
            'left:50%;' +
            'transform:translateX(-50%);' +
            'width:520px;' +
            'max-width:90vw;' +
            'background:#8b0000;' +
            'color:#fff;' +
            'padding:25px;' +
            'border:3px solid #fff;' +
            'border-radius:10px;' +
            'box-shadow:0 6px 25px rgba(0,0,0,.7);' +
            'z-index:10000000;' +
            'font-family:Arial,sans-serif;' +
            'text-align:center;';

        const title = document.createElement('div');

        title.textContent = 'Warning';

        title.style.cssText =
            'font-size:26px;' +
            'font-weight:bold;' +
            'margin-bottom:15px;';

        const message = document.createElement('div');

        message.textContent =
            'This comment already exists in the comment box.';

        message.style.cssText =
            'font-size:19px;' +
            'font-weight:bold;' +
            'line-height:1.5;' +
            'margin-bottom:22px;';

        const buttonWrap = document.createElement('div');

        buttonWrap.style.cssText =
            'display:flex;' +
            'justify-content:center;' +
            'gap:15px;';

        const continueBtn = document.createElement('button');

        continueBtn.textContent = 'CONTINUE';

        continueBtn.style.cssText =
            'padding:11px 28px;' +
            'background:#1976d2;' +
            'color:#fff;' +
            'border:2px solid #fff;' +
            'border-radius:6px;' +
            'cursor:pointer;' +
            'font-size:17px;' +
            'font-weight:bold;';

        continueBtn.onclick = function () {
            warning.remove();

            if (typeof onContinue === 'function') {
                onContinue();
            }
        };

        const declineBtn = document.createElement('button');

        declineBtn.textContent = 'DECLINE';

        declineBtn.style.cssText =
            'padding:11px 28px;' +
            'background:#333;' +
            'color:#fff;' +
            'border:2px solid #fff;' +
            'border-radius:6px;' +
            'cursor:pointer;' +
            'font-size:17px;' +
            'font-weight:bold;';

        declineBtn.onclick = function () {
            warning.remove();

            const commentPopup =
                document.getElementById(
                    'afCommentPopup'
                );

            if (commentPopup) {
                commentPopup.remove();
            }

            if (typeof onDecline === 'function') {
                onDecline();
            }
        };

        buttonWrap.appendChild(continueBtn);
        buttonWrap.appendChild(declineBtn);

        warning.appendChild(title);
        warning.appendChild(message);
        warning.appendChild(buttonWrap);

        document.body.appendChild(warning);
    }

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

    const old = document.getElementById(
        'afCommentPopup'
    );

    if (old) {
        old.remove();
    }

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
            alert(
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

        alert(
            'Initials saved: ' + val
        );
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
            if (!checkRecentComment(el)) {
                return;
            }

            const initials =
                (
                    localStorage.getItem(
                        'afCommentInitials'
                    ) || ''
                )
                    .trim()
                    .toUpperCase();

            if (!initials) {
                alert(
                    'Your initials are not set yet. Please enter your initials and click Save before adding a comment.'
                );

                initialsInput.focus();

                return;
            }

            let finalComment = item.text;

            if (item.needsDisp) {
                const disp = prompt(
                    'Enter Dispute Number (example: DISP-6731470)',
                    ''
                );

                if (disp === null) {
                    return;
                }

                if (disp.trim() === '') {
                    alert(
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

            function addComment() {
                const d = new Date();

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

                /*
                 * UPDATED COMMENT FORMAT:
                 *
                 * Comment - MM/DD/YY - INITIALS
                 *
                 * Example:
                 * Reviewed, no action required - 08/18/26 - ALD
                 */
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

                checkForRecentDates();
            }

            if (
                (el.value || '').includes(
                    finalComment
                )
            ) {
                showExistingCommentWarning(
                    function () {
                        addComment();
                    },
                    function () {
                        return;
                    }
                );

                return;
            }

            addComment();
        };

        popup.appendChild(btn);
    });

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

    checkForRecentDates();
})();
