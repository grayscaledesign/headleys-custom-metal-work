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

estimateForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (!estimateForm.reportValidity()) return;

  const formData = new FormData(estimateForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const projectType = String(formData.get("project_type") || "").trim();
  const details = String(formData.get("details") || "").trim();
  const subject = `Estimate Request — ${projectType}`;
  const body = [
    "Estimate Request",
    "",
    `Name: ${name}`,
    `Phone: ${phone || "Not provided"}`,
    `Email: ${email}`,
    `Type of work: ${projectType}`,
    "",
    "Project details:",
    details
  ].join("\n");

  window.location.href = `mailto:jeffrey@headleysmetal.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
