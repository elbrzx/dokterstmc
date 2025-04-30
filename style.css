// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC5YJEUBV0niiGq6WqMuFImJpONv71yryg",
  authDomain: "dokter-stmc.firebaseapp.com",
  projectId: "dokter-stmc",
  storageBucket: "dokter-stmc.firebasestorage.app",
  messagingSenderId: "900695521336",
  appId: "1:900695521336:web:1336c23e5ad75dd8600ecd",
  measurementId: "G-Z3KLTBCVE0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const welcomeDiv = document.getElementById('welcome');
const userNameSpan = document.getElementById('userName');

loginBtn.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
});

registerBtn.addEventListener('click', () => {
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  if (password !== confirmPassword) {
    alert('Password tidak cocok.');
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user.updateProfile({ displayName: name });
    })
    .then(() => {
      auth.currentUser.sendEmailVerification();
      alert('Verifikasi email telah dikirim. Silakan cek inbox.');
      registerForm.reset();
      registerForm.classList.add('hidden');
    })
    .catch((error) => {
      alert(error.message);
    });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      if (!userCredential.user.emailVerified) {
        alert('Silakan verifikasi email Anda terlebih dahulu.');
        auth.signOut();
      } else {
        loginForm.classList.add('hidden');
        document.querySelector('.nav-links').classList.add('hidden');
        userNameSpan.textContent = userCredential.user.displayName;
        welcomeDiv.classList.remove('hidden');
      }
    })
    .catch((error) => {
      alert(error.message);
    });
});
