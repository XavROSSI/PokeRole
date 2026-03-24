let POKEMON_FR = {}
let MOVES = []
let ABILITIES = []
let POKEDEX = []

async function loadPokemonFR(){
let res = await fetch("data/pokemon_fr.json")
POKEMON_FR = await res.json()
}

async function loadMovesJSON(){
let res = await fetch("data/moves.json")
MOVES = await res.json()
}

async function loadAbilitiesJSON(){
let res = await fetch("data/abilities.json")
ABILITIES = await res.json()
}

async function loadPokedexJSON(){
let res = await fetch("data/pokedex.json")
POKEDEX = await res.json()
}