import { useState } from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(`${parseFloat(newValue.toFixed(7))}`);
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(`${parseFloat(newValue.toFixed(7))}`);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black/10 p-6">
      <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
        {/* Display */}
        <div className="mb-4">
          <div className="bg-black/30 rounded-lg p-4 text-right">
            <div className="text-white/60 text-sm font-mono mb-1">
              {previousValue !== null ? `${previousValue} ${operation || ''}` : ''}
            </div>
            <div className="text-white text-2xl font-mono font-bold truncate">
              {display}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <button onClick={clear} className="col-span-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg p-3 font-semibold transition-colors">
            Clear
          </button>
          <button onClick={() => inputOperation('/')} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg p-3 font-semibold transition-colors">
            ÷
          </button>
          <button onClick={() => inputOperation('*')} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg p-3 font-semibold transition-colors">
            ×
          </button>

          {/* Row 2 */}
          <button onClick={() => inputNumber('7')} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            7
          </button>
          <button onClick={() => inputNumber('8')} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            8
          </button>
          <button onClick={() => inputNumber('9')} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            9
          </button>
          <button onClick={() => inputOperation('-')} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg p-3 font-semibold transition-colors">
            −
          </button>

          {/* Row 3 */}
          <button onClick={() => inputNumber('4')} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            4
          </button>
          <button onClick={() => inputNumber('5')} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            5
          </button>
          <button onClick={() => inputNumber('6')} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            6
          </button>
          <button onClick={() => inputOperation('+')} className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg p-3 font-semibold transition-colors">
            +
          </button>

          {/* Row 4 */}
          <button onClick={() => inputNumber('1')} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            1
          </button>
          <button onClick={() => inputNumber('2')} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            2
          </button>
          <button onClick={() => inputNumber('3')} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            3
          </button>
          <button onClick={performCalculation} className="row-span-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg p-3 font-semibold transition-colors">
            =
          </button>

          {/* Row 5 */}
          <button onClick={() => inputNumber('0')} className="col-span-2 bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            0
          </button>
          <button onClick={inputDecimal} className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 font-semibold transition-colors">
            .
          </button>
        </div>
      </div>
    </div>
  );
}