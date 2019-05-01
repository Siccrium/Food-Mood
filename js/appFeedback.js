//Initialize Firestore
firestore = firebase.firestore();

const description = document.getElementById("form10");
const image = document.getElementById("blah");
const submitFeedback = document.getElementById("feedbackSubmit");
const ratingRadio = document.getElementsByName("rating");
const typeRadio = document.getElementsByName("typeRadio");

// document.getElementsByName("rating").forEach(function (elm) {
//   if (elm.checked) {
//     ratingRadio = elm.value;
//   }
// });

// document.getElementsByName("inlineMaterialRadiosExample").forEach(function (elm1) {
//   if (elm1.checked) {
//     ratingRadio = elm1.value;
//   }
// });

var email = "";
var type = "";

submitFeedback.addEventListener("click", e => {
  writeFeedback();
});

function writeFeedback() {

  var feedbackDescription = description.value;
  var feedbackImage = image.src;
  var rating = getRating();

  console.log("description: " + feedbackDescription);
  console.log("image: " + feedbackImage);
  console.log("rating: " + rating);
  console.log("feedbackType: " + type);

  // firestore.doc("Users/"+email+"/feedback/").set({
  //   UserDescription: feedbackDescription,
  //   UserImage:feedbackImage,
  //   UserRating:rating,
  //   UserType:type
  // }).then(function () {
  //   console.log("Feedback successfully written!");
  // }).catch(function (error) {
  //     console.log("Error writing document: " + error);
  //   });
}

function giveType(feedbackType) {//sets type when clicking a radio button. called from html
  type = feedbackType;
}

function getRating() {
  var rating = 0;
  var i = 0;

  while (!ratingRadio[i].checked) {
    i++;
  }//end while radio !checked

  rating = ratingRadio[i].value;
  return rating;

}//end getRating



firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    email = user.email;
    console.log("The currently logged in user is: " + email + ".");

    //Check to see if this user is a customer. If not, redirect them to their dashboard.
    firestore.doc("Users/" + email).get().then(function (doc) {

      if (doc.exists) {
        //you good fam nothin to do here
        var docData = doc.data();

      } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.replace = "homepage.html";
      }//end if doc.exists
    });//end user get then

  } else {
    console.log("user isn't signed in")
    window.location.replace("homepage.html");
  }//end if user
});//end firebase auth
