const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

async function register(req, res) {
  try {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ message: 'Заповніть login і password' });

    const exists = await userModel.findByLogin(login);
    if (exists) return res.status(400).json({ message: 'Користувач вже існує' });

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(login, hash, 'student');
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
}

async function login(req, res) {
  try {
    const { login, password } = req.body;
    const user = await userModel.findByLogin(login);
    if (!user) return res.status(401).json({ message: 'Невірні дані' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Невірні дані' });

    const token = jwt.sign({ id: user.id, role: user.role, login: user.login }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, login: user.login });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
}

module.exports = { register, login };
