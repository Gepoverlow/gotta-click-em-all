const pokeURL = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
const image = document.getElementById("pokemon-img");
const pokemonArray = [];

async function getPokemons(url) {
  const data = await fetch(url);
  const response = await data.json();

  for (let i = 0; i < response.results.length; i++) {
    await processPokemon(response.results[i].url);
  }
  console.log(pokemonArray);
}

async function processPokemon(url) {
  const data = await fetch(url);
  const response = await data.json();

  pokemonArray.push(pokemonFactory(response));
}

function pokemonFactory(response) {
  return {
    name: response.name,
    sptire: response.sprites.front_default,
    clickedTimes: 0,
  };
}

getPokemons(pokeURL);
