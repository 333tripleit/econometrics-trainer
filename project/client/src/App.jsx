import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function App() {
  const [auth, setAuth] = useState({ login: '', password: '', isRegister: false });
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [taskType, setTaskType] = useState('linear_regression');
  const [task, setTask] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [adminData, setAdminData] = useState({ users: [], results: [], stats: null });

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  async function submitAuth() {
    const url = auth.isRegister ? '/auth/register' : '/auth/login';
    const res = await axios.post(`${API}${url}`, { login: auth.login, password: auth.password });
    if (!auth.isRegister) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setToken(res.data.token);
      setRole(res.data.role);
    } else {
      alert('Реєстрація успішна, увійдіть у систему.');
      setAuth({ ...auth, isRegister: false });
    }
  }

  async function generateTask() {
    const res = await axios.post(`${API}/tasks/generate`, { type: taskType }, authHeader);
    setTask(res.data);
    setResult(null);
    setAnswer('');
  }

  async function checkAnswer() {
    const res = await axios.post(`${API}/tasks/check`, { taskId: task.id, userAnswer: answer }, authHeader);
    setResult(res.data);
  }

  async function loadHistory() {
    const res = await axios.get(`${API}/tasks/history`, authHeader);
    setHistory(res.data);
  }

  async function loadAdmin() {
    const [users, results, stats] = await Promise.all([
      axios.get(`${API}/admin/users`, authHeader),
      axios.get(`${API}/admin/results`, authHeader),
      axios.get(`${API}/admin/stats`, authHeader)
    ]);
    setAdminData({ users: users.data, results: results.data, stats: stats.data });
  }

  if (!token) {
    return <div style={{ padding: 20 }}>
      <h2>Вхід / Реєстрація</h2>
      <input placeholder='login' onChange={e => setAuth({ ...auth, login: e.target.value })} /><br />
      <input placeholder='password' type='password' onChange={e => setAuth({ ...auth, password: e.target.value })} /><br />
      <label><input type='checkbox' checked={auth.isRegister} onChange={e => setAuth({ ...auth, isRegister: e.target.checked })} /> Реєстрація</label><br />
      <button onClick={submitAuth}>Підтвердити</button>
    </div>;
  }

  return <div style={{ padding: 20 }}>
    <h1>ІС оцінювання знань з Економетрики</h1>
    <button onClick={() => { localStorage.clear(); setToken(''); }}>Вийти</button>

    <h3>Генерація задач</h3>
    <select value={taskType} onChange={e => setTaskType(e.target.value)}>
      <option value='linear_regression'>Лінійна регресія</option>
      <option value='mean'>Середнє значення</option>
      <option value='variance'>Дисперсія</option>
      <option value='correlation'>Кореляція</option>
    </select>
    <button onClick={generateTask}>Згенерувати</button>

    {task && <div>
      <p><b>Завдання:</b> {task.question}</p>
      <input value={answer} onChange={e => setAnswer(e.target.value)} placeholder='Ваша відповідь' />
      <button onClick={checkAnswer}>Перевірити</button>
    </div>}

    {result && <p>{result.isCorrect ? '✅ Правильно' : `❌ Неправильно. Правильна відповідь: ${result.correctAnswer}`}</p>}

    <h3>Історія</h3>
    <button onClick={loadHistory}>Оновити історію</button>
    <ul>{history.map(item => <li key={item.id}>{item.type} | Ваша: {item.user_answer} | Статус: {item.is_correct ? 'ok' : 'bad'}</li>)}</ul>

    {role === 'admin' && <div>
      <h2>Адмін-панель</h2>
      <button onClick={loadAdmin}>Завантажити дані</button>
      <p>Користувачів: {adminData.users.length}</p>
      <p>Спроб: {adminData.stats?.totalAttempts || 0}, Успішність: {(adminData.stats?.successRate || 0).toFixed(2)}%</p>
    </div>}
  </div>;
}
