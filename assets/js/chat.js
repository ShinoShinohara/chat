// Constantes de configuração
var firebaseConfig = {
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
firebase.initializeApp(firebaseConfig);

// Inicializa o banco de dados
const db = firebase.database();

let provider = new firebase.auth.GoogleAuthProvider();

document.getElementById("logout").addEventListener("click", LogoutUser);


function checkAuthState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "index.html";
        } else {
            const dados = JSON.parse(window.sessionStorage.getItem("user_chat"));
            console.log(dados);
            document.getElementById('avatar').innerHTML = `
          <img src="${user.photoURL}" style="width: 150px;
            height: 150px;
            border-radius: 50%;
            display: block;
            margin-left: auto;
            margin-right: auto;
            border: 2px solid rgb(33, 33, 33);">`;
            document.getElementById('name').innerHTML = `<p>${user.displayName} !</p> `;
        }
    });
}

function LogoutUser() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            window.indexedDB.deleteDatabase("firebaseLocalStorageDb");
            window.sessionStorage.removeItem("user_chat");
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

    const username = JSON.parse(sessionStorage.getItem("user_chat")).username;

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
    const username = JSON.parse(sessionStorage.getItem("user_chat")).username;
    const date = new Date(messages.timestamp);
    const datePerson = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    const message =
        `
        <div class="message ${username === messages.username ? "my-message" : "from-message"}">
        <div class="username">${messages.username}</div>
            <div class="content">${messages.message}</div>
            <div class="date">${datePerson}</div>
        </div>
        `;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;
});

