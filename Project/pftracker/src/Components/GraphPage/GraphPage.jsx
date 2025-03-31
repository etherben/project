import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "./GraphPage.css";

const GraphPage = ({ userId, transactions, handleGetBudget, handleFilterTransactions }) => {
    const chartRef = useRef(null);
    const [budgetData, setBudgetData] = useState(null);
    const [filters, setFilters] = useState({ startDate: "", endDate: "", category: "", merchant: "" });

    const aggregateTransactions = (transactions) => {
        const monthlyTotal = transactions
            .filter(transaction => transaction.category !== "Income") // Exclude Income category
            .reduce((amounts, transaction) => {
                const [day, month, year] = transaction.transactionDate.split("/");
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

    useEffect(() => {
        fetchBudgetData();
        handleFilterTransactions(userId, filters);
    }, [filters, userId]);

    useEffect(() => {
        if (!chartRef.current) return;
        const chart = echarts.init(chartRef.current);

        const monthlyData = aggregateTransactions(transactions);
        const months = monthlyData.map(item => item.month);
        const totals = monthlyData.map(item => item.total);

        const chartSettings = {
            title: {
                text: "Monthly Transaction Expenditure & Budget",
                textStyle: { color: "#000", fontSize: 18 },
            },
            xAxis: {
                type: "category",
                data: months,
                axisLabel: { textStyle: { color: "#000" } },
            },
            yAxis: {
                type: "value",
                axisLabel: { textStyle: { color: "#000" } },
            },
            series: [
                {
                    data: totals,
                    type: "line",
                    lineStyle: { color: "black" },
                    name: "Expenditure",
                },
                budgetData !== null && {
                    data: new Array(months.length).fill(budgetData),
                    type: "line",
                    lineStyle: { color: "green", type: "dashed" },
                    name: "Budget (Overall)",
                },
            ].filter(Boolean),
        };

        chart.setOption(chartSettings);
        return () => chart.dispose();
    }, [transactions, budgetData]);

    const fetchBudgetData = async () => {
        try {
            const budget = await handleGetBudget(userId, "Overall");
            setBudgetData(budget !== 0 ? budget : null);
        } catch (error) {
            console.error("Error fetching budget data:", error);
        }
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setFilters(filters);
    };

    return (
        <div className="graph-page">
            <div className="filter-container">
                <h2>Filter Transactions</h2>
                <form onSubmit={handleFilterSubmit}>
                    <label>Start Date: <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} /></label>
                    <label>End Date: <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} /></label>
                    <label>Category: <input type="text" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} /></label>
                    <label>Merchant: <input type="text" value={filters.merchant} onChange={(e) => setFilters({ ...filters, merchant: e.target.value })} /></label>
                    <button type="submit">Filter</button>
                </form>
            </div>
            <div className="graph-container">
                <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>
            </div>
        </div>
    );
};

export default GraphPage;
