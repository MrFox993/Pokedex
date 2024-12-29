const BASE_URL = 'https://pokeapi.co/api/v2/pokemon'
let limit = 20;
let offset = 0;
let allPokemons = [];
let currentPokemons = [];

function init() {
    currentPokemons = allPokemons;
    fetchFirstData();
}

async function fetchFirstData() {
    let response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    let responseJson = await response.json();
    let contentRef = document.getElementById('content');
    console.log(responseJson);
    let fetchResults = await responseJson.results;

    for (let index = 0; index < responseJson.results.length; index++) {
        await allPokemons.push(fetchResults[index]);
    }
};