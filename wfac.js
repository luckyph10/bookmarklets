function getPHDate() {
    const now = new Date();

    // Convert current time to Philippine Time
    const phTime = new Date(
        now.toLocaleString('en-US', {
            timeZone: 'Asia/Manila'
        })
    );

    return phTime;
}

(function () {

const selectors = [
    '#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(6) > textarea',
    '#ngForm > fieldset > div:nth-child(1) > div:nth-child(1) > div:nth-child(7) > textarea'
];

let el = null;

for (const selector of selectors) {
    el = document.querySelector(selector);
    if (el) break;
}

if (!el) {
    alert(
        'Comment textbox not found.\n\n' +
        'Checked:\n' +
        '• div:nth-child(6) textarea\n' +
        '• div:nth-child(7) textarea'
    );
    return;
}

function businessDaysBetween(startDate,endDate){
    let count=0;

    let cur=new Date(startDate);
    cur.setHours(0,0,0,0);

    while(cur<endDate){
        cur.setDate(cur.getDate()+1);

        const day=cur.getDay();

        if(day!==0 && day!==6){
            count++;
        }
    }

    return count;
}

function checkRecentComment(textarea){

    const matches=(textarea.value||'').match(/\b\d{2}\/\d{2}\/\d{2}\b/g);

    if(!matches || !matches.length){
        return true;
    }

    let newest=null;
    let newestText='';

    matches.forEach(function(dt){

        const p=dt.split('/');

        const d=new Date(
            2000+parseInt(p[2],10),
            parseInt(p[0],10)-1,
            parseInt(p[1],10)
        );

        if(!newest || d>newest){
            newest=d;
            newestText=dt;
        }
    });

    if(!newest){
        return true;
    }

const today=getPHDate();
today.setHours(0,0,0,0);

    const days=businessDaysBetween(
        newest,
        today
    );

    if(days<=3){
        return confirm(
            'WARNING\n\n' +
            'A recent comment was found.\n\n' +
            'Most Recent Comment Date:\n' +
            newestText +
            '\n\nBusiness Days Since Comment:\n' +
            days +
            '\n\nDo you want to continue?'
        );
    }

    return true;
}

const items=[
    {header:false,text:'Self-Funded NSA eligible - Plan type review'},
    {header:false,text:'Balanced Funding NSA eligible - Plan type review'},
    {header:false,text:'Fully Insured NSA eligible - Plan type review'},
    {header:false,text:'Fully Insured (Opt In) NSA eligible - Plan type review'},
    {header:false,text:'Exchange/Marketplace NSA eligible - Plan type review'},
    {header:false,text:'Fully Insured BlueCard NSA eligible - Plan type review'},
    {header:false,text:'VOB pending. Verified, no evidence'},
    {header:false,text:'Additional Information Requested'},

    {header:true,text:'BATCH CASE DIFFERENT PLAN TYPE'},

    {header:false,text:'Plan type review'},

    {header:true,text:'REVIEW'},

    {header:false,text:'Reviewed, no action required'},
    {header:false,text:'VOB verified, no change to NSA jurisdiction'},
    {header:false,text:'Reviewed. Eligible. IDR Initiation document attached'},

    {header:true,text:'CLOSURE/CLOSED'},

    {header:false,text:'Email sent for closure'},
    {header:false,text:'Arbit ID AppID - Ineligible, closure has been verified'},
    {
        header:false,
        text:'IDRE sent email. DISP-XXXX has been closed',
        needsDisp:true
    }
];

const old=document.getElementById('afCommentPopup');

if(old){
    old.remove();
}

const popup=document.createElement('div');

popup.id='afCommentPopup';

popup.style.cssText=
    'position:fixed;' +
    'top:50%;' +
    'left:50%;' +
    'transform:translate(-50%,-50%);' +
    'width:1100px;' +
    'max-width:95vw;' +
    'max-height:85vh;' +
    'overflow:auto;' +
    'background:#fff;' +
    'border:4px solid #000;' +
    'padding:15px;' +
    'z-index:9999999;' +
    'font-family:Arial,sans-serif;' +
    'border-radius:10px;' +
    'box-shadow:0 0 25px rgba(0,0,0,.6);';

popup.innerHTML=
    '<div style="font-size:30px;font-weight:bold;color:#000;text-align:center;margin-bottom:15px;">Plan Type Comments.</div>';

const initialsWrap=document.createElement('div');

initialsWrap.style.cssText=
    'position:absolute;' +
    'top:10px;' +
    'left:10px;' +
    'display:flex;' +
    'align-items:center;' +
    'gap:5px;';

const initialsInput=document.createElement('input');

initialsInput.type='text';
initialsInput.placeholder='Initials';
initialsInput.maxLength=10;
initialsInput.value=localStorage.getItem('afCommentInitials')||'AF';

initialsInput.style.cssText=
    'width:80px;' +
    'padding:6px;' +
    'border:1px solid #000;' +
    'border-radius:4px;' +
    'font-weight:bold;' +
    'text-transform:uppercase;';

const saveBtn=document.createElement('button');

saveBtn.textContent='Save';

saveBtn.style.cssText=
    'padding:6px 10px;' +
    'background:#1976d2;' +
    'color:#fff;' +
    'border:none;' +
    'border-radius:4px;' +
    'cursor:pointer;' +
    'font-weight:bold;';

saveBtn.onclick=function(){

    const val=initialsInput.value
        .trim()
        .toUpperCase();

    if(!val){
        alert('Enter initials first.');
        return;
    }

    localStorage.setItem(
        'afCommentInitials',
        val
    );

    alert('Initials saved: '+val);
};

initialsWrap.appendChild(initialsInput);
initialsWrap.appendChild(saveBtn);

popup.appendChild(initialsWrap);

const topClose=document.createElement('button');

topClose.textContent='✕';

topClose.style.cssText=
    'position:absolute;' +
    'top:10px;' +
    'right:10px;' +
    'width:40px;' +
    'height:40px;' +
    'background:#000;' +
    'color:#fff;' +
    'border:none;' +
    'border-radius:6px;' +
    'font-size:22px;' +
    'font-weight:bold;' +
    'cursor:pointer;';

topClose.onclick=function(){
    popup.remove();
};

popup.appendChild(topClose);

items.forEach(function(item){

    if(item.header){

        const h=document.createElement('div');

        h.textContent=item.text;

        h.style.cssText=
            'background:#1976d2;' +
            'color:#fff;' +
            'font-weight:bold;' +
            'font-size:20px;' +
            'text-align:center;' +
            'padding:10px;' +
            'margin:10px 0 5px;' +
            'border-radius:6px;';

        popup.appendChild(h);

        return;
    }

    const btn=document.createElement('button');

    btn.textContent=item.text;

    btn.style.cssText=
        'display:block;' +
        'width:100%;' +
        'text-align:left;' +
        'margin:5px 0;' +
        'padding:12px;' +
        'border:2px solid #000;' +
        'border-radius:6px;' +
        'background:#f5f5f5;' +
        'cursor:pointer;' +
        'font-weight:bold;' +
        'font-size:18px;' +
        'line-height:1.5;' +
        'color:#000;';

    btn.onmouseover=function(){
        this.style.background='#e8e8e8';
    };

    btn.onmouseout=function(){
        this.style.background='#f5f5f5';
    };

    btn.onclick=function(){
                if(!checkRecentComment(el)){
            return;
        }

        let finalComment=item.text;

        if(item.needsDisp){

            const disp=prompt(
                'Enter Dispute Number (example: DISP-6731470)',
                ''
            );

            if(disp===null){
                return;
            }

            if(disp.trim()===''){
                alert('Dispute Number is required.');
                return;
            }

            finalComment=finalComment.replace(
                'DISP-XXXX',
                disp.trim()
            );
        }

        if((el.value||'').includes(finalComment)){

            const proceed=confirm(
                'WARNING\n\n' +
                'This comment already exists in the comment box.\n\n' +
                'Do you want to proceed anyway?'
            );

            if(!proceed){
                return;
            }
        }

        const initials=(
            localStorage.getItem('afCommentInitials') ||
            'AF'
        )
        .trim()
        .toUpperCase();

        const d=getPHDate();

        const mm=String(
            d.getMonth()+1
        ).padStart(2,'0');

        const dd=String(
            d.getDate()
        ).padStart(2,'0');

        const yy=String(
            d.getFullYear()
        ).slice(-2);

        const note=
    finalComment+
    ' - '+
    mm+'/'+dd+'/'+yy+
    ' - '+
    initials;

        el.value=
            note+
            (
                el.value.trim()
                ? '\n\n'+el.value
                : ''
            );

        el.dispatchEvent(
            new Event(
                'input',
                {bubbles:true}
            )
        );

        el.dispatchEvent(
            new Event(
                'change',
                {bubbles:true}
            )
        );

        popup.remove();
    };

    popup.appendChild(btn);
});

const close=document.createElement('button');

close.textContent='CLOSE';

close.style.cssText=
    'margin-top:10px;' +
    'padding:12px 25px;' +
    'background:#000;' +
    'color:#fff;' +
    'font-weight:bold;' +
    'font-size:16px;' +
    'border:none;' +
    'border-radius:6px;' +
    'cursor:pointer;';

close.onclick=function(){
    popup.remove();
};

popup.appendChild(close);

document.body.appendChild(popup);

})();
