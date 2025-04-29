// CONFIG Firebase kamu (ganti ini pakai yang dari Firebase project-mu ya beb)
const firebaseConfig = {
      apiKey: "AIzaSyC5YJEUBV0niiGq6WqMuFImJpONv71yryg",
      authDomain: "dokter-stmc.firebaseapp.com",
      projectId: "dokter-stmc",
      storageBucket: "dokter-stmc.firebasestorage.app",
      messagingSenderId: "900695521336",
      appId: "1:900695521336:web:1336c23e5ad75dd8600ecd",
      measurementId: "G-Z3KLTBCVE0"
    };

// Init Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authSection = document.getElementById('authSection');
const submitAuth = document.getElementById('submitAuth');
const authTitle = document.getElementById('authTitle');
const dokterList = document.getElementById('dokterList');
const adminPanel = document.getElementById('adminPanel');
const namaDokter = document.getElementById('namaDokter');
const spesialisDokter = document.getElementById('spesialisDokter');
const jadwalDokter = document.getElementById('jadwalDokter');
const tambahDokterBtn = document.getElementById('tambahDokterBtn');

let isLogin = true;

// Event Listener
loginBtn.addEventListener('click', () => {
  authSection.classList.remove('hidden');
  authTitle.innerText = "Login";
  isLogin = true;
});
registerBtn.addEventListener('click', () => {
  authSection.classList.remove('hidden');
  authTitle.innerText = "Daftar";
  isLogin = false;
});
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

// Submit login/register
submitAuth.addEventListener('click', () => {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  if (isLogin) {
    auth.signInWithEmailAndPassword(email, password)
      .then(() => authSection.classList.add('hidden'))
      .catch(err => alert(err.message));
  } else {
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => authSection.classList.add('hidden'))
      .catch(err => alert(err.message));
  }
});

// Tambah dokter (admin only)
tambahDokterBtn.addEventListener('click', () => {
  const nama = namaDokter.value;
  const spesialis = spesialisDokter.value;
  const jadwal = jadwalDokter.value;

  db.collection('dokter').add({ nama, spesialis, jadwal })
    .then(() => {
      namaDokter.value = "";
      spesialisDokter.value = "";
      jadwalDokter.value = "";
      alert("Dokter baru berhasil ditambahkan!");
      loadDokter();
    });
});

// Load semua dokter
function loadDokter() {
  dokterList.innerHTML = '';
  db.collection('dokter').get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      dokterList.innerHTML += `
        <div class="doctor-card">
          <h3>${data.nama}</h3>
          <p>${data.spesialis}</p>
          <p class="jadwal">${data.jadwal}</p>
        </div>
      `;
    });
  });
}

// Cek Auth State
auth.onAuthStateChanged(user => {
  if (user) {
    logoutBtn.classList.remove('hidden');
    loginBtn.classList.add('hidden');
    registerBtn.classList.add('hidden');

    dokterList.innerHTML = `<h2 style="text-align:center; margin-bottom:20px;">Welcome, ${user.email}!</h2>`;
    
    // Cek apakah admin login
    if (user.email === 'admin@stmc.com') {
      adminPanel.classList.remove('hidden'); // Tampilkan form tambah dokter
    }
    loadDokter(); // Load daftar dokter
  } else {
    logoutBtn.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    registerBtn.classList.remove('hidden');
    adminPanel.classList.add('hidden');
    dokterList.innerHTML = `<h2 style="text-align:center; margin-top:30px;">Silakan login untuk melihat daftar dokter</h2>`;
  }
});

//--- Tambah Dokter di Firestorm --- //
const addDoctorForm = document.getElementById('addDoctorForm');

addDoctorForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const doctorName = document.getElementById('doctorName').value;
  const specialization = document.getElementById('specialization').value;

  // Simpan data dokter ke Firestore
  db.collection('doctors').add({
    name: doctorName,
    specialization: specialization,
  })
  .then(() => {
    alert('Dokter berhasil ditambahkan!');
    addDoctorForm.reset();
    loadDokter(); // Reload daftar dokter
  })
  .catch((error) => {
    console.error('Error adding doctor: ', error);
  });
});
