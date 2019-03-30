// Initialize Firestore
firestore = firebase.firestore();

firebase.auth().signOut();

//Create HTML References.
const textEmail = document.getElementById("textEmail");
const textPassword = document.getElementById("textPassword");
const confirmPassword = document.getElementById("confirmPassword");
const btnSignUp = document.getElementById("btnSignUp");
const radioRole = document.getElementsByName("role");
const errorHeader = document.getElementById("errorHeader");

//Since there is no initial error, the error message is initially hidden.
errorHeader.style.visibility = "hidden";

//Outside instantiation for scope issues.
var role = " ";
var email = "";

//Sign Up Event
btnSignUp.addEventListener("click", e => {
  //Get Email, Password & Role.
  email = textEmail.value.toLowerCase();
  var pass = textPassword.value;
  var confPass = confirmPassword.value;
  role = getRadioVal();

  errorHeader.innerText = "";

  //Error Checking(Seeing if email field is empty, etc.)
  if (email == "") {
    errorHeader.outerHTML = "<p>Please enter an email address.</p>";
    errorHeader.style.visibility = "visible";
    console.log("The 'email' field was left empty.");
    return;
  } else if (pass == "") {
    errorHeader.outerHTML = "<p>Please enter a password.</p>";
    errorHeader.style.visibility = "visible";
    console.log("The 'password' field was left empty.");
    return;
  } else if (confPass == "") {
    errorHeader.outerHTML = "<p>Please confirm your password.</p>";
    errorHeader.style.visibility = "visible";
    console.log("The 'confirm password' field was left empty.");
    return;
  } else if (pass != confPass) {
    errorHeader.outerHTML = "<p>The 2 passwords do not match.</p>";
    errorHeader.style.visibility = "visible";
    console.log("The passwords do not match");
    return;
  } else if (role == " ") {
    errorHeader.outerHTML = "<p>Please select a role.";
    errorHeader.style.visibility = "visible";
    console.log("No role was selected.");
    return;
  }

  //Sign Up
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, pass)
    .catch(function(error) {
      var errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        errorHeader.outerHTML =
          "<p>Email already has an account, please sign in</p>";
        errorHeader.style.visibility = "visible";
        console.log("The provided email is already being used.");
      } else if (errorCode === "auth/invalid-email") {
        errorHeader.outerHTML = "<p>The provided email is not valid.</p>";
        errorHeader.style.visibility = "visible";
        console.log("The provided email is not a valid format.");
      } else if (errorCode === "auth/weak-password") {
        errorHeader.outerHTML =
          "<p>The password provided is too weak, please choose another.</p>";
        errorHeader.style.visibility = "visible";
        console.log("The provided password is not strong enough.");
      }
    });
});

//Detecting Sign-In.
firebase.auth().onAuthStateChanged(function(user) {
  //User is signed in.
  if (user) {
    //Creates the users file in the database.
    firestore
      .collection("Users")
      .doc(email)
      .set({
        UserEmail: email,
        UserRole: role
      })
      .then(function() {
        console.log("Document successfully written!");

        //Redirect user to the dashboard for their role.
        if (role === "Customer") window.location.replace("customer.html");
        else if (role === "Manager") window.location.replace("manager.html");
        else if (role === "Deliverer")
          window.location.replace("deliverer.html");
        else
          console.log(
            "The value of role is not an accepted value: " + role + "."
          );
      })
      .catch(function(error) {
        console.log("Error writing document: " + error);
      });
  }
});

//Iterates over the "Role" radio buttons and returns the value of the selected radio button.
function getRadioVal() {
  var val = " ";
  for (var i = 0, len = radioRole.length; i < len; i++) {
    if (radioRole[i].checked) {
      val = radioRole[i].value;
      break;
    }
  }
  return val;
}
