import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc,
  getDoc, addDoc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = { /* ... (sama dengan auth.js) */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load Komik di Beranda
async function loadSaranKomik() {
  const saranDiv = document.getElementById('saranKomik');
  const snapshot = await getDocs(collection(db, "komik"));
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `<img src="${data.coverURL}" alt="${data.judul}">
                      <p>${data.judul}</p>`;
    div.onclick = () => location.href = `detail.html?id=${doc.id}`;
    saranDiv.appendChild(div);
  });
}
if (document.getElementById('saranKomik')) loadSaranKomik();

// Load Detail Komik + Chapter
async function loadDetailKomik() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const docRef = doc(db, "komik", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById('komikDetail').innerHTML = `
      <img src="${data.coverURL}" alt="${data.judul}">
      <h2>${data.judul}</h2>
      <p>${data.deskripsi}</p>
      <p>Penulis: ${data.penulis}</p>`;
    loadChapterList(id);
  }
}

async function loadChapterList(komikId) {
  const q = query(collection(db, `komik/${komikId}/chapter`), orderBy('nama'));
  const snapshot = await getDocs(q);
  const chapterDiv = document.getElementById('chapterList');
  snapshot.forEach(doc => {
    const data = doc.data();
    const btn = document.createElement('button');
    btn.textContent = data.nama;
    btn.onclick = () => alert('Fitur viewer belum dibuat');
    chapterDiv.appendChild(btn);
  });
}
if (document.getElementById('komikDetail')) loadDetailKomik();
async function loadViewer() {
  const params = new URLSearchParams(location.search);
  const komikId = params.get('komik');
  const chapterId = params.get('chapter');

  const docRef = doc(db, `komik/${komikId}/chapter/${chapterId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const viewer = document.getElementById('viewer');
    data.halamanURL.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.style.width = '100%';
      viewer.appendChild(img);
    });
  } else {
    alert('Chapter tidak ditemukan.');
  }
}

if (document.getElementById('viewer')) loadViewer();
