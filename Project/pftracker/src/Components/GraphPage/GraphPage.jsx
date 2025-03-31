import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./GraphPage.css";

const GraphPage = ({ userId, transactions, handleGetBudget, onBack }) => {
    const chartRef = useRef(null);
    const [budgetData, setBudgetData] = useState([]);
    const [filters, setFilters] = useState({ year: "", month: "", category: "" });
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    useEffect(() => {
        fetchBudgetData();
        filterTransactions();
    }, [filters, userId, transactions]);

    const fetchBudgetData = async () => {
        try {
            const categories = ["Food", "Entertainment", "Shopping", "Bills", "Vehicle"];
            const budgetPromises = categories.map(category => handleGetBudget(userId, category));
            const budgets = await Promise.all(budgetPromises);
            setBudgetData(categories.map((category, index) => ({ category, amount: budgets[index] })));
        } catch (error) {
            console.error("Error fetching budget data:", error);
        }
    };

    const filterTransactions = () => {
        if (!filters.year) return;

        const filtered = transactions.filter(transaction => {
            const [day, month, year] = transaction.transactionDate.split("/");

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
            ? filteredTransactions.map(tx => ({ date: tx.transactionDate, amount: parseFloat(tx.amount) })) // map amount and date of filtered trans
            : aggregateTransactions(filteredTransactions);

        const xData = groupedData.map(item => item.date);
        const yData = groupedData.map(item => item.amount);

        const chartOptions = {
            title: { text: "Transactions", left: "center" },
            xAxis: { type: "category", data: xData },
            yAxis: { type: "value" },
            series: [{ data: yData, type: "line", name: "Amount" }],
        };

        chart.setOption(chartOptions);
        return () => chart.dispose();
    }, [filteredTransactions]);

    const aggregateTransactions = (transactions) => {
        const monthlyTotals = transactions.reduce((acc, tx) => {
            const [day, month, year] = tx.transactionDate.split("/");
            const key = `${month}/${year}`;
            acc[key] = (acc[key] || 0) + parseFloat(tx.amount); //aggregate like monthly but can adjust based on user selectrion
            return acc;
        }, {});

        return Object.entries(monthlyTotals).map(([date, amount]) => ({ date, amount }));
    };

    return (
        <div className="graph-page">
            <button onClick={onBack} className="back-button">Back</button>
            <div className="filter-container">
                <h2>Filter Transactions</h2>
                <label>
                    Year:
                    <select value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
                        <option value="">Select Year</option>
                        {[...new Set(transactions.map(tx => tx.transactionDate.split("/")[2]))].map(year => (
                            <option key={year} value={year}>{year}</option>  // make to year
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
                            </option>// select by month
                        ))}
                    </select>
                </label>
                <label>
                    Category (Optional):
                    <select value={filters.category}
                            onChange={(e) => setFilters({...filters, category: e.target.value})}>
                        <option value="">All Categories</option>
                        {[...new Set(transactions.map(tx => tx.category))].map(category => (
                            <option key={category} value={category}>{category}</option> //select by category
                        ))}
                    </select>
                </label>
            </div>
            <div className="graph-container">
                <div ref={chartRef} style={{width: "100%", height: "400px"}}></div>
            </div>
        </div>
    );
};

export default GraphPage;
