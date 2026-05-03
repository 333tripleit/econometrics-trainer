const db = require('../utils/db');

function createTask(type, question, correctAnswer) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO tasks (type, question, correct_answer) VALUES (?, ?, ?)',
      [type, question, correctAnswer],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, type, question });
      }
    );
  });
}

function getTaskById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

module.exports = { createTask, getTaskById };
