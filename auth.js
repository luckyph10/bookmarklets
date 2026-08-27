// ============================================================
// auth.js
// GitHub-only user access control
// ============================================================

window.BookmarkAuth = (() => {

    const USERS_URL =
        'https://luckyph10.github.io/bookmarklets/users.json';


    // --------------------------------------------------------
    // Create username popup
    // --------------------------------------------------------

    function askForUsername() {

        return new Promise((resolve) => {

            // Prevent duplicate popup
            const oldPopup =
                document.getElementById(
                    'bookmarklet-auth-overlay'
                );

            if (oldPopup) {
                oldPopup.remove();
            }


            const overlay =
                document.createElement('div');

            overlay.id =
                'bookmarklet-auth-overlay';


            overlay.innerHTML = `

                <div class="bookmarklet-auth-box">

                    <h2>
                        Automation Access
                    </h2>

                    <p>
                        Enter your username to continue.
                    </p>

                    <input
                        id="bookmarklet-auth-username"
                        type="text"
                        placeholder="Username"
                        autocomplete="off"
                    >

                    <button
                        id="bookmarklet-auth-continue"
                    >
                        Continue
                    </button>

                    <button
                        id="bookmarklet-auth-cancel"
                    >
                        Cancel
                    </button>

                    <div
                        id="bookmarklet-auth-error"
                    ></div>

                </div>
            `;


            const style =
                document.createElement('style');

            style.id =
                'bookmarklet-auth-style';


            style.textContent = `

                #bookmarklet-auth-overlay {

                    position: fixed;
                    inset: 0;

                    z-index: 2147483647;

                    background:
                        rgba(0, 0, 0, 0.65);

                    display: flex;

                    align-items: center;
                    justify-content: center;

                    font-family:
                        Arial,
                        sans-serif;
                }


                .bookmarklet-auth-box {

                    width: 320px;

                    background: #ffffff;

                    padding: 25px;

                    border-radius: 12px;

                    box-shadow:
                        0 10px 40px
                        rgba(0,0,0,.4);

                    box-sizing: border-box;
                }


                .bookmarklet-auth-box h2 {

                    margin:
                        0 0 10px;

                    color: #222;

                    font-size: 21px;
                }


                .bookmarklet-auth-box p {

                    margin:
                        0 0 15px;

                    color: #666;

                    font-size: 14px;
                }


                #bookmarklet-auth-username {

                    width: 100%;

                    box-sizing: border-box;

                    padding: 11px;

                    margin-bottom: 10px;

                    border:
                        1px solid #ccc;

                    border-radius: 6px;

                    font-size: 14px;

                    outline: none;
                }


                #bookmarklet-auth-username:focus {

                    border-color: #555;
                }


                #bookmarklet-auth-continue {

                    width: 100%;

                    padding: 11px;

                    border: none;

                    border-radius: 6px;

                    background: #222;

                    color: white;

                    cursor: pointer;

                    font-size: 14px;
                }


                #bookmarklet-auth-continue:disabled {

                    opacity: .6;

                    cursor: wait;
                }


                #bookmarklet-auth-cancel {

                    width: 100%;

                    padding: 10px;

                    border: none;

                    background: transparent;

                    color: #777;

                    cursor: pointer;

                    font-size: 14px;
                }


                #bookmarklet-auth-error {

                    margin-top: 10px;

                    color: #c00;

                    font-size: 13px;

                    min-height: 16px;
                }

            `;


            document.head.appendChild(style);

            document.body.appendChild(overlay);


            const input =
                overlay.querySelector(
                    '#bookmarklet-auth-username'
                );

            const continueButton =
                overlay.querySelector(
                    '#bookmarklet-auth-continue'
                );

            const cancelButton =
                overlay.querySelector(
                    '#bookmarklet-auth-cancel'
                );

            const error =
                overlay.querySelector(
                    '#bookmarklet-auth-error'
                );


            input.focus();


            // ------------------------------------------------
            // Cleanup
            // ------------------------------------------------

            function cleanup() {

                overlay.remove();
                style.remove();
            }


            // ------------------------------------------------
            // Cancel
            // ------------------------------------------------

            cancelButton.onclick = () => {

                cleanup();

                resolve(null);
            };


            // ------------------------------------------------
            // Continue
            // ------------------------------------------------

            continueButton.onclick = async () => {

                const username =
                    input.value.trim();


                if (!username) {

                    error.textContent =
                        'Please enter your username.';

                    input.focus();

                    return;
                }


                continueButton.disabled =
                    true;

                continueButton.textContent =
                    'Checking...';

                error.textContent = '';


                try {

                    const result =
                        await checkUser(username);


                    cleanup();


                    if (!result.exists) {

                        alert(
                            'Access denied.\n\n' +
                            'Username is not registered.'
                        );

                        resolve(null);

                        return;
                    }


                    if (!result.enabled) {

                        alert(
                            'Access denied.\n\n' +
                            'Your account is disabled.'
                        );

                        resolve(null);

                        return;
                    }


                    // User is authorized

                    resolve({

                        name: result.user.name,

                        enabled: true

                    });


                } catch (err) {

                    console.error(
                        'BookmarkAuth:',
                        err
                    );


                    continueButton.disabled =
                        false;

                    continueButton.textContent =
                        'Continue';


                    error.textContent =
                        'Unable to check access. Please try again.';
                }

            };


            // ------------------------------------------------
            // Enter key
            // ------------------------------------------------

            input.addEventListener(
                'keydown',
                (event) => {

                    if (
                        event.key === 'Enter'
                    ) {

                        continueButton.click();
                    }

                }
            );

        });

    }


    // --------------------------------------------------------
    // Read users.json
    // --------------------------------------------------------

    async function loadUsers() {

        const response =
            await fetch(
                USERS_URL +
                '?t=' +
                Date.now(),
                {
                    cache: 'no-store'
                }
            );


        if (!response.ok) {

            throw new Error(
                'Unable to load users.json'
            );
        }


        const data =
            await response.json();


        if (
            !data ||
            !Array.isArray(data.users)
        ) {

            throw new Error(
                'Invalid users.json format'
            );
        }


        return data.users;
    }


    // --------------------------------------------------------
    // Find user
    // --------------------------------------------------------

    async function checkUser(username) {

        const users =
            await loadUsers();


        const normalized =
            username
                .trim()
                .toLowerCase();


        const user =
            users.find(
                (item) => {

                    if (
                        !item ||
                        typeof item.name !== 'string'
                    ) {
                        return false;
                    }

                    return (
                        item.name
                            .trim()
                            .toLowerCase()
                        === normalized
                    );
                }
            );


        if (!user) {

            return {

                exists: false,

                enabled: false,

                user: null

            };
        }


        return {

            exists: true,

            enabled:
                user.enabled === true,

            user: user

        };
    }


    // --------------------------------------------------------
    // Public API
    // --------------------------------------------------------

    return {

        requireUser: askForUsername,

        checkUser: checkUser

    };

})();
