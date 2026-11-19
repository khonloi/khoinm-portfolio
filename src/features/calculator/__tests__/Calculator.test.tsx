import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Calculator from '../Calculator';
import {
  INITIAL_CALCULATOR_STATE,
  inputDigit,
  inputDecimal,
  applySqrt,
  applyReciprocal,
  applyPercent,
  handleOperator,
  evaluateEquals,
} from '../calculatorEngine';
import { isRegisteredWindow } from '../../../config/windowRegistry';

describe('calculatorEngine', () => {
  it('computes nested unary expressions matching reciproc(sqrt(795))', () => {
    let state = INITIAL_CALCULATOR_STATE;
    state = inputDigit(state, '7');
    state = inputDigit(state, '9');
    state = inputDigit(state, '5');
    state = applySqrt(state);
    state = applyReciprocal(state);

    expect(state.expression).toBe('reciproc(sqrt(795))');
    expect(Number(state.display)).toBeCloseTo(1 / Math.sqrt(795), 10);
  });

  it('handles floating point precision and division by zero cleanly', () => {
    let state = INITIAL_CALCULATOR_STATE;
    state = inputDigit(state, '0');
    state = inputDecimal(state);
    state = inputDigit(state, '1');
    state = handleOperator(state, '+');
    state = inputDigit(state, '0');
    state = inputDecimal(state);
    state = inputDigit(state, '2');
    state = evaluateEquals(state);

    expect(state.display).toBe('0.3');

    state = handleOperator(state, '/');
    state = inputDigit(state, '0');
    state = evaluateEquals(state);
    expect(state.hasError).toBe(true);
    expect(state.display).toBe('Cannot divide by zero');
  });

  it('computes percentage relative to accumulator when binary operator is active', () => {
    let state = INITIAL_CALCULATOR_STATE;
    state = inputDigit(state, '2');
    state = inputDigit(state, '0');
    state = inputDigit(state, '0');
    state = handleOperator(state, '+');
    state = inputDigit(state, '1');
    state = inputDigit(state, '5');
    state = applyPercent(state);
    state = evaluateEquals(state);

    expect(state.display).toBe('230');
  });
});

describe('Calculator component', () => {
  it('is registered in the window registry', () => {
    expect(isRegisteredWindow('calculator')).toBe(true);
  });

  it('renders Hayami LayeredBox display, Button keypad without View/Edit/Help menu', () => {
    render(<Calculator id="calculator" />);

    expect(screen.queryByText('View')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();

    const display = screen.getByTestId('calc-display');
    expect(display).toHaveTextContent('0');
    expect(display.closest('.layered-box-layer-1')).toBeInTheDocument();

    const equalsBtn = screen.getByRole('button', { name: 'Equals' });
    expect(equalsBtn).toHaveClass('bg-windows-purple', 'row-span-2', 'trim-corners-ring');

    const zeroBtn = screen.getByRole('button', { name: '0' });
    expect(zeroBtn).toHaveClass('col-span-2', 'trim-corners-ring');
  });

  it('performs arithmetic, memory operations, and keyboard input', () => {
    render(<Calculator id="calculator" />);

    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: 'Square Root' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reciprocal' }));

    expect(screen.getByTestId('calc-expression')).toHaveTextContent('reciproc(sqrt(795))');
    expect(Number(screen.getByTestId('calc-display').textContent)).toBeCloseTo(
      0.0354663451065954,
      12
    );

    // Clear and test memory store/recall/clear
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByTestId('calc-display')).toHaveTextContent('0');

    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Memory Store' }));
    expect(screen.getByTestId('calc-memory-indicator')).not.toHaveClass('invisible');

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    fireEvent.click(screen.getByRole('button', { name: 'Memory Recall' }));
    expect(screen.getByTestId('calc-display')).toHaveTextContent('42');

    fireEvent.click(screen.getByRole('button', { name: 'Memory Clear' }));
    expect(screen.getByTestId('calc-memory-indicator')).toHaveClass('invisible');

    // Keyboard input: 8 * 5 Enter -> 40
    const container = screen.getByLabelText('Calculator');
    fireEvent.keyDown(container, { key: 'Escape' });
    fireEvent.keyDown(container, { key: '8' });
    fireEvent.keyDown(container, { key: '*' });
    fireEvent.keyDown(container, { key: '5' });
    fireEvent.keyDown(container, { key: 'Enter' });
    expect(screen.getByTestId('calc-display')).toHaveTextContent('40');
  });
});
