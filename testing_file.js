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
   COPY TO CLIPBOARD
   ========================================================= */

const copyText=async text=>{

    /* First: normal Clipboard API */
    try{
        if(
            navigator.clipboard &&
            typeof navigator.clipboard.writeText==="function"
        ){
            await navigator.clipboard.writeText(text);
            return true;
        }
    }catch(e){
        console.warn("navigator.clipboard failed:",e);
    }

    /* Second: old execCommand fallback */
    try{
        const textarea=document.createElement("textarea");

        textarea.value=text;

        textarea.style.position="fixed";
        textarea.style.left="-9999px";
        textarea.style.top="0";
        textarea.style.width="1px";
        textarea.style.height="1px";
        textarea.style.opacity="0";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0,text.length);

        const result=document.execCommand("copy");

        textarea.remove();

        if(result){
            return true;
        }

    }catch(e){
        console.warn("execCommand copy failed:",e);
    }

    return false;
};

const popup=()=>new Promise(resolve=>{
    const old=document.getElementById("dispute-popup-overlay");
    if(old)old.remove();

    const oldStyle=document.getElementById("dispute-popup-style");
    if(oldStyle)oldStyle.remove();

    const overlay=document.createElement("div");
    overlay.id="dispute-popup-overlay";

    overlay.innerHTML=`
        <div id="dispute-popup">
            <button id="dp-close" title="Close">×</button>

            <div id="dp-title">Dispute Information</div>

            <div id="dp-label-name">Dispute User Name</div>
            <div id="dp-name-row">
                <input id="dp-name" type="text" placeholder="Enter Dispute User Name" autocomplete="off">
                <button id="dp-edit">Edit</button>
                <span id="dp-saved">Saved ✓</span>
                <button id="dp-save">Save</button>
            </div>

            <div id="dp-label-state">State</div>
            <div id="dp-state-row">
                <input id="dp-state" type="text" placeholder="Enter State" autocomplete="off">
                <button id="dp-go">Go</button>
            </div>

            <div id="dp-status"></div>

            <div id="dp-eligible" style="display:none">
                <div id="dp-eligible-title">Eligible updated today?</div>

                <div id="dp-eligible-buttons">
                    <button id="dp-no">NO</button>
                    <button id="dp-yes">YES</button>
                </div>

                <div id="dp-yes-extra" style="display:none">

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
                        Verified? (Yes/No)
                    </div>

                    <div id="dp-verified-buttons">
                        <button id="dp-verified-no">NO</button>
                        <button id="dp-verified-yes">YES</button>
                    </div>

                    <button id="dp-continue">
                        Continue
                    </button>

                </div>
            </div>
        </div>
    `;

    const style=document.createElement("style");
    style.id="dispute-popup-style";

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
            width:460px;
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
        #dp-label-verified{
            font-size:13px;
            font-weight:600;
            color:rgba(255,255,255,.9);
            margin:10px 0 7px
        }

        #dp-label-verified{
            margin-top:14px
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
        #dp-email{
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

        #dp-state,
        #dp-email{
            width:100%
        }

        #dp-name:read-only{
            background:rgba(255,255,255,.045);
            color:rgba(255,255,255,.72);
            cursor:default
        }

        #dp-name::placeholder,
        #dp-state::placeholder,
        #dp-email::placeholder{
            color:rgba(255,255,255,.5)
        }

        #dp-name:focus,
        #dp-state:focus,
        #dp-email:focus{
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

        #dp-verified-buttons{
            display:flex;
            gap:8px
        }

        #dp-verified-no,
        #dp-verified-yes{
            flex:1;
            height:42px;
            border-radius:10px;
            border:1px solid rgba(255,255,255,.2);
            color:#fff;
            font-size:14px;
            font-weight:700;
            cursor:pointer
        }

        #dp-verified-no{
            background:rgba(190,35,35,.88)
        }

        #dp-verified-no:hover{
            background:rgba(220,45,45,.95)
        }

        #dp-verified-yes{
            background:rgba(35,150,70,.9)
        }

        #dp-verified-yes:hover{
            background:rgba(45,175,80,.98)
        }

        #dp-verified-no:disabled,
        #dp-verified-yes:disabled{
            opacity:.55;
            cursor:not-allowed
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
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const nameInput=document.getElementById("dp-name");
    const stateInput=document.getElementById("dp-state");
    const editBtn=document.getElementById("dp-edit");
    const saveBtn=document.getElementById("dp-save");
    const savedLabel=document.getElementById("dp-saved");
    const goBtn=document.getElementById("dp-go");
    const closeBtn=document.getElementById("dp-close");
    const status=document.getElementById("dp-status");
    const eligible=document.getElementById("dp-eligible");
    const noBtn=document.getElementById("dp-no");
    const yesBtn=document.getElementById("dp-yes");
    const yesExtra=document.getElementById("dp-yes-extra");
    const emailInput=document.getElementById("dp-email");
    const verifiedNoBtn=document.getElementById("dp-verified-no");
    const verifiedYesBtn=document.getElementById("dp-verified-yes");
    const continueBtn=document.getElementById("dp-continue");

    let currentName=getName();
    let selectedChoice="";
    let verifiedChoice="";

    nameInput.value=currentName;

    if(currentName){
        nameInput.readOnly=true;
        editBtn.style.display="inline-block";
        saveBtn.style.display="none";
        savedLabel.style.display="inline-flex";
        status.textContent="Saved username: "+currentName;
    }else{
        nameInput.readOnly=false;
        editBtn.style.display="none";
        saveBtn.style.display="inline-block";
        savedLabel.style.display="none";
        status.textContent="Please enter and save your Dispute User Name.";
        nameInput.focus();
    }

    editBtn.onclick=()=>{
        nameInput.readOnly=false;
        nameInput.focus();
        nameInput.select();
        editBtn.style.display="none";
        saveBtn.style.display="inline-block";
        savedLabel.style.display="none";
        saveBtn.textContent="Save";
        status.textContent="Editing username...";
    };

    saveBtn.onclick=()=>{
        const n=nameInput.value.trim();

        if(!n){
            status.textContent="Enter a Dispute User Name first.";
            nameInput.focus();
            return;
        }

        if(!saveName(n)){
            status.textContent="Could not save the username.";
            return;
        }

        currentName=n;
        nameInput.value=currentName;
        nameInput.readOnly=true;
        editBtn.style.display="inline-block";
        saveBtn.style.display="none";
        savedLabel.style.display="inline-flex";
        status.textContent="Username saved.";
        stateInput.focus();
    };

    const resetVerified=()=>{
        verifiedChoice="";
        verifiedNoBtn.disabled=false;
        verifiedYesBtn.disabled=false;
    };

    const processState=()=>{
        if(!currentName){
            status.textContent="Please save your Dispute User Name first.";
            nameInput.focus();
            return;
        }

        const state=stateInput.value.trim();

        if(!state){
            status.textContent="Enter a State.";
            stateInput.focus();
            return;
        }

        stateInput.value=state.toUpperCase();
        eligible.style.display="block";
        yesExtra.style.display="none";

        selectedChoice="";
        resetVerified();

        goBtn.disabled=true;

        status.textContent="Choose eligibility to continue.";
        noBtn.focus();
    };

    goBtn.onclick=processState;

    stateInput.onkeydown=e=>{
        if(e.key==="Enter"){
            e.preventDefault();
            processState();
        }
    };

    const finish=eligibleToday=>{
        const state=stateInput.value.trim();

        if(!currentName||!state)return;

        overlay.remove();
        style.remove();

        resolve({
            state:state.toUpperCase(),
            disputeUserName:currentName,
            eligibleUpdatedToday:eligibleToday,
            plantypeIdreEmail:"",
            verified:""
        });
    };

    noBtn.onclick=()=>{
        selectedChoice="NO";

        yesExtra.style.display="none";
        emailInput.value="";

        resetVerified();

        finish("NO");
    };

    yesBtn.onclick=()=>{
        selectedChoice="YES";

        yesExtra.style.display="block";

        resetVerified();

        status.textContent=
            "Enter PLANTYPE_IDRE_EMAIL, then select Verified? (Yes/No).";

        emailInput.focus();
    };

    verifiedNoBtn.onclick=()=>{
        verifiedChoice="No";

        verifiedNoBtn.disabled=true;
        verifiedYesBtn.disabled=true;

        status.textContent="Verified: No";
    };

    verifiedYesBtn.onclick=()=>{
        verifiedChoice="Yes";

        verifiedNoBtn.disabled=true;
        verifiedYesBtn.disabled=true;

        status.textContent="Verified: Yes";
    };

    emailInput.onkeydown=e=>{
        if(e.key==="Enter"){
            e.preventDefault();
            continueBtn.click();
        }
    };

    continueBtn.onclick=()=>{
        const email=emailInput.value.trim();

        if(!email){
            status.textContent="Enter PLANTYPE_IDRE_EMAIL.";
            emailInput.focus();
            return;
        }

        if(!verifiedChoice){
            status.textContent="Choose Verified? (Yes/No).";
            return;
        }

        const state=stateInput.value.trim();

        if(!currentName||!state)return;

        overlay.remove();
        style.remove();

        resolve({
            state:state.toUpperCase(),
            disputeUserName:currentName,
            eligibleUpdatedToday:"YES",
            plantypeIdreEmail:email,
            verified:verifiedChoice
        });
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

/* =========================================================
   POPUP RESULT
   ========================================================= */

const input=await popup();

if(!input)return;

const stateValue=input.state;
const disputeUserName=input.disputeUserName;
const eligibleUpdatedToday=input.eligibleUpdatedToday;
const plantypeIdreEmail=input.plantypeIdreEmail||"";
const verified=input.verified||"";

/* =========================================================
   EXISTING PAGE VALUES
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
    console.error(
        "Missing Dispute Number, Dispute Status, or IDs.",
        {
            disputeNumber,
            disputeStatus,
            ids
        }
    );
    return;
}

const sameId=ids.every(id=>id===ids[0]);

const getPlanType=i=>planTypes[i]||planTypes[0]||"";

/* =========================================================
   NO ROW - UNCHANGED
   ========================================================= */

const makeNoRow=(id,i)=>[
    "-",
    getPlanType(i),
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

/* =========================================================
   YES ROW
   COLUMN G = verified
   ========================================================= */

const makeYesRow=(id,i)=>[
    plantypeIdreEmail,   // A
    getPlanType(i),      // B
    disputeNumber,       // C
    id,                  // D
    disputeStatus,       // E
    disputeUserName,     // F
    verified,            // G
    "-",                 // H
    "-",                 // I
    columnJValue,        // J
    "N/A",               // K
    "N/A",               // L
    stateValue,           // M
    "N/A",               // N
    "Yes"                 // O
].join("\t");

/* =========================================================
   OUTPUT
   ========================================================= */

const output=
    eligibleUpdatedToday==="YES"
    ?(
        sameId
        ?makeYesRow(ids[0],0)
        :ids.map((id,i)=>makeYesRow(id,i)).join("\n")
    )
    :(
        sameId
        ?makeNoRow(ids[0],0)
        :ids.map((id,i)=>makeNoRow(id,i)).join("\n")
    );

/* =========================================================
   COPY
   ========================================================= */

const copied=await copyText(output);

const rowCount=sameId?1:ids.length;

if(copied){

    const t=document.createElement("div");

    t.textContent=
        eligibleUpdatedToday==="YES"
        ?`✅ Copied ${rowCount} row${rowCount!==1?"s":""} | YES | State: ${stateValue} | Email: ${plantypeIdreEmail} | Verified: ${verified} | User: ${disputeUserName}`
        :`✅ Copied ${rowCount} row${rowCount!==1?"s":""} | NO | State: ${stateValue} | User: ${disputeUserName}`;

    t.style.cssText=
        "position:fixed;top:80px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:14px;background:rgba(0,0,0,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;font:600 14px Arial,sans-serif;z-index:2147483647;box-shadow:0 8px 32px rgba(0,0,0,.35)";

    document.body.appendChild(t);

    setTimeout(()=>{
        t.style.transition="opacity .3s";
        t.style.opacity="0";

        setTimeout(()=>t.remove(),300);
    },2000);

}else{

    /*
       Final manual fallback.
       The actual Excel data is shown and selected.
    */

    const old=document.getElementById("dp-copy-fallback");

    if(old)old.remove();

    const copyBox=document.createElement("div");

    copyBox.id="dp-copy-fallback";

    copyBox.innerHTML=`
        <div id="dp-copy-window">

            <div style="
                font-size:18px;
                font-weight:700;
                margin-bottom:8px;
            ">
                Clipboard Copy Failed
            </div>

            <div style="
                font-size:13px;
                color:rgba(255,255,255,.7);
                margin-bottom:12px;
            ">
                Your Excel data is ready. Click COPY or press Ctrl+C.
            </div>

            <textarea
                id="dp-copy-text"
                spellcheck="false"
            ></textarea>

            <button id="dp-copy-now">
                COPY
            </button>

            <button id="dp-copy-close">
                CLOSE
            </button>

        </div>
    `;

    const copyStyle=document.createElement("style");

    copyStyle.id="dp-copy-fallback-style";

    copyStyle.textContent=`
        #dp-copy-fallback{
            position:fixed;
            inset:0;
            z-index:2147483647;
            background:rgba(0,0,0,.4);
            display:flex;
            align-items:flex-start;
            justify-content:center;
            padding-top:100px;
            box-sizing:border-box;
        }

        #dp-copy-window{
            width:700px;
            max-width:calc(100vw - 30px);
            background:#151515;
            border:1px solid rgba(255,255,255,.2);
            border-radius:16px;
            padding:20px;
            box-shadow:0 20px 60px rgba(0,0,0,.55);
            color:#fff;
            font-family:Arial,sans-serif;
            box-sizing:border-box;
        }

        #dp-copy-text{
            width:100%;
            height:220px;
            box-sizing:border-box;
            resize:vertical;
            background:#080808;
            color:#fff;
            border:1px solid rgba(255,255,255,.2);
            border-radius:10px;
            padding:12px;
            font-family:monospace;
            font-size:12px;
            outline:none;
        }

        #dp-copy-now,
        #dp-copy-close{
            margin-top:10px;
            height:40px;
            padding:0 18px;
            border:0;
            border-radius:9px;
            color:#fff;
            font-weight:700;
            cursor:pointer;
        }

        #dp-copy-now{
            background:rgba(35,150,70,.95);
        }

        #dp-copy-close{
            background:rgba(255,255,255,.14);
            margin-left:6px;
        }
    `;

    document.head.appendChild(copyStyle);
    document.body.appendChild(copyBox);

    const copyTextArea=
        document.getElementById("dp-copy-text");

    const copyNow=
        document.getElementById("dp-copy-now");

    const copyClose=
        document.getElementById("dp-copy-close");

    copyTextArea.value=output;

    copyTextArea.focus();
    copyTextArea.select();
    copyTextArea.setSelectionRange(
        0,
        copyTextArea.value.length
    );

    copyNow.onclick=async()=>{

        const success=
            await copyText(output);

        if(success){

            copyNow.textContent="COPIED ✓";

            setTimeout(()=>{
                copyBox.remove();
                copyStyle.remove();
            },700);

        }else{

            copyNow.textContent="PRESS CTRL+C";

            copyTextArea.focus();
            copyTextArea.select();
            copyTextArea.setSelectionRange(
                0,
                copyTextArea.value.length
            );
        }
    };

    copyClose.onclick=()=>{
        copyBox.remove();
        copyStyle.remove();
    };
}

})();
