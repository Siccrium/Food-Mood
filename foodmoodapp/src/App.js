import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import config from './firebase-config'
import firebase from 'firebase'
import 'firebase/firestore'
import FileUploader from 'react-firebase-file-uploader'

firebase.initializeApp(config);

const db = firebase.firestore()

class App extends Component {
  render() {
    return (
      <div>
        <FileUploader />
      </div>
    );//end return
  }//end render
}//end component

export default App;
