const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let limit = 25;
let offset = 0;
const maxLimit = 10277;
let fetchedPokemon = [];
let formattedPokemon = [];
let allPokemon = [];
let filteredPokemon = [];

async function init() {
  renderLoadingSpinner();
  storeFetchedData();
}

async function fetchFirstData() {
  if (fetchedPokemon.length != 0) {
    if (offset + limit > maxLimit) {
      limit = maxLimit - offset;
    }
    offset += limit;
    if (offset >= maxLimit) {
      document.getElementById("load-button").disabled = true;
    }
  }
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
      }
      resolve("data successfully fetched");
    } catch (error) {
      reject(`Error fetching Pokémon data: ${error}`);
    }
  });
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
    await fetchSpeciesPokemonData();
    await fetchEvolutionPokemonData();
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
    return {
      name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
      id: pokemon.url.split("/").filter(Boolean).pop(),
      url: pokemon.url,
      details: pokemon.details,
      types: pokemon.details.types.map((type) => type.type.name),
      image_default: pokemon.details.sprites.other["official-artwork"].front_default,
      image_shiny: pokemon.details.sprites.other["official-artwork"].front_shiny,
      species_url: pokemon.details.species.url,
      stats: {hp: pokemon.details.stats[0].base_stat, attack: pokemon.details.stats[1].base_stat, defense: pokemon.details.stats[2].base_stat, special_attack: pokemon.details.stats[3].base_stat, special_defense: pokemon.details.stats[4].base_stat, speed: pokemon.details.stats[5].base_stat},
      species_flavor_text: pokemon.species.flavor_text_entries[0].flavor_text,
    };
  });
}

function renderAllPokemon() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  for (let pokemonIndex = 0; pokemonIndex < filteredPokemon.length; pokemonIndex++) {
    contentRef.innerHTML += getCardsHTMLTemplate(filteredPokemon[pokemonIndex]);
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
      if (pokemonType[typeIndex]){
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
  loadingSpinnerRef.classList.add("d_none");
}

function filterPokemonList() {
  if (!allPokemon) {
    console.error('allPokemon is undefined');
    return [];
  }

  let searchInput = document.getElementById("pokemon-search").value.toLowerCase();

  if (searchInput.length >= 3 || !isNaN(searchInput)) {
    filteredPokemon = allPokemon.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(searchInput);
      const idMatch = !isNaN(searchInput) && pokemon.id.toString().includes(searchInput);
      const typeMatch = pokemon.types.some(type => type.toLowerCase().includes(searchInput));

      return nameMatch || idMatch || typeMatch;
    });
    } else {
    filteredPokemon = [...allPokemon];
  }

  if (filteredPokemon.length === 0) {
    renderNoResultsFound();
  } else {
    renderFilteredPokemons();
  }
}

function renderNoResultsFound() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = getNoResultsHTMLTemplate();
}

function renderFilteredPokemons() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  if (!filteredPokemon || filteredPokemon.length === 0) {
    console.error('filteredPokemon is undefined or empty');
    renderNoResultsFound();
    return;
  }
  for (let pokemonIndex = 0; pokemonIndex < filteredPokemon.length; pokemonIndex++) {
    let pokemon = filteredPokemon[pokemonIndex];
    contentRef.innerHTML += getCardsHTMLTemplate(pokemon);
  }
  renderAllPokemonTypes();
  renderLoadMoreButton();
}

function loadPokemonInfoCard(pokemonIndex) {
  let pokemon = filteredPokemon[pokemonIndex];
  console.log("pokemon", pokemon);
  let modalHTML = getModalContentHTMLTemplate(pokemon, pokemonIndex);

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  let modalElement = document.getElementById("pokemonInfoModal");
  let modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();

  modalInstance._element.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}