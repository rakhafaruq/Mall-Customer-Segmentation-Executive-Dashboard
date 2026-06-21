# Mall Customer Segmentation & Executive Dashboard

Aplikasi cerdas untuk mengelompokkan pelanggan mall ke dalam segmen perilaku menggunakan *machine learning* (K-Means Clustering), dilengkapi *executive dashboard* interaktif untuk memantau distribusi pelanggan dan mendukung keputusan *targeted marketing*.

> **Status:** Selesai (Lokal) · **Metodologi:** CRISP-DM (Data Science) & Agile (Web Development)
> 

---

## 📖 Deskripsi

Proyek ini membangun sistem segmentasi pelanggan berbasis data demografi dan pengeluaran. Hasil segmentasi divisualisasikan dalam dashboard web sehingga manajemen non-teknis dapat memahami persona pelanggan tanpa perlu memahami kode *machine learning*. Sistem juga mampu mengklasifikasikan pelanggan baru secara otomatis ke persona yang sesuai.

## ✨ Fitur Utama

- 📊 **Dashboard interaktif** — ringkasan KPI, distribusi umur, proporsi gender, dan jumlah pelanggan per segmen.
- 🏷️ **Pelabelan otomatis** — input pelanggan baru langsung diklasifikasikan ke persona-nya.
- 🔍 **Tabel data dengan filter** — telusuri pelanggan berdasarkan persona.
- 🤖 **Model K-Means** — 5 segmen optimal (divalidasi dengan Elbow Method & Silhouette Score).

## 🧬 Persona Pelanggan

| Persona | Karakteristik |
| --- | --- |
| 🎯 Target Utama (VIP) | Income tinggi, spending tinggi |
| Hemat/Konservatif | Income tinggi, spending rendah |
| Impulsif | Income rendah, spending tinggi |
| Sensitif Harga | Income rendah, spending rendah |
| Pelanggan Standar | Income & spending menengah |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
| --- | --- |
| **Data Science** | Python, Pandas, Scikit-Learn, Matplotlib, Seaborn, Jupyter |
| **Backend** | Node.js, Express, better-sqlite3 |
| **Database** | SQLite |
| **Frontend** | React, Vite, Tailwind CSS, Recharts |

---

## 📁 Struktur Folder

```
Mall Customer Segmentation/
├── README.md
├── .gitignore
├── requirements.txt
├── data/                  # data mentah
│   └── Mall_Customers.csv
├── notebook/              # analisis & pemodelan
│   └── customer_segmentation.ipynb
├── output/                # hasil ekspor (CSV berlabel, model, scaler)
├── mall-backend/          # API + Database (Node + SQLite)
└── mall-dashboard/        # Dashboard (React + Vite)
```

---

## ⚙️ Prasyarat

- Python 3.x & Jupyter (atau Google Colab)
- Node.js (v18+)
- npm

---

## 🚀 Instalasi & Menjalankan

### 1. Bagian Data Science *(jalankan sekali untuk menghasilkan model & data)*

```bash
pip install -r requirements.txt
# buka notebook/customer_segmentation.ipynb, jalankan semua sel
# output: customers_segmented.csv & model_info.json di folder output/
```

Salin `customers_segmented.csv` dan `model_info.json` dari `output/` ke folder `mall-backend/`.

### 2. Backend

```bash
cd mall-backend
npm install
node setup.js      # buat database & isi data (cukup sekali)
node server.js     # jalankan server -> http://localhost:3001
```

### 3. Frontend

```bash
cd mall-dashboard
npm install
npm run dev        # jalankan dashboard -> http://localhost:5173
```

> ⚠️ Backend dan frontend harus berjalan **bersamaan** di dua terminal terpisah.
> 

---

## 🔌 Dokumentasi API

Base URL: `http://localhost:3001`

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| `GET` | `/customers` | Ambil semua pelanggan |
| `GET` | `/customers?persona=Impulsif` | Filter pelanggan per persona |
| `GET` | `/stats` | Statistik agregat per persona |
| `POST` | `/customers` | Tambah + prediksi pelanggan baru |

**Contoh body untuk `POST /customers`:**

```json
{
  "age": 25,
  "gender": "Female",
  "income": 80,
  "spending_score": 90
}
```

---

## 🗄️ Skema Database (tabel `customers`)

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | INTEGER | Primary key (auto-increment) |
| `age` | INTEGER | Umur pelanggan |
| `gender` | TEXT | Jenis kelamin |
| `income` | INTEGER | Annual income (k$) |
| `spending_score` | INTEGER | Skor pengeluaran (1–100) |
| `cluster` | INTEGER | Nomor cluster (0–4) |
| `persona` | TEXT | Nama persona |

---

## 🧠 Metodologi Machine Learning

1. **EDA** — analisis distribusi & hubungan antar variabel.
2. **Feature Scaling** — standarisasi `Income` & `SpendingScore` dengan `StandardScaler`.
3. **Penentuan K** — Elbow Method (siku di K=5) + Silhouette Score (tertinggi di K=5).
4. **Clustering** — K-Means dengan K=5.
5. **Prediksi web** — klasifikasi pelanggan baru via perhitungan *centroid terdekat* (Euclidean) di backend.

---

## 👤 Author

**Muhammad Rakha Alfaruq** — *React Developer & Data Analyst*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/muhammad-rakha-alfaruq-9518b6337) 
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/rakhafaruq)

---

## 📝 Dataset

- [Mall Customer Segmentation Data (Kaggle)](https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python).
