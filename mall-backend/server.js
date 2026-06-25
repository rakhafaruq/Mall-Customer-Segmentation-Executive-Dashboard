const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("mall.db");
const model = require("./model_info.json");

app.use(cors());
app.use(express.json()); 

app.get("/customers", (req, res) => {
    try{

        const { persona } = req.query;
        let rows;
        if (persona) {
            rows = db.prepare(`SELECT * FROM customers WHERE TRIM(persona) = ?`).all(persona.trim());
        } else {
            rows = db.prepare(`SELECT * FROM customers`).all();
        }
        res.json(rows);
    } catch (error) {
        console.error("[GET /customers] Error fetching customers:", error);
        res.status(500).json({ error: "Database error", message: error.message });
    }
});

app.get("/stats", (req, res) => {
    try{
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
    } catch (error) {
        console.error("[GET /stats] Error fetching stats:", error);
        res.status(500).json({ error: "Database error", message: error.message });
    }
});

app.post("/customers", (req, res) => {
    try{

        const { age, gender, income, spending_score } = req.body;
        
        if (!Number.isFinite(age) || age < 1 || age > 120 || !Number.isFinite(income) || income < 0 || !Number.isFinite(spending_score) || spending_score < 1 || spending_score > 100 || !["Male", "Female"].includes(gender)) {
            return res.status(400).json({
                error: "Input tidak valid. Pastikan age (1–120), income (≥0), spending_score (1–100), dan gender benar.",
            });
        }
        
        const { centroids, scaler_mean, scaler_scale, persona: personas } = model;
        
        const x = [(income - scaler_mean[0]) / scaler_scale[0], (spending_score - scaler_mean[1]) / scaler_scale[1]];
        
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
        
        const existing = db.prepare(`SELECT * FROM customers WHERE age = ? AND gender = ? AND income = ? AND spending_score = ?`).get(age, gender, income, spending_score);
        
        if (existing) {
            return res.status(409).json({ error: "Pelanggan ini sudah ada di database", persona: existing.persona });
        }
        
        const result = db.prepare(`INSERT INTO customers(age, gender, income, spending_score, cluster, persona) VALUES (?, ?, ?, ?, ?, ?)`).run(age, gender, income, spending_score, cluster, targetPersona);
        
        res.status(201).json({ id: result.lastInsertRowid, persona: targetPersona });
    } catch (error) {
        console.error("[POST /customers] Error adding customer:", error);
        res.status(500).json({ error: "Database error", message: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
