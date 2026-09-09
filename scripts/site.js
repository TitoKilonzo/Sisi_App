/*
  Sisi — shared site behaviour.
  Progressive enhancement only: every feature here degrades to plain,
  fully readable HTML if this file fails to load. Nothing is hidden by
  CSS unless this script is also running (see the .js-reveal gate in
  main.css), and every dropdown here is a real <select> underneath.
*/
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav dropdown ---------- */

  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    primaryNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });

    // Collapse the dropdown automatically if the window is resized past
    // the breakpoint where navigation is shown inline again.
    var navQuery = window.matchMedia("(min-width: 54rem)");
    var handleNavQuery = function (query) {
      if (query.matches) {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    };
    if (navQuery.addEventListener) {
      navQuery.addEventListener("change", handleNavQuery);
    }
  }

  /* ---------- Scroll reveal ---------- */

  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      document.documentElement.classList.add("js-reveal");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------- Project sector filter (participate.html) ---------- */

  var sectorFilter = document.getElementById("sectorFilter");
  var projectRows = document.querySelectorAll("[data-project-row]");
  var filterCount = document.getElementById("filterCount");

  if (sectorFilter && projectRows.length) {
    var applyFilter = function () {
      var value = sectorFilter.value;
      var visible = 0;
      projectRows.forEach(function (row) {
        var match = value === "all" || row.getAttribute("data-sector") === value;
        row.classList.toggle("is-hidden", !match);
        if (match) visible += 1;
      });
      if (filterCount) {
        filterCount.textContent = visible === projectRows.length
          ? "Showing all " + visible + " projects"
          : "Showing " + visible + " of " + projectRows.length + " projects";
      }
    };
    sectorFilter.addEventListener("change", applyFilter);
    applyFilter();
  }
})();
