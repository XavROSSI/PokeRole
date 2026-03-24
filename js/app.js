let CURRENT_POKEMON = null
let LAST_PAGE = null
const POKEMON_PER_PAGE = 3.2

const POKEDEX_PAGES = {}

function buildPokedexMapping(){

  Object.values(POKEMON_FR).forEach((enName, index)=>{

    const key = normalize(enName) // 👈 clé EN normalisée

    POKEDEX_PAGES[key] = Math.floor(index / POKEMON_PER_PAGE) + 1

  })

}

function openPokedexForPokemon(name){

  if(!name) return

  const normalizedFR = normalize(name)

  // 👉 conversion FR → EN
  const en = POKEMON_FR[normalizedFR]

  if(!en){
    alert("Pokémon inconnu : " + name)
    return
  }

  const key = normalize(en)
  const page = POKEDEX_PAGES[key]

  if(!page){
    alert("Page introuvable pour " + name)
    return
  }

  let iframe = document.getElementById("pokedexFrame")

  iframe.src = ""

  setTimeout(()=>{
    iframe.src = "assets/pdf/pokedex.pdf#page=" + page + "&zoom=125"
  }, 50)

  show("pokedex")
}

async function loadPokemonFR(){
  let res = await fetch("data/pokemon_fr.json")
  const raw = await res.json()

  // 🔥 NORMALISATION DES CLÉS
  POKEMON_FR = {}

  Object.keys(raw).forEach(frName => {
    const normalized = normalize(frName)
    POKEMON_FR[normalized] = raw[frName]
  })
}

/* navigation */
function show(page){
["trainer","team","dice","pokemon","moves","abilities","pokedex"].forEach(id=>{
document.getElementById(id).style.display="none"
})
document.getElementById(page).style.display="block"
}

function initTrainerPoints(){

document.querySelectorAll("#trainer .points").forEach(group=>{

group.innerHTML = ""

for(let i=0;i<5;i++){
let box = document.createElement("div")
box.className = "point"

box.addEventListener("click", ()=>{

let boxes = group.querySelectorAll(".point")
let index = [...boxes].indexOf(box)
let value = index + 1

if(box.classList.contains("active") && index === 0){
value = 0
}

boxes.forEach(b=>b.classList.remove("active"))

for(let i=0;i<value;i++){
    if(boxes[i]) boxes[i].classList.add("active")
}

saveAll()

})

group.appendChild(box)
}

})

}

function initPokemonPoints(){

document.querySelectorAll("#pokemon .points").forEach(group=>{

group.innerHTML = ""

for(let i=0;i<5;i++){
let box = document.createElement("div")
box.className = "point"

box.addEventListener("click", ()=>{

let boxes = group.querySelectorAll(".point")
let index = [...boxes].indexOf(box)
let value = index + 1

if(box.classList.contains("active") && index === 0){
value = 0
}

boxes.forEach(b=>b.classList.remove("active"))

for(let i=0;i<value;i++){
if(boxes[i]) boxes[i].classList.add("active")
}

savePokemon()

})

group.appendChild(box)
}

})

}

/* TRAINER SAVE (INCHANGÉ) */
function saveAll(){
let data={}

document.querySelectorAll("#trainer input,#trainer textarea,#trainer select").forEach(el=>{
if(!el.id) return
data[el.id]=el.value
})

document.querySelectorAll("#trainer .points").forEach(group=>{
const id=group.dataset.id
data[id]=group.querySelectorAll(".active").length
})

localStorage.setItem("trainerData",JSON.stringify(data))
}

function loadAll(){
let data=JSON.parse(localStorage.getItem("trainerData")||"{}")

document.querySelectorAll("#trainer input,#trainer textarea,#trainer select").forEach(el=>{
if(!el.id) return
if(data[el.id]!==undefined){
el.value=data[el.id]
}
})

document.querySelectorAll("#trainer .points").forEach(group=>{
const id=group.dataset.id
const value=data[id]||0
const boxes=group.querySelectorAll(".point")

boxes.forEach(b=>b.classList.remove("active"))
for(let i=0;i<value;i++){
    if(boxes[i]) boxes[i].classList.add("active")
}
})
}

document.querySelectorAll("#trainer input,#trainer textarea,#trainer select").forEach(el=>{
el.addEventListener("input",saveAll)
})

/* POKEMON SYSTEM */
let currentPokemon=0

function openPokemon(i){
document.querySelectorAll(".pokemon").forEach(p=>p.classList.remove("active"))
document.getElementById("slot_"+i).classList.add("active")
currentPokemon=i
initPokemonPoints()
loadPokemon()
show("pokemon")
}

function backToTeam(){
show("team")
updateTeam()
}

/* REMPLACE savePokemon PAR ÇA */

function savePokemon(){

let data={}

document.querySelectorAll("#pokemon input,#pokemon textarea,#pokemon select").forEach(el=>{
if(!el.id) return
data[el.id]=el.value
})

document.querySelectorAll("#pokemon .points").forEach(group=>{
const id=group.dataset.id
const active=group.querySelectorAll(".active").length
data[id]=active
})

localStorage.setItem("pokemon_"+currentPokemon, JSON.stringify(data))

console.log("SAVE POKEMON", currentPokemon, data)
}

function updateTeam(){

for(let i=0;i<6;i++){

let data=JSON.parse(localStorage.getItem("pokemon_"+i)||"{}")

let name=data.p_name || "Empty"
let id=data.p_id || ""

document.getElementById("name_"+i).textContent=name

let img=document.getElementById("img_"+i)
let shiny=document.getElementById("img_shiny_"+i)

if(id){

img.src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+id+".png"
img.style.display="block"

if(shiny){
shiny.src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/"+id+".png"
shiny.style.display="block"
}

}else{

if(img) img.style.display="none"
if(shiny) shiny.style.display="none"

}

}
}

function loadPokemon(){
let data=JSON.parse(localStorage.getItem("pokemon_"+currentPokemon)||"{}")

document.querySelectorAll("#pokemon input,#pokemon textarea,#pokemon select").forEach(el=>{
el.value=data[el.id]||""
})

document.querySelectorAll("#pokemon .points").forEach(group=>{
const id=group.dataset.id
const value=data[id]||0
const boxes=group.querySelectorAll(".point")

boxes.forEach(b=>b.classList.remove("active"))
for(let i=0;i<value;i++){
    if(boxes[i]) boxes[i].classList.add("active")
}
})
if(data.p_id){
document.getElementById("p_sprite").src =
"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+data.p_id+".png"
document.getElementById("p_sprite_shiny").src =
"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/"+data.p_id+".png"
}

let name = data.p_name
if(name){
let en = POKEMON_FR[normalize(name)] || name
updatePokemonDataFromPokedex(en)
}

let savedLock = localStorage.getItem("pokemon_lock_"+currentPokemon) === "true"
isLocked = savedLock

document.getElementById("pokemon").classList.toggle("locked", isLocked)

document.querySelectorAll("#pokemon input, #pokemon textarea, #pokemon select").forEach(el=>{
el.disabled = isLocked
})

document.querySelectorAll("#pokemon .point").forEach(p=>{
p.style.pointerEvents = isLocked ? "none" : "auto"
})

document.getElementById("lockBtn").textContent = isLocked ? "Unlock" : "Lock"
}

/* dice */
function roll(){
const dice=["⚀","⚁","⚂","⚃","⚄","⚅"]
let count=parseInt(document.getElementById("diceCount").value)
let results=[]

for(let i=0;i<count;i++){
results.push(dice[Math.floor(Math.random()*6)])
}

document.getElementById("diceResult").textContent=results.join(" ")
}

/* ================= MOVES ================= */

async function loadMovesJSON(){
let res = await fetch("data/moves.json")
MOVES = await res.json()
}

function loadMovesList(){
let datalist = document.getElementById("movesList")
datalist.innerHTML = ""

MOVES.forEach(move=>{
let option = document.createElement("option")
option.value = move.name
datalist.appendChild(option)
})
}

function getMoveByName(name){
return MOVES.find(m => m.name.toLowerCase() === name.toLowerCase())
}

function displayMove(move){

if(!move) return

document.getElementById("move_name").textContent = move.name
document.getElementById("move_type").textContent = move.type
document.getElementById("move_category").textContent = move.category
document.getElementById("move_power").textContent = move.power
document.getElementById("move_target").textContent = move.target
document.getElementById("move_description").textContent = move.description
document.getElementById("move_effect").textContent = move.effect

/* ===== ACCURACY ===== */
let accuracy = move.accuracy || {}

let accParts = []

if(accuracy.attr){
accParts.push(capitalize(accuracy.attr))
}

if(accuracy.skill){
accParts.push(capitalize(accuracy.skill))
}

document.getElementById("move_accuracy").textContent =
accParts.length ? accParts.join(" + ") : "-"

/* ===== DAMAGE ===== */
let damage = move.damage || {}

document.getElementById("move_damage").textContent =
damage.mod ? capitalize(damage.mod) : "-"

}

function capitalize(str){
if(!str) return ""
return str.charAt(0).toUpperCase() + str.slice(1)
}
/* ================= ABILITIES ================= */

async function loadAbilitiesJSON(){
let res = await fetch("data/abilities.json")
ABILITIES = await res.json()
}

function loadAbilitiesList(){
let datalist = document.getElementById("abilitiesList")
datalist.innerHTML = ""

ABILITIES.forEach(a=>{
let option = document.createElement("option")
option.value = a.name
datalist.appendChild(option)
})
}

function getAbilityByName(name){
return ABILITIES.find(a => a.name.toLowerCase() === name.toLowerCase())
}

function displayAbility(a){

if(!a) return

document.getElementById("ability_name").textContent = a.name
document.getElementById("ability_description").textContent =
a.description || a.system?.description || ""

}

document.addEventListener("DOMContentLoaded", ()=>{
let input = document.getElementById("ability_search")
if(input){
input.addEventListener("input",(e)=>{
let a = getAbilityByName(e.target.value)
displayAbility(a)
})
}
})

function setDynamicPoints(statId, value, max){

let group = document.querySelector('#pokemon .points[data-id="'+statId+'"]')
if(!group) return

group.innerHTML = "" // reset

for(let i=0;i<max;i++){
let box = document.createElement("div")
box.className = "point"

if(i < value){
box.classList.add("active")
}

box.addEventListener("click", ()=>{

let newValue = i+1

if(box.classList.contains("active") && i===0){
newValue = 0
}

let boxes = group.querySelectorAll(".point")
boxes.forEach(b=>b.classList.remove("active"))

for(let j=0;j<newValue;j++){
    if(boxes[j]) boxes[j].classList.add("active")
}

savePokemon()

})

group.appendChild(box)
}

}

/* ================= POKEDEX ================= */

async function loadPokedexJSON(){
let res = await fetch("data/pokedex.json")
POKEDEX = await res.json()
}

function getPokemonByName(name){
return POKEDEX.find(p => p.name.toLowerCase() === name.toLowerCase())
}

function displayPokedex(p){

if(!p) return

/* NOM FR */
let frName = Object.keys(POKEMON_FR).find(key => POKEMON_FR[key] === p.name)

document.getElementById("pokedex_name").textContent =
(frName ? frName.charAt(0).toUpperCase()+frName.slice(1) : p.name)

/* ID */
document.getElementById("pokedex_id").textContent = p.pokedexId

/* TYPES */
document.getElementById("pokedex_types").textContent =
(p.types || []).join(" / ")

/* SPRITE */
document.getElementById("pokedex_sprite").src =
"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+p.pokedexId+".png"
document.getElementById("pokedex_sprite_shiny").src =
"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/"+p.pokedexId+".png"

/* STATS FORMAT */
let stats = p.stats || {}

function statLine(icon, name, stat){
return `
<div>
${icon} ${name} : 
<b>${stat?.value || 0}</b> / ${stat?.max || 0}
</div>`
}

document.getElementById("pokedex_stats").innerHTML = `
${statLine("💪","Strength",stats.strength)}
${statLine("⚡","Dexterity",stats.dexterity)}
${statLine("🛡","Vitality",stats.vitality)}
${statLine("🔮","Special",stats.special)}
${statLine("🧠","Insight",stats.insight)}
`

}

document.addEventListener("DOMContentLoaded", ()=>{
let input = document.getElementById("pokedex_search")
if(input){
input.addEventListener("input",(e)=>{

let fr = normalize(e.target.value)
let en = POKEMON_FR[fr] || fr

let p = getPokemonByName(en)
displayPokedex(p)

})
}
})

/*---------------------------------------------------------*/
/* ================= DISPLAY MOVES IN POKEMON ================= */

function displayPokemonMoves(){

if(!Array.isArray(MOVES)) return

let container = document.getElementById("pokemon_move_display")
if(!container) return

container.innerHTML = ""
container.style.display = "none"

let ids = ["p_move1","p_move2","p_move3","p_move4"]

ids.forEach(id=>{

let input = document.getElementById(id)
if(!input) return

input.oninput = null

input.oninput = ()=>{

if(!input.value) return

let move = getMoveByName(input.value)
if(!move) return

container.style.display = "block"

/* ✅ FIX : plus d'accumulation */
container.innerHTML = `
<div style="margin-bottom:10px">
<b>${move.name}</b><br>
Type: ${move.type} | Power: ${move.power}<br>
${move.effect}
</div>
`

}

})

}

/* ================= DISPLAY ABILITY ================= */

function displayPokemonAbility(){

let input = document.getElementById("p_ability")
let div = document.getElementById("pokemon_ability_display") // ✅ FIX

if(!input || !div) return

input.oninput = null

input.oninput = ()=>{

let a = getAbilityByName(input.value)
if(!a) return

div.innerHTML = `
<b>${a.name}</b><br><br>
${a.description || a.system?.description || ""}
`

}

}

/* input listener */
document.addEventListener("DOMContentLoaded", ()=>{
let input = document.getElementById("move_search")
if(input){
input.addEventListener("input",(e)=>{
let move = getMoveByName(e.target.value)
displayMove(move)
})
}
})

/* import/export (inchangé) */
function exportTrainer(){
let data=localStorage.getItem("trainerData")
let blob=new Blob([data],{type:"application/json"})
let a=document.createElement("a")
a.href=URL.createObjectURL(blob)
a.download="pokerole_trainer.json"
a.click()
}

function importTrainer(event){
let file=event.target.files[0]
let reader=new FileReader()

reader.onload=function(){
localStorage.setItem("trainerData",reader.result)
loadAll()
}

reader.readAsText(file)
}

/* natures */
const natures=[
"Hardy","Lonely","Brave","Adamant","Naughty",
"Bold","Docile","Relaxed","Impish","Lax",
"Timid","Hasty","Serious","Jolly","Naive",
"Modest","Mild","Quiet","Bashful","Rash",
"Calm","Gentle","Sassy","Careful","Quirky"
]

function fillSelect(id){
let select=document.getElementById(id)
natures.forEach(n=>{
let option=document.createElement("option")
option.value=n
option.textContent=n
select.appendChild(option)
})
}

fillSelect("trainerNature")
fillSelect("p_trainerNature")
updateTeam()
loadAll()

let saveTimer = null

document.querySelectorAll("#pokemon input, #pokemon textarea, #pokemon select").forEach(el=>{
el.addEventListener("input", ()=>{

clearTimeout(saveTimer)

saveTimer = setTimeout(()=>{
savePokemon()
}, 300)

})
})

let pNameInput = document.getElementById("p_name")

let debounceTimer = null

pNameInput.addEventListener("input", (e)=>{

clearTimeout(debounceTimer)

debounceTimer = setTimeout(()=>{
handlePokemonName(e.target.value)
}, 400) // 400ms après la dernière frappe

})

/* helper pour remplir les points */
function setPoints(id, value){

let group = document.querySelector('#pokemon .points[data-id="'+id+'"]')

if(!group) return

let boxes = group.querySelectorAll(".point")

boxes.forEach(b=>b.classList.remove("active"))

for(let i=0;i<value;i++){
if(boxes[i]) boxes[i].classList.add("active")
}

}

let allPokemon = []
let pokemonFRtoEN = {}

function loadPokemonList(){

let datalist = document.getElementById("pokemonList")
datalist.innerHTML = ""

/* on parcourt les noms FR */
Object.keys(POKEMON_FR)
.sort((a,b)=>a.localeCompare(b, "fr"))
.forEach(frName=>{
let option = document.createElement("option")
option.value = frName.charAt(0).toUpperCase() + frName.slice(1)
datalist.appendChild(option)
})

}

function normalize(str){
return str
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.trim()
}

async function handlePokemonName(value){
    if(value.length < 2) return

let input = normalize(value)
let inputNorm = normalize(value)

/* chercher correspondance FR */
let matchFR = Object.keys(POKEMON_FR).find(fr => normalize(fr).startsWith(inputNorm))

/* convertir en EN */
let name = matchFR ? POKEMON_FR[matchFR] : inputNorm

if(!name) return

try{

let res = await fetch("https://pokeapi.co/api/v2/pokemon/"+name)
let data = await res.json()

/* SPRITE */
document.getElementById("p_sprite").src = data.sprites.front_default
document.getElementById("p_sprite_shiny").src = data.sprites.front_shiny

/* ID */
document.getElementById("p_id").value = data.id

/* HP */
let hpStat = data.stats.find(s => s.stat.name === "hp")
if(hpStat){
document.getElementById("p_hp").value = hpStat.base_stat
}

/* Stats */
let atk = data.stats.find(s => s.stat.name === "attack")?.base_stat || 0
let def = data.stats.find(s => s.stat.name === "defense")?.base_stat || 0
let spd = data.stats.find(s => s.stat.name === "speed")?.base_stat || 0

function convert(stat){
return Math.min(5, Math.floor(stat / 40))
}

updatePokemonDataFromPokedex(name)

savePokemon()
updateTeam()

}catch(e){
console.log("Pokemon not found")
}

}

function goBack(){

if(LAST_PAGE?.page === "pokemon"){
currentPokemon = LAST_PAGE.slot
loadPokemon()
show("pokemon")
return
}

show("team")
}

function updatePokemonDataFromPokedex(name){
    

let p = POKEDEX.find(p => p.name.toLowerCase() === name.toLowerCase())

if(!p) return
if(!p.moves) p.moves = []
if(!p.abilities) p.abilities = []

CURRENT_POKEMON = p

/* ABILITIES */
let abilitiesList = document.getElementById("pokemonAbilitiesList")
abilitiesList.innerHTML = ""

if(Array.isArray(p.abilities)){
p.abilities.forEach(a=>{
let option = document.createElement("option")
option.value = a.name
abilitiesList.appendChild(option)
})
}

displayPokemonMoves()
displayPokemonAbility()

let stats = p.stats || {}

// récup save
let saved = JSON.parse(localStorage.getItem("pokemon_"+currentPokemon) || "{}")

function getStatValue(id, defaultValue){
return saved[id] !== undefined ? saved[id] : defaultValue
}

setDynamicPoints("p_strength", getStatValue("p_strength", stats.strength?.value || 0), stats.strength?.max || 5)
setDynamicPoints("p_dexterity", getStatValue("p_dexterity", stats.dexterity?.value || 0), stats.dexterity?.max || 5)
setDynamicPoints("p_vitality", getStatValue("p_vitality", stats.vitality?.value || 0), stats.vitality?.max || 5)
setDynamicPoints("p_special", getStatValue("p_special", stats.special?.value || 0), stats.special?.max || 5)
setDynamicPoints("p_insight", getStatValue("p_insight", stats.insight?.value || 0), stats.insight?.max || 5)
}

function goToMove(inputId){

let value = document.getElementById(inputId).value
if(!value) return

LAST_PAGE = {
page: "pokemon",
slot: currentPokemon
}

show("moves")

document.getElementById("move_search").value = value

let move = getMoveByName(value)
displayMove(move)

}
function resetPokemon(){

if(isLocked){
alert("Pokémon verrouillé 🔒")
return
}

/* ✅ FIX : on récupère bien les données */
let data = JSON.parse(localStorage.getItem("pokemon_"+currentPokemon) || "{}")

if(Object.keys(data).length > 2){
if(!confirm("Attention, des données existent. Continuer ?")) return
}

if(!confirm("Supprimer ce Pokémon ?")) return

// clear inputs
document.querySelectorAll("#pokemon input, #pokemon textarea").forEach(el=>{
el.value = ""
})

// clear selects
document.querySelectorAll("#pokemon select").forEach(el=>{
el.selectedIndex = 0
})

// reset points
document.querySelectorAll("#pokemon .points").forEach(group=>{
let boxes = group.querySelectorAll(".point")
boxes.forEach(b=>b.classList.remove("active"))
})

// reset sprites
document.getElementById("p_sprite").src = ""
document.getElementById("p_sprite_shiny").src = ""

// remove storage
localStorage.removeItem("pokemon_"+currentPokemon)

// update UI
updateTeam()

}

let isLocked = false

function toggleLock(){

isLocked = !isLocked

document.getElementById("pokemon").classList.toggle("locked", isLocked)

localStorage.setItem("pokemon_lock_"+currentPokemon, isLocked)

// inputs
document.querySelectorAll("#pokemon input, #pokemon textarea, #pokemon select").forEach(el=>{
el.disabled = isLocked
})

// points (important)
document.querySelectorAll("#pokemon .point").forEach(p=>{
p.style.pointerEvents = isLocked ? "none" : "auto"
})

// bouton texte
document.getElementById("lockBtn").textContent = isLocked ? "Unlock" : "Lock"

}

function setupAutocomplete(inputId, list, containerId){

let input = document.getElementById(inputId)
let container = document.getElementById(containerId)

input.addEventListener("input", ()=>{

let value = normalize(input.value)
container.innerHTML = ""

if(value.length < 2){
container.style.display = "none"
return
}

let results = list
.filter(item => normalize(item).includes(value))
.slice(0, 20)

if(results.length === 0){
container.style.display = "none"
return
}

container.style.display = "block"

results.forEach(item=>{

let div = document.createElement("div")
div.className = "autocomplete-item"
div.textContent = item

div.onclick = ()=>{
input.value = item
container.innerHTML = ""
container.style.display = "none"
input.dispatchEvent(new Event("input"))
input.blur()
}

container.appendChild(div)

})

})

/* 👇 IMPORTANT : gestion du blur */
input.addEventListener("blur", ()=>{

// petit délai pour laisser le click passer
setTimeout(()=>{
container.style.display = "none"
}, 150)

})

/* 👇 si on clique dans la liste → ne pas fermer */
container.addEventListener("mousedown", (e)=>{
e.preventDefault()
})

}

async function init(){

await loadPokemonFR()
await loadMovesJSON()
await loadAbilitiesJSON()
await loadPokedexJSON()

buildPokedexMapping()

loadPokemonList()
loadMovesList()
loadAbilitiesList()

setupAutocomplete(
"p_name",
Object.keys(POKEMON_FR).map(n => n.charAt(0).toUpperCase()+n.slice(1)),
"pokemon_autocomplete"
)

setupAutocomplete(
"move_search",
MOVES.map(m=>m.name),
"moves_autocomplete"
)

setupAutocomplete(
"ability_search",
ABILITIES.map(a=>a.name),
"abilities_autocomplete"
)

initTrainerPoints()
updateTeam()
loadAll()
}

init()