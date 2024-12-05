import React, {useState, useRef, useEffect} from 'react';
import * as echarts from 'echarts';
import './MainPage.css';

const MainPage = ({ userId, onSingleSubmit, onFileSubmit, transactions, handleFetchTransactions}) => {
    const [amount, setAmount] = useState('');
    const [TransactionDate, setDate] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileStatus, setFileStatus] = useState('');
    const [merchant,setMerchant] = useState("")


    const handleManualSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSingleSubmit({ userId, amount, TransactionDate, merchant});
            setAmount('');
            setDate('');
            handleFetchTransactions(userId);
        } catch (error) {
            console.error('Error submitting transaction:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileStatus(`File selected: ${file.name}`);
        }
    };

    const handleFileSubmit = async () => {
        if (!selectedFile) {
            setFileStatus('Please select a file to upload.');
            return;
        }
        try {
            await onFileSubmit(selectedFile);
            setFileStatus('File uploaded successfully.');
            setSelectedFile(null);
            handleFetchTransactions(userId);
        } catch (error) {
            console.error('Error uploading file:', error);
            setFileStatus('Error uploading file.');
        }
    };

    const aggregateTransactions = (transactions) => {
        const monthlyTotal = transactions.reduce((amounts, transaction) => {
            const [day, month, year] = transaction.TransactionDate.split('/');
            const date = new Date(`${year}-${month}-${day}`); // Convert to yyyy-mm-dd format for it not to get confused with object
            const monthAndYear = `${date.getMonth() + 1}/${date.getFullYear()}`  // Gets month and year of transaction
                                                                                        // +1 on month becuase .date() obj starts at 0 = jan for some reason
            if (!amounts[monthAndYear]) {  // if doesnt exist
                amounts[monthAndYear] = 0; // initialize that month/year
            }

            amounts[monthAndYear] += parseFloat(transaction.amount);
            return amounts;
        }, {}); // start it as empty object
        return Object.entries(monthlyTotal).map(([month, total]) => ({month,total})); //create array of object with {month,total}
    }                                                                                                          //and map to list on document

    const monthlyData = aggregateTransactions(transactions);

    const chartRef = useRef(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        const months = monthlyData.map(item => item.month);
        const totals = monthlyData.map(item => item.total);

        const chartSettings = {
            title: {
                text: 'Monthly Transaction Expenditure',
                textStyle: {
                    color: '#000000', // title text black
                    fontSize: 18,
                },
            },
            xAxis: {
                type: 'category',
                data: months,
                axisLabel: {
                    textStyle: {
                        color: '#000000', // label text color
                    },
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#000000', // label text color
                    },
                },
            },
            series: [
                {
                    data: totals,
                    type: 'line',
                    lineStyle: {
                        color: 'black', // Line color
                    },
                },
            ],
        };
        chart.setOption(chartSettings);
    }, [monthlyData]);


    return  (
        <div className="main-container">
            <h1 className="welcome-message">Welcome, User ID: {userId}</h1>
            <div className="content">
                <div className="leftside">
                    {/* Manual input */}
                    <div className="ManualInput">
                        <h2>Manual Input</h2>
                        <form onSubmit={handleManualSubmit}>
                            <input
                                type="text"
                                placeholder="Transaction Date"
                                className="input-box"
                                value={TransactionDate}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Transaction Amount"
                                className="input-box"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Merchant Name"
                                className="input-box"
                                value={merchant}
                                onChange={(e) => setMerchant(e.target.value)}
                            />
                            <button type="submit" className="submit-btn">Submit Transaction</button>
                        </form>
                    </div>
                    {/* File input */}
                    <div className="FileInput">
                        <h2>Upload CSV</h2>
                        <input
                            type="file"
                            accept=".csv"
                            className="file-input"
                            onChange={handleFileChange}
                        />
                        <button onClick={handleFileSubmit} className="submit-btn">
                            Submit CSV
                        </button>
                        <p>{fileStatus}</p>
                    </div>

                    {/* Chart Section */}
                    <div className="chart-container">
                        <div ref={chartRef} style={{width:'600px', height: '600px'}}></div>
                    </div>
                </div>

                {/* Transactions side */}
                <div className="rightside">
                    <h2>Transactions</h2>
                    <div className="transaction-list">
                        {/* Header Row */}
                        <div className="transaction-header">
                            <span className="header-item">Date</span>
                            <span className="separator">|</span>
                            <span className="header-item">Merchant</span>
                            <span className="separator">|</span>
                            <span className="header-item">Amount</span>
                        </div>

                        {/* Transactions Rows */}
                        {transactions.length === 0 ? (
                            <p>No transactions to show yet.</p>
                        ) : (
                            transactions.map((transaction) => (
                                <div key={transaction.id} className="transaction-row">
                                    <span className="transaction-date">{transaction.TransactionDate}</span>
                                    <span className="separator">|</span>
                                    <span className="header-item">{transaction.merchant}</span>
                                    <span className="separator">|</span>
                                    <span className="transaction-amount">{transaction.amount}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default MainPage;