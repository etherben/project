import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import './MainPage.css';

const MainPage = ({ userId, transactions, onLogout, onViewTransactions }) => {
    const chartRef = useRef(null);

    const last10Transactions = transactions.slice(-10);

    const aggregateTransactions = (transactions) => {
        const monthlyTotal = transactions.reduce((amounts, transaction) => {
            const [day, month, year] = transaction.TransactionDate.split('/');
            const date = new Date(`${year}-${month}-${day}`);
            const monthAndYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

            if (!amounts[monthAndYear]) {
                amounts[monthAndYear] = 0;
            }

            amounts[monthAndYear] += parseFloat(transaction.amount);
            return amounts;
        }, {});

        return Object.entries(monthlyTotal).map(([month, total]) => ({ month, total }));
    };

    const monthlyData = aggregateTransactions(transactions);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        const months = monthlyData.map(item => item.month);
        const totals = monthlyData.map(item => item.total);

        const chartSettings = {
            title: {
                text: 'Monthly Transaction Expenditure',
                textStyle: {
                    color: '#000000',
                    fontSize: 18,
                },
            },
            xAxis: {
                type: 'category',
                data: months,
                axisLabel: {
                    textStyle: {
                        color: '#000000',
                    },
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#000000',
                    },
                },
            },
            series: [
                {
                    data: totals,
                    type: 'line',
                    lineStyle: {
                        color: 'black',
                    },
                },
            ],
        };

        chart.setOption(chartSettings);
        return () => chart.dispose();
    }, [monthlyData]);

    return (
        <div className="main-container">
            <div className="main-header">
                <h1>Welcome, User ID: {userId}</h1>
                <button onClick={onLogout}>Logout</button>
            </div>
            <div className="content">
                <div className="leftside">
                    <div className="transaction-list">
                        {transactions.length === 0 ? (
                            <p>No transactions yet.</p>
                        ) : (
                            last10Transactions.map(transaction => (
                                <div key={transaction.id} className="transaction-row">
                                    <span>{transaction.TransactionDate}</span> |
                                    <span>{transaction.merchant}</span> |
                                    <span>{transaction.amount}</span> |
                                    <span>{transaction.category}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <button onClick={onViewTransactions} className="view-all-btn">View All Transactions</button>
                </div>
                <div className="rightside">
                    <div className="chart-container">
                        <div ref={chartRef} style={{ width: '600px', height: '400px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
