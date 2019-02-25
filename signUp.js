(function() {

    // Initialize Firebase
    firebase = app_fireBase;
    firestore = firebase.firestore();

    const textEmail = document.getElementById('textEmail');
    const textPassword = document.getElementById('textPassword');
    const btnSignUp = document.getElementById('btnSignUp');
    const radioRole = document.getElementsByName('role');

    var role = " ";
    var docRef = " ";

    //Add Sign Up Event
    btnSignUp.addEventListener('click', e => {

        //Get Email and Password
        var email = textEmail.value;
        const pass = textPassword.value;
        role = getRadioVal();

        //Sign Up
        firebase.auth().createUserWithEmailAndPassword(email, pass);
        firestore.collection("Users").doc(email).set({
                    UserEmail: email,
                    UserRole: role
                })
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
        
                docRef = firestore.collection("Users").doc(email);
    });

    firebase.auth().onAuthStateChanged(function(user) {
        
        if (user) {
          // User is signed in.
          docRef.get().then(function(doc) {
            if(doc && doc.exists){
                var docData = doc.data();
                role = docData.UserRole;
            }
          })
        
        if(role === "customer") { 
            window.location.replace("customer.html");
        } else if (role === "manager") {
            window.location.replace("Owner.html");
        } else if (role === "driver") { 
            window.location.replace("driver.html");
        } else {
            console.log("This is bad.");
        }
        }

    });

    function getRadioVal() {

        var val;
        //get list of radio buttons with specified name
        //loop through list of radio buttons
        for(var i=0, len=radioRole.length; i<len; i++) {
            if(radioRole[i].checked){
                val=radioRole[i].value;
                break;
            }
        }
        return val;
    }

}());