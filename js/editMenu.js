//Initialize Firestore
firestore = firebase.firestore();

const submitButton = document.getElementById("Sbutton");
const menuName = document.getElementById("menuName");
const errorHeader = document.getElementById("errorHeader");

errorHeader.style.visibility = "hidden";

var name = "";
var vars = [];

function renderPage() {

    firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).get().then(function(doc) {
        if(doc && doc.exists) {
            var data = doc.data();
            menuName.defaultValue = data.MenuName;
        } else console.log("The menu document does not exist.");
    }).catch(function(error) {
        console.log("Error getting menu document: " + error);
    });
}

submitButton.addEventListener("click", e => {

    name = menuName.value;
    errorHeader.innerText = "";

    if (name == "") {
        errorHeader.innerText = "Please enter a Menu Name."
        errorHeader.style.visibility = "visible";
        console.log("The 'menuName' field was left empty.");
        return;
    }

    if(vars[1] == "menu_id") {
        firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).set({
            "MenuName": name
        }).then(function() {
            console.log("Successfully Updated Document!");
            window.location.replace("menu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + vars['menu_id']);
        }).catch(function(error) {
            console.log("Error updating menu document: " + error);
        });
    } else {

        firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + name.replace(/[^a-zA-Z]/g, "")).set({
            "MenuName": name
        }).then(function() {
            console.log("Document successfully written.");
            window.location.replace("menu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + name.replace(/[^a-zA-Z]/g, ""));
        }).catch(function (error) {
            console.log("Error writing document: " + error + ".");
        });

    }

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
        getUrlVars();
        if (vars[1] == "menu_id") renderPage();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
    }
});