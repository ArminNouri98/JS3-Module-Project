let allShows = []; // To store available shows
let allEpisodes = []; // To store episodes for the selected show
let currentShowId = null; // To track the current selected show

function setup() {
  const infoText = document.getElementById("search-count");
  infoText.textContent = "Loading shows... Please wait.";

  // Fetch and load shows when the page loads
  fetchShows().then(() => {
    populateShowSelector(allShows);
  }).catch((error) => {
    handleError(error);
  });
}

async function fetchShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) {
      throw new Error("Failed to fetch shows.");
    }
    allShows = await response.json();
    console.log('Fetched shows:', allShows); // For Debugging

    allShows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })); // Sort shows alphabetically
  } catch (error) {
    throw new Error("Failed to fetch shows.");
  }
}

function populateShowSelector(shows) {
  const selector = document.getElementById("show-selector");

  selector.innerHTML = '<option value="">Select a Show</option>';

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selector.appendChild(option);
  });

  // Display a loading message once the shows are populated
  const infoText = document.getElementById("search-count");
  infoText.textContent = `Loaded ${shows.length} shows.`;
  setupEventListeners(); // Set up event listeners after shows are populated
}

function handleError(error) {
  const infoText = document.getElementById("search-count");
  infoText.textContent = `Error: ${error.message}. Please try again later.`;
}

function setupEventListeners() {
  const searchBox = document.getElementById("search-box");
  const episodeSelector = document.getElementById("episode-selector");
  const showSelector = document.getElementById("show-selector");

  // Show selection event listener
  showSelector.addEventListener("change", () => {
    const selectedShowId = showSelector.value;
    if (selectedShowId) {
      if (currentShowId !== selectedShowId) {
        currentShowId = selectedShowId;
        fetchEpisodes(selectedShowId).then(() => {
          populateEpisodeSelector(allEpisodes);
          makePageForEpisodes(allEpisodes);
        }).catch((error) => {
          handleError(error);
        });
      }
    }
  });

  // Search functionality
  searchBox.addEventListener("input", () => {
    const query = searchBox.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(query) ||
        episode.summary.toLowerCase().includes(query)
    );
    makePageForEpisodes(filteredEpisodes);
  });

  // Episode selector functionality
  episodeSelector.addEventListener("change", () => {
    const selectedEpisodeId = episodeSelector.value;
    if (selectedEpisodeId) {
      const selectedEpisode = allEpisodes.find((ep) => ep.id === parseInt(selectedEpisodeId));
      makePageForEpisodes(selectedEpisode ? [selectedEpisode] : []);
    } else {
      makePageForEpisodes(allEpisodes);
    }
  });
}

async function fetchEpisodes(showId) {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    if (!response.ok) {
      throw new Error("Failed to fetch episodes.");
    }
    allEpisodes = await response.json();
    console.log('Fetched episodes:', allEpisodes); // Debugging: log episodes data
  } catch (error) {
    throw new Error("Failed to fetch episodes.");
  }
}

function populateEpisodeSelector(episodeList) {
  const selector = document.getElementById("episode-selector");
  selector.innerHTML = '<option value="">All Episodes</option>';

  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
    selector.appendChild(option);
  });
}

function makePageForEpisodes(episodeList) {
  const episodesContainer = document.querySelector(".episodes-container");

  // Clear previous episodes
  episodesContainer.innerHTML = "";

  // Render each episode
  episodeList.forEach((episode) => {
    const card = createEpisodeCard(episode);
    episodesContainer.appendChild(card);
  });

  // Update the info text
  const infoText = document.getElementById("search-count");
  infoText.textContent = `Displaying ${episodeList.length} / ${allEpisodes.length} episodes`;
}

function createEpisodeCard(episode) {
  const episodeCard = document.createElement("div");
  episodeCard.classList.add("card");

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;

  episodeCard.innerHTML = `
    <img src="${episode.image ? episode.image.medium : ''}" alt="${episode.name}">
    <div class="card-content">
      <h3>${episode.name} - ${episodeCode}</h3>
      <p>${episode.summary}</p>
      <a href="${episode.url}" target="_blank">More info</a>
    </div>
  `;

  return episodeCard;
}

window.onload = setup;
