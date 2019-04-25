//Initialize Firestore
firestore = firebase.firestore();

// const nameField = document.getElementById("userName");
// const addressField = document.getElementById("userAddress");
// const cityField = document.getElementById("userCity");
// const stateField = document.getElementById("userState");
// const zipField = document.getElementById("userZip");
// const emailField = document.getElementById("userEmail");
// const phoneNumberField = document.getElementById("userPhone");
const searchSection = document.getElementById("searchSection");
const restTags = document.getElementById("restTags");
const itemSummary = document.getElementById("itemSummary");
const subtotal = document.getElementById("subtotal");
const checkout = document.getElementById("checkout");

var name = "";
var address = "";
var city = "";
var state = "";
var zip = "";
var email = "";
var phoneNumber = "";
var restaurants = [];
var restIDs = [];


// const placeOrder = document.getElementById("placeOrder");
// const accountButton = document.getElementById("accountButton");
const ordersButton = document.getElementById("ordersButton");
const notifyHeader = document.getElementById("notifyHeader");

notifyHeader.style.visibility = "hidden";


function renderRestaurants() {

  firestore.collection("Restaurants").get().then(function (documents) {

    documents.forEach(function (doc) {
      var data = doc.data();
      var div = document.createElement("div");
      div.innerHTML = "<h3 style='color:#006400;'>" + data.RestaurantName + "</h3>"
        + "<button id='" + doc.id + "' type=submit class='btn btn-success'>View Restaurant</button>";
      div.className = 'col-md-3 col-lg-10 mx-left text-center mb-3 card card-body d-inline-block font-weight-bold';
      searchSection.appendChild(div);
      restaurants.push(data);
      restIDs.push(doc.id);
    });

    eventListeners(restIDs);

  });

}

function renderFilters() {

  firestore.doc("Tags/Tags").get().then(function (doc) {

    if (doc && doc.exists) {

      var data = doc.data();
      var filters = data.Tags.split(", ");

      filters.forEach(element => {

        restTags.innerHTML += "<option value='" + element + "'>" + element + "</option>";
        restTags.className = "'mdb-select md-form colorful-select dropdown-primary' multiple searchable='Search here..'"

      });

    }

  })

}

function filterRestaurants() {

  var filteredRestaurants = [];
  var filteredRestIDs = [];
  for (var i = 0; i < restaurants.length; i++) {
    filteredRestaurants[i] = restaurants[i];
    filteredRestIDs[i] = restIDs[i];
  }

  console.log(filteredRestaurants);
  var tagsArray = getSelections(restTags);

  for (var i = 0; i < tagsArray.length; i++) {
    for (var j = 0; j < filteredRestaurants.length; j++) {
      if (filteredRestaurants[j] != null) {
        var thisRestTags = filteredRestaurants[j]['RestaurantTags'];
        if (!thisRestTags.includes(tagsArray[i])) {
          delete filteredRestaurants[j];
          delete filteredRestIDs[j];
        }
      }
    }
  }


  console.log(filteredRestaurants);

  searchSection.innerHTML = '';

  filteredRestaurants.forEach(function (element, index) {
    var div = document.createElement("div");
    div.innerHTML = "<h1>" + element['RestaurantName'] + "</h1>"
      + "<button id='" + filteredRestIDs[index] + "' type=submit class= 'btn btn-success'>View Restaurant</button>";
    // div.className = 'row hidden-md-up col-md-4 mb-3 card card-block float-right font-weight-bold';
    div.className = 'col-md-3 col-lg-10 mx-left text-center mb-3 card card-body font-weight-bold';

    searchSection.appendChild(div);
  });

  eventListeners(filteredRestIDs);

}

function eventListeners(IDs) {

  IDs.forEach(function (elem) {
    var buttonReference = document.getElementById(elem);
    buttonReference.addEventListener("click", e => {
      window.location.replace("restaurant.html?restaurant_id=" + elem);
    });
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

// placeOrder.addEventListener("click", e => {
//   notifyHeader.innerText = "Order Placed!";
//   notifyHeader.style.visibility = "visible";
//   //instead of specific rest id, use vars restaurant_id of rest menu you are adding from
//   firestore.doc("Restaurants/PsB7bBjf63vmiOrKoc3M").get().then(function (doc) {
//     console.log("get restaurant worked")

//     var restData = doc.data();
//     console.log(restData);
//     var managerEmail = restData.RestaurantManager;
//     var newOrderRef = firestore.collection("Restaurants/PsB7bBjf63vmiOrKoc3M/Orders/").doc();
//     var orderInfo = {
//       FoodItem: "Spaghetti",
//       AmountPaid: "$14.95",
//       OrderStatus: "Pending",
//       OrderAuthor: email,
//       OrderManager: managerEmail,
//       ParentRest: doc.id
//     }
//     newOrderRef.set(orderInfo).then(function () {
//       console.log("Order successfully written.");
//       firestore.doc("Users/" + email + "/Orders/" + newOrderRef.id).set({
//         OrderId: newOrderRef.id,
//         RestaurantId: doc.id
//       })
//     }).catch(function (error) {
//       console.log("Error writing document: " + error + ".");
//     });

//   });


// })

// ordersButton.addEventListener("click", e => {
//   window.location.replace("orders.html");
// });

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
    // User is signed in. Get their email.
    console.log("The currently logged in user is: " + user.email + ".");
    email = user.email;

    //Check to see if this user is a customer. If not, redirect them to their dashboard.
    firestore.doc("/Users/" + email).get().then(function (doc) {

      if (doc.exists) {

        var docData = doc.data();
        var role = docData.UserRole;

        // nameField.innerText = docData.UserName;
        // addressField.innerText = docData.UserAddress;
        // cityField.innerText = docData.UserAddress;
        // stateField.innerText = docData.UserAddress;
        // zipField.innerText = docData.UserAddress;
        // emailField.innerText = docData.UserEmail;
        // phoneNumberField.innerText = docData.UserPhoneNumber;

        //Redirect user to the dashboard for their role.
        if (role === "Customer") return;
        else if (role === "Manager") window.location.replace("manager.html");
        else if (role === "Deliverer") window.location.replace("deliverer.html");
        else console.log("The value of role is not an accepted value: -" + role + ".");

      } else console.log("The users document does not exist.");

    });

    renderRestaurants();

    renderFilters();

    setCartCount();

    fillCart();

  } else {
    // No user is signed in. Redirect them to the homepage.
    console.log("No user is signed in, redirecting...");
    window.location.replace("homepage.html");
  }
});
