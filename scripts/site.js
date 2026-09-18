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

  /* ---------- Real Sisi project list logic ---------- */

  var projectListOutput = document.getElementById("sisiProjectListResults");

  if (projectListOutput) {
    var projects = [
      { id: 1, title: "Ngong Road service-lane lighting", budget: 8000000, votes: 412, sector: "lighting" },
      { id: 2, title: "Storm drainage, General Mathenge junction", budget: 6500000, votes: 288, sector: "roads" },
      { id: 3, title: "Kilimani Social Hall renovation", budget: 4200000, votes: 195, sector: "halls" },
      { id: 4, title: "Non-motorised transport walkway, Ngong Road", budget: 9800000, votes: 356, sector: "roads" }
    ];

    projects.push({
      id: 5,
      title: "Kalimoni dispersion",
      budget: 900000,
      votes: 78,
      sector: "water"
    });

    var totalBudget = projects.reduce(function (sum, project) {
      return sum + project.budget;
    }, 0);

    var totalVotes = projects.reduce(function (sum, project) {
      return sum + project.votes;
    }, 0);

    var highVoteProjects = projects
      .filter(function (project) {
        return project.votes > 400;
      })
      .map(function (project) {
        return project.title;
      });

    var projectThree = projects.find(function (project) {
      return project.id === 3;
    });

    var allBelowSixMillion = projects.every(function (project) {
      return project.budget < 6000000;
    });

    var titlesSentence = projects.map(function (project) {
      return project.title;
    }).join(", ");

    var shortSummary = [
      "<h3>Executed project list</h3>",
      "<ul>",
      "<li><strong>Count:</strong> " + projects.length + " projects</li>",
      "<li><strong>First title:</strong> " + projects[0].title + "</li>",
      "<li><strong>Last title:</strong> " + projects[projects.length - 1].title + "</li>",
      "<li><strong>Titles:</strong> " + titlesSentence + "</li>",
      "<li><strong>Total budget:</strong> KES " + totalBudget.toLocaleString("en-KE") + "</li>",
      "<li><strong>Total votes:</strong> " + totalVotes.toLocaleString("en-KE") + "</li>",
      "<li><strong>Projects above 400 votes:</strong> " + (highVoteProjects.length ? highVoteProjects.join(", ") : "None") + "</li>",
      "<li><strong>Project with id 3:</strong> " + projectThree.title + "</li>",
      "<li><strong>Every project under KES 6,000,000:</strong> " + (allBelowSixMillion ? "Yes" : "No") + "</li>",
      "</ul>"
    ].join("");

    projectListOutput.innerHTML = shortSummary;

    console.log("The Sisi project list");
    console.log("Project count:", projects.length);
    console.log("First project:", projects[0].title);
    console.log("Last project:", projects[projects.length - 1].title);
    console.log("All titles:", titlesSentence);
    console.log("Total budget (KES):", totalBudget.toLocaleString("en-KE"));
    console.log("Total votes:", totalVotes.toLocaleString("en-KE"));
    console.log("Projects with more than 400 votes:", highVoteProjects);
    console.log("Project with id 3:", projectThree);
    console.log("Every project costs under KES 6,000,000:", allBelowSixMillion);
  }
})();
