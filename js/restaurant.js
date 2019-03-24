//Initialize Firestore
firestore = firebase.firestore();

var email = "";
var vars = [];

//Create HTML References.
const restName = document.getElementById("restName");
const restAddress = document.getElementById("restAddress");
const restCity = document.getElementById("restCity");
const restState = document.getElementById("restState");
const restZip = document.getElementById("restZip");
const restPhoneNumber = document.getElementById("restPhoneNumber");
const editButton = document.getElementById("editButton");

function renderPage() {

    firestore.collection("Restaurants").doc(vars['restaurant_id']).get().then(function(doc) {
        if(doc.exists){
                
            var docData = doc.data();
            restName.innerText = docData.RestaurantName;
            restAddress.innerText = docData.RestaurantAddress;
            restCity.innerText = docData.RestaurantCity;
            restState.innerText = docData.RestaurantState;
            restZip.innerText = docData.RestaurantZip;
            restPhoneNumber.innerText = docData.RestaurantPhoneNumber;

        } else console.log("The restaurant document does not exist.");
        
    })

}

function getUrlVars() {
    var hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

editButton.addEventListener('click', e => {

    window.location.replace("editRestaurant.html?restaurant_id=" + vars['restaurant_id']);

});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log("The currently logged in user is: " + user.email + ".");
      email = user.email;
      getUrlVars();
      renderPage();
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
});