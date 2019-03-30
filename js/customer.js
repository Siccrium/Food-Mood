//Initialize Firestore
firestore = firebase.firestore();

var email = "";

const duplicator = document.getElementById("duplicator");
const filters = document.getElementById("filters");

function renderPage() {
  firestore.collection("Restaurants").get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var data = doc.data();
      var div = document.createElement('div');
      div.innerHTML = '<br><br><h1>' + data.RestaurantName + '</h1>' +
        '<h1>' + data.RestaurantAddress + '</h1>' +
        '<button name="' + data.RestaurantName + '" id="' + doc.id + '" type="submit" class="button_2" style="margin:5px;">View Restaurant</button>';
      duplicator.appendChild(div);
    });
    // eventListeners();
  }).catch(function (error) {
    console.log("Error getting documents: " + error);
  });
}

function renderFilters() {

  firestore.doc("Tags/Tags").get().then(function(doc) {

    var data = doc.data();
    var allTags = data.Tags;
    var tags = allTags.split(", ");

    var filterHTML = "";
    for(var i=0; i<tags.length; i++) {
      var option = document.createElement('option');
      filterHTML = filterHTML + '<option value=' + tags[i] + '>' + tags[i] + '</option>'
    }

    filters.innerHTML = filterHTML;

  }).catch(function(error) {
    console.log("Error getting Tags document: " + error);
  });

}

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

      renderPage();
      renderFilters();
    
    } else {
      // No user is signed in. Redirect them to the homepage.
      console.log("No user is signed in, redirecting...");
      window.location.replace("homepage.html");
    }
});