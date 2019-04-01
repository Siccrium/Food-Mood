//Initialize Firestore
firestore = firebase.firestore();

const duplicator = document.getElementById("duplicator");

var email = "";
var vars = [];

getUrlVars();

firestore.collection("Restaurants/" + vars['restaurant_id'] + "/Orders").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        var data = doc.data();
        var div = document.createElement('div');
        div.innerHTML = '<br><br><h1>' + data.FoodItem + '</h1>';
        duplicator.appendChild(div);
        refs.push(document.getElementById(doc.id));
        eventListeners();
    });
}).catch(function (error) {
    console.log("Error getting documents: " + error);
});

function getUrlVars() {
    var hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("The currently logged in user is: " + user.email + ".");
        email = user.email;
    } else {
        // No user is signed in.
        console.log("No user is signed in");
    }
});