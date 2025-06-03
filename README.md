# 🌍 Dicoding Story Web App

Aplikasi berbagi cerita berbasis API yang dibangun menggunakan arsitektur **SPA (Single Page Application)** dan **MVP (Model-View-Presenter)**. Aplikasi ini terintegrasi dengan **Dicoding Story API**, menampilkan cerita dalam bentuk visual, lokasi, dan mendukung berbagai fitur interaktif seperti upload cerita dengan kamera dan lokasi.

---
## Cara Menjalankan Proyek

Ikuti langkah berikut untuk instalasi dan menjalankan aplikasi ini secara lokal:

1. **Install dependencies**  
   Jalankan perintah berikut untuk mengunduh semua package yang dibutuhkan:  
   npm install
2. **Build aplikasi**
  Compile dan bundle kode sumber untuk produksi:
  npm run build
3. **Jalankan server lokal**
  Serve hasil build yang ada di folder dist:
  npm run serve

## 🚀 Fitur Utama

- ✅ **SPA (Single Page Application)** menggunakan hash routing.
- ✅ Mengambil data dari **Dicoding Story API**.
- ✅ Menampilkan daftar cerita (gambar + deskripsi).
- ✅ Menampilkan **lokasi cerita dalam peta digital**.
- ✅ Fitur **tambah cerita baru**:
  - Ambil gambar dari kamera.
  - Ambil lokasi dari koordinat GPS.
- ✅ Halaman **detail cerita** berdasarkan ID.
- ✅ **Bookmark cerita favorit**.
- ✅ **Login & Signup** menggunakan token autentikasi.
- ✅ Fitur **Logout** dan redirect otomatis.
- ✅ Aksesibilitas:
  - Skip to content.
  - Alt text untuk gambar.
  - Label untuk input.
  - Elemen semantic HTML.
- ✅ **View Transition API** untuk transisi halus antar halaman.
- ✅ **Halaman 404 Not Found** untuk rute yang tidak tersedia.

---

## 📦 Struktur Folder

berbagi-cerita/
├── 📁 public/
│   ├── 📁 icons/          
│   ├── 📁 screenshots/
│   ├── 📄 manifest.json              
├── 📁 src/                     
│   ├── 📁 models.js/
│   │   └── storyModel.js                
│   ├── 📁 presenters/          
│   │   ├── homePresenter.js
│   │   ├── addPresenter.js
│   │   ├── bookmarkPresenter.js
│   │   ├── detailPresenter.js
│   │   ├── loginPresenter.js
│   │   ├── signupPresenter.js
│   │   └── notFoundPresenter.js
│   ├── 📁 router/
│   │   └── router.js    
│   ├── 📁 views/               
│   │   ├── homeView.js
│   │   ├── addView.js
│   │   ├── bookmarkView.js
│   │   ├── detailView.js
│   │   ├── loginView.js
│   │   ├── signupView.js
│   │   └── notFoundView.js
│   ├── 📁 utils/               
│   │   ├── db.js            
│   │   ├── camera.js          
│   │   ├── pushHelper.js             
│   ├── 📁 styles/
│   │   └── style.css
│   ├── 📄 index.html
│   ├── 📄 index.js
│   └── 📄 service-worker.js
├── 📄 .prettierrc              
├── 📄 README.md
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 webpack.common.js
├── 📄 webpack.dev.js
└── 📄 webpack.prod.js                  
                

## 🛠️ Teknologi

- HTML5
- CSS3 (Tailwind / custom styling)
- JavaScript ES6+
- View Transition API
- Leaflet.js (untuk peta)
- Web API: Camera, Geolocation
- Dicoding Story API




