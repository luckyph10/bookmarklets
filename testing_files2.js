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
     * Get the ID from:
     * calculator/2207838
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

    /*
     * RESTORE EXISTING MINIMIZED IFRAME
     */

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
     * GET ALL AVAILABLE ARBIT / APP ID LINKS
     */

    let appLinks=[
        ...uniqueArbitLinks
    ];


    /*
     * FALLBACK
     *
     * UPDATED SELECTOR
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


    /* =====================================================
       REMOVE OLD IFRAME
       ===================================================== */

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


    /* =====================================================
       CURRENT APP
       ===================================================== */

    let currentAppIndex=0;

    let currentApp=
        appLinks[currentAppIndex];


    /* =====================================================
       CREATE OVERLAY
       ===================================================== */

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


    /* =====================================================
       SELECTOR
       ===================================================== */

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


    /* =====================================================
       RUSH VERIFY BUTTON
       ===================================================== */

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


    /* =====================================================
       PULL EVIDENCE BUTTON
       ===================================================== */

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


    /* =====================================================
       MINIMIZE
       ===================================================== */

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


    /* =====================================================
       CLOSE
       ===================================================== */

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
   MAIN UI
   ========================================================= */

const style=
    document.createElement("style");


style.id=
    "arbit-iframe-style";


style.textContent=`

#arbit-iframe-overlay{

    position:fixed;
    inset:0;

    background:rgba(0,0,0,.68);

    z-index:2147483000;

    display:flex;

    align-items:center;
    justify-content:center;

    padding:20px;

    box-sizing:border-box;

}


#arbit-iframe-window{

    width:min(1400px,96vw);
    height:min(900px,94vh);

    min-width:320px;
    min-height:300px;

    background:#fff;

    border-radius:16px;

    overflow:hidden;

    box-shadow:
        0 25px 80px rgba(0,0,0,.45);

    display:flex;
    flex-direction:column;

}


#arbit-iframe-header{

    height:54px;

    flex:0 0 54px;

    display:flex;
    align-items:center;

    gap:10px;

    padding:0 12px 0 16px;

    box-sizing:border-box;

    background:#111;

    color:#fff;

    font-family:Arial,sans-serif;

}


#arbit-iframe-title{

    font-weight:800;

    font-size:14px;

    white-space:nowrap;

}


#arbit-iframe-current-id{

    font-size:13px;

    font-weight:700;

    opacity:.8;

    padding:6px 9px;

    border-radius:7px;

    background:rgba(255,255,255,.1);

    white-space:nowrap;

}


#arbit-app-selector-wrap{

    flex:0 1 280px;

    min-width:150px;

}


#arbit-app-selector{

    width:100%;

    height:34px;

    border-radius:8px;

    border:1px solid rgba(255,255,255,.25);

    background:#222;

    color:#fff;

    padding:0 9px;

    font-weight:700;

    outline:none;

}


#arbit-iframe-rush,
#arbit-iframe-pull{

    height:34px;

    border:0;

    border-radius:8px;

    padding:0 12px;

    cursor:pointer;

    font:700 12px Arial,sans-serif;

    color:#fff;

}


#arbit-iframe-rush{

    background:#b42318;

}


#arbit-iframe-pull{

    background:#175cd3;

}


#arbit-iframe-minimize,
#arbit-iframe-close{

    width:34px;

    height:34px;

    flex:0 0 34px;

    border:0;

    border-radius:8px;

    background:rgba(255,255,255,.12);

    color:#fff;

    cursor:pointer;

    font-size:20px;

    line-height:1;

}


#arbit-iframe-minimize:hover,
#arbit-iframe-close:hover{

    background:rgba(255,255,255,.22);

}


#arbit-iframe{

    width:100%;
    height:100%;

    flex:1 1 auto;

    border:0;

    background:#fff;

}


@media(max-width:700px){

    #arbit-iframe-overlay{

        padding:8px;

    }


    #arbit-iframe-window{

        width:100%;
        height:96vh;

        border-radius:10px;

    }


    #arbit-iframe-header{

        height:auto;
        min-height:54px;

        flex-wrap:wrap;

        padding:9px;

    }


    #arbit-app-selector-wrap{

        order:10;

        flex:1 1 100%;

    }


    #arbit-iframe{

        min-height:0;

    }

}

`;


document.head.appendChild(
    style
);


/* =========================================================
   DISPUTE INFORMATION UI
   ========================================================= */

const existingMain=
    document.getElementById(
        "dispute-auto-fill-panel"
    );


if(existingMain)
    existingMain.remove();


const panel=
    document.createElement("div");


panel.id=
    "dispute-auto-fill-panel";


panel.innerHTML=`

<div
    id="dp-window"
>

    <div
        id="dp-header"
    >

        <div>
            DISPUTE INFORMATION
        </div>

    </div>


    <div
        id="dp-body"
    >

        <div
            class="dp-row"
        >

            <label>
                Dispute User Name
            </label>

            <div
                class="dp-name-wrap"
            >

                <input
                    id="dp-name"
                    type="text"
                    autocomplete="off"
                >

                <button
                    id="dp-edit"
                    type="button"
                >
                    EDIT
                </button>

                <button
                    id="dp-save"
                    type="button"
                >
                    SAVE
                </button>

                <span
                    id="dp-saved"
                >
                    SAVED
                </span>

            </div>

        </div>


        <div
            class="dp-row"
        >

            <label>
                State
            </label>

            <input
                id="dp-state"
                type="text"
                maxlength="2"
                autocomplete="off"
            >

        </div>


        <div
            class="dp-row"
        >

            <label>
                Duplicate Dispute Comments
            </label>

            <select
                id="dp-duplicate-comments"
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


        <div
            class="dp-row"
        >

            <label>
                Plantype Mismatch
            </label>

            <select
                id="dp-mismatch"
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
            id="dp-go"
            type="button"
        >
            GO
        </button>


        <div
            id="dp-eligible"
        >

            <div
                class="dp-eligible-title"
            >
                Is this dispute eligible?
            </div>


            <div
                class="dp-yesno"
            >

                <button
                    id="dp-no"
                    type="button"
                >
                    NO
                </button>


                <button
                    id="dp-yes"
                    type="button"
                >
                    YES
                </button>

            </div>


            <div
                id="dp-yes-extra"
            >

                <div
                    class="dp-row"
                >

                    <label>
                        Email
                    </label>

                    <input
                        id="dp-email"
                        type="email"
                    >

                </div>


                <div
                    class="dp-row"
                >

                    <label>
                        Arbit Case Notes
                    </label>

                    <textarea
                        id="dp-arbit-notes"
                    ></textarea>

                </div>


                <div
                    class="dp-row"
                >

                    <label>
                        Plan Type Evidence
                    </label>

                    <select
                        id="dp-plan-evidence"
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


                <div
                    class="dp-row"
                >

                    <label>
                        Verification Status
                    </label>

                    <select
                        id="dp-verified"
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


                <div
                    class="dp-row"
                >

                    <label>
                        Non-Bifurcated
                    </label>

                    <select
                        id="dp-non-bifurcated"
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
                    id="dp-continue"
                    type="button"
                    disabled
                >
                    CONTINUE
                </button>

            </div>

        </div>


        <button
            id="dp-arbit-id"
            type="button"
        >
            OPEN ARBIT ID
        </button>


        <div
            id="dp-status"
        ></div>

    </div>

</div>

`;


document.body.appendChild(
    panel
);


/* =========================================================
   PANEL STYLE
   ========================================================= */

const panelStyle=
    document.createElement("style");


panelStyle.id=
    "dispute-auto-fill-panel-style";


panelStyle.textContent=`

#dispute-auto-fill-panel{

    position:fixed;

    top:20px;
    right:20px;

    z-index:2147482000;

    font-family:Arial,sans-serif;

}


#dp-window{

    width:430px;

    max-width:calc(100vw - 40px);

    background:#fff;

    border-radius:14px;

    box-shadow:
        0 15px 50px rgba(0,0,0,.35);

    overflow:hidden;

    border:1px solid #ddd;

}


#dp-header{

    background:#111;

    color:#fff;

    padding:14px 16px;

    font-size:15px;

    font-weight:800;

}


#dp-body{

    padding:16px;

}


.dp-row{

    margin-bottom:12px;

}


.dp-row label{

    display:block;

    margin-bottom:5px;

    font-size:12px;

    font-weight:800;

    color:#333;

}


.dp-row input,
.dp-row select,
.dp-row textarea,
#dp-state{

    width:100%;

    box-sizing:border-box;

    min-height:38px;

    border:1px solid #bbb;

    border-radius:8px;

    padding:8px 10px;

    font:14px Arial,sans-serif;

    outline:none;

}


.dp-row textarea{

    min-height:90px;

    resize:vertical;

}


.dp-name-wrap{

    display:flex;

    gap:6px;

    align-items:center;

}


#dp-name{

    flex:1;

    min-width:0;

    min-height:38px;

    box-sizing:border-box;

    border:1px solid #bbb;

    border-radius:8px;

    padding:8px 10px;

}


#dp-edit,
#dp-save{

    min-height:38px;

    padding:0 10px;

    border:0;

    border-radius:8px;

    cursor:pointer;

    font:700 11px Arial,sans-serif;

}


#dp-edit{

    background:#555;

    color:#fff;

}


#dp-save{

    background:#175cd3;

    color:#fff;

}


#dp-saved{

    display:inline-flex;

    align-items:center;

    min-height:28px;

    padding:0 8px;

    border-radius:7px;

    background:#dcfce7;

    color:#166534;

    font:800 10px Arial,sans-serif;

}


#dp-go,
#dp-arbit-id,
#dp-continue{

    width:100%;

    min-height:40px;

    border:0;

    border-radius:9px;

    cursor:pointer;

    font:800 12px Arial,sans-serif;

    color:#fff;

    margin-top:4px;

}


#dp-go{

    background:#111;

}


#dp-arbit-id{

    background:#7f1d1d;

    margin-top:10px;

}


#dp-continue{

    background:#166534;

}


#dp-continue:disabled{

    background:#aaa;

    cursor:not-allowed;

}


#dp-eligible{

    display:none;

    margin-top:14px;

    padding-top:14px;

    border-top:1px solid #ddd;

}


.dp-eligible-title{

    font-size:13px;

    font-weight:800;

    margin-bottom:10px;

}


.dp-yesno{

    display:flex;

    gap:8px;

}


.dp-yesno button{

    flex:1;

    min-height:40px;

    border:0;

    border-radius:8px;

    cursor:pointer;

    color:#fff;

    font:800 12px Arial,sans-serif;

}


#dp-no{

    background:#b42318;

}


#dp-yes{

    background:#166534;

}


#dp-yes-extra{

    display:none;

    margin-top:14px;

}


#dp-status{

    margin-top:10px;

    min-height:18px;

    font-size:11px;

    font-weight:700;

    color:#555;

}

`;


document.head.appendChild(
    panelStyle
);


/* =========================================================
   GET ELEMENTS
   ========================================================= */

const nameInput=
    document.getElementById(
        "dp-name"
    );

const stateInput=
    document.getElementById(
        "dp-state"
    );

const duplicateCommentsInput=
    document.getElementById(
        "dp-duplicate-comments"
    );

const mismatchInput=
    document.getElementById(
        "dp-mismatch"
    );

const editBtn=
    document.getElementById(
        "dp-edit"
    );

const saveBtn=
    document.getElementById(
        "dp-save"
    );

const savedLabel=
    document.getElementById(
        "dp-saved"
    );

const goBtn=
    document.getElementById(
        "dp-go"
    );

const status=
    document.getElementById(
        "dp-status"
    );

const eligible=
    document.getElementById(
        "dp-eligible"
    );

const noBtn=
    document.getElementById(
        "dp-no"
    );

const yesBtn=
    document.getElementById(
        "dp-yes"
    );

const yesExtra=
    document.getElementById(
        "dp-yes-extra"
    );

const emailInput=
    document.getElementById(
        "dp-email"
    );

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


/* =========================================================
   ARBIT ID BUTTON
   ========================================================= */

arbitIdBtn.onclick=()=>{

    openArbitIframe();

};


/* =========================================================
   USER NAME
   ========================================================= */

let currentName=
    getName();


nameInput.value=
    currentName;


if(currentName){

    nameInput.readOnly=true;

    editBtn.style.display=
        "inline-block";

    saveBtn.style.display=
        "none";

    savedLabel.style.display=
        "inline-flex";

    status.textContent=
        "Saved username: "+currentName;

}else{

    nameInput.readOnly=false;

    editBtn.style.display=
        "none";

    saveBtn.style.display=
        "inline-block";

    savedLabel.style.display=
        "none";

    status.textContent=
        "Please enter and save your Dispute User Name.";

    nameInput.focus();

}


/* =========================================================
   EDIT
   ========================================================= */

editBtn.onclick=()=>{

    nameInput.readOnly=false;

    nameInput.focus();

    nameInput.select();

    editBtn.style.display=
        "none";

    saveBtn.style.display=
        "inline-block";

    savedLabel.style.display=
        "none";

    status.textContent=
        "Editing username...";

};


/* =========================================================
   SAVE
   ========================================================= */

saveBtn.onclick=()=>{

    const n=
        nameInput.value.trim();


    if(!n){

        status.textContent=
            "Enter a Dispute User Name first.";

        nameInput.focus();

        return;

    }


    if(!saveName(n)){

        status.textContent=
            "Could not save the username.";

        return;

    }


    currentName=n;

    nameInput.value=n;

    nameInput.readOnly=true;

    editBtn.style.display=
        "inline-block";

    saveBtn.style.display=
        "none";

    savedLabel.style.display=
        "inline-flex";

    status.textContent=
        "Username saved.";

    stateInput.focus();

};


/* =========================================================
   VALIDATE MAIN FORM
   ========================================================= */

const validate=()=>{

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


/* =========================================================
   VALIDATE YES FORM
   ========================================================= */

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


/* =========================================================
   UPDATE CONTINUE
   ========================================================= */

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


/* =========================================================
   YES FIELD LISTENERS
   ========================================================= */

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


/* =========================================================
   GO
   ========================================================= */

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
    plantypeMismatch=""
)=>{

    const rows=[];


    for(
        let i=0;
        i<ids.length;
        i++
    ){

        rows.push(
            buildRow(
                ids[i],
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

    }


    return rows.join("\n");

};


/* =========================================================
   NO
   ========================================================= */

noBtn.onclick=async()=>{

    const output=
        buildOutput(
            stateInput.value.trim().toUpperCase(),
            duplicateCommentsInput.value,
            false,
            currentName
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


/* =========================================================
   YES
   ========================================================= */

yesBtn.onclick=()=>{

    yesExtra.style.display=
        "block";


    updateContinueButton();


    emailInput.focus();

};


/* =========================================================
   CONTINUE
   ========================================================= */

continueBtn.onclick=async()=>{

    if(!validateYesFields())
        return;


    const output=
        buildOutput(
            stateInput.value.trim().toUpperCase(),
            duplicateCommentsInput.value,
            true,
            currentName,
            emailInput.value.trim(),
            verifiedInput.value,
            arbitNotesInput.value.trim(),
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


/* =========================================================
   INITIAL STATE
   ========================================================= */

eligible.style.display=
    "none";


yesExtra.style.display=
    "none";


updateContinueButton();


console.log(
    "Updated ARBIT selector:",
    'a[title="Open Arbit"]'
);

console.log(
    "Detected ARBIT ID:",
    arbitIdNumber
);

console.log(
    "Detected ARBIT links:",
    uniqueArbitLinks
);

})();
