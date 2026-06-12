import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-ykErGZnLJD5VAY8F7CoRbzC_qohWuMA",
  authDomain: "sistema-medicoes-db.firebaseapp.com",
  projectId: "sistema-medicoes-db",
  storageBucket: "sistema-medicoes-db.firebasestorage.app",
  messagingSenderId: "482151465259",
  appId: "1:482151465259:web:ef939cc3ae9aa0e5f5056e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);