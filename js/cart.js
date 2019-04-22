firestore = firebase.firestore();

var email = "";

const itemSummary = document.getElementById("itemSummary");
const subtotal = document.getElementById("subtotal");

var total = 0;
var cartCount = 0;
var listNumber = 0;
var itemTotal = 0;

function showItems() {

    firestore.collection("Users/" + email + "/cart").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (itemDoc) {
            docData = itemDoc.data();
            cartCount += docData.Quantity;
            temp = docData.TotalCost;
            total += temp;
            listNumber += 1;
            console.log("cartCount: " + cartCount);
            console.log("total: " + total.toFixed(2));
            console.log("docquantity: " + docData.Quantity)
            var div = document.createElement('div');
            div.innerHTML = '<br><div id="' + itemDoc.id + 'Div">' +
                '<p>' + listNumber + '. ' +
                docData.FoodName + ' - $' + docData.FoodPrice +
                '<p id="quantity' + itemDoc.id + '">' +
                'Quantity: ' + docData.Quantity + '  ' +
                '</p>' +
                '<span><button id="takeOne' + itemDoc.id + '" type="button" class="btn btn-info">-</button>' + ' ' +
                '<button id="addOne' + itemDoc.id + '" type="button" class="btn btn-info">+</button>' + ' ' +
                '<button id="delete' + itemDoc.id + '" type="button" class="btn btn-danger">Remove</button></span>' +
                '</p>' +
                '</div>';
            itemSummary.appendChild(div);
            handleQuantity(itemDoc.id, docData.FoodPrice, docData.Quantity);
        });//end foreach
        if (cartCount == 0) {
            subtotal.innerText = "Your Cart Is Empty";
        } else {
            subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
        }
    });//end get.then
}//end showItems

function handleQuantity(docId, price, quantity) {

    var addOne = document.getElementById("addOne" + docId);
    var takeOne = document.getElementById("takeOne" + docId);
    var deleteAll = document.getElementById("delete" + docId);
    var quantityNumber = document.getElementById("quantity" + docId);

    addOne.addEventListener("click", e => {
        console.log("addOne" + docId);
        cartCount++;
        total += price;
        quantity += 1;
        itemTotal = quantity * price;
        subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
        quantityNumber.innerText = "Quantity: " + quantity + "";
        console.log("newindvPrice: " + itemTotal);
        updateCart(docId, itemTotal, quantity)
    });

    takeOne.addEventListener("click", e => {
        console.log("takeOne" + docId);
        cartCount--;
        total -= price;
        quantity -= 1;
        itemTotal = quantity * price;
        subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
        quantityNumber.innerText = "Quantity: " + quantity + "";
        console.log("newindvPrice: " + itemTotal);
        updateCart(docId, itemTotal, quantity)
    });

    deleteAll.addEventListener("click", e => {
        console.log("deleting:" + docId);
        cartCount -= quantity;
        itemTotal = quantity * price;
        total -= itemTotal;
        subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";

        deleteItem(docId);
    });

}//end handleQuantity

function updateCart(foodId, newTotal, newQuantity) {
    firestore.doc("Users/" + email + "/cart/" + foodId).update(
        {
            "Quantity": newQuantity,
            "TotalCost": newTotal
        }).then(function () {
            console.log("Food successfully Updated.");
        }).catch(function (error) {
            console.log("Error writing Food: " + error + ".");
        });
}//end updateFood

function deleteItem(foodId) {
    var itemDiv = document.getElementById(foodId + "Div")
    itemDiv.parentNode.removeChild(itemDiv);
    firestore.doc("Users/" + email + "/cart/" + foodId).delete().then(function () {
        console.log("Food successfully deleted!");

    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}//end deleteItem

//errorHeader.innerText = "Update In Progress! Please Wait..."
//errorHeader.style.visibility = "visible";

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log("The currently logged in user is: " + user.email + ".");
        email = user.email;

        firestore.doc("/Users/" + email).get().then(function (doc) {

            if (doc.exists) {

                var docData = doc.data();
                var role = docData.UserRole;

                //Redirect user to the dashboard for their role.
                if (role === "Manager") window.location.replace("manager.html");
                else if (role === "Customer") showItems();
                else if (role === "Deliverer") return;
                else console.log("The value of role is not an accepted value: -" + role + ".");

            } else console.log("The users document does not exist.");

        });
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.replace("homepage.html")
    }
});