// Constantes de configuração
const firebaseConfig = {
    apiKey: "AIzaSyDVwz1xQ1oH8JmvDknHm0fi-fcQRwUE5Yk",
    authDomain: "chatweb-41c5f.firebaseapp.com",
    databaseURL: "https://chatweb-41c5f-default-rtdb.firebaseio.com",
    projectId: "chatweb-41c5f",
    storageBucket: "chatweb-41c5f.appspot.com",
    messagingSenderId: "998618184839",
    appId: "1:998618184839:web:9240774f382c9ac841cc22",
    measurementId: "G-81QSF6VCCM",
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializa o banco de dados
const db = firebase.database();



var listRef = db.ref(`/presence/`);
var userRef = listRef.push();

// Add ourselves to presence list when online.
var presenceRef = db.ref(`/.info/connected/`);
presenceRef.on("value", function(snap) {
  if (snap.val()) {
    // Remove ourselves when we disconnect.
    userRef.onDisconnect().remove();

    userRef.set({"status": true, "username": JSON.parse(localStorage.getItem("user_chat")).username});
  }
});

// Number of online users is the number of objects in the presence list.
listRef.on("value", function(snap) {
    document.querySelector(".users-online h2").innerText = `Usuários Conectados: (${snap.numChildren()})`;

    const users = snap.val();
    document.querySelector(".users-online ul").innerHTML = '';
    let i = 1;

    for(let user in users) {
        let username = users[user].username.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
            return a.toUpperCase();
        });

        const userBox = `<li><strong>${i++}. </strong>${username}</li>`;
    
        // append the message on the page
        document.querySelector(".users-online ul").innerHTML += userBox;
    }

    console.log("# of online users = " + snap.numChildren());
});  




let provider = new firebase.auth.GoogleAuthProvider();


document.getElementById("logout").addEventListener("click", LogoutUser);


function modifyContent() {
    let item = document.querySelector('#clicked');

    if(item.classList.contains("none")) {
        item.classList.remove("none");
        document.querySelector("#no-clicked").classList.add("none");
    }
}

function checkAuthState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "http://localhost/sistdist/index.html";
        }
    });
}

function LogoutUser() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            indexedDB.deleteDatabase("firebaseLocalStorageDb");
            localStorage.removeItem("user_chat");
        })
        .catch((e) => {
            console.log(e);
        });
}

checkAuthState();


// Envia uma mensagem
document.getElementById("form").addEventListener("submit", sendMessage);

// send message to db
function sendMessage(e) {
    e.preventDefault();

    // Pega os valores
    const timestamp = Date.now();
    const message = document.getElementById("mensagem").value;

    // clear the input box
    document.getElementById("mensagem").value = "";

    //auto scroll to bottom
    document
        .getElementById("messages")
        .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    const username = JSON.parse(localStorage.getItem("user_chat")).username;

    // Cria o banco e envia a mensagem
    db.ref("messages/" + timestamp).set({
        username,
        message,
        timestamp
    });
}


// Mostra as mensagens
const fetchChat = db.ref("messages/");

// check for new messages using the onChildAdded event listener
fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    const username = JSON.parse(localStorage.getItem("user_chat")).username;
    const date = new Date(messages.timestamp);
    const datePerson = date.getDate()+ "/"+ (date.getMonth()+1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    const message = 
        `
        <div class="message ${username === messages.username ? "my-message" : "from-message"}">
            <div class="content">${messages.message}</div>
            <div class="date">${datePerson}</div>
        </div>
        `;
    
        // append the message on the page
    document.getElementById("messages").innerHTML += message;

    var objDiv = document.querySelector("#messages");
    objDiv.scrollTop = objDiv.scrollHeight;
});