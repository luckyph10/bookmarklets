(function () {
    const old = document.getElementById('afMaintenanceWarning');

    if (old) {
        old.remove();
    }

    const warning = document.createElement('div');

    warning.id = 'afMaintenanceWarning';

    warning.style.cssText =
        'position:fixed;' +
        'top:50%;' +
        'left:50%;' +
        'transform:translate(-50%,-50%);' +
        'width:560px;' +
        'max-width:90vw;' +
        'background:#8b0000;' +
        'color:#fff;' +
        'padding:30px 45px 30px 30px;' +
        'border:3px solid #fff;' +
        'border-radius:12px;' +
        'box-shadow:0 6px 30px rgba(0,0,0,.75);' +
        'z-index:2147483647;' +
        'font-family:Arial,sans-serif;' +
        'text-align:center;' +
        'box-sizing:border-box;';

    const closeBtn = document.createElement('button');

    closeBtn.textContent = '✕';

    closeBtn.style.cssText =
        'position:absolute;' +
        'right:10px;' +
        'top:10px;' +
        'width:34px;' +
        'height:34px;' +
        'background:#000;' +
        'color:#fff;' +
        'border:1px solid #fff;' +
        'border-radius:6px;' +
        'font-size:19px;' +
        'font-weight:bold;' +
        'cursor:pointer;' +
        'z-index:2;';

    closeBtn.onclick = function () {
        warning.remove();
    };

    const title = document.createElement('div');

    title.textContent = 'MAINTENANCE';

    title.style.cssText =
        'font-size:28px;' +
        'font-weight:bold;' +
        'margin-bottom:15px;';

    const image = document.createElement('img');

    image.src =
        'https://tse3.mm.bing.net/th/id/OIP.HYChRTrETTB3gMaj_8xXUQHaHa?r=0&pid=ImgDet&w=189&h=189&c=7&o=7&rm=3';

    image.alt = 'Maintenance';

    image.style.cssText =
        'display:block;' +
        'width:220px;' +
        'height:220px;' +
        'max-width:100%;' +
        'object-fit:contain;' +
        'margin:0 auto 20px;' +
        'border-radius:10px;';

    const message = document.createElement('div');

    message.textContent =
        'The bookmarklet is currently under maintenance. Please try again later.';

    message.style.cssText =
        'font-size:18px;' +
        'font-weight:bold;' +
        'line-height:1.5;';

    warning.appendChild(closeBtn);
    warning.appendChild(title);
    warning.appendChild(image);
    warning.appendChild(message);

    document.body.appendChild(warning);
})();
