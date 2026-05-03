// Utility for generating random econometrics tasks and correct answers.
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function round(num) {
  return Number(num.toFixed(4));
}

function linearRegressionTask() {
  const x = Array.from({ length: 5 }, () => randomInt(1, 10));
  const y = Array.from({ length: 5 }, () => randomInt(1, 20));
  const xMean = x.reduce((a, b) => a + b, 0) / x.length;
  const yMean = y.reduce((a, b) => a + b, 0) / y.length;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < x.length; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    denominator += (x[i] - xMean) ** 2;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  return {
    type: 'linear_regression',
    question: `Для точок x=${JSON.stringify(x)} та y=${JSON.stringify(y)} знайдіть коефіцієнт нахилу b у лінійній регресії y=a+bx`,
    correctAnswer: round(slope)
  };
}

function meanTask() {
  const data = Array.from({ length: 6 }, () => randomInt(1, 30));
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  return {
    type: 'mean',
    question: `Знайдіть середнє значення для вибірки: ${JSON.stringify(data)}`,
    correctAnswer: round(mean)
  };
}

function varianceTask() {
  const data = Array.from({ length: 6 }, () => randomInt(1, 30));
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + (val - mean) ** 2, 0) / data.length;
  return {
    type: 'variance',
    question: `Знайдіть дисперсію для вибірки: ${JSON.stringify(data)}`,
    correctAnswer: round(variance)
  };
}

function correlationTask() {
  const x = Array.from({ length: 5 }, () => randomInt(1, 10));
  const y = Array.from({ length: 5 }, () => randomInt(1, 20));

  const xMean = x.reduce((a, b) => a + b, 0) / x.length;
  const yMean = y.reduce((a, b) => a + b, 0) / y.length;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < x.length; i++) {
    num += (x[i] - xMean) * (y[i] - yMean);
    denX += (x[i] - xMean) ** 2;
    denY += (y[i] - yMean) ** 2;
  }

  const corr = denX === 0 || denY === 0 ? 0 : num / Math.sqrt(denX * denY);

  return {
    type: 'correlation',
    question: `Для x=${JSON.stringify(x)} та y=${JSON.stringify(y)} знайдіть коефіцієнт кореляції Пірсона`,
    correctAnswer: round(corr)
  };
}

function generateTask(taskType) {
  const map = {
    linear_regression: linearRegressionTask,
    mean: meanTask,
    variance: varianceTask,
    correlation: correlationTask
  };
  return (map[taskType] || meanTask)();
}

module.exports = { generateTask, round };
