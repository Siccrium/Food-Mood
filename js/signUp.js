// Initialize Firebase
firebase = app_fireBase;
firestore = firebase.firestore();

firebase.auth().signOut();

//Create HTML References.
const textEmail = document.getElementById('textEmail');
const textPassword = document.getElementById('textPassword');
const confirmPassword = document.getElementById('confirmPassword');
const btnSignUp = document.getElementById('btnSignUp');
const radioRole = document.getElementsByName('role');
const errorHeader = document.getElementById('errorHeader');

//Since there is no initial error, the error message is initially hidden.
errorHeader.style.visibility = "hidden";

//Outside instantiation for scope issues.
var role = " ";

//Sign Up Event
btnSignUp.addEventListener('click', e => {

    //Get Email, Password & Role.
    var email = textEmail.value;
    var pass = textPassword.value;
    var confPass = confirmPassword.value;
    role = getRadioVal();

    errorHeader.innerText = "";

    //ERROR: Check to see if email is already in use.

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
    } else if(confPass == "") {
        errorHeader.innerText = "Please confirm your password."
        errorHeader.style.visibility = "visible";
        console.log("The 'confirm password' field was left empty.");
        return;
    } else if(pass != confPass) {
        errorHeader.innerText = "The 2 passwords do not match."
        errorHeader.style.visibility = "visible";
        console.log("The passwords do not match");
        return;
    } else if(role == " ") {
        errorHeader.innerText = "Please select a role."
        errorHeader.style.visibility = "visible";
        console.log("No role was selected.");
        return;
    }

    //ERROR: Possible that document gets created w/o a Sign-Up.

    //Sign Up
    firebase.auth().createUserWithEmailAndPassword(email, pass);

    //Create the Users document in the Firestore Database.
    firestore.collection("Users").doc(email).set({
                    UserEmail: email,
                    UserRole: role
    }).then(function() {
        console.log("Document successfully written!");
    }).catch(function(error) {
        console.error("Error writing document: " + error);
    });

});

firebase.auth().onAuthStateChanged(function(user) {
       
    //User is signed in.
    if (user) {
        //Redirect user to the dashboard for their role.
        if(role === "Customer") window.location.replace("customer.html");
        else if (role === "Manager") window.location.replace("manager.html");
        else if (role === "Deliverer") window.location.replace("deliverer.html");
        else console.log("The value of role is not an accepted value: " + role + ".");
    }

});

//Iterates over the "Role" radio buttons and returns the value of the selected radio button.
function getRadioVal() {

    var val = " ";
    for(var i = 0, len = radioRole.length; i < len; i++) {
        if(radioRole[i].checked){
            val=radioRole[i].value;
            break;
        }
    }
    return val;

}