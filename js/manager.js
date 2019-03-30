//Initialize Firestore
firestore = firebase.firestore();

var email = "";
var refs = [];

//Create HTML References
const duplicator = document.getElementById('duplicator');

function renderPage() {
  firestore.collection("Restaurants").where("RestaurantManager", "==", email).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var data = doc.data();
      var div = document.createElement('div');
      div.innerHTML = '<br><br><h3 id="h">' + data.RestaurantName + '</h3>' +
        '<h3 id="h">' + data.RestaurantAddress + '</h3>' +
        '<button name="' + data.RestaurantName + '" id="' + doc.id + '" type="submit">View Restaurant</button>';
      duplicator.appendChild(div);
      refs.push(document.getElementById(doc.id));
    });
    eventListeners();
  }).catch(function (error) {
    console.log("Error getting documents: " + error);
  });
}

function eventListeners() {

  refs.forEach(function (elem) {
    elem.addEventListener("click", e => {
      window.location.replace("restaurant.html?restaurant_id=" + elem.id);
    });
  });

}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in. Get their email.
    console.log("The currently logged in user is: " + user.email + ".");
    email = user.email;

    //Check to see if this user is a manager. If not, redirect them to their dashboard.
    firestore.doc("/Users/" + email).get().then(function (doc) {

      if (doc.exists) {

        var docData = doc.data();
        role = docData.UserRole;

        //Redirect user to the dashboard for their role.
        if (role === "Manager") return;
        else if (role === "Customer") window.location.replace("customer.html");
        else if (role === "Deliverer") window.location.replace("deliverer.html");
        else console.log("The value of role is not an accepted value: -" + role + ".");

      } else console.log("The users document does not exist.");

    });

    renderPage();

    // firestore.collection("Restaurant").where("Restaurant Manager", "==", user.email).get().then(function(querySnapshot) {
    //   querySnapshot.forEach(function(doc) {
    //     console.log(doc.id, " => ", doc.data());
    //   });
    // }).catch(function(error) {
    //   console.log("Error getting documents: " + error);
    // });

  } else {
    // No user is signed in. Redirect them to the homepage.
    console.log("No user is signed in, redirecting...");
    window.location.replace("homepage.html");
  }
});