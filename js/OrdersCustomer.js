//Initialize Firestore
firestore = firebase.firestore();

const inProgressDiv = document.getElementById("inProgressDiv");
const pastDiv = document.getElementById("pastDiv");

var email = "";
var orderNumber = 0;
var orders = []

function renderOrders() {
    for(var i=0; i<orders.length; i++) {
        var data = orders[i].data();
        currOrder = orders[i].id;
        if(data.OrderStatus == "Rejected") {
            var div = document.createElement("div");
            div.id = "Order " + orderNumber;
            div.innerHTML = "<h1>" + div.id + "</h1>" +
                "<p>" + data.RestaurantName + "</p>" +
                "<p>Food Ordered: " + data.FoodOrdered + "</p>" +
                "<p id='Order" + orderNumber + "OrderStatus'>Order Status: " + data.OrderStatus + "</p>" +
                "<input type='submit' value='Delete' class='btn btn-danger' id='" + div.id.replace(' ', '') + "DeleteButton'>";
            pastDiv.appendChild(div);
            addDeleteEventListener(orderNumber, currOrder);
            orderNumber++;
        } else {
            var div = document.createElement("div");
            div.id = "Order " + orderNumber;
            div.innerHTML = "<h1>" + div.id + "</h1>" +
                "<p>" + data.RestaurantName + "</p>" +
                "<p>Food Ordered: " + data.FoodOrdered + "</p>" +
                "<p id='Order" + orderNumber + "OrderStatus'>Order Status: " + data.OrderStatus + "</p>";
            inProgressDiv.appendChild(div);
            orderNumber++;
        }
    }

}

function addDeleteEventListener(ordNum, currentOrder) {

    const delButton = document.getElementById("Order" + ordNum + "DeleteButton");
    delButton.addEventListener("click", function() {
        
        firestore.doc("Users/" + email + "/Orders/" + currentOrder).delete().then(function() {
            console.log("Successfully deleted document!");
            var ref = delButton.parentElement;
            ref.parentElement.removeChild(ref);
        }).catch(function(error) {
            console.log("Error deleting document: " + error);
        });

    });

}

function getOrders() {
    firestore.collection("Users/" + email + "/Orders").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            orders.push(doc);
        });
        renderOrders();
    }).catch(function(error) {
        console.log("Error getting documents: " + error);
    });
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("The currently logged in user is: " + user.email + ".");
        email = user.email;
        getOrders();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.replace("homepage.html");
    }
});