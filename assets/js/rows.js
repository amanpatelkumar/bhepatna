    // ===== Live rows (home) and live product page: read BHE data at runtime, so admin edits show without a rebuild =====
    const rowsEsc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    const rowsPct = p => Math.round((1 - p.price / p.mrp) * 100);
    const rowsCap = b => b[0] + b.slice(1).toLowerCase();
    function fillBrands() {
      const el = document.querySelector("#brandGrid"); if (!el) return;
      el.innerHTML = [...new Set(P.map(p => p.brand))].sort().map(b => {
        const l = P.filter(p => p.brand === b);
        const labels = [...new Set(l.map(p => (BHE.sections.find(s => s.id === p.group) || {}).label || ""))].slice(0, 3).join(", ");
        const lg = BHE.site && BHE.site.brandLogos && BHE.site.brandLogos[b.toLowerCase()];
        return `<a href="${BASE}brands/${b.toLowerCase()}.html" class="card bg-white border border-line rounded-xl p-3.5">${lg ? `<img src="${BASE + lg}" alt="${rowsEsc(rowsCap(b))}" loading="lazy" class="w-12 h-12 rounded-lg object-contain bg-white border border-line mb-2">` : ""}<div class="font-extrabold text-ink">${rowsCap(b)}</div><div class="text-[11px] text-slate-500 mt-0.5">${l.length} products · ${rowsEsc(labels)}</div></a>`;
      }).join("");
    }
    function homeRowIds() {
      const featured = BHE.sections.map(s => P.find(p => p.group === s.id && p.featured)).filter(Boolean).slice(0, 8).map(p => p.id);
      const news = P.filter(p => p.isNew).slice(0, 8).map(p => p.id);
      const offers = [...P].sort((a, b) => rowsPct(b) - rowsPct(a) || a.id - b.id).slice(0, 8).map(p => p.id);
      return { rowFeatured: featured, rowNew: news, rowOffers: offers };
    }
    function productRelatedIds(p) {
      return P.filter(q => q.group === p.group && q.id !== p.id)
        .sort((a, b) => (a.brand === p.brand) - (b.brand === p.brand) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
        .slice(0, 4).map(q => q.id);
    }
    function fillProduct(p) {
      const d = DET[p.t] || { f: [], w: ["", ""], d: "" }, sec = BHE.sections.find(s => s.id === p.group) || { label: "", col: ["#2563EB", "#EFF6FF", "#60A5FA"] };
      const c = sec.col, ok = (p.stock || "in_stock") !== "out_of_stock", st = p.stock || "in_stock";
      const cap = b => b[0] + b.slice(1).toLowerCase(), inrTxt = n => "₹" + Number(n).toLocaleString("en-IN"), pct = rowsPct(p);
      const name = p.name, brand = cap(p.brand), title = `${brand} ${name} ${p.specs[0]} – ${inrTxt(p.price)} | Bombay Hardware & Electricals, Patna`;
      document.title = title;
      const set = (sel, fn) => { const el = document.querySelector(sel); if (el) fn(el); };
      set("#pName", e => e.textContent = name);
      set("#pSpecs", e => e.innerHTML = p.specs.map(x => `<span class="text-xs font-extrabold rounded-md px-2.5 py-0.5" style="background:${c[1]};color:${c[0]}">${rowsEsc(x)}</span>`).join(""));
      set("#pPrice", e => e.textContent = inrTxt(p.price));
      set("#pMrp", e => e.textContent = inrTxt(p.mrp));
      set("#pOff", e => e.textContent = `${pct}% OFF · Save ${inrTxt(p.mrp - p.price)}`);
      set("#pDesc", e => e.textContent = p.desc || d.d);
      set("#pFeat", e => e.innerHTML = d.f.map(x => `<li>${rowsEsc(x)}</li>`).join(""));
      const row = (k, v) => `<div class="py-1.5 flex justify-between gap-2"><dt class="text-slate-500">${k}</dt><dd class="font-bold text-ink text-right">${v}</dd></div>`;
      set("#pDl", e => e.innerHTML = row("Brand", brand) + row("Category", `<a class="text-blue-700 hover:underline" href="${BASE}${p.group}.html">${rowsEsc(sec.label)}</a>`) + row("Model / Size", rowsEsc(p.specs[0])) + row("Feature", rowsEsc(p.specs[1])) + row("Warranty", rowsEsc(d.w[0] || "")) + row("Covers", rowsEsc(d.w[1] || "")));
      set("#pStock", e => {
        e.className = "mt-2 text-xs font-bold " + ({ in_stock: "text-emerald-700", on_order: "text-amber-700", out_of_stock: "text-rose-600" })[st];
        e.innerHTML = ({ in_stock: "● In stock at Bhootnath Road showroom", on_order: "● Available on order", out_of_stock: "● Currently out of stock" })[st] + ' <span class="font-medium text-slate-500">– final price &amp; stock confirmed on WhatsApp</span>';
      });
      set("#pAdd", e => { e.disabled = !ok; e.style.background = ok ? `linear-gradient(135deg, ${c[0]} 0%, ${c[2]} 100%)` : "#94A3B8"; e.textContent = ok ? "Add to Bag" : "Out of Stock"; });
      document.querySelectorAll("[data-buy]").forEach(e => { if (e.dataset.buy === String(p.id)) e.disabled = !ok; });
      const crumbLast = document.querySelector('nav[aria-label="Breadcrumb"] > span:last-child');
      if (crumbLast) crumbLast.textContent = name;
      const imgs = p.imgs || [], picEl = document.querySelector("#pPic");
      if (picEl && imgs.length) {
        picEl.innerHTML = `<img src="${BASE + imgs[0]}" alt="${rowsEsc(name)}" class="max-h-full max-w-full object-contain">`;
        let th = document.querySelector("#pThumbs");
        if (!th) { th = document.createElement("div"); th.id = "pThumbs"; th.className = "mt-2 flex gap-2 overflow-x-auto"; picEl.after(th); }
        th.innerHTML = imgs.length > 1 ? imgs.map((s2, i) => `<button type="button" data-th="${i}" class="shrink-0 w-14 h-14 rounded-lg border border-line overflow-hidden bg-white"><img src="${BASE + s2}" alt="" class="w-full h-full object-cover"></button>`).join("") : "";
        th.onclick = e => { const b = e.target.closest("[data-th]"); if (b) picEl.innerHTML = `<img src="${BASE + imgs[+b.dataset.th]}" alt="" class="max-h-full max-w-full object-contain">`; };
      }
      set("#pLd", e => e.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: `${brand} ${name} ${p.specs[0]}`, brand: { "@type": "Brand", name: brand }, description: p.desc || d.d, image: new URL(getPhotoUrl(p), location.href).href, offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: "https://schema.org/" + ({ in_stock: "InStock", on_order: "BackOrder", out_of_stock: "OutOfStock" })[st], seller: { "@type": "Organization", name: "Bombay Hardware & Electricals" } } }));
    }
    function homeExtras() {
      const rowsInr = n => "₹" + Number(n).toLocaleString("en-IN");
      const WA = (BHE.site && BHE.site.whatsapp) || "", PH = ((BHE.site && BHE.site.phone) || "").replace(/[^+0-9]/g, "");
      const setA = (id, href) => { const el = document.getElementById(id); if (el && href) el.setAttribute("href", href) };
      if (WA) { document.querySelectorAll("[data-wa]").forEach(el => el.setAttribute("href", "https://wa.me/" + WA)); setA("cbWa", "https://wa.me/" + WA); }
      if (PH) setA("cbCall", "tel:" + PH);
      const mins = t => { const [h, m] = String(t || "0:0").split(":").map(Number); return h * 60 + (m || 0) };
      const fmt = t => { const [h, m] = String(t || "0:0").split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}` };
      const opens = (BHE.site && BHE.site.opens) || "09:30", closes = (BHE.site && BHE.site.closes) || "21:00";
      const nowHM = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()).replace(/[^0-9:]/g, "");
      const isOpen = mins(nowHM) >= mins(opens) && mins(nowHM) < mins(closes);
      const st = document.getElementById("shopStatus"), show = document.getElementById("showHours");
      if (st) { st.textContent = isOpen ? `· Open now, closes ${fmt(closes)}` : `· Closed now, opens ${fmt(opens)}`; st.className = "ml-2 font-bold " + (isOpen ? "text-emerald-400" : "text-amber-300"); }
      if (show) show.textContent = `${isOpen ? "Open now" : "Closed now"} · ${fmt(opens)} – ${fmt(closes)} daily`;
      const vn = document.getElementById("visitNow");
      if (vn) { vn.textContent = isOpen ? "● Open now – visit us today" : "● Closed now – visit us when we open"; vn.className = "ml-auto font-bold " + (isOpen ? "text-emerald-700" : "text-amber-700"); }
      const bn = BHE.site && BHE.site.banner, fr = document.getElementById("rowFeatured");
      if (bn && bn.on && fr && !document.getElementById("promoBanner")) fr.closest("section").insertAdjacentHTML("beforebegin", `<section id="promoBanner" class="max-w-7xl mx-auto px-3 sm:px-4 pt-4"><div class="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-5 flex flex-wrap items-center gap-3"><div class="flex-1 min-w-[200px]"><b class="block text-base sm:text-lg">${rowsEsc(bn.title || "")}</b><span class="text-sm text-blue-100">${rowsEsc(bn.text || "")}</span></div>${bn.link ? `<a href="${rowsEsc(bn.link)}" class="bg-white text-blue-700 font-extrabold text-sm rounded-xl px-4 py-2">${rowsEsc(bn.linkText || "Shop now")}</a>` : ""}</div></section>`);
      document.querySelectorAll("a[data-grp]").forEach(a => {
        const list = P.filter(x => x.group === a.dataset.grp);
        if (!list.length) { a.hidden = true; return }
        const p = list.find(x => x.img || (x.imgs && x.imgs[0])), sp = a.querySelector("span[data-i]");
        if (p && sp) sp.outerHTML = `<img src="${BASE + (p.img || p.imgs[0])}" alt="" loading="lazy" class="w-full aspect-[4/3] object-cover rounded-lg">`;
        const cnt = a.querySelector("span.font-mono"), low = Math.min(...list.map(x => x.price));
        if (cnt) cnt.textContent = "from " + rowsInr(low);
      });
      const bl = document.getElementById("homeBrands");
      if (bl) {
        const pal = ["bg-blue-600", "bg-emerald-600", "bg-orange-500", "bg-rose-600", "bg-violet-600", "bg-teal-600", "bg-amber-500", "bg-indigo-600"];
        bl.innerHTML = [...new Set(P.map(p => p.brand))].sort().map((br, i) => {
          const n = P.filter(p => p.brand === br).length;
          const lg = BHE.site && BHE.site.brandLogos && BHE.site.brandLogos[br.toLowerCase()];
          return `<a href="${BASE}brands/${br.toLowerCase()}.html" class="card flex items-center gap-2.5 bg-white border border-line rounded-xl p-2.5">${lg ? `<img src="${BASE + lg}" alt="${rowsEsc(rowsCap(br))}" loading="lazy" class="w-9 h-9 rounded-lg object-contain bg-white border border-line shrink-0">` : `<span class="${pal[i % pal.length]} text-white font-extrabold text-xs w-9 h-9 rounded-lg grid place-items-center shrink-0">${rowsEsc(br.slice(0, 2))}</span>`}<span class="min-w-0"><b class="block text-[13px] text-ink truncate">${rowsCap(br)}</b><small class="text-[11px] text-slate-500">${n} products</small></span></a>`;
        }).join("");
      }
      const showEl = document.getElementById("showHours");
      if (showEl && BHE.site && BHE.site.googleRating && !document.getElementById("gRating")) showEl.insertAdjacentHTML("afterend", `<p id="gRating" class="mt-2 text-sm font-bold text-ink">★ ${rowsEsc(BHE.site.googleRating)} on Google${BHE.site.googleReviewUrl ? ` · <a href="${rowsEsc(BHE.site.googleReviewUrl)}" target="_blank" rel="noopener" class="text-blue-600 underline">Read reviews</a>` : ""}</p>`);
      if (document.getElementById("reviews")) {
        fetch(BASE + "data/reviews.json", { cache: "no-store" }).then(res => res.ok ? res.json() : []).then(list => {
          if (!Array.isArray(list) || !list.length) return;
          document.getElementById("reviewList").innerHTML = list.slice(0, 6).map(rv => `<figure class="bg-white border border-line rounded-xl p-4"><div class="text-amber-500 text-sm">${"★".repeat(Math.min(5, +rv.stars || 5))}</div><blockquote class="mt-1 text-sm text-slate-700">${rowsEsc(rv.text || "")}</blockquote><figcaption class="mt-2 text-xs font-bold text-ink">${rowsEsc(rv.name || "")}${rv.area ? " · " + rowsEsc(rv.area) : ""}</figcaption></figure>`).join("");
          document.getElementById("reviews").hidden = false;
        }).catch(() => {});
      }
      document.querySelectorAll("img").forEach(i => { if (!i.hasAttribute("loading")) i.loading = "lazy" });
    }
    function seoExtras() {
      const root = ((BHE.site && BHE.site.url) || "").replace(/\/$/, ""); if (!root) return;
      let rel = null;
      if (PAGE.type === "home") rel = ""; else if (PAGE.type === "products") rel = "products.html"; else if (PAGE.type === "brands") rel = "brands.html";
      else if (PAGE.type === "category") rel = PAGE.group + ".html"; else if (PAGE.type === "brand") rel = "brands/" + String(PAGE.brand).toLowerCase() + ".html";
      else if (PAGE.type === "product" && byId(PAGE.id)) rel = "product/" + byId(PAGE.id).slug + ".html";
      if (rel !== null) { let cn = document.querySelector('link[rel="canonical"]'); if (!cn) { cn = document.createElement("link"); cn.rel = "canonical"; document.head.appendChild(cn); } cn.href = root + "/" + rel; }
      const ld = obj => { const sc = document.createElement("script"); sc.type = "application/ld+json"; sc.textContent = JSON.stringify(obj); document.head.appendChild(sc); };
      if (PAGE.type === "category") ld({ "@context": "https://schema.org", "@type": "ItemList", name: PAGE.title, itemListElement: P.filter(p => p.group === PAGE.group).slice(0, 30).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: root + "/product/" + p.slug + ".html", name: p.name })) });
      if (PAGE.type === "product" && byId(PAGE.id)) {
        const p = byId(PAGE.id), sec = BHE.sections.find(s => s.id === p.group) || { label: "" };
        ld({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: root + "/" },
          { "@type": "ListItem", position: 2, name: sec.label, item: root + "/" + p.group + ".html" },
          { "@type": "ListItem", position: 3, name: p.name, item: root + "/product/" + p.slug + ".html" } ] });
      }
    }
    function siteExtras() {
      const lg = BHE.site && BHE.site.logo;
      if (lg && !document.querySelector("[data-logoimg]")) { const el = document.querySelector("header span.rounded-xl"); if (el) { el.insertAdjacentHTML("beforebegin", `<img data-logoimg="1" src="${BASE + lg}" alt="Bombay Hardware and Electricals logo" class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain bg-white shrink-0">`); el.remove(); } }
      const co = document.getElementById("checkout");
      if (co && !document.getElementById("waNote")) co.insertAdjacentHTML("afterend", '<p id="waNote" class="mt-2 text-[11px] text-slate-500 text-center">No online payment. We confirm stock and delivery with you on WhatsApp.</p>');
      const fo = document.querySelector("footer");
      if (fo && !document.getElementById("policyLinks")) fo.insertAdjacentHTML("beforeend", `<div id="policyLinks" class="max-w-7xl mx-auto px-4 pb-6 text-xs text-slate-400 flex gap-4 flex-wrap"><a class="hover:text-white" href="${BASE}refund-policy.html">Refund &amp; returns</a><a class="hover:text-white" href="${BASE}privacy-policy.html">Privacy policy</a><a class="hover:text-white" href="${BASE}products.html">All products</a></div>`);
    }
    function renderRows() {
      const hrs = BHE.site && BHE.site.hours; if (hrs) { const sh = document.querySelector("#shopHours"); if (sh) sh.textContent = hrs; }
      if (PAGE.type === "brands") fillBrands();
      if (PAGE.type === "product" && !byId(PAGE.id)) {
        const m = document.querySelector("main");
        if (m && BHE.products.some(x => x.id === PAGE.id)) m.innerHTML = `<section class="max-w-3xl mx-auto px-4 py-16 text-center"><h1 class="text-xl font-extrabold text-ink">This product is not available right now</h1><p class="mt-2 text-sm text-slate-600">Please browse our other products or contact the showroom on WhatsApp.</p><a href="${BASE}products.html" class="inline-block mt-5 bg-blue-600 text-white font-bold rounded-xl px-5 py-2.5">Browse products</a></section>`;
        return;
      }
      const ids = PAGE.type === "home" ? homeRowIds() : (PAGE.type === "product" ? { rowRelated: productRelatedIds(byId(PAGE.id) || {}) } : (PAGE.rows || {}));
      Object.entries(ids).forEach(([id, list]) => {
        const el = document.querySelector("#" + id);
        if (el) el.innerHTML = list.map(i => card(byId(i))).filter(Boolean).join("");
      });
      const pic1 = document.querySelector("#pPic");
      if (pic1 && PAGE.id) pic1.innerHTML = pic(byId(PAGE.id), 1.4);
      if (PAGE.type === "product" && byId(PAGE.id)) fillProduct(byId(PAGE.id));
      homeExtras();
      siteExtras();
      if (!window.__seoDone) { window.__seoDone = true; seoExtras(); }
      const pa = document.querySelector("#pAdd"); if (pa && !document.getElementById("qtyNote")) pa.parentElement.insertAdjacentHTML("afterend", `<p id="qtyNote" class="mt-2 text-[11px] text-slate-500">Up to ${ORDER_MAX} of one product per order.</p>`);
    }
