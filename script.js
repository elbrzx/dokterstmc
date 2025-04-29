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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const modalTitle = document.getElementById('modalTitle');
const submitAuth = document.getElementById('submitAuth');
const closeModal = document.getElementById('closeModal');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const dokterList = document.getElementById('dokterList');
const adminPanel = document.getElementById('adminPanel');
const addDoctorForm = document.getElementById('addDoctorForm');
const welcomeText = document.getElementById('welcomeText');
const openModalButton = document.getElementById('openModalButton');

let isLogin = true;

// Button Listeners
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    isLogin = true;
    modalTitle.innerText = 'Login';
    authModal.classList.remove('hidden');
  });
}

if (registerBtn) {
  registerBtn.addEventListener('click', () => {
    isLogin = false;
    modalTitle.innerText = 'Daftar';
    authModal.classList.remove('hidden');
  });
}

if (openModalButton) {
  openModalButton.addEventListener('click', () => {
    isLogin = true;
    modalTitle.innerText = 'Login';
    authModal.classList.remove('hidden');
  });
}

if (closeModal) {
  closeModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
  });
}

// Submit Auth
if (submitAuth) {
  submitAuth.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (isLogin) {
      auth.signInWithEmailAndPassword(email, password)
        .then(() => authModal.classList.add('hidden'))
        .catch(err => alert(err.message));
    } else {
      auth.createUserWithEmailAndPassword(email, password)
        .then(() => authModal.classList.add('hidden'))
        .catch(err => alert(err.message));
    }
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    auth.signOut();
  });
}

// Check Auth
auth.onAuthStateChanged(user => {
  if (user) {
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    if (loginBtn) loginBtn.classList.add('hidden');
    if (registerBtn) registerBtn.classList.add('hidden');

    if (welcomeText) welcomeText.innerHTML = `<h2>Welcome, ${user.email}</h2>`;

    if (user.email === 'admin@stmc.com') {
      if (adminPanel) adminPanel.classList.remove('hidden');
    } else {
      if (adminPanel) adminPanel.classList.add('hidden');
    }

    loadDokter();
  } else {
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (registerBtn) registerBtn.classList.remove('hidden');
    if (adminPanel) adminPanel.classList.add('hidden');
    if (welcomeText) welcomeText.innerHTML = '';
    if (dokterList) dokterList.innerHTML = '<p>Silakan login untuk melihat daftar dokter.</p>';
  }
});

// Add Doctor
if (addDoctorForm) {
  addDoctorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const doctorName = document.getElementById('doctorName').value;
    const specialization = document.getElementById('specialization').value;

    db.collection('doctors').add({
      name: doctorName,
      specialization: specialization
    }).then(() => {
      addDoctorForm.reset();
      loadDokter();
      alert('Dokter berhasil ditambahkan!');
    });
  });
}

// Load Doctors
function loadDokter() {
  if (!dokterList) return;

  dokterList.innerHTML = '';

  db.collection('doctors').get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      dokterList.innerHTML += `
        <div class="dokter-card">
          <h3>${data.name}</h3>
          <p>Spesialisasi: ${data.specialization}</p>
        </div>
      `;
    });
  });
}

// Click Outside Modal Closes It
window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.add('hidden');
  }
});
