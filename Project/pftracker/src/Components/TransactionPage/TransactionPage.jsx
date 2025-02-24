import React, {useRef, useState} from 'react';
import './TransactionPage.css';

const TransactionPage = ({userId, transactions, transactionsToAdd, onBack, onSingleSubmit, onFileSubmit, handleFetchTransactions, handleFetchBufferedTransactions, saveTransactions}) => {
    const [addTranModal, setTranModalOpen] = useState(false);
    const [manualTranModal, setManualTranModalOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({ userId, TransactionDate: '', merchant: '', amount: '' });
    const fileInputRef = useRef(null);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file)
        }
    };

    const handleFileUpload = async (file) => {
        if (file) {
            try {
                await onFileSubmit(file);
                handleFetchBufferedTransactions();
                console.log('Big Success is nice')
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
            console.error('Error saving transactions')
        }
    }

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
        setNewTransaction((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddManualTransaction = async () => {
        const dateParts = newTransaction.TransactionDate.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Convert to dd/mm/yyyy
        const amount = parseFloat(newTransaction.amount);
        // Update the transaction with the formatted date and double amount
        const transactionToSubmit = {
            ...newTransaction,
            TransactionDate: formattedDate,
            amount: amount
        };
        try {
            await onSingleSubmit(transactionToSubmit);
            handleFetchBufferedTransactions();
            console.log('CONFUSION')
        } catch (error) {
            console.error('Error manual transaction:', error);
        }

        setNewTransaction({TransactionDate: '', merchant: '', amount: ''});
        handleCloseManualModal();
    };

    return (
        <div className="transaction-container">
            <div className="transaction-header">
                <button onClick={onBack} className="back-button">Back</button>
                <button className="add-transaction-btn" onClick={handleOpenModal}>Add Transaction</button>
            </div>
            <div className="transaction-list">
                <div className="transaction-row" style={{ fontWeight: 'bold', borderBottom: '2px solid #000' }}>
                    <span>Date</span>
                    <span>Merchant</span>
                    <span>Amount</span>
                </div>
                {transactions.length === 0 ? (
                    <p>No transactions available.</p>
                ) : (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="transaction-row">
                            <span>{transaction.TransactionDate}</span>
                            <span>{transaction.merchant}</span>
                            <span>${transaction.amount}</span>
                        </div>
                    ))
                )}
            </div>

            {addTranModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Transactions to be Added</h2>
                        <div className="modal-buttons">
                            <button onClick={triggerFileInput}>Add File</button>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="file-input"
                                style={{display: 'none'}}
                            />
                            <button className="manual-input-btn" onClick={handleOpenManualModal}>Manual Input</button>
                        </div>

                        <div className="transaction-list">
                            <div className="transaction-row header-row">
                                <span>Date</span>
                                <span>Merchant</span>
                                <span>Amount</span>
                            </div>
                            {transactionsToAdd.length === 0 ? (
                                <p>No transactions ready to add.</p>
                            ) : (
                                transactionsToAdd.map((transaction, index) => (
                                    <div key={index} className="transaction-row">
                                        <span>{transaction.TransactionDate}</span>
                                        <span>{transaction.merchant}</span>
                                        <span>${transaction.amount}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <button onClick={addTransactions} className="save-transactions-btn">
                            Save Transactions
                        </button>
                        <button onClick={handleCloseModal} className="close-modal-btn">Close</button>
                    </div>
                </div>
            )}

            {manualTranModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Enter Transaction Details</h2>
                        <input
                            type="date"
                            name="TransactionDate"
                            placeholder="dd/mm/yyyy"
                            value={newTransaction.TransactionDate}
                            onChange={handleManualInputChange}
                        />
                        <input
                            type="text"
                            name="merchant"
                            placeholder="Merchant"
                            value={newTransaction.merchant}
                            onChange={handleManualInputChange}
                        />
                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={newTransaction.amount}
                            onChange={handleManualInputChange}
                        />
                        <button onClick={handleAddManualTransaction}>Add Transaction</button>
                        <button onClick={handleCloseManualModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionPage;
