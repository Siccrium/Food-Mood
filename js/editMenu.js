//Initialize Firestore
firestore = firebase.firestore();

const submitButton = document.getElementById("Sbutton");
const menuName = document.getElementById("menuName");
const errorHeader = document.getElementById("errorHeader");

errorHeader.style.visibility = "hidden";

var name = "";
var vars = [];
getUrlVars();

submitButton.addEventListener("click", e => {

    name = menuName.value;
    errorHeader.innerText = "";
    console.log(checkMenuName());

    if (name == "") {
        errorHeader.innerText = "Please enter a Menu Name."
        errorHeader.style.visibility = "visible";
        console.log("The 'menuName' field was left empty.");
        return;
    }

    firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + name).set({
        "MenuName": name
    }).then(function () {
        console.log("Document successfully written.");
        //window.location.replace("menu.html");
    }).catch(function (error) {
        console.log("Error writing document: " + error + ".");
    });

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