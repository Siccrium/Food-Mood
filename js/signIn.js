// Initialize Firebase & Firestore.
firebase = app_fireBase;
firestore = firebase.firestore();

firebase.auth().signOut();

//Create HTML References.
const textEmail = document.getElementById('textEmail');
const textPassword = document.getElementById('textPassword');
const btnSignIn = document.getElementById('btnSignIn');
const errorHeader = document.getElementById('errorHeader');

//Since there is no initial error, the error message is initially hidden.
errorHeader.style.visibility = "hidden";

//Outside instantiation for scope issues.
var role = " ";

//Sign-In Event.
btnSignIn.addEventListener('click', e => {

    //Get Email and Password.
    var email = textEmail.value;
    var pass = textPassword.value;

    errorHeader.innerText = "";

    //ERROR: Not checking to see if account exists

    //Error Checking(Seeing if email field is empty, etc.)
    if(email == "") {
        errorHeader.innerText = "Please enter an email address."
        errorHeader.style.visibility = "visible";
        console.log("The 'email' field was left empty.");
        return;
    } else if(pass == "") {
        errorHeader.innerText = "Please enter a password."
        errorHeader.style.visibility = "visible";
        console.log("The 'password' field was left empty.");
        return;
    }

    //Sign In
    firebase.auth().signInWithEmailAndPassword(email, pass);

    //Accesses users document & sets the appropriate value for role
    var docRef = firestore.collection("Users").doc(email);
    docRef.get().then(function(doc) {
        if(doc && doc.exists){
            var docData = doc.data();
            role = docData.UserRole;
        } else console.log("The users document does not exist.");
    });

});

firebase.auth().onAuthStateChanged(function(user) {
    
    //User is signed in.
    if (user) {
        //Redirect user to the dashboard for their role.
        if(role === "Customer") window.location.replace("customer.html");
        else if (role === "Manager") window.location.replace("manager.html");
        else if (role === "Deliverer") window.location.replace("deliverer.html");
        else console.log("The value of role is not an accepted value: " + role);
    }

});