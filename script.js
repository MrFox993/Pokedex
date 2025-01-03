const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let limit = 25;
let offset = 0;
let allFetchedPokemons = [];
let allFormattedPokemons = [];
let currentPokemons = [];

async function init() {
  renderLoadingSpinner();
  storeFetchedData();
}

async function fetchFirstData() {
  if (allFetchedPokemons.length != 0) {
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
      for (let pokemonIndex = 0; pokemonIndex < allFetchedPokemons.length; pokemonIndex++) {
        let response = await fetch(`${allFetchedPokemons[pokemonIndex].url}`);
        let responseJson = await response.json();
        // console.log(`${allFetchedPokemons[pokemonIndex].name} data fetched:`, responseJson);
        allFetchedPokemons[pokemonIndex] = {
          ...allFetchedPokemons[pokemonIndex],
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
    allFetchedPokemons = fetchedData;
    await fetchPokemonData();
    allFormattedPokemons = formatPokemonData(allFetchedPokemons);
    currentPokemons.push(...allFormattedPokemons);
    console.log(`allformattedPokemons: `, allFormattedPokemons);
    console.log(`currentPokemons: `, currentPokemons);
    renderPokemons();
  } catch (error) {
    console.error(error);
  }
  finally {
    hideLoadingSpinner();
  }
}

function formatPokemonData(allFetchedPokemons) {
  return allFetchedPokemons.map((pokemon) => {
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
  for (let pokemonIndex = 0; pokemonIndex < currentPokemons.length; pokemonIndex++) {
    contentRef.innerHTML += getCardsHTMLTemplate(pokemonIndex);
  }
  renderPokemonTypes();
  renderLoadMoreButton();
}

async function renderPokemonTypes() {
  for (let pokemonIndex = 0; pokemonIndex < currentPokemons.length; pokemonIndex++) {
    let cardTypesRef = document.getElementById(`card-types-${currentPokemons[pokemonIndex].id}`);
    let pokemonType = currentPokemons[pokemonIndex].types;
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
//     allFetchedPokemons = fetchedData;
//     await fetchPokemonData();
//     allFormattedPokemons = formatPokemonData(allFetchedPokemons);
//     currentPokemons = allFormattedPokemons;
//     console.log(`allformattedPokemons: `, allFormattedPokemons);
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
      let filteredPokemons = currentPokemons.filter(pokemon =>
          pokemon.name.toLowerCase().includes(searchInput)
      );
      console.log(`filteredPokemons: `, filteredPokemons);
      // renderFilteredPokemons(filteredPokemons);
  } else {
      renderPokemons();
  }
}