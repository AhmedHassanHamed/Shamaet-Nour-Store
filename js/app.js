/* =========================================================
   شمعة نور | app.js
   الراوتر + المتجر + السلة + المفضلة + الدفع + التواصل + اللغة + الثيم
   يعتمد على المتغيرات الموجودة في i18n.js:
   PRODUCTS, CATEGORIES, SIZES, COUPONS, MAX_QTY, SHIPPING_FEE,
   FREE_SHIPPING_FROM, I18N_EN
   ========================================================= */
(() => {
  "use strict";

  /* ===== حساباتك وروابط التواصل (عدّل هنا بس) ===== */
  const LINKS = {
    whatsapp: "https://wa.me/201147729020",
    telegram: "https://t.me/+201147729020", // لو عندك يوزر: https://t.me/اليوزر
    email: "mailto:hassanhamedeldomoky@gmail.com",
    portfolio: "", // ضيف رابط البورتفوليو هنا لو عندك (فاضي = بيتخبى)
    khamsat: "https://khamsat.com/user/hassanhamed_cz",
    mostaql: "https://mostaql.com/u/Ahmed_Hassan_CZ",
    upwork: "https://www.upwork.com/freelancers/~017e71c52f4947b2a6",
    freelancer: "https://www.freelancer.com/u/hassanhamed3",
    fiverr: "https://www.fiverr.com/s/ZooZpjQ",
    linkedin: "https://www.linkedin.com/in/hassan-hamed-undefined-42180a445/",
  };
  const HANDLES = {
    email: "hassanhamedeldomoky@gmail.com",
    whatsapp: "+20 114 772 9020",
    telegram: "+20 114 772 9020",
    portfolio: "Portfolio",
    khamsat: "hassanhamed_cz",
    mostaql: "Ahmed_Hassan_CZ",
    upwork: "Hassan Hamed",
    freelancer: "hassanhamed3",
    fiverr: "Fiverr",
    linkedin: "hassan-hamed",
  };
  const WA_NUMBER = "201147729020";

  /* صور المنتجات 5 و6: ملفاتهم الحقيقية بأسماء عربية */
  const IMG = {
    5: "images/شمعة العنبر الأسود.png",
    6: "images/ناشر العصي العطري.png",
  };

  /* ===== أدوات ===== */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const load = (k, d) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v ?? d;
    } catch {
      return d;
    }
  };
  const save = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  };
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let lang = load("nour_lang", "ar");
  let cart = load("nour_cart", []); // [{id,size,qty}]
  let wish = load("nour_wish", []); // [id]
  let coupon = load("nour_coupon", "");
  let page = "";
  let refresh = () => {};

  const en = () => lang === "en";
  const t = (s) => (en() && I18N_EN[s]) || s;
  const byId = (id) => PRODUCTS.find((p) => p.id === Number(id));
  const pname = (p) => (en() ? p.nameEn : p.nameAr);
  const pdesc = (p) => (en() ? p.descEn : p.descAr);
  const img = (p) => encodeURI(IMG[p.id] || p.image);
  const money = (n) => `${n} ${t("ج.م")}`;
  const cartKey = (i) => `${i.id}|${i.size}`;

  /* ===== حقن إصلاحات CSS (الأيقونات + الظل) ===== */
  const heart =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linejoin='round'%3E%3Cpath d='M12 20.5s-8-4.7-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 3.1c0 5.7-8 10.4-8 10.4z'/%3E%3C/svg%3E\")";
  const bag =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpath d='M6 8h12l1.2 12H4.8z'/%3E%3Cpath d='M9 8V6.5a3 3 0 0 1 6 0V8'/%3E%3C/svg%3E\")";
  const fix = document.createElement("style");
  fix.textContent = `:root{--shadow:0 6px 18px rgba(59,42,32,.22)}
a.icon-btn[href$="#/wishlist"]{--icon:${heart}}
a.icon-btn[href$="#/cart"]{--icon:${bag}}`;
  document.head.append(fix);

  /* ===== الترجمة ===== */
  const ATTRS = ["aria-label", "placeholder", "alt", "title"];
  function applyLang(root = document.body) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const tag = n.parentNode.nodeName;
      if (tag === "SCRIPT" || tag === "STYLE") continue;
      if (n._ar === undefined) n._ar = n.nodeValue;
      const k = n._ar.replace(/\s+/g, " ").trim();
      if (k) {
        const lead = n._ar.match(/^\s*/)[0];
        const trail = n._ar.match(/\s*$/)[0];
        n.nodeValue = en() && I18N_EN[k] ? lead + I18N_EN[k] + trail : n._ar;
      }
    }
    $$("[aria-label],[placeholder],[alt],[title]", root).forEach((el) =>
      ATTRS.forEach((a) => {
        if (!el.hasAttribute(a)) return;
        const d = "data-ar-" + a;
        if (!el.hasAttribute(d)) el.setAttribute(d, el.getAttribute(a));
        const k = el.getAttribute(d);
        el.setAttribute(a, en() && I18N_EN[k] ? I18N_EN[k] : k);
      }),
    );
    [
      [".brand-name", "شمعة نور", "Shamaet Nour"],
      [".features-heading", "لماذا شمعة نور", "Why Shamaet Nour"],
    ].forEach(([sel, ar, enText]) =>
      $$(sel).forEach((el) => (el.textContent = en() ? enText : ar)),
    );
  }

  function setTitle(arKey, custom) {
    document.title = custom || t(arKey);
  }

  function setLang(l) {
    lang = l;
    save("nour_lang", l);
    const h = document.documentElement;
    h.lang = l;
    h.dir = l === "ar" ? "rtl" : "ltr";
    buildTicker();
    const lb = $("#langToggle span");
    if (lb) lb.textContent = l === "ar" ? "EN" : "AR";
    if ($("#view")) route();
    else setTitle("تواصل معنا | شمعة نور");
    applyLang();
  }

  /* ===== عدادات + رسائل ===== */
  function updateCounts() {
    const c = $("#cartCount"),
      w = $("#wishCount");
    if (c) c.textContent = cart.reduce((s, i) => s + i.qty, 0);
    if (w) w.textContent = wish.length;
  }
  function toast(msg) {
    const r = $("#toastRegion");
    if (!r) return;
    const d = document.createElement("div");
    d.className = "toast";
    d.textContent = t(msg);
    r.append(d);
    setTimeout(() => d.remove(), 2200);
  }
  const say = (sel, msg) => {
    const el = $(sel);
    if (el) el.textContent = t(msg);
  };

  /* ===== السلة والمفضلة ===== */
  function addToCart(id, size = "medium", qty = 1) {
    const it = cart.find((i) => i.id === id && i.size === size);
    if (it) it.qty = Math.min(MAX_QTY, it.qty + qty);
    else cart.push({ id, size, qty: Math.min(MAX_QTY, qty) });
    save("nour_cart", cart);
    updateCounts();
    toast("تمت الإضافة إلى السلة");
    if (page === "cart") refresh();
  }
  function toggleWish(id) {
    const i = wish.indexOf(id);
    if (i > -1) {
      wish.splice(i, 1);
      toast("تمت الإزالة من المفضلة");
    } else {
      wish.push(id);
      toast("تمت الإضافة إلى المفضلة");
    }
    save("nour_wish", wish);
    updateCounts();
    refresh();
  }
  function totals() {
    const sub = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
    const disc = Math.round((sub * (COUPONS[coupon] || 0)) / 100);
    const after = sub - disc;
    const ship = sub === 0 || after >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    return { sub, disc, ship, total: after + ship };
  }
  function fillSummary() {
    const x = totals();
    const set = (id, v) => {
      const el = $("#" + id);
      if (el) el.textContent = v;
    };
    set("subtotal", money(x.sub));
    set("discount", money(x.disc));
    set("shipping", x.ship === 0 && x.sub > 0 ? t("مجاني") : money(x.ship));
    set("total", money(x.total));
  }

  /* ===== كارت المنتج ===== */
  const card = (p) => {
    const w = wish.includes(p.id);
    const href = `#/product?id=${p.id}`;
    return `<li class="product-card">
      <a class="product-media" href="${href}"><img src="${img(p)}" alt="${pname(p)}" loading="lazy" width="400" height="500" /></a>
      <div class="product-body">
        <p class="product-cat">${CATEGORIES[p.category][lang]}</p>
        <h3 class="product-title"><a href="${href}">${pname(p)}</a></h3>
        <p class="product-price">${p.price} <span class="currency">${t("ج.م")}</span></p>
        <div class="product-actions">
          <button type="button" class="btn btn-primary add-to-cart" data-add="${p.id}">أضف للسلة</button>
          <button type="button" class="wish-btn" data-wish="${p.id}" aria-pressed="${w}" aria-label="${w ? "إزالة من المفضلة" : "أضف للمفضلة"}">${w ? "♥" : "♡"}</button>
        </div>
      </div></li>`;
  };

  /* ===== التحقق من الحقول ===== */
  function validate(rules) {
    let first = null;
    rules.forEach(([id, ok, msg]) => {
      const el = $("#" + id),
        err = $("#" + id + "Error");
      const good = ok(el.value);
      el.setAttribute("aria-invalid", good ? "false" : "true");
      if (err) err.textContent = good ? "" : t(msg);
      if (!good && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  }
  const waLink = (text) =>
    `${LINKS.whatsapp || "https://wa.me/" + WA_NUMBER}?text=${encodeURIComponent(text)}`;

  /* ===== الصفحات ===== */
  const pages = {
    home() {
      setTitle("شمعة نور | شموع وعطور وديكور فاخر");
      const g = $("#featuredGrid");
      refresh = () => {
        g.innerHTML = PRODUCTS.slice(0, 4).map(card).join("");
        applyLang(g);
      };
      refresh();
      const cta = $(".cta a.btn");
      if (cta) cta.href = LINKS.khamsat;
      const f = $("#newsletterForm");
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = $("#newsletterEmail").value.trim();
        if (!EMAIL.test(v))
          return say(
            "#newsletterMsg",
            "من فضلك أدخل بريداً إلكترونياً صحيحاً.",
          );
        say("#newsletterMsg", "شكراً لاشتراكك!");
        $("#newsletterEmail").value = "";
      });
    },

    shop() {
      setTitle("المتجر | شمعة نور");
      const f = $("#filtersForm"),
        grid = $("#productGrid"),
        sort = $("#sortSelect");
      const cat =
        new URLSearchParams(location.hash.split("?")[1] || "").get(
          "category",
        ) || "";
      const r = f.querySelector(`[name=category][value="${cat}"]`);
      if (r) r.checked = true;
      refresh = () => {
        const d = new FormData(f);
        const s = (d.get("search") || "").toString().trim().toLowerCase();
        const c = d.get("category") || "";
        const min = parseFloat(d.get("minPrice")) || 0;
        const max = parseFloat(d.get("maxPrice")) || Infinity;
        const list = PRODUCTS.filter(
          (p) =>
            (!c || p.category === c) &&
            p.price >= min &&
            p.price <= max &&
            (!s || (p.nameAr + " " + p.nameEn).toLowerCase().includes(s)),
        );
        if (sort.value === "price-asc") list.sort((a, b) => a.price - b.price);
        else if (sort.value === "price-desc")
          list.sort((a, b) => b.price - a.price);
        else list.sort((a, b) => b.added - a.added);
        grid.innerHTML = list.map(card).join("");
        $("#resultsCount").textContent = en()
          ? `Showing ${list.length} products`
          : `عرض ${list.length} منتجات`;
        $("#emptyState").hidden = list.length > 0;
        applyLang(grid);
      };
      f.addEventListener("input", refresh);
      f.addEventListener("change", refresh);
      f.addEventListener("reset", () => setTimeout(refresh));
      f.addEventListener("submit", (e) => e.preventDefault());
      sort.addEventListener("change", refresh);
      const tg = $("#filtersToggle");
      tg.addEventListener("click", () => {
        const o = $("#filters").classList.toggle("is-open");
        tg.setAttribute("aria-expanded", o);
      });
      refresh();
    },

    product() {
      const p = byId(
        new URLSearchParams(location.hash.split("?")[1] || "").get("id"),
      );
      if (!p) return (location.hash = "#/shop");
      setTitle("", `${pname(p)} | ${t("شمعة نور")}`);
      $(".breadcrumb li:last-child").textContent = pname(p);
      const im = $("#productImage");
      im.src = img(p);
      im.alt = pname(p);
      $("#productCategory").textContent = CATEGORIES[p.category][lang];
      $("#product-title").textContent = pname(p);
      $("#productPrice").innerHTML =
        `${p.price} <span class="currency">${t("ج.م")}</span>`;
      $("#productDesc").textContent = pdesc(p);
      const qi = $("#qtyInput");
      const clamp = () =>
        (qi.value = Math.min(MAX_QTY, Math.max(1, parseInt(qi.value) || 1)));
      const [minus, plus] = $$(".qty-btn");
      minus.addEventListener(
        "click",
        () => ((qi.value = (parseInt(qi.value) || 1) - 1), clamp()),
      );
      plus.addEventListener(
        "click",
        () => ((qi.value = (parseInt(qi.value) || 1) + 1), clamp()),
      );
      qi.addEventListener("change", clamp);
      $("#productForm").addEventListener("submit", (e) => {
        e.preventDefault();
        clamp();
        addToCart(p.id, $("#sizeSelect").value, parseInt(qi.value));
      });
      const wb = $("#wishBtn");
      wb.addEventListener("click", () => toggleWish(p.id));
      const rg = $("#relatedGrid");
      refresh = () => {
        const w = wish.includes(p.id);
        wb.setAttribute("aria-pressed", w);
        wb.textContent = w ? "♥" : "♡";
        rg.innerHTML = PRODUCTS.filter((x) => x.id !== p.id)
          .sort(
            (a, b) => (b.category === p.category) - (a.category === p.category),
          )
          .slice(0, 4)
          .map(card)
          .join("");
        applyLang(rg);
      };
      refresh();
    },

    cart() {
      setTitle("السلة | شمعة نور");
      const list = $("#cartList"),
        empty = $("#cartEmpty");
      $("#couponInput").value = coupon;
      refresh = () => {
        list.innerHTML = cart
          .map((i) => {
            const p = byId(i.id),
              k = cartKey(i);
            return `<li class="cart-item">
            <a class="cart-item-media" href="#/product?id=${p.id}"><img src="${img(p)}" alt="" /></a>
            <div class="cart-item-info"><h3 class="cart-item-title">${pname(p)}</h3>
              <p class="cart-item-meta">${t("الحجم")}: ${SIZES[i.size][lang]}</p>
              <p class="cart-item-price">${money(p.price)}</p></div>
            <div class="cart-item-actions">
              <div class="qty" role="group" aria-label="الكمية">
                <button type="button" class="qty-btn" data-dec="${k}" aria-label="إنقاص الكمية">−</button>
                <input value="${i.qty}" readonly aria-label="الكمية" />
                <button type="button" class="qty-btn" data-inc="${k}" aria-label="زيادة الكمية">+</button>
              </div>
              <button type="button" class="link-btn" data-rm="${k}">حذف</button>
              <span class="cart-item-total">${money(p.price * i.qty)}</span>
            </div></li>`;
          })
          .join("");
        empty.hidden = cart.length > 0;
        fillSummary();
        applyLang(list);
      };
      $("#couponForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const c = $("#couponInput").value.trim().toUpperCase();
        if (!c) {
          coupon = "";
          say("#couponMsg", "تم إلغاء كود الخصم.");
        } else if (COUPONS[c]) {
          coupon = c;
          say("#couponMsg", "تم تطبيق كود الخصم");
        } else {
          coupon = "";
          say("#couponMsg", "كود الخصم غير صالح.");
        }
        save("nour_coupon", coupon);
        fillSummary();
      });
      $("#checkoutBtn").addEventListener("click", (e) => {
        if (!cart.length) {
          e.preventDefault();
          toast("سلتك فارغة حالياً.");
        }
      });
      refresh();
    },

    checkout() {
      setTitle("إتمام الطلب | شمعة نور");
      if (!cart.length) return (location.hash = "#/cart");
      $("#orderItems").innerHTML = cart
        .map(
          (i) =>
            `<li><span>${pname(byId(i.id))} × ${i.qty}</span><span>${money(byId(i.id).price * i.qty)}</span></li>`,
        )
        .join("");
      fillSummary();
      $("#checkoutForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const ok = validate([
          [
            "fullName",
            (v) => v.trim().length >= 3,
            "من فضلك أدخل اسمك الكامل.",
          ],
          [
            "phone",
            (v) => /^(\+?20|0)?1[0125]\d{8}$/.test(v.replace(/[\s-]/g, "")),
            "أدخل رقم موبايل صحيح.",
          ],
          [
            "email",
            (v) => EMAIL.test(v.trim()),
            "أدخل بريداً إلكترونياً صحيحاً.",
          ],
          ["governorate", (v) => !!v, "اختر المحافظة."],
          ["city", (v) => v.trim().length > 1, "أدخل المدينة أو المنطقة."],
          ["address", (v) => v.trim().length >= 6, "أدخل العنوان بالتفصيل."],
        ]);
        if (!ok) return;
        const no = "NOUR-" + Date.now().toString().slice(-6);
        const x = totals();
        const g = $("#governorate");
        const lines = [
          `طلب جديد ${no}`,
          ...cart.map(
            (i) => `- ${byId(i.id).nameAr} (${SIZES[i.size].ar}) × ${i.qty}`,
          ),
          `الإجمالي: ${x.total} ج.م`,
          `الاسم: ${$("#fullName").value}`,
          `الموبايل: ${$("#phone").value}`,
          `البريد: ${$("#email").value}`,
          `العنوان: ${g.options[g.selectedIndex].text} - ${$("#city").value} - ${$("#address").value}`,
          $("#notes").value ? `ملاحظات: ${$("#notes").value}` : "",
        ].filter(Boolean);
        window.open(waLink(lines.join("\n")), "_blank", "noopener");
        cart = [];
        coupon = "";
        save("nour_cart", cart);
        save("nour_coupon", coupon);
        updateCounts();
        $("#orderNumber").textContent = no;
        $(".checkout-layout").hidden = true;
        $("#orderSuccess").hidden = false;
        window.scrollTo(0, 0);
      });
    },

    wishlist() {
      setTitle("المفضلة | شمعة نور");
      const g = $("#wishGrid");
      refresh = () => {
        const list = wish.map(byId).filter(Boolean);
        g.innerHTML = list.map(card).join("");
        $("#wishResults").textContent = en()
          ? `Products: ${list.length}`
          : `عدد المنتجات: ${list.length}`;
        $("#wishEmpty").hidden = list.length > 0;
        $("#clearWish").hidden = list.length === 0;
        applyLang(g);
      };
      $("#clearWish").addEventListener("click", () => {
        wish = [];
        save("nour_wish", wish);
        updateCounts();
        refresh();
      });
      refresh();
    },
  };

  /* ===== الراوتر ===== */
  function route() {
    const view = $("#view");
    const [path] = (location.hash.slice(1) || "/").split("?");
    let name = path.replace(/^\//, "") || "home";
    if (!pages[name]) name = "home";
    page = name;
    refresh = () => {};
    const tpl = $("#tpl-" + name);
    const frag = tpl.content.cloneNode(true);
    [...frag.childNodes].forEach((n) => {
      if (n.nodeType === 3 && n.nodeValue.trim()) n.remove(); // نصوص زائدة بين الأقسام
    });
    view.replaceChildren(frag);
    $$("[data-nav]").forEach((a) =>
      a.dataset.nav === name || (name !== "shop" && name !== "home" && false)
        ? a.setAttribute("aria-current", "page")
        : a.removeAttribute("aria-current"),
    );
    pages[name]();
    applyLang(view);
    window.scrollTo(0, 0);
  }

  /* ===== صفحة التواصل ===== */
  function initContact() {
    setTitle("تواصل معنا | شمعة نور");
    $$(".channel").forEach((li) => {
      const ch = li.dataset.channel,
        url = LINKS[ch];
      if (!url) return (li.hidden = true);
      const a = $("a", li);
      a.href = url;
    });
    const f = $("#contactForm");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = validate([
        ["contactName", (v) => v.trim().length >= 2, "أدخل اسمك."],
        [
          "contactEmail",
          (v) => EMAIL.test(v.trim()),
          "أدخل بريداً إلكترونياً صحيحاً.",
        ],
        [
          "message",
          (v) => v.trim().length >= 10,
          "اكتب رسالتك (10 أحرف على الأقل).",
        ],
      ]);
      if (!ok) return;
      const tp = $("#topic");
      const text = `${tp.options[tp.selectedIndex].text}\nالاسم: ${$("#contactName").value}\nالبريد: ${$("#contactEmail").value}\n\n${$("#message").value}`;
      say("#contactMsg", "جاري فتح واتساب لإرسال رسالتك.");
      window.open(waLink(text), "_blank", "noopener");
      f.reset();
    });
  }

  /* ===== العناصر المشتركة (الهيدر + العائم) ===== */
  function initShared() {
    const root = document.documentElement;
    const applyTheme = (m) => {
      root.dataset.theme = m;
      save("nour_theme", m);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = m === "dark" ? "#1c1410" : "#f6efe6";
    };
    applyTheme(load("nour_theme", "light"));
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();

    $("#langToggle").addEventListener("click", () =>
      setLang(en() ? "ar" : "en"),
    );
    $("#themeToggle").addEventListener("click", () =>
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark"),
    );
    const mb = $("#menuToggle"),
      nav = $("#mainNav");
    mb.addEventListener("click", () => {
      const o = nav.classList.toggle("is-open");
      mb.setAttribute("aria-expanded", o);
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        mb.setAttribute("aria-expanded", "false");
      }
    });

    $$("a.float-link").forEach((a) => {
      const u = LINKS[a.dataset.channel];
      if (u) a.href = u;
      else a.hidden = true;
    });
    $("#floatClose").addEventListener(
      "click",
      () => ($("#floatContact").hidden = true),
    );

    /* أحداث عامة (أزرار الكروت والسلة) */
    document.addEventListener("click", (e) => {
      const s = e.target.closest("[data-scroll]");
      if (s) {
        e.preventDefault();
        const el = $("#" + s.dataset.scroll);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        return;
      }
      const b = e.target.closest(
        "[data-add],[data-wish],[data-inc],[data-dec],[data-rm]",
      );
      if (!b) return;
      const d = b.dataset;
      if (d.add) return addToCart(Number(d.add));
      if (d.wish) return toggleWish(Number(d.wish));
      const key = d.inc || d.dec || d.rm;
      const i = cart.findIndex((x) => cartKey(x) === key);
      if (i < 0) return;
      if (d.inc) cart[i].qty = Math.min(MAX_QTY, cart[i].qty + 1);
      if (d.dec) cart[i].qty = Math.max(1, cart[i].qty - 1);
      if (d.rm) cart.splice(i, 1);
      save("nour_cart", cart);
      updateCounts();
      refresh();
    });
  }

  /* ===== شريط الإعلانات المتحرك ===== */
  function buildTicker() {
    const fs =
      typeof FREE_SHIPPING_FROM === "number" ? FREE_SHIPPING_FROM : null;
    const ads = [
      ...(fs
        ? [
            {
              ar: `شحن مجاني للطلبات فوق ${fs} ج.م`,
              en: `Free shipping on orders over ${fs} EGP`,
            },
          ]
        : []),
      { ar: "تغليف أنيق جاهز للإهداء", en: "Elegant gift-ready packaging" },
      { ar: "الدفع عند الاستلام", en: "Cash on delivery" },
      { ar: "استبدال سهل وسياسة واضحة", en: "Easy exchange, clear policy" },
    ];
    let bar = $("#ticker");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "ticker";
      bar.className = "ticker";
      document.body.prepend(bar);
    }
    const items = ads
      .map((a) => `<span class="ticker-item">${a[lang]}</span>`)
      .join("");
    const group = (hidden) =>
      `<div class="ticker-group"${hidden ? ' aria-hidden="true"' : ""}>${items}</div>`;
    bar.innerHTML = `<div class="ticker-track">${group(false)}${group(true).repeat(5)}</div>`;
  }

  /* ===== التشغيل ===== */
  function init() {
    initShared();
    buildTicker();
    updateCounts();
    const h = document.documentElement;
    h.lang = lang;
    h.dir = lang === "ar" ? "rtl" : "ltr";
    const lb = $("#langToggle span");
    if (lb) lb.textContent = en() ? "AR" : "EN";
    if ($("#view")) {
      window.addEventListener("hashchange", route);
      route();
    } else {
      initContact();
    }
    applyLang();
  }
  init();
})();
