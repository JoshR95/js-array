/////////////////////////////////////////////
/// GLOBAL VARIABLES
/////////////////////////////////////////////

const picsumSeed = "https://picsum.photos/seed/";
const imageResolution = "/1200/600";

///////////////////////////////////////////////////////////////////////////////////
// assigning random image to the main-image when the generate button is clicked
//////////////////////////////////////////////////////////////////////////////////

document.getElementById('generate-button').addEventListener('click', () => {
    const mainImage = document.getElementById('main-image');
    const randomSeed = Math.floor(Math.random() * 1000);
    mainImage.src = `${picsumSeed}${randomSeed}${imageResolution}`;
});

////////////////////////////////////////////////////////////////////////////////////
// DOM Elements
////////////////////////////////////////////////////////////////////////////////////

const addImageButton = document.getElementById('add-image-button');
const emailInput = document.querySelector('input[type="email"]');
const collectionsDropdown = document.querySelector('.collections-dropdown');
const clearCollectionButton = document.getElementById('clear-collection-button');

////////////////////////////
// Email Validation
////////////////////////////

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
}

function showEmailError(message){
    const errorElement = document.getElementById('email-error');
    errorElement.style.display = "block";
    errorElement.textContent = message; 
}

function hideEmailError(){
    const errorElement = document.getElementById('email-error');
    errorElement.style.display = "none";
    errorElement.textContent = "";
}

function validateEmail(email) {
    if (!email) {
        showEmailError('Please enter an email address');
        return false;
    }

    if (!isValidEmail(email)) {
        showEmailError('Please enter a valid email address');
        return false;
    }

    hideEmailError();
    return true;
}

////////////////////////////
// Collection Management
////////////////////////////

// ADDING IMAGES TO EMAILS COLLECTION
/////////////////////////////////////

addImageButton.addEventListener('click', () => {
    const email = emailInput.value;

    // this mean if emaIL does not pass validation return
    if (!validateEmail(email)){
        return;
    }

    const mainImage = document.getElementById('main-image');
    const imageUrl = mainImage.src; 

    // get existing collections or create new object
    const collections = JSON.parse(localStorage.getItem('imageCollections')) || {};

    // this checks if a collection exists (if collections is false), then create an empty collection
    if(!collections[email]){
        collections[email] = [];
    }
    // this pushes the current image in main-image into the new collection/ current collection made for the email
    collections[email].push(imageUrl);

    // here we store the data in local storage, it has to be stored as a string so we 'stringify' it to be stored, and parse it later to retrieve it
    localStorage.setItem('imageCollections', JSON.stringify(collections));

    updateCollectionsDropdown();
    // Set the dropdown value to the current email
    collectionsDropdown.value = email; 
    // Display the images for this email
    displayImagesForEmail(email);
})

// CLEARING A SINGLE COLLECTION FUCNTION
/////////////////////////////////

function clearCollection(email){
    const collections = JSON.parse(localStorage.getItem('imageCollections')) || {};
    
    // this says if this function is called, and the email is in collections, delete it
    if (collections[email]){
        delete collections [email]
        // here we have to set the local storage again to update the data to show its been deleted
        localStorage.setItem('imageCollections', JSON.stringify(collections)); 

        updateCollectionsDropdown();
        // this clears all images from the image section
        document.querySelector('.allocated-images').innerHTML = '';
        // this resests the dropdwon to show the default options
        collectionsDropdown.selectedIndex = 0;
    }
}



/////////////////////////////////////////////
// Collections Display and Management
////////////////////////////////////////////

function updateCollectionsDropdown(){
    // this gets the stored string value, then parses it from JSON to a js array, the || {} makes an empty object if value is null (no data)
    const collections = JSON.parse(localStorage.getItem('imageCollections')) || {};

    // This code clears out all existing options in the dropdown except for the first one
    while (collectionsDropdown.options.length > 1){
        collectionsDropdown.remove(1);
    }

    // this gets an array of all email addresses and the forEach loops through each emailaddress
    Object.keys(collections).forEach(email => {
        const option = document.createElement('option');
        // for each email address we create a new <option> element  
        option.value = email;
        // we set this new option to have the value of the email
        option.textContent = email;
        // we add this new option to the dropdown so this email address is in the dropdown to be selected
        collectionsDropdown.appendChild(option);
    });
}

// Add event listener to display images when dropdown selection changes
// the change is what listens for a new collection selected in the drop down
collectionsDropdown.addEventListener('change', (e) => {
    displayImagesForEmail(e.target.value);
});

function displayImagesForEmail(email) {
    const collections = JSON.parse(localStorage.getItem('imageCollections')) || {}
    const allocatedImagesContainer = document.querySelector('.allocated-images');

    // clear exisiting images
    allocatedImagesContainer.innerHTML = '';

    // if no email is selected, return
    if (!email) return; 

    // this gets the array of images for this email, if no data return an empty array
    const images = collections[email] || [];

    // this is saying for each image do this 
    images.forEach(imageUrl => {
        // this will create a div for each image with a given className 
        const container = document.createElement('div');
        container.className = 'sub-picture-container';

        // this creates an img tag inside the above div with a class name 
        const img = document.createElement('img');
        img.className = 'chosen-image';
        // here we assign the current imgs url to this img tags src 
        img.src = imageUrl;

        // first we have to add the img to a container, we then add the container to the allocated-images div
        // you have to treat it like nesting dolls, if you add the container first you cant then add the img 
        container.appendChild(img);
        allocatedImagesContainer.appendChild(container);
    });
}



/////////////////////////////////////////////
// Initialization
////////////////////////////////////////////

// Initialize dropdown and display images on page load
updateCollectionsDropdown();
if (collectionsDropdown.value){
    displayImagesForEmail(collectionsDropdown.value);
}
