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
const deleteButton = document.getElementById("delete");
const duplicator = document.getElementById('duplicator');
const addMenuButton = document.getElementById("addMenuButton");

getUrlVars();
console.log(vars);



//this doesn't work? 
// function eventListeners() {

//     vars.forEach(function (elem) {
//         elem.addEventListener("click", e => {
//             window.location.replace("menu.html?menu_id=" + elem.id);
//         });
//     });

// }


firestore.collection("Restaurants").doc(vars['restaurant_id']).get().then(function (doc) {
    if (doc.exists) {

        var docData = doc.data();
        restName.innerText = docData.RestaurantName;
        restAddress.innerText = docData.RestaurantAddress;
        restCity.innerText = docData.RestaurantCity;
        restState.innerText = docData.RestaurantState;
        restZip.innerText = docData.RestaurantZip;
        restPhoneNumber.innerText = docData.RestaurantPhoneNumber;

    } else console.log("The restaurant document does not exist.");

});

firestore.collection("Restaurants/" + vars['restaurant_id'] + "/Menus").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        var data = doc.data();
        var div = document.createElement('div');
        div.innerHTML = '<br><br><h1>' + data.MenuName + '</h1>' +
            '<button name="' + restName.innerText + ' Complete Menu' + '" id="' + doc.id + '" type="submit" class="button_2" style="margin:5px;">View Menu</button>';
        duplicator.appendChild(div);
        handleViewMenu(doc.id);
    });
    //eventlisteners();
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

editButton.addEventListener('click', e => {

    window.location.replace("editRestaurant.html?restaurant_id=" + vars['restaurant_id']);

});

deleteButton.addEventListener('click', e => {
    firestore.collection("Restaurants").doc(vars['restaurant_id']).delete().then(function () {
        console.log("Document successfully deleted!");
        window.location.replace("manager.html");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
});

addMenuButton.addEventListener('click', e => {

    window.location.replace("editMenu.html?restaurant_id=" + vars['restaurant_id']);

});


function handleViewMenu(menuId) {
    var viewMenuButton = document.getElementById(menuId)
    viewMenuButton.addEventListener('click', e => {
        console.log(menuId);
        window.location.replace("menu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + menuId);

    });
};

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