(function () {
    'use strict';

    // =========================================================
    // BOOKMARKLET COMPATIBILITY
    // =========================================================

    const GMStoragePrefix = '__vob_picker__';

    function GM_getValue(key, defaultValue) {
        try {
            const raw = localStorage.getItem(
                GMStoragePrefix + key
            );

            if (raw === null) {
                return defaultValue;
            }

            return JSON.parse(raw);
        } catch (e) {
            return defaultValue;
        }
    }

    function GM_setValue(key, value) {
        try {
            localStorage.setItem(
                GMStoragePrefix + key,
                JSON.stringify(value)
            );
        } catch (e) {}
    }

    function GM_setClipboard(text) {
        try {
            if (
                navigator.clipboard &&
                typeof navigator.clipboard.writeText === 'function'
            ) {
                navigator.clipboard
                    .writeText(String(text))
                    .catch(() => {});
            }
        } catch (e) {}
    }

    // =========================================================
    // SETTINGS
    // =========================================================

    const STORAGE_KEY_NAMES = 'vob_allowed_names_v4';
    const STORAGE_KEY_COUNT = 'vob_pick_count_v4';

    const DEFAULT_NAMES = [
        'Pamil, Angelica',
        'Oriasel, Lordan Cyrus',
        'Isidro, Khristian Kharl',
        'Lizardo, Chique',
        'Salamonding, Jayar',
        'Tablon, Joshua Riam',
        'Nicol, Steeve',
        'Concpecion, Kurt Jostine'
    ];

    let allowedNames = loadNames();
    let pickCount = loadPickCount();

    let tableData = [];
    let lastSelected = [];

    // =========================================================
    // PREVENT DUPLICATE PANEL
    // =========================================================

    const existingPanel =
        document.getElementById('vobPicker');

    if (existingPanel) {
        existingPanel.remove();
    }

    const existingStyle =
        document.getElementById('vobPickerStyle');

    if (existingStyle) {
        existingStyle.remove();
    }

    // =========================================================
    // STORAGE
    // =========================================================

    function loadNames() {
        try {
            const saved = GM_getValue(
                STORAGE_KEY_NAMES,
                null
            );

            if (
                Array.isArray(saved) &&
                saved.length > 0
            ) {
                return saved;
            }
        } catch (e) {}

        return [...DEFAULT_NAMES];
    }

    function saveNames() {
        try {
            GM_setValue(
                STORAGE_KEY_NAMES,
                allowedNames
            );
        } catch (e) {}
    }

    function loadPickCount() {
        try {
            const saved = Number(
                GM_getValue(
                    STORAGE_KEY_COUNT,
                    3
                )
            );

            if (
                Number.isInteger(saved) &&
                saved >= 1
            ) {
                return saved;
            }
        } catch (e) {}

        return 3;
    }

    function savePickCount() {
        try {
            GM_setValue(
                STORAGE_KEY_COUNT,
                pickCount
            );
        } catch (e) {}
    }

    // =========================================================
    // PANEL
    // =========================================================

    const panel =
        document.createElement('div');

    panel.id = 'vobPicker';

    panel.innerHTML = `
        <div id="vobHeader">
            <span>🎲 VOB RANDOM PICKER</span>

            <div style="float:right;">
                <button id="vobMin">−</button>
                <button id="vobClose">×</button>
            </div>
        </div>

        <div id="vobBody">

            <!-- COUNT -->
            <div class="section">

                <div class="title">
                    🔢 HOW MANY DISPUTES PER USER?
                </div>

                <div class="countRow">

                    <input
                        id="pickCount"
                        type="number"
                        min="1"
                        value="${pickCount}"
                    />

                    <button id="saveCount">
                        SAVE
                    </button>

                </div>

                <div class="hint">
                    This number is PER USER.
                    Example: 3 means 3 random disputes
                    for every allowed name.
                    If 8 names are available, the total
                    will be 24 disputes.
                </div>

            </div>

            <!-- NAMES -->
            <div class="section">

                <div class="title">
                    👤 ALLOWED NAMES
                </div>

                <div class="hint">
                    The picker will select the requested
                    number of disputes for EACH name whose
                    name in Column U is in this list.
                </div>

                <div id="nameList"></div>

                <div class="addRow">

                    <input
                        id="newName"
                        type="text"
                        placeholder="Type name..."
                    />

                    <button id="addName">
                        + ADD
                    </button>

                </div>

                <div class="nameActions">

                    <button id="saveNames">
                        💾 SAVE NAMES
                    </button>

                    <button id="resetNames">
                        ↺ RESET
                    </button>

                </div>

            </div>

            <hr>

            <!-- DATA -->
            <div class="section">

                <div id="status">
                    Copy your Excel data from
                    <b>A through U</b>.
                </div>

                <button
                    id="capture"
                    class="button blue"
                >
                    📋 CAPTURE CLIPBOARD
                </button>

                <div class="hint">
                    Or paste the copied Excel data below.
                </div>

                <textarea
                    id="inputData"
                    placeholder="Paste your Excel A:U data here..."
                ></textarea>

                <button
                    id="usePaste"
                    class="button gray"
                >
                    📥 USE PASTED DATA
                </button>

                <div id="loaded"></div>

            </div>

            <hr>

            <!-- RESULTS -->
            <div id="results"></div>

            <!-- ACTIONS -->
            <div class="actions">

                <button
                    id="pick"
                    class="button green"
                    disabled
                >
                    🎲 PICK
                </button>

                <button
                    id="again"
                    class="button orange"
                    disabled
                >
                    🔄 TRY AGAIN
                </button>

                <button
                    id="copy"
                    class="button gray"
                    disabled
                >
                    📋 COPY AGAIN
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(panel);

    // =========================================================
    // CSS
    // =========================================================

    const style =
        document.createElement('style');

    style.id = 'vobPickerStyle';

    style.textContent = `

        #vobPicker {
            position: fixed;
            top: 60px;
            right: 20px;

            width: 900px;
            max-width: 95vw;

            max-height: 92vh;

            z-index: 2147483647;

            background: rgba(0,0,0,0.82);

            color: white;

            border:
                1px solid
                rgba(255,255,255,.25);

            border-radius: 14px;

            box-shadow:
                0 15px 60px
                rgba(0,0,0,.65);

            font-family:
                Arial,
                Helvetica,
                sans-serif;
        }

        #vobHeader {

            background:
                rgba(0,0,0,.55);

            padding: 14px 16px;

            font-size: 17px;

            font-weight: bold;

            border-radius:
                14px 14px 0 0;

            cursor: move;

            border-bottom:
                1px solid
                rgba(255,255,255,.15);
        }

        #vobHeader button {

            width: 28px;
            height: 28px;

            border: 0;

            border-radius: 6px;

            background:
                rgba(255,255,255,.85);

            color: black;

            font-size: 18px;

            font-weight: bold;

            cursor: pointer;
        }

        #vobBody {

            padding: 16px;

            max-height: 84vh;

            overflow-y: auto;
        }

        .section {
            margin-bottom: 14px;
        }

        .title {

            font-size: 15px;

            font-weight: bold;

            margin-bottom: 8px;
        }

        .hint {

            font-size: 12px;

            color:
                rgba(255,255,255,.72);

            margin:
                6px 0 10px;

            line-height: 1.45;
        }

        .countRow {

            display: flex;

            gap: 8px;
        }

        #pickCount {

            width: 100px;

            padding: 9px;

            border-radius: 7px;

            border:
                1px solid
                rgba(255,255,255,.4);

            background:
                rgba(255,255,255,.12);

            color: white;

            font-size: 15px;

            font-weight: bold;
        }

        #pickCount:focus {
            outline: 2px solid white;
        }

        #nameList {

            border:
                1px solid
                rgba(255,255,255,.2);

            background:
                rgba(0,0,0,.3);

            border-radius: 8px;

            padding: 8px;

            max-height: 220px;

            overflow-y: auto;
        }

        .nameItem {

            display: flex;

            align-items: center;

            gap: 8px;

            padding: 7px;

            margin-bottom: 5px;

            border-radius: 6px;

            background:
                rgba(255,255,255,.1);
        }

        .nameText {

            flex: 1;

            font-weight: 600;
        }

        .removeName {

            border: 0;

            border-radius: 5px;

            padding: 5px 9px;

            background: white;

            color: black;

            cursor: pointer;

            font-weight: bold;
        }

        .addRow {

            display: flex;

            gap: 7px;

            margin-top: 8px;
        }

        #newName {

            flex: 1;

            padding: 9px;

            border-radius: 6px;

            border:
                1px solid
                rgba(255,255,255,.3);

            background:
                rgba(255,255,255,.1);

            color: white;
        }

        #newName::placeholder {

            color:
                rgba(255,255,255,.6);
        }

        #newName:focus {

            outline: 2px solid white;
        }

        .nameActions {

            margin-top: 8px;
        }

        .nameActions button,
        #saveCount {

            border: 0;

            border-radius: 6px;

            padding: 8px 12px;

            background: white;

            color: black;

            cursor: pointer;

            font-weight: bold;

            margin-right: 5px;
        }

        #status {

            padding: 10px;

            border-radius: 8px;

            background:
                rgba(255,255,255,.09);

            line-height: 1.5;

            margin-bottom: 10px;
        }

        #inputData {

            width: 100%;

            height: 100px;

            box-sizing: border-box;

            resize: vertical;

            padding: 8px;

            border-radius: 7px;

            border:
                1px solid
                rgba(255,255,255,.3);

            background:
                rgba(255,255,255,.08);

            color: white;

            font-family: monospace;

            font-size: 12px;
        }

        #inputData::placeholder {

            color:
                rgba(255,255,255,.5);
        }

        .button {

            border: 0;

            border-radius: 7px;

            padding: 10px 15px;

            margin: 5px 4px 5px 0;

            cursor: pointer;

            background: white;

            color: black;

            font-weight: bold;

            box-shadow:
                0 2px 5px
                rgba(0,0,0,.25);
        }

        .button:disabled {

            opacity: .35;

            cursor: not-allowed;
        }

        .blue {
            background: white;
            color: black;
        }

        .green {
            background: white;
            color: black;
        }

        .orange {
            background: white;
            color: black;
        }

        .gray {
            background: white;
            color: black;
        }

        #loaded {

            margin-top: 8px;

            font-weight: bold;
        }

        .success {

            color: #7CFF9A;

            font-weight: bold;
        }

        .error {

            color: #FF7676;

            font-weight: bold;
        }

        #results {

            overflow: auto;

            max-height: 430px;

            margin-top: 10px;
        }

        #results table {

            border-collapse: collapse;

            width: 100%;

            font-size: 11px;

            background:
                rgba(255,255,255,.04);
        }

        #results th {

            background:
                rgba(255,255,255,.18);

            color: white;

            position: sticky;

            top: 0;

            z-index: 2;
        }

        #results th,
        #results td {

            border:
                1px solid
                rgba(255,255,255,.2);

            padding: 6px;

            vertical-align: top;

            white-space: pre-wrap;

            color: white;
        }

        #results td:first-child {

            font-weight: bold;
        }

        .nameColumn {

            background:
                rgba(255,230,120,.18);

            font-weight: bold;
        }

        .selectedRow {

            background:
                rgba(255,255,255,.07);
        }

        .userHeader {

            background:
                rgba(255,255,255,.12);

            font-weight: bold;
        }

        hr {

            border: 0;

            border-top:
                1px solid
                rgba(255,255,255,.15);

            margin: 14px 0;
        }

    `;

    document.head.appendChild(style);

    // =========================================================
    // ELEMENTS
    // =========================================================

    const nameList =
        document.getElementById('nameList');

    const newName =
        document.getElementById('newName');

    const status =
        document.getElementById('status');

    const inputData =
        document.getElementById('inputData');

    const loaded =
        document.getElementById('loaded');

    const pickCountInput =
        document.getElementById('pickCount');

    const capture =
        document.getElementById('capture');

    const usePaste =
        document.getElementById('usePaste');

    const pick =
        document.getElementById('pick');

    const again =
        document.getElementById('again');

    const copy =
        document.getElementById('copy');

    const results =
        document.getElementById('results');

    // =========================================================
    // RENDER NAMES
    // =========================================================

    function renderNameList() {

        nameList.innerHTML = '';

        allowedNames.forEach(
            (name, index) => {

                const item =
                    document.createElement(
                        'div'
                    );

                item.className =
                    'nameItem';

                item.innerHTML = `
                    <div class="nameText">
                        ${escapeHtml(name)}
                    </div>

                    <button
                        class="removeName"
                        data-index="${index}">
                        REMOVE
                    </button>
                `;

                item
                    .querySelector('.removeName')
                    .addEventListener(
                        'click',
                        function () {

                            allowedNames.splice(
                                index,
                                1
                            );

                            saveNames();

                            renderNameList();
                        }
                    );

                nameList.appendChild(item);
            }
        );
    }

    // =========================================================
    // ADD NAME
    // =========================================================

    document
        .getElementById('addName')
        .addEventListener(
            'click',
            function () {

                const name =
                    newName.value.trim();

                if (!name) {
                    return;
                }

                const exists =
                    allowedNames.some(
                        x =>
                            normalizeName(x) ===
                            normalizeName(name)
                    );

                if (exists) {

                    alert(
                        'That name is already in the list.'
                    );

                    return;
                }

                allowedNames.push(name);

                saveNames();

                newName.value = '';

                renderNameList();
            }
        );

    newName.addEventListener(
        'keydown',
        function (event) {

            if (event.key === 'Enter') {

                event.preventDefault();

                document
                    .getElementById('addName')
                    .click();
            }
        }
    );

    // =========================================================
    // RESET NAMES
    // =========================================================

    document
        .getElementById('resetNames')
        .addEventListener(
            'click',
            function () {

                if (
                    !confirm(
                        'Reset the name list to the defaults?'
                    )
                ) {
                    return;
                }

                allowedNames =
                    [...DEFAULT_NAMES];

                saveNames();

                renderNameList();
            }
        );

    // =========================================================
    // SAVE COUNT
    // =========================================================

    document
        .getElementById('saveCount')
        .addEventListener(
            'click',
            function () {

                let count =
                    parseInt(
                        pickCountInput.value,
                        10
                    );

                if (
                    !Number.isInteger(count) ||
                    count < 1
                ) {

                    count = 3;

                    pickCountInput.value = 3;
                }

                pickCount = count;

                savePickCount();

                status.innerHTML =
                    '<span class="success">' +
                    '✅ Disputes per user saved: ' +
                    pickCount +
                    '</span>';
            }
        );

    // =========================================================
    // PARSE EXCEL
    // =========================================================

    function parseExcelData(text) {

        if (!text || !text.trim()) {

            throw new Error(
                'No Excel data was found.'
            );
        }

        let rows =
            text
                .replace(/\r/g, '')
                .split('\n')
                .filter(
                    x => x.trim() !== ''
                )
                .map(
                    x => x.split('\t')
                );

        /*
         * Keep A:U internally because
         * A, S and U are needed.
         */

        rows =
            rows.map(
                row => {

                    const r =
                        row.slice(0, 21);

                    while (
                        r.length < 21
                    ) {
                        r.push('');
                    }

                    return r;
                }
            );

        /*
         * Remove header.
         */

        if (
            rows.length > 1 &&
            /dispute/i.test(
                String(rows[0][0] || '')
            )
        ) {

            rows.shift();
        }

        /*
         * Column A must contain data.
         */

        rows =
            rows.filter(
                row =>
                    String(
                        row[0] || ''
                    ).trim() !== ''
            );

        /*
         * Column U must contain a name.
         */

        rows =
            rows.filter(
                row =>
                    String(
                        row[20] || ''
                    ).trim() !== ''
            );

        if (rows.length < 1) {

            throw new Error(
                'No usable dispute rows found.'
            );
        }

        return rows;
    }

    // =========================================================
    // LOAD DATA
    // =========================================================

    function loadData(text) {

        try {

            tableData =
                parseExcelData(text);

            loaded.innerHTML =
                '<span class="success">' +
                '✅ ' +
                tableData.length +
                ' dispute rows loaded.' +
                '</span>';

            pick.disabled = false;

            status.innerHTML =
                'Data loaded. ' +
                'Disputes per user: <b>' +
                pickCount +
                '</b>.';

        } catch (error) {

            tableData = [];

            loaded.innerHTML =
                '<span class="error">' +
                '❌ ' +
                escapeHtml(
                    error.message
                ) +
                '</span>';

            pick.disabled = true;

            again.disabled = true;

            copy.disabled = true;
        }
    }

    // =========================================================
    // CAPTURE CLIPBOARD
    // =========================================================

    capture.addEventListener(
        'click',
        async function () {

            try {

                const text =
                    await navigator
                        .clipboard
                        .readText();

                loadData(text);

            } catch (e) {

                status.innerHTML =
                    '<span class="error">' +
                    '❌ Clipboard access blocked.' +
                    '</span><br>' +
                    'Paste the Excel data into the box below.';
            }
        }
    );

    // =========================================================
    // MANUAL PASTE
    // =========================================================

    usePaste.addEventListener(
        'click',
        function () {

            loadData(
                inputData.value
            );
        }
    );

    // =========================================================
    // SHUFFLE ARRAY
    // =========================================================

    function shuffleArray(array) {

        const copy =
            [...array];

        for (
            let i = copy.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                copy[i],
                copy[j]
            ] = [
                copy[j],
                copy[i]
            ];
        }

        return copy;
    }

    // =========================================================
    // ROW KEY
    // Used to compare random selections
    // =========================================================

    function rowKey(row) {

        return [
            row[0],
            row[18],
            row[20]
        ]
            .map(
                value =>
                    String(
                        value || ''
                    )
            )
            .join('\t');
    }

    // =========================================================
    // SAME SELECTION
    // =========================================================

    function sameSelection(a, b) {

        if (
            a.length !==
            b.length
        ) {
            return false;
        }

        const aKeys =
            a
                .map(
                    item =>
                        rowKey(
                            item.row
                        )
                )
                .sort();

        const bKeys =
            b
                .map(
                    item =>
                        rowKey(
                            item.row
                        )
                )
                .sort();

        return (
            aKeys.join('|') ===
            bKeys.join('|')
        );
    }

    // =========================================================
    // RANDOM PICK
    // DISPUTES PER USER
    // =========================================================

    function pickDisputes() {

        /*
         * Save count automatically.
         */

        let count =
            parseInt(
                pickCountInput.value,
                10
            );

        if (
            !Number.isInteger(count) ||
            count < 1
        ) {

            count = 3;

            pickCountInput.value = 3;

            pickCount = 3;

            savePickCount();

        } else {

            pickCount = count;

            savePickCount();
        }

        /*
         * Group rows by Column U.
         */

        const allowedMap =
            new Map();

        allowedNames.forEach(
            name => {

                allowedMap.set(
                    normalizeName(name),
                    name
                );
            }
        );

        const groups = {};

        tableData.forEach(
            row => {

                const actualName =
                    String(
                        row[20] || ''
                    ).trim();

                const normalized =
                    normalizeName(
                        actualName
                    );

                /*
                 * Only allowed names.
                 */

                if (
                    allowedMap.has(
                        normalized
                    )
                ) {

                    if (
                        !groups[normalized]
                    ) {

                        groups[normalized] = [];
                    }

                    groups[normalized]
                        .push(row);
                }
            }
        );

        // =====================================================
        // CHECK EVERY USER
        // =====================================================

        const missingUsers = [];

        allowedNames.forEach(
            name => {

                const normalized =
                    normalizeName(name);

                const group =
                    groups[normalized] || [];

                if (
                    group.length < count
                ) {

                    missingUsers.push(
                        `${name} (${group.length} available)`
                    );
                }
            }
        );

        /*
         * If any allowed name has fewer disputes
         * than requested, stop instead of producing
         * an incomplete result.
         */

        if (
            missingUsers.length > 0
        ) {

            status.innerHTML =
                '<span class="error">' +
                '❌ Not enough disputes for one or more users.<br>' +
                'You requested ' +
                count +
                ' per user.<br><br>' +
                escapeHtml(
                    missingUsers.join(' | ')
                ) +
                '</span>';

            again.disabled =
                lastSelected.length === 0;

            return;
        }

        // =====================================================
        // RANDOMIZE EVERY USER
        // =====================================================

        let selected = [];

        allowedNames.forEach(
            name => {

                const normalized =
                    normalizeName(name);

                const group =
                    groups[normalized];

                /*
                 * Shuffle the user's disputes
                 * and take EXACTLY the requested count.
                 */

                const shuffled =
                    shuffleArray(group);

                const userSelected =
                    shuffled.slice(
                        0,
                        count
                    );

                userSelected.forEach(
                    row => {

                        selected.push({
                            row: row
                        });
                    }
                );
            }
        );

        // =====================================================
        // TRY AGAIN
        // Avoid selecting the exact same rows
        // when another combination is available.
        // =====================================================

        let attempts = 0;

        while (
            lastSelected.length > 0 &&
            sameSelection(
                selected,
                lastSelected
            ) &&
            attempts < 100
        ) {

            selected = [];

            allowedNames.forEach(
                name => {

                    const normalized =
                        normalizeName(name);

                    const group =
                        groups[normalized];

                    const shuffled =
                        shuffleArray(group);

                    const userSelected =
                        shuffled.slice(
                            0,
                            count
                        );

                    userSelected.forEach(
                        row => {

                            selected.push({
                                row: row
                            });
                        }
                    );
                }
            );

            attempts++;
        }

        // =====================================================
        // SAVE SELECTION
        // =====================================================

        lastSelected =
            selected;

        // =====================================================
        // SHOW RESULTS
        // =====================================================

        showResults(
            selected
        );

        // =====================================================
        // COPY A, S, U ONLY
        // =====================================================

        const copyText =
            selected
                .map(
                    item => {

                        const row =
                            item.row;

                        return [
                            row[0],   // A
                            row[18],  // S
                            row[20]   // U
                        ].join('\t');
                    }
                )
                .join('\n');

        copyToClipboard(
            copyText
        );
    }

    // =========================================================
    // SHOW RESULTS
    // A, S, U ONLY
    // =========================================================

    function showResults(selected) {

        /*
         * Count selected disputes per user
         */

        const userCounts = {};

        selected.forEach(
            item => {

                const name =
                    String(
                        item.row[20] || ''
                    ).trim();

                const normalized =
                    normalizeName(name);

                if (
                    !userCounts[normalized]
                ) {

                    userCounts[normalized] = {
                        name: name,
                        count: 0
                    };
                }

                userCounts[normalized]
                    .count++;
            }
        );

        /*
         * Status
         */

        status.innerHTML =
            '<b>✅ ' +
            selected.length +
            ' RANDOM DISPUTES</b><br>' +

            '<span class="success">' +
            pickCount +
            ' disputes per user × ' +
            allowedNames.length +
            ' users = ' +
            selected.length +
            ' total' +
            '</span><br><br>' +

            selected
                .map(
                    item =>
                        escapeHtml(
                            String(
                                item.row[0]
                            )
                        ) +
                        ' → ' +
                        escapeHtml(
                            String(
                                item.row[20]
                            )
                        )
                )
                .join('<br>');

        /*
         * Results table
         */

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>A</th>
                        <th>S</th>
                        <th>U</th>
                    </tr>
                </thead>

                <tbody>
        `;

        selected.forEach(
            item => {

                const row =
                    item.row;

                html +=
                    '<tr class="selectedRow">';

                // A
                html +=
                    '<td>' +
                    escapeHtml(
                        String(
                            row[0] || ''
                        )
                    ) +
                    '</td>';

                // S
                html +=
                    '<td>' +
                    escapeHtml(
                        String(
                            row[18] || ''
                        )
                    ) +
                    '</td>';

                // U
                html +=
                    '<td class="nameColumn">' +
                    escapeHtml(
                        String(
                            row[20] || ''
                        )
                    ) +
                    '</td>';

                html +=
                    '</tr>';
            }
        );

        html += `
                </tbody>
            </table>
        `;

        results.innerHTML =
            html;

        again.disabled = false;

        copy.disabled = false;
    }

    // =========================================================
    // COPY
    // =========================================================

    function copyToClipboard(text) {

        try {

            if (
                typeof GM_setClipboard ===
                'function'
            ) {

                GM_setClipboard(
                    text,
                    'text'
                );

                return;
            }

        } catch (e) {}

        try {

            if (
                navigator.clipboard &&
                typeof navigator.clipboard.writeText ===
                    'function'
            ) {

                navigator.clipboard
                    .writeText(text)
                    .catch(() => {});
            }

        } catch (e) {}
    }

    // =========================================================
    // COPY AGAIN
    // A, S, U ONLY
    // =========================================================

    copy.addEventListener(
        'click',
        function () {

            if (
                !lastSelected.length
            ) {
                return;
            }

            const text =
                lastSelected
                    .map(
                        item => {

                            const row =
                                item.row;

                            return [
                                row[0],
                                row[18],
                                row[20]
                            ].join('\t');
                        }
                    )
                    .join('\n');

            copyToClipboard(
                text
            );

            status.innerHTML +=
                '<br><span class="success">' +
                '✅ Copied again.' +
                '</span>';
        }
    );

    // =========================================================
    // PICK
    // =========================================================

    pick.addEventListener(
        'click',
        pickDisputes
    );

    // =========================================================
    // TRY AGAIN
    // =========================================================

    again.addEventListener(
        'click',
        pickDisputes
    );

    // =========================================================
    // NORMALIZE NAME
    // =========================================================

    function normalizeName(name) {

        return String(name || '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    // =========================================================
    // ESCAPE HTML
    // =========================================================

    function escapeHtml(value) {

        return String(value)
            .replace(
                /&/g,
                '&amp;'
            )
            .replace(
                /</g,
                '&lt;'
            )
            .replace(
                />/g,
                '&gt;'
            )
            .replace(
                /"/g,
                '&quot;'
            )
            .replace(
                /'/g,
                '&#039;'
            );
    }

    // =========================================================
    // CLOSE
    // =========================================================

    document
        .getElementById('vobClose')
        .onclick = function () {

            panel.remove();

            const currentStyle =
                document.getElementById(
                    'vobPickerStyle'
                );

            if (currentStyle) {
                currentStyle.remove();
            }
        };

    // =========================================================
    // MINIMIZE
    // =========================================================

    document
        .getElementById('vobMin')
        .onclick = function () {

            const body =
                document.getElementById(
                    'vobBody'
                );

            if (
                body.style.display ===
                'none'
            ) {

                body.style.display =
                    'block';

                this.textContent = '−';

            } else {

                body.style.display =
                    'none';

                this.textContent = '+';
            }
        };

    // =========================================================
    // DRAG
    // =========================================================

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    document
        .getElementById('vobHeader')
        .addEventListener(
            'mousedown',
            function (event) {

                if (
                    event.target.tagName ===
                    'BUTTON'
                ) {
                    return;
                }

                dragging = true;

                const rect =
                    panel.getBoundingClientRect();

                offsetX =
                    event.clientX -
                    rect.left;

                offsetY =
                    event.clientY -
                    rect.top;

                panel.style.right =
                    'auto';
            }
        );

    document.addEventListener(
        'mousemove',
        function (event) {

            if (!dragging) {
                return;
            }

            panel.style.left =
                (
                    event.clientX -
                    offsetX
                ) + 'px';

            panel.style.top =
                (
                    event.clientY -
                    offsetY
                ) + 'px';
        }
    );

    document.addEventListener(
        'mouseup',
        function () {

            dragging = false;
        }
    );

    // =========================================================
    // START
    // =========================================================

    renderNameList();

    pickCountInput.value =
        pickCount;

    status.innerHTML =
        '✅ Ready. You have ' +
        '<b>' +
        allowedNames.length +
        '</b> allowed names.<br>' +
        'Set how many disputes you want <b>PER USER</b>, ' +
        'then load your A:U data.';

})();
