function getCardsHTMLTemplate(pokemonIndex) {
  return `
    <div class="card" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title"># ${pokemonIndex}</h5>
      <h6 class="card-subtitle mb-2 text-body-secondary">${currentPokemons[pokemonIndex].name}</h6>
      <img src="#" alt="#">
      <a href="#" class="card-link">Card link</a>
      <a href="#" class="card-link">Another link</a>
    </div>
  </div>
    `;
}
