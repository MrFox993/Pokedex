function getCardsHTMLTemplate(pokemonIndex) {
  return `
    <div class="card" style="width: 18rem;">
        <div class="card-body flex column">
            <div class= "card-header">
                <h5 class="card-title"># ${currentPokemons[pokemonIndex].id}</h5>
                <h3 class="card-subtitle mb-2 text-body-secondary">${currentPokemons[pokemonIndex].name}</h3>
            </div>
            <img class="${currentPokemons[pokemonIndex].types[0]}" src="${currentPokemons[pokemonIndex].image_default}" alt="${currentPokemons[pokemonIndex].name}">
            <div id="card-types-${currentPokemons[pokemonIndex].id}" class="card-footer">
                <p>${currentPokemons[pokemonIndex].types[0]}</p>
                <p>${currentPokemons[pokemonIndex].types[1]}</p>
            </div>
        </div>
    </div>
    `;
}

function getTypeHTMLTemplate(pokemonIndex, typeIndex) {
    return `
        <img class="${currentPokemons[pokemonIndex].types[typeIndex]}" src="./assets/img/${currentPokemons[pokemonIndex].types[typeIndex]}.png" alt="${currentPokemons[pokemonIndex].types[typeIndex]}">
    `;
}

function getLoadingSpinnerHTMLTemplate() {
    return `
        <svg class="spinner" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="circle-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="50%" stop-color="red" />
                    <stop offset="50%" stop-color="white" />
                </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="100" fill="url(#circle-fill)" stroke="black" stroke-width="4" />
            <circle cx="150" cy="150" r="30" fill="rgb(6, 36, 46)" stroke="black" stroke-width="4" />
            <line x1="60" y1="150" x2="120" y2="150" stroke="black" stroke-width="4" />
            <line x1="180" y1="150" x2="240" y2="150" stroke="black" stroke-width="4" />
        </svg>
    `;
}