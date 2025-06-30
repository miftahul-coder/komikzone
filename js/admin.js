import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = { /* ... (sama dengan auth.js) */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Upload Komik Baru
document.getElementById('uploadKomikForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const judul = document.getElementById('judul').value;
  const penulis = document.getElementById('penulis').value;
  const deskripsi = document.getElementById('deskripsi').value;
  const cover = document.getElementById('cover').files[0];

  const coverRef = ref(storage, `cover/${Date.now()}_${cover.name}`);
  await uploadBytes(coverRef, cover);
  const coverURL = await getDownloadURL(coverRef);

  await addDoc(collection(db, "komik"), {
    judul, penulis, deskripsi, coverURL, rating: 0
  });

  alert('Komik berhasil diupload!');
  e.target.reset();
});

// Upload Chapter Baru
document.getElementById('uploadChapterForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const komikID = document.getElementById('komikID').value;
  const chapterName = document.getElementById('chapterName').value;
  const files = document.getElementById('chapterFiles').files;
  const halamanURL = [];

  for (let file of files) {
    const fileRef = ref(storage, `chapter/${komikID}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    halamanURL.push(url);
  }

  await addDoc(collection(db, `komik/${komikID}/chapter`), {
    nama: chapterName,
    halamanURL
  });

  alert('Chapter berhasil diupload!');
  e.target.reset();
});
