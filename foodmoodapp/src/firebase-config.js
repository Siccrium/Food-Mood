import firebase from 'firebase'

      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyDJ9Qjm2hsgpK1EQfQQCLvkMiHvmtSKKcs",
        authDomain: "foodmoodexperimental.firebaseapp.com",
        databaseURL: "https://foodmoodexperimental.firebaseio.com",
        projectId: "foodmoodexperimental",
        storageBucket: "foodmoodexperimental.appspot.com",
        messagingSenderId: "617751472305"
      };

      export default config;

      firebase.initializeApp(config);