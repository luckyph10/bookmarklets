(async () => {
  const E = [
    /no\s*ssl/i,
    /federal\s*idr\s*process/i,
    /rarc\s*code\s*n859/i,
    /self[-\s]*funded/i,
    /erisa/i,
    /oos/i,
    /out\s*of\s*state/i,
    /anthem\s*bcbs\s*ohio/i,
    /balanced\s*funding/i,
    /exchange\s*\/?\s*marketplace/i,
    /fully\s*insured/i,
    /fully\s*insured\s*-\s*over\s*65/i,
    /fully\s*insured\s*\(opt\s*in\)/i,
    /fully\s*insured\s*bluecard/i
  ];

  // =========================
  // OPEN NEW DROPDOWN FIRST
  // =========================
  const dropBtn = document.querySelector(
    '#ngForm > fieldset > div:nth-child(24) > div.d-flex.mb-2 > button'
  );

  if (dropBtn) {
    const collapse = document.querySelector(
      '#ngForm > fieldset > div:nth-child(24) > div.collapse'
    );

    if (collapse && !collapse.classList.contains('show')) {
      dropBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // =========================
  // VOB HISTORY
  // =========================
  let vDate = '';
  let vNote = '';
  let vTime = 0;

  const btn = document.querySelector(
    '#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.small.text-muted.d-inline-flex.align-items-center.gap-1.user-select-none'
  );

  if (btn) {
    const panel = document.querySelector(
      '#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small'
    );

    if (panel && !panel.classList.contains('show')) {
      btn.click();
      await new Promise(r => setTimeout(r, 500));
    }

    const vd = document.querySelector(
      '#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.d-flex.align-items-center.flex-wrap.gap-1.mb-1 > span.text-muted.ms-auto.text-nowrap'
    )?.innerText.trim() || '';

    vNote = document.querySelector(
      '#ngForm > fieldset > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > app-vob-history > div > div:nth-child(3) > div.collapse.mt-1.small.show > div > div > div.text-muted.fst-italic'
    )?.innerText.trim().replace(/^"+|"+$/g, '') || '';

    const m = vd.match(/(\d{4})-(\d{2})-(\d{2})/);

    if (m) {
      vDate = `${parseInt(m[2], 10)}/${parseInt(m[3], 10)}/${m[1]}`;
      vTime = new Date(m[1], m[2] - 1, m[3]).getTime();
    }
  }

  // =========================
  // NEW SELECTOR
  // =========================
  let sDate = '';
  let sNote = '';
  let sTime = 0;

  const newSelector =
    '#ngForm > fieldset > div:nth-child(24) > div.collapse.show > div > div:nth-child(3)';

  const newEl = document.querySelector(newSelector);

  if (newEl) {
    const txt = (newEl.innerText || '')
      .replace(/\s+/g, ' ')
      .trim();

    let dm = txt.match(
      /([A-Z][a-z]{2,8}\s+\d{1,2},\s+\d{4}\s+\d{1,2}:\d{2}\s*[AP]M)/i
    );

    if (dm) {
      const d = new Date(dm[1]);

      if (!isNaN(d.getTime())) {
        sTime = d.getTime();
        sDate = d.toLocaleDateString('en-US');
      }
    }

    if (!sTime) {
      dm = txt.match(
        /(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}\s*[AP]M)/i
      );

      if (dm) {
        const d = new Date(dm[1]);

        if (!isNaN(d.getTime())) {
          sTime = d.getTime();
          sDate = d.toLocaleDateString('en-US');
        }
      }
    }

    if (!sTime) {
      dm = txt.match(
        /(\d{4}-\d{2}-\d{2}\s+\d{1,2}:\d{2}\s*[AP]M)/i
      );

      if (dm) {
        const d = new Date(dm[1]);

        if (!isNaN(d.getTime())) {
          sTime = d.getTime();
          sDate = d.toLocaleDateString('en-US');
        }
      }
    }

    sNote = txt
      .replace(
        /([A-Z][a-z]{2,8}\s+\d{1,2},\s+\d{4}\s+\d{1,2}:\d{2}\s*[AP]M)/i,
        ''
      )
      .replace(
        /(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}\s*[AP]M)/i,
        ''
      )
      .replace(
        /(\d{4}-\d{2}-\d{2}\s+\d{1,2}:\d{2}\s*[AP]M)/i,
        ''
      )
      .trim();

    if (!E.some(x => x.test(txt))) {
      sNote = '';
    }
  }

  // =========================
  // CASE NOTE
  // =========================
  let cDate = '';
  let cNote = '';
  let cTime = 0;

  for (const r of [...document.querySelectorAll('tr')].reverse()) {
    const t = (r.innerText || '')
      .replace(/\s+/g, ' ')
      .trim();

    if (E.some(x => x.test(t))) {
      const dm = t.match(
        /([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}.*?[AP]M)/i
      );

      if (dm) {
        cTime = new Date(dm[1]).getTime();
        cDate = new Date(dm[1]).toLocaleDateString('en-US');
        cNote = t.replace(/^.*?[AP]M\s+/, '').trim();
      }

      break;
    }
  }

  // =========================
  // PICK BEST / NEWEST
  // =========================
  const candidates = [];

  if (cTime > 0 && cNote) {
    candidates.push({
      time: cTime,
      date: cDate,
      note: cNote,
      source: 'Case Note'
    });
  }

  if (sTime > 0 && sNote) {
    candidates.push({
      time: sTime,
      date: sDate,
      note: sNote,
      source: 'New Selector'
    });
  }

  if (vTime > 0 && vNote) {
    candidates.push({
      time: vTime,
      date: vDate,
      note: vNote,
      source: 'VOB History'
    });
  }

  candidates.sort((a, b) => b.time - a.time);

  let out = '';
  let source = '';

  if (candidates.length) {
    const best = candidates[0];

    out = `${best.date} - ${best.note}`;
    source = best.source;
  }

  // =========================
  // NOTIFICATION
  // =========================
  const p = document.createElement('div');

  p.textContent = out
    ? `Copied: ${source}`
    : 'No supporting note found';

  Object.assign(p.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '999999',
    background: out ? '#198754' : '#dc3545',
    color: '#fff',
    padding: '12px 22px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'Arial,sans-serif',
    boxShadow: '0 3px 12px rgba(0,0,0,.3)',
    opacity: '0',
    transition: 'opacity .2s'
  });

  document.body.appendChild(p);

  requestAnimationFrame(() => {
    p.style.opacity = '1';
  });

  setTimeout(() => {
    p.style.opacity = '0';

    setTimeout(() => p.remove(), 200);
  }, 2000);

  if (out) {
    await navigator.clipboard.writeText(out);
  }
})();
