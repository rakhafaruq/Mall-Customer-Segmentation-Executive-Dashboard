/**
 * fix_persona.js
 * Bersihkan trailing \r dan whitespace dari kolom persona di database.
 * Jalankan sekali: node fix_persona.js
 */
const Database = require('better-sqlite3')

const db = new Database('mall.db')

// Bersihkan trailing carriage return (\r) dan spasi
const result = db.prepare("UPDATE customers SET persona = TRIM(REPLACE(persona, char(13), ''))").run()
console.log('Rows updated:', result.changes)

// Verifikasi hasil
const rows = db.prepare('SELECT persona, COUNT(*) as n FROM customers GROUP BY persona ORDER BY n DESC').all()
console.log('\nPersona setelah fix:')
rows.forEach(r => console.log(` "${r.persona}" => ${r.n} pelanggan`))

db.close()
console.log('\n✅ Database berhasil dibersihkan!')
