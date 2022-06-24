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


document.getElementById("login").addEventListener("click", GoogleLogin);


function GoogleLogin() {
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((res) => {
            checkAuthState();
      })
      .catch((e) => {
          console.log(e);
      });
}

function checkAuthState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const dados = {
                "username": user.displayName,
                "uid": user.uid
            }
            sessionStorage.setItem('user_chat', JSON.stringify(dados));
            window.location.href = "chat.html";
        }
    });
}

checkAuthState();