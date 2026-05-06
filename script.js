const updates = [
  {
    version: "v2.0.0",
    date: "March 2026",
    tag: "Launch",
    sections: [
      {
        title: "Changes",
        items: [
          "Published the website.",
          "Added Brainrot for boosts."
        ]
      }
    ]
  }
];

const versionList = document.getElementById("versionList");
const detailsVersion = document.getElementById("detailsVersion");
const detailsDate = document.getElementById("detailsDate");
const detailsTag = document.getElementById("detailsTag");
const changesContent = document.getElementById("changesContent");
const detailsPanel = document.querySelector(".details-panel");
const secretButton = document.getElementById("secretButton");
const confettiLayer = document.getElementById("confettiLayer");
const secretMessage = document.getElementById("secretMessage");

const confettiColors = ["#ffd36b", "#7d5cff", "#6ea8ff", "#78f0c0", "#ffffff"];

function renderDetails(update) {
  detailsPanel.classList.remove("is-animating");
  void detailsPanel.offsetWidth;
  detailsPanel.classList.add("is-animating");

  detailsVersion.textContent = update.version;
  detailsDate.textContent = update.date;
  detailsTag.textContent = update.tag;

  changesContent.innerHTML = update.sections
    .map(
      (section) => `
        <div class="change-group">
          <h4>${section.title}</h4>
          <ul>
            ${section.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `
    )
    .join("");
}

detailsPanel.addEventListener("animationend", () => {
  detailsPanel.classList.remove("is-animating");
});

function launchConfetti() {
  confettiLayer.innerHTML = "";

  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";

    const left = Math.random() * 100;
    const size = 6 + Math.random() * 8;
    const duration = 2.4 + Math.random() * 1.8;
    const delay = Math.random() * 0.35;
    const drift = `${(Math.random() - 0.5) * 180}px`;
    const spin = `${Math.random() * 760 - 380}deg`;
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];

    piece.style.left = `${left}vw`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.7}px`;
    piece.style.background = color;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.setProperty("--drift-x", drift);
    piece.style.setProperty("--spin", spin);

    confettiLayer.appendChild(piece);
  }

  setTimeout(() => {
    confettiLayer.innerHTML = "";
  }, 4300);
}

function showSecretMessage() {
  secretMessage.classList.remove("show");
  void secretMessage.offsetWidth;
  secretMessage.classList.add("show");
}

secretButton.addEventListener("click", () => {
  launchConfetti();
  showSecretMessage();
});

function renderVersionList() {
  updates.forEach((update, index) => {
    const button = document.createElement("button");
    button.className = `version-button${index === 0 ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <div class="version-top">
        <span class="version-name">${update.version}</span>
        <span class="version-label">${update.tag}</span>
      </div>
      <div class="version-date">${update.date}</div>
    `;

    button.addEventListener("click", () => {
      document
        .querySelectorAll(".version-button")
        .forEach((item) => item.classList.remove("active"));

      button.classList.add("active");
      renderDetails(update);
    });

    versionList.appendChild(button);
  });
}

renderVersionList();
renderDetails(updates[0]);
