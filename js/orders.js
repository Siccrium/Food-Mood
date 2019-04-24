//Initialize Firestore
firestore = firebase.firestore();

const duplicator = document.getElementById("orderDuplicator");
const accountButton = document.getElementById("accountButton");
const signOut = document.getElementById("signOut");
const yourOrders = document.getElementById("h1");
const notifyHeader = document.getElementById("notifyHeader");
const restPage = document.getElementById("restPage");
const itemSummary = document.getElementById("itemSummary");
const subtotal = document.getElementById("subtotal");
const checkout = document.getElementById("checkout");

restPage.style.visibility = "hidden";
var email = "";
var restId = "";
var vars = [];
getUrlVars();



function renderCustomerPage() {
    console.log(email);
    firestore.collection("Users/" + email + "/Orders").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var data = doc.data();
            restId = data.RestaurantId;
            console.log(data);
            showCustomerOrder(restId);
            //used another function because it kept throwing errors
        });
    }).catch(function (error) {
        console.log("Error getting documents: " + error);
    });
}//end renderPage

function showCustomerOrder(restId) {
    firestore.collection("Restaurants/" + restId + "/Orders").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var data = doc.data();
            console.log(data);
            var div = document.createElement('div');
            div.innerHTML = '<br><br><h4>' + data.FoodItem + '</h4>' +
                '<h6>Total: ' + data.AmountPaid + '</h6>' +
                '<h6>Order Status: ' + data.OrderStatus + '</h6>';
            duplicator.appendChild(div);
        });
    }).catch(function (error) {
        console.log("Error getting documents: " + error);
    });
}//end showFood

function renderRestaurantPage() {
    h1.innerHTML = "<u>Incoming Orders</u>";
    console.log(email);
    firestore.collection("Restaurants/" + vars['restaurant_id'] + "/Orders").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var data = doc.data();
            console.log(data);
            var div = document.createElement('div');
            div.innerHTML = '<br><br><h4>Order From: ' + data.OrderAuthor + '</h4>' +
                '<h6>Items Ordered: ' + data.FoodItem + '</h6>' +
                '<h6>Total: ' + data.AmountPaid + '</h6>' +
                '<h6>Order Status: ' + data.OrderStatus + '</h6>' + showButtonsOrNah(doc.id, data.OrderStatus);
            duplicator.appendChild(div);
            handleAcceptRejectDelete(doc.id, data.OrderStatus, doc.OrderAuthor);
        });
    }).catch(function (error) {
        console.log("Error getting documents: " + error);
    });
}//end renderRestaurantPage

function showButtonsOrNah(docId, orderStatus) {
    if (orderStatus == "Accepted" || orderStatus == "Rejected") {
        return ('<button style="margin:5px;" type="submit" class="button_2" id="deleteButton' + docId + '">Delete Order</button>');
    } else {
        return ('<button type="submit" class="btn btn-success" id="acceptButton' + docId + '">Accept Order</button>' +
            '<button type="submit" class="btn btn-danger" id="rejectButton' + docId + '">Reject Order</button>');
    }//end if checkstatus
}//end showbuttonsornah

function backToOrders() {
    window.location.replace("orders.html?restaurant_id=" + vars['restaurant_id']);
}

//not sure if this will work correctly for multiple items yet. probably will though
function handleAcceptRejectDelete(docId, orderStatus, orderAuthor) {
    if (orderStatus == "Accepted" || orderStatus == "Rejected") {
        var deleteButton = document.getElementById("deleteButton" + docId);
        deleteButton.addEventListener("click", e => {
            deleteOrder(docId, orderAuthor);
            setTimeout(backToOrders, 1000);
        })//end deleteButton listener
    } else {
        var accept = document.getElementById("acceptButton" + docId);
        var reject = document.getElementById("rejectButton" + docId);

        accept.addEventListener("click", e => {
            firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Orders/" + docId).update(
                {
                    OrderStatus: "Accepted"
                }).then(function () {
                    console.log("Order successfully Updated.");
                    window.location.replace("orders.html?restaurant_id=" + vars['restaurant_id'])
                }).catch(function (error) {
                    console.log("Error Updating Order : " + error + ".");
                });
        });

        reject.addEventListener("click", e => {
            firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Orders/" + docId).update(
                {
                    OrderStatus: "Rejected"
                }).then(function () {
                    console.log("Order successfully Updated.");
                    window.location.replace("orders.html?restaurant_id=" + vars['restaurant_id'])
                }).catch(function (error) {
                    console.log("Error Updating Order : " + error + ".");
                });
        });
    }//end if checkstatus
}//end handleAcceptRejectDelete

signOut.addEventListener("click", e => {
    window.location.replace("homepage.html");
});

accountButton.addEventListener("click", e => {
    window.location.replace("customer.html");
})

function deleteOrder(docId, orderAuthor) {
    firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Orders/" + docId).delete().then(function () {
        notifyHeader.innerText = "Delete In Progress! Please Wait..."
        notifyHeader.style.visibility = "visible";
        console.log("Food successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });//end delete order from restaurant
    firestore.doc("Users/" + orderAuthor + "/Orders/" + docId).delete().then(function () {
        notifyHeader.innerText = "Delete In Progress! Please Wait..."
        notifyHeader.style.visibility = "visible";
        console.log("Food successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });//end delete order from restaurant
}//end deleteFood

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

restPage.addEventListener("click", e => {
    window.location.replace("restaurant.html?restaurant_id=" + vars['restaurant_id']);
});

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
        if (vars[0] == 'restaurant_id') {
            renderRestaurantPage();
            restPage.style.visibility = "visible";
        } else {
            renderCustomerPage();
        }
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.replace("homepage.html");
    }
});