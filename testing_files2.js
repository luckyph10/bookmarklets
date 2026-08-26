(async()=>{

/* =========================================================
   DISPUTE USER NAME
   ========================================================= */

const KEY="disputeUserName";

const getName=()=>{
    try{
        return(localStorage.getItem(KEY)||"").trim();
    }catch(e){
        return"";
    }
};

const saveName=n=>{
    try{
        localStorage.setItem(KEY,n);
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
};


/* =========================================================
   NORMALIZE
   ========================================================= */

const normalizeValue=value=>{
    return String(value??"")
        .replace(/\u00A0/g," ")
        .replace(/\r?\n/g," ")
        .replace(/\s+/g," ")
        .trim()
        .toLowerCase();
};


/* =========================================================
   GET DISPUTE NUMBER
   ========================================================= */

const disputeNumber=
    document.querySelector(
        "#ngForm fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input"
    )?.value?.trim()||"";


/* =========================================================
   GET DISPUTE STATUS
   ========================================================= */

const disputeStatusElement=
    document.querySelector(
        "#ngForm fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > ng-select"
    );

const disputeStatus=
    disputeStatusElement
        ?.querySelector(".ng-value-label")
        ?.textContent
        ?.trim()
    ||
    disputeStatusElement
        ?.querySelector(".ng-value")
        ?.textContent
        ?.trim()
    ||
    disputeStatusElement
        ?.textContent
        ?.trim()
    ||
    "";


/* =========================================================
   GET COLUMN J SOURCE
   ========================================================= */

const columnJElement=
    document.querySelector(
        "#ngForm > fieldset > div > div:nth-child(1) > div:nth-child(2) > ng-select"
    );

const columnJValue=
    columnJElement
        ?.querySelector(".ng-value-label")
        ?.textContent
        ?.trim()
    ||
    columnJElement
        ?.querySelector(".ng-value")
        ?.textContent
        ?.trim()
    ||
    columnJElement
        ?.textContent
        ?.trim()
    ||
    "";


/* =========================================================
   GET PAGE K VALUE
   ========================================================= */

const columnKPageElement=
    document.querySelector(
        "#ngForm > fieldset > div > div:nth-child(1) > div:nth-child(4) > ng-select"
    );

const columnKPageValue=
    columnKPageElement
        ?.querySelector(".ng-value-label")
        ?.textContent
        ?.trim()
    ||
    columnKPageElement
        ?.querySelector(".ng-value")
        ?.textContent
        ?.trim()
    ||
    columnKPageElement
        ?.textContent
        ?.trim()
    ||
    "";


/* =========================================================
   GET IDS
   ========================================================= */

const ids=[
    ...document.querySelectorAll(
        "#table-body tr td:nth-child(2)"
    )
]
.map(td=>
    td.textContent
        .replace(/\u00A0/g," ")
        .replace(/\r?\n/g," ")
        .replace(/\s+/g," ")
        .trim()
)
.filter(Boolean);


/* =========================================================
   GET ALL ARBIT / APP ID LINKS
   UPDATED FOR NEW ARBIT ELEMENT
   ========================================================= */

const arbitLinks=[
    ...document.querySelectorAll(
        'a[title="Open Arbit"]'
    )
]
.map((link,index)=>{

    const href=
        link.href||
        link.getAttribute("href")||
        "";

    /*
     * NEW ELEMENT:
     *
     * <a
     *     title="Open Arbit"
     *     target="_blank"
     *     href="calculator/2207838"
     * >
     *     2207838
     * </a>
     *
     * Extract ARBIT ID from the calculator URL.
     */

    const hrefMatch=
        href.match(
            /(?:^|\/)calculator\/([^/?#]+)/i
        );

    const linkText=
        (
            link.innerText||
            link.textContent||
            ""
        )
        .replace(/\u00A0/g," ")
        .replace(/\r?\n/g," ")
        .replace(/\s+/g," ")
        .trim();

    const id=
        hrefMatch?.[1]||
        linkText||
        ids[index]||
        "";

    return{
        id:id,
        href:href,
        index:index
    };

})
.filter(
    item=>
        item.id &&
        item.href
);


/* =========================================================
   REMOVE DUPLICATE APP / ARBIT LINKS
   ========================================================= */

const uniqueArbitLinks=[];
const seenArbitLinks=new Set();

for(const item of arbitLinks){

    const key=
        `${item.id}|||${item.href}`;

    if(seenArbitLinks.has(key))
        continue;

    seenArbitLinks.add(key);

    uniqueArbitLinks.push(item);
}


/* =========================================================
   GET PLAN TYPES
   ========================================================= */

const planTypes=[
    ...document.querySelectorAll(
        '[id^="planType_"]'
    )
]
.map(el=>
    (
        el.innerText||
        el.textContent||
        el.value||
        ""
    )
    .replace(/\u00A0/g," ")
    .replace(/\r?\n/g," ")
    .replace(/\s+/g," ")
    .trim()
)
.filter(Boolean);


/* =========================================================
   GET FIRST ARBIT ID NUMBER
   UPDATED FOR NEW ARBIT ELEMENT
   ========================================================= */

const firstArbitLink=
    document.querySelector(
        'a[title="Open Arbit"]'
    );

const firstArbitHref=
    firstArbitLink?.href||
    firstArbitLink?.getAttribute("href")||
    "";

const firstArbitHrefMatch=
    firstArbitHref.match(
        /(?:^|\/)calculator\/([^/?#]+)/i
    );

const arbitIdNumber=
    firstArbitHrefMatch?.[1]
    ||
    (
        firstArbitLink?.innerText||
        firstArbitLink?.textContent||
        ""
    )
        .replace(/\u00A0/g," ")
        .replace(/\r?\n/g," ")
        .replace(/\s+/g," ")
        .trim()
    ||
    "";


/* =========================================================
   VALIDATION
   ========================================================= */

if(
    !disputeNumber||
    !disputeStatus||
    !ids.length
){

    console.error(
        "Missing required page data.",
        {
            disputeNumber,
            disputeStatus,
            ids
        }
    );

    alert(
        "Unable to continue.\n\n"+
        "Missing Dispute Number, Dispute Status, or IDs."
    );

    return;
}


/* =========================================================
   DEBUG
   ========================================================= */

console.log(
    "========================================"
);

console.log(
    "DISPUTE AUTO FILL STARTED"
);

console.log(
    "Dispute Number:",
    disputeNumber
);

console.log(
    "Dispute Status:",
    disputeStatus
);

console.log(
    "Page Column J source:",
    columnJValue
);

console.log(
    "Page K value:",
    columnKPageValue
);

console.log(
    "ARBIT ID:",
    arbitIdNumber
);

console.log(
    "IDs:",
    ids
);

console.log(
    "ARBIT / APP LINKS:",
    uniqueArbitLinks
);

console.log(
    "Plan Types:",
    planTypes
);

console.log(
    "========================================"
);


/* =========================================================
   SAME ID
   ========================================================= */

const sameId=
    ids.every(id=>id===ids[0]);


/* =========================================================
   PLAN TYPE
   ========================================================= */

const getPlanType=i=>{

    return(
        planTypes[i]||
        planTypes[0]||
        ""
    ).trim();

};


/* =========================================================
   COLUMN R / NOTES RULE
   ========================================================= */

const getColumnRValue=(actualG,actualL)=>{

    const g=normalizeValue(actualG);
    const l=normalizeValue(actualL);


    console.log(
        "========================================"
    );

    console.log(
        "R / NOTES RULE CHECK"
    );

    console.log(
        "G / Dispute Review Status:",
        actualG
    );

    console.log(
        "Normalized G:",
        g
    );

    console.log(
        "L / Dispute Status:",
        actualL
    );

    console.log(
        "Normalized L:",
        l
    );


    /* =====================================================
       COLUMN L = CLOSED
       ===================================================== */

    if(
        l==="closed"||
        l.includes("closed")
    ){

        console.log(
            "R RULE MATCH: L = CLOSED"
        );

        return(
            "Completed. Dispute is Closed Due to Receiving Payment Determination."
        );

    }


    /* =====================================================
       COLUMN G = PLAN TYPE VALIDATED
       ===================================================== */

    if(
        g.includes(
            "plan type validated post idr initiation"
        )
    ){

        console.log(
            "R RULE MATCH: PLAN TYPE VALIDATED"
        );

        return(
            "VOB verified, Plan Type Validated Post IDR Initiation – Eligible (Federal NSA)."
        );

    }


    /* =====================================================
       COLUMN G = PLAN TYPE OBJECTION SUBMITTED
       ===================================================== */

    if(
        g.includes(
            "plan type objection submitted"
        )
    ){

        console.log(
            "R RULE MATCH: PLAN TYPE OBJECTION SUBMITTED"
        );

        return(
            "Already completed by Onshore."
        );

    }


    /* =====================================================
       COLUMN G = TIMELINE ENFORCEMENT SUBMITTED TO IDRE
       ===================================================== */

    if(
        g.includes(
            "timeline enforcement submitted to idre"
        )
    ){

        console.log(
            "R RULE MATCH: TIMELINE ENFORCEMENT SUBMITTED TO IDRE"
        );

        return(
            "Already completed by Onshore."
        );

    }


    /* =====================================================
       COLUMN G = ADDITIONAL INFO PROVIDED TO IDRE
       THROUGH EMAIL
       ===================================================== */

    if(
        g.includes(
            "additional info provided to idre through email"
        )
    ){

        console.log(
            "R RULE MATCH: ADDITIONAL INFO EMAIL"
        );

        return(
            "VOB verified, evidence uploaded, Additional info requested, Arbit updated."
        );

    }


    /* =====================================================
       COLUMN G = ADDITIONAL INFO PROVIDED TO IDRE
       THROUGH PORTAL
       ===================================================== */

    if(
        g.includes(
            "additional info provided to idre through portal"
        )
    ){

        console.log(
            "R RULE MATCH: ADDITIONAL INFO PORTAL"
        );

        return(
            "VOB verified, evidence uploaded, Additional info requested, Arbit updated."
        );

    }


    /* =====================================================
       NO MATCH
       ===================================================== */

    console.warn(
        "NO G/L -> R RULE MATCHED",
        {
            disputeReviewStatus:actualG,
            disputeStatus:actualL
        }
    );

    return"";

};


/* =========================================================
   CLIPBOARD
   ========================================================= */

const copyText=async text=>{

    try{

        if(
            navigator.clipboard &&
            typeof navigator.clipboard.writeText==="function"
        ){

            await navigator.clipboard.writeText(text);

            return true;

        }

    }catch(e){

        console.warn(
            "Clipboard API failed:",
            e
        );

    }


    try{

        const textarea=
            document.createElement("textarea");

        textarea.value=text;
        textarea.readOnly=true;

        textarea.style.position="fixed";
        textarea.style.left="-10000px";
        textarea.style.top="0";
        textarea.style.width="1px";
        textarea.style.height="1px";
        textarea.style.opacity="0";
        textarea.style.pointerEvents="none";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        textarea.setSelectionRange(
            0,
            text.length
        );

        const copied=
            document.execCommand("copy");

        textarea.remove();

        return copied;

    }catch(e){

        console.error(
            "Clipboard fallback failed:",
            e
        );

        return false;

    }

};


/* =========================================================
   COPY TOAST
   ========================================================= */

const showCopyMessage=(message,clipboardText)=>{

    const old=
        document.getElementById(
            "dispute-copy-toast"
        );

    if(old)
        old.remove();


    const toast=
        document.createElement("div");

    toast.id=
        "dispute-copy-toast";


    toast.innerHTML=`
        <div id="dct-message"></div>

        <button id="dct-copy">
            COPY AGAIN
        </button>
    `;


    toast.style.cssText=
        "position:fixed;top:80px;left:50%;transform:translateX(-50%);padding:14px 16px;border-radius:14px;background:rgba(0,0,0,.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;font:600 14px Arial,sans-serif;z-index:2147483647;box-shadow:0 8px 32px rgba(0,0,0,.4);min-width:360px;text-align:center;box-sizing:border-box";


    const messageEl=
        toast.querySelector(
            "#dct-message"
        );


    const copyAgainBtn=
        toast.querySelector(
            "#dct-copy"
        );


    messageEl.textContent=
        message;


    copyAgainBtn.style.cssText=
        "margin-top:10px;height:36px;padding:0 16px;border:1px solid rgba(255,255,255,.25);border-radius:9px;background:rgba(35,150,70,.9);color:#fff;font:700 13px Arial,sans-serif;cursor:pointer";


    copyAgainBtn.onclick=async()=>{

        const ok=
            await copyText(
                clipboardText
            );


        copyAgainBtn.textContent=
            ok
                ?"COPIED ✓"
                :"COPY FAILED";


        if(ok){

            setTimeout(()=>{

                copyAgainBtn.textContent=
                    "COPY AGAIN";

            },1500);

        }

    };


    document.body.appendChild(toast);


    setTimeout(()=>{

        if(toast.parentNode){

            toast.style.transition=
                "opacity .3s";

            toast.style.opacity="0";


            setTimeout(()=>{

                if(toast.parentNode)
                    toast.remove();

            },300);

        }

    },5000);


    return toast;

};


/* =========================================================
   RUSH VERIFY
   ========================================================= */

const runRushVerify=iframe=>{

    const scriptUrl=
        "https://luckyph10.github.io/bookmarklets/vob_intelligence.js?" +
        Date.now();


    try{

        const doc=
            iframe.contentDocument ||
            iframe.contentWindow?.document;


        if(!doc){

            throw new Error(
                "Unable to access iframe document."
            );

        }


        const oldScript=
            doc.getElementById(
                "rush-verify-script"
            );


        if(oldScript)
            oldScript.remove();


        const script=
            doc.createElement("script");


        script.id=
            "rush-verify-script";


        script.src=
            scriptUrl;


        script.onload=()=>{

            console.log(
                "RUSH VERIFY loaded inside ARBIT iframe."
            );

        };


        script.onerror=()=>{

            alert(
                "RUSH VERIFY: Load failed."
            );

        };


        (
            doc.head||
            doc.documentElement
        ).appendChild(
            script
        );


    }catch(e){

        console.error(
            "RUSH VERIFY iframe error:",
            e
        );

        alert(
            "RUSH VERIFY could not run inside the ARBIT iframe.\n\n"+
            "The iframe page may block cross-origin script injection."
        );

    }

};


/* =========================================================
   PULL CASE / HISTORY EVIDENCE
   ========================================================= */

const runPullEvidence=iframe=>{

    const scriptUrl=
        "https://luckyph10.github.io/bookmarklets/case_notes_puller.js?" +
        Date.now();


    try{

        const doc=
            iframe.contentDocument ||
            iframe.contentWindow?.document;


        if(!doc){

            throw new Error(
                "Unable to access iframe document."
            );

        }


        const oldScript=
            doc.getElementById(
                "pull-case-history-evidence-script"
            );


        if(oldScript)
            oldScript.remove();


        const script=
            doc.createElement("script");


        script.id=
            "pull-case-history-evidence-script";


        script.src=
            scriptUrl;


        script.onload=()=>{

            console.log(
                "Pull Case/History Evidence loaded inside ARBIT iframe."
            );

        };


        script.onerror=()=>{

            alert(
                "Pull Case/History Evidence: Load failed."
            );

        };


        (
            doc.head||
            doc.documentElement
        ).appendChild(
            script
        );


    }catch(e){

        console.error(
            "Pull Case/History Evidence iframe error:",
            e
        );

        alert(
            "Pull Case/History Evidence could not run inside the ARBIT iframe.\n\n"+
            "The iframe page may block cross-origin script injection."
        );

    }

};


/* =========================================================
   VOB FILE VIEWER
   ========================================================= */

const openVobViewer=url=>{

    if(!url)
        return;


    const old=
        document.getElementById(
            "vob-file-viewer-overlay"
        );


    if(old)
        old.remove();


    const viewer=
        document.createElement("div");


    viewer.id=
        "vob-file-viewer-overlay";


    viewer.innerHTML=`
        <div id="vob-file-viewer-window">

            <div id="vob-file-viewer-header">

                <div id="vob-file-viewer-title">
                    VOB FILE
                </div>


                <button
                    id="vob-file-viewer-close"
                    type="button"
                    aria-label="Close VOB file"
                >
                    ×
                </button>

            </div>


            <iframe
                id="vob-file-viewer-frame"
                src="${String(url).replace(/"/g,"&quot;")}"
                frameborder="0"
                allowfullscreen
            ></iframe>

        </div>
    `;


    document.body.appendChild(
        viewer
    );


    const close=()=>{

        viewer.remove();

    };


    viewer
        .querySelector(
            "#vob-file-viewer-close"
        )
        .onclick=
            close;


    viewer.addEventListener(
        "mousedown",
        e=>{

            if(
                e.target===viewer
            ){

                close();

            }

        }
    );

};


/* =========================================================
   OPEN ARBIT / APP ID IFRAME
   ========================================================= */

const openArbitIframe=()=>{

    const existingOverlay=
        document.getElementById(
            "arbit-iframe-overlay"
        );


    if(
        existingOverlay &&
        existingOverlay.dataset.minimized==="true"
    ){

        existingOverlay.dataset.minimized="false";

        existingOverlay.style.setProperty(
            "display",
            "flex",
            "important"
        );


        const existingVobViewer=
            document.getElementById(
                "vob-file-viewer-overlay"
            );


        if(existingVobViewer){

            existingVobViewer.style.setProperty(
                "display",
                "flex",
                "important"
            );

        }


        try{

            document
                .getElementById(
                    "arbit-iframe"
                )
                ?.focus();

        }catch(e){}


        return;

    }


    /*
     * USE THE NEW ARBIT LINKS
     */

    let appLinks=[
        ...uniqueArbitLinks
    ];


    /*
     * FALLBACK TO THE NEW SELECTOR
     */

    if(!appLinks.length){

        const fallbackLink=
            document.querySelector(
                'a[title="Open Arbit"]'
            );


        if(fallbackLink){

            const fallbackHref=
                fallbackLink.href||
                fallbackLink.getAttribute("href")||
                "";


            const fallbackMatch=
                fallbackHref.match(
                    /(?:^|\/)calculator\/([^/?#]+)/i
                );


            const fallbackText=
                (
                    fallbackLink.innerText||
                    fallbackLink.textContent||
                    ""
                )
                .replace(/\u00A0/g," ")
                .replace(/\r?\n/g," ")
                .replace(/\s+/g," ")
                .trim();


            appLinks=[
                {
                    id:
                        fallbackMatch?.[1]||
                        fallbackText||
                        arbitIdNumber||
                        "UNKNOWN",

                    href:
                        fallbackHref,

                    index:0
                }
            ];

        }

    }


    if(!appLinks.length){

        alert(
            "ARBIT ID link not found."
        );

        return;

    }


    const old=
        document.getElementById(
            "arbit-iframe-overlay"
        );


    if(old)
        old.remove();


    const oldStyle=
        document.getElementById(
            "arbit-iframe-style"
        );


    if(oldStyle)
        oldStyle.remove();


    let currentAppIndex=0;

    let currentApp=
        appLinks[currentAppIndex];


    const overlay=
        document.createElement("div");


    overlay.id=
        "arbit-iframe-overlay";


    overlay.innerHTML=`

        <div
            id="arbit-iframe-window"
        >

            <div
                id="arbit-iframe-header"
            >

                <div
                    id="arbit-iframe-title"
                >
                    ARBIT / APP ID
                </div>


                <div
                    id="arbit-iframe-current-id"
                >
                    ${String(currentApp.id).replace(/</g,"&lt;")}
                </div>


                ${
                    appLinks.length>1
                    ?`

                    <div
                        id="arbit-app-selector-wrap"
                    >

                        <select
                            id="arbit-app-selector"
                            title="Select another ARBIT / APP ID"
                        >

                            ${appLinks.map((item,index)=>`

                                <option
                                    value="${index}"
                                    ${index===0?"selected":""}
                                >
                                    ${String(item.id).replace(/</g,"&lt;")}
                                </option>

                            `).join("")}

                        </select>

                    </div>

                    `
                    :""
                }


                <button
                    id="arbit-iframe-rush"
                    type="button"
                >
                    RUSH VERIFY
                </button>


                <button
                    id="arbit-iframe-pull"
                    type="button"
                >
                    PULL EVIDENCE
                </button>


                <button
                    id="arbit-iframe-minimize"
                    type="button"
                    aria-label="Minimize"
                >
                    −
                </button>


                <button
                    id="arbit-iframe-close"
                    type="button"
                    aria-label="Close"
                >
                    ×
                </button>

            </div>


            <iframe
                id="arbit-iframe"
                src="${String(currentApp.href).replace(/"/g,"&quot;")}"
                frameborder="0"
                allowfullscreen
            ></iframe>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const iframe=
        document.getElementById(
            "arbit-iframe"
        );


    const currentIdDisplay=
        document.getElementById(
            "arbit-iframe-current-id"
        );


    const updateCurrentIdDisplay=()=>{

        if(currentIdDisplay){

            currentIdDisplay.textContent=
                currentApp?.id||
                "";

        }

    };


    const selector=
        document.getElementById(
            "arbit-app-selector"
        );


    if(selector){

        selector.onchange=()=>{

            const selectedIndex=
                Number(
                    selector.value
                );


            if(
                !Number.isInteger(
                    selectedIndex
                )||
                !appLinks[selectedIndex]
            ){

                return;

            }


            const selectedApp=
                appLinks[selectedIndex];


            console.log(
                "Opening selected APP / ARBIT ID in SAME iframe:",
                selectedApp
            );


            currentAppIndex=
                selectedIndex;


            currentApp=
                selectedApp;


            iframe.src=
                selectedApp.href;


            updateCurrentIdDisplay();

        };

    }


    const rushBtn=
        document.getElementById(
            "arbit-iframe-rush"
        );


    if(rushBtn){

        rushBtn.onclick=()=>{

            runRushVerify(
                iframe
            );

        };

    }


    const pullBtn=
        document.getElementById(
            "arbit-iframe-pull"
        );


    if(pullBtn){

        pullBtn.onclick=()=>{

            runPullEvidence(
                iframe
            );

        };

    }


    const minimizeBtn=
        document.getElementById(
            "arbit-iframe-minimize"
        );


    if(minimizeBtn){

        minimizeBtn.onclick=()=>{

            overlay.dataset.minimized=
                "true";


            overlay.style.setProperty(
                "display",
                "none",
                "important"
            );


            const vobViewer=
                document.getElementById(
                    "vob-file-viewer-overlay"
                );


            if(vobViewer){

                vobViewer.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            }

        };

    }


    const closeBtn=
        document.getElementById(
            "arbit-iframe-close"
        );


    if(closeBtn){

        closeBtn.onclick=()=>{

            overlay.remove();

        };

    }


    updateCurrentIdDisplay();

};


/* =========================================================
   ORIGINAL UI / POPUP
   ========================================================= */

/*
 * The original popup/UI logic remains unchanged.
 * The important output change is in buildRow() below:
 *
 * COLUMN F = arbitIdNumber
 */


/* =========================================================
   MAIN POPUP
   ========================================================= */

const popup=()=>new Promise(resolve=>{

    const old=
        document.getElementById(
            "dispute-auto-fill-overlay"
        );

    if(old)
        old.remove();


    const style=
        document.createElement("style");

    style.id=
        "dispute-auto-fill-style";


    style.textContent=`

        #dispute-auto-fill-overlay{

            position:fixed;

            inset:0;

            z-index:2147483640;

            display:flex;

            align-items:center;

            justify-content:center;

            background:rgba(0,0,0,.72);

            backdrop-filter:blur(8px);

            -webkit-backdrop-filter:blur(8px);

            font-family:Arial,sans-serif;

        }


        #dispute-auto-fill-box{

            width:min(680px,94vw);

            max-height:92vh;

            overflow:auto;

            background:#111;

            color:#fff;

            border:1px solid rgba(255,255,255,.15);

            border-radius:18px;

            box-shadow:
                0 25px 80px rgba(0,0,0,.55);

            padding:22px;

            box-sizing:border-box;

        }


        #dispute-auto-fill-title{

            font-size:20px;

            font-weight:800;

            margin-bottom:18px;

        }


        .daf-row{

            display:flex;

            align-items:center;

            gap:10px;

            margin-bottom:12px;

        }


        .daf-row label{

            width:190px;

            flex:0 0 190px;

            font-size:13px;

            font-weight:700;

        }


        .daf-row input,
        .daf-row select,
        .daf-row textarea{

            flex:1;

            min-width:0;

            box-sizing:border-box;

            border:1px solid rgba(255,255,255,.25);

            border-radius:10px;

            background:#222;

            color:#fff;

            padding:0 12px;

            height:42px;

            outline:none;

        }


        .daf-row textarea{

            height:90px;

            padding-top:10px;

            resize:vertical;

        }


        .daf-row input:focus,
        .daf-row select:focus,
        .daf-row textarea:focus{

            border-color:
                rgba(255,255,255,.65);

            box-shadow:
                0 0 0 3px
                rgba(255,255,255,.08);

        }


        #daf-buttons{

            display:flex;

            gap:10px;

            margin-top:18px;

        }


        #daf-buttons button{

            flex:1;

            height:44px;

            border:
                1px solid
                rgba(255,255,255,.25);

            border-radius:10px;

            background:
                rgba(255,255,255,.14);

            color:#fff;

            font-weight:700;

            cursor:pointer;

        }


        #daf-buttons button:hover{

            background:
                rgba(255,255,255,.22);

        }


        #daf-go{

            background:#166534 !important;

        }


        #daf-close{

            background:#991b1b !important;

        }


        #daf-eligible{

            display:none;

            margin-top:18px;

            padding-top:18px;

            border-top:
                1px solid
                rgba(255,255,255,.15);

        }


        #daf-eligible-buttons{

            display:flex;

            gap:10px;

            margin-top:10px;

        }


        #daf-eligible-buttons button{

            flex:1;

            height:42px;

            border:0;

            border-radius:10px;

            color:#fff;

            font-weight:800;

            cursor:pointer;

        }


        #daf-no{

            background:#991b1b;

        }


        #daf-yes{

            background:#166534;

        }


        #daf-yes-fields{

            display:none;

            margin-top:14px;

        }


        #daf-continue{

            width:100%;

            height:44px;

            border:0;

            border-radius:10px;

            background:#166534;

            color:#fff;

            font-weight:800;

            cursor:pointer;

        }


        #daf-continue:disabled{

            opacity:.45;

            cursor:not-allowed;

        }


        #daf-arbit{

            width:100%;

            height:44px;

            margin-top:10px;

            border:
                1px solid
                rgba(255,255,255,.25);

            border-radius:10px;

            background:
                rgba(255,255,255,.14);

            color:#fff;

            font-weight:800;

            cursor:pointer;

        }


        #daf-status{

            margin-top:12px;

            font-size:12px;

            color:rgba(255,255,255,.7);

            min-height:16px;

        }


        @media(max-width:600px){

            #dispute-auto-fill-box{

                width:96vw;

                padding:16px;

            }


            .daf-row{

                display:block;

            }


            .daf-row label{

                display:block;

                width:auto;

                margin-bottom:5px;

            }

        }

    `;


    document.head.appendChild(
        style
    );


    const overlay=
        document.createElement("div");


    overlay.id=
        "dispute-auto-fill-overlay";


    overlay.innerHTML=`

        <div id="dispute-auto-fill-box">

            <div id="dispute-auto-fill-title">
                DISPUTE INFORMATION
            </div>


            <div class="daf-row">

                <label>
                    Dispute User Name
                </label>

                <input
                    id="daf-name"
                    type="text"
                    autocomplete="off"
                >

            </div>


            <div class="daf-row">

                <label>
                    State
                </label>

                <input
                    id="daf-state"
                    type="text"
                    maxlength="2"
                    autocomplete="off"
                >

            </div>


            <div class="daf-row">

                <label>
                    Duplicate Dispute Comments
                </label>

                <select
                    id="daf-duplicate"
                >

                    <option value="">
                        Select
                    </option>

                    <option value="Yes">
                        Yes
                    </option>

                    <option value="No">
                        No
                    </option>

                </select>

            </div>


            <div class="daf-row">

                <label>
                    Plantype Mismatch
                </label>

                <select
                    id="daf-mismatch"
                >

                    <option value="">
                        Select
                    </option>

                    <option value="Yes">
                        Yes
                    </option>

                    <option value="No">
                        No
                    </option>

                </select>

            </div>


            <div id="daf-buttons">

                <button
                    id="daf-go"
                    type="button"
                >
                    GO
                </button>


                <button
                    id="daf-close"
                    type="button"
                >
                    CLOSE
                </button>

            </div>


            <div id="daf-eligible">

                <div>
                    Is this dispute eligible?
                </div>


                <div id="daf-eligible-buttons">

                    <button
                        id="daf-no"
                        type="button"
                    >
                        NO
                    </button>


                    <button
                        id="daf-yes"
                        type="button"
                    >
                        YES
                    </button>

                </div>


                <div id="daf-yes-fields">

                    <div class="daf-row">

                        <label>
                            Email
                        </label>

                        <input
                            id="daf-email"
                            type="email"
                        >

                    </div>


                    <div class="daf-row">

                        <label>
                            Arbit Case Notes
                        </label>

                        <textarea
                            id="daf-notes"
                        ></textarea>

                    </div>


                    <div class="daf-row">

                        <label>
                            Plan Type Evidence
                        </label>

                        <select
                            id="daf-plan-evidence"
                        >

                            <option value="">
                                Select
                            </option>

                            <option value="Yes">
                                Yes
                            </option>

                            <option value="No">
                                No
                            </option>

                        </select>

                    </div>


                    <div class="daf-row">

                        <label>
                            Verification Status
                        </label>

                        <select
                            id="daf-verified"
                        >

                            <option value="">
                                Select
                            </option>

                            <option value="Verified">
                                Verified
                            </option>

                            <option value="Not Verified">
                                Not Verified
                            </option>

                        </select>

                    </div>


                    <div class="daf-row">

                        <label>
                            Non-Bifurcated
                        </label>

                        <select
                            id="daf-non-bifurcated"
                        >

                            <option value="">
                                Select
                            </option>

                            <option value="Yes">
                                Yes
                            </option>

                            <option value="No">
                                No
                            </option>

                        </select>

                    </div>


                    <button
                        id="daf-continue"
                        type="button"
                        disabled
                    >
                        CONTINUE
                    </button>

                </div>

            </div>


            <button
                id="daf-arbit"
                type="button"
            >
                OPEN ARBIT ID
            </button>


            <div id="daf-status"></div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const nameInput=
        document.getElementById(
            "daf-name"
        );

    const stateInput=
        document.getElementById(
            "daf-state"
        );

    const duplicateInput=
        document.getElementById(
            "daf-duplicate"
        );

    const mismatchInput=
        document.getElementById(
            "daf-mismatch"
        );

    const goBtn=
        document.getElementById(
            "daf-go"
        );

    const closeBtn=
        document.getElementById(
            "daf-close"
        );

    const eligibleBox=
        document.getElementById(
            "daf-eligible"
        );

    const noBtn=
        document.getElementById(
            "daf-no"
        );

    const yesBtn=
        document.getElementById(
            "daf-yes"
        );

    const yesFields=
        document.getElementById(
            "daf-yes-fields"
        );

    const emailInput=
        document.getElementById(
            "daf-email"
        );

    const notesInput=
        document.getElementById(
            "daf-notes"
        );

    const planEvidenceInput=
        document.getElementById(
            "daf-plan-evidence"
        );

    const verifiedInput=
        document.getElementById(
            "daf-verified"
        );

    const nonBifurcatedInput=
        document.getElementById(
            "daf-non-bifurcated"
        );

    const continueBtn=
        document.getElementById(
            "daf-continue"
        );

    const arbitBtn=
        document.getElementById(
            "daf-arbit"
        );

    const status=
        document.getElementById(
            "daf-status"
        );


    /* =====================================================
       USER NAME
       ===================================================== */

    nameInput.value=
        getName();


    /* =====================================================
       ARBIT BUTTON
       ===================================================== */

    arbitBtn.onclick=()=>{

        openArbitIframe();

    };


    /* =====================================================
       YES VALIDATION
       ===================================================== */

    const updateContinue=()=>{

        const complete=
            !!emailInput.value.trim() &&
            !!notesInput.value.trim() &&
            !!planEvidenceInput.value &&
            !!verifiedInput.value &&
            !!nonBifurcatedInput.value;


        continueBtn.disabled=
            !complete;

    };


    emailInput.addEventListener(
        "input",
        updateContinue
    );

    notesInput.addEventListener(
        "input",
        updateContinue
    );

    planEvidenceInput.addEventListener(
        "change",
        updateContinue
    );

    verifiedInput.addEventListener(
        "change",
        updateContinue
    );

    nonBifurcatedInput.addEventListener(
        "change",
        updateContinue
    );


    /* =====================================================
       BUILD ONE ROW
       ===================================================== */

    const buildRow=(
        id,
        i,
        stateValue,
        duplicateComments,
        isYes,
        disputeUserName="",
        email="",
        verificationStatus="",
        arbitCaseNotes="",
        planTypeEvidence="",
        nonBifurcated="",
        plantypeMismatch=""
    )=>{

        const actualG=
            disputeStatus;


        const actualL=
            columnJValue;


        const actualR=
            getColumnRValue(
                actualG,
                actualL
            );


        /*
         * IMPORTANT:
         *
         * COLUMN F = ARBIT ID NUMBER
         *
         * The old row structure is preserved.
         * Only the value going into Column F is updated.
         */

        const row=[

            isYes
                ?email
                :"-",

            getPlanType(i),

            plantypeMismatch,

            duplicateComments,

            disputeNumber,

            arbitIdNumber,

            actualG,

            isYes
                ?disputeUserName
                :"-",

            isYes
                ?verificationStatus
                :"-",

            isYes
                ?arbitCaseNotes
                :"-",

            isYes
                ?planTypeEvidence
                :"-",

            actualL,

            "N/A",

            "N/A",

            stateValue,

            isYes
                ?nonBifurcated
                :"-",

            isYes
                ?"Yes"
                :"No",

            actualR

        ];


        if(row.length!==18){

            console.error(
                "ERROR: ROW DOES NOT HAVE 18 COLUMNS!",
                row,
                "Length:",
                row.length
            );

        }


        console.log(
            "FINAL 18-COLUMN ROW",
            row
        );


        console.log(
            "COLUMN F / ARBIT ID:",
            row[5]
        );


        return row.join("\t");

    };


    /* =====================================================
       BUILD OUTPUT
       ===================================================== */

    const buildOutput=(
        stateValue,
        duplicateComments,
        isYes,
        disputeUserName="",
        email="",
        verificationStatus="",
        arbitCaseNotes="",
        planTypeEvidence="",
        nonBifurcated="",
        plantypeMismatch=""
    )=>{

        const rows=
            sameId
            ?[
                buildRow(
                    ids[0],
                    0,
                    stateValue,
                    duplicateComments,
                    isYes,
                    disputeUserName,
                    email,
                    verificationStatus,
                    arbitCaseNotes,
                    planTypeEvidence,
                    nonBifurcated,
                    plantypeMismatch
                )
            ]
            :ids.map((id,i)=>
                buildRow(
                    id,
                    i,
                    stateValue,
                    duplicateComments,
                    isYes,
                    disputeUserName,
                    email,
                    verificationStatus,
                    arbitCaseNotes,
                    planTypeEvidence,
                    nonBifurcated,
                    plantypeMismatch
                )
            );


        const output=
            rows.join("\r\n");


        console.log(
            "FINAL COPY OUTPUT",
            output
        );


        return output;

    };


    /* =====================================================
       VALIDATE MAIN FORM
       ===================================================== */

    const validate=()=>{

        const username=
            nameInput.value.trim();


        if(!username){

            status.textContent=
                "Please enter your Dispute User Name.";

            nameInput.focus();

            return false;

        }


        if(!stateInput.value.trim()){

            status.textContent=
                "Enter a State.";

            stateInput.focus();

            return false;

        }


        if(!duplicateInput.value){

            status.textContent=
                "Please select Duplicate Dispute Comments.";

            duplicateInput.focus();

            return false;

        }


        if(!mismatchInput.value){

            status.textContent=
                "Please select Plantype Mismatch.";

            mismatchInput.focus();

            return false;

        }


        saveName(
            username
        );


        return true;

    };


    /* =====================================================
       GO
       ===================================================== */

    goBtn.onclick=()=>{

        if(!validate())
            return;


        stateInput.value=
            stateInput.value
                .trim()
                .toUpperCase();


        eligibleBox.style.display=
            "block";


        yesFields.style.display=
            "none";


        status.textContent=
            "Choose eligibility.";

    };


    /* =====================================================
       NO
       ===================================================== */

    noBtn.onclick=async()=>{

        const output=
            buildOutput(
                stateInput.value.trim().toUpperCase(),
                duplicateInput.value,
                false,
                nameInput.value.trim(),
                "",
                "",
                "",
                "",
                "",
                mismatchInput.value
            );


        const ok=
            await copyText(
                output
            );


        showCopyMessage(
            ok
                ?"Copied 18-column output."
                :"Copy failed.",
            output
        );


        status.textContent=
            ok
                ?"Output copied."
                :"Unable to copy output.";

    };


    /* =====================================================
       YES
       ===================================================== */

    yesBtn.onclick=()=>{

        yesFields.style.display=
            "block";


        updateContinue();

        emailInput.focus();

    };


    /* =====================================================
       CONTINUE
       ===================================================== */

    continueBtn.onclick=async()=>{

        if(continueBtn.disabled)
            return;


        const output=
            buildOutput(
                stateInput.value.trim().toUpperCase(),
                duplicateInput.value,
                true,
                nameInput.value.trim(),
                emailInput.value.trim(),
                verifiedInput.value,
                notesInput.value.trim(),
                planEvidenceInput.value,
                nonBifurcatedInput.value,
                mismatchInput.value
            );


        const ok=
            await copyText(
                output
            );


        showCopyMessage(
            ok
                ?"Copied 18-column output."
                :"Copy failed.",
            output
        );


        status.textContent=
            ok
                ?"Output copied."
                :"Unable to copy output.";

    };


    /* =====================================================
       CLOSE
       ===================================================== */

    closeBtn.onclick=()=>{

        overlay.remove();

        style.remove();

        resolve(null);

    };


    /* =====================================================
       START
       ===================================================== */

    nameInput.focus();

});


await popup();

})();
