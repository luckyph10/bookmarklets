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
   GET THE SOURCE K VALUE
   =========================================================

   This is retained for debugging, but IMPORTANT:

   The actual K in our copied row is columnJValue.

   Therefore Q will use the actual K that gets put into
   the copied row.
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
    "Actual F that will be copied:",
    disputeStatus
);

console.log(
    "Actual K that will be copied:",
    columnJValue
);

console.log(
    "Other page K value:",
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
   =========================================================
   COLUMN F + COLUMN K -> COLUMN Q
   =========================================================
   =========================================================

   THIS FUNCTION IS THE IMPORTANT PART.

   It receives the EXACT values that are going into:

       COLUMN F
       COLUMN K

   and returns what goes into:

       COLUMN Q

   Therefore there is no longer a mismatch between the
   source values and the copied Excel columns.
   ========================================================= */

const getColumnQValue=(sourceF,sourceK)=>{

    const F=
        normalizeValue(sourceF);

    const K=
        normalizeValue(sourceK);


    console.log(
        "Q RULE CHECK",
        {
            F:sourceF,
            normalizedF:F,
            K:sourceK,
            normalizedK:K
        }
    );


    /* =====================================================
       K = CLOSED
       =====================================================

       K has priority.
       ===================================================== */

    if(
        K==="closed"||
        K.includes("closed")
    ){

        return(
            "Completed. Dispute is Closed Due to Receiving Payment Determination."
        );

    }


    /* =====================================================
       F = PLAN TYPE VALIDATED
       ===================================================== */

    if(
        F.includes(
            "plan type validated post idr initiation"
        )
    ){

        return(
            "VOB verified, Plan Type Validated Post IDR Initiation – Eligible (Federal NSA)"
        );

    }


    /* =====================================================
       F = PLAN TYPE OBJECTION SUBMITTED
       ===================================================== */

    if(
        F.includes(
            "plan type objection submitted"
        )
    ){

        return(
            "Already completed by Onshore"
        );

    }


    /* =====================================================
       F = ADDITIONAL INFO EMAIL
       ===================================================== */

    if(
        F.includes(
            "additional info provided to idre through email"
        )
    ){

        return(
            "Additional Info provided to IDRE through email"
        );

    }


    /* =====================================================
       F = ADDITIONAL INFO PORTAL
       ===================================================== */

    if(
        F.includes(
            "additional info provided to idre through portal"
        )
    ){

        return(
            "Additional Info provided to IDRE through email"
        );

    }


    /* =====================================================
       NO MATCH
       ===================================================== */

    console.warn(
        "NO F/K RULE MATCHED",
        {
            F:sourceF,
            K:sourceK
        }
    );

    return"";

};


/* =========================================================
   IMPORTANT TEST
   =========================================================

   Test using the ACTUAL F and K that will be copied.
   ========================================================= */

console.log(
    "========================================"
);

console.log(
    "Q TEST"
);

console.log(
    "F =",
    disputeStatus
);

console.log(
    "K =",
    columnJValue
);

console.log(
    "Q =",
    getColumnQValue(
        disputeStatus,
        columnJValue
    )
);

console.log(
    "========================================"
);


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

            border:
                1px solid
                rgba(255,255,255,.18);

            box-shadow:
                0 15px 45px
                rgba(0,0,0,.45);

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
        #dp-label-email,
        #dp-label-verified{

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
        #dp-verified,
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

            background:
                rgba(255,255,255,.045);

            color:
                rgba(255,255,255,.72);

        }


        #dp-name::placeholder,
        #dp-state::placeholder,
        #dp-email::placeholder{

            color:
                rgba(255,255,255,.5);

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


        #dp-go{

            background:
                rgba(35,150,70,.9);

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


        #dp-yes{

            background:
                rgba(30,95,190,.9);

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
       VALIDATE
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


        return true;

    };


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

        verifiedInput.value="";

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
       =====================================================

       THIS IS WHERE WE GUARANTEE Q.

       The array has EXACTLY 17 values:

       A B C D E F G H I J K L M N O P Q

       Q is the LAST value.
       ===================================================== */

    const buildRow=(
        id,
        i,
        stateValue,
        duplicateComments,
        isYes,
        disputeUserName="",
        email="",
        verificationStatus=""
    )=>{


        /* ================================================
           ACTUAL COLUMN F
           ================================================ */

        const actualF=
            disputeStatus;


        /* ================================================
           ACTUAL COLUMN K
           ================================================ */

        const actualK=
            columnJValue;


        /* ================================================
           CALCULATE Q FROM ACTUAL F + ACTUAL K
           ================================================ */

        const actualQ=
            getColumnQValue(
                actualF,
                actualK
            );


        /* ================================================
           CREATE EXACT 17 COLUMNS
           ================================================ */

        const row=[

            isYes
                ?email
                :"-",                         // A

            getPlanType(i),                  // B

            duplicateComments,              // C

            disputeNumber,                  // D

            id,                              // E

            actualF,                         // F

            isYes
                ?disputeUserName
                :"-",                         // G

            isYes
                ?verificationStatus
                :"-",                         // H

            "-",                             // I

            "-",                             // J

            actualK,                          // K

            "N/A",                            // L

            "N/A",                            // M

            stateValue,                       // N

            isYes
                ?"N/A"
                :"-",                         // O

            isYes
                ?"Yes"
                :"No",                        // P

            actualQ                           // Q

        ];


        /* ================================================
           VERIFY 17 COLUMNS
           ================================================ */

        if(row.length!==17){

            console.error(
                "ERROR: ROW DOES NOT HAVE 17 COLUMNS!",
                row,
                "Length:",
                row.length
            );

        }


        console.log(
            "FINAL ROW",
            {
                A:row[0],
                B:row[1],
                C:row[2],
                D:row[3],
                E:row[4],
                F:row[5],
                G:row[6],
                H:row[7],
                I:row[8],
                J:row[9],
                K:row[10],
                L:row[11],
                M:row[12],
                N:row[13],
                O:row[14],
                P:row[15],
                Q:row[16]
            }
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
        verificationStatus=""
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
                    verificationStatus
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
                    verificationStatus
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


        const output=
            buildOutput(
                stateValue,
                duplicateComments,
                false
            );


        const copied=
            await copyText(output);


        overlay.remove();
        style.remove();


        const rowCount=
            sameId
            ?1
            :ids.length;


        const toast=
            showCopyMessage(

                copied
                ?`✅ COPIED ${rowCount} ROW${rowCount!==1?"S":""} — COLUMN Q FILLED`
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
            "Enter PLANTYPE_IDRE_EMAIL and select Verified.";

        emailInput.focus();

    };


    /* =====================================================
       CONTINUE YES
       ===================================================== */

    continueBtn.onclick=async()=>{

        if(!validate())
            return;


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
            buildOutput(
                stateValue,
                duplicateComments,
                true,
                currentName,
                email,
                verificationStatus
            );


        const copied=
            await copyText(output);


        overlay.remove();
        style.remove();


        const rowCount=
            sameId
            ?1
            :ids.length;


        const toast=
            showCopyMessage(

                copied
                ?`✅ COPIED ${rowCount} ROW${rowCount!==1?"S":""} — COLUMN Q FILLED`
                :`❌ COPY FAILED — CLICK COPY AGAIN`,

                output

            );


        resolve(null);

    };


    /* =====================================================
       KEYBOARD
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

                status.textContent=
                    "Duplicate Dispute Comments: Duplicate Dispute Reviewed";

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
                e.key==="0" &&
                eligible.style.display==="block"
            ){

                e.preventDefault();

                noBtn.click();

                return;

            }


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
