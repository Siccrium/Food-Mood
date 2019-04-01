//Initialize Firestore
firestore = firebase.firestore();

var email = "";

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
          role = docData.UserRole;

          //Redirect user to the dashboard for their role.
          if(role === "Customer") return;
          else if(role === "Manager") window.location.replace("manager.html");
          else if (role === "Deliverer") window.location.replace("deliverer.html");
          else console.log("The value of role is not an accepted value: -" + role + ".");

        } else console.log("The users document does not exist.");

      });
    
    } else {
      // No user is signed in. Redirect them to the homepage.
      console.log("No user is signed in, redirecting...");
      window.location.replace("homepage.html");
    }
});