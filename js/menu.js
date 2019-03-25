//Initialize Firestore
firestore = firebase.firestore();

var email = "";
var vars = [];
var refs = [];

const menuName = document.getElementById("menuName");
const editButton = document.getElementById("editButton");
const deleteButton = document.getElementById("delete");

getUrlVars();

firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).get().then(function(doc) {
    if(doc && doc.exists) {
        var data = doc.data();
        menuName.innerText = data.MenuName;
    } else console.log("The menu document doesn't exist");
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