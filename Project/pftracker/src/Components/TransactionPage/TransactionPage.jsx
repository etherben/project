import React, { useRef, useState } from 'react';
import './TransactionPage.css';

const TransactionPage = ({
                             userId,
                             transactions,
                             onEditTransaction,
                             handleDeleteTransaction,
                             transactionsToAdd,
                             onBack,
                             onSingleSubmit,
                             onFileSubmit,
                             handleFetchTransactions,
                             handleFetchBufferedTransactions,
                             saveTransactions,
                             handleFilterTransactions
                         }) => {
    const [addTranModal, setTranModalOpen] = useState(false);
    const [manualTranModal, setManualTranModalOpen] = useState(false);
    const [editTranModal, setEditTranModal] = useState(false);
    const [newTransaction, setNewTransaction] = useState({ userId, transactionDate: '', merchant: '', amount: '', category: '' });
    const fileInputRef = useRef(null);
    const [filter, setFilter] = useState({merchant: '', category: '', startDate: '', endDate: ''});

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file) => {
        if (file) {
            try {
                await onFileSubmit(file);
                handleFetchBufferedTransactions();
                console.log('Big Success is nice');
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const addTransactions = async () => {
        try {
            await saveTransactions();
            handleFetchTransactions(userId);
        } catch (error) {
            console.error('Error saving transactions');
        }
    };

    const handleOpenModal = () => {
        setTranModalOpen(true);
    };

    const handleCloseModal = () => {
        setTranModalOpen(false);
    };

    const handleOpenManualModal = () => {
        setManualTranModalOpen(true);
    };

    const handleCloseManualModal = () => {
        setManualTranModalOpen(false);
    };

    const handleManualInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "transactionDate") {
            //convert date to correct format
            const dateParts = value.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Convert to dd/mm/yyyy
            setNewTransaction((prev) => ({ ...prev, [name]: formattedDate }));
        } else {
            setNewTransaction((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCloseEditModal = () => {
        setEditTranModal(false);
    };

    const handleAddManualTransaction = async () => {
        const amount = parseFloat(newTransaction.amount);
        const transactionToSubmit = {
            ...newTransaction,
            amount: amount
        };

        try {
            await onSingleSubmit(transactionToSubmit);
            handleFetchBufferedTransactions();
            console.log('CONFUSION');
        } catch (error) {
            console.error('Error manual transaction:', error);
        }

        setNewTransaction({ transactionDate: '', merchant: '', amount: '', category: '' });
        handleCloseManualModal();
    };

    const onDeleteTransaction = async (transactionId) => {
        try {
            await handleDeleteTransaction(transactionId);
            handleFilterTransactions(userId, filter);
        } catch (error) {
            console.error('Error Deleting:', error);
        }
    };

    const handleEditTransaction = (transaction) => {
        setNewTransaction({
            id: transaction.id,
            transactionDate: transaction.transactionDate,
            merchant: transaction.merchant,
            amount: transaction.amount,
            category: transaction.category || ''  // Make sure category is included
        });
        setEditTranModal(true);
    };

    const handleEditSubmit = async () => {
        const updatedTransaction = {
            ...newTransaction,
            amount: parseFloat(newTransaction.amount),
        };

        try {
            await onEditTransaction(newTransaction.id, updatedTransaction);
            handleFetchTransactions(userId); // Fetch updated transactions after edit
            setNewTransaction({ transactionDate: '', merchant: '', amount: '', category: '' });
            setEditTranModal(false);
        } catch (error) {
            console.error('Error editing transaction:', error);
        }
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const updatedFilter = {
            ...filter,
            startDate: filter.startDate && !isNaN(new Date(filter.startDate)) ? new Date(filter.startDate) : null,
            endDate: filter.endDate && !isNaN(new Date(filter.endDate)) ? new Date(filter.endDate) : null,
        };
        console.log('Sending filter:', updatedFilter);
        handleFilterTransactions(userId, updatedFilter);
    };

    const formatDateForInput = (date) => {
        const dateParts = date.split('/');
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert back to yyyy-mm-dd for edit
    };

    const handleBack = ()=> {
        handleFetchTransactions(userId);
        onBack();
    };

    return (
        <div className="transaction-page-container">
            <div className="transaction-page-header">
                <button onClick={handleBack} className="transaction-page-back-btn">Back</button>
                <div className="transaction-page-filter-section">
                    <form onSubmit={handleFilterSubmit} className="transaction-page-filter-form">
                        <input
                            type="text"
                            placeholder="Merchant"
                            value={filter.merchant}
                            onChange={(e) => setFilter({...filter, merchant: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={filter.category}
                            onChange={(e) => setFilter({...filter, category: e.target.value})}
                        />
                        <input
                            type="date"
                            value={filter.startDate}
                            onChange={(e) => setFilter({...filter, startDate: e.target.value})}
                        />
                        <input
                            type="date"
                            value={filter.endDate}
                            onChange={(e) => setFilter({...filter, endDate: e.target.value})}
                        />
                        <button type="submit">Filter</button>
                    </form>
                </div>
                <button className="transaction-page-add-btn" onClick={handleOpenModal}>Add Transaction</button>
            </div>
            <div className="transaction-page-list">
                <div className="transaction-page-row transaction-page-header-row">
                    <span>Date</span>
                    <span>Merchant</span>
                    <span>Amount</span>
                    <span>Category</span>
                    <span>        </span>
                    <span>       </span>
                </div>
                {transactions.length === 0 ? (
                    <p>No transactions available.</p>
                ) : (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="transaction-page-row">
                            <span>{transaction.transactionDate}</span>
                            <span>{transaction.merchant}</span>
                            <span>${transaction.amount}</span>
                            <span>{transaction.category}</span>
                            <span><button className="transaction-page-edit-btn" onClick={() => handleEditTransaction(transaction)}>Edit</button></span>
                            <span><button className="transaction-page-delete-btn" onClick={() => onDeleteTransaction(transaction.id)}>Delete</button></span>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Adding Transactions */}
            {addTranModal && (
                <div className="transaction-page-modal-overlay">
                    <div className="transaction-page-modal-content">
                        <h2>Transactions to be Added</h2>
                        <div className="transaction-page-modal-buttons">
                            <button className="transaction-page-add-file-btn" onClick={triggerFileInput}>Add File</button>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="transaction-page-file-input"
                                style={{ display: 'none' }}
                            />
                            <button className="transaction-page-manual-input-btn" onClick={handleOpenManualModal}>Manual Input</button>
                        </div>

                        <div className="transaction-page-list">
                            <div className="transaction-page-row transaction-page-header-row">
                                <span>Date</span>
                                <span>Merchant</span>
                                <span>Amount</span>
                                <span>Category</span>
                            </div>
                            {transactionsToAdd.length === 0 ? (
                                <p>No transactions ready to add.</p>
                            ) : (
                                transactionsToAdd.map((transaction, index) => (
                                    <div key={index} className="transaction-page-row">
                                        <span>{transaction.transactionDate}</span>
                                        <span>{transaction.merchant}</span>
                                        <span>${transaction.amount}</span>
                                        <span>{transaction.category}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <button onClick={addTransactions} className="transaction-page-save-btn">
                            Save Transactions
                        </button>
                        <button onClick={handleCloseModal} className="transaction-page-close-modal-btn">Close</button>
                    </div>
                </div>
            )}

            {/* Modal for Manual Transaction Input */}
            {manualTranModal && (
                <div className="transaction-page-modal-overlay">
                    <div className="transaction-page-modal-content">
                        <h2>Enter Transaction Details</h2>
                        <h3>Date:</h3>
                        <input
                            type="date"
                            name="transactionDate"
                            placeholder="dd/mm/yyyy"
                            value={formatDateForInput(newTransaction.transactionDate)}
                            onChange={handleManualInputChange}
                        />
                        <h3>Merchant:</h3>
                        <input
                            type="text"
                            name="merchant"
                            placeholder="Merchant"
                            value={newTransaction.merchant}
                            onChange={handleManualInputChange}
                        />
                        <h3>Amount:</h3>
                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={newTransaction.amount}
                            onChange={handleManualInputChange}
                        />
                        <h3>Category:</h3>
                        <select
                            name="category"
                            value={newTransaction.category}
                            onChange={handleManualInputChange}
                        >
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                            <option value="Vehicle">Vehicle</option>
                        </select>
                        <button className="add-manual-button" onClick={handleAddManualTransaction}>Add Transaction
                        </button>
                        <button className="manual-cancel-button" onClick={handleCloseManualModal}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Modal for Editing Transaction */}
            {editTranModal && (
                <div className="transaction-page-modal-overlay">
                    <div className="transaction-page-modal-content">
                        <h2>Edit Transaction</h2>
                        <h3>Date:</h3>
                        <input
                            type="date"
                            name="transactionDate"
                            value={formatDateForInput(newTransaction.transactionDate)}
                            onChange={handleManualInputChange}
                        />
                        <h3>Merchant:</h3>
                        <input
                            type="text"
                            name="merchant"
                            value={newTransaction.merchant}
                            onChange={handleManualInputChange}
                        />
                        <h3>Amount:</h3>
                        <input
                            type="number"
                            name="amount"
                            value={newTransaction.amount}
                            onChange={handleManualInputChange}
                        />
                        <h3>Category:</h3>
                        <select
                            name="category"
                            value={newTransaction.category}
                            onChange={handleManualInputChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                            <option value="Vehicle">Vehicle</option>
                        </select>

                        <button className="save-edit-btn" onClick={handleEditSubmit}>Save Changes</button>
                        <button className="cancel-edit-btn"  onClick={handleCloseEditModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionPage;

