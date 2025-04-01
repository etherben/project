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
                amounts[monthAndYear] = Math.round(amounts[monthAndYear] * 100) / 100; // Round to 2 decimals for pennies
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

        // Get only the last 6 months of data
        const recentMonthsData = monthlyData.slice(-6);
        const months = recentMonthsData.map(item => item.month);
        const totals = recentMonthsData.map(item => item.total);

        // Create a chart configuration
        const chartSettings = {
            title: {
                text: '6 Most Recent Months',
                textStyle: {
                    color: '#000000',
                    fontSize: 24,
                },
                left: 'center',
                top: '5%',
                textAlign: 'center',
                textBaseline: 'middle',
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 10,
                textStyle: {
                    color: '#000',
                },
                formatter: function (params) {
                    const expenditure = params[0].data; // Expenditure data
                    const budget = budgetData; // Overall budget

                    // Set background color based on Expenditure vs Budget
                    const tooltipBackgroundColor = expenditure > budget ? 'rgba(255, 99, 71, 0.8)' : 'rgba(144, 238, 144, 0.8)'; // Red if Expenditure > Budget, else green (kept to light colours)

                    return `
                <div style="background-color:${tooltipBackgroundColor}; padding: 10px; border-radius: 5px;">
                    <strong>Month: ${params[0].name}</strong><br />
                    Expenditure: ${expenditure}<br />
                    Budget: ${budget}
                </div>
            `;
                },
            },
            grid: {
                left: '10%',
                right: '10%',
                top: '15%',
                bottom: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: months,
                axisLabel: {
                    textStyle: {
                        color: '#000000',
                        fontSize: 16,
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc',
                    },
                },
                axisTick: {
                    lineStyle: {
                        color: '#ccc',
                    },
                },
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#000000',
                        fontSize: 16,
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc',
                    },
                },
                axisTick: {
                    lineStyle: {
                        color: '#ccc',
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: '#ccc',
                    },
                },
            },
            series: [
                {
                    data: totals,
                    type: 'line',
                    lineStyle: {
                        color: 'red',
                        type: 'dashed',
                    },
                    name: 'Total Spent',
                    symbol: 'circle', // Optional: Shows circles at data points
                    symbolSize: 6,
                },
                // Add the budget data to the chart data only if valid budgetData exists
                budgetData !== null && {
                    data: new Array(months.length).fill(budgetData), // Create a constant budget line
                    type: 'line',
                    lineStyle: {
                        color: 'green',
                        type: 'dashed',
                    },
                    name: 'Total Budget',
                }
            ].filter(Boolean), // Filter out the budget series if it's null
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
                        <div ref={chartRef} style={{width: '800px', height: '600px'}}></div>
                    </div>
                    <button onClick={onViewGraph} className="view-graph-btn">Go to Graph</button>
                    <button onClick={onViewBudget} className="view-budget-btn">Goto Budgets</button>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
