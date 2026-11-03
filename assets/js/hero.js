    // ===== Compact Hero Spotlight Deal Card (Mobile Pill + Desktop Card) =====
    const SPOTLIGHT_IDS = [
      P.find(p => p.cat === "fans" && p.specs[0] === "1200mm")?.id || P[0].id,
      P.find(p => p.cat === "coolers" && p.specs[0] === "65L")?.id || P[1].id,
      P.find(p => p.cat === "mixer" && p.specs[0] === "750W")?.id || P[2].id,
      P.find(p => p.cat === "induction" && p.specs[0] === "2000W")?.id || P[3].id,
      P.find(p => p.cat === "iron" && p.t === "geyser" && p.specs[0] === "15L")?.id || P[4].id
    ];
    let spotIdx = 0, spotTimer;

    function renderSpotlight() {
      const p = byId(SPOTLIGHT_IDS[spotIdx]);
      if (!p) return;
      const inBag = cart[p.id] || 0;
      $("#heroSpotlight").innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <span class="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-white px-2 py-0.5 rounded-full" style="background:${COL[p.cat][2]}">
            🔥 Deal ${spotIdx + 1}/${SPOTLIGHT_IDS.length}
          </span>
          <div class="flex items-center gap-1">
            <button type="button" id="spotPrev" class="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-ink font-bold text-xs grid place-items-center" aria-label="Previous deal">‹</button>
            <button type="button" id="spotNext" class="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-ink font-bold text-xs grid place-items-center" aria-label="Next deal">›</button>
          </div>
        </div>
        <div class="flex items-center gap-2.5 sm:gap-3">
          <button type="button" data-qv="${p.id}" class="w-16 h-16 sm:w-24 sm:h-24 shrink-0 rounded-xl p-1.5 relative overflow-hidden border border-line" style="background:${COL[p.cat][1]}">
            ${pic(p)}
          </button>
          <div class="min-w-0 flex-1">
            <span class="text-[10px] font-extrabold tracking-wider uppercase block truncate" style="color:${COL[p.cat][0]}">${p.brand} • ${p.specs.join(" · ")}</span>
            <button type="button" data-qv="${p.id}" class="text-left block w-full">
              <h3 class="font-extrabold text-xs sm:text-sm leading-tight text-ink hover:underline clamp1 mt-0.5">${p.name}</h3>
            </button>
            <div class="mt-1 flex items-baseline gap-1.5 flex-wrap">
              <span class="text-sm sm:text-base font-extrabold font-mono text-ink">${inr(p.price)}</span>
              <span class="text-[11px] font-mono text-slate-400 line-through">${inr(p.mrp)}</span>
              <span class="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.2">Save ${inr(saveOf(p))}</span>
            </div>
            <div class="mt-1.5 flex gap-1.5">
              <button type="button" id="spotAdd" class="flex-1 text-white text-[11px] sm:text-xs font-extrabold rounded-lg py-1.5 px-2.5 shadow-2xs hover:brightness-110 transition-all" style="background:${COL[p.cat][2]}">
                ${inBag ? `In Bag (${inBag}) +` : '+ Add to Bag'}
              </button>
              <button type="button" data-qv="${p.id}" class="px-2.5 py-1.5 text-[11px] font-bold border border-line rounded-lg hover:bg-slate-100">View</button>
            </div>
          </div>
        </div>
      `;
      $("#spotPrev").onclick = () => { spotIdx = (spotIdx - 1 + SPOTLIGHT_IDS.length) % SPOTLIGHT_IDS.length; resetSpotTimer(); renderSpotlight(); };
      $("#spotNext").onclick = () => { spotIdx = (spotIdx + 1) % SPOTLIGHT_IDS.length; resetSpotTimer(); renderSpotlight(); };
      $("#spotAdd").onclick = () => { addToBag(p.id, 1); renderSpotlight(); };
    }

    function resetSpotTimer() {
      clearInterval(spotTimer);
      spotTimer = setInterval(() => {
        spotIdx = (spotIdx + 1) % SPOTLIGHT_IDS.length;
        renderSpotlight();
      }, 5000);
    }

