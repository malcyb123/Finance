import React, { useState, useEffect } from 'react';
import './Currency.css'; // Assuming the CSS you provided is in 'style.css' in the same directory

function SimpleInterest() {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [time, setTime] = useState(1);
  const [duration, setDuration] = useState('year');
  const [result, setResult] = useState({});

  useEffect(() => {
    calculate();
  }, []);

  const calculate = () => {
    let p = principal;
    let r = rate;
    let t = time;
    let simpleInterest =
      duration === "year" ? (p * r * t) / 100 : (p * r * t) / 1200;
    let amount = p + simpleInterest;

    setResult({
      principalAmount: p.toFixed(2),
      totalInterest: simpleInterest.toFixed(2),
      totalAmount: amount.toFixed(2)
    });
  };

  return (
    <div className="currency-converter-container">
        <div className="input-wrapper">
          <div>
            <label htmlFor="principal">Principal(₹):</label>
            <input type="number" id="principal" value={principal} onChange={e => setPrincipal(Number(e.target.value))} />
          </div>
          <div>
            <label htmlFor="rate">Rate:</label>
            <input type="number" id="rate" value={rate} onChange={e => setRate(Number(e.target.value))} />
          </div>
        </div>
        <div className="time-wrapper">
          <label htmlFor="time">Time:</label>
          <input type="number" id="time" value={time} onChange={e => setTime(Number(e.target.value))} />
          <select name="duration" id="duration" value={duration} onChange={e => setDuration(e.target.value)}>
            <option value="year">Year</option>
            <option value="month">Month</option>
          </select>
        </div>
        <button onClick={calculate}>Calculate</button>
        <div id="result">
          <div>Principal Amount: <span>{result.principalAmount}</span></div>
          <div>Total Interest: <span>{result.totalInterest}</span></div>
          <div>Total Amount: <span>{result.totalAmount}</span></div>
        </div>
      </div>

  );
}

export default SimpleInterest;
