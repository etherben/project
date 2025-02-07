import React from 'react';
import './TransactionPage.css';

const TransactionPage = ({ transactions, onBack }) => {
    return (
        <div className="transaction-container">
            <div className="transaction-header">
                <button onClick={onBack} className="back-button">Back</button>
                <button className="add-transaction-btn">Add Transaction</button>
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
        </div>
    );
};

export default TransactionPage;
