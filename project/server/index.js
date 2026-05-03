const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./utils/db');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

function initDb() {
  db.serialize(async () => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'admin'))
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      question TEXT NOT NULL,
      correct_answer REAL NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task_id INTEGER NOT NULL,
      user_answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(task_id) REFERENCES tasks(id)
    )`);

    // Seed data for diploma demo.
    const adminPass = await bcrypt.hash('admin123', 10);
    const studentPass = await bcrypt.hash('student123', 10);

    db.run(`INSERT OR IGNORE INTO users (id, login, password, role) VALUES (1, 'admin', ?, 'admin')`, [adminPass]);
    db.run(`INSERT OR IGNORE INTO users (id, login, password, role) VALUES (2, 'student', ?, 'student')`, [studentPass]);
  });
}

initDb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
