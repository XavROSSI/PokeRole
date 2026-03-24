function normalize(str){
return str
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.trim()
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

input.addEventListener("blur", ()=>{
setTimeout(()=>{ container.style.display = "none" }, 150)
})

container.addEventListener("mousedown", (e)=>{
e.preventDefault()
})

}