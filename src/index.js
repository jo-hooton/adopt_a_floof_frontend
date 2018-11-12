const addBtn = document.querySelector('#new-pet-btn')
const petForm = document.querySelector('.container')
const petListings = document.querySelector('#pet-listings')
const createForm = document.querySelector('#create-pet')
createForm.addEventListener('submit', (e) => submitPet(e))
const signInForm = document.querySelector('#sign-up')
signInForm.addEventListener('submit', (e) => signIn(e))
const signOutButton = document.querySelector('#sign-out-btn')
let addPet = false
currentUser = parseInt(localStorage.getItem('user-id'))

const signIn = (e) => {
  e.preventDefault()

  const userNameInput = document.querySelector('#username')
  const userPostcode = document.querySelector('#postcode')

  const newUser = {
    name: userNameInput.value,
    postcode: userPostcode.value
  }
    // post request to add new user
  fetch('http://localhost:3000/api/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  })
        .then(resp => resp.json())
        .then(user => {
          if (!user.error) {
            signInForm.style.display = 'none'
            signOutButton.style.display = 'block'
            localStorage.setItem('user-id', user.id)
            // add show favourites button
            favouritesButton()
            // add event listner to button
          }
        })
}

function favouritesButton () {
  const userFavourites = document.createElement('button')
  const nav = document.querySelector('#navBar')
  userFavourites.innerText = 'Favourites'
  userFavourites.id = 'userFav'
  nav.appendChild(userFavourites)
  FavButtonEventHandler()
}

function FavButtonEventHandler () {
  const favButton = document.querySelector('#userFav')
  favButton.addEventListener('click', event => {
    console.log(event)
    petListings.innerHTML = ''
    // find out whos logged in

    // get wishlist of user
    getWishlistOfUser()
    // a  ppend pets details to pet listing
  })
}

function getWishlistOfUser () {
  return fetch('http://localhost:3000/api/v1/wishlists')
    .then(resp => resp.json())
    .then(wishlists => {
      wishlists.find(wishlist => {
        if (wishlist.user_id === currentUser) {
          console.log(wishlist.pets)
          wishlist.pets.forEach(pet => {
            createPet(pet)
          })
        }
      })
    })
}

// render pet listings
const createPet = pet => {
  const petEl = `
    <div id="${pet.id}"class="card">
      <h2>${pet.name}</h2>
      <div style="background-image: url(${pet.img_url})" class="pet-img"></div>
      <p class="card-text">Species: ${pet.species}</p>
      <p class="card-text">Breed: ${pet.breed}</p>
      <p class="card-text">Age: ${pet.years} Years, ${pet.months} Months</p>
      <p class="card-text">Temperament: ${pet.temperament}</p>
      <p class="card-text">Description: ${pet.description}</p>
      <br>
      <button style="margin: 4px;" id="${pet.id}-wishlist" class="wishlist-btn">Add to favourites</button>
      <button style="margin: 4px;" id="adopt-${pet.id}" class="adopt-btn">Adopt ${pet.name}</button>
    </div>
    `

  petListings.innerHTML += petEl

  isAdopted(pet)

  document.body.addEventListener('click', event => {
    if (event.target.id === pet.id + '-wishlist') {
      wishListAdd(pet)
    }
  })
  document.body.addEventListener('click', event => {
    if (event.target.id === 'adopt-' + pet.id) {
      adoptPet(pet)

      const adoptBtn = document.querySelector(`#adopt-${pet.id}`)
      adoptBtn.innerText = 'Happily rehomed'
    }
  })
}

// create new pet
const submitPet = (e) => {
  e.preventDefault()

  const newPet = {
    'reserved': false,
    'adopted': false,
    user_id: localStorage.getItem('user-id')
  }

  const petInputs = document.getElementsByClassName('input-text')
  for (input of petInputs) {
    newPet[input.name] = input.value
  }

  fetch('http://localhost:3000/api/v1/pets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPet)
  }).then(resp => resp.json())
        .then(pet => createPet(pet))

  createForm.reset()
  createForm.style.display = 'none'
}

// add to wishlist
const wishListAdd = (pet) => {
  fetch('http://localhost:3000/api/v1/wishlists')
            .then(resp => resp.json())
            .then(wishlists => {
              const currentWishlist = wishlists.find(wishlist => wishlist.user_id === currentUser)
              if (currentWishlist) {
                patchPetWishlist(pet, currentWishlist.id)
              } else {
                console.log(pet.id)
                postWishlistToServer(currentUser)
              }
            })
}

function postWishlistToServer (user) {
  fetch('http://localhost:3000/api/v1/wishlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({user_id: user})
  }).then(resp => resp.json())
}

function patchPetWishlist (pet, newWishlist) {
  fetch(`http://localhost:3000/api/v1/pets/${pet.id}`, {
    'method': 'PATCH',
    'headers': { 'Content-Type': 'application/json' },
    'body': JSON.stringify({wishlist_id: newWishlist})
  }).then(resp => resp.json())
}

const adoptPet = (pet) => {
  fetch(`http://localhost:3000/api/v1/pets/${pet.id}`, {
    'method': 'PATCH',
    'headers': { 'Content-Type': 'application/json' },
    'body': JSON.stringify({user_id: currentUser, adopted: true})
  })
}

addBtn.addEventListener('click', () => {
  addPet = !addPet
  if (addPet) {
    petForm.style.display = 'block'
  } else {
    petForm.style.display = 'none'
  }
})

signOutButton.addEventListener('click', (event) => {
  console.log(event)
  localStorage.clear()
  hideSignOut()
  signInForm.style.display = 'block'
})

fetch('http://localhost:3000/api/v1/pets')
    .then(resp => resp.json())
    .then(pets => pets.forEach(pet => {
      createPet(pet)
    }))

const hideSignIn = () => {
  if (localStorage === null) {
  }
}

const hideSignOut = () => {
  signOutButton.style.display = 'none'
}

const isAdopted = (pet) => {
  if (pet.adopted === true) {
    const adoptBtn = document.querySelector(`#adopt-${pet.id}`)
    adoptBtn.innerText = 'Happily rehomed'
  }
}

hideSignOut()
