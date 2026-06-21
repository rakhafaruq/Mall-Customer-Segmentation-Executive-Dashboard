const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("mall.db");
const model = require("./model_info.json");

// Middleware
app.use(cors());
app.use(express.json()); // <-- penting untuk membaca body POST

// GET /customers — ambil semua atau filter by persona
app.get("/customers", (req, res) => {
    const { persona } = req.query;
    let rows;
    if (persona) {
        // TRIM pada sisi DB sebagai pengaman
        rows = db.prepare(`SELECT * FROM customers WHERE TRIM(persona) = ?`).all(persona.trim());
    } else {
        rows = db.prepare(`SELECT * FROM customers`).all();
    }
    res.json(rows);
});

// GET /stats — statistik agregat per persona
app.get("/stats", (req, res) => {
    const stats = db
        .prepare(
            `
        SELECT TRIM(persona) AS persona,
               COUNT(*) AS jumlah,
               ROUND(AVG(income),1) AS avg_income,
               ROUND(AVG(spending_score),1) AS avg_spending
        FROM customers
        GROUP BY TRIM(persona)
        ORDER BY jumlah DESC
        `,
        )
        .all();
    res.json(stats);
});


// POST /customers — tambah pelanggan baru, prediksi persona via K-Means
app.post('/customers', (req, res) => {
    const { age, gender, income, spending_score } = req.body;

    // Validasi input dasar
    if (!age || !gender || income == null || spending_score == null) {
        return res.status(400).json({ error: "Semua field wajib diisi (age, gender, income, spending_score)" });
    }

    // Ambil parameter model
    const { centroids, scaler_mean, scaler_scale, persona: personas } = model;

    // Normalisasi fitur (income & spending_score) sesuai scaler training
    const x = [
        (income - scaler_mean[0]) / scaler_scale[0],
        (spending_score - scaler_mean[1]) / scaler_scale[1],
    ];

    // Cari centroid terdekat (Euclidean distance)
    let cluster = 0;
    let jarakMin = Infinity;

    centroids.forEach((c, i) => {
        const jarak = Math.sqrt((x[0] - c[0]) ** 2 + (x[1] - c[1]) ** 2);
        if (jarak < jarakMin) {
            jarakMin = jarak;
            cluster = i;
        }
    });

    const targetPersona = personas[String(cluster)];

    // Cek duplikat
    const existing = db
        .prepare(`SELECT * FROM customers WHERE age = ? AND gender = ? AND income = ? AND spending_score = ?`)
        .get(age, gender, income, spending_score);

    if (existing) {
        return res.status(409).json({ error: "Pelanggan ini sudah ada di database", persona: existing.persona });
    }

    // Insert & kembalikan ID baru
    const result = db
        .prepare(`INSERT INTO customers(age, gender, income, spending_score, persona) VALUES (?, ?, ?, ?, ?)`)
        .run(age, gender, income, spending_score, targetPersona);

    res.status(201).json({ id: result.lastInsertRowid, persona: targetPersona });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
