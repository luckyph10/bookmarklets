(async()=>{
const KEY="disputeUserName";

const getName=()=>{
    try{return(localStorage.getItem(KEY)||"").trim()}
    catch(e){return""}
};

const saveName=n=>{
    try{
        localStorage.setItem(KEY,n);
        return true
    }catch(e){
        console.error(e);
        return false
    }
};

/* =========================================================
   GET PAGE DATA BEFORE POPUP
   ========================================================= */

const disputeNumber=
    document.querySelector(
        "#ngForm fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input"
    )?.value?.trim();

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

const columnJValue=
    document.querySelector(
        "#ngForm > fieldset > div > div:nth-child(1) > div:nth-child(2) > ng-select > div > div > div.ng-value > span.ng-value-label"
    )?.textContent?.trim()||"";

const ids=[
    ...document.querySelectorAll("#table-body tr td:nth-child(2)")
]
.map(td=>td.textContent.trim())
.filter(Boolean);

const planTypes=[
    ...document.querySelectorAll('[id^="planType_"]')
]
.map(el=>(el.innerText||el.textContent||el.value||"").trim())
.filter(Boolean);

if(!disputeNumber||!disputeStatus||!ids.length){
    console.error("Missing Dispute Number, Dispute Status, or IDs.");
    return;
}

const sameId=ids.every(id=>id===ids[0]);

const getPlanType=i=>planTypes[i]||planTypes[0]||"";

/* =========================================================
   CLIPBOARD FUNCTION
   ========================================================= */

const copyText=function(text){

    try{
        if(
            navigator.clipboard &&
            typeof navigator.clipboard.writeText==="function"
        ){
            const result=navigator.clipboard.writeText(text);

            if(result && typeof result.catch==="function"){
                result.catch(e=>{
                    console.warn("Clipboard API rejected:",e);
                });
            }

            return true;
        }
    }catch(e){
        console.warn("Clipboard API failed:",e);
    }

    try{
        const textarea=document.createElement("textarea");

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
        textarea.setSelectionRange(0,text.length);

        const copied=document.execCommand("copy");

        textarea.remove();

        return copied;

    }catch(e){
        console.error("Clipboard fallback failed:",e);
        return false;
    }
};

/* =========================================================
   SHOW COPY MESSAGE
   ========================================================= */

const showCopyMessage=(message,success=true,clipboardText="")=>{

    const old=document.getElementById("dispute-copy-toast");
    if(old)old.remove();

    const toast=document.createElement("div");
    toast.id="dispute-copy-toast";

    toast.innerHTML=`
        <div id="dct-message"></div>
        <button id="dct-copy">COPY AGAIN</button>
    `;

    toast.style.cssText=
        "position:fixed;top:80px;left:50%;transform:translateX(-50%);padding:14px 16px;border-radius:14px;background:rgba(0,0,0,.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;font:600 14px Arial,sans-serif;z-index:2147483647;box-shadow:0 8px 32px rgba(0,0,0,.4);min-width:360px;text-align:center;box-sizing:border-box";

    const messageEl=
        toast.querySelector("#dct-message");

    const copyAgainBtn=
        toast.querySelector("#dct-copy");

    messageEl.textContent=message;
    messageEl.dataset.clipboard=clipboardText;

    copyAgainBtn.style.cssText=
        "margin-top:10px;height:36px;padding:0 16px;border:1px solid rgba(255,255,255,.25);border-radius:9px;background:rgba(35,150,70,.9);color:#fff;font:700 13px Arial,sans-serif;cursor:pointer";

    copyAgainBtn.onclick=()=>{

        const text=
            messageEl.dataset.clipboard||"";

        const ok=copyText(text);

        copyAgainBtn.textContent=
            ok?"COPIED ✓":"COPY FAILED";

        copyAgainBtn.style.background=
            ok
            ?"rgba(35,150,70,.9)"
            :"rgba(190,35,35,.9)";

        if(ok){

            setTimeout(()=>{
                copyAgainBtn.textContent="COPY AGAIN";
                copyAgainBtn.style.background=
                    "rgba(35,150,70,.9)";
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

                if(toast.parentNode){
                    toast.remove();
                }

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
        document.getElementById("dispute-popup-overlay");

    if(old)old.remove();

    const overlay=
        document.createElement("div");

    overlay.id=
        "dispute-popup-overlay";

    overlay.innerHTML=`
        <div id="dispute-popup">

            <button id="dp-close" title="Close">
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

                    <option value="">
                        Duplicate Comments
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


                    <!-- NEW: Arbit Case Note -->

                    <div id="dp-label-arbit-case-note">
                        Arbit Case Note
                    </div>

                    <input
                        id="dp-arbit-case-note"
                        type="text"
                        placeholder="Enter Arbit Case Note"
                        autocomplete="off"
                    >


                    <!-- NEW: Plan Type Evidence -->

                    <div id="dp-label-plan-type-evidence">
                        Plan Type Evidence
                    </div>

                    <select id="dp-plan-type-evidence">

                        <option value="">
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


                    <button id="dp-continue">
                        Continue
                    </button>

                </div>

            </div>

        </div>
    `;


    const style=
        document.createElement("style");

    style.id=
        "dispute-popup-style";

    style.textContent=`

        #dispute-popup-overlay{
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index:2147483647;
            pointer-events:none
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
            background:rgba(0,0,0,.76);
            border:1px solid rgba(255,255,255,.18);
            box-shadow:0 15px 45px rgba(0,0,0,.45);
            backdrop-filter:blur(14px);
            -webkit-backdrop-filter:blur(14px);
            font-family:Arial,sans-serif;
            color:#fff;
            box-sizing:border-box
        }

        #dp-title{
            font-size:20px;
            font-weight:700;
            margin-bottom:20px;
            padding-right:35px
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
            line-height:30px;
            cursor:pointer
        }

        #dp-close:hover{
            background:rgba(255,255,255,.14)
        }

        #dp-label-name,
        #dp-label-state,
        #dp-label-email,
        #dp-label-verified,
        #dp-label-arbit-case-note,
        #dp-label-plan-type-evidence{
            font-size:13px;
            font-weight:600;
            color:rgba(255,255,255,.9);
            margin:10px 0 7px
        }

        #dp-name-row,
        #dp-state-row{
            display:flex;
            gap:8px;
            width:100%;
            align-items:center
        }

        #dp-name,
        #dp-state,
        #dp-email,
        #dp-verified,
        #dp-duplicate-comments,
        #dp-arbit-case-note,
        #dp-plan-type-evidence{

            height:42px;
            box-sizing:border-box;
            border:1px solid rgba(255,255,255,.25);
            border-radius:10px;
            background:rgba(255,255,255,.09);
            color:#fff;
            outline:none;
            padding:0 12px;
            font-size:14px

        }

        #dp-name{
            flex:1;
            min-width:0
        }

        #dp-state{
            flex:1;
            min-width:0
        }

        #dp-duplicate-comments{
            width:220px;
            flex-shrink:0;
            cursor:pointer
        }

        #dp-email,
        #dp-verified,
        #dp-arbit-case-note,
        #dp-plan-type-evidence{
            width:100%
        }

        #dp-verified,
        #dp-plan-type-evidence,
        #dp-duplicate-comments{
            cursor:pointer
        }

        #dp-verified option,
        #dp-plan-type-evidence option,
        #dp-duplicate-comments option{
            background:#222;
            color:#fff
        }

        #dp-name:read-only{
            background:rgba(255,255,255,.045);
            color:rgba(255,255,255,.72);
            cursor:default
        }

        #dp-name::placeholder,
        #dp-state::placeholder,
        #dp-email::placeholder,
        #dp-arbit-case-note::placeholder{
            color:rgba(255,255,255,.5)
        }

        #dp-name:focus,
        #dp-state:focus,
        #dp-email:focus,
        #dp-verified:focus,
        #dp-duplicate-comments:focus,
        #dp-arbit-case-note:focus,
        #dp-plan-type-evidence:focus{

            border-color:rgba(255,255,255,.65);
            box-shadow:0 0 0 3px rgba(255,255,255,.08)

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
            white-space:nowrap

        }

        #dp-edit:hover,
        #dp-save:hover,
        #dp-go:hover{
            background:rgba(255,255,255,.24)
        }

        #dp-go{
            background:rgba(35,150,70,.9);
            border-color:rgba(35,150,70,.65)
        }

        #dp-go:hover{
            background:rgba(45,175,80,.98)
        }

        #dp-go:disabled{

            background:rgba(35,150,70,.45);
            border-color:rgba(35,150,70,.35);
            color:rgba(255,255,255,.65);
            cursor:not-allowed

        }

        #dp-save{
            display:none
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
            white-space:nowrap

        }

        #dp-status{

            margin-top:9px;
            font-size:12px;
            color:rgba(255,255,255,.65);
            min-height:16px

        }

        #dp-eligible{

            margin-top:16px;
            padding-top:14px;
            border-top:1px solid rgba(255,255,255,.14)

        }

        #dp-eligible-title{

            font-size:13px;
            font-weight:600;
            color:rgba(255,255,255,.9);
            margin-bottom:9px

        }

        #dp-eligible-buttons{

            display:flex;
            gap:8px

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
            cursor:pointer

        }

        #dp-no{
            background:rgba(190,35,35,.88)
        }

        #dp-no:hover{
            background:rgba(220,45,45,.95)
        }

        #dp-yes{
            background:rgba(30,95,190,.9)
        }

        #dp-yes:hover{
            background:rgba(40,115,220,.98)
        }

        #dp-yes-extra{

            margin-top:14px;
            padding-top:14px;
            border-top:1px solid rgba(255,255,255,.14)

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
            cursor:pointer

        }

        #dp-continue:hover{
            background:rgba(45,175,80,.98)
        }

        @media(max-width:650px){

            #dp-state-row{
                flex-wrap:wrap
            }

            #dp-state{
                width:100%;
                flex:none
            }

            #dp-duplicate-comments{
                flex:1;
                width:auto
            }

            #dp-go{
                width:auto
            }

        }

    `;


    document.head.appendChild(style);
    document.body.appendChild(overlay);


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

    const arbitCaseNoteInput=
        document.getElementById(
            "dp-arbit-case-note"
        );

    const planTypeEvidenceInput=
        document.getElementById(
            "dp-plan-type-evidence"
        );

    const continueBtn=
        document.getElementById("dp-continue");


    let currentName=getName();


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

        saveBtn.textContent=
            "Save";

        status.textContent=
            "Editing username...";

    };


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


    /*
      GO applies to BOTH:
      State
      Duplicate Comments
    */

    const processStateAndDuplicate=()=>{

        if(!currentName){

            status.textContent=
                "Please save your Dispute User Name first.";

            nameInput.focus();

            return;
        }

        const state=
            stateInput.value.trim();

        if(!state){

            status.textContent=
                "Enter a State.";

            stateInput.focus();

            return;
        }

        const duplicateComments=
            duplicateCommentsInput.value;

        if(!duplicateComments){

            status.textContent=
                "Select Duplicate Comments.";

            duplicateCommentsInput.focus();

            return;
        }

        stateInput.value=
            state.toUpperCase();

        eligible.style.display=
            "block";

        yesExtra.style.display=
            "none";

        verifiedInput.value=
            "";

        arbitCaseNoteInput.value=
            "";

        planTypeEvidenceInput.value=
            "";

        goBtn.disabled=
            true;

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


    duplicateCommentsInput.onkeydown=e=>{

        if(e.key==="Enter"){

            e.preventDefault();

            processStateAndDuplicate();

        }

    };


    /*
      Build NO output.

      A = -
      B = Plan Type
      C = Duplicate Comments
      D = Dispute Number
      E = ID
      F = Dispute Status
      G = -
      H = -
      I = -
      J = -
      K = Existing Column J Value
      L = N/A
      M = N/A
      N = State
      O = -
      P = No
    */

    const buildNoOutput=
        (stateValue,duplicateComments)=>{

            const makeNoRow=(id,i)=>[

                "-",
                getPlanType(i),
                duplicateComments,
                disputeNumber,
                id,
                disputeStatus,
                "-",
                "-",
                "-",
                "-",
                columnJValue,
                "N/A",
                "N/A",
                stateValue,
                "-",
                "No"

            ].join("\t");


            return sameId
                ?makeNoRow(ids[0],0)
                :ids.map(
                    (id,i)=>
                        makeNoRow(id,i)
                ).join("\n");

        };


    /*
      Build YES output.

      A = PLANTYPE_IDRE_EMAIL
      B = Plan Type
      C = Duplicate Comments
      D = Dispute Number
      E = ID
      F = Dispute Status
      G = Dispute User Name
      H = Verified
      I = Arbit Case Note
      J = Plan Type Evidence
      K = Existing Column J Value
      L = N/A
      M = N/A
      N = State
      O = N/A
      P = Yes
    */

    const buildYesOutput=(
        stateValue,
        duplicateComments,
        disputeUserName,
        plantypeIdreEmail,
        verificationStatus,
        arbitCaseNote,
        planTypeEvidence
    )=>{

        const makeYesRow=(id,i)=>[

            plantypeIdreEmail,
            getPlanType(i),
            duplicateComments,
            disputeNumber,
            id,
            disputeStatus,
            disputeUserName,
            verificationStatus,
            arbitCaseNote,
            planTypeEvidence,
            columnJValue,
            "N/A",
            "N/A",
            stateValue,
            "N/A",
            "Yes"

        ].join("\t");


        return sameId
            ?makeYesRow(ids[0],0)
            :ids.map(
                (id,i)=>
                    makeYesRow(id,i)
            ).join("\n");

    };


    /*
      NO BUTTON

      Copy occurs directly from the NO button click
      so clipboard permission is retained.
    */

    noBtn.onclick=()=>{

        const stateValue=
            stateInput.value
                .trim()
                .toUpperCase();

        const duplicateComments=
            duplicateCommentsInput.value;

        if(!stateValue){

            status.textContent=
                "Enter a State.";

            stateInput.focus();

            return;
        }

        if(!duplicateComments){

            status.textContent=
                "Select Duplicate Comments.";

            duplicateCommentsInput.focus();

            return;
        }


        const output=
            buildNoOutput(
                stateValue,
                duplicateComments
            );


        const copied=
            copyText(output);


        overlay.remove();
        style.remove();


        const rowCount=
            sameId?1:ids.length;


        showCopyMessage(

            copied

            ?`✅ Copied ${rowCount} row${rowCount!==1?"s":""} | NO | State: ${stateValue} | Duplicate Comments: ${duplicateComments}`

            :"❌ Automatic copy was blocked. Click COPY AGAIN below.",

            copied,

            output

        );


        resolve(null);

    };


    /*
      YES BUTTON
    */

    yesBtn.onclick=()=>{

        yesExtra.style.display=
            "block";

        status.textContent=
            "Enter PLANTYPE_IDRE_EMAIL, select Verified, enter Arbit Case Note, and select Plan Type Evidence.";

        emailInput.focus();

    };


    /*
      ENTER KEY FOR EMAIL
    */

    emailInput.onkeydown=e=>{

        if(e.key==="Enter"){

            e.preventDefault();

            continueBtn.click();

        }

    };


    /*
      ENTER KEY FOR ARBIT CASE NOTE
      Also allows Enter to Continue.
    */

    arbitCaseNoteInput.onkeydown=e=>{

        if(e.key==="Enter"){

            e.preventDefault();

            continueBtn.click();

        }

    };


    /*
      ENTER KEY FOR PLAN TYPE EVIDENCE
    */

    planTypeEvidenceInput.onkeydown=e=>{

        if(e.key==="Enter"){

            e.preventDefault();

            continueBtn.click();

        }

    };


    /*
      ENTER KEY FOR VERIFIED
    */

    verifiedInput.onkeydown=e=>{

        if(e.key==="Enter"){

            e.preventDefault();

            continueBtn.click();

        }

    };


    verifiedInput.onchange=()=>{

        if(verifiedInput.value==="Yes"){

            status.textContent=
                "Verified: Yes";

        }else if(
            verifiedInput.value==="No"
        ){

            status.textContent=
                "Verified: No";

        }

    };


    /*
      PLAN TYPE EVIDENCE CHANGE
    */

    planTypeEvidenceInput.onchange=()=>{

        if(planTypeEvidenceInput.value){

            status.textContent=
                "Plan Type Evidence: "+
                planTypeEvidenceInput.value;

        }

    };


    /*
      CONTINUE

      Saves ALL YES fields:

      PLANTYPE_IDRE_EMAIL
      Verified
      Arbit Case Note
      Plan Type Evidence

      And copies directly from Continue.
    */

    continueBtn.onclick=()=>{

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


        const arbitCaseNote=
            arbitCaseNoteInput.value.trim();


        if(!arbitCaseNote){

            status.textContent=
                "Enter Arbit Case Note.";

            arbitCaseNoteInput.focus();

            return;
        }


        const planTypeEvidence=
            planTypeEvidenceInput.value;


        if(!planTypeEvidence){

            status.textContent=
                "Select Plan Type Evidence.";

            planTypeEvidenceInput.focus();

            return;
        }


        const stateValue=
            stateInput.value
                .trim()
                .toUpperCase();


        const duplicateComments=
            duplicateCommentsInput.value;


        if(!stateValue){

            status.textContent=
                "Enter a State.";

            stateInput.focus();

            return;
        }


        if(!duplicateComments){

            status.textContent=
                "Select Duplicate Comments.";

            duplicateCommentsInput.focus();

            return;
        }


        const output=
            buildYesOutput(

                stateValue,

                duplicateComments,

                currentName,

                email,

                verificationStatus,

                arbitCaseNote,

                planTypeEvidence

            );


        /*
          COPY DIRECTLY FROM CONTINUE BUTTON CLICK
        */

        const copied=
            copyText(output);


        overlay.remove();
        style.remove();


        const rowCount=
            sameId?1:ids.length;


        showCopyMessage(

            copied

            ?`✅ Copied ${rowCount} row${rowCount!==1?"s":""} | YES | State: ${stateValue} | Duplicate Comments: ${duplicateComments} | Email: ${email} | Verified: ${verificationStatus} | Arbit Case Note: ${arbitCaseNote} | Evidence: ${planTypeEvidence}`

            :"❌ Automatic copy was blocked. Click COPY AGAIN below.",

            copied,

            output

        );


        resolve(null);

    };


    closeBtn.onclick=()=>{

        overlay.remove();

        style.remove();

        resolve(null);

    };


    overlay.onkeydown=e=>{

        if(e.key==="Escape"){

            overlay.remove();

            style.remove();

            resolve(null);

        }


        if(
            e.key==="0" &&
            eligible.style.display==="block"
        ){

            e.preventDefault();

            noBtn.click();

        }


        if(
            e.key==="1" &&
            eligible.style.display==="block"
        ){

            e.preventDefault();

            yesBtn.click();

        }

    };


    stateInput.focus();

});


await popup();

})();
