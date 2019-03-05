//Initialize Firestore
firestore = firebase.firestore();

var email = "";

//Create HTML References.
const restName = document.getElementById("restName");
const restAddress = document.getElementById("restAddress");
const restCity = document.getElementById("restCity");
const restState = document.getElementById("restState");
const restZip = document.getElementById("restZip");
var restPhoneNumber = document.getElementById("restPhoneNumber");
var Sbutton = document.getElementById("Sbutton");

Sbutton.addEventListener('click', e => {
    console.log("This happened");
    var name = restName.value;
    var address = restAddress.value;
    var city = restCity.value;
    var state = restState.value;
    var zip = restZip.value;
    var phoneNumber = restPhoneNumber.value;
    console.log("This also happened");
    console.log(name + address + city + state + zip + phoneNumber);

    firestore.collection("Restaurants").doc(name).set({
        "Restaurant Manager": email,
        "Restaurant Name": name,
        "Restaurant Address": address,
        "Restaurant City": city,
        "Restaurant State": state,
        "Restaurant Zip": zip,
        "Restaurant Phone Number": phoneNumber
    }).then(function() {

        firestore.doc("/Users/" + email + "/Restaurants/" + name).set({
            "Restaurant Manager": email,
            "Restaurant Name": name,
            "Restaurant Address": address,
            "Restaurant City": city,
            "Restaurant State": state,
            "Restaurant Zip": zip,
            "Restaurant Phone Number": phoneNumber
        }).then(function() {
            console.log("Document Successfully Written.");
            window.location.replace("manager.html");
        }).catch(function(error) {
            console.log("Error writing Document to the Manager's Restaurant collection: " + error);
        });

        
    }).catch(function(error) {
        console.log("Error writing document to Restaurant Collection: " + error);
    });
    
    console.log("Then this happened");
    console.log(name + address + city + state + zip + phoneNumber);

});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log(user);
      console.log(user.email);
      email = user.email;
      console.log(email);
    
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
});