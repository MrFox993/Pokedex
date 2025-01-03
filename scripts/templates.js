function getCardsHTMLTemplate(pokemon) {
  return `
    <div class="card">
        <div class="card-body flex column">
            <div class= "card-header">
                <h5 class="card-title"># ${pokemon.id}</h5>
                <h3 class="card-subtitle mb-2 text-body-secondary">${pokemon.name}</h3>
            </div>
            <img class="${pokemon.types[0]} pokeball-bgr pokemon-img" src="${pokemon.image_default}" alt="${pokemon.name}">
            <div id="card-types-${pokemon.id}" class="card-footer">
                <p>${pokemon.types[0]}</p>
                <p>${pokemon.types[1]}</p>
            </div>
        </div>
    </div>
    `;
}

function getTypeHTMLTemplate(pokemon, typeIndex) {
  return `
        <img class="${pokemon.types[typeIndex]}" src="./assets/img/${pokemon.types[typeIndex]}.png" alt="${pokemon.types[typeIndex]}">
    `;
}

function getLoadingSpinnerHTMLTemplate() {
  return `
  <img src="./assets/img/pokeball.png" alt="" class="spinner">
    `;
}

function getLoadMoreButtonHTMLTemplate() {
  return `
        <button class="btn btn-secondary" type="button" onclick="storeFetchedData()">Load more</button>
    `;
}