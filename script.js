
const previousEl = document.getElementById('previousOperand');
const currentEl = document.getElementById('currentOperand');
const keys = document.getElementById('keys');

let current = '0';
let previous = null;
let operator = null;
let waitingForNewNumber = false;

function updateDisplay() {
  currentEl.textContent = current;
  previousEl.textContent = previous !== null && operator ? `${previous} ${operator}` : '';
}

// Helper to input digit
function inputDigit(digit) {
  if (waitingForNewNumber) {
    current = digit;
    waitingForNewNumber = false;
  } else {
    if (current === '0' && digit === '0') return;
    current = current === '0' ? digit : current + digit;
  }
}

// Helper to input decimal
function inputDecimal() {
  if (waitingForNewNumber) {
    current = '0.';
    waitingForNewNumber = false;
    return;
  }
  if (!current.includes('.')) current += '.';
}

// Clear all
function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  waitingForNewNumber = false;
}

// Perform calculation
function calculate(a, b, op) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  if (Number.isNaN(x) || Number.isNaN(y)) return '0';
  switch (op) {
    case '+': return (x + y).toString();
    case '−': return (x - y).toString();
    case '×': return (x * y).toString();
    case '÷':
      if (y === 0) return 'Error';
      return (x / y).toString();
    default: return '0';
  }
}

// Handle operator button
function handleOperator(nextOp) {
  if (operator && !waitingForNewNumber) {
    // compute intermediate result
    const result = calculate(previous, current, operator);
    current = result;
    previous = result === 'Error' ? null : result;
  } else {
    previous = current;
  }
  operator = nextOp;
  waitingForNewNumber = true;
}

// Handle equals
function handleEquals() {
  if (!operator || previous === null) return;
  const result = calculate(previous, current, operator);
  current = result;
  previous = null;
  operator = null;
  waitingForNewNumber = true;
}

// Click handling via event delegation
keys.addEventListener('click', (e) => {
  const target = e.target;
  if (!target.matches('button')) return;

  if (target.dataset.number) {
    inputDigit(target.dataset.number);
    updateDisplay();
    return;
  }

  if (target.dataset.action === 'decimal') {
    inputDecimal();
    updateDisplay();
    return;
  }

  if (target.dataset.action === 'clear') {
    clearAll();
    updateDisplay();
    return;
  }

  if (target.dataset.action === 'operator') {
    handleOperator(target.dataset.value);
    updateDisplay();
    return;
  }

  if (target.dataset.action === 'equals') {
    handleEquals();
    updateDisplay();
    return;
  }
});

// Keyboard support (optional but handy)
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if ((/^\d$/).test(key)) {
    inputDigit(key);
    updateDisplay();
    return;
  }
  if (key === '.' || key === ',') {
    e.preventDefault();
    inputDecimal();
    updateDisplay();
    return;
  }
  if (key === 'Backspace') {
    // simple backspace behavior
    if (!waitingForNewNumber && current.length > 1) {
      current = current.slice(0, -1);
    } else {
      current = '0';
    }
    updateDisplay();
    return;
  }
  if (key === 'Escape') {
    clearAll();
    updateDisplay();
    return;
  }
  if (key === '=' || key === 'Enter') {
    handleEquals();
    updateDisplay();
    return;
  }
  if (key === '+' || key === '-' || key === '*' || key === '/') {
    // map keyboard operators to symbols used in UI
    const map = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    handleOperator(map[key]);
    updateDisplay();
    return;
  }
});

// Initialize display
updateDisplay();