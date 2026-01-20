import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD7WK3iphv_B9M0R8qKh44rrC7rRZ-SLA0",
    authDomain: "campdejourstubalde.firebaseapp.com",
    projectId: "campdejourstubalde",
    storageBucket: "campdejourstubalde.firebasestorage.app",
    messagingSenderId: "964886888239",
    appId: "1:964886888239:web:816b4e3e3fe87108fb6bda",
    measurementId: "G-W2MSVTR7VD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, analytics, storage };
