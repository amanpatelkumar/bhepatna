    // ===== Compare Tray & Modal =====
    function toggleCompare(id) {
      id = +id;
      const idx = CMP.indexOf(id);
      if (idx > -1) {
        CMP.splice(idx, 1);
      } else {
        if (CMP.length >= 3) {
          toast("Compare up to 3 appliances at a time");
          return;
        }
        CMP.push(id);
      }
      renderCmpBar();
      renderGrid();
    }

    function renderCmpBar() {
      const bar = $("#cmpBar");
      if (!CMP.length) {
        bar.classList.add("hidden");
        return;
      }
      bar.classList.remove("hidden");
      $("#cmpCount").textContent = CMP.length;
      $("#cmpSlots").innerHTML = CMP.map(id => {
        const p = byId(id);
        return `<div class="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-xl pl-2 pr-1.5 py-1 shrink-0">
          <span class="text-[11px] font-bold truncate max-w-[110px]">${cap(p.brand)} ${p.specs[0]}</span>
          <span class="text-[10px] font-mono text-amber-300">${inr(p.price)}</span>
          <button type="button" data-rmcmp="${id}" class="w-4 h-4 rounded-full hover:bg-white/20 grid place-items-center text-[10px]" aria-label="Remove">✕</button>
        </div>`;
      }).join("");
      $$("[data-rmcmp]").forEach(b => b.onclick = () => toggleCompare(+b.dataset.rmcmp));
    }

    function openCmpModal() {
      if (!CMP.length) return;
      const items = CMP.map(byId);
      $("#cmpBody").innerHTML = `
        <div class="flex items-center justify-between pb-3 border-b border-line">
          <h3 class="text-base sm:text-lg font-extrabold text-ink">Compare Appliances</h3>
          <button type="button" id="cmpCloseBtn" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 grid place-items-center">${ic("x", 16)}</button>
        </div>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr>
                <th class="p-2.5 bg-slate-50 border border-line w-28 font-extrabold text-slate-600">Feature</th>
                ${items.map(p => `
                  <th class="p-2.5 border border-line align-top min-w-[170px]">
                    <div class="h-24 rounded-lg p-1.5 mb-1.5" style="background:${COL[p.cat][1]}">${pic(p)}</div>
                    <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded text-white" style="background:${COL[p.cat][2]}">${p.brand}</span>
                    <div class="font-extrabold text-ink mt-1">${p.name}</div>
                  </th>
                `).join("")}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-2.5 bg-slate-50 border border-line font-bold">Price</td>
                ${items.map(p => `<td class="p-2.5 border border-line font-mono font-extrabold text-sm text-ink">${inr(p.price)} <span class="text-[11px] text-slate-400 line-through font-normal">${inr(p.mrp)}</span></td>`).join("")}
              </tr>
              <tr>
                <td class="p-2.5 bg-slate-50 border border-line font-bold">Savings</td>
                ${items.map(p => `<td class="p-2.5 border border-line font-extrabold text-emerald-700">Save ${inr(saveOf(p))} (${offOf(p)}% OFF)</td>`).join("")}
              </tr>
              <tr>
                <td class="p-2.5 bg-slate-50 border border-line font-bold">Specs</td>
                ${items.map(p => `<td class="p-2.5 border border-line font-semibold">${p.specs.join(" • ")}</td>`).join("")}
              </tr>
              <tr>
                <td class="p-2.5 bg-slate-50 border border-line font-bold">Overview</td>
                ${items.map(p => `<td class="p-2.5 border border-line text-slate-600">${DET[p.t].short}</td>`).join("")}
              </tr>
              <tr>
                <td class="p-2.5 bg-slate-50 border border-line font-bold">Warranty</td>
                ${items.map(p => `<td class="p-2.5 border border-line font-semibold text-blue-800">${DET[p.t].w[0]}</td>`).join("")}
              </tr>
              <tr>
                <td class="p-2.5 bg-slate-50 border border-line font-bold">Action</td>
                ${items.map(p => `<td class="p-2.5 border border-line"><button type="button" data-cmpadd="${p.id}" class="w-full py-2 rounded-lg text-white font-extrabold text-xs" style="background:${COL[p.cat][2]}">+ Add to Bag</button></td>`).join("")}
              </tr>
            </tbody>
          </table>
        </div>
      `;
      $("#cmpModal").classList.remove("hidden");
      $("#cmpCloseBtn").onclick = closeCmpModal;
      $$("[data-cmpadd]").forEach(b => b.onclick = () => {
        addToBag(+b.dataset.cmpadd, 1);
        closeCmpModal();
      });
    }

    function closeCmpModal() {
      $("#cmpModal").classList.add("hidden");
    }

    $("#cmpOpen").onclick = openCmpModal;
    $("#cmpClear").onclick = () => { CMP = []; renderCmpBar(); renderGrid(); };
    $("#cmpBg").onclick = closeCmpModal;

    // Global Click Delegation
    document.addEventListener("click", e => {
      const a = e.target.closest("[data-add]"),
            step = e.target.closest("[data-step]"),
            b = e.target.closest("[data-buy]"),
            w = e.target.closest("[data-wish]"),
            c = e.target.closest("[data-cmp]"),
            v = e.target.closest("[data-qv]");
      if (a) addToBag(+a.dataset.add, 1);
      else if (step) addToBag(+step.dataset.id, +step.dataset.step, +step.dataset.step < 0);
      else if (b) buyNow(+b.dataset.buy);
      else if (w) toggleWish(w.dataset.wish);
      else if (c) toggleCompare(c.dataset.cmp);
      else if (v) openQV(+v.dataset.qv);
    });

