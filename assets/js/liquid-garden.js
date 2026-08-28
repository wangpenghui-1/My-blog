/*
 * Liquid Garden progressive enhancement.
 * The SVG displacement approach is informed by the MIT-licensed
 * @dpawlikowski/liquid-glass project. See THIRD_PARTY_NOTICES.md.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var coarsePointer = window.matchMedia("(pointer: coarse)");
  var saveData = Boolean(navigator.connection && navigator.connection.saveData);
  var supportsGlass = Boolean(window.CSS && (CSS.supports("backdrop-filter", "blur(2px)") || CSS.supports("-webkit-backdrop-filter", "blur(2px)")));
  var enhanced = supportsGlass && !reduceMotion.matches && !coarsePointer.matches && !saveData;
  root.dataset.glassMode = enhanced ? "enhanced" : "basic";
  root.classList.add("liquid-garden-ready");

  function injectGlassFilter() {
    if (!enhanced || document.getElementById("liquid-glass-edge")) return;
    var holder = document.createElement("div");
    holder.setAttribute("aria-hidden", "true");
    holder.className = "liquid-glass-defs";
    holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><filter id="liquid-glass-edge" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter></svg>';
    document.body.appendChild(holder);
  }
  injectGlassFilter();

  var nav = document.querySelector(".nav");
  var menuToggle = document.querySelector("[data-nav-toggle]");
  if (nav && menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open = !nav.classList.contains("nav-open");
      nav.classList.toggle("nav-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
      if (open) revealReadingNav(0);
      else scheduleReadingNavHide(700);
    });
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) {
        var wasOpen = nav.classList.contains("nav-open");
        nav.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
        if (wasOpen) scheduleReadingNavHide(700);
      }
    });
  }

  var header = document.querySelector(".header");
  var readingHeader = header && header.classList.contains("header-reading") ? header : null;
  var readingHandle = readingHeader ? readingHeader.querySelector("[data-reading-nav-handle]") : null;
  var readingHideTimer = 0;
  var readingLastY = window.scrollY;

  function readingNavLocked() {
    return Boolean(readingHeader && (
      document.body.classList.contains("search-open") ||
      (nav && nav.classList.contains("nav-open")) ||
      readingHeader.contains(document.activeElement)
    ));
  }

  function clearReadingNavTimer() {
    if (readingHideTimer) window.clearTimeout(readingHideTimer);
    readingHideTimer = 0;
  }

  function setReadingNavHidden(hidden) {
    if (!readingHeader) return;
    if (hidden && (window.scrollY <= 120 || readingNavLocked())) hidden = false;
    readingHeader.classList.toggle("is-reading-nav-hidden", hidden);
    if (readingHandle) {
      readingHandle.setAttribute("aria-expanded", String(!hidden));
      readingHandle.setAttribute("aria-label", hidden ? "展开主导航" : "收起主导航");
      readingHandle.tabIndex = hidden ? 0 : -1;
    }
  }

  function revealReadingNav(autoHideDelay) {
    if (!readingHeader) return;
    clearReadingNavTimer();
    setReadingNavHidden(false);
    if (autoHideDelay && window.scrollY > 120) scheduleReadingNavHide(autoHideDelay);
  }

  function scheduleReadingNavHide(delay) {
    if (!readingHeader) return;
    clearReadingNavTimer();
    if (window.scrollY <= 120 || readingNavLocked()) return;
    readingHideTimer = window.setTimeout(function () {
      if (!readingNavLocked()) setReadingNavHidden(true);
    }, delay || 450);
  }

  var scrollQueued = false;
  function updateHeader() {
    var currentY = window.scrollY;
    if (header) header.classList.toggle("header-scrolled", currentY > 60);
    if (readingHeader) {
      var delta = currentY - readingLastY;
      if (currentY <= 120) revealReadingNav(0);
      else if (delta > 5) setReadingNavHidden(true);
      else if (delta < -5) revealReadingNav(1200);
      readingLastY = currentY;
    }
    scrollQueued = false;
  }
  window.addEventListener("scroll", function () {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateHeader);
    }
  }, { passive: true });
  updateHeader();

  if (readingHeader) {
    document.addEventListener("pointermove", function (event) {
      if (event.pointerType !== "touch" && event.clientY <= 28) revealReadingNav(1100);
    }, { passive: true });
    readingHeader.addEventListener("pointerenter", clearReadingNavTimer, { passive: true });
    readingHeader.addEventListener("pointerleave", function () { scheduleReadingNavHide(450); }, { passive: true });
    readingHeader.addEventListener("focusin", function () { revealReadingNav(0); });
    readingHeader.addEventListener("focusout", function () { scheduleReadingNavHide(500); });
    if (readingHandle) {
      readingHandle.addEventListener("click", function (event) {
        revealReadingNav(0);
        if (event.detail === 0) {
          var firstControl = nav && nav.querySelector("a, button");
          if (firstControl) firstControl.focus();
        } else {
          readingHandle.blur();
          scheduleReadingNavHide(1600);
        }
      });
    }
  }

  if (enhanced) {
    document.querySelectorAll('[data-glass="refractive"]').forEach(function (surface) {
      var frame = 0;
      surface.addEventListener("pointermove", function (event) {
        if (frame) return;
        frame = requestAnimationFrame(function () {
          var rect = surface.getBoundingClientRect();
          surface.style.setProperty("--glass-x", ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + "%");
          surface.style.setProperty("--glass-y", ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + "%");
          frame = 0;
        });
      }, { passive: true });
      surface.addEventListener("pointerleave", function () {
        surface.style.removeProperty("--glass-x");
        surface.style.removeProperty("--glass-y");
      }, { passive: true });
    });
  }

  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    var revealItems = document.querySelectorAll(".reveal-item");
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealItems.forEach(function (item) {
      item.classList.add("reveal-observed");
      revealObserver.observe(item);
    });
  }

  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var tocMap = new Map();
    tocLinks.forEach(function (link) {
      var id = decodeURIComponent(link.getAttribute("href").slice(1));
      var heading = document.getElementById(id);
      if (heading) tocMap.set(heading, link);
    });
    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (link) { link.classList.remove("is-active"); });
          var active = tocMap.get(entry.target);
          if (active) active.classList.add("is-active");
        }
      });
    }, { rootMargin: "-18% 0px -68%", threshold: 0 });
    tocMap.forEach(function (_, heading) { tocObserver.observe(heading); });
  }

  var articleCache;
  function loadArticles() {
    if (!articleCache) {
      articleCache = fetch("/index.json", { credentials: "same-origin" })
        .then(function (response) {
          if (!response.ok) throw new Error("search index unavailable");
          return response.json();
        })
        .then(function (items) { return Array.isArray(items) ? items : []; });
    }
    return articleCache;
  }

  function normalized(value) { return String(value || "").toLocaleLowerCase("zh-CN").trim(); }
  function searchArticles(items, query) {
    var term = normalized(query);
    if (!term) return items.slice(0, 6);
    return items.map(function (item) {
      var title = normalized(item.title);
      var summary = normalized(item.summary);
      var section = normalized(item.section);
      var tags = normalized((item.tags || []).join(" "));
      var score = 0;
      if (title === term) score += 12;
      if (title.indexOf(term) !== -1) score += 8;
      if (tags.indexOf(term) !== -1) score += 5;
      if (section.indexOf(term) !== -1) score += 3;
      if (summary.indexOf(term) !== -1) score += 2;
      return { item: item, score: score };
    }).filter(function (row) { return row.score > 0; })
      .sort(function (a, b) { return b.score - a.score || new Date(b.item.date) - new Date(a.item.date); })
      .slice(0, 10).map(function (row) { return row.item; });
  }

  function renderResults(surface, items, query) {
    var list = surface.querySelector("[data-search-results]");
    var status = surface.querySelector("[data-search-status]");
    if (!list || !status) return;
    list.textContent = "";
    status.textContent = query ? (items.length ? "找到 " + items.length + " 篇相关内容" : "没有找到相关内容，换个关键词试试") : "最近更新";
    items.forEach(function (item, index) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      var meta = document.createElement("span");
      var title = document.createElement("strong");
      var summary = document.createElement("small");
      var arrow = document.createElement("i");
      link.href = item.permalink;
      link.dataset.searchResult = String(index);
      meta.textContent = (item.section || "Essay") + " · " + String(item.date || "").slice(0, 10).replaceAll("-", ".");
      title.textContent = item.title;
      summary.textContent = item.summary || "";
      arrow.textContent = "↗";
      link.append(meta, title, summary, arrow);
      li.appendChild(link);
      list.appendChild(li);
    });
  }

  function bindSearchSurface(surface) {
    var input = surface.querySelector("[data-search-input]");
    if (!input) return;
    var selected = -1;
    var timer;
    function run() {
      loadArticles().then(function (items) {
        renderResults(surface, searchArticles(items, input.value), input.value.trim());
        selected = -1;
      }).catch(function () {
        var status = surface.querySelector("[data-search-status]");
        if (status) status.textContent = "搜索索引暂时不可用";
      });
    }
    input.addEventListener("input", function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(run, 80);
    });
    input.addEventListener("keydown", function (event) {
      var results = Array.prototype.slice.call(surface.querySelectorAll("[data-search-result]"));
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!results.length) return;
        selected = event.key === "ArrowDown" ? Math.min(selected + 1, results.length - 1) : Math.max(selected - 1, 0);
        results.forEach(function (result) { result.classList.remove("is-selected"); });
        results[selected].classList.add("is-selected");
        results[selected].scrollIntoView({ block: "nearest" });
      } else if (event.key === "Enter" && selected >= 0 && results[selected]) {
        event.preventDefault();
        results[selected].click();
      }
    });
    run();
  }

  var dialog = document.querySelector("[data-search-dialog]");
  var previousFocus;
  function openSearch(event) {
    if (!dialog) return;
    if (event) event.preventDefault();
    revealReadingNav(0);
    previousFocus = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add("search-open");
    requestAnimationFrame(function () {
      dialog.classList.add("is-open");
      var input = dialog.querySelector("[data-search-input]");
      if (input) input.focus();
    });
  }
  function closeSearch() {
    if (!dialog || dialog.hidden) return;
    dialog.classList.remove("is-open");
    document.body.classList.remove("search-open");
    window.setTimeout(function () {
      dialog.hidden = true;
      if (previousFocus === readingHandle && nav) {
        var returnTarget = nav.querySelector("a, button");
        if (returnTarget) returnTarget.focus();
      } else if (previousFocus && previousFocus.focus) previousFocus.focus();
      scheduleReadingNavHide(700);
    }, reduceMotion.matches ? 0 : 220);
  }

  document.querySelectorAll("[data-search-open]").forEach(function (trigger) { trigger.addEventListener("click", openSearch); });
  document.querySelectorAll("[data-search-close]").forEach(function (trigger) { trigger.addEventListener("click", closeSearch); });
  document.addEventListener("keydown", function (event) {
    var target = event.target;
    var typing = target && (target.matches("input, textarea, select") || target.isContentEditable);
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    } else if (event.key === "/" && !typing && dialog && dialog.hidden) {
      event.preventDefault();
      openSearch();
    } else if (event.key === "Escape") {
      if (dialog && !dialog.hidden) closeSearch();
      else if (nav && nav.classList.contains("nav-open")) {
        nav.classList.remove("nav-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        scheduleReadingNavHide(700);
      }
    } else if (event.key === "Tab" && dialog && !dialog.hidden) {
      var focusable = Array.prototype.slice.call(dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')).filter(function (element) { return element.offsetParent !== null; });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  if (dialog) bindSearchSurface(dialog);
  document.querySelectorAll("[data-search-page]").forEach(bindSearchSurface);
})();
