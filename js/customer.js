//Initialize Firestore
firestore = firebase.firestore();

var email = "";

const placeOrder = document.getElementById("placeOrder");
const accountButton = document.getElementById("orderButton");
const ordersButton = document.getElementById("ordersButton");
const notifyHeader = document.getElementById("notifyHeader");
const orderList = document.getElementById("orderList");

notifyHeader.style.visibility = "hidden";

//gonna use this to show all orders that I have
// function renderPage() {
//   //that order id can go in a collection of order ids the customer has
//   //order id will have the name of restaurant manager (nothing else necessary)
//   //only look through Restaurantswhere RestaurauntManager == OrderManager
//   //Where orderAuthor == email
//   //display those
//   firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).get().then(function (doc) {
//       if (doc && doc.exists) {
//           var data = doc.data();
//           //fill menu name
//           menuName.defaultValue = data.MenuName;
//           //list existing food
//           firestore.collection("Restaurants").doc(vars['restaurant_id']).collection("Menus").doc(vars['menu_id']).collection("Food").get().then(function (querySnapshot) {
//               querySnapshot.forEach(function (doc) {
//                   var data = doc.data();
//                   var FoodName = data.FoodName
//                   var FoodPrice = data.FoodPrice;
//                   console.log(data);
//                   var div = document.createElement('div');
//                   //here is whats going inside the duplicator div when first rendered.
//                   div.innerHTML = '<div id="' + FoodName + 'Div">' +
//                       '<p>' +
//                       '<input type="submit" value="Edit" state ="unclicked" id="EditFoodButton' + FoodName + '"></input>' +
//                       ' ' + FoodName + ' - $' + FoodPrice +
//                       '</p>' +
//                       '</div>';
//                   foodDuplicator.appendChild(div);
//                   handleFoodDiv(doc.id, FoodName, FoodPrice);
//                   //handle addToCart button later for customer view
//               });
//           }).catch(function (error) {
//               console.log("Error getting documents: " + error);
//           });
//           //end foodDuplicator div
//       } else console.log("The menu document does not exist.");
//   }).catch(function (error) {
//       console.log("Error getting menu document: " + error);
//   });
// }//end renderPage

placeOrder.addEventListener("click", e => {
  notifyHeader.innerText = "Order Placed!";
  notifyHeader.style.visibility = "visible";
  //instead of specific rest id, use vars restaurant_id of rest menu you are adding from
  firestore.doc("Restaurants/RRWswvxp24gRBdBgYouD").get().then(function(doc){
    console.log("get rest worked")

    var restData = doc.data();
    console.log(restData);
    var managerEmail = restData.RestaurantManager;
    var newOrderRef = firestore.collection("Restaurants/RRWswvxp24gRBdBgYouD/Orders/").doc();
    var orderInfo = {
      FoodItem: "Spaghetti",
      AmountPaid: "$10",
      OrderStatus: "Pending",
      OrderAuthor: email,
      OrderManager: managerEmail,
      ParentRest: doc.id
    }
    newOrderRef.set(orderInfo).then(function () {
      console.log("Order successfully written.");
      firestore.doc("Users/"+email+"/Orders/"+newOrderRef.id).set({
        OrderNumber: newOrderRef.id,
        OrderManager: managerEmail
      })
  }).catch(function (error) {
      console.log("Error writing document: " + error + ".");
  });

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