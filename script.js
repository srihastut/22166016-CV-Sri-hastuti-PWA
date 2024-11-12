
// Mengambil elemen-elemen HTML
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
let deferredPrompt; // Untuk menangani prompt instalasi PWA
const installButton = document.getElementById("installButton");

// Event beforeinstallprompt untuk menampilkan tombol instalasi
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("beforeinstallprompt event fired");
  e.preventDefault();
  deferredPrompt = e;
  installButton.style.display = "block";

  // Menangani klik pada tombol install
  installButton.addEventListener("click", () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
        installButton.style.display = "none"; // Sembunyikan tombol setelah prompt ditampilkan
      });
    }
  });
});

// Navigasi aktif saat di-scroll
window.onscroll = () => {
  sections.forEach(sec => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        document.querySelector('header nav a[href="#' + id + '"]').classList.add('active');
      });
    }
  });
};

<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js') // Gunakan path relatif
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  }
</script>


// Fungsi toggle untuk Read More / Read Less
function toggleContent() {
  const boxes = document.querySelectorAll(".box");
  const button = document.getElementById("toggle-button");

  // Toggle visibilitas semua box
  boxes.forEach(box => box.classList.toggle("show"));

  // Ubah teks tombol antara 'Read More' dan 'Read Less'
  button.innerText = button.innerText === "Read More" ? "Read Less" : "Read More";
}

// Cek apakah browser mendukung IndexedDB
if (!window.indexedDB) {
  alert("Browser Anda tidak mendukung IndexedDB");
} else {
  // IndexedDB setup
  let db;
  const request = indexedDB.open("contactDB", 1);

  request.onupgradeneeded = function(event) {
    db = event.target.result;
    const store = db.createObjectStore("contacts", { keyPath: "id", autoIncrement: true });
    store.createIndex("fullName", "fullName", { unique: false });
  };

  request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database berhasil diakses");
  };

  request.onerror = function(event) {
    console.error("Database error: " + event.target.errorCode);
  };

  // Form Submission
  document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Ambil data dari form
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const message = document.getElementById("message").value;

    // Cek apakah semua data sudah diisi
    if (!fullName || !email || !message) {
        alert("Mohon isi semua field yang wajib.");
        return;
    }

    // Data kontak yang akan disimpan
    const contact = {
        fullName,
        email,
        phoneNumber,
        message,
        timestamp: new Date().toISOString()
    };

    // Simpan data ke IndexedDB
    const transaction = db.transaction(["contacts"], "readwrite");
    const store = transaction.objectStore("contacts");
    const addRequest = store.add(contact);

    addRequest.onsuccess = function() {
        alert("Pesan berhasil disimpan!");
        document.getElementById("contactForm").reset();
    };

    addRequest.onerror = function(event) {
        console.error("Gagal menyimpan pesan:", event.target.error);
        alert("Gagal menyimpan pesan.");
    };
  });
}

// Menu toggle
menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
};

// Meminta izin notifikasi saat halaman dimuat
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted' && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION'
      });
    } else {
      console.log('Izin notifikasi ditolak atau belum dipilih.');
    }
  }).catch(error => {
    console.error('Terjadi kesalahan saat meminta izin notifikasi:', error);
  });
} else {
  console.log('Browser tidak mendukung Notification API.');
}
