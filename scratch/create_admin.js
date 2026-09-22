import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXJ2ezJMtsXFqcgEmPQ2XyXnXloprC7Dg",
  authDomain: "knite-web.firebaseapp.com",
  projectId: "knite-web",
  storageBucket: "knite-web.firebasestorage.app",
  messagingSenderId: "383481390906",
  appId: "1:383481390906:web:b0d57f18e982ff7cead203"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "kniteinfotech@gmail.com";
const password = "kniteadmin123";

console.log("Attempting to create admin user...");

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("Successfully created admin user!");
    console.log("Email:", userCredential.user.email);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error creating user:", error.message);
    process.exit(1);
  });
