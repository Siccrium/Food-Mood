// Initialize Firebase.
var firebase = app_fireBase;

//Ensures the user is not signed in on the homepage.
firebase.auth().signOut();