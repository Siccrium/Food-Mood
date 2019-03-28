//Initialize Firestore
firestore = firebase.firestore();

const submitButton = document.getElementById("Sbutton");
const menuName = document.getElementById("menuName");
const errorHeader = document.getElementById("errorHeader");

errorHeader.style.visibility = "hidden";

var name = "";
var vars = [];
getUrlVars();


//this function only runs after the user is authenticated
//AND there is a menu_id in the url
//which means they must be trying to edit, not create.
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
        //restaurant exists, update with this info then redirect // you got here by clicking edit information
        firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).update({
            "MenuName": name,
        }).then(function () {
            console.log("Document successfully Updated.");
            window.location.replace("menu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + vars['menu_id']);
        }).catch(function (error) {
            console.log("Error writing document: " + error + ".");
        });
    } else {
        //in order of code below
        //restaurant does not exist // you got here by clicking add menu
        //get docReference of next doc (newMenuRef).This contains firestore info of doc including the unique .id
        //save text field info as parameters for menu
        //create new menu doc using the newMenuRef and give it menuInfo
        //Redirect to new url
        var newMenuRef = firestore.collection("Restaurants").doc(vars['restaurant_id']).collection("Menus").doc();
        var menuInfo = { "MenuName": name, "ParentRestaurant": vars['restaurant_id'] };
        newMenuRef.set(menuInfo).then(function () {
            console.log("Document successfully written.");
            window.location.replace("menu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + newMenuRef.id);
        }).catch(function (error) {
            console.log("Error writing document: " + error + ".");
        });
    }//end if
});//end submit button Event Listener


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
//still need this?
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