const userModel = require('../models/userModel');
const resultModel = require('../models/resultModel');
const db = require('../utils/db');

async function users(req, res) {
  const data = await userModel.getAllUsers();
  res.json(data);
}

async function results(req, res) {
  const data = await resultModel.getAllResults();
  res.json(data);
}

async function removeUser(req, res) {
  const changes = await userModel.deleteUser(req.params.id);
  res.json({ deleted: changes > 0 });
}

function stats(req, res) {
  const sql = `SELECT COUNT(*) AS total, SUM(is_correct) AS correct FROM results`;
  db.get(sql, [], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    const total = row?.total || 0;
    const correct = row?.correct || 0;
    res.json({ totalAttempts: total, correctAttempts: correct, successRate: total ? (correct / total) * 100 : 0 });
  });
}

module.exports = { users, results, removeUser, stats };
