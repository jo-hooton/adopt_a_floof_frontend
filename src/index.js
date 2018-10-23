const addBtn = document.querySelector('#new-pet-btn')
const petForm = document.querySelector('.container')
const petListings = document.querySelector('#pet-listings')
const form = document.querySelector('form')
form.addEventListener('submit', (e) => submitPet(e))
let addPet = true

fetch('http://localhost:3000/api/v1/pets')
.then(resp => resp.json())
.then(pets => pets.forEach(pet => createPet(pet)))

//render pet listings
const createPet = pet => {
    const petEl = `
    <div id="${pet.id}"class="card">
      <h2>${pet.name}</h2>
      <img src=${pet.img_url} class="pet-img">
      <p>Species: ${pet.species}<p>
      <p>Breed: ${pet.breed}<p>
      <p>Age: ${pet.years} Years, ${pet.months} Months<p>
      <p>Temperament: ${pet.temperament}<p>
      <p>Description: ${pet.description}<p>
      <button class="wishlist-btn">Add to favourites</button>
    </div>
    `
    petListings.innerHTML += petEl
}

// create new pet
const submitPet = (e) => {
    e.preventDefault()

const newPet = { 'reserved': false, 'adopted': false }

const petInputs = document.getElementsByClassName('input-text')
for (input of petInputs) {
    newPet[input.name] = input.value
}

fetch('http://localhost:3000/api/v1/pets', {
    'method': POST,
    'headers': { 'Content-Type' : 'application/json' },
    'body': JSON.stringify(newPet)
})
.then(resp => resp.json)
.then(pet => createPet(pet))
}

// // add to wishlist
// document.addEventListener('click', e => {
//     if (e.target.className === 'wishlist-btn') {
//         const petId = e.target.parentNode.parentNode.id
//         const wishlist = ??????????????????
//     }
// })

// const wishListAdd (petId, userId) => {
//     fetch(`https://localhost:3000/api/v1/wishlists`, {
//         'method': POST, 
//         'headers': { 'Content-Type' : 'application/json' },
//         'body': JSON.stringyfy { ???? }
//     })
// }

addBtn.addEventListener('click', () => {
    addPet = !addPet
    if (addPet) {
        petForm.style.display = 'block'
    } else {
        petForm.style.display = 'none'
    }
})
