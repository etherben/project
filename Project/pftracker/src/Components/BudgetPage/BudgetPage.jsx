import React, { useEffect, useState } from 'react';

const BudgetPage = ({ userId, handleGetBudget, handleSaveBudget, onBack }) => {
    const [budgetData, setBudgetData] = useState([]);

    useEffect(() => {
        const presetCategories = [
            'General',
            'Food',
            'Entertainment',
            'Shopping',
            'Bills',
            'Vehicle'
        ];

        const fetchBudgets = async () => {
            const updatedData = await Promise.all(
                presetCategories.map(async (category) => {
                    const budget = await handleGetBudget(userId, category);
                    return {
                        category,
                        currentBudget: budget || 0,
                        setBudget: 0
                    };
                })
            );
            setBudgetData(updatedData);
        };

        fetchBudgets();
    }, [userId, handleGetBudget]);

    const handleBudgetSave = async (category, setBudget) => {
        await handleSaveBudget(userId, category, setBudget);
        setBudgetData((prevData) =>
            prevData.map((item) =>
                item.category === category
                    ? { ...item, currentBudget: setBudget }
                    : item
            )
        );
    };

    const totalCurrentBudget = budgetData.reduce((sum, item) => sum + item.currentBudget, 0);
    const totalSetBudget = budgetData.reduce((sum, item) => sum + item.setBudget, 0);

    const formatPercentage = (value) => `${(value * 100).toFixed(1)}%`;

    return (
        <div>
            <h1>Budget Settings</h1>
            <table>
                <thead>
                <tr>
                    <th>Budget Category</th>
                    <th>Current Budget</th>
                    <th>Set Budget</th>
                    <th>% of Total Budget</th>
                </tr>
                </thead>
                <tbody>
                {budgetData.map((budget, index) => {
                    const portion = totalSetBudget > 0 ? budget.setBudget / totalSetBudget : 0;
                    return (
                        <tr key={index}>
                            <td>{budget.category}</td>
                            <td>{budget.currentBudget}</td>
                            <td>
                                <input
                                    type="number"
                                    value={budget.setBudget}
                                    onChange={(e) => {
                                        const newBudgetData = [...budgetData];
                                        newBudgetData[index].setBudget = parseFloat(e.target.value) || 0;
                                        setBudgetData(newBudgetData);
                                    }}
                                />
                                <button onClick={() => handleBudgetSave(budget.category, budget.setBudget)}>
                                    Save
                                </button>
                            </td>
                            <td>{formatPercentage(portion)}</td>
                        </tr>
                    );
                })}
                <tr>
                    <td><strong>Overall (Total)</strong></td>
                    <td><strong>{totalCurrentBudget}</strong></td>
                    <td><strong>{totalSetBudget}</strong></td>
                    <td><strong>{formatPercentage(1)}</strong></td>
                </tr>
                </tbody>
            </table>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default BudgetPage;
