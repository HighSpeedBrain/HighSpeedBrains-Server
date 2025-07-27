import { Hono } from 'hono'
import { serve } from 'bun'
import { Database } from 'bun:sqlite'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// ✅ Ensure ../db folder exists relative to this file
const dbDir = join(import.meta.dir, '../db')
const dbPath = join(dbDir, 'db.db')

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

// ✅ Setup SQLite database at ../db/db.db
const db = new Database(dbPath, { create: true })

// ✅ Create `games` table (only once)
db.run(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    Game_id TEXT UNIQUE
  );
`)

// ✅ Insert default games (if not already there)
const insertGame = db.prepare('INSERT OR IGNORE INTO games (name,Game_id) VALUES (?,?);')
insertGame.run('Sudoku','sudoku')
insertGame.run('Wack A Mole','wack')
insertGame.run('Schulte',"schulte")

const app = new Hono()

// ✅ Route: Serve HTML file from ./html based on query param `file`
app.get('/html', async (c) => {
  const file = c.req.query('file')
  if (!file) return c.text('❌ Missing `file` query param', 400)

  const filePath = join(import.meta.dir, '../html', `${file}.html`)
  if (!existsSync(filePath)) return c.text('❌ File not found', 404)

  const content = await Bun.file(filePath).text()
  return c.html(content)
})

// ✅ Route: Return list of game names as JSON
app.get('/games', (c) => {
  const rows = db.query<{ name: string }, []>('SELECT name FROM games').all()
  return c.json(rows.map(row => row.name))
})

export default {
  hostname: '0.0.0.0',
  port: 80,
  fetch: app.fetch
}
