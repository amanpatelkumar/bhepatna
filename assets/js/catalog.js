    // ===== Mobile-Optimized Product Card (With Real Photo + 2-Line Description + Inline Stepper) =====
    function card(p) {
      const w = W.has(p.id);
      const qty = cart[p.id] || 0;
      const inCmp = CMP.includes(p.id);
      const saved = saveOf(p);

      return `<article class="card group relative bg-white border border-line rounded-xl sm:rounded-2xl overflow-hidden flex flex-col" style="--c:${COL[p.cat][0]};--t:${COL[p.cat][1]};--shadow-col:${COL[p.cat][3]}">
        <div class="h-1 w-full" style="background:${COL[p.cat][2]}"></div>

        <!-- Product Image Container -->
        <div class="relative aspect-[4/3] p-2 sm:p-3 overflow-hidden" style="background:radial-gradient(circle at center, #ffffff 15%, ${COL[p.cat][1]} 100%)">
          <button type="button" data-qv="${p.id}" class="w-full h-full block text-left" aria-label="Quick view ${p.name}">
            ${pic(p)}
          </button>

          <!-- Brand & Ribbon Badges -->
          <div class="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-wrap gap-1 pointer-events-none">
            <span class="text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase text-white rounded px-1.5 py-0.5 shadow-2xs" style="background:${COL[p.cat][2]}">${p.brand}</span>
            <span class="text-[8px] sm:text-[9px] font-extrabold uppercase bg-amber-400 text-slate-950 rounded px-1.5 py-0.5 shadow-2xs">${p.badge}</span>
          </div>

          <!-- Wishlist Heart Button -->
          <button type="button" data-wish="${p.id}" aria-pressed="${w}" aria-label="${w ? "Remove from saved" : "Save item"}" class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 border border-line grid place-items-center shadow-2xs ${w ? 'text-rose-600 border-rose-300 bg-rose-50' : 'text-slate-400 hover:text-rose-600'}">
            ${ic("heart", 14, w)}
          </button>

          <!-- Compare & Quick View Pills -->
          <div class="absolute bottom-1.5 inset-x-1.5 sm:bottom-2 sm:inset-x-2 flex items-center justify-between gap-1">
            <button type="button" data-cmp="${p.id}" class="text-[9px] sm:text-[10px] font-extrabold rounded-full px-2 py-0.5 shadow-2xs border transition-colors ${inCmp ? 'bg-slate-900 text-amber-300 border-slate-900' : 'bg-white/95 text-slate-700 border-line hover:border-slate-900'}">
              ${inCmp ? '✓ Compare' : '+ Compare'}
            </button>
            <button type="button" data-qv="${p.id}" class="bg-slate-900/85 hover:bg-slate-900 text-white text-[9px] sm:text-[10px] font-bold rounded-full px-2 py-0.5 shadow-2xs">
              Details
            </button>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-2.5 sm:p-3.5 flex-1 flex flex-col">
          <!-- Key Spec Pills -->
          <div class="flex flex-wrap gap-1 mb-1">
            ${p.specs.map(s => `<span class="text-[9px] sm:text-[10px] font-extrabold rounded px-1.5 py-0.5" style="background:${COL[p.cat][1]};color:${COL[p.cat][0]}">${s}</span>`).join("")}
          </div>

          <!-- Product Title -->
          <button type="button" data-qv="${p.id}" class="text-left">
            <h3 class="font-semibold text-xs sm:text-sm leading-snug text-ink group-hover:text-blue-700 transition-colors clamp2"><a href="${productUrl(p)}">${p.name}</a></h3>
          </button>

          <!-- Clear, Concise 2-Line Product Description Visible on Every Card -->
          <p class="mt-1 text-[11px] sm:text-xs text-slate-600 leading-snug clamp2">${p.desc}</p>

          <!-- Price, Struck MRP & Green Savings Pill -->
          <div class="mt-auto pt-2 flex items-baseline flex-wrap gap-x-1.5 gap-y-1">
            <span class="text-sm sm:text-lg font-extrabold font-mono text-ink">${inr(p.price)}</span>
            <span class="text-[10px] sm:text-xs font-mono text-slate-400 line-through">${inr(p.mrp)}</span>
            <span class="text-[9px] sm:text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded px-1.5 py-0.5 ml-auto">
              Save ${inr(saved)} (${offOf(p)}% OFF)
            </span>
          </div>

          <!-- Action Buttons: Inline [- 1 +] Stepper OR Add to Bag + Instant WhatsApp -->
          <div class="mt-2 pt-1 flex gap-1.5">
            ${p.stock === "out_of_stock" ? `<span class="flex-1 text-center text-[11px] sm:text-xs font-extrabold rounded-lg bg-slate-200 text-slate-500 py-2">Out of stock</span>` : qty > 0 ? `
              <div class="flex-1 flex items-center justify-between rounded-lg sm:rounded-xl text-white font-extrabold text-xs px-1 py-1 shadow-2xs" style="background:${COL[p.cat][2]}">
                <button type="button" data-step="-1" data-id="${p.id}" class="w-7 h-6 sm:w-8 sm:h-7 rounded-md bg-black/20 hover:bg-black/30 grid place-items-center" aria-label="Decrease quantity">${ic("minus", 13)}</button>
                <span class="font-mono text-[11px] sm:text-xs">${qty}</span>
                <button type="button" data-step="1" data-id="${p.id}" class="w-7 h-6 sm:w-8 sm:h-7 rounded-md bg-black/20 hover:bg-black/30 grid place-items-center" aria-label="Increase quantity">${ic("plus", 13)}</button>
              </div>
            ` : `
              <button type="button" data-add="${p.id}" class="flex-1 text-white text-[11px] sm:text-xs font-extrabold rounded-lg sm:rounded-xl py-2 hover:brightness-110 transition-all shadow-2xs" style="background:${COL[p.cat][2]}">
                Add to Bag
              </button>
            `}
            <button type="button" data-buy="${p.id}" class="w-8 sm:w-9 shrink-0 grid place-items-center border border-emerald-600 text-emerald-700 bg-emerald-50/70 rounded-lg sm:rounded-xl hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Instant Buy on WhatsApp" title="Instant Buy on WhatsApp">
              ${ic("wa", 15)}
            </button>
          </div>
        </div>
      </article>`;
    }

    function renderGrid() {
      if (typeof renderRows === "function") renderRows();
      if (!document.querySelector("#grid")) return;
      const k = cat + "|" + q + "|" + fkey();
      if (k !== lastKey) {
        shown = 24;
        lastKey = k;
      }
      const rrank = q ? new Map(rankProducts(q, P, srLabel).map((p, i) => [p.id, i])) : null;
      const base = P.filter(p => (cat === "all" || p.cat === cat) && (!PAGE.group || p.group === PAGE.group) && (!PAGE.brand || p.brand === PAGE.brand) && (!q || rrank.has(p.id)));
      const counts = {};
      base.filter(p => passF(p, true)).forEach(p => counts[p.brand] = (counts[p.brand] || 0) + 1);
      $$("[data-cnt]").forEach(s => {
        const n = counts[s.dataset.cnt] || 0;
        s.textContent = n;
        s.closest("label").classList.toggle("opacity-40", !n && !F.brands.has(s.dataset.cnt));
      });

      const list = base.filter(p => passF(p));
      list.sort((a, b) => (a.pos || 0) - (b.pos || 0) || a.id - b.id);
      if (rrank) list.sort((a, b) => rrank.get(a.id) - rrank.get(b.id));
      if (F.sort === "plh") list.sort((a, b) => a.price - b.price);
      else if (F.sort === "phl") list.sort((a, b) => b.price - a.price);
      else if (F.sort === "disc") list.sort((a, b) => offOf(b) - offOf(a));
      else if (F.sort === "save") list.sort((a, b) => saveOf(b) - saveOf(a));

      renderChips();
      if (!q && !F.saved) {
        $("#shopTitle").textContent = F.specLabel ? F.specLabel : (PAGE.title || (cat === "all" ? "All Appliances" : CATS.find(x => x.id === cat).label));
      }

      $("#empty").classList.toggle("hidden", list.length > 0);
      $("#empty").innerHTML = F.saved && !W.size
        ? `<div class="max-w-xs mx-auto"><p class="font-extrabold text-sm text-ink mb-1">No saved items yet</p><p class="text-xs text-slate-500 mb-3">Tap the heart icon on any card to save appliances here.</p><button type="button" id="emptyReset" class="bg-blue-600 text-white text-xs font-extrabold rounded-full px-4 py-2">Show All Items</button></div>`
        : `<div class="max-w-xs mx-auto"><p class="font-extrabold text-sm text-ink mb-1">No matching items</p><p class="text-xs text-slate-500 mb-3">Clear filters to view all available showroom appliances.</p><button type="button" id="emptyReset" class="bg-blue-600 text-white text-xs font-extrabold rounded-full px-4 py-2">Reset Filters</button></div>`;
      const rst = $("#emptyReset");
      if (rst) rst.onclick = resetAllFilters;

      $("#resultInfo").textContent = list.length;
      $("#more").classList.toggle("hidden", list.length <= shown);
      $("#grid").innerHTML = list.slice(0, shown).map(card).join("");
    }

    $("#more").onclick = () => {
      shown += 24;
      renderGrid();
    };

    const ORDER_MAX = 5; // most of one product in one order
    function addToBag(id, n = 1, silent) {
      if (n > 0 && byId(id).stock === "out_of_stock") { toast("Out of stock – ask us on WhatsApp for availability"); return; }
      if (n > 0 && (cart[id] || 0) + n > ORDER_MAX) { toast(`Maximum ${ORDER_MAX} of one product per order`); return; }
      cart[id] = (cart[id] || 0) + n;
      if (cart[id] <= 0) delete cart[id];
      save();
      renderCart();
      renderGrid();
      renderSpotlight();
      if (!silent && n > 0) toast(`Added ${cap(byId(id).brand)} to bag`, "View Bag");
    }

    function buyNow(id, n = 1) {
      addToBag(id, n);
      openCart();
    }

    function toggleWish(id) {
      id = +id;
      W.has(id) ? W.delete(id) : W.add(id);
      save();
      updSaved();
      renderGrid();
      if (qvId) renderQV();
    }

    function updSaved() {
      const c = $("#savedCount");
      c.textContent = W.size;
      c.classList.toggle("hidden", !W.size);
    }

