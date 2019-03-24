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
var restPhoneNumber = document.getElementById("restPhoneNumber");
var Sbutton = document.getElementById("Sbutton");

function renderPage(){

    firestore.collection("Restaurants").doc(vars['restaurant_id']).get().then(function(doc) {
        if(doc.exists){
                
            var docData = doc.data();
            restName.defaultValue = docData.RestaurantName;
            restAddress.defaultValue = docData.RestaurantAddress;
            restCity.defaultValue = docData.RestaurantCity;
            restState.defaultValue = docData.RestaurantState;
            restZip.defaultValue = docData.RestaurantZip;
            restPhoneNumber.defaultValue = docData.RestaurantPhoneNumber;

        } else console.log("The restaurant document does not exist.");
        
    }).catch(function(error) {

        console.log("The restaurant document does not exist.");
        console.log(error);

    });

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

console.log("The currently logged in user is: " + email + ".");

Sbutton.addEventListener('click', e => {
    var name = restName.value;
    var address = restAddress.value;
    var city = restCity.value;
    var state = restState.value;
    var zip = restZip.value;
    var phoneNumber = restPhoneNumber.value;
    var number = Math.floor(Math.random() * 900000000000) + 100000000000;

    if(vars[0] == "restaurant_id") {
        firestore.collection("Restaurants").doc(vars['restaurant_id']).set({
            "RestaurantManager": email,
            "RestaurantName": name,
            "RestaurantAddress": address,
            "RestaurantCity": city,
            "RestaurantState": state,
            "RestaurantZip": zip,
            "RestaurantPhoneNumber": phoneNumber
        }).then(function() {
            console.log("Document Successfully Written.");
            window.location.replace("restaurant.html?restaurant_id=" + vars['restaurant_id']);
        }).catch(function(error) {
            console.log("Error writing document to Restaurant Collection: " + error);
        });
    } else {
        firestore.collection("Restaurants").doc(number + name).set({
            "RestaurantManager": email,
            "RestaurantName": name,
            "RestaurantAddress": address,
            "RestaurantCity": city,
            "RestaurantState": state,
            "RestaurantZip": zip,
            "RestaurantPhoneNumber": phoneNumber,
            "RestaurantID": number
        }).then(function() {
            console.log(number);
            console.log("Document Successfully Written.");
            window.location.replace("restaurant.html?restaurant_id=" + number + name);
        }).catch(function(error) {
            console.log("Error writing document to Restaurant Collection: " + error);
        });

    }

});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      email = user.email;
      console.log("The currently logged in user is: " + email + ".");
      getUrlVars();
      if(vars[0] == "restaurant_id") renderPage();
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
});