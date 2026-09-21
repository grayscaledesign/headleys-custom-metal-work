const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");

toggle?.addEventListener("click", () => {
  const expanded = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!expanded));
  nav.classList.toggle("open", !expanded);
});

nav?.addEventListener("click", event => {
  if (event.target.closest("a")) {
    toggle?.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
  }
});

const services = document.querySelector(".services-grid");
const serviceToggles = [...document.querySelectorAll(".service-toggle")];

if (services && serviceToggles.length) {
  services.classList.add("accordion-ready");

  const setServiceOpen = (button, open) => {
    const card = button.closest(".service-card");
    const panel = document.querySelector(`#${button.getAttribute("aria-controls")}`);

    button.setAttribute("aria-expanded", String(open));
    card?.classList.toggle("is-open", open);
    panel?.setAttribute("aria-hidden", String(!open));
  };

  serviceToggles.forEach(button => {
    setServiceOpen(button, false);

    button.addEventListener("click", () => {
      const shouldOpen = button.getAttribute("aria-expanded") !== "true";

      serviceToggles.forEach(otherButton => {
        setServiceOpen(otherButton, otherButton === button && shouldOpen);
      });
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const estimateForm = document.querySelector("#estimate-form");
const estimateStatus = document.querySelector("#estimate-status");

estimateForm?.addEventListener("submit", async event => {
  event.preventDefault();

  if (!estimateForm.reportValidity()) return;

  const submitButton = estimateForm.querySelector("button[type='submit']");
  const formData = new FormData(estimateForm);
  const projectType = String(formData.get("project_type") || "").trim();
  formData.set("_subject", `Estimate Request — ${projectType}`);
  formData.set("Page", window.location.href);

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  estimateStatus.className = "form-note form-status is-pending";
  estimateStatus.textContent = "Sending your request…";

  try {
    const endpoint = estimateForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error(result.message || "The request could not be sent.");
    }

    estimateForm.reset();
    estimateStatus.className = "form-note form-status is-success";
    estimateStatus.textContent = "Thank you. Your estimate request has been sent.";
  } catch (error) {
    console.error("Estimate request failed", error);
    estimateStatus.className = "form-note form-status is-error";
    estimateStatus.textContent = "We couldn't send your request. Please try again or call (804) 580-0812.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Request an estimate";
  }
});
