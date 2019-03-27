//Initialize Firestore
firestore = firebase.firestore();

const submitButton = document.getElementById("Sbutton");
const menuName = document.getElementById("menuName");
const errorHeader = document.getElementById("errorHeader");

errorHeader.style.visibility = "hidden";

var name = "";
var vars = [];
getUrlVars();


function renderPage() {

    firestore.collection("Restaurants").doc(vars['restaurant_id'] + "/Menus/" + vars['menu_id']).get().then(function (doc) {
        if (doc.exists) {

            var docData = doc.data();
            menuName.defaultValue = docData.MenuName;
        } else console.log("The menu document does not exist.");

    }).catch(function (error) {

        console.log("The menu document does not exist.");
        console.log(error);

    });

}



submitButton.addEventListener("click", e => {

    name = menuName.value;
    errorHeader.innerText = "";
    // console.log(checkMenuName());

    if (name == "") {
        errorHeader.innerText = "Please enter a Menu Name."
        errorHeader.style.visibility = "visible";
        console.log("The 'menuName' field was left empty.");
        return;
    }

    if (vars[1] == "menu_id") {
        firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).set({
            "MenuName": name
        }).then(function () {
            console.log("Document successfully Updated.");
            //this is a problem because previous doc name stays the same.
            //either get data and set as new doc, or use unique id instead of menuName 
            window.location.replace("menu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + name.replace(/[^a-zA-Z]/g, ""));
        }).catch(function (error) {
            console.log("Error writing document: " + error + ".");
        });


    } else {
        firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + name).set({
            "MenuName": name,
            "ParentRestaurant": vars['restaurant_id']
        }).then(function () {
            console.log("Document successfully written.");
            window.location.replace("menu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + name);
        }).catch(function (error) {
            console.log("Error writing document: " + error + ".");
        });

    }//end if

});


//example duplicating doc for rename

// get the data from 'name@xxx.com'
// firestore.collection("users").doc("name@xxx.com").get().then(function (doc) {
//     if (doc && doc.exists) {
//         var data = doc.data();
//         // saves the data to 'name'
//         firestore.collection("users").doc("name").set(data).then({
//             // deletes the old document
//             firestore.collection("users").doc("name@xxx.com").delete();
//         });
//     }
// });


function getUrlVars() {
    var hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// function checkMenuName() {

// }//end checkmenu

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        email = user.email;
        console.log("The currently logged in user is: " + email + ".");
        getUrlVars();
        if (vars[1] == "menu_id") renderPage();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
    }
});