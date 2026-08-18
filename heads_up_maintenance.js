(function () {
    /*
     * ==========================================
     * HEADS-UP MAINTENANCE NOTICE
     * ==========================================
     *
     * Change the date and message below whenever
     * you need to announce upcoming maintenance.
     */

    const MAINTENANCE_DATE = '08/25/2026';

    const MAINTENANCE_MESSAGE =
        'Scheduled maintenance will take place on ' +
        MAINTENANCE_DATE +
        '. Please plan accordingly.';

    /*
     * ==========================================
     * SETTINGS
     * ==========================================
     */

    const FOUR_HOURS = 4 * 60 * 60 * 1000;

    const AUTO_CLOSE_TIME = 10000;

    const STORAGE_KEY =
        'afHeadsUpMaintenanceLastShown';

    /*
     * ==========================================
     * 4-HOUR CHECK
     * ==========================================
     */

    const now = Date.now();

    const lastShown = parseInt(
        localStorage.getItem(STORAGE_KEY) || '0',
        10
    );

    if (
        lastShown &&
        now - lastShown < FOUR_HOURS
    ) {
        return;
    }

    /*
     * Save the time immediately.
     */

    localStorage.setItem(
        STORAGE_KEY,
        String(now)
    );

    /*
     * ==========================================
     * REMOVE EXISTING NOTICE
     * ==========================================
     */

    const old =
        document.getElementById(
            'afHeadsUpMaintenance'
        );

    if (old) {
        old.remove();
    }

    /*
     * ==========================================
     * FULL-SCREEN OVERLAY
     * ==========================================
     */

    const overlay =
        document.createElement('div');

    overlay.id =
        'afHeadsUpMaintenance';

    overlay.style.cssText =
        'position:fixed;' +
        'top:0;' +
        'left:0;' +
        'width:100vw;' +
        'height:100vh;' +
        'background:rgba(0,0,0,.65);' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:center;' +
        'z-index:2147483647;' +
        'font-family:Arial,sans-serif;' +
        'box-sizing:border-box;' +
        'padding:25px;' +
        'opacity:0;' +
        'transition:opacity .25s ease;';

    /*
     * ==========================================
     * GREEN CARD
     * ==========================================
     */

    const card =
        document.createElement('div');

    card.style.cssText =
        'position:relative;' +
        'width:100%;' +
        'height:auto;' +
        'max-width:900px;' +
        'background:#198754;' +
        'color:#fff;' +
        'border:4px solid #fff;' +
        'border-radius:18px;' +
        'box-shadow:0 10px 50px rgba(0,0,0,.75);' +
        'display:flex;' +
        'flex-direction:column;' +
        'align-items:center;' +
        'justify-content:center;' +
        'text-align:center;' +
        'box-sizing:border-box;' +
        'padding:60px 80px;' +
        'transform:scale(.95);' +
        'transition:transform .25s ease;';

    /*
     * ==========================================
     * CLOSE BUTTON
     * ==========================================
     */

    const closeBtn =
        document.createElement('button');

    closeBtn.textContent = '✕';

    closeBtn.setAttribute(
        'aria-label',
        'Close maintenance notice'
    );

    closeBtn.style.cssText =
        'position:absolute;' +
        'right:20px;' +
        'top:20px;' +
        'width:50px;' +
        'height:50px;' +
        'background:#000;' +
        'color:#fff;' +
        'border:2px solid #fff;' +
        'border-radius:8px;' +
        'font-size:28px;' +
        'font-weight:bold;' +
        'cursor:pointer;' +
        'line-height:40px;' +
        'z-index:10;';

    closeBtn.onmouseover = function () {
        this.style.background = '#333';
    };

    closeBtn.onmouseout = function () {
        this.style.background = '#000';
    };

    /*
     * ==========================================
     * TITLE
     * ==========================================
     */

    const title =
        document.createElement('div');

    title.textContent =
        '⚠ MAINTENANCE HEADS-UP ⚠';

    title.style.cssText =
        'font-size:42px;' +
        'font-weight:bold;' +
        'margin-bottom:30px;' +
        'line-height:1.2;' +
        'text-shadow:0 2px 4px rgba(0,0,0,.35);';

    /*
     * ==========================================
     * DATE LABEL
     * ==========================================
     */

    const dateLabel =
        document.createElement('div');

    dateLabel.textContent =
        'SCHEDULED MAINTENANCE';

    dateLabel.style.cssText =
        'font-size:20px;' +
        'font-weight:bold;' +
        'margin-bottom:12px;' +
        'letter-spacing:2px;';

    /*
     * ==========================================
     * DATE
     * ==========================================
     */

    const date =
        document.createElement('div');

    date.textContent =
        MAINTENANCE_DATE;

    date.style.cssText =
        'font-size:36px;' +
        'font-weight:bold;' +
        'background:#fff;' +
        'color:#198754;' +
        'padding:15px 30px;' +
        'border-radius:10px;' +
        'border:2px solid #fff;' +
        'margin-bottom:30px;' +
        'display:inline-block;' +
        'box-shadow:0 5px 20px rgba(0,0,0,.35);';

    /*
     * ==========================================
     * MESSAGE
     * ==========================================
     */

    const message =
        document.createElement('div');

    message.textContent =
        MAINTENANCE_MESSAGE;

    message.style.cssText =
        'font-size:24px;' +
        'font-weight:bold;' +
        'line-height:1.7;' +
        'max-width:800px;';

    /*
     * ==========================================
     * SMALL MESSAGE
     * ==========================================
     */

    const smallMessage =
        document.createElement('div');

    smallMessage.textContent =
        'Thank you for your patience and understanding.';

    smallMessage.style.cssText =
        'font-size:17px;' +
        'margin-top:25px;' +
        'font-weight:normal;' +
        'opacity:.95;';

    /*
     * ==========================================
     * BUILD CARD
     * ==========================================
     */

    card.appendChild(closeBtn);
    card.appendChild(title);
    card.appendChild(dateLabel);
    card.appendChild(date);
    card.appendChild(message);
    card.appendChild(smallMessage);

    overlay.appendChild(card);

    document.body.appendChild(overlay);

    /*
     * ==========================================
     * SHOW ANIMATION
     * ==========================================
     */

    requestAnimationFrame(function () {
        overlay.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });

    /*
     * ==========================================
     * REMOVE FUNCTION
     * ==========================================
     */

    let removed = false;

    function removePopup() {
        if (removed) {
            return;
        }

        removed = true;

        overlay.style.opacity = '0';
        card.style.transform = 'scale(.95)';

        setTimeout(function () {
            if (
                overlay &&
                overlay.parentNode
            ) {
                overlay.remove();
            }
        }, 250);
    }

    /*
     * ==========================================
     * CLOSE BUTTON
     * ==========================================
     */

    closeBtn.onclick = function () {
        removePopup();
    };

    /*
     * ==========================================
     * AUTOMATICALLY CLOSE AFTER 10 SECONDS
     * ==========================================
     */

    setTimeout(function () {
        removePopup();
    }, AUTO_CLOSE_TIME);

})();
