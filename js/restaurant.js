//Initialize Firestore
firestore = firebase.firestore();

var email = "";

function renderPage() {
    //Create HTML References.
    const restName = document.getElementById("restName");
    const restAddress = document.getElementById("restAddress");
    const restCity = document.getElementById("restCity");
    const restState = document.getElementById("restState");
    const restZip = document.getElementById("restZip");
    const restPhoneNumber = document.getElementById("restPhoneNumber");
    var Sbutton = document.getElementById("Sbutton");

    firestore.collection("Restaurants").doc(email).get().then(function(doc) {
        if(doc.exists){
                
            var docData = doc.data();
            restName.innerText = docData.RestaurantName;
            restAddress.innerText = docData.RestaurantAddress;
            restCity.innerText = docData.RestaurantCity;
            restState.innerText = docData.RestaurantState;
            restZip.innerText = docData.RestaurantZip;
            restPhoneNumber.innerText = docData.RestaurantPhoneNumber;

        } else console.log("The restaurant document does not exist.");
        
    })

}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log("The currently logged in user is: " + user.email + ".");
      email = user.email;
        renderPage();
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
});