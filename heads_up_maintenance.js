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
     * Show the notice once every 4 hours.
     */
    const FOUR_HOURS = 4 * 60 * 60 * 1000;

    const STORAGE_KEY = 'afHeadsUpMaintenanceLastShown';

    const now = Date.now();

    const lastShown = parseInt(
        localStorage.getItem(STORAGE_KEY) || '0',
        10
    );

    /*
     * If the popup was shown within the last
     * 4 hours, do not show it again.
     */
    if (
        lastShown &&
        now - lastShown < FOUR_HOURS
    ) {
        return;
    }

    /*
     * Save the time immediately so multiple
     * clicks cannot create multiple popups.
     */
    localStorage.setItem(
        STORAGE_KEY,
        String(now)
    );

    /*
     * Remove an existing popup if one somehow
     * already exists.
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
     * OVERLAY
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
        'background:rgba(0,0,0,.55);' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:center;' +
        'z-index:2147483646;' +
        'font-family:Arial,sans-serif;' +
        'opacity:0;' +
        'transition:opacity .2s ease;' +
        'box-sizing:border-box;';

    /*
     * ==========================================
     * POPUP
     * ==========================================
     */

    const popup =
        document.createElement('div');

    popup.style.cssText =
        'position:relative;' +
        'width:560px;' +
        'max-width:90vw;' +
        'background:#8b0000;' +
        'color:#fff;' +
        'padding:30px 45px 30px 30px;' +
        'border:3px solid #fff;' +
        'border-radius:12px;' +
        'box-shadow:0 8px 35px rgba(0,0,0,.8);' +
        'text-align:center;' +
        'box-sizing:border-box;' +
        'transform:scale(.95);' +
        'transition:transform .2s ease;';

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
        'right:10px;' +
        'top:10px;' +
        'width:36px;' +
        'height:36px;' +
        'background:#000;' +
        'color:#fff;' +
        'border:1px solid #fff;' +
        'border-radius:6px;' +
        'font-size:20px;' +
        'font-weight:bold;' +
        'cursor:pointer;' +
        'line-height:30px;';

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
        'font-size:26px;' +
        'font-weight:bold;' +
        'margin-bottom:18px;' +
        'padding-right:10px;';

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
        'font-size:24px;' +
        'font-weight:bold;' +
        'background:#000;' +
        'padding:10px 15px;' +
        'border-radius:7px;' +
        'margin-bottom:18px;' +
        'display:inline-block;';

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
        'font-size:18px;' +
        'font-weight:bold;' +
        'line-height:1.6;';

    /*
     * ==========================================
     * BUILD POPUP
     * ==========================================
     */

    popup.appendChild(closeBtn);
    popup.appendChild(title);
    popup.appendChild(date);
    popup.appendChild(message);

    overlay.appendChild(popup);

    document.body.appendChild(overlay);

    /*
     * ==========================================
     * SHOW ANIMATION
     * ==========================================
     */

    requestAnimationFrame(function () {
        overlay.style.opacity = '1';
        popup.style.transform = 'scale(1)';
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
        popup.style.transform = 'scale(.95)';

        setTimeout(function () {
            if (
                overlay &&
                overlay.parentNode
            ) {
                overlay.remove();
            }
        }, 200);
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
     * AUTOMATICALLY CLOSE AFTER 3 SECONDS
     * ==========================================
     */

    setTimeout(function () {
        removePopup();
    }, 3000);

})();
