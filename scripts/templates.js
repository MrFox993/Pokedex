function getCardsHTMLTemplate(pokemon) {
  let pokemonId = Intl.NumberFormat("de-DE", { minimumIntegerDigits: 3 }).format(pokemon.id);
  let pokemonIndex = pokemon.id - 1;
  return `
    <div class="card" onclick="loadPokemonInfoCard(${pokemonIndex})">
        <div class="card-body flex column">
            <div class= "card-header">
                <h5 class="card-title"># ${pokemonId}</h5>
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
        <button class="btn btn-secondary" type="button" onclick="storeFetchedData()" id="load-button">Load more</button>
    `;
}

function getNoResultsHTMLTemplate() {
  return `
  <div class="card">
  <div class="card-body flex column">
      <div class= "card-header no-results-header">
          <h5 class="card-title"></h5>
          <h3 class="card-subtitle mb-2 text-body-secondary"></h3>
      </div>
      <h1 class="no-results-content pokeball-bgr">No results found</h1>
      <div class="card-footer no-results-footer">
          <p></p>
          <p></p>
      </div>
  </div>
</div>
  `;
}

function getModalContentHTMLTemplate(pokemon, pokemonIndex) {
  return `
    <div class="modal fade" id="pokemonInfoModal" tabindex="-1" aria-labelledby="pokemonInfoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="pokemonInfoModalLabel">#${pokemon.id} - ${pokemon.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-column align-items-center">
              <div class="d-flex align-items-center">
                <button class="btn btn-secondary me-3" onclick="navigatePokemon(${pokemonIndex - 1})">
                  <i class="bi bi-arrow-left-circle"></i>
                </button>
                <img src="${pokemon.image_shiny}" alt="${pokemon.name}" class="pokemon-image img-fluid" />
                <button class="btn btn-secondary ms-3" onclick="navigatePokemon(${pokemonIndex + 1})">
                  <i class="bi bi-arrow-right-circle"></i>
                </button>
              </div>
              <div class="mt-3">
                <p><strong>Types:</strong> ${pokemon.types.join(", ")}</p>
              </div>
            </div>
            <ul class="nav nav-tabs mt-4" id="pokemonTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="about-tab" data-bs-toggle="tab" data-bs-target="#about" type="button" role="tab" aria-controls="about" aria-selected="true">About</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="stats-tab" data-bs-toggle="tab" data-bs-target="#stats" type="button" role="tab" aria-controls="stats" aria-selected="false">Stats</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="evolutions-tab" data-bs-toggle="tab" data-bs-target="#evolutions" type="button" role="tab" aria-controls="evolutions" aria-selected="false">Evolutions</button>
              </li>
            </ul>
            <div class="tab-content mt-3">
              <div class="tab-pane fade show active" id="about" role="tabpanel" aria-labelledby="about-tab">
                <p><strong>Base Experience:</strong> ${pokemon.details.base_experience}</p>
                <p><strong>Abilities:</strong> ${pokemon.details.abilities
                  .map((ability) => ability.ability.name)
                  .join(", ")}</p>
              </div>
              <div class="tab-pane fade" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <p>Stats information goes here.</p>
              </div>
              <div class="tab-pane fade" id="evolutions" role="tabpanel" aria-labelledby="evolutions-tab">
                <p>Evolution information goes here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
