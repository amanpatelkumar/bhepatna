    // ===== Single-Row Swipeable Colourful Category Strip on Mobile =====
    function renderTabs() {
      if (PAGE.type !== "products") return;
      const catCounts = { all: P.length };
      P.forEach(p => catCounts[p.cat] = (catCounts[p.cat] || 0) + 1);
      $("#tabs").innerHTML = CATS.map(c => {
        const active = c.id === cat;
        return `<button type="button" role="tab" aria-selected="${active}" data-c="${c.id}" class="shrink-0 flex items-center gap-2 rounded-xl sm:rounded-2xl px-3 py-2 sm:p-2.5 text-left transition-all border ${active ? 'bg-gradient-to-r ' + c.grad + ' text-white border-transparent shadow-sm' : 'bg-white hover:bg-slate-50 text-ink border-line'}">
          <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg grid place-items-center shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}">
            ${ic(c.i, 15)}
          </span>
          <div class="min-w-0">
            <div class="font-extrabold text-xs leading-tight whitespace-nowrap">${c.label}</div>
            <div class="text-[10px] font-mono ${active ? 'text-white/80' : 'text-slate-400'}">${catCounts[c.id]}</div>
          </div>
        </button>`;
      }).join("");
    }

    $("#tabs").addEventListener("click", e => {
      const b = e.target.closest("button");
      if (b) {
        cat = b.dataset.c;
        renderTabs();
        renderGrid();
      }
    });

    function setFocus(on, raw) {
      $("#front").classList.toggle("hidden", on);
      $("#shopTitle").textContent = on ? "Results for “" + raw + "”" : (F.saved ? "Saved Items" : (PAGE.title || (cat === "all" ? "All Appliances" : CATS.find(x => x.id === cat).label)));
    }

    function setSaved(on) {
      F.saved = on;
      $("#savedBtn").setAttribute("aria-pressed", on);
      $("#savedBtn").classList.toggle("bg-rose-600", on);
      $("#savedBtn").classList.toggle("border-rose-600", on);
      $("#savedBtn").classList.toggle("text-white", on);
      if (!q) $("#shopTitle").textContent = on ? "Saved Items" : (PAGE.title || "All Appliances");
    }

    $("#savedBtn").onclick = () => {
      if (!document.querySelector("#grid")) { location.href = BASE + "products.html?saved=1"; return; }
      setSaved(!F.saved);
      if (F.saved && !W.size) toast("Tap the heart icon on any appliance to save it");
      renderGrid();
      $("#catalog").scrollIntoView();
    };

