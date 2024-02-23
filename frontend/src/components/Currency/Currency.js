import React, { useEffect, useState } from 'react';
import './Currency.css';
import CurrencyRow from './CurrencyRow'
import SimpleInterest from './SimpleInterest';
import LoanCalculator from './LoanCalculator';  // Adjust the path accordingly
import { exchangeRatesData } from './ExchangeRates'; 


function App() {
  const [currencyRates, setCurrencyRates] = useState(exchangeRatesData.conversion_rates);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR'); 
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [showSimpleInterest, setShowSimpleInterest] = useState(false);
  const [activeComponent, setActiveComponent] = useState('CURRENCY_CONVERTER');


  function computeRate(fromCurrency, toCurrency, rates) {
    if (fromCurrency === "USD") return rates[toCurrency];
    if (toCurrency === "USD") return 1 / rates[fromCurrency];
    return rates[toCurrency] / rates[fromCurrency];
  }

  const initialRate = computeRate('USD', 'EUR', currencyRates); 
  const [exchangeRate, setExchangeRate] = useState(initialRate);

  useEffect(() => {
    if (currencyRates) {
      const newRate = computeRate(fromCurrency, toCurrency, currencyRates);
      setExchangeRate(newRate);
    }
  }, [fromCurrency, toCurrency, currencyRates]);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <div className="app-container">
        <div className="button-container">
            <button onClick={() => setActiveComponent('CURRENCY_CONVERTER')}>Currency Converter</button>
            <button onClick={() => setActiveComponent('SIMPLE_INTEREST')}>Simple Interest Calculator</button>
            <button onClick={() => setActiveComponent('LOAN_CALCULATOR')}>Loan Calculator</button>
        </div>

        <div className="content-center">
            {activeComponent === 'SIMPLE_INTEREST' ? (<SimpleInterest />) : 
            activeComponent === 'LOAN_CALCULATOR' ? (<LoanCalculator />) :
            (
                <div className="currency-converter-container">
             <h1>Currency Converter</h1>
             <CurrencyRow
                 currencyOptions={Object.keys(currencyRates)}
                 selectedCurrency={fromCurrency}
                 onChangeCurrency={e => setFromCurrency(e.target.value)}
                 onChangeAmount={handleFromAmountChange}
                 amount={fromAmount}
             />
             <div className="equals"><h1>=</h1></div>
             <CurrencyRow
                 currencyOptions={Object.keys(currencyRates)}
                 selectedCurrency={toCurrency}
                 onChangeCurrency={e => setToCurrency(e.target.value)}
                 onChangeAmount={handleToAmountChange}
                 amount={toAmount}
                 />
                 </div>
             )}
        </div>
    </div>
)};
export default App;