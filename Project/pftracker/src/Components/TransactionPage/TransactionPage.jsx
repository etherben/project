import React, {useRef, useState} from 'react';
import './TransactionPage.css';

const TransactionPage = ({userId, transactions, transactionsToAdd, onBack, onFileSubmit, handleFetchTransactions, handleFetchBufferedTransactions,saveTransactions}) => {
    const [addTranModal, setTranModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null)
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
                await onFileSubmit(file);    //send file to backend
                handleFetchBufferedTransactions();    // gets buffered transactions and adds to transactionsToAdd list
                console.log('Big Sucess is nice')
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };


    // WILL WANT A FUNCTION THAT SAVES BUFFERED TRANSACTION THEN CALLS HANDLE FETCH, SO TRANSACTION LIST UPDATES

    const addTransactions = async () => {
        try{
            await saveTransactions();
            handleFetchTransactions(userId);
        } catch (error){
            console.error('Error saving transactions')
        }
    }

    const handleOpenModal = () => {
        setTranModalOpen(true);
    };

    const handleCloseModal = () => {
        setTranModalOpen(false);
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

            {/* Add Transaction Section */}
            {addTranModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Transactions to be Added</h2>

                        {/* Action Buttons */}
                        <div className="modal-buttons">
                            <button onClick={triggerFileInput}>Add File</button>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="file-input"
                                style={{display: 'none'}}  // Hides the input element
                            />
                            <button className="manual-input-btn">Manual Input</button>
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
                                transactionsToAdd.map((transaction, index) => ( //need index as transactions wont have id yet
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
        </div>
    );
};

export default TransactionPage;
