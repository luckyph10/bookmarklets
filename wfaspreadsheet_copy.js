(async()=>{

/* =========================================================
   DISPUTE USER NAME + PROCESSOR NAME
   ========================================================= */

const KEY="disputeUserName";
const PROCESSOR_KEY="processorName";

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

const getProcessorName=()=>{
    try{
        return(localStorage.getItem(PROCESSOR_KEY)||"").trim();
    }catch(e){
        return"";
    }
};

const saveProcessorName=n=>{
    try{
        localStorage.setItem(PROCESSOR_KEY,n);
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
};

const getPHDate=()=>{

    const phDate=
        new Date(
            new Date().toLocaleString(
                "en-US",
                {
                    timeZone:"Asia/Manila"
                }
            )
        );

    return `${
        phDate.getMonth()+1
    }/${
        phDate.getDate()
    }/${
        phDate.getFullYear()
    }`;

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

const arbitIdLinks=[
    ...document.querySelectorAll(
        'a[title="Open Arbit"][href*="calculator/"]'
    )
];


/* =========================================================
   GET IDS
   ========================================================= */

const ids=[
    ...arbitIdLinks
]
.map(link=>{

    const td=
        link.closest("td");

    const value=
        (
            link.textContent||
            td?.textContent||
            ""
        )
        .replace(/\u00A0/g," ")
        .replace(/\r?\n/g," ")
        .replace(/\s+/g," ")
        .trim();

    return value;

})
.filter(Boolean);


/* =========================================================
   GET ALL ARBIT / APP ID LINKS
   ========================================================= */

const arbitLinks=[
    ...document.querySelectorAll(
        'a[title="Open Arbit"][href*="calculator/"]'
    )
]
.map((link,index)=>{

    const td=
        link.closest("td");

    const id=
        (
            link.textContent||
            td?.textContent||
            ""
        )
        .replace(/\u00A0/g," ")
        .replace(/\r?\n/g," ")
        .replace(/\s+/g," ")
        .trim()
        ||
        ids[index]
        ||
        "";

    return{
        id:id,
        href:link.href,
        index:index
    };

})
.filter(item=>item.id && item.href);


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
   ========================================================= */

const arbitIdNumber =
    document.querySelector(
        'a[title="Open Arbit"][href*="calculator/"]'
    )?.textContent
        ?.replace(/\u00A0/g," ")
        .replace(/\r?\n/g," ")
        .replace(/\s+/g," ")
        .trim() || "";


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
            ids,
            arbitLinks
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
    "IDS FOUND FROM OPEN ARBIT LINKS:",
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
        "https://luckyph10.github.io/feeling_pogi_yarn/vob_intelligence.js?" +
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
        "https://luckyph10.github.io/feeling_pogi_yarn/case_notes_puller.js?" +
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
   INSTALL VOB IFRAME HANDLERS
   ========================================================= */

const installVobIframeHandlers=iframe=>{

    const install=()=>{

        try{

            const win=
                iframe.contentWindow;


            const doc=
                iframe.contentDocument||
                win?.document;


            if(!win||!doc)
                return;


            if(
                !win.__disputeVobOpenPatched
            ){

                const originalOpen=
                    win.open.bind(win);


                win.open=function(
                    url,
                    target,
                    features
                ){

                    const value=
                        String(url||"");


                    if(value){

                        openVobViewer(
                            value
                        );

                        return null;

                    }


                    return originalOpen(
                        url,
                        target,
                        features
                    );

                };


                win.__disputeVobOpenPatched=
                    true;

            }


            if(
                !doc.__disputeVobClickHandler
            ){

                doc.addEventListener(
                    "click",
                    e=>{

                        const el=
                            e.target instanceof Element
                                ?e.target
                                :null;


                        if(!el)
                            return;


                        const link=
                            el.closest("a");


                        if(link){

                            const text=
                                (
                                    link.innerText||
                                    link.textContent||
                                    link.title||
                                    ""
                                )
                                .toLowerCase();


                            const href=
                                link.href||
                                link.getAttribute(
                                    "href"
                                )||
                                "";


                            const isVob=
                                /vob/.test(text)||
                                /vob/.test(
                                    String(
                                        link.className||
                                        ""
                                    ).toLowerCase()
                                );


                            const isFile=
                                /\.(pdf|docx?|xlsx?|csv|txt|png|jpe?g|gif|tiff?|bmp|webp)(?:[?#]|$)/i
                                    .test(href);


                            const opensOutside=
                                link.target==="_blank"||
                                link.target==="_new";


                            if(
                                (
                                    isVob||
                                    (
                                        opensOutside&&
                                        isFile
                                    )
                                )&&
                                href
                            ){

                                e.preventDefault();
                                e.stopPropagation();


                                openVobViewer(
                                    href
                                );


                                return;

                            }

                        }

                    },
                    true
                );


                doc.__disputeVobClickHandler=
                    true;

            }

        }catch(e){

            console.warn(
                "Unable to install iframe VOB handlers:",
                e
            );

        }

    };


    iframe.addEventListener(
        "load",
        install,
        {
            passive:true
        }
    );


    try{

        if(
            iframe.contentDocument?.readyState===
            "complete"
        ){

            install();

        }

    }catch(e){}

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


    let appLinks=[
        ...uniqueArbitLinks
    ];


    if(!appLinks.length){

        const fallbackLink=
            document.querySelector(
                'a[title="Open Arbit"][href*="calculator/"]'
            );


        if(fallbackLink){

            appLinks=[
                {
                    id:
                        fallbackLink.textContent
                            ?.replace(/\u00A0/g," ")
                            .replace(/\r?\n/g," ")
                            .replace(/\s+/g," ")
                            .trim()||
                        arbitIdNumber||
                        "UNKNOWN",

                    href:
                        fallbackLink.href,

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


    overlay.dataset.minimized=
        "false";


    overlay.innerHTML=`

        <div id="arbit-iframe-window">

            <div id="arbit-iframe-header">

                <div id="arbit-iframe-left">

                    <div id="arbit-iframe-title">

                        ARBIT ID:

                        <span id="arbit-iframe-number">
                            ${String(currentApp.id||"UNKNOWN")
                                .replace(/&/g,"&amp;")
                                .replace(/</g,"&lt;")
                                .replace(/>/g,"&gt;")
                                .replace(/"/g,"&quot;")}
                        </span>

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
                                        ${String(item.id||"UNKNOWN")
                                            .replace(/&/g,"&amp;")
                                            .replace(/</g,"&lt;")
                                            .replace(/>/g,"&gt;")
                                            .replace(/"/g,"&quot;")}
                                    </option>

                                `).join("")}

                            </select>


                            <button
                                id="arbit-app-open"
                                type="button"
                                style="display:none"
                            >
                                OPEN
                            </button>

                        </div>

                        `
                        :""
                    }

                </div>


                <div id="arbit-iframe-actions">

                    <button
                        id="arbit-rush-verify"
                        type="button"
                    >
                        RUSH VERIFY
                    </button>


                    <button
                        id="arbit-pull-evidence"
                        type="button"
                    >
                        Pull Case/History Evidence
                    </button>


                    <button
                        id="arbit-iframe-minimize"
                        type="button"
                        aria-label="Minimize ARBIT ID"
                        title="Minimize"
                    >
                        −
                    </button>


                    <button
                        id="arbit-iframe-close"
                        type="button"
                        aria-label="Close ARBIT ID"
                        title="Close"
                    >
                        ×
                    </button>

                </div>

            </div>


            <iframe
                id="arbit-iframe"
                src="${String(currentApp.href).replace(/"/g,"&quot;")}"
                frameborder="0"
                allowfullscreen
            ></iframe>

        </div>

    `;


    const iframeStyle=
        document.createElement("style");


    iframeStyle.id=
        "arbit-iframe-style";


    iframeStyle.textContent=`

        #arbit-iframe-overlay{
            position:fixed!important;
            inset:0!important;
            width:100vw!important;
            height:100vh!important;
            background:rgba(0,0,0,.80)!important;
            backdrop-filter:blur(6px)!important;
            -webkit-backdrop-filter:blur(6px)!important;
            z-index:2147483647!important;
            display:flex!important;
            align-items:center!important;
            justify-content:center!important;
            padding:8px!important;
            box-sizing:border-box!important;
            isolation:isolate!important;
        }

        #arbit-iframe-window{
            position:relative!important;
            z-index:2147483647!important;
            width:98vw!important;
            height:96vh!important;
            max-width:1900px!important;
            background:#111!important;
            border:2px solid rgba(255,255,255,.22)!important;
            border-radius:14px!important;
            overflow:hidden!important;
            box-shadow:0 25px 90px rgba(0,0,0,.85)!important;
            display:flex!important;
            flex-direction:column!important;
        }

        #arbit-iframe-header{
            position:relative!important;
            z-index:3!important;
            height:54px!important;
            min-height:54px!important;
            background:#151515!important;
            border-bottom:1px solid rgba(255,255,255,.18)!important;
            display:flex!important;
            align-items:center!important;
            justify-content:space-between!important;
            gap:10px!important;
            padding:0 10px 0 16px!important;
            box-sizing:border-box!important;
        }

        #arbit-iframe-left{
            display:flex!important;
            align-items:center!important;
            gap:10px!important;
            min-width:0!important;
            flex:1!important;
        }

        #arbit-iframe-title{
            color:#fff!important;
            font-family:Arial,sans-serif!important;
            font-size:14px!important;
            font-weight:800!important;
            letter-spacing:.3px!important;
            white-space:nowrap!important;
            display:flex!important;
            align-items:center!important;
            gap:4px!important;
            flex-shrink:0!important;
        }

        #arbit-iframe-number{
            color:#facc15!important;
            font-weight:900!important;
            margin-left:2px!important;
            text-shadow:0 1px 4px rgba(0,0,0,.4)!important;
        }

        #arbit-app-selector-wrap{
            display:flex!important;
            align-items:center!important;
            gap:6px!important;
            min-width:0!important;
        }

        #arbit-app-selector{
            height:38px!important;
            min-width:150px!important;
            max-width:260px!important;
            padding:0 32px 0 11px!important;
            border:1px solid rgba(255,255,255,.25)!important;
            border-radius:8px!important;
            background:#222!important;
            color:#fff!important;
            font-family:Arial,sans-serif!important;
            font-size:12px!important;
            font-weight:700!important;
            outline:none!important;
            cursor:pointer!important;
            box-sizing:border-box!important;
        }

        #arbit-app-selector:hover{
            border-color:rgba(255,255,255,.45)!important;
        }

        #arbit-app-selector:focus{
            border-color:#facc15!important;
            box-shadow:0 0 0 3px rgba(250,204,21,.12)!important;
        }

        #arbit-app-selector option{
            background:#222!important;
            color:#fff!important;
        }

        #arbit-app-open{
            height:38px!important;
            padding:0 14px!important;
            border:1px solid rgba(255,255,255,.2)!important;
            border-radius:8px!important;
            background:#f59e0b!important;
            color:#111!important;
            font-family:Arial,sans-serif!important;
            font-size:12px!important;
            font-weight:900!important;
            letter-spacing:.3px!important;
            cursor:pointer!important;
            white-space:nowrap!important;
            box-shadow:0 4px 14px rgba(0,0,0,.3)!important;
        }

        #arbit-app-open:hover{
            background:#fbbf24!important;
            transform:translateY(-1px)!important;
        }

        #arbit-app-open:active{
            transform:translateY(0)!important;
        }

        #arbit-iframe-actions{
            display:flex!important;
            align-items:center!important;
            justify-content:flex-end!important;
            gap:8px!important;
            flex-wrap:nowrap!important;
            flex-shrink:0!important;
        }

        #arbit-rush-verify{
            height:38px!important;
            padding:0 16px!important;
            border:1px solid rgba(255,255,255,.2)!important;
            border-radius:8px!important;
            background:#16a34a!important;
            color:#fff!important;
            font-family:Arial,sans-serif!important;
            font-size:12px!important;
            font-weight:800!important;
            letter-spacing:.35px!important;
            cursor:pointer!important;
            white-space:nowrap!important;
            box-shadow:0 4px 14px rgba(0,0,0,.3)!important;
        }

        #arbit-rush-verify:hover{
            background:#22c55e!important;
            box-shadow:0 5px 18px rgba(34,197,94,.4)!important;
        }

        #arbit-pull-evidence{
            height:38px!important;
            padding:0 16px!important;
            border:1px solid rgba(255,255,255,.2)!important;
            border-radius:8px!important;
            background:#2563eb!important;
            color:#fff!important;
            font-family:Arial,sans-serif!important;
            font-size:12px!important;
            font-weight:800!important;
            letter-spacing:.2px!important;
            cursor:pointer!important;
            white-space:nowrap!important;
            box-shadow:0 4px 14px rgba(0,0,0,.3)!important;
        }

        #arbit-pull-evidence:hover{
            background:#3b82f6!important;
            box-shadow:0 5px 18px rgba(59,130,246,.4)!important;
        }

        #arbit-iframe-minimize{
            width:38px!important;
            height:38px!important;
            border:0!important;
            border-radius:50%!important;
            background:rgba(250,204,21,.18)!important;
            color:#facc15!important;
            font-size:25px!important;
            font-weight:900!important;
            line-height:1!important;
            cursor:pointer!important;
            display:flex!important;
            align-items:center!important;
            justify-content:center!important;
            flex-shrink:0!important;
            padding:0!important;
        }

        #arbit-iframe-minimize:hover{
            background:rgba(250,204,21,.32)!important;
        }

        #arbit-iframe-close{
            width:38px!important;
            height:38px!important;
            border:0!important;
            border-radius:50%!important;
            background:#dc2626!important;
            color:#fff!important;
            font-size:27px!important;
            line-height:1!important;
            cursor:pointer!important;
            display:flex!important;
            align-items:center!important;
            justify-content:center!important;
            flex-shrink:0!important;
            padding:0!important;
        }

        #arbit-iframe-close:hover{
            background:#ef4444!important;
        }

        #arbit-iframe{
            position:relative!important;
            z-index:1!important;
            width:100%!important;
            height:calc(100% - 54px)!important;
            flex:1!important;
            border:0!important;
            background:#fff!important;
        }

        #vob-file-viewer-overlay{
            position:fixed!important;
            inset:0!important;
            width:100vw!important;
            height:100vh!important;
            background:rgba(0,0,0,.84)!important;
            backdrop-filter:blur(6px)!important;
            -webkit-backdrop-filter:blur(6px)!important;
            z-index:2147483647!important;
            display:flex!important;
            align-items:center!important;
            justify-content:center!important;
            padding:10px!important;
            box-sizing:border-box!important;
            isolation:isolate!important;
        }

        #vob-file-viewer-window{
            width:96vw!important;
            height:94vh!important;
            max-width:1800px!important;
            background:#111!important;
            border:1px solid rgba(255,255,255,.25)!important;
            border-radius:14px!important;
            overflow:hidden!important;
            box-shadow:0 25px 100px rgba(0,0,0,.9)!important;
            display:flex!important;
            flex-direction:column!important;
        }

        #vob-file-viewer-header{
            height:48px!important;
            min-height:48px!important;
            background:#151515!important;
            border-bottom:1px solid rgba(255,255,255,.18)!important;
            display:flex!important;
            align-items:center!important;
            justify-content:space-between!important;
            padding:0 10px 0 16px!important;
        }

        #vob-file-viewer-title{
            color:#fff!important;
            font:800 13px Arial,sans-serif!important;
        }

        #vob-file-viewer-close{
            width:36px!important;
            height:36px!important;
            border:0!important;
            border-radius:50%!important;
            background:rgba(255,255,255,.08)!important;
            color:#fff!important;
            font-size:26px!important;
            cursor:pointer!important;
        }

        #vob-file-viewer-close:hover{
            background:rgba(220,40,40,.95)!important;
        }

        #vob-file-viewer-frame{
            width:100%!important;
            height:calc(100% - 48px)!important;
            flex:1!important;
            border:0!important;
            background:#fff!important;
        }

        @media(max-width:1250px){

            #arbit-iframe-header{
                gap:5px!important;
            }

            #arbit-iframe-left{
                gap:6px!important;
            }

            #arbit-app-selector{
                min-width:125px!important;
                max-width:180px!important;
            }

            #arbit-rush-verify,
            #arbit-pull-evidence{
                padding:0 10px!important;
                font-size:10px!important;
            }

        }

        @media(max-width:950px){

            #arbit-iframe-title{
                font-size:12px!important;
            }

            #arbit-app-selector{
                min-width:110px!important;
                max-width:145px!important;
            }

            #arbit-app-open{
                padding:0 10px!important;
            }

            #arbit-rush-verify,
            #arbit-pull-evidence{
                padding:0 7px!important;
                font-size:9px!important;
            }

        }

        @media(max-width:700px){

            #arbit-iframe-overlay{
                padding:4px!important;
            }

            #arbit-iframe-window{
                width:100vw!important;
                height:98vh!important;
                border-radius:10px!important;
            }

            #arbit-iframe-header{
                padding-left:8px!important;
                gap:4px!important;
            }

            #arbit-iframe-left{
                gap:4px!important;
            }

            #arbit-iframe-title{
                font-size:10px!important;
            }

            #arbit-iframe-number{
                font-size:10px!important;
            }

            #arbit-app-selector{
                min-width:85px!important;
                max-width:120px!important;
                height:34px!important;
                font-size:9px!important;
            }

            #arbit-app-open{
                height:34px!important;
                padding:0 8px!important;
                font-size:9px!important;
            }

            #arbit-rush-verify,
            #arbit-pull-evidence{
                height:34px!important;
                padding:0 5px!important;
                font-size:8px!important;
            }

            #arbit-iframe-minimize,
            #arbit-iframe-close{
                width:34px!important;
                height:34px!important;
            }

        }

    `;


    document.head.appendChild(
        iframeStyle
    );


    document.body.appendChild(
        overlay
    );


    const iframe=
        document.getElementById(
            "arbit-iframe"
        );


    const rushBtn=
        document.getElementById(
            "arbit-rush-verify"
        );


    const pullEvidenceBtn=
        document.getElementById(
            "arbit-pull-evidence"
        );


    const minimizeBtn=
        document.getElementById(
            "arbit-iframe-minimize"
        );


    const closeBtn=
        document.getElementById(
            "arbit-iframe-close"
        );


    const iframeNumberElement=
        document.getElementById(
            "arbit-iframe-number"
        );


    const appSelector=
        document.getElementById(
            "arbit-app-selector"
        );


    const appOpenBtn=
        document.getElementById(
            "arbit-app-open"
        );


    const updateCurrentIdDisplay=()=>{

        if(!iframeNumberElement)
            return;


        iframeNumberElement.textContent=
            currentApp?.id||
            "UNKNOWN";

    };


    if(appSelector){

        appSelector.addEventListener(
            "change",
            ()=>{

                const selectedIndex=
                    Number(
                        appSelector.value
                    );


                if(
                    !Number.isInteger(
                        selectedIndex
                    )||
                    !appLinks[selectedIndex]
                ){

                    return;

                }


                if(
                    selectedIndex===
                    currentAppIndex
                ){

                    if(appOpenBtn)
                        appOpenBtn.style.display=
                            "none";

                }else{

                    if(appOpenBtn)
                        appOpenBtn.style.display=
                            "inline-flex";

                }

            }

        );

    }


    if(appOpenBtn){

        appOpenBtn.addEventListener(
            "click",
            ()=>{

                if(!appSelector)
                    return;


                const selectedIndex=
                    Number(
                        appSelector.value
                    );


                if(
                    !Number.isInteger(
                        selectedIndex
                    )||
                    !appLinks[selectedIndex]
                ){

                    return;

                }


                if(
                    selectedIndex===
                    currentAppIndex
                ){

                    appOpenBtn.style.display=
                        "none";

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


                appOpenBtn.style.display=
                    "none";


                appSelector.value=
                    String(
                        currentAppIndex
                    );

            }

        );

    }


    updateCurrentIdDisplay();


    try{

        overlay.style.setProperty(
            "z-index",
            "2147483647",
            "important"
        );

        overlay.style.setProperty(
            "position",
            "fixed",
            "important"
        );

        overlay.style.setProperty(
            "inset",
            "0",
            "important"
        );

        overlay.style.setProperty(
            "isolation",
            "isolate",
            "important"
        );

    }catch(e){

        console.warn(
            "Could not force iframe stacking:",
            e
        );

    }


    rushBtn.onclick=()=>{

        runRushVerify(
            iframe
        );

    };


    pullEvidenceBtn.onclick=()=>{

        runPullEvidence(
            iframe
        );

    };


    installVobIframeHandlers(
        iframe
    );


    const minimizeIframe=()=>{

        overlay.dataset.minimized=
            "true";


        overlay.style.setProperty(
            "display",
            "none",
            "important"
        );

    };


    minimizeBtn.onclick=
        minimizeIframe;


    const closeIframe=()=>{

        const vobViewer=
            document.getElementById(
                "vob-file-viewer-overlay"
            );


        if(vobViewer)
            vobViewer.remove();


        overlay.remove();
        iframeStyle.remove();

    };


    closeBtn.onclick=
        closeIframe;


    overlay.addEventListener(
        "mousedown",
        e=>{

            if(
                e.target===overlay
            ){

                closeIframe();

            }

        }
    );


    overlay.addEventListener(
        "keydown",
        e=>{

            if(
                e.key==="Escape"
            ){

                e.preventDefault();


                const vobViewer=
                    document.getElementById(
                        "vob-file-viewer-overlay"
                    );


                if(vobViewer){

                    vobViewer.remove();

                }else{

                    closeIframe();

                }

            }

        },
        true
    );


    setTimeout(()=>{

        try{

            closeBtn.focus();

        }catch(e){}

    },50);

};


/* =========================================================
   MAIN DISPUTE POPUP
   ========================================================= */

const popup=()=>new Promise(resolve=>{

    const old=
        document.getElementById(
            "dispute-popup-overlay"
        );


    if(old)
        old.remove();


    const overlay=
        document.createElement("div");


    overlay.id=
        "dispute-popup-overlay";


    overlay.innerHTML=`

        <div id="dispute-popup">

            <button id="dp-close">
                ×
            </button>


            <div id="dp-title-row">

                <div id="dp-title">
                    Dispute Information
                </div>


                <button
                    id="dp-arbit-id"
                    type="button"
                >
                    ARBIT ID
                </button>

            </div>


            <div id="dp-label-processor">
                Processor Name
            </div>


            <div id="dp-processor-row">

                <input
                    id="dp-processor"
                    type="text"
                    placeholder="Enter Processor Name"
                    autocomplete="off"
                >

            </div>


            <div id="dp-label-name">
                Dispute User Name
            </div>


            <div id="dp-name-row">

                <input
                    id="dp-name"
                    type="text"
                    placeholder="Enter Dispute User Name"
                    autocomplete="off"
                >


                <button id="dp-edit">
                    Edit
                </button>


                <span id="dp-saved">
                    Saved ✓
                </span>


                <button id="dp-save">
                    Save
                </button>

            </div>


            <div id="dp-label-state">
                State + Duplicate Comments
            </div>


            <div id="dp-state-row">

                <input
                    id="dp-state"
                    type="text"
                    placeholder="Enter State"
                    autocomplete="off"
                >


                <select id="dp-duplicate-comments">

                    <option
                        value=""
                        selected
                        disabled
                    >
                        Select Duplicate Dispute Comments
                    </option>


                    <option value="Duplicate Dispute Reviewed">
                        Duplicate Dispute Reviewed
                    </option>


                    <option value="N/A">
                        N/A
                    </option>

                </select>

            </div>


            <div id="dp-label-mismatch">
                Plantype Mismatch
            </div>


            <select id="dp-mismatch">

                <option
                    value=""
                    selected
                    disabled
                >
                    Select Yes or No
                </option>


                <option value="Yes">
                    Yes
                </option>


                <option value="No">
                    No
                </option>

            </select>


            <button id="dp-go">
                Go
            </button>


            <div id="dp-status"></div>


            <div
                id="dp-eligible"
                style="display:none"
            >

                <div id="dp-eligible-title">
                    Eligible updated today?
                </div>


                <div id="dp-eligible-buttons">

                    <button id="dp-no">
                        NO
                    </button>


                    <button id="dp-yes">
                        YES
                    </button>

                </div>


                <div
                    id="dp-yes-extra"
                    style="display:none"
                >

                    <div id="dp-label-email">
                        PLANTYPE_IDRE_EMAIL
                    </div>


                    <input
                        id="dp-email"
                        type="text"
                        placeholder="Enter PLANTYPE_IDRE_EMAIL"
                        autocomplete="off"
                    >


                    <div id="dp-label-arbit-notes">
                        Arbit Case Notes
                    </div>


                    <input
                        id="dp-arbit-notes"
                        type="text"
                        placeholder="Enter Arbit Case Notes"
                        autocomplete="off"
                    >


                    <div id="dp-label-plan-evidence">
                        Plan Type Evidence?
                    </div>


                    <select id="dp-plan-evidence">

                        <option
                            value=""
                            selected
                            disabled
                        >
                            Select Plan Type Evidence
                        </option>


                        <option value="Yes - VOB">
                            Yes - VOB
                        </option>


                        <option value="Yes - VOB Team">
                            Yes - VOB Team
                        </option>


                        <option value="Yes - Insurance Card">
                            Yes - Insurance Card
                        </option>


                        <option value="Yes - State Authority">
                            Yes - State Authority
                        </option>


                        <option value="Yes - EOB">
                            Yes - EOB
                        </option>

                    </select>


                    <div id="dp-label-verified">
                        Verified?
                    </div>


                    <select id="dp-verified">

                        <option value="">
                            Select Yes or No
                        </option>


                        <option value="Yes">
                            Yes
                        </option>


                        <option value="No">
                            No
                        </option>

                    </select>


                    <div id="dp-label-non-bifurcated">
                        Non-Bifurcated state/Federal.
                    </div>


                    <select id="dp-non-bifurcated">

                        <option
                            value=""
                            selected
                            disabled
                        >
                            Select N/A or Yes
                        </option>


                        <option value="N/A">
                            N/A
                        </option>


                        <option value="Yes">
                            Yes
                        </option>

                    </select>


                    <button
                        id="dp-continue"
                        disabled
                    >
                        Continue
                    </button>

                </div>

            </div>

        </div>

    `;


/* =========================================================
   STYLE
   ========================================================= */

const style=
    document.createElement("style");


style.id=
    "dispute-popup-style";


style.textContent=`

    #dispute-popup-overlay{
        position:fixed;
        inset:0;
        width:100%;
        height:100%;
        z-index:2147483646;
        pointer-events:none;
        isolation:isolate;
    }


    #dispute-popup{
        pointer-events:auto;
        position:absolute;
        top:20px;
        left:50%;
        transform:translateX(-50%);
        width:620px;
        max-width:calc(100vw - 30px);
        max-height:calc(100vh - 40px);
        overflow-y:auto;
        padding:24px;
        border-radius:18px;
        background:rgba(0,0,0,.78);
        border:1px solid rgba(255,255,255,.18);
        box-shadow:0 15px 45px rgba(0,0,0,.45);
        backdrop-filter:blur(14px);
        -webkit-backdrop-filter:blur(14px);
        font-family:Arial,sans-serif;
        color:#fff;
        box-sizing:border-box;
    }


    #dp-title-row{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-bottom:20px;
        padding-right:34px;
    }


    #dp-title{
        font-size:20px;
        font-weight:700;
        margin:0;
    }


    #dp-arbit-id{
        height:38px;
        padding:0 16px;
        border:1px solid rgba(255,255,255,.25);
        border-radius:9px;
        background:#d92828;
        color:#fff;
        font-size:13px;
        font-weight:800;
        letter-spacing:.4px;
        cursor:pointer;
        white-space:nowrap;
        box-shadow:0 4px 12px rgba(0,0,0,.3);
    }


    #dp-arbit-id:hover{
        background:#ef3333;
        transform:translateY(-1px);
    }


    #dp-close{
        position:absolute;
        top:8px;
        right:10px;
        width:34px;
        height:34px;
        border:0;
        border-radius:50%;
        background:transparent;
        color:#fff;
        font-size:27px;
        cursor:pointer;
    }


    #dp-close:hover{
        background:rgba(255,255,255,.14);
    }


    #dp-label-processor,
    #dp-label-name,
    #dp-label-state,
    #dp-label-mismatch,
    #dp-label-email,
    #dp-label-arbit-notes,
    #dp-label-plan-evidence,
    #dp-label-verified,
    #dp-label-non-bifurcated{

        font-size:13px;
        font-weight:600;
        color:rgba(255,255,255,.9);
        margin:10px 0 7px;

    }


    #dp-label-processor{
        margin-top:0;
    }


    #dp-processor-row,
    #dp-name-row,
    #dp-state-row{
        display:flex;
        gap:8px;
        width:100%;
        align-items:center;
    }


    #dp-processor,
    #dp-name,
    #dp-state,
    #dp-email,
    #dp-arbit-notes,
    #dp-mismatch,
    #dp-plan-evidence,
    #dp-verified,
    #dp-non-bifurcated,
    #dp-duplicate-comments{

        height:42px;
        box-sizing:border-box;
        border:1px solid rgba(255,255,255,.25);
        border-radius:10px;
        background:rgba(255,255,255,.09);
        color:#fff;
        outline:none;
        padding:0 12px;
        font-size:14px;

    }


    #dp-processor,
    #dp-name,
    #dp-state{
        flex:1;
        min-width:0;
    }


    #dp-duplicate-comments{
        width:220px;
        flex-shrink:0;
        cursor:pointer;
    }


    #dp-mismatch,
    #dp-email,
    #dp-arbit-notes,
    #dp-plan-evidence,
    #dp-verified,
    #dp-non-bifurcated{
        width:100%;
    }


    #dp-mismatch,
    #dp-plan-evidence,
    #dp-verified,
    #dp-non-bifurcated{
        cursor:pointer;
    }


    #dp-mismatch option,
    #dp-plan-evidence option,
    #dp-verified option,
    #dp-non-bifurcated option,
    #dp-duplicate-comments option{
        background:#222;
        color:#fff;
    }


    #dp-processor::placeholder,
    #dp-name::placeholder,
    #dp-state::placeholder,
    #dp-email::placeholder,
    #dp-arbit-notes::placeholder{
        color:rgba(255,255,255,.5);
    }


    #dp-processor:focus,
    #dp-name:focus,
    #dp-state:focus,
    #dp-email:focus,
    #dp-arbit-notes:focus,
    #dp-mismatch:focus,
    #dp-plan-evidence:focus,
    #dp-verified:focus,
    #dp-non-bifurcated:focus,
    #dp-duplicate-comments:focus{

        border-color:rgba(255,255,255,.65);

        box-shadow:
            0 0 0 3px
            rgba(255,255,255,.08);

    }


    #dp-edit,
    #dp-save,
    #dp-go{

        height:42px;

        padding:
            0 15px;

        border:
            1px solid
            rgba(255,255,255,.25);

        border-radius:10px;

        background:
            rgba(255,255,255,.14);

        color:#fff;

        font-weight:700;

        font-size:14px;

        cursor:pointer;

        white-space:nowrap;

    }


    #dp-edit:hover,
    #dp-save:hover{

        background:
            rgba(255,255,255,.24);

    }


    #dp-go{

        width:100%;

        margin-top:10px;

        background:
            rgba(35,150,70,.9);

        border-color:
            rgba(35,150,70,.65);

    }


    #dp-go:hover{

        background:
            rgba(45,175,80,.98);

    }


    #dp-save{

        display:none;

    }


    #dp-saved{

        display:none;

        height:42px;

        padding:
            0 12px;

        border-radius:10px;

        background:
            rgba(35,140,65,.8);

        color:#fff;

        font-weight:700;

        font-size:13px;

        align-items:center;

        justify-content:center;

        white-space:nowrap;

    }


    #dp-status{

        margin-top:9px;

        font-size:12px;

        color:
            rgba(255,255,255,.65);

        min-height:16px;

    }


    #dp-eligible{

        margin-top:16px;

        padding-top:14px;

        border-top:
            1px solid
            rgba(255,255,255,.14);

    }


    #dp-eligible-title{

        font-size:13px;

        font-weight:600;

        margin-bottom:9px;

    }


    #dp-eligible-buttons{

        display:flex;

        gap:8px;

    }


    #dp-no,
    #dp-yes{

        flex:1;

        height:42px;

        border-radius:10px;

        border:
            1px solid
            rgba(255,255,255,.2);

        color:#fff;

        font-size:14px;

        font-weight:700;

        cursor:pointer;

    }


    #dp-no{

        background:
            rgba(190,35,35,.88);

    }


    #dp-no:hover{

        background:
            rgba(220,45,45,.95);

    }


    #dp-yes{

        background:
            rgba(30,95,190,.9);

    }


    #dp-yes:hover{

        background:
            rgba(40,115,220,.98);

    }


    #dp-yes-extra{

        margin-top:14px;

        padding-top:14px;

        border-top:
            1px solid
            rgba(255,255,255,.14);

    }


    #dp-continue{

        width:100%;

        height:42px;

        margin-top:10px;

        border-radius:10px;

        border:
            1px solid
            rgba(35,140,65,.45);

        background:
            rgba(35,150,70,.9);

        color:#fff;

        font-size:14px;

        font-weight:700;

        cursor:pointer;

    }


    #dp-continue:hover:not(:disabled){

        background:
            rgba(45,175,80,.98);

    }


    #dp-continue:disabled{

        background:
            rgba(100,100,100,.45);

        border-color:
            rgba(255,255,255,.12);

        color:
            rgba(255,255,255,.45);

        cursor:not-allowed;

        opacity:.65;

    }


    @media(max-width:650px){

        #dp-title-row{

            padding-right:34px;

        }


        #dp-title{

            font-size:18px;

        }


        #dp-arbit-id{

            padding:
                0 11px;

            font-size:
                12px;

        }


        #dp-state-row{

            flex-wrap:wrap;

        }


        #dp-state{

            width:100%;

            flex:none;

        }


        #dp-duplicate-comments{

            width:100%;

        }

    }

`;


document.head.appendChild(
    style
);


document.body.appendChild(
    overlay
);


/* =====================================================
   ELEMENTS
   ===================================================== */

const processorInput=
    document.getElementById(
        "dp-processor"
    );

const nameInput=
    document.getElementById("dp-name");

const stateInput=
    document.getElementById("dp-state");

const duplicateCommentsInput=
    document.getElementById(
        "dp-duplicate-comments"
    );

const mismatchInput=
    document.getElementById(
        "dp-mismatch"
    );

const editBtn=
    document.getElementById("dp-edit");

const saveBtn=
    document.getElementById("dp-save");

const savedLabel=
    document.getElementById("dp-saved");

const goBtn=
    document.getElementById("dp-go");

const closeBtn=
    document.getElementById("dp-close");

const status=
    document.getElementById("dp-status");

const eligible=
    document.getElementById("dp-eligible");

const noBtn=
    document.getElementById("dp-no");

const yesBtn=
    document.getElementById("dp-yes");

const yesExtra=
    document.getElementById("dp-yes-extra");

const emailInput=
    document.getElementById("dp-email");

const arbitNotesInput=
    document.getElementById(
        "dp-arbit-notes"
    );

const planEvidenceInput=
    document.getElementById(
        "dp-plan-evidence"
    );

const verifiedInput=
    document.getElementById(
        "dp-verified"
    );

const nonBifurcatedInput=
    document.getElementById(
        "dp-non-bifurcated"
    );

const continueBtn=
    document.getElementById(
        "dp-continue"
    );

const arbitIdBtn=
    document.getElementById(
        "dp-arbit-id"
    );


/* =====================================================
   ARBIT ID BUTTON
   ===================================================== */

arbitIdBtn.onclick=()=>{

    openArbitIframe();

};


/* =====================================================
   USER NAME + PROCESSOR NAME
   ===================================================== */

let currentName=
    getName();

let currentProcessorName=
    getProcessorName();


processorInput.value=
    currentProcessorName;

nameInput.value=
    currentName;


/* =====================================================
   INITIAL LOCK STATE
   ===================================================== */

if(
    currentName &&
    currentProcessorName
){

    processorInput.readOnly=true;
    nameInput.readOnly=true;

    editBtn.style.display=
        "inline-block";

    saveBtn.style.display=
        "none";

    savedLabel.style.display=
        "inline-flex";

    status.textContent=
        "Saved Processor Name and Dispute User Name.";

}else{

    processorInput.readOnly=false;
    nameInput.readOnly=false;

    editBtn.style.display=
        "none";

    saveBtn.style.display=
        "inline-block";

    savedLabel.style.display=
        "none";


    if(!currentProcessorName){

        status.textContent=
            "Please enter and save your Processor Name and Dispute User Name.";

        processorInput.focus();

    }else{

        status.textContent=
            "Please enter and save your Dispute User Name.";

        nameInput.focus();

    }

}


/* =====================================================
   EDIT
   ===================================================== */

editBtn.onclick=()=>{

    processorInput.readOnly=false;
    nameInput.readOnly=false;

    processorInput.focus();

    processorInput.select();

    editBtn.style.display=
        "none";

    saveBtn.style.display=
        "inline-block";

    savedLabel.style.display=
        "none";

    status.textContent=
        "Editing Processor Name and Dispute User Name...";

};


/* =====================================================
   SAVE
   ===================================================== */

saveBtn.onclick=()=>{

    const processor=
        processorInput.value.trim();

    const n=
        nameInput.value.trim();


    if(!processor){

        status.textContent=
            "Enter a Processor Name first.";

        processorInput.focus();

        return;

    }


    if(!n){

        status.textContent=
            "Enter a Dispute User Name first.";

        nameInput.focus();

        return;

    }


    if(!saveProcessorName(processor)){

        status.textContent=
            "Could not save the Processor Name.";

        return;

    }


    if(!saveName(n)){

        status.textContent=
            "Could not save the username.";

        return;

    }


    currentProcessorName=
        processor;

    currentName=
        n;


    processorInput.value=
        processor;

    nameInput.value=
        n;


    processorInput.readOnly=true;
    nameInput.readOnly=true;

    editBtn.style.display=
        "inline-block";

    saveBtn.style.display=
        "none";

    savedLabel.style.display=
        "inline-flex";

    status.textContent=
        "Processor Name and Dispute User Name saved.";

    stateInput.focus();

};


/* =====================================================
   VALIDATE MAIN FORM
   ===================================================== */

const validate=()=>{

    if(!currentProcessorName){

        status.textContent=
            "Please save your Processor Name first.";

        processorInput.focus();

        return false;

    }


    if(!currentName){

        status.textContent=
            "Please save your Dispute User Name first.";

        nameInput.focus();

        return false;

    }


    if(!stateInput.value.trim()){

        status.textContent=
            "Enter a State.";

        stateInput.focus();

        return false;

    }


    if(!duplicateCommentsInput.value){

        status.textContent=
            "Please select Duplicate Dispute Comments.";

        duplicateCommentsInput.focus();

        return false;

    }


    if(!mismatchInput.value){

        status.textContent=
            "Please select Plantype Mismatch: Yes or No.";

        mismatchInput.focus();

        return false;

    }


    return true;

};


/* =====================================================
   VALIDATE YES FORM
   ===================================================== */

const validateYesFields=()=>{

    const email=
        emailInput.value.trim();

    const arbitNotes=
        arbitNotesInput.value.trim();

    const planEvidence=
        planEvidenceInput.value;

    const verificationStatus=
        verifiedInput.value;

    const nonBifurcated=
        nonBifurcatedInput.value;


    return(
        !!email &&
        !!arbitNotes &&
        !!planEvidence &&
        !!verificationStatus &&
        !!nonBifurcated
    );

};


/* =====================================================
   UPDATE CONTINUE
   ===================================================== */

const updateContinueButton=()=>{

    const complete=
        validateYesFields();


    continueBtn.disabled=
        !complete;


    if(complete){

        continueBtn.title=
            "All required fields are complete.";

    }else{

        continueBtn.title=
            "Complete all required fields before continuing.";

    }

};


/* =====================================================
   YES FIELD LISTENERS
   ===================================================== */

emailInput.addEventListener(
    "input",
    updateContinueButton
);

arbitNotesInput.addEventListener(
    "input",
    updateContinueButton
);

planEvidenceInput.addEventListener(
    "change",
    updateContinueButton
);

verifiedInput.addEventListener(
    "change",
    updateContinueButton
);

nonBifurcatedInput.addEventListener(
    "change",
    updateContinueButton
);


/* =====================================================
   GO
   ===================================================== */

const processGo=()=>{

    if(!validate())
        return;


    stateInput.value=
        stateInput.value
            .trim()
            .toUpperCase();


    eligible.style.display=
        "block";


    yesExtra.style.display=
        "none";


    emailInput.value="";
    arbitNotesInput.value="";
    planEvidenceInput.value="";
    verifiedInput.value="";
    nonBifurcatedInput.value="";


    updateContinueButton();


    status.textContent=
        "Choose eligibility to continue.";

    noBtn.focus();

};


goBtn.onclick=
    processGo;


stateInput.onkeydown=e=>{

    if(e.key==="Enter"){

        e.preventDefault();

        processGo();

    }

};


/* =========================================================
   BUILD ONE ROW
   ========================================================= */

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
    plantypeMismatch="",
    processorName=""
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
     * A:R remain exactly as before.
     *
     * S = Processor Name
     * T = Philippine Date
     */

    const row=[

        isYes
            ?email
            :"-",

        getPlanType(i),

        plantypeMismatch,

        duplicateComments,

        disputeNumber,

        id,

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

        actualR,

        processorName,

        getPHDate()

    ];


    if(row.length!==20){

        console.error(
            "ERROR: ROW DOES NOT HAVE 20 COLUMNS!",
            row,
            "Length:",
            row.length
        );

    }


    console.log(
        "FINAL 20-COLUMN ROW",
        row
    );


    console.log(
        "COLUMN S / PROCESSOR NAME:",
        processorName
    );

    console.log(
        "COLUMN T / PHILIPPINE DATE:",
        getPHDate()
    );


    return row.join("\t");

};


/* =========================================================
   BUILD OUTPUT
   ========================================================= */

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
    plantypeMismatch="",
    processorName=""
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
                plantypeMismatch,
                processorName
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
                plantypeMismatch,
                processorName
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


/* =========================================================
   NO
   ========================================================= */

noBtn.onclick=async()=>{

    if(!validate())
        return;


    const stateValue=
        stateInput.value
            .trim()
            .toUpperCase();


    const duplicateComments=
        duplicateCommentsInput.value;


    const plantypeMismatch=
        mismatchInput.value;


    const output=
        buildOutput(
            stateValue,
            duplicateComments,
            false,
            "",
            "",
            "",
            "",
            "",
            "",
            plantypeMismatch,
            currentProcessorName
        );


    const copied=
        await copyText(output);


    overlay.remove();
    style.remove();


    const rowCount=
        sameId
        ?1
        :ids.length;


    showCopyMessage(

        copied
        ?`✅ COPIED ${rowCount} ROW${rowCount!==1?"S":""} — COLUMNS A:T`
        :`❌ COPY FAILED — CLICK COPY AGAIN`,

        output

    );


    resolve(null);

};


/* =========================================================
   YES
   ========================================================= */

yesBtn.onclick=()=>{

    if(!validate())
        return;


    yesExtra.style.display=
        "block";


    status.textContent=
        "Complete all required YES fields.";


    updateContinueButton();


    emailInput.focus();

};


/* =========================================================
   CONTINUE YES
   ========================================================= */

continueBtn.onclick=async()=>{

    if(continueBtn.disabled){

        status.textContent=
            "Please complete all required fields before continuing.";

        return;

    }


    if(!validate())
        return;


    if(!validateYesFields()){

        status.textContent=
            "Please complete all required YES fields.";

        updateContinueButton();

        return;

    }


    const email=
        emailInput.value.trim();


    const arbitCaseNotes=
        arbitNotesInput.value.trim();


    const planTypeEvidence=
        planEvidenceInput.value;


    const verificationStatus=
        verifiedInput.value;


    const nonBifurcated=
        nonBifurcatedInput.value;


    const plantypeMismatch=
        mismatchInput.value;


    if(!email){

        status.textContent=
            "Enter PLANTYPE_IDRE_EMAIL.";

        emailInput.focus();

        return;

    }


    if(!arbitCaseNotes){

        status.textContent=
            "Enter Arbit Case Notes.";

        arbitNotesInput.focus();

        return;

    }


    if(!planTypeEvidence){

        status.textContent=
            "Select Plan Type Evidence.";

        planEvidenceInput.focus();

        return;

    }


    if(!verificationStatus){

        status.textContent=
            "Select Yes or No for Verified.";

        verifiedInput.focus();

        return;

    }


    if(!nonBifurcated){

        status.textContent=
            "Select N/A or Yes for Non-Bifurcated state/Federal.";

        nonBifurcatedInput.focus();

        return;

    }


    if(!plantypeMismatch){

        status.textContent=
            "Select Yes or No for Plantype Mismatch.";

        mismatchInput.focus();

        return;

    }


    const stateValue=
        stateInput.value
            .trim()
            .toUpperCase();


    const duplicateComments=
        duplicateCommentsInput.value;


    const output=
        buildOutput(
            stateValue,
            duplicateComments,
            true,
            currentName,
            email,
            verificationStatus,
            arbitCaseNotes,
            planTypeEvidence,
            nonBifurcated,
            plantypeMismatch,
            currentProcessorName
        );


    const copied=
        await copyText(output);


    overlay.remove();
    style.remove();


    const rowCount=
        sameId
        ?1
        :ids.length;


    showCopyMessage(

        copied
        ?`✅ COPIED ${rowCount} ROW${rowCount!==1?"S":""} — COLUMNS A:T`
        :`❌ COPY FAILED — CLICK COPY AGAIN`,

        output

    );


    resolve(null);

};


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

overlay.addEventListener(
    "keydown",
    e=>{

        if(
            e.ctrlKey &&
            !e.altKey &&
            !e.metaKey &&
            !e.shiftKey &&
            e.key==="2"
        ){

            e.preventDefault();
            e.stopPropagation();

            duplicateCommentsInput.value=
                "N/A";


            duplicateCommentsInput.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles:true
                    }
                )
            );


            status.textContent=
                "Duplicate Dispute Comments: N/A";

            return;

        }


        if(
            e.ctrlKey &&
            !e.altKey &&
            !e.metaKey &&
            !e.shiftKey &&
            e.key==="3"
        ){

            e.preventDefault();
            e.stopPropagation();

            duplicateCommentsInput.value=
                "Duplicate Dispute Reviewed";


            duplicateCommentsInput.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles:true
                    }
                )
            );


            status.textContent=
                "Duplicate Dispute Comments: Duplicate Dispute Reviewed";

            return;

        }


        if(
            e.ctrlKey &&
            !e.altKey &&
            !e.metaKey &&
            !e.shiftKey &&
            e.key==="4"
        ){

            e.preventDefault();
            e.stopPropagation();

            mismatchInput.value=
                "No";


            mismatchInput.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles:true
                    }
                )
            );


            status.textContent=
                "Plantype Mismatch: No";

            return;

        }


        if(
            e.ctrlKey &&
            !e.altKey &&
            !e.metaKey &&
            !e.shiftKey &&
            e.key==="5"
        ){

            e.preventDefault();
            e.stopPropagation();

            mismatchInput.value=
                "Yes";


            mismatchInput.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles:true
                    }
                )
            );


            status.textContent=
                "Plantype Mismatch: Yes";

            return;

        }


        if(e.key==="Escape"){

            e.preventDefault();

            overlay.remove();
            style.remove();

            resolve(null);

            return;

        }


        if(
            e.ctrlKey &&
            !e.altKey &&
            !e.metaKey &&
            !e.shiftKey &&
            e.key==="0" &&
            eligible.style.display==="block"
        ){

            e.preventDefault();
            e.stopPropagation();

            noBtn.click();

            return;

        }


        if(
            e.ctrlKey &&
            !e.altKey &&
            !e.metaKey &&
            !e.shiftKey &&
            e.key==="1" &&
            eligible.style.display==="block"
        ){

            e.preventDefault();
            e.stopPropagation();

            yesBtn.click();

            return;

        }

    },
    true
);


/* =========================================================
   CLOSE
   ========================================================= */

closeBtn.onclick=()=>{

    overlay.remove();
    style.remove();

    resolve(null);

};


stateInput.focus();

});


/* =========================================================
   START
   ========================================================= */

await popup();

})();
