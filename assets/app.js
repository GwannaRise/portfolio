/* Renders the portfolio from content.json in Korean or English. */
(function () {
  "use strict";

  var root = document.getElementById("app");
  var DATA = null;
  var LANG = "ko";

  // ---------- helpers ----------
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function chev(cls) {
    return '<svg class="' + (cls || "chev") + '" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
      '<path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function list(items, cls) {
    if (!items || !items.length) return "";
    return '<ul' + (cls ? ' class="' + cls + '"' : "") + '>' + items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
  }
  function paras(items) {
    return (items || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  }
  function table(t, cls) {
    if (!t) return "";
    var h = '<table class="table ' + (cls || "") + '">';
    if (t.title) h += "<caption>" + esc(t.title) + "</caption>";
    if (t.head && t.head.length) h += "<thead><tr>" + t.head.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "</tr></thead>";
    h += "<tbody>" + (t.rows || []).map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
    return h;
  }
  function img(src, alt, cls) {
    if (!src) return "";
    return '<img class="' + (cls || "") + '" src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy">';
  }
  function gallery(images) {
    if (!images || !images.length) return "";
    return '<div class="gallery">' + images.map(function (im) {
      var src = typeof im === "string" ? im : im.src;
      var cap = typeof im === "string" ? "" : (im.caption || "");
      return "<figure>" + img(src, cap) + (cap ? "<figcaption>" + esc(cap) + "</figcaption>" : "") + "</figure>";
    }).join("") + "</div>";
  }
  function blocks(bs) {
    return (bs || []).map(function (b) {
      return '<div class="block"><h4>' + esc(b.title) + "</h4>" + list(b.items) + "</div>";
    }).join("");
  }
  function details(summaryHtml, panelHtml, cls) {
    return '<details class="' + (cls || "") + '"><summary>' + summaryHtml + chev() + '</summary><div class="panel">' + panelHtml + "</div></details>";
  }

  // ---------- sections ----------
  function topbar(d) {
    var ko = LANG === "ko";
    return '<div class="topbar">' +
      '<div class="brand">' + esc(d.hero.name) + "</div>" +
      '<div class="lang" role="group" aria-label="Language">' +
      '<button type="button" data-lang="ko" aria-pressed="' + ko + '">한국어</button>' +
      '<button type="button" data-lang="en" aria-pressed="' + !ko + '">English</button>' +
      "</div></div>";
  }

  function hero(d) {
    var h = d.hero;
    var photo = d.photo ? img(d.photo, d.ui.photoAlt, "photo") : '<div class="photo--empty" aria-hidden="true"></div>';
    var contacts = (h.contacts || []).map(function (c) {
      return "<li>" + (c.href ? '<a href="' + esc(c.href) + '">' + esc(c.label) + "</a>" : esc(c.label)) + "</li>";
    }).join("");
    var links = (h.links || []).length ? '<div class="links">' + h.links.map(function (l) {
      return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
    }).join("") + "</div>" : "";
    return '<header class="hero">' + photo +
      "<div>" +
      '<h1 class="name">' + esc(h.name) + "<span>" + esc(h.nameAlt) + "</span></h1>" +
      '<p class="tagline">' + esc(h.tagline) + "</p>" +
      '<p class="sub">' + esc(h.sub) + "</p>" +
      '<ul class="contacts">' + contacts + "</ul>" + links +
      "</div></header>";
  }

  function stats(d) {
    return '<div class="stats">' + (d.stats || []).map(function (s) {
      return '<div class="stat"><div class="value">' + esc(s.value) + '</div><div class="label">' + esc(s.label) + '</div><div class="note">' + esc(s.note) + "</div></div>";
    }).join("") + "</div>";
  }

  function index(d) {
    var keys = ["about", "education", "experience", "projects", "awards", "certs", "skills", "story", "timeline"];
    return '<nav class="index" aria-label="' + esc(d.ui.navLabel) + '">' + keys.map(function (k) {
      return '<a href="#' + k + '">' + esc(d.sections[k]) + "</a>";
    }).join("") + "</nav>";
  }

  function row(id, title, bodyHtml) {
    return '<section class="row" id="' + id + '"><h2>' + esc(title) + '</h2><div class="body">' + bodyHtml + "</div></section>";
  }

  function education(d) {
    var e = d.education;
    var rows = e.rows.map(function (r) {
      return '<div class="edu-row"><div class="period">' + esc(r.period) + '</div><div><div class="school">' + esc(r.school) + '</div><div class="major">' + esc(r.major) + '</div><div class="note">' + esc(r.note) + "</div></div></div>";
    }).join("");
    var det = e.details && e.details.length ? '<div class="disclosure-block">' + details('<span class="t">' + esc(e.detailsTitle) + "</span>", list(e.details)) + "</div>" : "";
    return rows + det;
  }

  function experience(d) {
    return (d.experience || []).map(function (x) {
      var logo = x.logo ? img(x.logo, x.name, "logo") : "";
      var links = (x.links || []).length ? '<div class="links">' + x.links.map(function (l) {
        return '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + " ↗</a>";
      }).join("") + "</div>" : "";
      var facts = (x.facts || []).length ? '<dl class="facts">' + x.facts.map(function (f) {
        return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>";
      }).join("") + "</dl>" : "";
      var roles = (x.roles || []).length ? '<div class="disclosure-block">' + x.roles.map(function (r) {
        return details('<span class="t">' + esc(r.title) + "</span>", list(r.items));
      }).join("") + "</div>" : "";
      var retro = x.retro ? '<div class="retro"><h4>' + esc(x.retro.title) + '</h4><p class="lead">' + esc(x.retro.lead) + "</p>" + list(x.retro.items) + "</div>" : "";
      var panelId = "panel-" + x.id;
      return '<article class="entry">' +
        '<div class="entry-head">' + (logo || '<span class="logo logo--none"></span>') +
        "<div>" +
        '<h3 class="entry-title">' + esc(x.name) + '<span class="org">' + esc(x.org) + "</span></h3>" +
        '<div class="entry-meta"><span class="role">' + esc(x.role) + "</span><span>" + esc(x.period) + "</span></div>" +
        "</div></div>" +
        '<p class="entry-summary">' + esc(x.summary) + "</p>" +
        list(x.highlights, "highlights") + links +
        '<p style="margin-top:14px"><button type="button" class="more" aria-expanded="false" aria-controls="' + panelId + '">' + esc(d.ui.open) + chev() + "</button></p>" +
        '<div class="more-panel" id="' + panelId + '" hidden>' +
        (x.wordmark ? '<img class="wordmark" src="' + esc(x.wordmark) + '" alt="' + esc(x.name) + '">' : "") +
        facts + gallery(x.images) + blocks(x.blocks) +
        (x.table ? '<div class="block table--wide">' + table(x.table) + "</div>" : "") +
        roles + retro +
        "</div></article>";
    }).join("");
  }

  function projects(d) {
    return (d.projects || []).map(function (p) {
      var logo = p.logo ? img(p.logo, p.name, "logo") : "";
      var panelId = "panel-" + p.id;
      return '<article class="entry">' +
        '<div class="entry-head">' + (logo || '<span class="logo logo--none"></span>') +
        "<div>" +
        '<h3 class="entry-title">' + esc(p.name) + '<span class="org">' + esc(p.subtitle) + "</span></h3>" +
        '<div class="entry-meta"><span class="chip">' + esc(p.type) + '</span><span class="role">' + esc(p.role) + "</span><span>" + esc(p.period) + "</span></div>" +
        "</div></div>" +
        '<p class="entry-summary">' + esc(p.result) + "</p>" +
        '<p><button type="button" class="more" aria-expanded="false" aria-controls="' + panelId + '">' + esc(d.ui.open) + chev() + "</button></p>" +
        '<div class="more-panel" id="' + panelId + '" hidden>' +
        (p.quote ? '<blockquote class="quote">' + esc(p.quote) + "</blockquote>" : "") +
        (p.table ? '<div class="table--wide" style="margin-bottom:22px">' + table(p.table, "table--kv") + "</div>" : "") +
        gallery(p.images) + blocks(p.blocks) +
        "</div></article>";
    }).join("");
  }

  function awards(d) {
    var order = ["grand", "award", "selected", "program"];
    var byTier = {};
    (d.awards.items || []).forEach(function (a) { (byTier[a.tier] = byTier[a.tier] || []).push(a); });
    var groups = order.filter(function (t) { return byTier[t]; }).map(function (t) {
      var items = byTier[t].map(function (a) {
        var meta = [a.host, a.date, a.project].filter(Boolean).map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("");
        var panel = (a.desc ? "<p>" + esc(a.desc) + "</p>" : "") +
          (a.images && a.images.length ? gallery(a.images) : img(a.image, a.title));
        var main = '<span class="main"><span class="title">' + esc(a.title) + '</span><span class="meta">' + meta + "</span></span>";
        if (!panel) return '<div class="award award--static">' + main + "</div>";
        return details(main, panel, "award");
      }).join("");
      return '<div class="tier-group"><h3><span class="chip chip--' + t + '">' + esc(d.ui.tiers[t]) + '</span><span class="count">' + byTier[t].length + "</span></h3>" + items + "</div>";
    }).join("");
    return '<p class="awards-lead">' + esc(d.awards.lead) + "</p>" + groups;
  }

  function certs(d) {
    return '<ul class="certs">' + d.certs.map(function (c) {
      return '<li><span class="cert-name">' + esc(c.name) + (c.date ? '<span class="cert-date">' + esc(c.date) + "</span>" : "") + "</span>" +
        (c.note ? '<span class="cert-note">' + esc(c.note) + "</span>" : "") + "</li>";
    }).join("") + "</ul>";
  }

  function skills(d) {
    var grid = '<div class="skills">' + d.skills.map(function (s) {
      return "<div><h4>" + esc(s.title) + "</h4>" + list(s.items) + "</div>";
    }).join("") + "</div>";
    var proofs = d.skillProofs || (d.skillProof ? [d.skillProof] : []);
    var proof = proofs.length ? '<div class="disclosure-block">' + proofs.map(function (p) {
      return details('<span class="t">' + esc(p.title) + "</span>", blocks(p.blocks));
    }).join("") + "</div>" : "";
    return grid + proof;
  }

  function story(d) {
    return '<div class="disclosure-block" style="margin-top:0">' + d.story.map(function (s) {
      return details('<span class="t">' + esc(s.title) + "</span>", list(s.items));
    }).join("") + "</div>";
  }

  function timeline(d) {
    return '<ol class="timeline">' + d.timeline.map(function (t) {
      return '<li><span class="when">' + esc(t[0]) + "</span><span>" + esc(t[1]) + "</span></li>";
    }).join("") + "</ol>";
  }

  function footer(d) {
    return '<footer class="footer"><span>' + esc(d.ui.footer) + "</span><span>© " + new Date().getFullYear() + " " + esc(d.hero.nameAlt === "이관우" ? d.hero.name : d.hero.nameAlt) + "</span></footer>";
  }

  // ---------- render ----------
  function render() {
    var d = DATA[LANG];
    d.photo = DATA.photo;
    document.documentElement.lang = LANG;
    document.title = d.meta.title;
    var m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", d.meta.description);

    root.innerHTML =
      topbar(d) + hero(d) + stats(d) + index(d) +
      row("about", d.sections.about, paras(d.about)) +
      row("education", d.sections.education, education(d)) +
      row("experience", d.sections.experience, experience(d)) +
      row("projects", d.sections.projects, projects(d)) +
      row("awards", d.sections.awards, awards(d)) +
      row("certs", d.sections.certs, certs(d)) +
      row("skills", d.sections.skills, skills(d)) +
      row("story", d.sections.story, story(d)) +
      row("timeline", d.sections.timeline, timeline(d)) +
      footer(d);

    root.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
    root.querySelectorAll(".more").forEach(function (b) {
      b.addEventListener("click", function () {
        var panel = document.getElementById(b.getAttribute("aria-controls"));
        var open = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
        b.firstChild.nodeValue = open ? d.ui.open : d.ui.close;
      });
    });
  }

  function setLang(l) {
    if (l !== "ko" && l !== "en") l = "ko";
    LANG = l;
    try { localStorage.setItem("portfolio-lang", l); } catch (e) {}
    try {
      var u = new URL(window.location.href);
      u.searchParams.set("lang", l);
      history.replaceState(null, "", u.toString());
    } catch (e) {}
    render();
  }

  function initialLang() {
    try {
      var q = new URL(window.location.href).searchParams.get("lang");
      if (q === "ko" || q === "en") return q;
    } catch (e) {}
    try {
      var s = localStorage.getItem("portfolio-lang");
      if (s === "ko" || s === "en") return s;
    } catch (e) {}
    var n = (navigator.language || "ko").toLowerCase();
    return n.indexOf("ko") === 0 ? "ko" : "en";
  }

  // ---------- lightbox (click any gallery/award image to enlarge) ----------
  var box = document.createElement("div");
  box.className = "lightbox"; box.hidden = true;
  box.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close">&times;</button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(box);
  function closeBox() { box.hidden = true; document.body.style.overflow = ""; }
  box.addEventListener("click", function (e) { if (e.target.tagName !== "IMG") closeBox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden) closeBox(); });
  root.addEventListener("click", function (e) {
    var t = e.target;
    if (t.tagName !== "IMG" || !t.closest(".gallery, .award .panel")) return;
    var fig = t.closest("figure");
    box.querySelector("img").src = t.src;
    box.querySelector("img").alt = t.alt || "";
    box.querySelector("figcaption").textContent = fig && fig.querySelector("figcaption") ? fig.querySelector("figcaption").textContent : (t.alt || "");
    box.hidden = false; document.body.style.overflow = "hidden";
  });

  // ---------- boot ----------
  fetch("content.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (json) {
      DATA = json;
      DATA.photo = json.photo || "assets/img/profile.jpg";
      LANG = initialLang();
      render();
    })
    .catch(function (err) {
      root.innerHTML = '<div class="state">content.json을 불러오지 못했습니다. 로컬에서 열었다면 간단한 웹 서버로 실행해 주세요. (' + esc(err.message) + ")</div>";
    });
})();
