const addBtn = document.querySelector('#new-pet-btn')
const petForm = document.querySelector('.container')
const petListings = document.querySelector('#pet-listings')
const createForm = document.querySelector('#create-pet')
createForm.addEventListener('submit', (e) => submitPet(e))
const signInForm = document.querySelector('#sign-up')
signInForm.addEventListener('submit', (e) => signIn(e))
const signOutButton = document.querySelector('#sign-out-btn')
let addPet = false



const signIn = (e) => {
    e.preventDefault()

    const userNameInput = document.querySelector('#username')
    const userPostcode = document.querySelector('#postcode')

    const newUser = {
        name: userNameInput.value,
        postcode: userPostcode.value,
    }
    //post request to add new user
    fetch('http://localhost:3000/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        .then(resp => resp.json())
        .then(user => {
            if(!user.error){
                signInForm.style.display = 'none'
                signOutButton.style.display = 'block'
                localStorage.setItem('user-id', user.id)
            }
    })

}
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
      <button id="${pet.id}-wishlist" class="wishlist-btn">Add to favourites</button>
    </div>
    `
    
    petListings.innerHTML += petEl


    document.body.addEventListener('click', event => {
        if (event.target.id === pet.id + '-wishlist') {
            wishListAdd(pet)
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
                const currentUser = parseInt(localStorage.getItem('user-id'))
                const currentWishlist = wishlists.find(wishlist => wishlist.user_id === currentUser)
                if (currentWishlist) {
                    currentWishlist.pets.push(pet.id)
                    patchWishlistToServer(currentWishlist)
                } else {
                    console.log(pet.id)
                    postWishlistToServer(currentUser)
                } 
            })

    
}

function postWishlistToServer (user) {
    fetch('http://localhost:3000/api/v1/wishlists', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({user_id: user})
    }).then(resp => resp.json())

}

function patchWishlistToServer (wishlist, newFavourites) {

    fetch(`http://localhost:3000/api/v1/wishlists/${wishlist.id}`, {
        'method': 'PATCH', 
        'headers': { 'Content-Type' : 'application/json' },
        'body': JSON.stringify({pets: newFavourites})
    }).then(resp => resp.json())
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

// const hideSignIn = () => {
//     if (localStorage === null) {
//     }
// }

const hideSignOut = () => {
    signOutButton.style.display = 'none'
}


hideSignOut()
