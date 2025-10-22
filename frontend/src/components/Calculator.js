// components/Calculator.js
import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  // Функция для добавления символа в выражение
  const handleInput = (value) => {
    setExpression(prev => prev + value);
    setError('');
  };

  // Функция для очистки выражения
  const clearExpression = () => {
    setExpression('');
    setResult('');
    setSteps([]);
    setError('');
  };

  // Функция для удаления последнего символа
  const backspace = () => {
    setExpression(prev => prev.slice(0, -1));
    setError('');
  };

  // Функция для вычисления выражения
  const calculate = () => {
    if (!expression) return;
    
    try {
      // Безопасное вычисление выражения
      const calcResult = safeEvaluate(expression);
      setResult(calcResult.toString());
      
      // Генерируем пошаговое решение
      generateSteps(expression, calcResult);
      setError('');
    } catch (err) {
      setError('Ошибка вычисления');
      setResult('');
      setSteps([]);
    }
  };

  // Безопасная функция вычисления
  const safeEvaluate = (expr) => {
    // Заменяем математические функции и константы
    let safeExpr = expr
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/π/g, 'Math.PI')
      .replace(/pi/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/\^/g, '**');

    // Проверяем на безопасные символы
    const safeRegex = /^[0-9+\-*/().\sMathPIEsincostanlogsqrt]*$/;
    if (!safeRegex.test(safeExpr)) {
      throw new Error('Недопустимые символы в выражении');
    }

    // Используем Function для безопасного вычисления
    return Function(`"use strict"; return (${safeExpr})`)();
  };

  // Функция для генерации пошагового решения
  const generateSteps = (expr, res) => {
    const newSteps = [];
    newSteps.push(`Исходное выражение: ${expr}`);
    
    // Простое упрощение для демонстрации
    if (expr.includes('(')) {
      newSteps.push('Шаг 1: Вычисление выражений в скобках');
    }
    
    if (expr.includes('**')) {
      newSteps.push('Шаг 2: Возведение в степень');
    }
    
    if (expr.includes('*') || expr.includes('/')) {
      newSteps.push('Шаг 3: Умножение и деление');
    }
    
    if (expr.includes('+') || expr.includes('-')) {
      newSteps.push('Шаг 4: Сложение и вычитание');
    }
    
    newSteps.push(`Результат: ${expr} = ${res}`);
    setSteps(newSteps);
  };

  // Функции для специальных операций
  const handleSquareRoot = () => {
    setExpression(prev => prev + 'sqrt(');
  };

  const handlePower = () => {
    setExpression(prev => prev + '^');
  };

  const handlePi = () => {
    setExpression(prev => prev + 'π');
  };

  const handleE = () => {
    setExpression(prev => prev + 'e');
  };

  const handleFunction = (func) => {
    setExpression(prev => prev + func + '(');
  };

  // Обработка нажатия клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (e.key === '+') {
        handleInput('+');
      } else if (e.key === '-') {
        handleInput('-');
      } else if (e.key === '*') {
        handleInput('*');
      } else if (e.key === '/') {
        handleInput('/');
      } else if (e.key === '.') {
        handleInput('.');
      } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape') {
        clearExpression();
      } else if (e.key === '(') {
        handleInput('(');
      } else if (e.key === ')') {
        handleInput(')');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expression]);

  return (
    <div className="calculator-page">
      <h1>Умный научный калькулятор</h1>
      <div className="calculator">
        <div className="display">
          <div className="expression">{expression || '0'}</div>
          <div className="result">
            {error ? <span className="error">{error}</span> : result}
          </div>
        </div>
        
        {steps.length > 0 && (
          <div className="solution-steps">
            <h3>Пошаговое решение:</h3>
            {steps.map((step, index) => (
              <div key={index} className="step">{step}</div>
            ))}
          </div>
        )}
        
        <div className="keypad">
          <button className="key clear" onClick={clearExpression}>C</button>
          <button className="key function" onClick={backspace}>⌫</button>
          <button className="key function" onClick={() => handleFunction('sin')}>sin</button>
          <button className="key function" onClick={() => handleFunction('cos')}>cos</button>
          <button className="key function" onClick={() => handleFunction('tan')}>tan</button>
          
          <button className="key function" onClick={() => handleFunction('log')}>log</button>
          <button className="key function" onClick={() => handleFunction('ln')}>ln</button>
          <button className="key function" onClick={handleSquareRoot}>√</button>
          <button className="key operator" onClick={() => handleInput('/')}>/</button>
          
          <button className="key function" onClick={() => handleInput('(')}>(</button>
          <button className="key function" onClick={() => handleInput(')')}>)</button>
          <button className="key function" onClick={handlePower}>x^y</button>
          <button className="key operator" onClick={() => handleInput('*')}>×</button>
          
          <button className="key" onClick={() => handleInput('7')}>7</button>
          <button className="key" onClick={() => handleInput('8')}>8</button>
          <button className="key" onClick={() => handleInput('9')}>9</button>
          <button className="key operator" onClick={() => handleInput('-')}>-</button>
          
          <button className="key" onClick={() => handleInput('4')}>4</button>
          <button className="key" onClick={() => handleInput('5')}>5</button>
          <button className="key" onClick={() => handleInput('6')}>6</button>
          <button className="key operator" onClick={() => handleInput('+')}>+</button>
          
          <button className="key" onClick={() => handleInput('1')}>1</button>
          <button className="key" onClick={() => handleInput('2')}>2</button>
          <button className="key" onClick={() => handleInput('3')}>3</button>
          <button className="key equals" onClick={calculate} rowSpan="2">=</button>
          
          <button className="key zero" onClick={() => handleInput('0')}>0</button>
          <button className="key" onClick={() => handleInput('.')}>.</button>
          <button className="key function" onClick={handlePi}>π</button>
          <button className="key function" onClick={handleE}>e</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;