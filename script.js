const BASE_URL = 'https://pokeapi.co/api/v2/pokemon'
let limit = 20;
let offset = 0;
let allPokemons = [];
let currentPokemons = [];

async function init() {
    storeFetchedData();
}

async function fetchFirstData() {
    let response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    let responseJson = await response.json();
    console.log(responseJson);
    let fetchResults = await responseJson.results;
    return new Promise((resolve, reject) => {
        if (response.ok) {
            resolve(fetchResults);
        }
        else {
            reject(`Fetching data failed status code ${response.status}`);
        }
    })

};

async function storeFetchedData() {
    try {
        let fetchedData = await fetchFirstData();
        allPokemons = fetchedData;
        currentPokemons = allPokemons;
    } catch (error) {
        console.error(error);
    }
}

function renderPokemons() {
    let contentRef = document.getElementById('content');
    for (let pokemonIndex = 0; pokemonIndex < currentPokemons.length; pokemonIndex++) {
        contentRef.innerHTML += getCardsHTMLTemplate(pokemonIndex);
    }
}