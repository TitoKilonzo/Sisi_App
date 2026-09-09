/*
  Sisi — register form behaviour.
  This really submits to https://httpbin.org/post (a public echo
  endpoint) over the network and reacts to the real response, rather
  than dumping raw JSON at the visitor. If JavaScript is unavailable,
  the <form> still has a valid action and method and will submit and
  show httpbin's response directly — degraded, but not broken.
*/
(function () {
  "use strict";

  var form = document.getElementById("registerForm");
  if (!form) return;

  var submitBtn = document.getElementById("registerSubmit");
  var errorBox = document.getElementById("registerError");
  var formPanel = document.getElementById("registerFormPanel");
  var successPanel = document.getElementById("registerSuccess");
  var successHeading = document.getElementById("registerSuccessHeading");
  var statusRegion = document.getElementById("registerStatus");
  var resetBtn = document.getElementById("registerReset");

  var summaryFields = {
    name: document.getElementById("summaryName"),
    place: document.getElementById("summaryPlace"),
    channel: document.getElementById("summaryChannel")
  };

  var channelLabels = { sms: "SMS", email: "Email", both: "SMS and email" };

  function announce(message) {
    if (statusRegion) statusRegion.textContent = message;
  }

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = "";
    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", "icon");
    icon.setAttribute("aria-hidden", "true");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#icon-x-circle");
    icon.appendChild(use);
    var text = document.createElement("span");
    text.textContent = message;
    errorBox.appendChild(icon);
    errorBox.appendChild(text);
    errorBox.classList.add("is-visible");
    announce(message);
  }

  function hideError() {
    if (errorBox) errorBox.classList.remove("is-visible");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    hideError();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = new FormData(form);
    var name = (data.get("name") || "").toString().trim();
    var county = form.querySelector("#county option:checked");
    var countyLabel = county ? county.textContent : "";
    var ward = (data.get("ward") || "").toString().trim();
    var channel = (data.get("channel") || "").toString();

    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    var originalLabel = submitBtn.innerHTML;
    submitBtn.textContent = "Sending\u2026";
    announce("Sending your registration.");

    fetch("https://httpbin.org/post", {
      method: "POST",
      body: data
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("The server responded with an error (" + response.status + ").");
        }
        return response.json();
      })
      .then(function () {
        if (summaryFields.name) summaryFields.name.textContent = name || "\u2014";
        if (summaryFields.place) summaryFields.place.textContent = ward + ", " + countyLabel;
        if (summaryFields.channel) summaryFields.channel.textContent = channelLabels[channel] || channel;

        formPanel.hidden = true;
        successPanel.hidden = false;
        announce("Registration received.");
        if (successHeading) successHeading.focus();
      })
      .catch(function () {
        showError(
          "That didn't go through — check your connection and try again. " +
          "Nothing you typed has been lost."
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        submitBtn.innerHTML = originalLabel;
      });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      form.reset();
      successPanel.hidden = true;
      formPanel.hidden = false;
      announce("");
      var firstField = form.querySelector("select, input, textarea");
      if (firstField) firstField.focus();
    });
  }
})();
