const taskModel = require('../models/taskModel');
const resultModel = require('../models/resultModel');
const { generateTask, round } = require('../utils/mathGenerator');

async function generate(req, res) {
  try {
    const { type } = req.body;
    const task = generateTask(type);
    const saved = await taskModel.createTask(task.type, task.question, task.correctAnswer);
    res.json({ id: saved.id, type: task.type, question: task.question });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
}

async function checkAnswer(req, res) {
  try {
    const { taskId, userAnswer } = req.body;
    const task = await taskModel.getTaskById(taskId);
    if (!task) return res.status(404).json({ message: 'Завдання не знайдено' });

    const numericAnswer = Number(userAnswer);
    const isCorrect = Math.abs(round(numericAnswer) - round(Number(task.correct_answer))) < 0.01;
    await resultModel.createResult(req.user.id, taskId, userAnswer, isCorrect);

    res.json({ isCorrect, correctAnswer: Number(task.correct_answer) });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
}

async function history(req, res) {
  try {
    const data = await resultModel.getUserHistory(req.user.id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
}

module.exports = { generate, checkAnswer, history };
