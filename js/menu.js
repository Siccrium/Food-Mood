//Initialize Firestore
firestore = firebase.firestore();

var email = "";
var vars = [];
var refs = [];

const menuName = document.getElementById("menuName");
const editButton = document.getElementById("editButton");
const deleteButton = document.getElementById("delete");
const restPage = document.getElementById("restPage");
const foodDuplicator = document.getElementById('foodDuplicator');
const addFoodButton = document.getElementById("addFoodButton");
const FoodName = document.getElementById("FoodName");
const FoodPrice = document.getElementById("FoodPrice");
const accDashboard = document.getElementById("accDashboard");

getUrlVars();

firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).get().then(function (doc) {
    if (doc && doc.exists) {
        var data = doc.data();
        menuName.innerText = data.MenuName;
        //create divs for showing food items
        firestore.collection("Restaurants").doc(vars['restaurant_id']).collection("Menus").doc(vars['menu_id']).collection("Food").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var data = doc.data();
                console.log(data);
                var div = document.createElement('div');
                div.innerHTML = '<p>' + data.FoodName + ' - $' + data.FoodPrice + '</p>';
                foodDuplicator.appendChild(div);
                //handle addToCart button later for customer view
            });
        }).catch(function (error) {
            console.log("Error getting documents: " + error);
        });
        //end foodDuplicator div
    } else
        console.log("The menu document doesn't exist");
    console.log(vars);
});

function managerPage() {

    editButton.addEventListener("click", e => {
        window.location.replace("editMenu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + vars['menu_id']);
    });
    
    deleteButton.addEventListener("click", e => {
    
        firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).delete().then(function () {
            console.log("Document successfully deleted!");
            window.location.replace("restaurant.html?restaurant_id=" + vars['restaurant_id']);
        }).catch(function (error) {
            console.log("Error deleting document: " + error);
        });
    
    });
    accDashboard.href = "manager.html";

}

function customerPage() {

    editButton.parentNode.removeChild(editButton);
    deleteButton.parentNode.removeChild(deleteButton);
    accDashboard.href = "customer.html";

}

restPage.addEventListener("click", e => {
    window.location.replace("restaurant.html?restaurant_id=" + vars['restaurant_id']);
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