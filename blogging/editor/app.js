import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

//#1 blog and save button
const saveDataBtn = document.getElementById("save-data");
const blog = document.getElementById("blog");
const fileInput = document.getElementById("file");
const logoutBTn = document.getElementById("logout-btn");

let authorId = "";

let editFlag = false;

//#2 configs and references
const firebaseConfig = {
  apiKey: "AIzaSyDDnFLDWPjlPIX7dlR7Qr3DBA5gUIsKcFw",
  authDomain: "fir-7d5b0.firebaseapp.com",
  projectId: "fir-7d5b0",
  storageBucket: "fir-7d5b0.firebasestorage.app",
  messagingSenderId: "751416229900",
  appId: "1:751416229900:web:e0db13742e82447af66e29",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const blogCollectionRef = collection(db, "blogs");
let activeBlog = null;

// Save Data
const saveData = async () => {
  // add logic
  if (!editFlag) {
    try {
      // add hnga data
      const title = document.querySelector("#title").value;
      const description = document.querySelector("#description").value;
      const author = document.querySelector("#author").value;
      const currentDate = new Date();
      const payload = {
        title,
        description,
        author,
        authorId,
        publishedAt: currentDate.toISOString(),
      };
      await addDoc(blogCollectionRef, payload);
      console.log("Document successfully written!");
      await showData();
    } catch (error) {
      console.error("Error writing document: ", error);
      alert("Error: " + error.message);
    }
  }

  // update logic
  if (editFlag) {
    const docRef = doc(blogCollectionRef, activeBlog);
    // update hnga data
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const author = document.querySelector("#author").value;
    const currentDate = new Date();
    const payload = {
      title,
      description,
      author,
      authorId,
      updatedAt: currentDate.toISOString(),
    };
    await updateDoc(docRef, payload);
    await showData();
  }

  editFlag = false;
};
saveDataBtn.addEventListener("click", saveData);

// Fetch and Show data
const fetchData = async () => {
  try {
    const queryRef = query(
      blogCollectionRef,
      where("authorId", "==", authorId)
    );

    const data = await getDocs(queryRef);
    return data;
  } catch (e) {
    console.log(e);
  }
};
function createCard(cardDetail, id) {
  const {  title, description, author, publishedAt } = cardDetail;
  const descriptionLimit = 50;
  const card = `<div class="card">
    <h2>${title}</h2>
    <p>${description.slice(0, descriptionLimit)}...</p>
    <h5>${author}</h5>
    <span>${new Date(publishedAt).toLocaleString()}</span>
    <a href="detail#${id}">Read More</a>
    <button onclick='onDelete("${id}")'>Delete</button>
    <button onclick='onUpdate("${id}")'>Edit</button>
    </div>`;
  return card;
}
async function showData() {
  blog.innerHTML = "";
  const data = await fetchData();
  data.forEach((doc) => {
    const parsedData = doc.data();
    const card = createCard(parsedData, doc.id);
    // if(parsedData.authorId === authorId){
    blog.innerHTML += card;
    // }
  });
}

// Delete Data
const deleteBlog = async (id) => {
  try {
    const confirmationRes = confirm("Are You Sure, You want to delete.");
    if (!confirmationRes) return;
    if (confirmationRes) {
      const docRef = doc(blogCollectionRef, id);
      await deleteDoc(docRef);
      updateDoc({ isDeleted: true });
      alert("Deleted Successfully");
      await showData();
    }
  } catch (e) {
    alert("Internal Server Error");
    console.log(e);
  }
};

window.onDelete = deleteBlog;

// Update Data
const updateBlog = async (id) => {
  editFlag = true;
  activeBlog = id;
};
window.onUpdate = updateBlog;

const auth = getAuth(app);

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Error signing out: " + error.message);
  }
};

logoutBTn?.addEventListener("click", logout);

onAuthStateChanged(auth, (user) => {
  // user = {} // login
  // user = null //logout
  if (user) {
    authorId = user.uid;
    showData();
  } else {
    authorId = "";
    location.href = "/auth/sign-in.html";
  }
});

// const URL = "https://zagvctmmngsowcqyhbin.supabase.co";
// const ANON_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZ3ZjdG1tbmdzb3djcXloYmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTUyMDEsImV4cCI6MjA2MDEzMTIwMX0.jLUeVNn2WkqmgzwjDWLXNzzycYqSp-1nQusFaLGlHas";

// const sbClient = supabase.createClient(URL, ANON_KEY);

// async function onFileChange(e) {
//   const file = e.target.files[0];
//   console.log(file, "File Changed");
//   const res = await sbClient.storage
//     .from("smit")
//     .upload("public/abc.png", file);
//   console.log(res, "===res");
// }

// fileInput.addEventListener("change", onFileChange);
