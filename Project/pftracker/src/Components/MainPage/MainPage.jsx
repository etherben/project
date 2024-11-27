import React, {useState} from 'react';
import './MainPage.css';

const MainPage = ({ userId, onSubmit }) => {

        const[amount, setAmount] = useState('');
        const[TransactionDate, setDate]= useState('')

        const handleSubmit= async(e)=>{
            e.preventDefault()
            try{
                await onSubmit({userId, amount, TransactionDate})
                setAmount('')
                setDate('') // reset fields
            }catch (error){
                console.error(error)
            }
        }


    return (
        <div className="main-container">
            <h1 className="welcome-message">Welcome, User ID: {userId}</h1>
            <div className="content">
                <div className="leftside">
                    <div className="ManualInput">
                        <h2>Manual Input</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Transaction Date"
                                className="input-box"
                                onChange={(e) => setDate(e.target.value)}/>
                            <input
                                type="number"
                                placeholder="Transaction Amount"
                                className="input-box"
                                onChange={(e) => setAmount(e.target.value)}/>
                            <button type="submit" className="submit-btn">Submit Transaction</button>
                            </form>
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