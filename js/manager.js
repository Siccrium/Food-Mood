//Initialize Firestore
firestore = firebase.firestore();

var email = "";

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log(user);
      console.log(user.email);
      email = user.email;
      console.log(email);
    
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
});

console.log("Hello");
console.log(email);

//Create HTML References
const duplicator = document.getElementById('duplicator');

console.log("Users Email: " + email + ".");

// firestore.collection("Restaurant").where("Restaurant Manager", "==", user.email).get().then(function(querySnapshot) {
//     querySnapshot.forEach(function(doc) {
//         console.log(doc.id, " => ", doc.data());
//     });
// }).catch(function(error) {
//     console.log("Error getting documents: " + error);
// });

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log(user);
      console.log(user.email);
      email = user.email;
      console.log(email);
    
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
});