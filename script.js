//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
  
      <img src="${episode.image.medium}" alt="${episode.name}">
      <div class="card-content">
        <h3>${episode.name} - S${String(episode.season).padStart(
      2,
      "0"
    )}E${String(episode.number).padStart(2, "0")}</h3>
        <p>${episode.summary}</p>
        <a href="${episode.url}" target="_blank">More info</a>
      </div>
    

    `;

    rootElem.appendChild(card);
  });
}
window.onload = setup;
