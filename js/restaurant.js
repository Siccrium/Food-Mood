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
const itemSummary = document.getElementById("itemSummary");
const subtotal = document.getElementById("subtotal");
const checkout = document.getElementById("checkout");

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
        div.className = 'col-lg-10 mx-left col-12 text-center mb-3 card card-body font-weight-bold';
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
    bottom1.innerHTML = "Order your favourite meal from your favourite restaurant!";
    bottom2.innerHTML = "Place an order and chill! Your food will be on the way!";
    bottom3.innerHTML = "Expect to have a very smooth food mood experience!";

}


//cart modal functions, sorry for confusion.
///////////////////////////////////////////
var total = 0;
var cartCount = 0;
var listNumber = 0;
var itemTotal = 0;

function fillCart() {

    firestore.collection("Users/" + email + "/cart").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (itemDoc) {
            docData = itemDoc.data();
            cartCount += docData.Quantity;
            temp = docData.TotalCost;
            total += temp;
            listNumber += 1;
            console.log("cartCount: " + cartCount);
            console.log("total: " + total.toFixed(2));
            console.log("docquantity: " + docData.Quantity)
            var div = document.createElement('div');
            div.innerHTML = '<br><div id="' + itemDoc.id + 'Div">' +
                '<p>' + listNumber + '. ' +
                docData.FoodName + ' - $' + docData.FoodPrice +
                '<p id="quantity' + itemDoc.id + '">' +
                'Quantity: ' + docData.Quantity + '  ' +
                '</p>' +
                '<span><button id="takeOne' + itemDoc.id + '" type="button" class="btn btn-info">-</button>' + ' ' +
                '<button id="addOne' + itemDoc.id + '" type="button" class="btn btn-info">+</button>' + ' ' +
                '<button id="delete' + itemDoc.id + '" type="button" class="btn btn-danger">Remove</button></span>' +
                '</p>' +
                '</div>';
            itemSummary.appendChild(div);
            handleQuantity(itemDoc.id, docData.FoodPrice, docData.Quantity);
        });//end foreach
        if (cartCount == 0) {
            subtotal.innerText = "Your Cart Is Empty";
        } else {
            subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
        }
    });//end get.then
}//end fillCart

function handleQuantity(docId, price, quantity) {

    var addOne = document.getElementById("addOne" + docId);
    var takeOne = document.getElementById("takeOne" + docId);
    var deleteAll = document.getElementById("delete" + docId);
    var quantityNumber = document.getElementById("quantity" + docId);

    addOne.addEventListener("click", e => {
        console.log("addOne" + docId);
        cartCount++;
        total += price;
        quantity += 1;
        itemTotal = quantity * price;
        subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
        quantityNumber.innerText = "Quantity: " + quantity + "";
        cartCounter.innerText = cartCount;
        console.log("newindvPrice: " + itemTotal);
        updateCart(docId, itemTotal, quantity)
    });

    takeOne.addEventListener("click", e => {
        console.log("takeOne" + docId);
        cartCount--;
        total -= price;
        quantity -= 1;
        itemTotal = quantity * price;
        subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
        quantityNumber.innerText = "Quantity: " + quantity + "";
        cartCounter.innerText = cartCount;
        console.log("newindvPrice: " + itemTotal);
        updateCart(docId, itemTotal, quantity)
    });

    deleteAll.addEventListener("click", e => {
        console.log("deleting:" + docId);
        cartCount -= quantity;
        itemTotal = quantity * price;
        total -= itemTotal;
        subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
        cartCounter.innerText = cartCount;
        deleteItem(docId);
    });

}//end handleQuantity

function updateCart(foodId, newTotal, newQuantity) {
    firestore.doc("Users/" + email + "/cart/" + foodId).update(
        {
            "Quantity": newQuantity,
            "TotalCost": newTotal
        }).then(function () {
            console.log("Food successfully Updated.");
        }).catch(function (error) {
            console.log("Error writing Food: " + error + ".");
        });
}//end updateFood

function deleteItem(foodId) {
    var itemDiv = document.getElementById(foodId + "Div")
    itemDiv.parentNode.removeChild(itemDiv);
    firestore.doc("Users/" + email + "/cart/" + foodId).delete().then(function () {
        console.log("Food successfully deleted!");

    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}//end deleteItem

function setCartCount() {
    var cartCount = 0;
    var quantityCount = 0;

    //get cart count and put correct number next to cart button
    firestore.collection("Users/" + email + "/cart").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            docData = doc.data();
            quantityCount += (docData.Quantity);
            cartCount = quantityCount;
        });//end foreach
        if (cartCount == 0) {
            //do nothing
        } else {
            cartCounter.innerText = cartCount;
        }
    });//end get.then
}

checkout.addEventListener("click", e => {
    window.location.replace("orderCart.html");
})
//////////////////////////////////////////

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
                else if (role === "Customer") customerPage(), fillCart(), setCartCount();
                else if (role === "Deliverer") return;
                else console.log("The value of role is not an accepted value: -" + role + ".");

            } else console.log("The users document does not exist.");

        });

    } else {
        // No user is signed in.
        console.log("No user is signed in");
    }
});
