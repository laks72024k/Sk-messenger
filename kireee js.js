// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");
const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");

let user = null;

// Google Sign-in
loginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(result => {
        user = result.user;
        showChat();
    });
});

// Logout
logoutBtn.addEventListener("click", () => {
    auth.signOut().then(() => {
        user = null;
        showLogin();
    });
});

// Display Messages
function loadMessages() {
    db.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
        messagesDiv.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const msgElement = document.createElement("p");
            msgElement.innerHTML = `<strong>${data.sender}:</strong> ${data.text}`;
            messagesDiv.appendChild(msgElement);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Send Message
sendBtn.addEventListener("click", () => {
    if (messageInput.value.trim() !== "" && user) {
        db.collection("messages").add({
            text: messageInput.value,
            sender: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        messageInput.value = "";
    }
});

// Check User State
auth.onAuthStateChanged(currentUser => {
    if (currentUser) {
        user = currentUser;
        showChat();
    } else {
        showLogin();
    }
});

function showChat() {
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
    loadMessages();
}

function showLogin() {
    loginDiv.style.display = "block";
    chatDiv.style.display = "none";
}


