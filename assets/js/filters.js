    // ===== Filters & Brand Strip =====
    const PR = {
      any: [0, 1e9],
      "0-1000": [0, 999],
      "1000-3000": [1000, 2999],
      "3000-6000": [3000, 5999],
      "6000+": [6000, 1e9]
    };
    const PL = [
      ["any", "Any price"],
      ["0-1000", "Under ₹1,000"],
      ["1000-3000", "₹1,000 – ₹3,000"],
      ["3000-6000", "₹3,000 – ₹6,000"],
      ["6000+", "Above ₹6,000"]
    ];
    const DL = [
      [0, "Any discount"],
      [20, "20% or more"],
      [25, "25% or more"],
      [30, "30% or more"]
    ];

    const passF = (p, skipBrand) =>
      (skipBrand || !F.brands.size || F.brands.has(p.brand)) &&
      p.price >= PR[F.price][0] &&
      p.price <= PR[F.price][1] &&
      offOf(p) >= F.disc &&
      (!F.saved || W.has(p.id)) &&
      (!F.specMatch || F.specMatch(p));

    const fkey = () => [...F.brands].sort() + "|" + F.price + "|" + F.disc + "|" + F.sort + "|" + F.saved + "|" + F.specLabel;
    const BRANDS = [...new Set(P.map(p => p.brand))].sort();

    function renderBrandStrip() {
      const bCounts = {};
      P.forEach(p => bCounts[p.brand] = (bCounts[p.brand] || 0) + 1);
      $("#brandResetTop").classList.toggle("hidden", F.brands.size === 0);
      $("#brandStrip").innerHTML = BRANDS.map(b => {
        const on = F.brands.has(b);
        return `<button type="button" data-bstrip="${b}" class="shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold border transition-all ${on ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' : 'bg-white hover:bg-blue-50 text-slate-700 border-line'}">
          <span>${cap(b)}</span>
          <span class="text-[10px] font-mono ${on ? 'text-blue-100' : 'text-slate-400'}">${bCounts[b]}</span>
        </button>`;
      }).join("");
    }

    $("#brandStrip").addEventListener("click", e => {
      const btn = e.target.closest("[data-bstrip]");
      if (!btn) return;
      const b = btn.dataset.bstrip;
      F.brands.has(b) ? F.brands.delete(b) : F.brands.add(b);
      syncPanel();
      renderBrandStrip();
      renderGrid();
    });

    $("#brandResetTop").onclick = () => {
      F.brands.clear();
      syncPanel();
      renderBrandStrip();
      renderGrid();
    };

    function buildPanel() {
      const sec = (t, h) => `<div class="border-t border-line pt-3 mt-3 first:border-0 first:pt-0 first:mt-0"><h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">${t}</h4>${h}</div>`;
      const row = (i, l, x = "") => `<label class="flex items-center gap-2 py-1 text-xs sm:text-sm font-medium cursor-pointer hover:text-blue-700">${i}<span class="flex-1">${l}</span>${x}</label>`;
      $("#fbody").innerHTML =
        sec("Brand", `<div class="max-h-48 overflow-y-auto pr-1 space-y-0.5">${BRANDS.map(b => row(`<input type="checkbox" data-brand="${b}" class="accent-blue-600 w-4 h-4 rounded">`, cap(b), `<span data-cnt="${b}" class="text-xs font-mono text-slate-400"></span>`)).join("")}</div>`) +
        sec("Price", PL.map(([v, l]) => row(`<input type="radio" name="price" value="${v}" class="accent-blue-600 w-4 h-4">`, l)).join("")) +
        sec("Discount", DL.map(([v, l]) => row(`<input type="radio" name="disc" value="${v}" class="accent-blue-600 w-4 h-4">`, l)).join(""));
    }

    function syncPanel() {
      $$("[data-brand]").forEach(i => i.checked = F.brands.has(i.dataset.brand));
      $$("input[name=price]").forEach(i => i.checked = i.value === F.price);
      $$("input[name=disc]").forEach(i => i.checked = +i.value === F.disc);
      $("#sort").value = F.sort;
      renderBrandStrip();
    }

    function renderChips() {
      const c = [];
      if (F.specLabel) c.push([F.specLabel, "sp"]);
      F.brands.forEach(b => c.push([cap(b), "b:" + b]));
      if (F.price !== "any") c.push([PL.find(x => x[0] === F.price)[1], "p"]);
      if (F.disc) c.push([F.disc + "%+ OFF", "d"]);
      if (F.saved) c.push(["♥ Saved", "s"]);
      const html = c.map(([l, k]) =>
        `<button type="button" data-rm="${k}" class="shrink-0 inline-flex items-center gap-1 bg-blue-600 text-white rounded-full pl-2.5 pr-2 py-0.5 text-[11px] font-bold shadow-2xs hover:bg-blue-700" aria-label="Remove filter ${l}">${l}${ic("x", 11)}</button>`
      ).join("");
      $("#chips").innerHTML = html;
      $("#chipsMobile").innerHTML = html;
      const bd = $("#fBadge");
      bd.textContent = c.length;
      bd.classList.toggle("hidden", !c.length);
    }

    function handleChipRemove(e) {
      const b = e.target.closest("[data-rm]");
      if (!b) return;
      const k = b.dataset.rm;
      if (k[0] === "b") F.brands.delete(k.slice(2));
      else if (k === "p") F.price = "any";
      else if (k === "s") setSaved(false);
      else if (k === "sp") {
        F.specMatch = null;
        F.specLabel = "";
        activeRoom = null;
        syncRoomPills();
      } else F.disc = 0;
      syncPanel();
      renderGrid();
    }

    $("#chips").addEventListener("click", handleChipRemove);
    $("#chipsMobile").addEventListener("click", handleChipRemove);

    $("#fbody").addEventListener("change", e => {
      const t = e.target;
      if (t.dataset.brand) {
        t.checked ? F.brands.add(t.dataset.brand) : F.brands.delete(t.dataset.brand);
      } else if (t.name === "price") {
        F.price = t.value;
      } else if (t.name === "disc") {
        F.disc = +t.value;
      }
      renderBrandStrip();
      renderGrid();
    });

    $("#sort").onchange = e => {
      F.sort = e.target.value;
      renderGrid();
    };

    function resetAllFilters() {
      F.brands.clear();
      F.price = "any";
      F.disc = 0;
      F.specMatch = null;
      F.specLabel = "";
      activeRoom = null;
      syncRoomPills();
      setSaved(false);
      if (q) {
        $("#search").value = "";
        q = "";
        $("#clearSearchBtn").classList.add("hidden");
        setFocus(false, "");
      }
      cat = "all";
      renderTabs();
      syncPanel();
      renderGrid();
    }

    $("#fClear").onclick = resetAllFilters;

    const fOpen = () => {
      $("#fpanel").classList.remove("translate-y-full");
      $("#fOverlay").classList.remove("hidden");
    };
    const fClose = () => {
      $("#fpanel").classList.add("translate-y-full");
      $("#fOverlay").classList.add("hidden");
    };
    $("#fOpen").onclick = fOpen;
    $("#fClose").onclick = fClose;
    $("#fApply").onclick = fClose;
    $("#fOverlay").onclick = fClose;

