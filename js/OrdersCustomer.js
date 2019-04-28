//Initialize Firestore
firestore = firebase.firestore();

const inProgressDiv = document.getElementById("inProgressDiv");

var email = "";

function renderInProgress() {

    var orderNumber = 0;
    firestore.collection("Users/" + email + "/Orders").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var data = doc.data();
            firestore.doc("Restaurants/" + data.RestaurantId).get().then(function(restaurant) {
                var restData = restaurant.data();
                var div = document.createElement("div");
                div.id = "Order " + orderNumber;
                orderNumber++;
                div.innerHTML = "<h1>" + div.id + "</h1>" +
                                "<p>" + restData.RestaurantName + "</p>" +
                                "<p>Food Ordered: " + data.FoodOrdered + "</p>" +
                                "<p>Order Status: " + data.OrderStatus + "</p>";
                inProgressDiv.appendChild(div);
            }).catch(function(error) {
                console.log("Error getting documents: " + error);
            });
        })
    }).catch(function(error) {
        console.log("Error getting documents: " + error);
    });

}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("The currently logged in user is: " + user.email + ".");
        email = user.email;
        renderInProgress();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.replace("homepage.html");
    }
});