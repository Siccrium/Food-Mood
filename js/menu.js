//Initialize Firestore
firestore = firebase.firestore();

var email = "";
var vars = [];
var refs = [];

const menuName = document.getElementById("menuName");
const editButton = document.getElementById("editButton");
const deleteButton = document.getElementById("delete");
const restPage = document.getElementById("restPage");
const foodDuplicator = document.getElementById('foodDuplicator');
const addFoodButton = document.getElementById("addFoodButton");
const FoodName = document.getElementById("FoodName");
const FoodPrice = document.getElementById("FoodPrice");
const accDashboard = document.getElementById("accDashboard");
const menuHeader = document.getElementById("menuHeader");
const bottom1 = document.getElementById("bottom1");
const bottom2 = document.getElementById("bottom2");
const bottom3 = document.getElementById("bottom3");
const cartCounter = document.getElementById("cartCounter");
const cartButton = document.getElementById("cartButton");
const modalBody = document.getElementById("modalBody");
var clickedOnce = false; //this boolean is essential to correct cart functionality dont delete
getUrlVars();



function managerPage() {

    menuHeader.innerHTML = "Food Items In Your Menu";
    firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).get().then(function (doc) {
        if (doc && doc.exists) {
            var data = doc.data();
            menuName.innerText = data.MenuName;
            //create divs for showing food items
            firestore.collection("Restaurants").doc(vars['restaurant_id']).collection("Menus").doc(vars['menu_id']).collection("Food").get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var data = doc.data();
                    console.log(data);
                    var div = document.createElement('div');
                    div.innerHTML = '<p>' + data.FoodName + ' - $' + data.FoodPrice + '</p>' +
                        '<button id="' + doc.id + '" type="submit" class="btn btn-success">Add To Cart</button><div class="popup"><span class="popuptext" id="popup' + doc.id + '">Item Added To Cart</span></div></div>';
                    div.className = 'card card-body float-right font-weight-bold';
                    foodDuplicator.appendChild(div);
                    //handle addToCart button later for customer view
                });
            }).catch(function (error) {
                console.log("Error getting documents: " + error);
            });
            //end foodDuplicator div
        } else
            console.log("The menu document doesn't exist");
        console.log(vars);
    });

    editButton.addEventListener("click", e => {
        window.location.replace("editMenu.html?restaurant_id=" + vars['restaurant_id'] + "&menu_id=" + vars['menu_id']);
    });

    deleteButton.addEventListener("click", e => {

        firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).delete().then(function () {
            console.log("Document successfully deleted!");
            window.location.replace("restaurant.html?restaurant_id=" + vars['restaurant_id']);
        }).catch(function (error) {
            console.log("Error deleting document: " + error);
        });

    });
    accDashboard.href = "manager.html";

}

function customerPage() {

    editButton.parentNode.removeChild(editButton);
    deleteButton.parentNode.removeChild(deleteButton);
    accDashboard.href = "customer.html";
    menuHeader.innerHTML = "Start Your Order";
    bottom1.innerHTML = "1. need new text here for customer";
    bottom2.innerHTML = "2. need new text here for customer";
    bottom3.innerHTML = "3. need new text here for customer";
    var cartCount = 0;
    var quantityCount = 0;

    //get cart count and put correct number next to cart button
    firestore.collection("Users/" + email + "/cart").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            docData = doc.data();
            quantityCount += (docData.Quantity);
            cartCount = quantityCount;
        });//end foreach
        if (cartCount == 0) {
            //do nothing
        } else {
            cartCounter.innerText = cartCount;
        }
    });//end get.then


    cartButton.addEventListener("click", e => {
        while (modalBody.firstChild) {
            modalBody.removeChild(modalBody.firstChild);
        }
        fillCart();
    })

    firestore.doc("Restaurants/" + vars['restaurant_id'] + "/Menus/" + vars['menu_id']).get().then(function (doc) {
        if (doc && doc.exists) {
            var data = doc.data();
            menuName.innerText = data.MenuName;
            //create divs for showing food items
            firestore.collection("Restaurants").doc(vars['restaurant_id']).collection("Menus").doc(vars['menu_id']).collection("Food").get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var data = doc.data();
                    console.log(data);
                    var div = document.createElement('div');
                    div.innerHTML = '<div"><p>' + data.FoodName + ' - $' + data.FoodPrice + '</p>' +
                        '<button id="' + doc.id + '" type="submit" class="btn btn-success">Add To Cart</button><div class="popup"><span class="popuptext" id="popup' + doc.id + '">Item Added To Cart</span></div></div>';
                    div.className = 'card card-body float-right font-weight-bold';
                    foodDuplicator.appendChild(div);
                });//end forEach
                //issues with listener.. get all food again and set listeners
                firestore.collection("Restaurants").doc(vars['restaurant_id']).collection("Menus").doc(vars['menu_id']).collection("Food").get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        var data = doc.data();
                        console.log(data);
                        handleAddToCart(doc.id, data.FoodName, data.FoodPrice);
                    });
                }).catch(function (error) {
                    console.log("Error getting documents: " + error);
                });//end second .get.then.forEach.catch

            }).catch(function (error) {
                console.log("Error getting documents: " + error);
            });
            //end foodDuplicator div
        } else
            console.log("The menu document doesn't exist");
        console.log(vars);
    });

}//end CustomerPage



function handleAddToCart(docId, FoodName, FoodPrice) {
    var addToCartButton = document.getElementById(docId);
    var popup = document.getElementById("popup" + docId);
    var intPrice = parseFloat(FoodPrice);
    addToCartButton.addEventListener("click", e => {
        console.log("clicked addtocart btn for " + docId);

        cartCount += 1;
        cartCounter.innerText = cartCount;

        //popup.. plz help me edit the location of which this pops up via popup.css
        popup.classList.add("show");
        setTimeout(function () {
            popup.classList.remove("show");
        }, 1950);

        //get all items in cart, gets food that exists if you are adding multiple
        //FoodName/FoodPrice/Quantity are set to the cart item, not the menu item, sorry that I used the same name
        var cartRef = firestore.collection("Users/" + email + "/cart");
        var query = cartRef.where("FoodName", "==", FoodName).get().then(querySnapshot => {
            if (querySnapshot.empty) {//that item isnt in cart yet
                console.log("that food item isnt in cart yet, lets add 1");
                var itemCount = 0;
                firestore.doc("Users/" + email + "/cart/" + FoodName).set({
                    FoodName: FoodName,
                    FoodPrice: intPrice,
                    Quantity: itemCount += 1,
                    TotalCost: intPrice
                }).then(function () {
                    console.log("cart item successfully written!");
                    fillCart();
                    var itemQuantity = document.getElementById("quantity" + docId);
                    itemQuantity.innerText = "Quantity: 1";
                }).catch(function (error) {
                    console.log("Error writing document: " + error);
                });

            } else {//cart has the item
                querySnapshot.forEach(function (doc) {
                    var data = doc.data();
                    console.log("found the same food you added to cart already in cart, get quantity and set it")
                    console.log(data);
                    var itemCount = data.Quantity;
                    firestore.doc("Users/" + email + "/cart/" + FoodName).update({
                        Quantity: itemCount += 1,
                        TotalCost: intPrice * (itemCount)
                    }).then(function () {
                        console.log("Document successfully updated!");
                    }).catch(function (error) {
                        console.log("Error updating document: " + error);
                    });
                    console.log("itemcount: " + itemCount);
                });//end foreach
            }//end if

        }).catch(err => {
            console.log('Error getting document', err);
        });



    });//end addtocartButton listener
}//end handleAddToCart

restPage.addEventListener("click", e => {
    window.location.replace("restaurant.html?restaurant_id=" + vars['restaurant_id']);
});

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

//cart modal functions, sorry for confusion.
///////////////////////////////////////////
var total = 0;
var cartCount = 0;
var itemTotal = 0;
var listNumber = 0;
function fillCart() {

    firestore.collection("Users/" + email + "/cart").get().then(function (querySnapshot) {


        querySnapshot.forEach(function (itemDoc) {
            docData = itemDoc.data();

            if (!clickedOnce) {
                cartCount += docData.Quantity;
                total += docData.TotalCost;
                listNumber += 1;
            } else {
                //nothing?
            }//end if
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
            modalBody.appendChild(div);
            handleQuantity(itemDoc.id, docData.FoodPrice, docData.Quantity);
        });//end foreach
        clickedOnce = true;
        if (cartCount == 0) {
            subtotal.innerText = "Your Cart Is Empty";
        } else {
            subtotal.innerText = " ";
            subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
        }
    });//end get.then
}//end fillCart

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
        cartCounter.innerText = cartCount;
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
        cartCounter.innerText = cartCount;
        updateCart(docId, itemTotal, quantity)
    });

    deleteAll.addEventListener("click", e => {
        console.log("deleting:" + docId);
        cartCount -= quantity;
        itemTotal = quantity * price;
        total -= itemTotal;
        subtotal.innerText = "Cart Subtotal (" + cartCount + " items): $" + total.toFixed(2) + "";
        cartCounter.innerText = cartCount;
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

checkout.addEventListener("click", e => {
    window.location.replace("orderCart.html");
})
//////////////////////////////////////////

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
                if (role === "Manager") managerPage();
                else if (role === "Customer") customerPage();
                else if (role === "Deliverer") return;
                else console.log("The value of role is not an accepted value: -" + role + ".");

            } else console.log("The users document does not exist.");

        });
    } else {
        // No user is signed in.
        console.log("No user is signed in");
    }
});