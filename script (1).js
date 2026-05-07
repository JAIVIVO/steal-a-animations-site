const updates = [
  {
    version: "v2.0.0",
    date: "May 6, 2026",
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
const onlineCount = document.getElementById("onlineCount");
const onlineMeta = document.getElementById("onlineMeta");
const refreshOnlineButton = document.getElementById("refreshOnlineButton");

const confettiColors = ["#ffd36b", "#7d5cff", "#6ea8ff", "#78f0c0", "#ffffff"];
const placeId = "136564450606437";
let universeId = null;

function renderDetails(update) {
  detailsPanel.classList.remove("is-animating");
  void detailsPanel.offsetWidth;
  detailsPanel.classList.add("is-animating");

  detailsVersion.textContent = `Game Version ${update.version}`;
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

async function fetchJsonWithFallback(urls) {
  let lastError = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("All endpoints failed");
}

async function resolveUniverseId() {
  if (universeId) {
    return universeId;
  }

  const data = await fetchJsonWithFallback([
    `https://apis.roproxy.com/universes/v1/places/${placeId}/universe`,
    `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
  ]);

  universeId = data.universeId;
  return universeId;
}

function updateOnlineUi(count, isError = false) {
  onlineCount.classList.remove("tier-gold", "tier-pink");

  if (isError) {
    onlineCount.textContent = "--";
    onlineMeta.textContent = "Live player data is temporarily unavailable.";
    return;
  }

  const formatted = Number(count).toLocaleString("en-US");
  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  onlineCount.textContent = formatted;
  onlineMeta.textContent = `Updated at ${now}`;

  if (count >= 20) {
    onlineCount.classList.add("tier-pink");
  } else if (count >= 10) {
    onlineCount.classList.add("tier-gold");
  }
}

async function loadOnlinePlayers() {
  onlineMeta.textContent = "Refreshing...";

  try {
    const currentUniverseId = await resolveUniverseId();
    const gameData = await fetchJsonWithFallback([
      `https://games.roproxy.com/v1/games?universeIds=${currentUniverseId}`,
      `https://games.roblox.com/v1/games?universeIds=${currentUniverseId}`
    ]);

    const game = gameData?.data?.[0];
    if (!game || typeof game.playing !== "number") {
      throw new Error("Missing player count");
    }

    updateOnlineUi(game.playing);
  } catch (error) {
    updateOnlineUi(0, true);
  }
}

refreshOnlineButton.addEventListener("click", loadOnlinePlayers);

function renderVersionList() {
  updates.forEach((update, index) => {
    const button = document.createElement("button");
    button.className = `version-button${index === 0 ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <div class="version-top">
        <span class="version-name">Game Version ${update.version}</span>
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
loadOnlinePlayers();
setInterval(loadOnlinePlayers, 60000);
