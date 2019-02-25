(function() {

    // Initialize Firebase
    var firebase = app_fireBase;

    const btnLogout = document.getElementById('btnLogout');

    //Add Logout Event
    btnLogout.addEventListener('click', function(){

        firebase.auth().signOut();

    });

    firebase.auth().onAuthStateChanged(function(user){
        
        if (user) {
          // User is signed in.
          
        } else {
            window.location.replace("homepage.html");
        }

    });

}());

