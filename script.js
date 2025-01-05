let allShows = []; // Stores all available shows
let allEpisodes = []; // Stores episodes for the selected show
let currentView = "shows"; // Tracks the current view: "shows" or "episodes"

// Initialize the app on load
function setup() {
  const infoText = document.getElementById("search-count");
  infoText.textContent = "Loading shows... Please wait.";
  toggleBackButton(false);

  setupEventListeners();
  fetchShows()
    .then(() => {
      populateShowSelector(allShows);
      displayAllShows(); // Display all shows on page load
    })
    .catch((error) => handleError(error));
}

// Fetch and load shows from the API
async function fetchShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) throw new Error("Failed to fetch shows.");
    allShows = await response.json();
    allShows.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  } catch (error) {
    throw error;
  }
}

// Populate the show selector dropdown
function populateShowSelector(shows) {
  const selector = document.getElementById("show-selector");
  selector.innerHTML = '<option value="">Select a Show</option>';
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selector.appendChild(option);
  });
  document.getElementById(
    "search-count"
  ).textContent = `Loaded ${shows.length} shows.`;
}

// Display all shows as cards
function displayAllShows() {
  currentView = "shows";
  const showsContainer = document.querySelector(".episodes-container");
  showsContainer.innerHTML = "";
  allShows.forEach((show) => {
    const card = createShowCard(show);
    showsContainer.appendChild(card);
  });
  document.getElementById(
    "search-count"
  ).textContent = `Displaying ${allShows.length} shows.`;
}

// Create a show card element
function createShowCard(show) {
  const showCard = document.createElement("div");
  showCard.classList.add("card");

  const limitedSummary = show.summary
    ? show.summary.split(" ").slice(0, 20).join(" ") +
      (show.summary.split(" ").length > 20 ? "..." : "")
    : "No summary available.";

  showCard.innerHTML = `
    <img src="${show.image ? show.image.medium : ""}" alt="${show.name}">
    <div class="card-content">
      <h3>${show.name}</h3>
      <p>${limitedSummary}</p>
    </div>
  `;
  showCard.addEventListener("click", () => loadEpisodes(show.id));
  return showCard;
}

// Load episodes for a selected show
async function loadEpisodes(showId) {
  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    if (!response.ok) throw new Error("Failed to fetch episodes.");
    allEpisodes = await response.json();
    currentView = "episodes";
    displayEpisodes(allEpisodes);
    toggleBackButton(true);
  } catch (error) {
    handleError(error);
  }
}

// Display episodes as cards
function displayEpisodes(episodeList) {
  const episodesContainer = document.querySelector(".episodes-container");
  episodesContainer.innerHTML = "";
  episodeList.forEach((episode) => {
    const card = createEpisodeCard(episode);
    episodesContainer.appendChild(card);
  });
  document.getElementById(
    "search-count"
  ).textContent = `Displaying ${episodeList.length} / ${allEpisodes.length} episodes.`;
}

// Create an episode card element
function createEpisodeCard(episode) {
  const episodeCard = document.createElement("div");
  episodeCard.classList.add("card");

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")}`;
  const limitedSummary = episode.summary
    ? episode.summary.split(" ").slice(0, 20).join(" ") +
      (episode.summary.split(" ").length > 20 ? "..." : "")
    : "No summary available.";

  episodeCard.innerHTML = `
    <img src="${episode.image ? episode.image.medium : ""}" alt="${
    episode.name
  }">
    <div class="card-content">
      <h3>${episode.name} - ${episodeCode}</h3>
      <p>${limitedSummary}</p>
      <a href="${episode.url}" target="_blank">More info</a>
    </div>
  `;
  return episodeCard;
}

// Handle search input dynamically
function handleSearchInput(query) {
  query = query.toLowerCase();
  if (currentView === "shows") {
    const filteredShows = allShows.filter((show) =>
      show.name.toLowerCase().includes(query)
    );
    displayFilteredShows(filteredShows);
  } else if (currentView === "episodes") {
    const filteredEpisodes = allEpisodes.filter((episode) =>
      episode.name.toLowerCase().includes(query)
    );
    displayEpisodes(filteredEpisodes);
  }
}

// Display filtered shows
function displayFilteredShows(shows) {
  const showsContainer = document.querySelector(".episodes-container");
  showsContainer.innerHTML = "";
  shows.forEach((show) => {
    const card = createShowCard(show);
    showsContainer.appendChild(card);
  });
  document.getElementById(
    "search-count"
  ).textContent = `Displaying ${shows.length} / ${allShows.length} shows.`;
}

// Setup event listeners for user interactions
function setupEventListeners() {
  const searchBox = document.getElementById("search-box");
  const showSelector = document.getElementById("show-selector");
  const backButton = document.getElementById("back-button");

  searchBox.addEventListener("input", () => handleSearchInput(searchBox.value));

  showSelector.addEventListener("change", () => {
    const selectedShowId = showSelector.value;
    if (selectedShowId) {
      loadEpisodes(selectedShowId);
    } else {
      displayAllShows();
    }
  });

  backButton.addEventListener("click", () => {
    displayAllShows();
    toggleBackButton(false);
  });
}

// Handle errors and display an error message
function handleError(error) {
  document.getElementById(
    "search-count"
  ).textContent = `Error: ${error.message}. Please try again later.`;
}

// Toggle visibility of the back button
function toggleBackButton(show) {
  const backButton = document.getElementById("back-button");
  backButton.style.display = show ? "block" : "none";
}

// Initialize app on page load
window.onload = setup;
