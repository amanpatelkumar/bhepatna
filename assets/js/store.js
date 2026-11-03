    // ===== Data bridge: arrays come from /data/*.json via assets/js/data.js =====
    const CATS = BHE.categories, DET = BHE.details, ALLP = BHE.products;
    // hidden products and products of hidden brands are not shown anywhere on the site
    const P = ALLP.filter(p => !p.hidden && !(BHE.hiddenBrands || []).includes(p.brand));
    const PAGE = window.BHE_PAGE || { type: "products", base: "" }, BASE = PAGE.base || "";
    const productUrl = p => BASE + "product/" + p.slug + ".html";
    const byId = id => P.find(p => p.id === +id);
    const inr = n => "₹" + n.toLocaleString("en-IN");
    const offOf = p => Math.round((1 - p.price / p.mrp) * 100);
    const saveOf = p => p.mrp - p.price;
    function cap(b) { return b[0] + b.slice(1).toLowerCase(); }
    const waLink = t => "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(t);

    // ===== State =====
    let cat = "all", q = "", cart = {}, W = new Set(), CMP = [], mode = "Home Delivery (Patna)", shown = 24, lastKey = "", qvId = null, qvQty = 1, activeRoom = null;
    const F = { brands: new Set(), price: "any", disc: 0, sort: "feat", saved: false, specMatch: null, specLabel: "" };

    try {
      const s = JSON.parse(localStorage.getItem("bhe_v3") || "{}");
      cart = s.cart || {};
      W = new Set(s.w || []);
    } catch (e) {}

    const save = () => {
      try {
        localStorage.setItem("bhe_v3", JSON.stringify({ cart, w: [...W] }));
      } catch (e) {}
    };

    $("#heroWa").href = waLink("Hello " + STORE + ", I have a question about a product.");
    $("#callBtn").href = "tel:+" + WA_NUMBER;

    // ===== Toast Notification =====
    let tt;
    function toast(msg, action) {
      const t = $("#toast");
      t.innerHTML = `<span>${msg}</span>` + (action ? `<button class="bg-amber-400 text-slate-950 font-extrabold rounded-full px-3 py-1 text-xs hover:bg-amber-300 transition-colors" id="toastAct">${action}</button>` : "");
      t.classList.remove("opacity-0", "translate-y-3", "pointer-events-none");
      clearTimeout(tt);
      tt = setTimeout(() => t.classList.add("opacity-0", "translate-y-3", "pointer-events-none"), 2600);
      if (action) {
        $("#toastAct").onclick = () => {
          openCart();
          t.classList.add("opacity-0", "pointer-events-none");
        };
      }
    }

