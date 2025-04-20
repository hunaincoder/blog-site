import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDnFLDWPjlPIX7dlR7Qr3DBA5gUIsKcFw",
  authDomain: "fir-7d5b0.firebaseapp.com",
  projectId: "fir-7d5b0",
  storageBucket: "fir-7d5b0.firebasestorage.app",
  messagingSenderId: "751416229900",
  appId: "1:751416229900:web:e0db13742e82447af66e29",
};

const blog = document.getElementById("blog");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const blogCollectionRef = collection(db, "blogs");

function getID() {
  const url = location.href;
  const id = url.split("#")[1];
  return id;
}

const fetchData = async () => {
  try {
    const id = getID();
    if (!id) throw new Error("No document ID found in URL");

    const docRef = doc(blogCollectionRef, id);
    const data = await getDoc(docRef);

    if (!data.exists()) {
      throw new Error("Document not found");
    }

    return data.data();
  } catch (e) {
    console.error("Error fetching document:", e);
    alert("Error loading blog post");
    return null;
  }
};

function createCard(cardDetail) {
  const {
    title = "Untitled",
    description = "No content",
    author = "Unknown author",
    publishedAt = new Date().toISOString(),
  } = cardDetail;

  const card = `<div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
    <h5>${author}</h5>
    <span>${new Date(publishedAt).toLocaleString()}</span>
    </div>`;
  return card;
}
async function showData() {
  const data = await fetchData();
  const card = createCard(data);
  blog.innerHTML = card;
}

document.addEventListener("DOMContentLoaded", showData);
