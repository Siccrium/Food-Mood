//Initialize Firestore
firestore = firebase.firestore();

const nameField = document.getElementById("userName");
const addressField = document.getElementById("userAddress");
const cityField = document.getElementById("userCity");
const stateField = document.getElementById("userState");
const zipField = document.getElementById("userZip");
const emailField = document.getElementById("userEmail");
const phoneNumberField = document.getElementById("userPhone");

var name = "";
var address = "";
var city = "";
var state = "";
var zip = "";
var email = "";
var phoneNumber = "";


const placeOrder = document.getElementById("placeOrder");

placeOrder.addEventListener("click", e => {

  firestore.doc("Restaurants/RRWswvxp24gRBdBgYouD/Orders/OrderTest").set({

    "FoodItem": "Spaghetti",
    "AmountPaid": "$10",
    "OrderStatus": "Pending"

  });

})

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in. Get their email.
      console.log("The currently logged in user is: " + user.email + ".");
      email = user.email;

      //Check to see if this user is a customer. If not, redirect them to their dashboard.
      firestore.doc("/Users/" + email).get().then(function(doc) {

        if(doc.exists){
                
          var docData = doc.data();
          var role = docData.UserRole;

          nameField.innerText = docData.UserName;
          addressField.innerText = docData.UserAddress;
          cityField.innerText = docData.UserAddress;
          stateField.innerText = docData.UserAddress;
          zipField.innerText = docData.UserAddress;
          emailField.innerText = docData.UserEmail;
          phoneNumberField.innerText = docData.UserPhoneNumber;

          //Redirect user to the dashboard for their role.
          if(role === "Customer") return;
          else if(role === "Manager") window.location.replace("manager.html");
          else if (role === "Deliverer") window.location.replace("deliverer.html");
          else console.log("The value of role is not an accepted value: -" + role + ".");

        } else console.log("The users document does not exist.");

      });

      // renderPage();
      // renderFilters();
    
    } else {
      // No user is signed in. Redirect them to the homepage.
      console.log("No user is signed in, redirecting...");
      window.location.replace("homepage.html");
    }
});