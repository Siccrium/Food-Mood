    // Initialize Firebase
    firebase = app_fireBase;
    firestore = firebase.firestore();

    const textEmail = document.getElementById('textEmail');
    const textPassword = document.getElementById('textPassword');
    const btnSignIn = document.getElementById('btnSignIn');

    var docRef = " ";
    var role = " ";
    var email = " ";

    //Add Sign In Event
    btnSignIn.addEventListener('click', e => {

        //Get Email and Password
        email = textEmail.value;
        const pass = textPassword.value;

        //Sign In
        firebase.auth().signInWithEmailAndPassword(email, pass);

        docRef = firestore.collection("Users").doc(email);
        docRef.get().then(function(doc) {
            if(doc && doc.exists){
                var docData = doc.data();
                role = docData.UserRole;
            } else {
                console.log("This is also bad");
            }
          })

    });

    firebase.auth().onAuthStateChanged(function(user) {
        
        if (user) {
        //   User is signed in.
        
        if(role === "customer") { 
            window.location.replace("customer.html");
        } else if (role === "manager") {
            window.location.replace("Owner.html");
        } else if (role === "driver") { 
            window.location.replace("driver.html");
        } else {
            console.log("This is bad.");
            console.log(role);
        }
        }

    });