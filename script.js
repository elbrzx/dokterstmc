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

let isLogin = true;

// Button Listeners
loginBtn.addEventListener('click', () => {
  isLogin = true;
  modalTitle.innerText = 'Login';
  authModal.classList.remove('hidden');
});

registerBtn.addEventListener('click', () => {
  isLogin = false;
  modalTitle.innerText = 'Daftar';
  authModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
  authModal.classList.add('hidden');
});

// Submit Auth
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

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

// Check Auth
auth.onAuthStateChanged(user => {
  if (user) {
    logoutBtn.classList.remove('hidden');
    loginBtn.classList.add('hidden');
    registerBtn.classList.add('hidden');

    welcomeText.innerHTML = `<h2>Welcome, ${user.email}</h2>`;

    if (user.email === 'admin@stmc.com') {
      adminPanel.classList.remove('hidden');
    } else {
      adminPanel.classList.add('hidden');
    }

    loadDokter();
  } else {
    logoutBtn.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    registerBtn.classList.remove('hidden');
    adminPanel.classList.add('hidden');
    welcomeText.innerHTML = '';
    dokterList.innerHTML = '<p>Silakan login untuk melihat daftar dokter.</p>';
  }
});

// Add Doctor
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

// Load Doctors
function loadDokter() {
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
const authModal = document.getElementById('authModal');
const openModalButton = document.getElementById('openModalButton'); // Tombol buat buka modal login
const closeModalButton = document.getElementById('closeModal');

if (openModalButton) {
  openModalButton.addEventListener('click', () => {
    authModal.classList.remove('hidden');
  });
}

if (closeModalButton) {
  closeModalButton.addEventListener('click', () => {
    authModal.classList.add('hidden');
  });
}
