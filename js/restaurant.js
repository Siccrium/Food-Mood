//Initialize Firestore
firestore = firebase.firestore();

var email = "";
var vars = [];
var menuName = "";
var refs = [];

//Create HTML References.
const restName = document.getElementById("restName");
const restAddress = document.getElementById("restAddress");
const restCity = document.getElementById("restCity");
const restState = document.getElementById("restState");
const restZip = document.getElementById("restZip");
const restPhoneNumber = document.getElementById("restPhoneNumber");
const duplicator = document.getElementById('duplicator');
const editButton = document.getElementById("editButton");
const deleteButton = document.getElementById("delete");
const addMenuButton = document.getElementById("addMenuButton");
const ordersButton = document.getElementById("ordersButton");
const accDashboard = document.getElementById("accDashboard");
const youCan = document.getElementById("youCan");
const bottom1 = document.getElementById("bottom1");
const bottom2 = document.getElementById("bottom2");
const bottom3 = document.getElementById("bottom3");

getUrlVars();

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
        div.innerHTML = '<br><br><h3 id="h">' + data.MenuName + '</h3>' +
            '<button name="' + restName.innerText + 'Menu' + '" id="' + doc.id + '" type="submit" class="btn btn-success">View Menu</button>';
        duplicator.appendChild(div);
        refs.push(document.getElementById(doc.id));
        eventListeners();
    });
    eventListeners();
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

function eventListeners() {

    refs.forEach(function (elem) {
        elem.addEventListener("click", e => {
            menuName = elem.id;
            window.location.replace("menu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + menuName.replace(/[^a-zA-Z0-9]/g, ""));
        });
    });

}

function managerPage() {

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

    ordersButton.addEventListener("click", e => {

        window.location.replace("orders.html?restaurant_id=" + vars['restaurant_id']);

    });

    accDashboard.href = "manager.html";

}

function customerPage() {
    youCan.innerHTML = "Choose Your Favorite Menu!";
    editButton.parentNode.removeChild(editButton);
    addMenuButton.parentNode.removeChild(addMenuButton);
    deleteButton.parentNode.removeChild(deleteButton);
    ordersButton.parentNode.removeChild(ordersButton);
    accDashboard.href = "customer.html";
    bottom1.innerHTML = "1. need new text here for customer";
    bottom2.innerHTML = "2. need new text here for customer";
    bottom3.innerHTML = "3. need new text here for customer";

}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("The currently logged in user is: " + user.email + ".");
        email = user.email;

        firestore.doc("/Users/" + email).get().then(function (doc) {

            if (doc.exists) {

                var docData = doc.data();
                var role = docData.UserRole;

                //Redirect user to the dashboard for their role.
                if (role === "Manager") managerPage();
                else if (role === "Customer") customerPage();
                else if (role === "Deliverer") return;
                else console.log("The value of role is not an accepted value: -" + role + ".");

            } else console.log("The users document does not exist.");

        });

    } else {
        // No user is signed in.
        console.log("No user is signed in");
    }
});