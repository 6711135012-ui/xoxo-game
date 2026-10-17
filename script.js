<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDD9SoBQwLlcVYgVHArjDauk_jNijZ0gOI",
    authDomain: "xoxo-battle-eccbc.firebaseapp.com",
    projectId: "xoxo-battle-eccbc",
    storageBucket: "xoxo-battle-eccbc.firebasestorage.app",
    messagingSenderId: "960030009765",
    appId: "1:960030009765:web:902d6613a17279c78a204c",
    measurementId: "G-EG48Y4TWS2"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>