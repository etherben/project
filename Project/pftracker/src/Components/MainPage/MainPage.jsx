import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import './MainPage.css';

const MainPage = ({ userId, transactions, onLogout, onViewTransactions }) => {
    const chartRef = useRef(null);
    const last10Transactions = transactions.slice(-10);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        const option = {
            title: { text: 'Monthly Transaction Expenditure' },
            xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar'] },
            yAxis: { type: 'value' },
            series: [{ data: [150, 200, 100], type: 'line' }]
        };
        chart.setOption(option);
        return () => chart.dispose();
    }, []);

    return (
        <div className="main-container">
            <div className="main-header">
                <h1>Welcome, User ID: {userId}</h1>
                <button onClick={onLogout}>Logout</button>
            </div>
            <div className="content">
                <div className="leftside">

                    <div className="transaction-list">
                        {last10Transactions.length === 0 ? (
                            <p>No transactions yet.</p>
                        ) : (
                            last10Transactions.map(transaction => (
                                <div key={transaction.id} className="transaction-row">
                                    <span>{transaction.TransactionDate}</span> | <span>{transaction.merchant}</span> | <span>{transaction.amount}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <button onClick={onViewTransactions} className="view-all-btn">View All Transactions</button>
                </div>
                <div className="rightside">
                    <div className="chart-container">
                        <div ref={chartRef}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
