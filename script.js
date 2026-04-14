let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

const currentOperandTextElement = document.getElementById('current-operand');
const previousOperandTextElement = document.getElementById('previous-operand');

function clearDisplay() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    shouldResetScreen = false;
    updateDisplay();
}

function deleteLast() {
    if (shouldResetScreen) return;
    if (currentOperand === '0') return;
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
    updateDisplay();
}

function chooseOperator(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        compute();
    }
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    updateDisplay();
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) {
        // Handle case where we might have just one operand and an operation (e.g. scientific)
        return;
    }

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Cannot divide by zero");
                clearDisplay();
                return;
            }
            computation = prev / current;
            break;
        case '^':
            computation = Math.pow(prev, current);
            break;
        case '%':
            computation = prev % current;
            break;
        default:
            return;
    }

    currentOperand = formatResult(computation);
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
}

function scientific(type) {
    const current = parseFloat(currentOperand);
    if (isNaN(current) && type !== 'pi' && type !== 'e') return;

    let result;
    switch (type) {
        case 'sin':
            result = Math.sin(current * Math.PI / 180); // Assuming degrees
            break;
        case 'cos':
            result = Math.cos(current * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(current * Math.PI / 180);
            break;
        case 'log':
            result = Math.log10(current);
            break;
        case 'ln':
            result = Math.log(current);
            break;
        case 'sqrt':
            if (current < 0) {
                alert("Invalid input");
                return;
            }
            result = Math.sqrt(current);
            break;
        case 'pow':
            chooseOperator('^');
            return;
        case 'pi':
            currentOperand = Math.PI.toString();
            updateDisplay();
            return;
        case 'e':
            currentOperand = Math.E.toString();
            updateDisplay();
            return;
        case 'abs':
            result = Math.abs(current);
            break;
        case 'fact':
            result = factorial(current);
            break;
        case 'inv':
            if (current === 0) {
                alert("Cannot divide by zero");
                return;
            }
            result = 1 / current;
            break;
        case 'sq':
            result = current * current;
            break;
        case 'exp':
            result = Math.exp(current);
            break;
        default:
            return;
    }

    currentOperand = formatResult(result);
    shouldResetScreen = true;
    updateDisplay();
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function formatResult(num) {
    if (isNaN(num)) return "Error";
    if (!isFinite(num)) return "Infinity";
    // Avoid long decimals
    const result = Number(num.toFixed(10)).toString();
    return result;
}

function getDisplayNumber(number) {
    if (number === 'Error' || number === 'Infinity') return number;
    const stringNumber = number.toString();

    const parts = stringNumber.split('.');
    const integerDigits = parseFloat(parts[0]);
    const decimalDigits = parts[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay = parts[0] === '-' ? '-' : (parts[0] === '' ? '' : parts[0]);
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

function updateDisplay() {
    currentOperandTextElement.innerText = getDisplayNumber(currentOperand);
    if (operation != null) {
        previousOperandTextElement.innerText = `${getDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
}

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '=' || e.key === 'Enter') compute();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearDisplay();
    if (e.key === '+') chooseOperator('+');
    if (e.key === '-') chooseOperator('-');
    if (e.key === '*') chooseOperator('×');
    if (e.key === '/') {
        e.preventDefault();
        chooseOperator('÷');
    }
    if (e.key === '^') chooseOperator('^');
});
