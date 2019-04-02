//Initialize Firestore
firestore = firebase.firestore();

var email = "";
//customers will need a unique id so we can allow them to edit their email. 
//or just don't let them. either way, but I suggest uId

const placeOrder = document.getElementById("placeOrder");
// const accountButton = document.getElementById("accountButton");
const ordersButton = document.getElementById("ordersButton");
const notifyHeader = document.getElementById("notifyHeader");

notifyHeader.style.visibility = "hidden";


placeOrder.addEventListener("click", e => {
  notifyHeader.innerText = "Order Placed!";
  notifyHeader.style.visibility = "visible";
  //instead of specific rest id, use vars restaurant_id of rest menu you are adding from
  firestore.doc("Restaurants/PsB7bBjf63vmiOrKoc3M").get().then(function (doc) {
    console.log("get restaurant worked")

    var restData = doc.data();
    console.log(restData);
    var managerEmail = restData.RestaurantManager;
    var newOrderRef = firestore.collection("Restaurants/PsB7bBjf63vmiOrKoc3M/Orders/").doc();
    var orderInfo = {
      FoodItem: "Spaghetti",
      AmountPaid: "$14.95",
      OrderStatus: "Pending",
      OrderAuthor: email,
      OrderManager: managerEmail,
      ParentRest: doc.id
    }
    newOrderRef.set(orderInfo).then(function () {
      console.log("Order successfully written.");
      firestore.doc("Users/" + email + "/Orders/" + newOrderRef.id).set({
        OrderId: newOrderRef.id,
        RestaurantId: doc.id
      })
    }).catch(function (error) {
      console.log("Error writing document: " + error + ".");
    });

  });


})

ordersButton.addEventListener("click", e => {
  window.location.replace("orders.html");
});

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
      
      // renderFilters();
    
    } else {
      // No user is signed in. Redirect them to the homepage.
      console.log("No user is signed in, redirecting...");
      window.location.replace("homepage.html");
    }
});