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

    const handleBudgetSave = async () => {
        if (totalSetBudget === 0) {
            alert("Total Set Budget cannot be 0.");
            return;
        }

        // Save all changed budgets
        await Promise.all(
            budgetData.map(async (budget) => {
                if (budget.currentBudget !== budget.setBudget) {
                    await handleSaveBudget(userId, budget.category, budget.setBudget);
                }
            })
        );

        // Save total set budget
        await handleSaveBudget(userId, "Overall", totalSetBudget);

        // Update current budgets with the saved values
        setBudgetData((prevData) =>
            prevData.map((item) => ({
                ...item,
                currentBudget: item.setBudget
            }))
        );

        setSaveStatus('Saved!');
        setTimeout(() => {
            setSaveStatus(null);
        }, 2000);
    };

    const handleResetAll = () => {
        // Reset all set budgets to current budgets
        setBudgetData((prevData) =>
            prevData.map((item) => ({
                ...item,
                setBudget: item.currentBudget
            }))
        );
    };

    const handleAutoSaveChange = (index, value) => {
        const newData = [...budgetData];
        newData[index].setBudget = value;
        setBudgetData(newData);

        if (autoSaveEnabled && totalSetBudget > 0) {
            handleBudgetSave();
        }
    };

    return (
        <div className="budget-page-container">
            <h1 className="budget-page-header">Budget Settings</h1>
            <label>
                <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                />
                Enable Auto-Save
            </label>
            <div className="budget-page-table-container">
                <table className="budget-page-table">
                    <thead>
                    <tr>
                        <th className="budget-page-th">Budget Category</th>
                        <th className="budget-page-th">Current Budget</th>
                        <th className="budget-page-th">Set Budget</th>
                        <th className="budget-page-th">% of Total Budget</th>
                    </tr>
                    </thead>
                    <tbody>
                    {budgetData.map((budget, index) => {
                        const portion = totalSetBudget > 0 ? budget.setBudget / totalSetBudget : 0;
                        const isUnsaved = budget.currentBudget !== budget.setBudget;

                        return (
                            <tr
                                key={index}
                                className="budget-page-tr"
                                style={{ backgroundColor: isUnsaved ? '#fff6cc' : 'transparent' }}
                            >
                                <td className="budget-page-td">{budget.category}</td>
                                <td className="budget-page-td">{budget.currentBudget}</td>
                                <td className="budget-page-td">
                                    <input
                                        type="number"
                                        value={budget.setBudget}
                                        onChange={(e) =>
                                            handleAutoSaveChange(index, parseFloat(e.target.value) || 0)
                                        }
                                    />
                                </td>
                                <td className="budget-page-td">{formatPercentage(portion)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                        <td className="budget-page-td">Overall (Total)</td>
                        <td className="budget-page-td">{totalCurrentBudget}</td>
                        <td className="budget-page-td">{totalSetBudget}</td>
                        <td className="budget-page-td">{formatPercentage(1)}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <div className="budget-page-actions">
                <button
                    className="budget-page-button"
                    onClick={handleBudgetSave}
                    disabled={totalSetBudget === 0}
                >
                    Save Changes
                </button>
                <button
                    className="budget-page-button"
                    onClick={handleResetAll}
                >
                    Reset All
                </button>
            </div>
            <button className="budget-page-button" onClick={onBack} style={{ marginTop: '1rem' }}>
                Back
            </button>
        </div>
    );
};

export default BudgetPage;
