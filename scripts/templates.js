function getCardsHTMLTemplate(pokemonIndex) {
    if (filteredPokemon.length > 0) {
        allPokemon = filteredPokemon;
    }
  return `
    <div class="card">
        <div class="card-body flex column">
            <div class= "card-header">
                <h5 class="card-title"># ${allPokemon[pokemonIndex].id}</h5>
                <h3 class="card-subtitle mb-2 text-body-secondary">${allPokemon[pokemonIndex].name}</h3>
            </div>
            <img class="${allPokemon[pokemonIndex].types[0]} pokeball-bgr pokemon-img" src="${allPokemon[pokemonIndex].image_default}" alt="${allPokemon[pokemonIndex].name}">
            <div id="card-types-${allPokemon[pokemonIndex].id}" class="card-footer">
                <p>${allPokemon[pokemonIndex].types[0]}</p>
                <p>${allPokemon[pokemonIndex].types[1]}</p>
            </div>
        </div>
    </div>
    `;
}

function getTypeHTMLTemplate(pokemonIndex, typeIndex) {
  return `
        <img class="${allPokemon[pokemonIndex].types[typeIndex]}" src="./assets/img/${allPokemon[pokemonIndex].types[typeIndex]}.png" alt="${allPokemon[pokemonIndex].types[typeIndex]}">
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