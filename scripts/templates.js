function getCardsHTMLTemplate(pokemonIndex) {
  return `
    <div class="card">
        <div class="card-body flex column">
            <div class= "card-header">
                <h5 class="card-title"># ${allPokemon[pokemonIndex].id}</h5>
                <h3 class="card-subtitle mb-2 text-body-secondary">${allPokemon[pokemonIndex].name}</h3>
            </div>
            <img class="${allPokemon[pokemonIndex].types[0]} pokeball-bgr pokemon-img" src="${allPokemon[pokemonIndex].image_default}" alt="${allPokemon[pokemonIndex].name}">
            <div id="card-types-${allPokemon[pokemonIndex].id}" class="card-footer">
                <p>${allPokemon[pokemonIndex].types[0]}</p>
                <p>${allPokemon[pokemonIndex].types[1]}</p>
            </div>
        </div>
    </div>
    `;
}

function getTypeHTMLTemplate(pokemonIndex, typeIndex) {
  return `
        <img class="${allPokemon[pokemonIndex].types[typeIndex]}" src="./assets/img/${allPokemon[pokemonIndex].types[typeIndex]}.png" alt="${allPokemon[pokemonIndex].types[typeIndex]}">
    `;
}

// function getLoadingSpinnerHTMLTemplate() {
//   return `
//         <svg class="spinner" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//                 <linearGradient id="circle-fill" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="50%" stop-color="red" />
//                     <stop offset="50%" stop-color="white" />
//                 </linearGradient>
//             </defs>
//             <circle cx="150" cy="150" r="100" fill="url(#circle-fill)" stroke="black" stroke-width="4" />
//             <circle cx="150" cy="150" r="30" fill="rgb(6, 36, 46)" stroke="black" stroke-width="4" />
//             <line x1="60" y1="150" x2="120" y2="150" stroke="black" stroke-width="4" />
//             <line x1="180" y1="150" x2="240" y2="150" stroke="black" stroke-width="4" />
//         </svg>
//     `;
// }

function getLoadingSpinnerHTMLTemplate() {
  return `
  <img src="./assets/img/pokeball.png" alt="" class="spinner">
    `;
}

function getLoadMoreButtonHTMLTemplate() {
  return `
        <button class="btn btn-secondary" type="button" onclick="storeFetchedData()">Load more</button>
    `;
}