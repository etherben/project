import React from 'react';
import './MainPage.css';

const MainPage = ({ userId }) => {
    return (
        <div className="main-container">
            <h1 className="welcome-message">Welcome, User ID: {userId}</h1>
            <div className="content">
                <div className="leftside">
                    <div className="ManualInput">
                        <h2>Manual Input</h2>
                        <input type="text" placeholder="Transaction Date" className="input-box" />
                        <input type="number" placeholder="Transaction Amount" className="input-box" />
                        <button className="submit-btn">Submit Transaction</button>
                    </div>
                    <div className="FileInput">
                        <h2>Upload CSV</h2>
                        <div className="drag-drop-area">
                            Drag and drop your CSV file here
                        </div>
                        <button className="submit-btn">Submit CSV</button>
                    </div>
                </div>


                <div className="rightside">
                    <h2>Transactions</h2>
                    <div className="transaction-list">
                        <p>No transactions to show yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;