import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBioo9hH5K4-vLfrEAJlu5fmW7FtbhYmmY",
  authDomain: "video-streaming-app-59520.firebaseapp.com",
  projectId: "video-streaming-app-59520",
  storageBucket: "video-streaming-app-59520.appspot.com",
  messagingSenderId: "724201458845",
  appId: "1:724201458845:web:a1a889c802f6a8d658d874"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBfLmc7JV9fjYQRTRmZnMQwb6UmztSOwo4",
//   authDomain: "video-temp.firebaseapp.com",
//   projectId: "video-temp",
//   storageBucket: "video-temp.appspot.com",
//   messagingSenderId: "548705395496",
//   appId: "1:548705395496:web:90ccd91d0dabe477bb661d"
// };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };