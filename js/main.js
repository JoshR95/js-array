/////////////////////////////////////////////
/// GLOBAL VARIABLES
/////////////////////////////////////////////

const picsumSeed = "https://picsum.photos/seed/";
const imageResolution = "/1200/600";

///////////////////////////////////////////////////////////////////////////////////
// assigning random image to the main-image when the generate button is clicked
//////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-image');
    // here we are generating a random number between 0-1000 to then apply to retrieving a random seed
    const randomSeed = Math.floor(Math.random() * 1000);
    // here we as main.img the src of the website to seed, the random number and the resolution. these are set in global variables
    mainImage.src = `${picsumSeed}${randomSeed}${imageResolution}`;
        // we added a event listner for the generate random image button so it always has a seed attached to it
        // without this i has an issue where the first image in a collection would change depending on what the main-image was
        document.getElementById('generate-button').addEventListener('click', () => {
            const randomSeed = Math.floor(Math.random() * 1000);
            mainImage.src = `${picsumSeed}${randomSeed}${imageResolution}`;
        });
});

////////////////////////////////////////////////////////////////////////////////////
// DOM Elements
////////////////////////////////////////////////////////////////////////////////////

const addImageButton = document.getElementById('add-image-button');
const emailInput = document.querySelector('input[type="email"]');
const collectionsDropdown = document.querySelector('.collections-dropdown');
const clearCollectionButton = document.getElementById('clear-collection-button');


/////////////////////////////////////////////////////////////////////////////////////////
///  EMAIL INPUT SUGGESTIONS POP UP
/////////////////////////////////////////////////////////////////////////////////////////



const emailSuggestionsDiv = document.querySelector('.email-suggestions');

// adding email input event listeners
emailInput.addEventListener('focus', showEmailSuggestions);
emailInput.addEventListener('input', showEmailSuggestions);
// listening for click anywhere outside of the email input box
document.addEventListener('click', (e) => {
    if (!emailInput.contains(e.target) && !emailSuggestionsDiv.contains(e.target)) {
        emailSuggestionsDiv.style.display = 'none';
    }
});


function showEmailSuggestions() {
    const collections = JSON.parse(localStorage.getItem('imageCollections')) || {};
    const inputValue = emailInput.value.toLowerCase();
    emailSuggestionsDiv.innerHTML = '';
    
    // this gets an array of all the stored email addresses
    const matchingEmails = Object.keys(collections)
        // filter creates a new array with emails that containe the input value
        .filter(email => email.toLowerCase().includes(inputValue));
    
    // this creates a div for each matching email
    if (matchingEmails.length > 0) {
        matchingEmails.forEach(email => {
            const suggestion = document.createElement('div');
            // adding class for styling and text content of the email address
            suggestion.className = 'email-suggestion';
            suggestion.textContent = email;
            // listen for a click on a suggestion and closes pop up if clicked
            suggestion.addEventListener('click', () => {
                emailInput.value = email;
                emailSuggestionsDiv.style.display = 'none';
            });
            // adds each suggestion to the suggestions container
            emailSuggestionsDiv.appendChild(suggestion);
        });
        // displaying the suggestion container
        emailSuggestionsDiv.style.display = 'block';
    // if no matching emails, displaying nothing
    } else {
        emailSuggestionsDiv.style.display = 'none';
    }
}

////////////////////////////
// Email Validation
////////////////////////////

function isValidEmail(email) {
    // Prevent 'test@test' from being used
    if (email.toLowerCase() === 'test@test') {
        return false;
    }
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
        showEmailError('PLEASE ENTER A EMAIL ADDRESS');
        return false;
    }

    if (!isValidEmail(email)) {
        showEmailError('PLEASE ENTER A VALID EMAIL ADDRESS');
        return false;
    }

    hideEmailError();
    return true;
}

////////////////////////////
// Collection Management
////////////////////////////

//// PASS OR ERROR MESSAGE FOR ADDING IMAGES
/////////////////////////////////////////////

// here we have two parameters the message to display and isError is a set boolean
// it will default to false if not given
function showMessage(message, isError = false) {
    // we assign the div to show the messages
    const messageElement = document.getElementById('collection-message');
    // this sets the text content of our message
    messageElement.textContent = message;
    // this sets the class name based on isError paramaters true or false
    // this will be determined when we call the showMessage function
        // the isError is basically a compacted if else statement
        // if (isError === true) {
        //     messageElement.className = 'error';
        // } else {
        //     messageElement.className = 'success';
        // }
    messageElement.className = isError ? 'error' : 'success';
    messageElement.style.display = 'block';

    // here we set a timer to display the message for
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 4000);
}

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

    // here we check if the image is already included in the collection, if it is it is given the 
    // error clase name and the fail pop up appears
    if(collections[email].includes(imageUrl)){
        showMessage('CANNOT ADD DUPLICATE IMAGE TO COLLECTION', true)
        // this stops the code running if the image has already been added, this stops the images being added
        return;
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
    // if the image hasnt been in the collection already its given the success classname and this pop up appears
    showMessage(`ADDED TO COLLECTION: ${email}`);
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

// CLEARING COLLECTION POP UP
///////////////////////////////////////////////////////

function showPopup(message){
    // here we set the promise to await a value to be assigned below to either true or false
    return new Promise((resolve) => {
        const popup = document.getElementById('popup-overlay');
        const messageEl = document.getElementById('popup-message');
        const confirmBtn = document.getElementById('popup-confirm');
        const cancelBtn = document.getElementById('popup-cancel');

        // here we display the popup
        messageEl.textContent = message;
        popup.style.display = 'block';

        // these onClicks allow us to assign a true or false value which we can then use for confirms to clear collection
        confirmBtn.onclick = () => {
            popup.style.display = 'none';
            resolve(true);
        }

        cancelBtn.onclick = () => {
            popup.style.display = 'none';
            resolve(false);
        };
    })
}
// the async allows us to wait inside the function
clearCollectionButton.addEventListener('click', async () => {
    const selectedEmail = collectionsDropdown.value; 

    
    if (!selectedEmail){
        // the pop up makes the code wait for the popup to be closed, confrimed or cancelled
        await showPopup('Please select a collection to clear');
        // the return prevents the rest of the function from running
        return;
    }

    // here we are storing the true of false we get from showPopup depending on which button is clicked
    const confirmed = await showPopup(`Are you sure you want to clear the collection for ${selectedEmail}?`);
    // this is saying if confrimed equals true (confirm was clicked) clear the collection of images
    if (confirmed) {
        clearCollection(selectedEmail);
    }
})

///  CLEAR ALL COLLECTIONS
///////////////////////////////////////////

function clearAllCollections() {
    // this is asigned in the clearCollection function, i added it here so i remebered what it does
    // const collections = JSON.parse(localStorage.getItem('imageCollections')) || {};
    // clear all collections from localStorage
    localStorage.removeItem('imageCollections');
    // update dropdown
    updateCollectionsDropdown();
    document.querySelector('.allocated-images').innerHTML = '';
    collectionsDropdown.selectedIndex = 0;
}

// add event listener for the new clear all button
document.getElementById('clear-all-collections-button').addEventListener('click', async () => {
    const collections = JSON.parse(localStorage.getItem('imageCollections')) || {};
    
    // if no collections exist, show message
    // object.keys returns a list of all the keys inside collections
    if (Object.keys(collections).length === 0) {
        await showPopup('No collections to clear');
        return;
    }

    // Confirm before clearing all
    const confirmed = await showPopup('Are you sure you want to clear ALL collections?');
    // if confirmed has the value true from the showPopup function it clears all collections
    if (confirmed) {
        clearAllCollections();
    }
});


/////////////////////////////////////////////
// Initialization
////////////////////////////////////////////

// Initialize dropdown and display images on page load
updateCollectionsDropdown();
if (collectionsDropdown.value){
    displayImagesForEmail(collectionsDropdown.value);
}
