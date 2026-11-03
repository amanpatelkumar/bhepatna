    // ===== All-Visible Quick View Modal (Mobile Bottom Sheet) =====
    function renderQV() {
      const p = byId(qvId), w = W.has(p.id), D = DET[p.t];
      if (!p) return;
      const saved = saveOf(p);

      $("#qvBody").innerHTML = `
        <div class="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-2.5 border-b border-line flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-white rounded px-2 py-0.5" style="background:${COL[p.cat][2]}">${p.brand}</span>
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">✓ In Stock • Bhootnath Rd</span>
          </div>
          <button type="button" id="qvClose" class="w-8 h-8 grid place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-ink" aria-label="Close details">${ic("x", 17)}</button>
        </div>

        <div class="grid md:grid-cols-12 gap-4 sm:gap-6 p-4 sm:p-6">
          <div class="md:col-span-5">
            <div class="relative aspect-[4/3] sm:aspect-square rounded-2xl p-4 flex items-center justify-center overflow-hidden border border-line" style="background:radial-gradient(circle at center, #ffffff 15%, ${COL[p.cat][1]} 100%)">
              ${pic(p, 1.4)}
              <span class="absolute top-2.5 left-2.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow">${p.badge}</span>
              <span class="absolute bottom-2.5 right-2.5 text-xs font-extrabold text-white rounded-full px-2.5 py-0.5 shadow" style="background:${COL[p.cat][2]}">${offOf(p)}% OFF</span>
            </div>
          </div>

          <div class="md:col-span-7 flex flex-col">
            <h3 class="text-lg sm:text-2xl font-extrabold leading-snug text-ink">${p.name}</h3>
            <a href="${productUrl(p)}" class="inline-block mt-1 text-xs font-bold text-blue-600 hover:underline">View full details page →</a>

            <div class="mt-2 flex flex-wrap gap-1.5">
              ${p.specs.map(s => `<span class="text-xs font-extrabold rounded-md px-2.5 py-0.5" style="background:${COL[p.cat][1]};color:${COL[p.cat][0]}">${s}</span>`).join("")}
              <span class="text-xs font-bold bg-slate-100 text-slate-700 rounded-md px-2.5 py-0.5">Model #BHE-${1000 + p.id}</span>
            </div>

            <div class="mt-3 bg-slate-50 border border-line rounded-xl p-3 flex items-center justify-between gap-2">
              <div>
                <div class="text-[11px] font-bold text-slate-500">Showroom Price (Incl. GST)</div>
                <div class="flex items-baseline gap-2 mt-0.5">
                  <span class="text-2xl font-extrabold font-mono text-ink">${inr(p.price)}</span>
                  <span class="text-xs font-mono text-slate-400 line-through">MRP ${inr(p.mrp)}</span>
                </div>
              </div>
              <div class="bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-right">
                <div class="text-[9px] font-bold uppercase text-emerald-100">You Save</div>
                <div class="text-sm font-extrabold font-mono">${inr(saved)}</div>
              </div>
            </div>

            <div class="mt-3 bg-blue-50/60 border border-blue-200 rounded-xl p-3">
              <div class="text-[11px] font-extrabold uppercase tracking-wider text-blue-900 mb-1">Description</div>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${D.d}</p>
            </div>

            <div class="mt-3 flex items-center gap-3">
              <div class="flex items-center border border-line rounded-full bg-white">
                <button type="button" id="qvMinus" class="w-9 h-9 grid place-items-center hover:bg-slate-100 rounded-full" aria-label="Decrease quantity">${ic("minus", 14)}</button>
                <span class="w-8 text-center text-sm font-mono font-extrabold">${qvQty}</span>
                <button type="button" id="qvPlus" class="w-9 h-9 grid place-items-center hover:bg-slate-100 rounded-full" aria-label="Increase quantity">${ic("plus", 14)}</button>
              </div>
              <span class="text-xs sm:text-sm text-slate-600">Total: <b class="text-ink font-mono text-sm sm:text-base">${inr(p.price * qvQty)}</b></span>
            </div>

            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button type="button" id="qvAdd" class="text-white font-extrabold rounded-xl py-3 hover:brightness-110 transition-all shadow text-xs sm:text-sm" style="background:${COL[p.cat][2]}">
                + Add ${qvQty} to Bag
              </button>
              <div class="grid grid-cols-[1fr_auto] gap-2">
                <button type="button" id="qvBuy" class="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl py-3 px-3 inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow transition-colors">
                  ${ic("wa", 16)}Order on WhatsApp
                </button>
                <button type="button" id="qvWish" aria-pressed="${w}" class="w-11 border border-line rounded-xl grid place-items-center ${w ? 'text-rose-600 bg-rose-50 border-rose-300' : 'hover:bg-slate-100'}" aria-label="Save item">
                  ${ic("heart", 17, w)}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- All-Visible Key Features, Technical Specs & Official Warranty -->
        <div class="border-t border-line bg-slate-50 p-4 sm:p-6 grid md:grid-cols-3 gap-3.5">
          <div class="bg-white border border-line rounded-xl p-3.5">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center gap-1.5 pb-2 border-b border-line">
              <span style="color:${COL[p.cat][0]}">${ic("check", 15)}</span>Key Features
            </h4>
            <ul class="mt-2.5 space-y-1.5 text-xs text-slate-700">
              ${D.f.map(f => `<li class="flex items-start gap-1.5"><span class="mt-0.5 shrink-0 text-emerald-600">${ic("check", 14)}</span><span class="font-medium">${f}</span></li>`).join("")}
            </ul>
          </div>

          <div class="bg-white border border-line rounded-xl p-3.5">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center gap-1.5 pb-2 border-b border-line">
              <span style="color:${COL[p.cat][0]}">${ic("layers", 15)}</span>Specifications
            </h4>
            <dl class="mt-2 divide-y divide-slate-100 text-xs">
              <div class="py-1.5 flex justify-between gap-2"><dt class="text-slate-500">Brand</dt><dd class="font-bold text-ink">${cap(p.brand)}</dd></div>
              <div class="py-1.5 flex justify-between gap-2"><dt class="text-slate-500">Category</dt><dd class="font-bold text-ink">${CATS.find(c => c.id === p.cat).label}</dd></div>
              <div class="py-1.5 flex justify-between gap-2"><dt class="text-slate-500">Primary Spec</dt><dd class="font-bold text-ink">${p.specs[0]}</dd></div>
              <div class="py-1.5 flex justify-between gap-2"><dt class="text-slate-500">Rating / Type</dt><dd class="font-bold text-ink">${p.specs[1]}</dd></div>
              <div class="py-1.5 flex justify-between gap-2"><dt class="text-slate-500">Voltage</dt><dd class="font-bold text-ink">220–240V AC, 50Hz</dd></div>
            </dl>
          </div>

          <div class="bg-white border border-line rounded-xl p-3.5">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center gap-1.5 pb-2 border-b border-line">
              <span class="text-emerald-600">${ic("shield", 15)}</span>Warranty &amp; Support
            </h4>
            <div class="mt-2.5 space-y-2 text-xs">
              <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                <div class="font-extrabold text-emerald-900">${D.w[0]}</div>
                <div class="text-[11px] text-emerald-800 mt-0.5">${D.w[1]}</div>
              </div>
              <p class="text-slate-600"><strong>Includes:</strong> Official GST Invoice &amp; Stamped Warranty Card.</p>
              <p class="text-slate-600"><strong>Fulfilment:</strong> Same-day Patna delivery or Bhootnath Rd store pickup.</p>
            </div>
          </div>
        </div>
      `;

      $("#qvClose").onclick = closeQV;
      $("#qvMinus").onclick = () => { qvQty = Math.max(1, qvQty - 1); renderQV(); };
      $("#qvPlus").onclick = () => { qvQty = Math.min(20, qvQty + 1); renderQV(); };
      $("#qvAdd").onclick = () => {
        addToBag(p.id, qvQty, true);
        closeQV();
        toast(`Added ${qvQty} × ${cap(p.brand)} to bag`, "View Bag");
      };
      $("#qvBuy").onclick = () => buyNow(p.id, qvQty);
      $("#qvWish").onclick = () => toggleWish(p.id);
    }

    function openQV(id) {
      qvId = id;
      qvQty = 1;
      renderQV();
      $("#qv").classList.remove("hidden");
      $("#qvClose").focus();
    }

    function closeQV() {
      qvId = null;
      $("#qv").classList.add("hidden");
    }

    $("#qvBg").onclick = closeQV;

