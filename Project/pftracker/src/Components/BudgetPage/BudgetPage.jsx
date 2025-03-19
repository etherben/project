import React, { useEffect, useState } from 'react';

const BudgetPage = ({ userId, handleGetBudget, handleSaveBudget, onBack }) => {
    const [budgetData, setBudgetData] = useState([]);

    useEffect(() => {
        const presetCategories = [
            'Overall',
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
                    ? { ...item, currentBudget: setBudget } // Update the currentBudget with the new setBudget value
                    : item
            )
        );
    };

    return (
        <div>
            <h1>Budget Settings</h1>
            <table>
                <thead>
                <tr>
                    <th>Budget Category</th>
                    <th>Current Budget</th>
                    <th>Set Budget</th>
                </tr>
                </thead>
                <tbody>
                {budgetData.map((budget, index) => (
                    <tr key={index}>
                        <td>{budget.category}</td>
                        <td>{budget.currentBudget}</td>
                        <td>
                            <input
                                type="number"
                                value={budget.setBudget}
                                onChange={(e) => {
                                    const newBudgetData = [...budgetData];
                                    newBudgetData[index].setBudget = parseFloat(e.target.value);
                                    setBudgetData(newBudgetData);
                                }}
                            />
                            <button onClick={() => handleBudgetSave(budget.category, budget.setBudget)}>
                                Save
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={onBack}>Back</button>
        </div>
    );
};

export default BudgetPage;
