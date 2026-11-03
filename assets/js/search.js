    // ===== Search & Live Suggestions =====
    const matches = () => rankProducts(q, P, srLabel);
    const goAll = () => PAGE.type === "products" ? $("#catalog").scrollIntoView() : (location.href = BASE + "products.html?q=" + encodeURIComponent($("#search").value.trim()));
    const hideSugg = () => $("#sugg").classList.add("hidden");

    function renderSugg() {
      if (!q) return hideSugg();
      const m = matches(), s = $("#sugg");
      s.innerHTML = m.slice(0, 6).map(p =>
        `<button type="button" data-qv="${p.id}" class="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-50/60 transition-colors border-b border-line/60 last:border-0">
          <span class="w-10 h-10 shrink-0 rounded-lg p-1 relative overflow-hidden" style="background:${COL[p.cat][1]}">${pic(p, 2)}</span>
          <span class="min-w-0 flex-1">
            <span class="block text-xs sm:text-sm font-bold clamp1 text-ink">${p.name}</span>
            <span class="text-[11px] text-slate-500">${cap(p.brand)} · ${p.specs.join(" · ")}</span>
          </span>
          <div class="text-right shrink-0">
            <b class="text-xs sm:text-sm font-mono text-ink block">${inr(p.price)}</b>
            <span class="text-[10px] font-bold text-emerald-700">Save ${inr(saveOf(p))}</span>
          </div>
        </button>`
      ).join("") + (
        m.length
          ? `<button type="button" id="seeAll" class="w-full text-center text-xs font-extrabold py-2 bg-blue-50 text-blue-700 border-t border-line hover:bg-blue-100">See all ${m.length} matches</button>`
          : `<p class="text-xs text-slate-500 p-3.5">No match for “${q.replace(/</g, "&lt;")}”. Try “fan”, “cooler”, “geyser”, “LED”, or a brand like “Havells”.</p>`
      );
      s.classList.remove("hidden");
    }

    function updateSearchState(rawVal) {
      const was = !!q;
      q = rawVal.trim().toLowerCase();
      $("#clearSearchBtn").classList.toggle("hidden", !q);
      $("#slashHint").classList.toggle("sm:inline-grid", !q);
      if (PAGE.type !== "products") { renderSugg(); return; }
      if (q && cat !== "all") {
        cat = "all";
        renderTabs();
      }
      setFocus(!!q, rawVal.trim());
      if (q && !was) window.scrollTo({ top: 0 });
      renderSugg();
      renderGrid();
    }

    $("#search").addEventListener("input", e => updateSearchState(e.target.value));
    $("#clearSearchBtn").addEventListener("click", () => {
      $("#search").value = "";
      updateSearchState("");
      hideSugg();
    });
    $("#search").addEventListener("focus", renderSugg);
    $("#search").addEventListener("keydown", e => {
      if (e.key === "Enter") {
        hideSugg();
        e.target.blur();
        goAll();
      }
    });
    $("#sugg").addEventListener("click", e => {
      if (e.target.closest("#seeAll")) {
        hideSugg();
        goAll();
      } else if (e.target.closest("[data-qv]")) {
        hideSugg();
      }
    });
    document.addEventListener("click", e => {
      if (!e.target.closest("#sw")) hideSugg();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        $("#search").focus();
      }
      if (e.key === "Escape") {
        closeCart();
        fClose();
        closeQV();
        closeCmpModal();
        hideSugg();
      }
    });

