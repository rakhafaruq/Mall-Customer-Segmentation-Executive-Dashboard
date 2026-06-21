const Database = require('better-sqlite3')
const fs = require('fs')

const db = new Database('mall.db')  // membuat file mall.db

// 1. Buat tabel (perintah SQL: CREATE TABLE)
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    age INTEGER,
    gender TEXT,
    income INTEGER,
    spending_score INTEGER,
    cluster INTEGER,
    persona TEXT
  )
`)

// 2. Baca CSV hasil Python & masukkan ke tabel (SQL: INSERT)
const csv = fs.readFileSync('customers_segmented.csv', 'utf-8').trim().split('\n')
const insert = db.prepare(`
  INSERT INTO customers (age, gender, income, spending_score, cluster, persona)
  VALUES (?, ?, ?, ?, ?, ?)
`)

// lewati baris header (baris ke-0), olah sisanya
csv.slice(1).forEach(row => {
  const [gender, age, income, spending, cluster, persona] = row.split(',')
  // Trim whitespace + carriage return (\r) agar tidak terjadi duplikasi persona
  const cleanPersona = persona ? persona.trim() : ''
  insert.run(Number(age), gender.trim(), Number(income), Number(spending), Number(cluster), cleanPersona)
})

console.log('Database siap! Total baris:', db.prepare('SELECT COUNT(*) AS n FROM customers').get().n)