function fetchbeer(beer){
    
    // Beer info.

    const beerImage = document.querySelector('#beer-image');
    const beerName = document.querySelector('#beer-name');
    const beerDescription = document.querySelector('#beer-description');

    // UpdateDescription

    const beerDescriptionForm = document.querySelector('#description-form');
    const beerEditDescription = document.querySelector('#beer-description');
    beerDescriptionForm.reset();

    function updateDescription(env){


        env.preventDefault();        
        beer.description = beerEditDescription.value;
        patchBeer(beer)
    };

    // Remove Review Lists

    const beerReviewList = document.querySelector('#review-list');
    while (beerReviewList.firstElementChild){
        beerReviewList.removeChild(beerReviewList.lastElementChild)
    };


    const beerReviewForm = document.querySelector('#review-form');
    const beerReviewText = document.querySelector('#review');
    
    beerName.textContent = beer.name,                   
    beerImage.src = beer.image_url,                     
    beerDescription.textContent = beer.description,     
    beerEditDescription.value = beer.description 

    // fetch beer reviews

    for(let review of beer.reviews){
        let beerReview = document.createElement('li');
        beerReview.textContent = review;
        beerReviewList.appendChild(beerReview);
    }

    // add new review 

    beerReviewForm.addEventListener('submit', (env) => {
        env.preventDefault();
        console.log(`review form ID: ${beer.id}`)
       
        if(beerReviewText.value !== ''){
            
            beer.reviews.push(beerReviewText.value)
            patchBeer(beer)
        } else{
            alert('Review is Empty')
        }
    });

    function newFunction() {
        return document.querySelector("#description-form button").addEventListener("click", updateDescription);
    }
};



function patchBeer(beer){

    fetch(`http://localhost:3000/beers/${beer.id}`,
        {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(beer)
        })
        .then(response => response.json())
        .then(data => fetchbeer(data))
        .catch(err => console.log(`Error: ${err}`))
};

function postBeer(beer){
    fetch('http://localhost:3000/beers', {
        method: 'POST',
        headers: {'content-Type': 'application/json'},
        body: JSON.stringify(beer)
    })
    .then(reponse => response.json())
    .then(data => fetchbeer(data))
    .catch(err => console.log(`Error: ${err}`))
}

function fetchData(beer=null){
    let baseURL = 'http://localhost:3000/beers/'
    return new Promise((resolve, reject) => {
        let url = beer == null ? baseURL : `${baseURL + beer}`
        fetch(url)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(err => console.log(`Error: ${err}`));
        })
    };


function beerMenu(beers){
    // Navigation Beer List
    const navBeerList = document.querySelector('#beer-list');
    while (navBeerList.firstElementChild){
        navBeerList.removeChild(navBeerList.lastElementChild)
    };

    beers.forEach(beer => {
        const navElement = document.createElement('li');
        navElement.textContent = beer.name;
        navElement.setAttribute('index', beer.id);
        navBeerList.append(navElement)

        navElement.addEventListener('click', (env)=> {
            
            fetchData(env.target.getAttribute('index'))
            .then(beer => {
                
                fetchbeer(beer);
            });
        }, false);
    });


};

function init(){
    fetchData()
    .then(beers => beerMenu(beers))

    fetchData(1)
    .then(beers => fetchbeer(beers))
    
};

init()