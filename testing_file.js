(async()=>{

const KEY="disputeUserName";

/* =========================================================
   USER NAME
   ========================================================= */

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
   NORMALIZE VALUES
   ========================================================= */

const normalizeValue=value=>
    String(value||"")
        .replace(/\u00A0/g," ")
        .replace(/\s+/g," ")
        .trim()
        .toLowerCase();

/* =========================================================
   GET PAGE DATA
   ========================================================= */

const disputeNumber=
    document.querySelector(
        "#ngForm fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input"
    )?.value?.trim()||"";

const disputeStatus=
    document.querySelector(
        "#ngForm fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > ng-select"
    )?.querySelector(".ng-value-label")?.textContent?.trim()
    ||
    document.querySelector(
        "#ngForm fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > ng-select"
    )?.textContent?.trim()
    ||
    "";

/* =========================================================
   GET COLUMN J
   ========================================================= */

const columnJValue=
    document.querySelector(
        "#ngForm > fieldset > div > div:nth-child(1) > div:nth-child(2) > ng-select > div > div > div.ng-value > span.ng-value-label"
    )?.textContent?.trim()
    ||
    "";

/* =========================================================
   GET COLUMN K
   =========================================================

   This is the page-level Column K.

   We try several selectors because ng-select
   structures can vary.
   ========================================================= */

const getNgSelectText=selector=>{

    const el=document.querySelector(selector);

    if(!el){
        return"";
    }

    return(
        el.querySelector(".ng-value-label")?.textContent?.trim()
        ||
        el.querySelector(".ng-value")?.textContent?.trim()
        ||
        el.textContent?.trim()
        ||
        ""
    );
};

let columnKValue=
    getNgSelectText(
        "#ngForm > fieldset > div > div:nth-child(1) > div:nth-child(4) > ng-select"
    );

/*
 * Fallback: search for an element whose current selected
 * value is Closed.
 */

if(!columnKValue){

    const possibleKElements=[
        ...document.querySelectorAll(
            "#ngForm ng-select"
        )
    ];

    for(const el of possibleKElements){

        const txt=
            (
                el.querySelector(".ng-value-label")?.textContent
                ||
                el.textContent
                ||
                ""
            ).trim();

        if(
            normalizeValue(txt)==="closed"
        ){

            columnKValue=txt;
            break;
        }
    }
}

/* =========================================================
   GET TABLE ROWS
   ========================================================= */

const tableRows=[
    ...document.querySelectorAll(
        "#table-body tr"
    )
];

/* =========================================================
   GET IDS
   ========================================================= */

const ids=tableRows
    .map(row=>
        row
            .querySelector("td:nth-child(2)")
            ?.textContent
            ?.trim()
            ||
            ""
    )
    .filter(Boolean);

/* =========================================================
   GET COLUMN F FROM ACTUAL TABLE
   =========================================================

   IMPORTANT:

   Column F = 6th table cell.

   td:nth-child(6)
   ========================================================= */

const columnFValues=tableRows.map(row=>{

    const cell=
        row.querySelector(
            "td:nth-child(6)"
        );

    if(!cell){
        return"";
    }

    /*
     * Try normal text first.
     */
    let value=
        (
            cell.innerText||
            cell.textContent||
            ""
        )
        .replace(/\u00A0/g," ")
        .replace(/\s+/g," ")
        .trim();

    /*
     * If Column F contains an input/ng-select,
     * try those too.
     */

    if(!value){

        const input=
            cell.querySelector(
                "input, textarea"
            );

        if(input){
            value=
                (
                    input.value||
                    input.textContent||
                    ""
                ).trim();
        }
    }

    if(!value){

        const selected=
            cell.querySelector(
                ".ng-value-label"
            );

        if(selected){
            value=
                selected.textContent
                    .replace(/\u00A0/g," ")
                    .replace(/\s+/g," ")
                    .trim();
        }
    }

    return value;

});

/* =========================================================
   GET PLAN TYPES
   =========================================================

   Keep this because the rest of your existing output
   uses the planType_ fields.
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
    .replace(/\s+/g," ")
    .trim()
)
.filter(Boolean);

if(
    !disputeNumber||
    !disputeStatus||
    !ids.length
){

    console.error(
        "Missing Dispute Number, Dispute Status, or IDs."
    );

    console.log({
        disputeNumber,
        disputeStatus,
        ids
    });

    return;
}

/* =========================================================
   SAME ID
   ========================================================= */

const sameId=
    ids.every(id=>id===ids[0]);

/* =========================================================
   PLAN TYPE
   ========================================================= */

const getPlanType=
    i=>
        planTypes[i]||
        planTypes[0]||
        "";

/* =========================================================
   COLUMN F
   =========================================================

   FIRST use actual table Column F.

   If Column F cannot be found, fall back to plan type.
   ========================================================= */

const getColumnF=
    i=>{

        const tableF=
            columnFValues[i]||
            "";

        if(tableF){
            return tableF;
        }

        return getPlanType(i);
    };

/* =========================================================
   COLUMN Q LOGIC
   ========================================================= */

const getColumnQValue=columnFValue=>{

    const k=
        normalizeValue(columnKValue);

    const f=
        normalizeValue(columnFValue);

    /* =====================================================
       K = CLOSED HAS PRIORITY
       ===================================================== */

    if(
        k==="closed"
        ||
        k.includes("closed")
    ){

        return(
            "Completed. Dispute is Closed Due to Receiving Payment Determination."
        );
    }

    /* =====================================================
       F = PLAN TYPE VALIDATED
       ===================================================== */

    if(
        f===
        "plan type validated post idr initiation, vob verified, no change to nsa jurisdiction"
    ){

        return(
            "Plan Type Validated Post IDR Initiation"
        );
    }

    /* =====================================================
       F = PLAN TYPE OBJECTION
       ===================================================== */

    if(
        f===
        "plan type objection submitted"
    ){

        return(
            "Already completed by Onshore"
        );
    }

    /* =====================================================
       F = ADDITIONAL INFO EMAIL
       ===================================================== */

    if(
        f===
        "additional info provided to idre through email"
    ){

        return(
            "Additional Info provided to IDRE through email"
        );
    }

    /* =====================================================
       F = ADDITIONAL INFO PORTAL
       ===================================================== */

    if(
        f===
        "additional info provided to idre through portal"
    ){

        return(
            "Additional Info provided to IDRE through email"
        );
    }

    /* =====================================================
       NO MATCH
       ===================================================== */

    return"";
};

/* =========================================================
   DEBUG COLUMN F / K / Q
   ========================================================= */

console.log(
    "================ COLUMN F -> Q DEBUG ================"
);

console.log(
    "COLUMN K:",
    columnKValue
);

columnFValues.forEach((f,i)=>{

    console.log(
        `ROW ${i+1}`,
        {
            ID:ids[i],
            ColumnF:f,
            ColumnQ:getColumnQValue(f)
        }
    );

});

console.log(
    "======================================================"
);

/* =========================================================
   CLIPBOARD
   ========================================================= */

const copyText=function(text){

    try{

        if(
            navigator.clipboard &&
            typeof navigator.clipboard.writeText==="function"
        ){

            const result=
                navigator.clipboard.writeText(text);

            if(
                result &&
                typeof result.catch==="function"
            ){

                result.catch(e=>{
                    console.warn(
                        "Clipboard API rejected:",
                        e
                    );
                });

            }

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

const showCopyMessage=(
    message,
    success=true
)=>{

    const old=
        document.getElementById(
            "dispute-copy-toast"
        );

    if(old)old.remove();

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

    copyAgainBtn.onclick=()=>{

        const ok=
            copyText(
                messageEl.dataset.clipboard||""
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

    },7000);

    return toast;
};

/* =========================================================
   POPUP
   ========================================================= */

const popup=()=>new Promise(resolve=>{

    const old=
        document.getElementById(
            "dispute-popup-overlay"
        );

    if(old)old.remove();

    const overlay=
        document.createElement("div");

    overlay.id=
        "dispute-popup-overlay";

    overlay.innerHTML=`

        <div id="dispute-popup">

            <button
                id="dp-close"
                title="Close"
            >
                ×
            </button>

            <div id="dp-title">
                Dispute Information
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

                <select
                    id="dp-duplicate-comments"
                    required
                >

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

                <button id="dp-go">
                    Go
                </button>

            </div>

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

                    <div id="dp-label-verified">
                        Verified?
                    </div>

                    <select
                        id="dp-verified"
                        required
                    >

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

                    <button id="dp-continue">
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
            z-index:2147483647;
            pointer-events:none;
        }

        #dispute-popup{
            pointer-events:auto;
            position:absolute;
            top:20px;
            left:50%;
            transform:translateX(-50%);
            width:620px;
            max-width:calc(100vw - 30px);
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

        #dp-title{
            font-size:20px;
            font-weight:700;
            margin-bottom:20px;
            padding-right:35px;
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

        #dp-label-name,
        #dp-label-state,
        #dp-label-email,
        #dp-label-verified{
            font-size:13px;
            font-weight:600;
            color:rgba(255,255,255,.9);
            margin:10px 0 7px;
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
        #dp-verified,
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

        #dp-email,
        #dp-verified{
            width:100%;
        }

        #dp-verified{
            cursor:pointer;
        }

        #dp-verified option,
        #dp-duplicate-comments option{
            background:#222;
            color:#fff;
        }

        #dp-name:read-only{
            background:rgba(255,255,255,.045);
            color:rgba(255,255,255,.72);
        }

        #dp-name::placeholder,
        #dp-state::placeholder,
        #dp-email::placeholder{
            color:rgba(255,255,255,.5);
        }

        #dp-name:focus,
        #dp-state:focus,
        #dp-email:focus,
        #dp-verified:focus,
        #dp-duplicate-comments:focus{
            border-color:rgba(255,255,255,.65);
            box-shadow:0 0 0 3px rgba(255,255,255,.08);
        }

        #dp-edit,
        #dp-save,
        #dp-go{
            height:42px;
            padding:0 15px;
            border:1px solid rgba(255,255,255,.25);
            border-radius:10px;
            background:rgba(255,255,255,.14);
            color:#fff;
            font-weight:700;
            font-size:14px;
            cursor:pointer;
            white-space:nowrap;
        }

        #dp-edit:hover,
        #dp-save:hover{
            background:rgba(255,255,255,.24);
        }

        #dp-go{
            background:rgba(35,150,70,.9);
            border-color:rgba(35,150,70,.65);
        }

        #dp-go:hover{
            background:rgba(45,175,80,.98);
        }

        #dp-save{
            display:none;
        }

        #dp-saved{
            display:none;
            height:42px;
            padding:0 12px;
            border-radius:10px;
            background:rgba(35,140,65,.8);
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
            color:rgba(255,255,255,.65);
            min-height:16px;
        }

        #dp-eligible{
            margin-top:16px;
            padding-top:14px;
            border-top:1px solid rgba(255,255,255,.14);
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
            border:1px solid rgba(255,255,255,.2);
            color:#fff;
            font-size:14px;
            font-weight:700;
            cursor:pointer;
        }

        #dp-no{
            background:rgba(190,35,35,.88);
        }

        #dp-no:hover{
            background:rgba(220,45,45,.95);
        }

        #dp-yes{
            background:rgba(30,95,190,.9);
        }

        #dp-yes:hover{
            background:rgba(40,115,220,.98);
        }

        #dp-yes-extra{
            margin-top:14px;
            padding-top:14px;
            border-top:1px solid rgba(255,255,255,.14);
        }

        #dp-continue{
            width:100%;
            height:42px;
            margin-top:10px;
            border-radius:10px;
            border:1px solid rgba(35,140,65,.45);
            background:rgba(35,150,70,.9);
            color:#fff;
            font-size:14px;
            font-weight:700;
            cursor:pointer;
        }

        #dp-continue:hover{
            background:rgba(45,175,80,.98);
        }

        @media(max-width:650px){

            #dp-state-row{
                flex-wrap:wrap;
            }

            #dp-state{
                width:100%;
                flex:none;
            }

            #dp-duplicate-comments{
                flex:1;
                width:auto;
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
        document.getElementById("dp-duplicate-comments");

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

    const verifiedInput=
        document.getElementById("dp-verified");

    const continueBtn=
        document.getElementById("dp-continue");

    /* =====================================================
       USERNAME
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

        nameInput.value=
            currentName;

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
       VALIDATION
       ===================================================== */

    const validateStateAndDuplicate=()=>{

        if(!currentName){

            status.textContent=
                "Please save your Dispute User Name first.";

            nameInput.focus();

            return false;
        }

        const state=
            stateInput.value.trim();

        if(!state){

            status.textContent=
                "Enter a State.";

            stateInput.focus();

            return false;
        }

        const duplicateComments=
            duplicateCommentsInput.value;

        if(
            !duplicateComments||
            duplicateCommentsInput.selectedIndex===0
        ){

            status.textContent=
                "Please select Duplicate Dispute Comments before continuing.";

            duplicateCommentsInput.focus();

            return false;
        }

        return true;
    };

    /* =====================================================
       GO
       ===================================================== */

    const processStateAndDuplicate=()=>{

        if(!validateStateAndDuplicate()){
            return;
        }

        stateInput.value=
            stateInput.value
                .trim()
                .toUpperCase();

        eligible.style.display=
            "block";

        yesExtra.style.display=
            "none";

        verifiedInput.value="";

        status.textContent=
            "Choose eligibility to continue.";

        noBtn.focus();
    };

    goBtn.onclick=
        processStateAndDuplicate;

    stateInput.onkeydown=e=>{

        if(e.key==="Enter"){

            e.preventDefault();

            processStateAndDuplicate();
        }
    };

    /* =====================================================
       BUILD NO OUTPUT
       ===================================================== */

    const buildNoOutput=(
        stateValue,
        duplicateComments
    )=>{

        const makeNoRow=(id,i)=>{

            /*
             * ACTUAL PAGE COLUMN F
             */
            const columnFValue=
                getColumnF(i);

            /*
             * COLUMN Q
             */
            const columnQValue=
                getColumnQValue(
                    columnFValue
                );

            return[

                "-",                       // A
                getPlanType(i),            // B
                duplicateComments,         // C
                disputeNumber,             // D
                id,                         // E
                disputeStatus,             // F
                "-",                       // G
                "-",                       // H
                "-",                       // I
                "-",                       // J
                columnJValue,              // K
                "N/A",                    // L
                "N/A",                    // M
                stateValue,               // N
                "-",                      // O
                "No",                     // P
                columnQValue              // Q

            ].join("\t");
        };

        return sameId
            ?makeNoRow(ids[0],0)
            :ids
                .map((id,i)=>
                    makeNoRow(id,i)
                )
                .join("\n");
    };

    /* =====================================================
       BUILD YES OUTPUT
       ===================================================== */

    const buildYesOutput=(
        stateValue,
        duplicateComments,
        disputeUserName,
        plantypeIdreEmail,
        verificationStatus
    )=>{

        const makeYesRow=(id,i)=>{

            /*
             * ACTUAL PAGE COLUMN F
             */
            const columnFValue=
                getColumnF(i);

            /*
             * COLUMN Q
             */
            const columnQValue=
                getColumnQValue(
                    columnFValue
                );

            return[

                plantypeIdreEmail,         // A
                getPlanType(i),            // B
                duplicateComments,         // C
                disputeNumber,             // D
                id,                         // E
                disputeStatus,             // F
                disputeUserName,           // G
                verificationStatus,        // H
                "-",                       // I
                "-",                       // J
                columnJValue,              // K
                "N/A",                    // L
                "N/A",                    // M
                stateValue,               // N
                "N/A",                    // O
                "Yes",                    // P
                columnQValue              // Q

            ].join("\t");
        };

        return sameId
            ?makeYesRow(ids[0],0)
            :ids
                .map((id,i)=>
                    makeYesRow(id,i)
                )
                .join("\n");
    };

    /* =====================================================
       NO
       ===================================================== */

    noBtn.onclick=()=>{

        if(!validateStateAndDuplicate()){
            return;
        }

        const stateValue=
            stateInput.value
                .trim()
                .toUpperCase();

        const duplicateComments=
            duplicateCommentsInput.value;

        const output=
            buildNoOutput(
                stateValue,
                duplicateComments
            );

        console.log(
            "FINAL OUTPUT:",
            output
        );

        const copied=
            copyText(output);

        overlay.remove();
        style.remove();

        const rowCount=
            sameId
            ?1
            :ids.length;

        const toast=
            showCopyMessage(

                copied

                ?`✅ Copied ${rowCount} row${rowCount!==1?"s":""} | Q generated from Column F | K: ${columnKValue||"N/A"}`

                :"❌ Automatic copy was blocked. Click COPY AGAIN below.",

                copied
            );

        toast
            .querySelector("#dct-message")
            .dataset.clipboard=
                output;

        resolve(null);
    };

    /* =====================================================
       YES
       ===================================================== */

    yesBtn.onclick=()=>{

        if(!validateStateAndDuplicate()){
            return;
        }

        yesExtra.style.display=
            "block";

        status.textContent=
            "Enter PLANTYPE_IDRE_EMAIL and select Verified: Yes or No.";

        emailInput.focus();
    };

    emailInput.onkeydown=e=>{

        if(e.key==="Enter"){

            e.preventDefault();

            continueBtn.click();
        }
    };

    verifiedInput.onchange=()=>{

        status.textContent=
            verifiedInput.value
            ?"Verified: "+verifiedInput.value
            :"";
    };

    /* =====================================================
       CONTINUE YES
       ===================================================== */

    continueBtn.onclick=()=>{

        if(!validateStateAndDuplicate()){
            return;
        }

        const email=
            emailInput.value.trim();

        if(!email){

            status.textContent=
                "Enter PLANTYPE_IDRE_EMAIL.";

            emailInput.focus();

            return;
        }

        const verificationStatus=
            verifiedInput.value;

        if(!verificationStatus){

            status.textContent=
                "Select Yes or No for Verified.";

            verifiedInput.focus();

            return;
        }

        const stateValue=
            stateInput.value
                .trim()
                .toUpperCase();

        const duplicateComments=
            duplicateCommentsInput.value;

        const output=
            buildYesOutput(

                stateValue,

                duplicateComments,

                currentName,

                email,

                verificationStatus
            );

        console.log(
            "FINAL OUTPUT:",
            output
        );

        const copied=
            copyText(output);

        overlay.remove();
        style.remove();

        const rowCount=
            sameId
            ?1
            :ids.length;

        const toast=
            showCopyMessage(

                copied

                ?`✅ Copied ${rowCount} row${rowCount!==1?"s":""} | Q generated from Column F | K: ${columnKValue||"N/A"}`

                :"❌ Automatic copy was blocked. Click COPY AGAIN below.",

                copied
            );

        toast
            .querySelector("#dct-message")
            .dataset.clipboard=
                output;

        resolve(null);
    };

    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    overlay.addEventListener(
        "keydown",
        e=>{

            if(
                !e.ctrlKey &&
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
                !e.ctrlKey &&
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

            /* ESC */

            if(e.key==="Escape"){

                e.preventDefault();

                overlay.remove();
                style.remove();

                resolve(null);

                return;
            }

            /* 0 = NO */

            if(
                e.key==="0" &&
                eligible.style.display==="block"
            ){

                e.preventDefault();

                noBtn.click();

                return;
            }

            /* 1 = YES */

            if(
                e.key==="1" &&
                eligible.style.display==="block"
            ){

                e.preventDefault();

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
