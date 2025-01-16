const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let limit = 25;
let offset = 0;
const maxLimit = 10277;
let fetchedPokemon = [];
let formattedPokemon = [];
let allPokemon = [];
let filteredPokemon = [];
let isFilterActive = false;

async function init() {
  renderLoadingSpinner();
  storeFetchedData();
}

async function fetchFirstData() {
  checkFetchedPokemonLength();
  let response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
  let responseJson = await response.json();
  let fetchResults = await responseJson.results;
  return new Promise((resolve, reject) => {
    if (response.ok) {
      resolve(fetchResults);
    } else {
      reject(`Fetching data failed status code ${response.status}`);
    }
  });
}

function checkFetchedPokemonLength() {
  if (fetchedPokemon.length != 0) {
    if (offset + limit > maxLimit) {
      limit = maxLimit - offset;
    }
    offset += limit;
    if (offset >= maxLimit) {
      document.getElementById("load-button").disabled = true;
    }
  }
}

async function fetchPokemonData() {
  return new Promise(async (resolve, reject) => {
    try {
      for (let pokemonIndex = 0; pokemonIndex < fetchedPokemon.length; pokemonIndex++) {
        let response = await fetch(`${fetchedPokemon[pokemonIndex].url}`);
        let responseJson = await response.json();
        fetchedPokemon[pokemonIndex] = {
          ...fetchedPokemon[pokemonIndex],
          details: responseJson,
        };
        fillProgressBar(pokemonIndex);
      }
      await fetchSpeciesPokemonData();
      await fetchEvolutionPokemonData();
      resolve("data successfully fetched");
    } catch (error) {
      reject(`Error fetching Pokémon data: ${error}`);
    }
  });
}

function fillProgressBar(pokemonIndex) {
  let progressBarFill = document.getElementById('progress-bar-fill');
  let totalPokemon = fetchedPokemon.length;
  let progress = ((pokemonIndex + 1) / totalPokemon) * 100;
  progressBarFill.style.width = `${progress}%`;
}

async function fetchSpeciesPokemonData() {
  return new Promise(async (resolve, reject) => {
    try {
      for (let pokemonIndex = 0; pokemonIndex < fetchedPokemon.length; pokemonIndex++) {
        let response = await fetch(`${fetchedPokemon[pokemonIndex].details.species.url}`);
        let responseJson = await response.json();
        fetchedPokemon[pokemonIndex] = {
          ...fetchedPokemon[pokemonIndex],
          species: responseJson,
        };
      }
      resolve("data successfully fetched");
    } catch (error) {
      reject(`Error fetching Pokémon data: ${error}`);
    }
  });
}

async function fetchEvolutionPokemonData() {
  return new Promise(async (resolve, reject) => {
    try {
      for (let pokemonIndex = 0; pokemonIndex < fetchedPokemon.length; pokemonIndex++) {
        let response = await fetch(`${fetchedPokemon[pokemonIndex].species.evolution_chain.url}`);
        let responseJson = await response.json();
        fetchedPokemon[pokemonIndex] = {
          ...fetchedPokemon[pokemonIndex],
          evolution: responseJson,
        };
      }
      resolve("data successfully fetched");
    } catch (error) {
      reject(`Error fetching Pokémon data: ${error}`);
    }
  });
}

async function storeFetchedData() {
  try {
    showLoadingSpinner();
    let fetchedData = await fetchFirstData();
    fetchedPokemon = fetchedData;
    await fetchPokemonData();
    formattedPokemon = formatPokemonData(fetchedPokemon);
    allPokemon.push(...formattedPokemon);
    filterPokemonList();
    renderFilteredPokemons();
  } catch (error) {
    console.error(error);
  } finally {
    hideLoadingSpinner();
  }
}

function formatPokemonData(fetchedPokemon) {
  return fetchedPokemon.map((pokemon) => {
    const englishFlavorText = pokemon.species.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    ).flavor_text;

    return {
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      id: pokemon.url.split("/").filter(Boolean).pop(),
      url: pokemon.url,
      details: pokemon.details,
      types: pokemon.details.types.map((type) => type.type.name),
      image_default: pokemon.details.sprites.other["official-artwork"].front_default,
      image_shiny: pokemon.details.sprites.other["official-artwork"].front_shiny,
      species_url: pokemon.details.species.url,
      stats: {
        hp: pokemon.details.stats[0].base_stat,
        attack: pokemon.details.stats[1].base_stat,
        defense: pokemon.details.stats[2].base_stat,
        special_attack: pokemon.details.stats[3].base_stat,
        special_defense: pokemon.details.stats[4].base_stat,
        speed: pokemon.details.stats[5].base_stat,
        height: (pokemon.details.height / 10).toFixed(1),
        weight: (pokemon.details.weight / 10).toFixed(1)
      },
      species_flavor_text: englishFlavorText,
      evolution: pokemon.evolution,
    };
  });
}

function renderAllPokemon() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  for (let pokemonIndex = 0; pokemonIndex < filteredPokemon.length; pokemonIndex++) {
    let pokemon = filteredPokemon[pokemonIndex];
    let pokemonId = Intl.NumberFormat("de-DE", { minimumIntegerDigits: 3 }).format(pokemon.id);
    let pokemonIndex = pokemon.id - 1;
  
    contentRef.innerHTML += getCardsHTMLTemplate(pokemon, pokemonId, pokemonIndex);
  }
  renderAllPokemonTypes();
  renderLoadMoreButton();
}

async function renderAllPokemonTypes() {
  for (let pokemonIndex = 0; pokemonIndex < filteredPokemon.length; pokemonIndex++) {
    let cardTypesRef = document.getElementById(`card-types-${filteredPokemon[pokemonIndex].id}`);
    let pokemonType = filteredPokemon[pokemonIndex].types;
    cardTypesRef.innerHTML = "";
    for (let typeIndex = 0; typeIndex < pokemonType.length; typeIndex++) {
      if (pokemonType[typeIndex]) {
        cardTypesRef.innerHTML += getTypeHTMLTemplate(filteredPokemon[pokemonIndex], typeIndex);
      }
    }
  }
}

function renderLoadingSpinner() {
  let loadingSpinnerRef = document.getElementById("loading-overlay");
  loadingSpinnerRef.innerHTML = "";
  loadingSpinnerRef.innerHTML = getLoadingSpinnerHTMLTemplate();
  loadingSpinnerRef.classList.add("d_none");
}

function renderLoadMoreButton() {
  let loadMoreBtnRef = document.getElementById("load-more-btn");
  loadMoreBtnRef.innerHTML = "";
  loadMoreBtnRef.innerHTML = getLoadMoreButtonHTMLTemplate();
}

function showLoadingSpinner() {
  let loadingSpinnerRef = document.getElementById("loading-overlay");
  loadingSpinnerRef.classList.remove("d_none");
}

function hideLoadingSpinner() {
  let loadingSpinnerRef = document.getElementById("loading-overlay");
  let progressBarFill = document.getElementById("progress-bar-fill");
  progressBarFill.style.width = "0%";
  loadingSpinnerRef.classList.add("d_none");
}

function filterPokemonList() {
  let searchInput = document.getElementById("pokemon-search").value.toLowerCase();

  checkAllPokemonList();

  if (searchInput.length >= 3 || !isNaN(searchInput)) {
    filteredPokemon = allPokemon.filter((pokemon) => {
      const nameMatch = pokemon.name.toLowerCase().includes(searchInput);
      const idMatch = !isNaN(searchInput) && pokemon.id.toString().includes(searchInput);
      const typeMatch = pokemon.types.some((type) => type.toLowerCase().includes(searchInput));

      return nameMatch || idMatch || typeMatch;
    });
  } else {
    filteredPokemon = [...allPokemon];
  }

  isFilterActive = filteredPokemon.length !== allPokemon.length;

  if (filteredPokemon.length === 0) {
    renderNoResultsFound();
  } else {
    renderFilteredPokemons();
  }
}

function checkAllPokemonList() {
  if (!allPokemon) {
    console.error("allPokemon is undefined");
    return [];
  }
}

function renderNoResultsFound() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = getNoResultsHTMLTemplate();
}

function renderFilteredPokemons() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  checkFilteredPokemonList();
  for (let pokemonIndex = 0; pokemonIndex < filteredPokemon.length; pokemonIndex++) {
    let pokemon = filteredPokemon[pokemonIndex];
    let pokemonId = Intl.NumberFormat("de-DE", { minimumIntegerDigits: 3 }).format(pokemon.id);

    contentRef.innerHTML += getCardsHTMLTemplate(pokemon, pokemonId, pokemonIndex);
  }
  renderAllPokemonTypes();
  renderLoadMoreButton();
}

function checkFilteredPokemonList() {
  if (!filteredPokemon || filteredPokemon.length === 0) {
    console.error("filteredPokemon is undefined or empty");
    renderNoResultsFound();
    return;
  }
}

async function loadPokemonInfoCard(pokemonIndex) {
  let pokemon = allPokemon[pokemonIndex];
  let pokemonId = Intl.NumberFormat("de-DE", { minimumIntegerDigits: 3 }).format(pokemon.id);
  let modalHTML = getModalContentHTMLTemplate(pokemon, pokemonIndex, pokemonId);

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  let modalElement = document.getElementById("pokemonInfoModal");
  modalElement.classList.add("flip-in");
  let modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();

  let evolutionData = allPokemon[pokemonIndex].evolution;

  try {
    if (evolutionData) {
      const evolutionChainHTML = generateEvolutionChainHTML(evolutionData);
      document.getElementById("evolution-chain").innerHTML = evolutionChainHTML;
    } else {
      document.getElementById("evolution-chain").innerHTML = `<p class="text-center text-muted">No evolution data available.</p>`;
    }
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    document.getElementById("evolution-chain").innerHTML = `<p class="text-center text-danger">Failed to load evolution data.</p>`;
  }

  modalInstance._element.addEventListener("hidden.bs.modal", () => {
    modalElement.classList.remove("flip-in");
    modalElement.classList.add("flip-out");
    setTimeout(() => {
      modalElement.remove();
    }, 500);
  });

  updateNavigationButtons(pokemonIndex);
}


function navigatePokemon(index) {
  checkFilteredPokemonLength();
  let currentModalElement = document.getElementById("pokemonInfoModal");
  if (currentModalElement) {
    let currentModalInstance = bootstrap.Modal.getInstance(currentModalElement);
    currentModalInstance.hide();
    currentModalElement.addEventListener("hidden.bs.modal", () => {
      currentModalElement.remove();
      loadPokemonInfoCard(index);
      updateNavigationButtons(index);
    });
  } else {
    loadPokemonInfoCard(index);
    updateNavigationButtons(index);
  }
}

function checkFilteredPokemonLength() {
  if (index < 0 || index >= filteredPokemon.length) {
    return;
  }
}

function updateNavigationButtons(index) {
  let prevButton = document.getElementById("prevButton");
  let nextButton = document.getElementById("nextButton");

  if (isFilterActive) {
    prevButton.disabled = true;
    prevButton.classList.add("disabled");
    nextButton.disabled = true;
    nextButton.classList.add("disabled");
  } else {
    checkPokemonIndexOnEndList(index);
  }
}

function checkPokemonIndexOnEndList(index) {
  if (index <= 0) {
    prevButton.disabled = true;
    prevButton.classList.add("disabled");
  } else {
    prevButton.disabled = false;
    prevButton.classList.remove("disabled");
  }

  if (index >= filteredPokemon.length - 1) {
    nextButton.disabled = true;
    nextButton.classList.add("disabled");
  } else {
    nextButton.disabled = false;
    nextButton.classList.remove("disabled");
  }
}

function generateEvolutionChainHTML(evolutionData) {
  let evolutionHTML = '';

  function traverseChain(chainNode) {
    if (!chainNode) return;

    const speciesName = chainNode.species.name;
    const speciesId = chainNode.species.url.split("/").slice(-2, -1)[0];
    const speciesImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`;

    evolutionHTML += `
      <div class="d-flex flex-column align-items-center mx-3">
        <img src="${speciesImage}" alt="${speciesName}" class="evolution-image img-fluid" />
        <p class="text-center">${speciesName}</p>
      </div>
    `;

    if (chainNode.evolves_to && chainNode.evolves_to.length > 0) {
      evolutionHTML += `<i class="bi bi-arrow-right-circle mx-2"></i>`;
      chainNode.evolves_to.forEach(evolve => traverseChain(evolve));
    }
  }

  traverseChain(evolutionData.chain);
  return evolutionHTML;
}