import React, { useState, useEffect } from 'react';
import './Currency.css';

function LoanCalculator() {
    const [principal, setPrincipal] = useState(1000);
    const [rate, setRate] = useState(5);
    const [duration, setDuration] = useState(1);  // Duration in years
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        calculate();
    }, []);

    const calculate = () => {
        const monthlyInterestRate = (rate / 100) / 12;  // Convert annual rate to monthly and percentage to decimal
        const numberOfPayments = duration * 12;  // Convert years to months

        const numerator = principal * monthlyInterestRate * Math.pow((1 + monthlyInterestRate), numberOfPayments);
        const denominator = Math.pow((1 + monthlyInterestRate), numberOfPayments) - 1;

        const payment = numerator / denominator;
        setMonthlyPayment(payment.toFixed(2));
    };

    return (
        <div className="currency-converter-container">
            <div className="container-loan">
                <div className="input-wrapper">
                    <div>
                        <label htmlFor="principal">Loan Amount (Principal) (₹):</label>
                        <input type="number" id="principal" value={principal} onChange={e => setPrincipal(Number(e.target.value))} />
                    </div>
                    <div>
                        <label htmlFor="rate">Annual Interest Rate(%):</label>
                        <input type="number" id="rate" value={rate} onChange={e => setRate(Number(e.target.value))} />
                    </div>
                    <div>
                        <label htmlFor="duration">Loan Duration (Years):</label>
                        <input type="number" id="duration" value={duration} onChange={e => setDuration(Number(e.target.value))} />
                    </div>
                </div>
                <button onClick={calculate}>Calculate</button>
                <div id="result">
                    <div>Monthly Payment: <span>{monthlyPayment}</span></div>
                </div>
            </div>
        </div>
    );
}

export default LoanCalculator;
