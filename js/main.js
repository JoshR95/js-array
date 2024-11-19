/////////////////////////////////////////////
/// GLOBAL VARIABLES
/////////////////////////////////////////////

const picsumSeed = "https://picsum.photos/seed/";
const imageResolution = "/1200/600";

///////////////////////////////////////////////////////////////////////////////////
// assigning random image to the main-image when the generate button is clicked
//////////////////////////////////////////////////////////////////////////////////

// listen for click on generate-button
document.getElementById('generate-button').addEventListener('click', () => {
    // assigning main-image to a variable we can use
    const mainImage = document.getElementById('main-image');
    // here we are using math.floor to round down to only give whole numbers, then Math.random only generates a number between 0-1
    // we times it by 1084 as this is picsums amount of pictures in their collection, giving us a random seed between 0-1000
    const randomSeed = Math.floor(Math.random() * 1000);
    // changing main images src to a a random seed and we use interpelation to add the random number generated above to the url and global variables to easily change image size etc
    mainImage.src = `${picsumSeed}${randomSeed}${imageResolution}`;
});

////////////////////////////////////////////////////////////////////////////////////

// Geting the DOM elements
const addImageButton = document.getElementById('add-image-button');
const emailInput = document.querySelector('input[type="email"]');
const collectionsDropdown = document.querySelector('.collections-dropdown');

////////////////////////////
// Email Validation
////////////////////////////

// checks that the email address is a valid email 
function isValidEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
}

// setting a function to display the error message
function showEmailError(message){
    const errorElement = document.getElementById('email-error');
    errorElement.style.display = "block";
    errorElement.textContent = message; 
}

// setting a function to hide the error message
function hideEmailError(){
    const errorElement = document.getElementById('email-error');
    errorElement.style.display = "none";
    errorElement.textContent = "";
}

// New validation function that combines all email checks
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
// Add Image to Collection
////////////////////////////

// listens for button click on add image button
addImageButton.addEventListener('click', () => {
    const email = emailInput.value;
    
    // this runs the email validation, if its false(incorrect) it will return and not run the rest of the code
    if (validateEmail(email) === false) {
        return;
    }

    // asigns the current image to the imageUrl variable 
    const mainImage = document.getElementById('main-image');
    const imageUrl = mainImage.src;

    // Get existing collections from localStorage or initialize empty object
    const collections = JSON.parse(localStorage.getItem('imageCollections')) || {};

    // this checks if the email exisits in collection
    if (!collections[email]) {
        // if it doesnt exisit it creates an empty array for it 
        collections[email] = [];
    }
    // this adds the imageUrl (current image) to the collection for the associated email
    collections[email].push(imageUrl);

    // this saves back to localStorage, we have to use .stringify to store, then we'll parse it later to turn back to an object
    localStorage.setItem('imageCollections', JSON.stringify(collections));

    // Update dropdown options
    updateCollectionsDropdown();
});

//  this hides the error message when the input is being typed in
emailInput.addEventListener('input', () => {
    hideEmailError();
});

/////////////////////////////////////////////
//// UPDATING COLLECTIONS DROPDOWN
////////////////////////////////////////////

// Function to update the collections dropdown
function updateCollectionsDropdown() {
    // this gets all the collections from storage and parses them to change them from strings to objects
    const collections = JSON.parse(localStorage.getItem('imageCollections')) || {};
    
    // Clear existing options except the first one
    while (collectionsDropdown.options.length > 1) {
        collectionsDropdown.remove(1);
    }

    // Add an option for each email
    Object.keys(collections).forEach(email => {
        const option = document.createElement('option');
        option.value = email;
        option.textContent = email;
        collectionsDropdown.appendChild(option);
    });
}

// Initialize dropdown on page load
updateCollectionsDropdown();