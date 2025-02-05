import React from 'react';
import './TransactionPage.css';

const TransactionPage = ({ transactions, onBack }) => {
    return (
        <div className="transaction-page">
            <button className="back-btn" onClick={onBack}>← Back</button>
            <h2>All Transactions</h2>
            <div className="transaction-table">
                <div className="table-header">
                    <span>Date</span>
                    <span>Merchant</span>
                    <span>Amount</span>
                </div>
                {transactions.length === 0 ? (
                    <p>No transactions available.</p>
                ) : (
                    transactions.map(transaction => (
                        <div key={transaction.id} className="transaction-row">
                            <span>{transaction.TransactionDate}</span>
                            <span>{transaction.merchant}</span>
                            <span>{transaction.amount}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TransactionPage;