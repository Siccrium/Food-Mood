    // Initialize Firebase
    var firebase = app_fireBase;

    const textEmail = document.getElementById('textEmail');
    const textPassword = document.getElementById('textPassword');
    const btnSignIn = document.getElementById('btnSignIn');

    //Add Sign In Event
    btnSignIn.addEventListener('click', e => {

        //Get Email and Password
        const email = textEmail.value;
        const pass = textPassword.value;

        //Sign In
        firebase.auth().signInWithEmailAndPassword(email, pass);

    });

    firebase.auth().onAuthStateChanged(function(user) {
        
        if (user) {
          // User is signed in.
           window.location.replace("dashboard.html");
        }

    });