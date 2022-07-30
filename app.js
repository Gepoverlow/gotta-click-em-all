const pokeURL = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
const image = document.getElementById("pokemon-img");
const catchRate = document.getElementById("catch-rate");
const start = document.getElementById("start");
const restart = document.getElementById("restart");
const wildPokemon = document.getElementById("wild-pokemon");
const pokeballs = document.getElementById("pokeballs");
const score = document.getElementById("score");
const run = document.getElementById("run");
const caught = document.getElementById("caught");
const cashIn = document.getElementById("cash-in");
const containerStore = document.querySelector(".container-store");
const remaining = document.getElementById("remaining");
const currentTime = document.getElementById("timer");

const greatBall = document.getElementById("greatball-img");
const ultraBall = document.getElementById("ultraball-img");
const masterBall = document.getElementById("masterball-img");
const greatQuantity = document.getElementById("great-span");
const ultraQuantity = document.getElementById("ultra-span");
const masterQuantity = document.getElementById("master-span");
const greatPrice = document.getElementById("great-price");
const ultraPrice = document.getElementById("ultra-price");
const masterPrice = document.getElementById("master-price");

const rareCandy = document.getElementById("rare-candy");
const expShare = document.getElementById("exp-share");
const berry = document.getElementById("berry-img");

const candyQuantity = document.getElementById("candy-span");
const shareQuantity = document.getElementById("share-span");
const berryQuantity = document.getElementById("berry-span");

const candyPrice = document.getElementById("candy-price");
const sharePrice = document.getElementById("share-price");
const berryPrice = document.getElementById("berry-price");

const pokemonArray = [];
const rarities = ["Very Common", "Common", "Uncommon", "Rare", "Very Rare", "Mythic", "Legendary"];

class Game {
  init() {
    this.count = 0;
    this.score = 0;
    this.allPokemons = [...pokemonArray];
    this.catchRate = 100;
    this.spawnBonus = 100;
    this.cashInValue = 1;
    this.cashInMultiplier = 1;
    this.valueMultiplier = 1;
    this.greatBalls = 0;
    this.ultraBalls = 0;
    this.masterBalls = 0;
    this.greatPrice = 300;
    this.ultraPrice = 2500;
    this.masterPrice = 10000;
    this.rareCandies = 0;
    this.candyPrice = 1000;
    this.expShares = 0;
    this.sharePrice = 500;
    this.berries = 0;
    this.berryPrice = 350;
    this.stopTimer = false;
    this.seconds = 0;
    this.isThereWinner = false;
    this.startDate = undefined;
    this.finishDate = undefined;
    this.totalSeconds = undefined;
    clearInterval(this.timerTimeoutId);
    this.timerTimeoutId = setInterval(() => {
      if (this.stopTimer === true) return;
      this.seconds++;
      currentTime.textContent = `${this.seconds}`;
    }, 1000);

    restart.textContent = "Click to Restart";
    run.textContent = "Run away Safely!";
    containerStore.style.visibility = "visible";
    this.updateCount();
    this.updateShop();
    spawnPokemonFromCategory();
    this.allPokemons.forEach((pokemon) => (pokemon.count = 0));
    this.updateArray();
    this.updateRemaining();
    this.makeStartingDate();
    // this.timer();
  }

  updateCount() {
    pokeballs.textContent = `${this.count} Pokeballs thrown`;
    cashIn.textContent = `(click me to cash in ${this.cashInValue} as score!)`;
    score.textContent = `Your score is ${this.score}`;
    this.updateCashInValue();
  }

  attemptCatch() {
    let rng = Math.floor(Math.random() * 100) + 1;
    this.calculateSuccess(this.currentPokemon, rng);
  }

  calculateSuccess(pokemon, rng) {
    if (pokemon.rarity === "Very Common") {
      let vCommonCR = this.catchRate / 10; //10
      catchRate.textContent = `V. Common ${vCommonCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(vCommonCR, rng, pokemon);
    } else if (pokemon.rarity === "Common") {
      let commonCR = this.catchRate / 15; //7.15
      catchRate.textContent = `Common ${commonCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(commonCR, rng, pokemon);
    } else if (pokemon.rarity === "Uncommon") {
      let uncommonCR = this.catchRate / 20; //5
      catchRate.textContent = `Uncommon ${uncommonCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(uncommonCR, rng, pokemon);
    } else if (pokemon.rarity === "Rare") {
      let rareCR = this.catchRate / 30; //3.33
      catchRate.textContent = `Rare ${rareCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(rareCR, rng, pokemon);
    } else if (pokemon.rarity === "Very Rare") {
      let vRareCR = this.catchRate / 40; //2.5
      catchRate.textContent = `Very Rare ${vRareCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(vRareCR, rng, pokemon);
    } else if (pokemon.rarity === "Mythic") {
      let mythicCR = this.catchRate / 58; //1.73
      catchRate.textContent = `Mythic ${mythicCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(mythicCR, rng, pokemon);
    } else if (pokemon.rarity === "Legendary") {
      let legendaryCR = this.catchRate / 80; //1.25
      catchRate.textContent = `Legendary ${legendaryCR.toFixed(2)}% Catch Rate`;
      this.calcSuccess(legendaryCR, rng, pokemon);
    }
  }

  calcSuccess(cr, rng, pokemon) {
    if (rng <= cr) {
      this.succesCatch(pokemon);
    } else {
      this.failedCatch(pokemon);
    }
  }

  succesCatch(pokemon) {
    this.count++;
    this.score = this.score + pokemon.value * this.valueMultiplier;
    pokemon.count++;
    this.updateCount();
    this.updateArray();
    this.updateRemaining();
    spawnPokemonFromCategory();
  }

  failedCatch(pokemon) {
    this.count++;
    this.updateCount();
  }

  updateRemaining() {
    let uncatched = pokemonArray.filter((pokemon) => pokemon.count !== 0);
    remaining.textContent = `${uncatched.length} / ${pokemonArray.length}`;

    if (uncatched.length === pokemonArray.length && this.isThereWinner === false) {
      this.makeFinisinghDate();
      this.calculateDateDifference();
      this.displayWinningMsg();
      this.isThereWinner = true;
    }
  }

  runAwaySafely() {
    spawnPokemonFromCategory();
  }

  updateArray() {
    this.allPokemons = [...pokemonArray];

    emptyNode(caught);

    for (let i = 0; i < this.allPokemons.length; i++) {
      createPokemonDOM(this.allPokemons[i]);
    }
  }

  updateCashInValue() {
    this.cashInValue = this.count * this.cashInMultiplier;
    cashIn.textContent = `(click me to cash in ${this.cashInValue.toFixed(2)} as score!) * 1/${this.cashInMultiplier} ratio`;
  }

  cashInPokeballs() {
    this.score = this.score + this.cashInValue;
    this.cashInValue = 0;
    this.count = 0;

    this.updateCount();
  }

  buyPokeball(pokeball) {
    if (pokeball === "greatball" && this.score >= this.greatPrice) {
      this.score = this.score - this.greatPrice;
      this.updateCount();
      this.greatBalls++;
      this.catchRate = this.catchRate + 20;
      this.greatPrice = this.greatPrice * 2;
    } else if (pokeball === "ultraball" && this.score >= this.ultraPrice) {
      this.score = this.score - this.ultraPrice;
      this.updateCount();
      this.ultraBalls++;
      this.catchRate = this.catchRate + 100;
      this.ultraPrice = this.ultraPrice * 2;
    } else if (pokeball === "masterball" && this.score >= this.masterPrice) {
      this.score = this.score - this.masterPrice;
      this.updateCount();
      this.masterBalls++;
      this.catchRate = this.catchRate + 300;
      this.masterPrice = this.masterPrice * 2;
    }
  }

  buyMisc(item) {
    if (item === "rare candy" && this.score >= this.candyPrice) {
      this.score = this.score - this.candyPrice;
      this.rareCandies++;
      this.valueMultiplier = this.valueMultiplier + 0.25;
      this.candyPrice = this.candyPrice * 2;
      this.updateCount();
    } else if (item === "berry" && this.score >= this.berryPrice) {
      this.score = this.score - this.berryPrice;
      this.berries++;
      this.cashInMultiplier = this.cashInMultiplier + 2;
      this.berryPrice = this.berryPrice * 2;
      this.updateCount();
    }
  }

  updateShop() {
    greatQuantity.textContent = `x${this.greatBalls} (+20% additive Catch Rate ea)`;
    ultraQuantity.textContent = `x${this.ultraBalls} (+100% additive Catch Rate ea)`;
    masterQuantity.textContent = `x${this.masterBalls} (+300% additive Catch Rate ea)`;
    candyQuantity.textContent = `x${this.rareCandies} (+25% additive Score on catch ea)`;
    shareQuantity.textContent = `x${this.expShares} (+1 automatic Catch Attempt per second ea)`;
    berryQuantity.textContent = `x${this.berries} (+2 to the Cash in pokeballs ratio ea)`;

    greatPrice.textContent = `Costs ${this.greatPrice} score`;
    ultraPrice.textContent = `Costs ${this.ultraPrice} score`;
    masterPrice.textContent = `Costs ${this.masterPrice} score`;
    candyPrice.textContent = `Costs ${this.candyPrice} score`;
    sharePrice.textContent = `Costs ${this.sharePrice} score`;
    berryPrice.textContent = `Costs ${this.berryPrice} score`;
  }

  activateAutomaticCatcher() {
    if (game.expShares > 0) {
      clearInterval(this.catcherId);
      this.catcherId = setInterval(() => {
        for (let i = 0; i < this.expShares; i++) {
          game.attemptCatch();
          game.updateCashInValue();
        }
      }, 1000);
    }
  }

  buyAutomaticCatcher() {
    if (this.score >= this.sharePrice) {
      this.score = this.score - this.sharePrice;
      this.expShares++;
      this.sharePrice = this.sharePrice * 2;
      this.updateCount();
      this.updateShop();

      this.activateAutomaticCatcher();
    }
  }

  displayWinningMsg() {
    this.stopTimer = true;
    alert(`Good Job!! You are now a Master Pokemon and it only took you ${this.seconds} seconds!`);
  }

  makeStartingDate() {
    this.startDate = new Date();
  }

  makeFinisinghDate() {
    this.finishDate = new Date();
  }

  calculateDateDifference() {
    this.totalSeconds = (this.finishDate.getTime() - this.startDate.getTime()) / 1000;

    console.log(this.totalSeconds);
  }
}

async function getPokemons(url) {
  start.textContent = "Loading Pokemons...";
  const data = await fetch(url);
  const response = await data.json();

  for (let i = 0; i < response.results.length; i++) {
    await processPokemon(response.results[i].url);
  }
}

async function processPokemon(url) {
  const data = await fetch(url);
  const response = await data.json();

  pokemonArray.push(pokemonFactory(response));
}

function pokemonFactory(response) {
  return {
    id: response.id,
    name: response.name,
    sprite: response.sprites.front_default,
    rarity: rarityCalculator(response.id),
    value: valueCalculator(response.id),
    count: 0,
  };
}
function rarityCalculator(id) {
  if (id >= 144) {
    return "Legendary";
  } else if (id > 128 && id < 144) {
    return "Very Rare";
  } else if (id > 101 && id < 129) {
    return "Rare";
  } else if (id > 80 && id < 102) {
    return "Uncommon";
  } else if (id > 60 && id < 81) {
    return "Common";
  } else {
    return "Very Common";
  }
}

function valueCalculator(id) {
  if (id >= 144) {
    return 1200;
  } else if (id > 128 && id < 144) {
    return 500;
  } else if (id > 101 && id < 129) {
    return 300;
  } else if (id > 80 && id < 102) {
    return 200;
  } else if (id > 60 && id < 81) {
    return 100;
  } else {
    return 50;
  }
}

function spawnPokemon(rarity) {
  let chosenPokemons = pokemonArray.filter((pokemon) => pokemon.rarity === rarity);
  let rng = Math.floor(Math.random() * chosenPokemons.length);

  wildPokemon.textContent = `A wild ${chosenPokemons[rng].name} appeared!`;
  image.src = chosenPokemons[rng].sprite;
  game.currentPokemon = chosenPokemons[rng];
}

function spawnPokemonFromCategory() {
  let random = Math.floor(Math.random() * game.spawnBonus) + 1;

  if (random >= 63 && random <= 100) {
    spawnPokemon("Very Common");
  } else if (random >= 36 && random < 63) {
    spawnPokemon("Common");
  } else if (random >= 19 && random < 36) {
    spawnPokemon("Uncommon");
  } else if (random >= 9 && random < 19) {
    spawnPokemon("Rare");
  } else if (random >= 4 && random < 9) {
    spawnPokemon("Very Rare");
  } else if (random < 4) {
    spawnPokemon("Legendary");
  }
}

function createPokemonDOM(pokemon) {
  const div = document.createElement("div");
  const p = document.createElement("p");
  const img = document.createElement("img");

  img.src = pokemon.sprite;
  div.appendChild(img);

  p.textContent = pokemon.count;
  div.appendChild(p);

  div.className = "pokemon";
  caught.appendChild(div);

  if (pokemon.count > 0) {
    div.style.backgroundImage = `url(${"./images/pokeball-bg.png"})`;
  }
}

function handleLoading(array) {
  if (array.length === 151) {
    start.textContent = "Start Clicking!";
    return true;
  }
}

function emptyNode(parent) {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
}

const game = new Game();

start.addEventListener("click", () => {
  if (start.textContent === "Start Clicking!") {
    start.style.display = "none";
    cashIn.style.backgroundColor = "rgb(248, 240, 240)";

    game.init();
  }
});

restart.addEventListener("click", () => {
  game.init();
});

image.addEventListener("click", () => {
  game.attemptCatch();
  game.updateCashInValue();
});

run.addEventListener("click", () => {
  game.runAwaySafely();
});

cashIn.addEventListener("click", () => {
  game.cashInPokeballs();
});

greatBall.addEventListener("click", () => {
  game.buyPokeball("greatball");
  game.updateShop();
});

ultraBall.addEventListener("click", () => {
  game.buyPokeball("ultraball");
  game.updateShop();
});

masterBall.addEventListener("click", () => {
  game.buyPokeball("masterball");
  game.updateShop();
});

rareCandy.addEventListener("click", () => {
  game.buyMisc("rare candy");
  game.updateShop();
});

expShare.addEventListener("click", () => {
  game.buyAutomaticCatcher();
});

berry.addEventListener("click", () => {
  game.buyMisc("berry");
  game.updateShop();
});

getPokemons(pokeURL);

const arrayStateChecker = setInterval(() => {
  if (handleLoading(pokemonArray)) {
    clearInterval(arrayStateChecker);
  }
}, 1000);

handleLoading(pokemonArray);
