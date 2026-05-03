const db = require('../utils/db');

function createUser(login, password, role = 'student') {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (login, password, role) VALUES (?, ?, ?)';
    db.run(sql, [login, password, role], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, login, role });
    });
  });
}

function findByLogin(login) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE login = ?', [login], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, login, role FROM users ORDER BY id', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

module.exports = { createUser, findByLogin, getAllUsers, deleteUser };
