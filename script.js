const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let limit = 25;
let offset = 0;
let fetchedPokemon = [];
let formattedPokemon = [];
let allPokemon = [];
let displayedPokemon = [];

async function init() {
  renderLoadingSpinner();
  storeFetchedData();
}

async function fetchFirstData() {
  if (fetchedPokemon.length != 0) {
    offset += limit;
  }
  let response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
  let responseJson = await response.json();
  //   console.log(responseJson);
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
        // console.log(`${fetchedPokemon[pokemonIndex].name} data fetched:`, responseJson);
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

async function storeFetchedData() {
  try {
    showLoadingSpinner();
    let fetchedData = await fetchFirstData();
    fetchedPokemon = fetchedData;
    await fetchPokemonData();
    formattedPokemon = formatPokemonData(fetchedPokemon);
    allPokemon.push(...formattedPokemon);
    console.log(`formattedPokemon: `, formattedPokemon);
    console.log(`allPokemon: `, allPokemon);
    renderPokemons();
  } catch (error) {
    console.error(error);
  }
  finally {
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
    };
  });
}

async function renderPokemons() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  for (let pokemonIndex = 0; pokemonIndex < allPokemon.length; pokemonIndex++) {
    contentRef.innerHTML += getCardsHTMLTemplate(pokemonIndex);
  }
  renderPokemonTypes();
  renderLoadMoreButton();
}

async function renderPokemonTypes() {
  for (let pokemonIndex = 0; pokemonIndex < allPokemon.length; pokemonIndex++) {
    let cardTypesRef = document.getElementById(`card-types-${allPokemon[pokemonIndex].id}`);
    let pokemonType = allPokemon[pokemonIndex].types;
    cardTypesRef.innerHTML = "";
    for (let typeIndex = 0; typeIndex < pokemonType.length; typeIndex++) {
      cardTypesRef.innerHTML += getTypeHTMLTemplate(pokemonIndex, typeIndex);
    }
  }
}

// async function fetchMoreData() {
//   offset += limit;
//   let newFetchedData = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
//   let newFetchedDataJson = await newFetchedData.json();
//   let fetchResults = await newFetchedDataJson.results;
//   // console.log(`fetchResults more Data`, fetchResults);
//   return new Promise((resolve, reject) => {
//     if (newFetchedData.ok) {
//       resolve(fetchResults);
//     } else {
//       reject(`Fetching data failed status code ${newFetchedData.status}`);
//     }
//   });
// }

// async function storeMoreFetchedData() {
//   try {
//     showLoadingSpinner();
//     let fetchedData = await fetchMoreData();
//     fetchedPokemon = fetchedData;
//     await fetchPokemonData();
//     formattedPokemon = formatPokemonData(fetchedPokemon);
//     allPokemon = formattedPokemon;
//     console.log(`formattedPokemon: `, formattedPokemon);
//     renderPokemons();
//   } catch (error) {
//     console.error(error);
//   }
//   finally {
//     hideLoadingSpinner();
//   }
// }

function renderLoadingSpinner() {
  let loadingSpinnerRef = document.getElementById("loading-overlay");
  loadingSpinnerRef.innerHTML = "";
  loadingSpinnerRef.innerHTML = getLoadingSpinnerHTMLTemplate();
  loadingSpinnerRef.classList.add('d_none');
}

function renderLoadMoreButton() {
  let loadMoreBtnRef = document.getElementById('load-more-btn');
  loadMoreBtnRef.innerHTML = "";
  loadMoreBtnRef.innerHTML = getLoadMoreButtonHTMLTemplate();
}

function showLoadingSpinner() {
  let loadingSpinnerRef = document.getElementById('loading-overlay');
  loadingSpinnerRef.classList.remove('d_none');
}

function hideLoadingSpinner() {
  let loadingSpinnerRef = document.getElementById('loading-overlay');
  loadingSpinnerRef.classList.add('d_none');
}

function filterPokemonList() {
  let searchInput = document.getElementById("pokemon-search").value.toLowerCase();
  
  if (searchInput.length >= 3) {
      let filteredPokemons = allPokemon.filter(pokemon =>
          pokemon.name.toLowerCase().includes(searchInput)
      );
      console.log(`filteredPokemons: `, filteredPokemons);
      // renderFilteredPokemons(filteredPokemons);
  } else {
      renderPokemons();
  }
}

async function renderFilteredPokemons(filteredPokemons) {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";

  for (let pokemonIndex = 0; pokemonIndex < filteredPokemons.length; pokemonIndex++) {
      contentRef.innerHTML += getCardsHTMLTemplate(filteredPokemons[pokemonIndex]);
  }

  // Typen der gefilterten Pokémon rendern
  // for (let pokemonIndex = 0; pokemonIndex < filteredPokemons.length; pokemonIndex++) {
  //     let cardTypesRef = document.getElementById(`card-types-${filteredPokemons[pokemonIndex].id}`);
  //     let pokemonType = filteredPokemons[pokemonIndex].types;
  //     cardTypesRef.innerHTML = "";
  //     for (let typeIndex = 0; typeIndex < pokemonType.length; typeIndex++) {
  //         cardTypesRef.innerHTML += getTypeHTMLTemplate(pokemonIndex, typeIndex, filteredPokemons);
  //     }
  // }
}