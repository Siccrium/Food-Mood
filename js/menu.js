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
const menuHeader = document.getElementById("menuHeader");
const bottom1 = document.getElementById("bottom1");
const bottom2 = document.getElementById("bottom2");
const bottom3 = document.getElementById("bottom3");

getUrlVars();



function managerPage() {

    menuHeader.innerHTML = "Food Items In Your Menu";
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
    menuHeader.innerHTML = "Start Your Order";
    bottom1.innerHTML = "1. need new text here for customer";
    bottom2.innerHTML = "2. need new text here for customer";
    bottom3.innerHTML = "3. need new text here for customer";


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
                    div.innerHTML = '<div"><p>' + data.FoodName + ' - $' + data.FoodPrice + '</p>' +
                        '<button id="' + doc.id + '" type="submit" class="btn btn-success">Add To Cart</button></div>';
                    div.className = 'card card-body float-right font-weight-bold';
                    foodDuplicator.appendChild(div);
                    console.log("no wayy")
                });//end forEach
                //issues with listener.. get all food again and set listeners
                firestore.collection("Restaurants").doc(vars['restaurant_id']).collection("Menus").doc(vars['menu_id']).collection("Food").get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        var data = doc.data();
                        console.log(data);
                        handleAddToCart(doc.id, data.FoodName);
                    });
                }).catch(function (error) {
                    console.log("Error getting documents: " + error);
                });//end second .get.then.forEach.catch

            }).catch(function (error) {
                console.log("Error getting documents: " + error);
            });
            //end foodDuplicator div
        } else
            console.log("The menu document doesn't exist");
        console.log(vars);
    });

}//end CustomerPage



function handleAddToCart(docId, FoodName) {
    var buttonId = document.getElementById(docId);

    buttonId.addEventListener("click", e => {
        console.log("it worked" + docId);
    });

}//end handleAddToCart

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