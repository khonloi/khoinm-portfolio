import React, { memo, useState, useCallback } from 'react';
import Button from '../../components/Button';
import LayeredBox from '../../components/LayeredBox';
import { playSound } from '../../data/sounds';
import {
  INITIAL_CALCULATOR_STATE,
  type CalculatorState,
  inputDigit,
  inputDecimal,
  backspace,
  clearEntry,
  clearAll,
  negate,
  applySqrt,
  applyReciprocal,
  applyPercent,
  handleOperator,
  evaluateEquals,
  memoryClear,
  memoryRecall,
  memoryStore,
  memoryAdd,
  memorySubtract,
} from './calculatorEngine';

export interface CalculatorProps {
  id?: string;
}

const BackspaceArrowIcon: React.FC = () => (
  <svg
    viewBox="0 0 14 10"
    fill="currentColor"
    shapeRendering="crispEdges"
    className="w-[clamp(0.875rem,5.5cqi,1.25rem)] h-auto"
    aria-hidden="true"
  >
    <rect x="4" y="4" width="9" height="2" />
    <rect x="3" y="3" width="2" height="4" />
    <rect x="2" y="2" width="1" height="6" />
    <rect x="1" y="4" width="1" height="2" />
  </svg>
);

const Calculator = memo<CalculatorProps>(() => {
  const [state, setState] = useState<CalculatorState>(INITIAL_CALCULATOR_STATE);

  const runAction = useCallback(
    (updater: (prev: CalculatorState) => CalculatorState) => {
      setState((prev) => updater(prev));
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const { key } = e;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        runAction((s) => inputDigit(s, key));
      } else if (key === '.' || key === ',') {
        e.preventDefault();
        runAction(inputDecimal);
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        runAction((s) => handleOperator(s, key));
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        runAction(evaluateEquals);
        playSound('expand').catch(() => {});
      } else if (key === 'Backspace') {
        e.preventDefault();
        runAction(backspace);
      } else if (key === 'Escape') {
        e.preventDefault();
        runAction(clearAll);
      } else if (key === 'Delete') {
        e.preventDefault();
        runAction(clearEntry);
      } else if (key === '%') {
        e.preventDefault();
        runAction(applyPercent);
      }
    },
    [runAction]
  );

  const hasMemory = state.memory !== 0;

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Calculator"
      className="flex flex-col items-center justify-center w-full h-full md:min-w-[18rem] md:h-auto [.maximized_&]:md:w-full [.maximized_&]:md:h-full bg-windows-grey text-windows-black font-main select-none overflow-y-auto p-3 outline-none"
    >
      <div className="flex flex-col w-full max-w-[268px] [.maximized_&]:max-w-[320px] gap-3">
        {/* Sunken LCD Display */}
        <LayeredBox
          variant="inward"
          bgColor="#ffffff"
          parentBgColor="#c0c0c0"
          className="w-full shrink-0"
        >
          <div className="flex flex-col justify-between h-[4.75rem] px-2.5 py-1.5 bg-windows-white [container-type:inline-size]">
            <div className="flex items-center justify-between gap-2 h-5 shrink-0">
              <span
                data-testid="calc-memory-indicator"
                className={`px-1 text-xs font-bold leading-tight ${
                  hasMemory
                    ? 'bg-windows-yellow text-windows-black border border-windows-grey-dark'
                    : 'invisible'
                }`}
                aria-hidden={!hasMemory}
              >
                M
              </span>
              <span
                data-testid="calc-expression"
                className="text-[clamp(0.75rem,4.5cqi,1rem)] text-windows-grey-dark truncate text-right flex-1 font-main"
              >
                {state.expression}
              </span>
            </div>
            <div
              data-testid="calc-display"
              role="status"
              aria-live="polite"
              className="text-right font-main font-bold text-[clamp(1.375rem,10cqi,2.125rem)] text-windows-black tracking-wider truncate tabular-nums pt-0.5"
            >
              {state.display}
            </div>
          </div>
        </LayeredBox>

        {/* 5x6 Keypad Grid matching screenshot (View/Edit/Help omitted) */}
        <div className="grid grid-cols-5 grid-rows-6 gap-2 [container-type:inline-size]">
          {/* Row 1: Memory Controls */}
          <Button
            variant="none"
            onClick={() => runAction(memoryClear)}
            title="Memory Clear"
            ariaLabel="Memory Clear"
            className={`w-full h-full aspect-square text-[clamp(0.875rem,6.5cqi,1.375rem)] font-button font-bold ${
              hasMemory ? 'bg-windows-yellow' : ''
            }`}
          >
            MC
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(memoryRecall)}
            title="Memory Recall"
            ariaLabel="Memory Recall"
            className="w-full h-full aspect-square text-[clamp(0.875rem,6.5cqi,1.375rem)] font-button font-bold text-red-600"
          >
            MR
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(memoryStore)}
            title="Memory Store"
            ariaLabel="Memory Store"
            className="w-full h-full aspect-square text-[clamp(0.875rem,6.5cqi,1.375rem)] font-button font-bold text-red-600"
          >
            MS
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(memoryAdd)}
            title="Memory Add"
            ariaLabel="Memory Add"
            className="w-full h-full aspect-square text-[clamp(0.875rem,6.5cqi,1.375rem)] font-button font-bold text-red-600"
          >
            M+
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(memorySubtract)}
            title="Memory Subtract"
            ariaLabel="Memory Subtract"
            className="w-full h-full aspect-square text-[clamp(0.875rem,6.5cqi,1.375rem)] font-button font-bold text-red-600"
          >
            M-
          </Button>

          {/* Row 2: Edit & Unary Controls */}
          <Button
            variant="none"
            onClick={() => runAction(backspace)}
            title="Backspace"
            ariaLabel="Backspace"
            className="w-full h-full aspect-square text-[clamp(0.875rem,6.5cqi,1.375rem)] font-button text-[#ad0056]"
          >
            <BackspaceArrowIcon />
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(clearEntry)}
            title="Clear Entry"
            ariaLabel="Clear Entry"
            className="w-full h-full aspect-square text-[clamp(0.875rem,6.5cqi,1.375rem)] font-button font-bold text-[#ad0056]"
          >
            CE
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(clearAll)}
            title="Clear"
            ariaLabel="Clear"
            className="w-full h-full aspect-square text-[clamp(0.875rem,6.5cqi,1.375rem)] font-button font-bold text-[#ad0056]"
          >
            C
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(negate)}
            title="Negate"
            ariaLabel="Negate"
            className="w-full h-full aspect-square text-[clamp(1.125rem,8.5cqi,1.75rem)] font-button font-bold text-red-600"
          >
            ±
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(applySqrt)}
            title="Square Root"
            ariaLabel="Square Root"
            className="w-full h-full aspect-square text-[clamp(1.125rem,8.5cqi,1.75rem)] font-button font-bold text-red-600"
          >
            √
          </Button>

          {/* Row 3 */}
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '7'))}
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            7
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '8'))}
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            8
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '9'))}
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            9
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => handleOperator(s, '/'))}
            title="Divide"
            ariaLabel="Divide"
            className="w-full h-full aspect-square text-[clamp(1.125rem,8.5cqi,1.75rem)] font-button font-bold text-red-600"
          >
            /
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(applyPercent)}
            title="Percent"
            ariaLabel="Percent"
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-button font-bold text-red-600"
          >
            %
          </Button>

          {/* Row 4 */}
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '4'))}
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            4
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '5'))}
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            5
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '6'))}
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            6
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => handleOperator(s, '*'))}
            title="Multiply"
            ariaLabel="Multiply"
            className="w-full h-full aspect-square text-[clamp(1.125rem,8.5cqi,1.75rem)] font-button font-bold text-red-600"
          >
            *
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(applyReciprocal)}
            title="Reciprocal"
            ariaLabel="Reciprocal"
            className="w-full h-full aspect-square text-[clamp(0.875rem,6.5cqi,1.375rem)] font-button font-bold text-red-600"
          >
            1/x
          </Button>

          {/* Row 5 */}
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '1'))}
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            1
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '2'))}
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            2
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '3'))}
            className="w-full h-full aspect-square text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            3
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => handleOperator(s, '-'))}
            title="Subtract"
            ariaLabel="Subtract"
            className="w-full h-full aspect-square text-[clamp(1.125rem,8.5cqi,1.75rem)] font-button font-bold text-red-600"
          >
            -
          </Button>

          {/* Equals spans Rows 5 & 6 in Column 5 */}
          <Button
            variant="none"
            onClick={() => {
              runAction(evaluateEquals);
              playSound('expand').catch(() => {});
            }}
            title="Equals"
            ariaLabel="Equals"
            className="row-span-2 w-full h-full text-[clamp(1.375rem,10.5cqi,2.25rem)] font-button font-bold bg-windows-purple"
            layer1ClassName="border-[#e2b4ce] text-windows-white group-active:border-[#7d4364]"
            layer2ClassName="border-[#7d4364]"
          >
            =
          </Button>

          {/* Row 6: 0 spans Columns 1 & 2 */}
          <Button
            variant="none"
            onClick={() => runAction((s) => inputDigit(s, '0'))}
            className="col-span-2 w-full h-full text-[clamp(1rem,7.5cqi,1.5rem)] font-main font-bold"
          >
            0
          </Button>
          <Button
            variant="none"
            onClick={() => runAction(inputDecimal)}
            title="Decimal"
            ariaLabel="Decimal"
            className="w-full h-full aspect-square text-[clamp(1.125rem,8.5cqi,1.75rem)] font-main font-bold"
          >
            .
          </Button>
          <Button
            variant="none"
            onClick={() => runAction((s) => handleOperator(s, '+'))}
            title="Add"
            ariaLabel="Add"
            className="w-full h-full aspect-square text-[clamp(1.125rem,8.5cqi,1.75rem)] font-button font-bold text-red-600"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
});

Calculator.displayName = 'Calculator';

export default Calculator;
