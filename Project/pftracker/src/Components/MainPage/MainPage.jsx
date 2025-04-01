import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import './MainPage.css';

const MainPage = ({userId, username, transactions, onLogout, onViewTransactions, onViewBudget, handleGetBudget, onViewGraph }) => {
    const chartRef = useRef(null);
    const [budgetData, setBudgetData] = useState(null); // Initialize with null to represent no budget
    const last10Transactions = transactions.slice(-10);

    const aggregateTransactions = (transactions) => {
        const monthlyTotal = transactions
            .filter(transaction => transaction.category !== "Income") // Exclude Income category
            .reduce((amounts, transaction) => {
                const [day, month, year] = transaction.transactionDate.split('/');
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
        const fetchBudget = async () => {
            const budget = await handleGetBudget(userId, 'Overall');
            if (budget !== 0) {
                setBudgetData(budget); // Only set budget if it's not 0 (or any other invalid condition)
            } else {
                setBudgetData(null); // If no budget exists or is 0, set to null
            }
        };

        fetchBudget();
    }, [userId, handleGetBudget]);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        const months = monthlyData.map(item => item.month);
        const totals = monthlyData.map(item => item.total);

        // Create a chart configuration
        const chartSettings = {
            title: {
                text: 'Monthly Transaction Expenditure & Budget',
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
                    name: 'Expenditure',
                },
                // Add the budget data to the chart data only if valid budgetData exists
                budgetData !== null && {
                    data: new Array(months.length).fill(budgetData), // Create a constant budget line
                    type: 'line',
                    lineStyle: {
                        color: 'green',
                        type: 'dashed',
                    },
                    name: 'Budget (Overall)',
                }
            ].filter(Boolean), // Filter out the budget series if it's null (i.e., no budget exists)
        };

        chart.setOption(chartSettings);
        return () => chart.dispose();
    }, [monthlyData, budgetData]); // Re-run chart update when either monthlyData or budgetData changes

    return (
        <div className="main-container">
            <div className="main-header">
                <h1>Welcome, {username}</h1>
                <button onClick={onLogout}>Logout</button>
            </div>
            <div className="content">
                <div className="leftside">
                    <div className="transaction-list">
                        <header className="recent-list-header">Recent Transactions</header>
                        {transactions.length === 0 ? (
                            <p>No transactions yet.</p>
                        ) : (
                            <div className="transaction-table">
                                {/* Table Header Row */}
                                <div className="transaction-header">
                                    <span className="header-item">Date</span>
                                    <span className="header-item">Merchant</span>
                                    <span className="header-item">Amount</span>
                                    <span className="header-item">Category</span>
                                </div>

                                {/* Transaction Rows */}
                                {last10Transactions.map(transaction => (
                                    <div key={transaction.id} className="transaction-row">
                                    <span>{transaction.transactionDate}</span>
                                        <span>{transaction.merchant}</span>
                                        <span>{transaction.amount}</span>
                                        <span>{transaction.category}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={onViewTransactions} className="view-all-btn">View All Transactions</button>
                </div>
                <div className="rightside">
                    <div className="chart-container">
                        <div ref={chartRef} style={{width: '600px', height: '400px'}}></div>
                    </div>
                    <button onClick={onViewBudget} className="view-budget-btn">Goto Budgets</button>
                    <button onClick={onViewGraph} className="view-graph-btn">Go to Graph</button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
