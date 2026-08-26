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
    "IDs:",
    ids
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
   ARBIT ID IFRAME + RUSH VERIFY
   ========================================================= */

const RUSH_VERIFY_SCRIPT=
    "https://luckyph10.github.io/bookmarklets/vob_intelligence.js?" +
    Date.now();


const openArbitIframe=()=>{

    const arbitLink=
        document.querySelector(
            "#table-body > tr > td:nth-child(2) > a"
        );

    if(!arbitLink){

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


    const overlay=
        document.createElement("div");

    overlay.id=
        "arbit-iframe-overlay";


    overlay.innerHTML=`

        <div id="arbit-iframe-window">

            <div id="arbit-iframe-header">

                <div
                    id="arbit-iframe-title"
                >
                    ARBIT ID
                </div>


                <div
                    id="arbit-iframe-actions"
                >

                    <button
                        id="arbit-rush-verify"
                        type="button"
                    >
                        RUSH VERIFY
                    </button>


                    <button
                        id="arbit-iframe-close"
                        type="button"
                    >
                        ×
                    </button>

                </div>

            </div>


            <iframe
                id="arbit-iframe"
                src="${arbitLink.href}"
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

            top:0!important;
            right:0!important;
            bottom:0!important;
            left:0!important;

            width:100vw!important;
            height:100vh!important;

            display:flex!important;

            align-items:center!important;
            justify-content:center!important;

            padding:0!important;
            margin:0!important;

            background:
                rgba(0,0,0,.78)!important;

            backdrop-filter:
                blur(7px)!important;

            -webkit-backdrop-filter:
                blur(7px)!important;

            z-index:
                2147483647!important;

            isolation:isolate!important;

            box-sizing:border-box!important;

        }


        #arbit-iframe-window{

            position:relative!important;

            z-index:
                2147483647!important;

            width:
                98vw!important;

            height:
                96vh!important;

            max-width:
                1800px!important;

            max-height:
                98vh!important;

            background:#111!important;

            border:
                1px solid
                rgba(255,255,255,.25)!important;

            border-radius:
                16px!important;

            overflow:hidden!important;

            box-shadow:
                0 25px 100px
                rgba(0,0,0,.85)!important;

            display:flex!important;

            flex-direction:column!important;

            box-sizing:border-box!important;

        }


        #arbit-iframe-header{

            position:relative!important;

            z-index:
                2147483647!important;

            height:
                54px!important;

            min-height:
                54px!important;

            flex-shrink:0!important;

            background:
                #151515!important;

            border-bottom:
                1px solid
                rgba(255,255,255,.18)!important;

            display:flex!important;

            align-items:center!important;

            justify-content:space-between!important;

            padding:
                0 10px 0 18px!important;

            box-sizing:border-box!important;

        }


        #arbit-iframe-title{

            color:#fff!important;

            font-family:
                Arial,sans-serif!important;

            font-size:
                15px!important;

            font-weight:
                800!important;

            letter-spacing:
                .3px!important;

        }


        #arbit-iframe-actions{

            display:flex!important;

            align-items:center!important;

            gap:8px!important;

        }


        #arbit-rush-verify{

            height:
                38px!important;

            padding:
                0 16px!important;

            border:
                1px solid
                rgba(255,255,255,.2)!important;

            border-radius:
                9px!important;

            background:
                #16a34a!important;

            color:#fff!important;

            font-family:
                Arial,sans-serif!important;

            font-size:
                12px!important;

            font-weight:
                800!important;

            letter-spacing:
                .4px!important;

            cursor:pointer!important;

            box-shadow:
                0 4px 14px
                rgba(0,0,0,.35)!important;

        }


        #arbit-rush-verify:hover{

            background:
                #22c55e!important;

            transform:
                translateY(-1px)!important;

            box-shadow:
                0 5px 18px
                rgba(22,163,74,.45)!important;

        }


        #arbit-rush-verify:active{

            transform:
                translateY(0)!important;

        }


        #arbit-iframe-close{

            width:
                38px!important;

            height:
                38px!important;

            border:0!important;

            border-radius:
                50%!important;

            background:
                rgba(255,255,255,.08)!important;

            color:#fff!important;

            font-size:
                27px!important;

            line-height:1!important;

            cursor:pointer!important;

            display:flex!important;

            align-items:center!important;

            justify-content:center!important;

        }


        #arbit-iframe-close:hover{

            background:
                rgba(220,40,40,.95)!important;

        }


        #arbit-iframe{

            position:relative!important;

            z-index:
                2147483647!important;

            display:block!important;

            width:
                100%!important;

            height:
                calc(100% - 54px)!important;

            flex:
                1 1 auto!important;

            min-height:
                0!important;

            border:0!important;

            background:#fff!important;

        }


        @media(max-width:700px){

            #arbit-iframe-window{

                width:
                    100vw!important;

                height:
                    98vh!important;

                border-radius:
                    10px!important;

            }


            #arbit-rush-verify{

                padding:
                    0 10px!important;

                font-size:
                    11px!important;

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

    const closeBtn=
        document.getElementById(
            "arbit-iframe-close"
        );

    const rushBtn=
        document.getElementById(
            "arbit-rush-verify"
        );


    /* =====================================================
       FORCE IFRAME TO FRONT
       ===================================================== */

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

        document.body.style.setProperty(
            "position",
            document.body.style.position||"relative",
            ""
        );

    }catch(e){

        console.warn(
            "Could not force iframe stacking:",
            e
        );

    }


    /* =====================================================
       RUSH VERIFY
       ===================================================== */

    rushBtn.onclick=()=>{

        try{

            const iframeDocument=
                iframe.contentDocument ||
                iframe.contentWindow?.document;

            if(!iframeDocument){

                alert(
                    "RUSH VERIFY cannot access the ARBIT page."
                );

                return;

            }


            const script=
                iframeDocument.createElement(
                    "script"
                );


            script.src=
                "https://luckyph10.github.io/bookmarklets/vob_intelligence.js?" +
                Date.now();


            script.onload=()=>{

                console.log(
                    "RUSH VERIFY loaded inside ARBIT iframe."
                );

            };


            script.onerror=()=>{

                alert(
                    "RUSH VERIFY: Load failed"
                );

            };


            iframeDocument.head.appendChild(
                script
            );


        }catch(e){

            console.error(
                "RUSH VERIFY iframe error:",
                e
            );

            alert(
                "RUSH VERIFY could not run inside the ARBIT iframe.\n\n"+
                "The ARBIT page may block cross-origin script access."
            );

        }

    };


    /* =====================================================
       CLOSE IFRAME
       ===================================================== */

    const closeIframe=()=>{

        overlay.remove();
        iframeStyle.remove();

    };


    closeBtn.onclick=
        closeIframe;


    /* =====================================================
       CLICK OUTSIDE
       ===================================================== */

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


    /* =====================================================
       ESC
       ===================================================== */

    overlay.addEventListener(
        "keydown",
        e=>{

            if(e.key==="Escape"){

                e.preventDefault();

                closeIframe();

            }

        },
        true
    );


    /* =====================================================
       FOCUS
       ===================================================== */

    setTimeout(()=>{

        try{

            closeBtn.focus();

        }catch(e){}

    },50);

};


/* =========================================================
   POPUP
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


            <!-- =================================================
                 DISPUTE USER NAME
                 ================================================= -->

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


            <!-- =================================================
                 STATE + DUPLICATE COMMENTS
                 ================================================= -->

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


            <!-- =================================================
                 PLANTYPE MISMATCH
                 COLUMN C
                 ================================================= -->

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


            <!-- =================================================
                 ELIGIBILITY
                 ================================================= -->

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


                <!-- =================================================
                     YES EXTRA FIELDS
                     ================================================= -->

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


    /* =====================================================
       STYLE
       ===================================================== */

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

            max-width:
                calc(100vw - 30px);

            max-height:
                calc(100vh - 40px);

            overflow-y:auto;

            padding:24px;

            border-radius:18px;

            background:
                rgba(0,0,0,.78);

            border:
                1px solid
                rgba(255,255,255,.18);

            box-shadow:
                0 15px 45px
                rgba(0,0,0,.45);

            backdrop-filter:
                blur(14px);

            -webkit-backdrop-filter:
                blur(14px);

            font-family:
                Arial,sans-serif;

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

            border:
                1px solid
                rgba(255,255,255,.25);

            border-radius:9px;

            background:
                #d92828;

            color:#fff;

            font-size:13px;

            font-weight:800;

            letter-spacing:.4px;

            cursor:pointer;

            white-space:nowrap;

            box-shadow:
                0 4px 12px
                rgba(0,0,0,.3);

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

            background:
                rgba(255,255,255,.14);

        }


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

            color:
                rgba(255,255,255,.9);

            margin:
                10px 0 7px;

        }


        #dp-name-row,
        #dp-state-row{

            display:flex;

            gap:8px;

            width:100%;

            align-items:center;

        }


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

            border:
                1px solid
                rgba(255,255,255,.25);

            border-radius:10px;

            background:
                rgba(255,255,255,.09);

            color:#fff;

            outline:none;

            padding:
                0 12px;

            font-size:14px;

        }


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


        #dp-name::placeholder,
        #dp-state::placeholder,
        #dp-email::placeholder,
        #dp-arbit-notes::placeholder{

            color:
                rgba(255,255,255,.5);

        }


        #dp-name:focus,
        #dp-state:focus,
        #dp-email:focus,
        #dp-arbit-notes:focus,
        #dp-mismatch:focus,
        #dp-plan-evidence:focus,
        #dp-verified:focus,
        #dp-non-bifurcated:focus,
        #dp-duplicate-comments:focus{

            border-color:
                rgba(255,255,255,.65);

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

                padding:0 11px;

                font-size:12px;

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


    document.head.appendChild(style);
    document.body.appendChild(overlay);


    /* =====================================================
       ELEMENTS
       ===================================================== */

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
        document.getElementById("dp-arbit-notes");

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
       USER NAME
       ===================================================== */

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


    /* =====================================================
       EDIT
       ===================================================== */

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


    /* =====================================================
       SAVE
       ===================================================== */

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


    /* =====================================================
       VALIDATE MAIN FORM
       ===================================================== */

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


        const row=[

            /* A */
            isYes
                ?email
                :"-",

            /* B */
            getPlanType(i),

            /* C */
            plantypeMismatch,

            /* D */
            duplicateComments,

            /* E */
            disputeNumber,

            /* F */
            id,

            /* G */
            actualG,

            /* H */
            isYes
                ?disputeUserName
                :"-",

            /* I */
            isYes
                ?verificationStatus
                :"-",

            /* J */
            isYes
                ?arbitCaseNotes
                :"-",

            /* K */
            isYes
                ?planTypeEvidence
                :"-",

            /* L */
            actualL,

            /* M */
            "N/A",

            /* N */
            "N/A",

            /* O */
            stateValue,

            /* P */
            isYes
                ?nonBifurcated
                :"-",

            /* Q */
            isYes
                ?"Yes"
                :"No",

            /* R */
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
       NO
       ===================================================== */

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
                plantypeMismatch
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
            ?`✅ COPIED ${rowCount} ROW${rowCount!==1?"S":""} — COLUMN C UPDATED`
            :`❌ COPY FAILED — CLICK COPY AGAIN`,

            output

        );


        resolve(null);

    };


    /* =====================================================
       YES
       ===================================================== */

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


    /* =====================================================
       CONTINUE YES
       ===================================================== */

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
                plantypeMismatch
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
            ?`✅ COPIED ${rowCount} ROW${rowCount!==1?"S":""} — COLUMNS A:R`
            :`❌ COPY FAILED — CLICK COPY AGAIN`,

            output

        );


        resolve(null);

    };


    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

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


    /* =====================================================
       CLOSE
       ===================================================== */

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
