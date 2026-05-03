const db = require('../utils/db');

function createResult(userId, taskId, userAnswer, isCorrect) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO results (user_id, task_id, user_answer, is_correct) VALUES (?, ?, ?, ?)',
      [userId, taskId, userAnswer, isCorrect ? 1 : 0],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

function getUserHistory(userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT r.id, t.type, t.question, t.correct_answer, r.user_answer, r.is_correct, r.created_at
                 FROM results r JOIN tasks t ON r.task_id = t.id
                 WHERE r.user_id = ? ORDER BY r.created_at DESC`;
    db.all(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getAllResults() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT r.id, u.login, t.type, r.user_answer, r.is_correct, r.created_at
                 FROM results r
                 JOIN users u ON r.user_id = u.id
                 JOIN tasks t ON r.task_id = t.id
                 ORDER BY r.created_at DESC`;
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { createResult, getUserHistory, getAllResults };
