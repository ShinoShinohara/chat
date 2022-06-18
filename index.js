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

// initialize database
const db = firebase.database();

// get user's data
const username = prompt("Please Tell Us Your Name");

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
