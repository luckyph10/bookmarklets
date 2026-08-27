window.BookmarkAuth = (() => {

    const API_URL =
        'https://YOUR-BACKEND-URL.workers.dev';

    function createPopup() {

        return new Promise((resolve) => {

            const overlay = document.createElement('div');

            overlay.id = 'bookmark-auth-overlay';

            overlay.innerHTML = `
                <div class="bookmark-auth-box">

                    <h2>Automation Access</h2>

                    <p>
                        Enter your username to continue.
                    </p>

                    <input
                        id="bookmark-auth-username"
                        type="text"
                        placeholder="Username"
                        autocomplete="off"
                    >

                    <button id="bookmark-auth-continue">
                        Continue
                    </button>

                    <button id="bookmark-auth-cancel">
                        Cancel
                    </button>

                    <div id="bookmark-auth-error"></div>

                </div>
            `;

            const style =
                document.createElement('style');

            style.textContent = `
                #bookmark-auth-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 2147483647;
                    background: rgba(0,0,0,.65);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: Arial,sans-serif;
                }

                .bookmark-auth-box {
                    width: 320px;
                    background: #fff;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,.4);
                }

                .bookmark-auth-box h2 {
                    margin: 0 0 10px;
                    color: #222;
                }

                .bookmark-auth-box p {
                    color: #666;
                    font-size: 14px;
                }

                #bookmark-auth-username {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 11px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 14px;
                }

                #bookmark-auth-continue {
                    width: 100%;
                    padding: 11px;
                    border: 0;
                    border-radius: 6px;
                    background: #222;
                    color: white;
                    cursor: pointer;
                }

                #bookmark-auth-cancel {
                    width: 100%;
                    padding: 10px;
                    border: 0;
                    background: transparent;
                    color: #777;
                    cursor: pointer;
                }

                #bookmark-auth-error {
                    margin-top: 10px;
                    color: #c00;
                    font-size: 13px;
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(overlay);

            const input =
                overlay.querySelector(
                    '#bookmark-auth-username'
                );

            const continueButton =
                overlay.querySelector(
                    '#bookmark-auth-continue'
                );

            const cancelButton =
                overlay.querySelector(
                    '#bookmark-auth-cancel'
                );

            const error =
                overlay.querySelector(
                    '#bookmark-auth-error'
                );

            input.focus();

            cancelButton.onclick = () => {

                overlay.remove();
                style.remove();

                resolve(null);
            };

            continueButton.onclick = async () => {

                const username =
                    input.value.trim();

                if (!username) {

                    error.textContent =
                        'Please enter your username.';

                    return;
                }

                continueButton.disabled = true;
                continueButton.textContent =
                    'Checking...';

                try {

                    const response = await fetch(
                        API_URL + '/register',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                name: username
                            })
                        }
                    );

                    const result =
                        await response.json();

                    if (!result.success) {

                        error.textContent =
                            result.error ||
                            'Unable to verify account.';

                        continueButton.disabled =
                            false;

                        continueButton.textContent =
                            'Continue';

                        return;
                    }

                    overlay.remove();
                    style.remove();

                    resolve({
                        name: result.name,
                        enabled: result.enabled
                    });

                } catch (err) {

                    console.error(err);

                    error.textContent =
                        'Unable to contact server.';

                    continueButton.disabled =
                        false;

                    continueButton.textContent =
                        'Continue';
                }
            };

            input.addEventListener(
                'keydown',
                event => {

                    if (event.key === 'Enter') {
                        continueButton.click();
                    }

                }
            );
        });
    }


    async function requireUser() {

        const result =
            await createPopup();

        if (!result) {
            return null;
        }

        if (!result.enabled) {

            alert(
                'Access denied.\n\n' +
                'Your account is disabled.'
            );

            return null;
        }

        return result;
    }


    return {
        requireUser
    };

})();
