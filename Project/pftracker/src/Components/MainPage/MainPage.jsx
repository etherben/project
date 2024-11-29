import React, { useState } from 'react';
import './MainPage.css';

const MainPage = ({ userId, onSingleSubmit, onFileSubmit }) => {
    const [amount, setAmount] = useState('');
    const [TransactionDate, setDate] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileStatus, setFileStatus] = useState('');

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSingleSubmit({ userId, amount, TransactionDate });
            setAmount('');
            setDate(''); // Reset fields
        } catch (error) {
            console.error('Error submitting transaction:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileStatus(`File selected: ${file.name}`);
        }
    };

    const handleFileSubmit = async () => {
        if (!selectedFile) {
            setFileStatus('Please select a file to upload.');
            return;
        }

        try {
            await onFileSubmit(selectedFile); // Call the function passed from App.js
            setFileStatus('File uploaded successfully.');
            setSelectedFile(null); // Reset file input
        } catch (error) {
            console.error('Error uploading file:', error);
            setFileStatus('Error uploading file.');
        }
    };

    return (
        <div className="main-container">
            <h1 className="welcome-message">Welcome, User ID: {userId}</h1>
            <div className="content">
                <div className="leftside">
                    {/* Manual input */}
                    <div className="ManualInput">
                        <h2>Manual Input</h2>
                        <form onSubmit={handleManualSubmit}>
                            <input
                                type="text"
                                placeholder="Transaction Date"
                                className="input-box"
                                value={TransactionDate}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Transaction Amount"
                                className="input-box"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <button type="submit" className="submit-btn">Submit Transaction</button>
                        </form>
                    </div>
                    {/* File input */}
                    <div className="FileInput">
                        <h2>Upload CSV</h2>
                        <input type="file"
                            accept=".csv"
                            className="file-input"
                            onChange={handleFileChange}
                        />
                        <button onClick={handleFileSubmit} className="submit-btn">
                            Submit CSV
                        </button>
                        <p>{fileStatus}</p>
                    </div>
                </div>

                {/* Transactions side */}
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