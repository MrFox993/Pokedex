function getCardsHTMLTemplate(pokemonIndex) {
  return `
    <div class="card" style="width: 18rem;">
        <div class="card-body flex column">
            <div class= "card-header">
                <h5 class="card-title"># ${currentPokemons[pokemonIndex].id}</h5>
                <h3 class="card-subtitle mb-2 text-body-secondary">${currentPokemons[pokemonIndex].name}</h3>
            </div>
            <img class="${currentPokemons[pokemonIndex].types[0]}" src="${currentPokemons[pokemonIndex].image}" alt="${currentPokemons[pokemonIndex].name}">
            <div class="card-footer">
                <p>${currentPokemons[pokemonIndex].types[0]}</p>
                <p>${currentPokemons[pokemonIndex].types[1]}</p>
            </div>
        </div>
    </div>
    `;
}
