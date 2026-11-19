export type BinaryOperator = '+' | '-' | '*' | '/';

export interface CalculatorState {
  display: string;
  expression: string;
  unaryLabel: string | null;
  accumulator: number | null;
  pendingOperator: BinaryOperator | null;
  waitingForOperand: boolean;
  hasError: boolean;
  memory: number;
}

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  display: '0',
  expression: '',
  unaryLabel: null,
  accumulator: null,
  pendingOperator: null,
  waitingForOperand: false,
  hasError: false,
  memory: 0,
};

const MAX_DISPLAY_LENGTH = 16;

/**
 * Formats a number safely without JS floating-point noise (e.g., 0.1 + 0.2 -> "0.3").
 */
export function formatCalcNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return 'Invalid input';
  }
  const normalized = Number(value.toPrecision(15));
  if (Object.is(normalized, -0)) return '0';
  const str = String(normalized);
  if (str.length > MAX_DISPLAY_LENGTH && !str.includes('e')) {
    return normalized.toPrecision(14).replace(/\.?0+$/, '');
  }
  return str;
}

function applyBinaryOp(left: number, right: number, op: BinaryOperator): number | string {
  switch (op) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return right === 0 ? 'Cannot divide by zero' : left / right;
  }
}

function buildCombinedExpression(
  accumulator: number | null,
  pendingOperator: BinaryOperator | null,
  unaryLabel: string | null
): string {
  const base =
    accumulator !== null && pendingOperator
      ? `${formatCalcNumber(accumulator)} ${pendingOperator}`
      : '';
  if (!unaryLabel) return base;
  return base ? `${base} ${unaryLabel}` : unaryLabel;
}

export function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.hasError) {
    return {
      ...INITIAL_CALCULATOR_STATE,
      memory: state.memory,
      display: digit,
    };
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      display: digit,
      unaryLabel: null,
      expression: buildCombinedExpression(state.accumulator, state.pendingOperator, null),
      waitingForOperand: false,
    };
  }

  if (state.display === '0') {
    return { ...state, display: digit, unaryLabel: null };
  }

  if (state.display.replace('-', '').replace('.', '').length >= MAX_DISPLAY_LENGTH) {
    return state;
  }

  return {
    ...state,
    display: state.display + digit,
  };
}

export function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.hasError) {
    return {
      ...INITIAL_CALCULATOR_STATE,
      memory: state.memory,
      display: '0.',
    };
  }

  if (state.waitingForOperand) {
    return {
      ...state,
      display: '0.',
      unaryLabel: null,
      expression: buildCombinedExpression(state.accumulator, state.pendingOperator, null),
      waitingForOperand: false,
    };
  }

  if (state.display.includes('.')) {
    return state;
  }

  return {
    ...state,
    display: state.display + '.',
  };
}

export function backspace(state: CalculatorState): CalculatorState {
  if (state.hasError) {
    return { ...INITIAL_CALCULATOR_STATE, memory: state.memory };
  }
  if (state.waitingForOperand) {
    return state;
  }

  if (
    state.display.length <= 1 ||
    (state.display.length === 2 && state.display.startsWith('-'))
  ) {
    return { ...state, display: '0' };
  }

  return {
    ...state,
    display: state.display.slice(0, -1),
  };
}

export function clearEntry(state: CalculatorState): CalculatorState {
  if (state.hasError) {
    return { ...INITIAL_CALCULATOR_STATE, memory: state.memory };
  }
  return {
    ...state,
    display: '0',
    unaryLabel: null,
    expression: buildCombinedExpression(state.accumulator, state.pendingOperator, null),
    waitingForOperand: false,
  };
}

export function clearAll(state: CalculatorState): CalculatorState {
  return {
    ...INITIAL_CALCULATOR_STATE,
    memory: state.memory,
  };
}

export function negate(state: CalculatorState): CalculatorState {
  if (state.hasError) return state;
  if (state.display === '0') return state;

  const nextDisplay = state.display.startsWith('-')
    ? state.display.slice(1)
    : `-${state.display}`;

  const nextUnary = state.unaryLabel ? `negate(${state.unaryLabel})` : null;

  return {
    ...state,
    display: nextDisplay,
    unaryLabel: nextUnary,
    expression: nextUnary
      ? buildCombinedExpression(state.accumulator, state.pendingOperator, nextUnary)
      : state.expression,
  };
}

export function applySqrt(state: CalculatorState): CalculatorState {
  if (state.hasError) return state;
  const val = parseFloat(state.display);
  const inner = state.unaryLabel ?? state.display;
  const nextUnary = `sqrt(${inner})`;

  if (Number.isNaN(val) || val < 0) {
    return {
      ...state,
      display: 'Invalid input',
      unaryLabel: nextUnary,
      expression: buildCombinedExpression(state.accumulator, state.pendingOperator, nextUnary),
      waitingForOperand: true,
      hasError: true,
    };
  }

  return {
    ...state,
    display: formatCalcNumber(Math.sqrt(val)),
    unaryLabel: nextUnary,
    expression: buildCombinedExpression(state.accumulator, state.pendingOperator, nextUnary),
    waitingForOperand: true,
  };
}

export function applyReciprocal(state: CalculatorState): CalculatorState {
  if (state.hasError) return state;
  const val = parseFloat(state.display);
  const inner = state.unaryLabel ?? state.display;
  const nextUnary = `reciproc(${inner})`;

  if (val === 0 || Number.isNaN(val)) {
    return {
      ...state,
      display: 'Cannot divide by zero',
      unaryLabel: nextUnary,
      expression: buildCombinedExpression(state.accumulator, state.pendingOperator, nextUnary),
      waitingForOperand: true,
      hasError: true,
    };
  }

  return {
    ...state,
    display: formatCalcNumber(1 / val),
    unaryLabel: nextUnary,
    expression: buildCombinedExpression(state.accumulator, state.pendingOperator, nextUnary),
    waitingForOperand: true,
  };
}

export function applyPercent(state: CalculatorState): CalculatorState {
  if (state.hasError) return state;
  const val = parseFloat(state.display);
  if (Number.isNaN(val)) return state;

  const base = state.accumulator !== null && state.pendingOperator ? state.accumulator : 0;
  const computed = state.pendingOperator ? (base * val) / 100 : 0;
  const formatted = formatCalcNumber(computed);

  return {
    ...state,
    display: formatted,
    unaryLabel: formatted,
    expression: buildCombinedExpression(state.accumulator, state.pendingOperator, formatted),
    waitingForOperand: true,
  };
}

export function handleOperator(
  state: CalculatorState,
  nextOperator: BinaryOperator
): CalculatorState {
  if (state.hasError) return state;

  const inputValue = parseFloat(state.display);

  if (state.pendingOperator && state.waitingForOperand && !state.unaryLabel) {
    return {
      ...state,
      pendingOperator: nextOperator,
      expression: `${formatCalcNumber(state.accumulator ?? inputValue)} ${nextOperator}`,
    };
  }

  if (state.accumulator === null) {
    return {
      ...state,
      accumulator: inputValue,
      pendingOperator: nextOperator,
      unaryLabel: null,
      expression: `${formatCalcNumber(inputValue)} ${nextOperator}`,
      waitingForOperand: true,
    };
  }

  const result = state.pendingOperator
    ? applyBinaryOp(state.accumulator, inputValue, state.pendingOperator)
    : inputValue;

  if (typeof result === 'string') {
    return {
      ...INITIAL_CALCULATOR_STATE,
      memory: state.memory,
      display: result,
      hasError: true,
      waitingForOperand: true,
    };
  }

  return {
    ...state,
    display: formatCalcNumber(result),
    accumulator: result,
    pendingOperator: nextOperator,
    unaryLabel: null,
    expression: `${formatCalcNumber(result)} ${nextOperator}`,
    waitingForOperand: true,
  };
}

export function evaluateEquals(state: CalculatorState): CalculatorState {
  if (state.hasError) {
    return { ...INITIAL_CALCULATOR_STATE, memory: state.memory };
  }

  if (state.accumulator === null || !state.pendingOperator) {
    return {
      ...state,
      expression: '',
      unaryLabel: null,
      waitingForOperand: true,
    };
  }

  const right = parseFloat(state.display);
  const result = applyBinaryOp(state.accumulator, right, state.pendingOperator);

  if (typeof result === 'string') {
    return {
      ...INITIAL_CALCULATOR_STATE,
      memory: state.memory,
      display: result,
      hasError: true,
      waitingForOperand: true,
    };
  }

  return {
    ...state,
    display: formatCalcNumber(result),
    accumulator: null,
    pendingOperator: null,
    unaryLabel: null,
    expression: '',
    waitingForOperand: true,
  };
}

export function memoryClear(state: CalculatorState): CalculatorState {
  return { ...state, memory: 0 };
}

export function memoryRecall(state: CalculatorState): CalculatorState {
  if (state.hasError) {
    return {
      ...INITIAL_CALCULATOR_STATE,
      memory: state.memory,
      display: formatCalcNumber(state.memory),
      waitingForOperand: true,
    };
  }
  return {
    ...state,
    display: formatCalcNumber(state.memory),
    unaryLabel: null,
    waitingForOperand: true,
  };
}

export function memoryStore(state: CalculatorState): CalculatorState {
  if (state.hasError) return state;
  const val = parseFloat(state.display);
  if (Number.isNaN(val)) return state;
  return { ...state, memory: val, waitingForOperand: true };
}

export function memoryAdd(state: CalculatorState): CalculatorState {
  if (state.hasError) return state;
  const val = parseFloat(state.display);
  if (Number.isNaN(val)) return state;
  return { ...state, memory: state.memory + val, waitingForOperand: true };
}

export function memorySubtract(state: CalculatorState): CalculatorState {
  if (state.hasError) return state;
  const val = parseFloat(state.display);
  if (Number.isNaN(val)) return state;
  return { ...state, memory: state.memory - val, waitingForOperand: true };
}
