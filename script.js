const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let limit = 20;
let offset = 0;
let allFetchedPokemons = [];
let allFormattedPokemons = [];
let currentPokemons = [];

async function init() {
  storeFetchedData();
}

async function fetchFirstData() {
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
                    details: responseJson
                };
            }
            resolve("data successfully fetched");
        } catch (error) {
            reject(`Error fetching Pokémon data: ${error}`);
        }
        
    })
}

async function storeFetchedData() {
  try {
    let fetchedData = await fetchFirstData();
    allFetchedPokemons = fetchedData;
    await fetchPokemonData();
    allFormattedPokemons = formatPokemonData(allFetchedPokemons);
    currentPokemons = allFormattedPokemons;
    console.log(`allformattedPokemons: ` , allFormattedPokemons);
    renderPokemons();
  } catch (error) {
    console.error(error);
  }
}

function formatPokemonData(allFetchedPokemons) {
    return allFetchedPokemons.map(pokemon => {
        return {
            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            id: pokemon.url.split("/").filter(Boolean).pop(),
            url: pokemon.url,
            details: pokemon.details,
            types: pokemon.details.types.map(type => type.type.name),
            image: pokemon.details.sprites.front_default
        };
    });
}

function renderPokemons() {
  let contentRef = document.getElementById("content");
  for (let pokemonIndex = 0; pokemonIndex < currentPokemons.length; pokemonIndex++) {
    contentRef.innerHTML += getCardsHTMLTemplate(pokemonIndex);
  }
}
