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
  let pokemonId = Intl.NumberFormat("de-DE", { minimumIntegerDigits: 3 }).format(pokemon.id);
  return `
    <div class="modal fade" id="pokemonInfoModal" tabindex="-1" aria-labelledby="pokemonInfoModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="pokemonInfoModalLabel">#${pokemonId} - ${pokemon.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
            <div class="d-flex flex-column align-items-center ${pokemon.types[0]}">
              <div class="d-flex align-items-center">
                <button id="prevButton" type="button" class="btn btn-secondary" onclick="navigatePokemon(${pokemonIndex - 1})">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <img src="${pokemon.image_shiny}" alt="${pokemon.name}" class="pokemon-image img-fluid" />
                <button id="nextButton" type="button" class="btn btn-secondary" onclick="navigatePokemon(${pokemonIndex + 1})">
                    <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
              <div class="pt-3 modal-types">
                <p><strong>Types:</strong> ${pokemon.types.join(", ")}</p>
              </div>
            <div class="modal-footer d-flex column align-items-center">
                <ul class="nav nav-tabs mt-4 w-100 d-flex align-items-center justify-content-evenly" id="pokemonTab" role="tablist">
                <li class="nav-item w-33 text-center" role="presentation">
                    <button class="nav-link w-100 active" id="about-tab" data-bs-toggle="tab" data-bs-target="#about" type="button" role="tab" aria-controls="about" aria-selected="true">About</button>
                </li>
                <li class="nav-item w-33 text-center" role="presentation">
                    <button class="nav-link w-100" id="stats-tab" data-bs-toggle="tab" data-bs-target="#stats" type="button" role="tab" aria-controls="stats" aria-selected="false">Stats</button>
                </li>
                <li class="nav-item w-33 text-center" role="presentation">
                    <button class="nav-link w-100" id="evolutions-tab" data-bs-toggle="tab" data-bs-target="#evolutions" type="button" role="tab" aria-controls="evolutions" aria-selected="false">Evolutions</button>
                </li>
                </ul>
                <div class="tab-content mt-3">
                <div class="tab-pane fade show active max-w-480" id="about" role="tabpanel" aria-labelledby="about-tab">
                    <p class=""><strong>${pokemon.species_flavor_text}</strong></p>
                    <table>
                        <tr>
                            <td><strong>Height</strong></td>
                            <td>${pokemon.stats.height} m</td>
                        </tr>
                        <tr>
                            <td><strong>Weight</strong></td>
                            <td>${pokemon.stats.weight} kg</td>
                        </tr>
                        <tr>
                            <td><strong>Abilities</strong></td>
                            <td>${pokemon.details.abilities.map((ability) => ability.ability.name).join(", ")}</td>
                        </tr>
                    </table>
                </div>
                <div class="tab-pane fade" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                <table>
                <tr>
                    <td><strong>HP</strong></td>
                    <td>${pokemon.stats.hp}</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: ${
                              pokemon.stats.hp
                            }%" aria-valuenow="${pokemon.stats.hp}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><strong>Attack</strong></td>
                    <td>${pokemon.stats.attack}</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: ${
                              pokemon.stats.attack
                            }%" aria-valuenow="${pokemon.stats.attack}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><strong>Defense</strong></td>
                    <td>${pokemon.stats.defense}</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: ${
                              pokemon.stats.defense
                            }%" aria-valuenow="${pokemon.stats.defense}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><strong>Special Attack</strong></td>
                    <td>${pokemon.stats.special_attack}</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: ${
                              pokemon.stats.special_attack
                            }%" aria-valuenow="${
    pokemon.stats.special_attack
  }" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><strong>Special Defense</strong></td>
                    <td>${pokemon.stats.special_defense}</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar" role="progressbar" style="width: ${
                              pokemon.stats.special_defense
                            }%" aria-valuenow="${
    pokemon.stats.special_defense
  }" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </td>
                </tr>
            </table>
                </div>
                <div class="tab-pane fade" id="evolutions" role="tabpanel" aria-labelledby="evolutions-tab">
                    <p>No available Evolutions.</p>
                </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
