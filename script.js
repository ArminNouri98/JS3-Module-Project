async function fetchEpisodes() {
  try {
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

async function setup() {
  try {
    const allEpisodes = await fetchEpisodes();
    if (!allEpisodes) {
      throw new Error('Failed to load episodes');
    }

    // Populate the episode selector dropdown
    populateEpisodeSelector(allEpisodes);

    // Render all episodes initially
    makePageForEpisodes(allEpisodes);

    // Add event listeners for search and selector
    setupEventListeners(allEpisodes);
  } catch (error) {
    console.error('There has been a problem with your setup:', error);
  }
}

function populateEpisodeSelector(allEpisodes) {
  const selector = document.getElementById("episode-selector");

  selector.innerHTML = '<option value="">All Episodes</option>';

  allEpisodes.forEach((episode) => {
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
  infoText.textContent = `Displaying ${episodeList.length} episodes`;
}

function createEpisodeCard(episode) {
  const episodeCard = document.createElement("div");
  episodeCard.classList.add("card");

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;

  episodeCard.innerHTML = `
    <img src="${episode.image.medium}" alt="${episode.name}">
    <div class="card-content">
      <h3>${episode.name} - ${episodeCode}</h3>
      <p>${episode.summary}</p>
      <a href="${episode.url}" target="_blank">More info</a>
    </div>
  `;

  return episodeCard;
}

function setupEventListeners(allEpisodes) {
  const searchBox = document.getElementById("search-box");
  const selector = document.getElementById("episode-selector");

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

  // Selector functionality
  selector.addEventListener("change", () => {
    const selectedEpisodeId = selector.value;
    if (selectedEpisodeId) {
      const selectedEpisode = allEpisodes.find((ep) => ep.id === parseInt(selectedEpisodeId));
      makePageForEpisodes(selectedEpisode ? [selectedEpisode] : []);
    } else {
      makePageForEpisodes(allEpisodes);
    }
  });
}

window.onload = setup;
