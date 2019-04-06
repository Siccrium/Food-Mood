//Initialize Firestore
firestore = firebase.firestore();

const nameField = document.getElementById("userName");
const addressField = document.getElementById("userAddress");
const cityField = document.getElementById("userCity");
const stateField = document.getElementById("userState");
const zipField = document.getElementById("userZip");
const emailField = document.getElementById("userEmail");
const phoneNumberField = document.getElementById("userPhone");
const searchSection = document.getElementById("searchSection");
const restTags = document.getElementById("restTags")

var name = "";
var address = "";
var city = "";
var state = "";
var zip = "";
var email = "";
var phoneNumber = "";
var restaurants = [];


const placeOrder = document.getElementById("placeOrder");
// const accountButton = document.getElementById("accountButton");
const ordersButton = document.getElementById("ordersButton");
const notifyHeader = document.getElementById("notifyHeader");

notifyHeader.style.visibility = "hidden";

function renderRestaurants() {

  firestore.collection("Restaurants").get().then(function (documents) {

    documents.forEach(function (doc) {
      var data = doc.data();
      var div = document.createElement("div");
      div.innerHTML = "<h1>" + data.RestaurantName + "</h1>";
      searchSection.appendChild(div);
      restaurants.push(data);
    });

  });

}

function renderFilters() {

  firestore.doc("Tags/Tags").get().then(function (doc) {

    if (doc && doc.exists) {

      var data = doc.data();
      var filters = data.Tags.split(", ");

      filters.forEach(element => {

        restTags.innerHTML += "<option value='" + element + "'>" + element + "</option>";

      });

    }

  })

}

function filterRestaurants() {

  var filteredRestaurants = [];
  for (var i = 0; i < restaurants.length; i++) {
    filteredRestaurants[i] = restaurants[i];
  }

  console.log(filteredRestaurants);
  var tagsArray = getSelections(restTags);

  for (var i = 0; i < tagsArray.length; i++) {
    for (var j = 0; j < filteredRestaurants.length; j++) {
      if (filteredRestaurants[j] != null) {
        var thisRestTags = filteredRestaurants[j]['RestaurantTags'];
        if (!thisRestTags.includes(tagsArray[i])) {
          delete filteredRestaurants[j];
        }
      }
    }
  }


console.log(filteredRestaurants);

searchSection.innerHTML = '';

filteredRestaurants.forEach(function (element) {
  var div = document.createElement("div");
  div.innerHTML = "<h1>" + element['RestaurantName'] + "</h1>";
  searchSection.appendChild(div);
});

}

function getSelections(select) {

  var result = [];
  var options = select && select.options;
  var opt;

  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;

}

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

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in. Get their email.
    console.log("The currently logged in user is: " + user.email + ".");
    email = user.email;

    //Check to see if this user is a customer. If not, redirect them to their dashboard.
    firestore.doc("/Users/" + email).get().then(function (doc) {

      if (doc.exists) {

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
        if (role === "Customer") return;
        else if (role === "Manager") window.location.replace("manager.html");
        else if (role === "Deliverer") window.location.replace("deliverer.html");
        else console.log("The value of role is not an accepted value: -" + role + ".");

      } else console.log("The users document does not exist.");

    });

    renderRestaurants();

    renderFilters();

  } else {
    // No user is signed in. Redirect them to the homepage.
    console.log("No user is signed in, redirecting...");
    window.location.replace("homepage.html");
  }
});