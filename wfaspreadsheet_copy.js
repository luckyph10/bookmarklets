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


            <div id="dp-title">
                Dispute Information
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


        #dp-title{

            font-size:20px;

            font-weight:700;

            margin-bottom:20px;

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
       
       A B C D E F G H I J K L M N O P Q R

       A = PLANTYPE_IDRE_EMAIL
       B = ARBIT_PLAN_TYPE_LIST
       C = Plantype Mismatch
       D = Duplicate Comments
       E = DISPUTE #
       F = Arbit ID
       G = Dispute Review Status
       H = Dispute User
       I = Verified?
       J = Arbit Case Note
       K = Plan Type Evidence?
       L = Dispute Status
       M = Email sent to VOB?
       N = Email sent to Closures?
       O = State
       P = Non-Bifurcated
       Q = Eligible updated today
       R = Notes
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
                :"N/A",

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
            "========================================"
        );

        console.log(
            "FINAL 18-COLUMN ROW"
        );

        console.log("A:",row[0]);
        console.log("B:",row[1]);
        console.log("C - PLANTYPE MISMATCH:",row[2]);
        console.log("D - DUPLICATE COMMENTS:",row[3]);
        console.log("E - DISPUTE #:",row[4]);
        console.log("F - ARBIT ID:",row[5]);
        console.log("G - DISPUTE REVIEW STATUS:",row[6]);
        console.log("H - DISPUTE USER:",row[7]);
        console.log("I - VERIFIED:",row[8]);
        console.log("J - ARBIT CASE NOTE:",row[9]);
        console.log("K - PLAN TYPE EVIDENCE:",row[10]);
        console.log("L - DISPUTE STATUS:",row[11]);
        console.log("M - EMAIL VOB (ALWAYS N/A):",row[12]);
        console.log("N - EMAIL CLOSURES (ALWAYS N/A):",row[13]);
        console.log("O - STATE:",row[14]);
        console.log("P - NON-BIFURCATED (NO = N/A):",row[15]);
        console.log("Q - ELIGIBLE:",row[16]);
        console.log("R - NOTES:",row[17]);

        console.log(
            "ROW LENGTH:",
            row.length
        );

        console.log(
            "========================================"
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
            "========================================"
        );

        console.log(
            "FINAL COPY OUTPUT"
        );

        console.log(output);

        console.log(
            "Number of rows:",
            rows.length
        );

        console.log(
            "Number of columns per row:",
            18
        );

        console.log(
            "========================================"
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
       
       ALL SHORTCUTS REQUIRE CTRL

       CTRL + 2 = Duplicate Comments N/A
       CTRL + 3 = Duplicate Dispute Reviewed
       CTRL + 4 = Plantype Mismatch NO
       CTRL + 5 = Plantype Mismatch YES

       CTRL + 0 = Eligibility NO
       CTRL + 1 = Eligibility YES
       ===================================================== */

    overlay.addEventListener(
        "keydown",
        e=>{

            /* =================================================
               CTRL + 2
               DUPLICATE COMMENTS = N/A
               ================================================= */

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


            /* =================================================
               CTRL + 3
               DUPLICATE COMMENTS = REVIEWED
               ================================================= */

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


            /* =================================================
               CTRL + 4
               PLANTYPE MISMATCH = NO
               ================================================= */

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


            /* =================================================
               CTRL + 5
               PLANTYPE MISMATCH = YES
               ================================================= */

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


            /* =================================================
               ESC
               ================================================= */

            if(e.key==="Escape"){

                e.preventDefault();

                overlay.remove();
                style.remove();

                resolve(null);

                return;

            }


            /* =================================================
               CTRL + 0
               ELIGIBILITY = NO
               ================================================= */

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


            /* =================================================
               CTRL + 1
               ELIGIBILITY = YES
               ================================================= */

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
