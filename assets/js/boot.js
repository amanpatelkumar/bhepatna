    // ===== Boot =====
    const has = s => !!document.querySelector(s);
    if (has("#fbody")) { buildPanel(); syncPanel(); }
    hydrate(document);
    if (has("#calcOptions")) renderCalcOptions();
    if (has("#heroSpotlight")) { renderSpotlight(); resetSpotTimer(); }
    renderTabs();
    renderGrid();
    renderCart();
    updSaved();
    setMode(mode);
    if (PAGE.type === "products") {
      const qs = new URLSearchParams(location.search);
      if (qs.get("q")) { $("#search").value = qs.get("q"); updateSearchState(qs.get("q")); }
      if (qs.get("saved")) { setSaved(true); renderGrid(); }
    }
