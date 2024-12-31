//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

// Function to render a list of episodes on the page
function makePageForEpisodes(episodeList) {
  // Get the root element where all episodes will be displayed
  const rootElem = document.getElementById("root");

  // Iterate over the list of episodes
  episodeList.forEach((episode) => {
    // Create a container (card) for each episode
    const card = createEpisodeCard(episode);
    card.className = "card"; // Assign a class to the card for styling

    // Populate the card with episode details using template literals
    card.innerHTML = `
      <!-- Episode image -->
      <img src="${episode.image.medium}" alt="${episode.name}">
      
      <!-- Content section of the card -->
      <div class="card-content">
        <!-- Episode name, season, and episode number -->
        <h3>${episode.name} - S${String(episode.season).padStart(
      2,
      "0"
    )}E${String(episode.number).padStart(2, "0")}</h3>
        
        <!-- Episode summary -->
        <p>${episode.summary}</p>
        
        <!-- Link to more information about the episode -->
        <a href="${episode.url}" target="_blank">More info</a>
      </div>
    `;

    // Append the card to the root element
    rootElem.appendChild(card);
  });
}
function createEpisodeCard(episode) {
  const episodeCard = document.createElement("div");
  episodeCard.classList.add("episode-card");

  // Create episode code
  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;

  // Set the inner HTML for the episode card
  episodeCard.innerHTML = `
    <img src="${episode.image.medium}" alt="${episode.name}">
    <div class="card-content">
      <h3>${episode.name} - ${episodeCode}</h3>
      <p><strong>Summary:</strong> ${episode.summary}</p>
      <a href="${episode.url}" target="_blank">More info</a>
    </div>
  `;

  return episodeCard;
}
window.onload = setup;