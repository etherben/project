import React, { useEffect, useState } from 'react';
import './BudgetPage.css';
const BudgetPage = ({ userId, handleGetBudget, handleSaveBudget, onBack }) => {
    const [budgetData, setBudgetData] = useState([]);
    const [saveStatus, setSaveStatus] = useState({});
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

    useEffect(() => {
        const presetCategories = ['General', 'Food', 'Entertainment', 'Shopping', 'Bills', 'Vehicle'];

        const fetchBudgets = async () => {
            const updatedData = await Promise.all(
                presetCategories.map(async (category) => {
                    const budget = await handleGetBudget(userId, category);
                    return {
                        category,
                        currentBudget: budget || 0,
                        setBudget: budget || 0
                    };
                })
            );
            setBudgetData(updatedData);
        };

        fetchBudgets();
    }, [userId, handleGetBudget]);

    const totalCurrentBudget = budgetData.reduce((sum, item) => sum + item.currentBudget, 0);
    const totalSetBudget = budgetData.reduce((sum, item) => sum + item.setBudget, 0);

    const formatPercentage = (value) => `${(value * 100).toFixed(1)}%`;

    const handleBudgetSave = async (category, setBudget) => {
        if (totalSetBudget === 0) {
            alert("Total Set Budget cannot be 0.");
            return;
        }

        await handleSaveBudget(userId, category, setBudget);
        setBudgetData((prevData) =>
            prevData.map((item) =>
                item.category === category
                    ? { ...item, currentBudget: setBudget }
                    : item
            )
        );

        setSaveStatus((prev) => ({ ...prev, [category]: 'Saved!' }));
        setTimeout(() => {
            setSaveStatus((prev) => ({ ...prev, [category]: null }));
        }, 2000);
    };

    const handleReset = (index) => {
        const newData = [...budgetData];
        newData[index].setBudget = newData[index].currentBudget;
        setBudgetData(newData);
    };

    const handleAutoSaveChange = (index, value) => {
        const newData = [...budgetData];
        newData[index].setBudget = value;
        setBudgetData(newData);

        if (autoSaveEnabled && totalSetBudget > 0) {
            handleBudgetSave(newData[index].category, value);
        }
    };

    return (
        <div className="budget-container">
            <h1>Budget Settings</h1>
            <label>
                <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                />
                Enable Auto-Save
            </label>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Budget Category</th>
                        <th>Current Budget</th>
                        <th>Set Budget</th>
                        <th>% of Total Budget</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {budgetData.map((budget, index) => {
                        const portion = totalSetBudget > 0 ? budget.setBudget / totalSetBudget : 0;
                        const isUnsaved = budget.currentBudget !== budget.setBudget;

                        return (
                            <tr
                                key={index}
                                style={{ backgroundColor: isUnsaved ? '#fff6cc' : 'transparent' }}
                            >
                                <td>{budget.category}</td>
                                <td>{budget.currentBudget}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={budget.setBudget}
                                        onChange={(e) =>
                                            handleAutoSaveChange(index, parseFloat(e.target.value) || 0)
                                        }
                                    />
                                </td>
                                <td>{formatPercentage(portion)}</td>
                                <td>
                                    {!autoSaveEnabled && (
                                        <button
                                            onClick={() =>
                                                handleBudgetSave(budget.category, budget.setBudget)
                                            }
                                            disabled={totalSetBudget === 0}
                                        >
                                            Save
                                        </button>
                                    )}
                                    <button onClick={() => handleReset(index)}>Reset</button>
                                    {saveStatus[budget.category] && (
                                        <span style={{ marginLeft: '8px', color: 'green' }}>
                                                {saveStatus[budget.category]}
                                            </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                        <td>Overall (Total)</td>
                        <td>{totalCurrentBudget}</td>
                        <td>{totalSetBudget}</td>
                        <td>{formatPercentage(1)}</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <button onClick={onBack} style={{ marginTop: '1rem' }}>Back</button>
        </div>
    );
};

export default BudgetPage;
