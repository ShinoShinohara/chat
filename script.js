// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDVwz1xQ1oH8JmvDknHm0fi-fcQRwUE5Yk",
  authDomain: "chatweb-41c5f.firebaseapp.com",
  databaseURL: "https://chatweb-41c5f-default-rtdb.firebaseio.com",
  projectId: "chatweb-41c5f",
  storageBucket: "chatweb-41c5f.appspot.com",
  messagingSenderId: "998618184839",
  appId: "1:998618184839:web:9240774f382c9ac841cc22",
  measurementId: "G-81QSF6VCCM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//username variable
var username;

// initialize database
const db = firebase.database();

// get user's data
// const username = prompt("Please Tell Us Your Name");

document.getElementById('dashboard').style.display = "none"

document.getElementById('login').addEventListener('click', GoogleLogin)
document.getElementById('logout').addEventListener('click', LogoutUser)

let provider = new firebase.auth.GoogleAuthProvider();

function GoogleLogin() {
  console.log('Login Btn Call')
  firebase.auth().signInWithPopup(provider).then(res => {
    console.log(res.user)
    document.getElementById('LoginScreen').style.display = "none"
    document.getElementById('dashboard').style.display = "block"
    showUserDetails(res.user)
  }).catch(e => {
    console.log(e)
  })
}

function showUserDetails(user) {
  document.getElementById('userDetails').innerHTML = `
          <img src="${user.photoURL}" style="width:10%">
          <p>Name: ${user.displayName}</p>
          <p>Email: ${user.email}</p>
        `
}

function checkAuthState() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      document.getElementById('LoginScreen').style.display = "none"
      document.getElementById('dashboard').style.display = "block"
      document.getElementById('chat').style.display = "block"
      username = user.displayName;
      showUserDetails(user)
    } else {
      document.getElementById('chat').style.display = "none"
    }
  })
}

function LogoutUser() {
  console.log('Logout Btn Call')
  firebase.auth().signOut().then(() => {
    document.getElementById('LoginScreen').style.display = "block"
    document.getElementById('dashboard').style.display = "none"
    document.getElementById('chat').style.display = "none"
  }).catch(e => {
    console.log(e)
  })
}

checkAuthState()

// submit form
// listen for submit event on the form and call the postChat function
document.getElementById("message-form").addEventListener("submit", sendMessage);

// send message to db
function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  db.ref("messages/" + timestamp).set({
    username,
    message,
  });
}

// display the messages
// reference the collection created earlier
const fetchChat = db.ref("messages/");

// check for new messages using the onChildAdded event listener
fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const message = `<li class=${username === messages.username ? "sent" : "receive"
    }><span>${messages.username}: </span>${messages.message}</li>`;
  // append the message on the page
  document.getElementById("messages").innerHTML += message;
});
