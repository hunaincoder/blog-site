import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const blog = document.getElementById("blog");

const firebaseConfig = {
  apiKey: "AIzaSyDDnFLDWPjlPIX7dlR7Qr3DBA5gUIsKcFw",
  authDomain: "fir-7d5b0.firebaseapp.com",
  projectId: "fir-7d5b0",
  storageBucket: "fir-7d5b0.firebasestorage.app",
  messagingSenderId: "751416229900",
  appId: "1:751416229900:web:e0db13742e82447af66e29",
};

const app = initializeApp(firebaseConfig);
const dbRef = getFirestore(app);
const blogCollectionRef = collection(dbRef, "blogs");

const fetchData = async () => {
  try {
    const data = await getDocs(blogCollectionRef);
    return data;
  } catch (e) {
    console.log(e);
  }
};
function createCard(cardDetail, id) {
  const { title, description, author, publishedAt } = cardDetail;
  const descriptionLimit = 50;
  const card = `<div class="card">
    <h2>${title}</h2>
    <p>${description.slice(0, descriptionLimit)}...</p>
    <h5>${author}</h5>
    <span>${new Date(publishedAt).toLocaleString()}</span>
    <a href="detail#${id}">Read More</a>
    </div>`;
  return card;
}
async function showData() {
  const data = await fetchData();
  data.forEach((doc) => {
    const parsedData = doc.data();
    const card = createCard(parsedData, doc.id);
    blog.innerHTML += card;
  });
}

showData();
