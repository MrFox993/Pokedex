function getCardsHTMLTemplate(pokemonIndex) {
  return `
    <div class="card" style="width: 18rem;">
        <div class="card-body flex column">
            <div class= "card-header">
                <h5 class="card-title"># ${currentPokemons[pokemonIndex].id}</h5>
                <h3 class="card-subtitle mb-2 text-body-secondary">${currentPokemons[pokemonIndex].name}</h3>
            </div>
            <img src="${currentPokemons[pokemonIndex].image}" alt="${currentPokemons[pokemonIndex].name}">
            <a href="#" class="card-link">Card link</a>
            <a href="#" class="card-link">Another link</a>
        </div>
    </div>
    `;
}
