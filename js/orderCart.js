//Initialize Firestore
firestore = firebase.firestore();

const subtotalText = document.getElementById("Subtotal");
const deliveryFeeText = document.getElementById("Delivery");
const totalText = document.getElementById("Total");
const tipRadio = document.getElementsByName("options");

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
        totalText.innerHTML = total;

        
    }).catch(function(error) {
        console.log("Error getting documents: " + error);
    });

}

function updateTotal() {

    total = subtotal + deliveryFee;
    total = total + (total*tip);
    totalText.innerHTML = total;

}

function getRadioVal() {
    console.log("Hello");
    for (var i = 0, len = tipRadio.length; i < len; i++) {
      if (tipRadio[i].checked) {
        tip = tipRadio[i].value;
        break;
      }
    }
    updateTotal();
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