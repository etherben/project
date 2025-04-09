import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./GraphPage.css";

const GraphPage = ({ userId, transactions, handleGetBudget, onBack }) => {
    const chartRef = useRef(null);
    const [budgetData, setBudgetData] = useState(null); // Changed to null to match condition
    const [filters, setFilters] = useState({ year: "", month: "", category: "" });
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    useEffect(() => {
        fetchBudgetData();
        filterTransactions();
    }, [filters, userId, transactions]);

    const fetchBudgetData = async () => {
        try {
            const categories = ["Food", "Entertainment", "Shopping", "Bills", "Vehicle", "General"];
            const budgetPromises = categories.map(category => handleGetBudget(userId, category));
            const overallBudget = await handleGetBudget(userId, "Overall"); // Fetch the overall budget
            const budgets = await Promise.all(budgetPromises);

            setBudgetData(budgets.reduce((acc, amount, index) => {
                acc[categories[index]] = amount;
                return acc;
            }, { overall: overallBudget })); // Store budget data for each category and overall
        } catch (error) {
            console.error("Error fetching budget data:", error);
        }
    };

    const filterTransactions = () => {
        if (!filters.year) return;

        const filtered = transactions.filter(transaction => {
            const [day, month, year] = transaction.transactionDate.split("/");
            if (transaction.category === "Income") return false; // exclude income

            if (year !== filters.year) return false;
            if (filters.month && month !== filters.month) return false;
            if (filters.category && transaction.category !== filters.category) return false;

            return true;
        });

        setFilteredTransactions(filtered);
    };

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current);

        const groupedData = filters.month
            ? filteredTransactions.map(tx => ({ date: tx.transactionDate, amount: parseFloat(tx.amount) }))
            : aggregateTransactions(filteredTransactions);

        const months = groupedData.map(item => item.date);
        const totals = groupedData.map(item => item.amount);

        // Get the budget based on selected category or default to overall budget
        const budget = filters.category && budgetData
            ? budgetData[filters.category]
            : budgetData?.overall || 0;

        // If a month is selected, adjust the budget to represent a daily budget (divide by 30)
        const dailyBudget = filters.month ? budget / 30 : budget;

        const getTitleText = () => {
            if (filters.month && filters.year) {
                const monthName = new Date(0, parseInt(filters.month) - 1).toLocaleString("default", { month: "long" });
                return `Transactions for ${monthName} ${filters.year}`;
            } else if (filters.year) {
                return `Transactions for ${filters.year}`;
            }
            return "";
        };

        const chartSettings = {
            title: {
                text: getTitleText(),
                textStyle: {
                    color: '#000000',
                    fontSize: 24,
                },
                left: 'center',
                top: '10%',
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
                    const expenditure = params[0].data;

                    const tooltipBackgroundColor = expenditure > dailyBudget
                        ? 'rgba(255, 99, 71, 0.8)' // Red for overspending
                        : 'rgba(144, 238, 144, 0.8)'; // Green for within budget

                    return `
                        <div style="background-color:${tooltipBackgroundColor}; padding: 10px; border-radius: 5px;">
                            <strong>Month: ${params[0].name}</strong><br />
                            Expenditure: ${expenditure}<br />
                            Budget: ${dailyBudget.toFixed(2)}
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
                    symbol: 'circle',
                    symbolSize: 6,
                },
                budgetData && {
                    data: new Array(months.length).fill(dailyBudget), // Use daily budget
                    type: 'line',
                    lineStyle: {
                        color: 'green',
                        type: 'dashed',
                    },
                    name: 'Total Budget',
                }
            ].filter(Boolean), // Remove null values
        };

        chart.setOption(chartSettings);

        return () => chart.dispose();
    }, [filteredTransactions, budgetData, filters]);

    const aggregateTransactions = (transactions) => {
        const monthlyTotals = transactions.reduce((acc, tx) => {
            const [day, month, year] = tx.transactionDate.split("/");
            const key = `${month}/${year}`;
            acc[key] = (acc[key] || 0) + parseFloat(tx.amount);
            return acc;
        }, {});

        return Object.entries(monthlyTotals)
            .sort(([aMonthYear], [bMonthYear]) => {
                const [aMonth, aYear] = aMonthYear.split("/").map(Number);
                const [bMonth, bYear] = bMonthYear.split("/").map(Number);

                if (aYear !== bYear) return aYear - bYear;
                return aMonth - bMonth;
            })
            .map(([date, amount]) => ({ date, amount }));
    };


    return (
        <div className="graph-page">
            <div className="header-container">
                <button onClick={onBack} className="back-button">Back</button>
            </div>
            <div className="filter-container">
                <h3>Filter Transactions</h3>
                <label>
                    Year:
                    <select value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
                        <option value="">Select Year</option>
                        {[...new Set(transactions.map(tx => tx.transactionDate.split("/")[2]))].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Month (Optional):
                    <select value={filters.month} onChange={(e) => setFilters({...filters, month: e.target.value})}>
                        <option value="">Whole Year</option>
                        {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, "0")}>
                                {new Date(0, month - 1).toLocaleString("default", {month: "long"})}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Category (Optional):
                    <select value={filters.category}
                            onChange={(e) => setFilters({...filters, category: e.target.value})}>
                        <option value="">All Categories</option>
                        {[...new Set(transactions.map(tx => tx.category))].map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="graph-container">
                {!filters.year ? (
                    <div className="no-filters-message">
                        <p>Please select filters to view the graph</p>
                    </div>
                ) : (
                    <div ref={chartRef} style={{width: "1200px", height: "800px"}}></div>
                )}
            </div>
        </div>

    );
};

export default GraphPage;
