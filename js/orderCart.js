//Initialize Firestore
firestore = firebase.firestore();

const subtotalText = document.getElementById("Subtotal");
const deliveryFeeText = document.getElementById("Delivery");
const totalText = document.getElementById("Total");
const tipRadio = document.getElementsByName("options");
const otherTip = document.getElementById("otherTip");
const submitOther = document.getElementById("submitOther");
const tipExplain = document.getElementById("tipExplain");
const placeOrder = document.getElementById("placeOrder");

var email = "";
var subtotal = 0;
var deliveryFee = 5;
var total = 0;
getRadioVal();

//gets total of all items in the customer's cart
function renderTotals() {

    firestore.collection("Users/"+email+"/cart").get().then(function(querySnapshot) {

        querySnapshot.forEach(function(doc) {
            var data = doc.data();
            subtotal = subtotal + data.TotalCost;
        });

        subtotalText.innerHTML = subtotal;
        deliveryFeeText.innerHTML = deliveryFee;
        total = subtotal + deliveryFee;
        total = total + (total*tip);
        totalText.innerHTML = "$" + total;

        
    }).catch(function(error) {
        console.log("Error getting documents: " + error);
    });

}

function updateTotal() {

    total = subtotal + deliveryFee;
    total = total + (total*tip);
    totalText.innerHTML = "$" + total;

}

placeOrder.addEventListener("click", function() {

    var parentRest = "";
    var foodOrdered = [];

    firestore.collection("Users/" + email + "/cart").get().then(function(querySnapshot) {
        var data = querySnapshot.docs[0].data();
        parentRest = data.ParentRest;

        querySnapshot.forEach(function(doc) {
            var data = doc.data();
            foodOrdered.push(data.FoodName + ":" + data.Quantity);
        });

        firestore.collection("Users/" + email + "/cart").get().then(function(cartSnapshot) {

            cartSnapshot.forEach(function(doc) {
                firestore.doc("Users/" + email + "/cart/" + doc.id).delete().then(function() {
                    console.log("Document successfully deleted.");
                }).catch(function(error) {
                    console.log("Error deleting document: " + error);
                });
            });

            firestore.collection("Users/" + email + "/Orders").add({
                "RestaurantId": parentRest,
                "FoodOrdered": foodOrdered,
                "OrderStatus": "In progress"
            }).then(function(){
                console.log("Order successfully placed!");
                window.location.replace("OrdersCustomer.html");
            }).catch(function(error) {
                console.log("Error writing to database: " + error);
            });

        }).catch(function(error) {
            console.log("Error getting documents: " + error);
        });

    }).catch(function(error) {
        console.log("Error getting documents: " + error);
    });

});

submitOther.addEventListener("click", function() {

    tip = otherTip.value;
    updateTotal();

});

function getRadioVal() {
    otherTip.style.visibility = "hidden";
    submitOther.style.visibility = "hidden";
    tipExplain.style.visibility = "hidden";
    for (var i = 0, len = tipRadio.length; i < len; i++) {
      if (tipRadio[i].checked) {
        tip = tipRadio[i].value;
        break;
      }
    }
    if(tip != "Other") updateTotal();
    else {
        otherTip.style.visibility = "visible";
        submitOther.style.visibility = "visible";
        tipExplain.style.visibility = "visible";
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("The currently logged in user is: " + user.email + ".");
        email = user.email;
        renderTotals();
        
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.replace("homepage.html");
    }
});