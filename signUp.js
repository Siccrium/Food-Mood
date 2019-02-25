(function() {

    // Initialize Firebase
    firebase = app_fireBase;

    const textEmail = document.getElementById('textEmail');
    const textPassword = document.getElementById('textPassword');
    const btnSignUp = document.getElementById('btnSignUp');

    //Add Sign Up Event
    btnSignUp.addEventListener('click', e => {

        //Get Email and Password
        const email = textEmail.value;
        const pass = textPassword.value;

        //Sign Up
        firebase.auth().createUserWithEmailAndPassword(email, pass);

    });

    firebase.auth().onAuthStateChanged(function(user) {
        
        if (user) {
          // User is signed in.
           window.location.replace("dashboard.html");
        }

    });

}());