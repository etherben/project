import './App.css';
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import React, { useCallback, useEffect, useState } from "react";
import MainPage from "./Components/MainPage/MainPage";
import TransactionPage from "./Components/TransactionPage/TransactionPage";

function App() {
  const [userId, setUserId] = useState(null);
  const [isSignup, setSignup] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [transactionsToAdd, setTransactionsToAdd] = useState([]);
  const [showTransactionPage, setShowTransactionPage] = useState(false);
//use effect for user id
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const toggleSignup = () => {
    setSignup(prev => !prev);
  };

  const handleLogout = () => {
    setUserId(null);
    setTransactions([]);
    sessionStorage.removeItem('id');
    console.log("Logged out Successfully");
  };

 //Function to get buffered transactions User hasnt yet saved
  const handleFetchBufferedTransactions = async (transactionsToAdd) =>{
    try {
      const response = await fetch(`http://localhost:8081/transactions`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve transactions');
      }

      const transactionsData = await response.json();
      console.log('Transactions fetched successfully:', transactionsData);
      setTransactionsToAdd(transactionsData);
    }catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }



// This is for getting all transactions from user in DATABASE
  const handleFetchTransactions = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/transactions/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve transactions');
      }

      const transactionsData = await response.json();
      console.log('Transactions fetched successfully:', transactionsData);

      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  //To keep the All transactions list updated
  useEffect(() => {
    if (userId) {
      handleFetchTransactions(userId);
    }
  }, [userId, handleFetchTransactions]);

  const handleSignupSubmit = async (userSignupData) => {
    try {
      const response = await fetch(`http://localhost:8080/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userSignupData),
      });
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      const result = await response.json();
      console.log('User signed up:', result);
      setUserId(result.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLoginSubmit = async (userLoginData) => {
    try {
      const response = await fetch(`http://localhost:8080/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userLoginData),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const result = await response.json();
      setUserId(result.id);
      sessionStorage.setItem('id', result.id);
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  //IMPOPRTANT
  const handleSingleTransactionSubmit = async (transaction) => {
    console.log("Submitting transaction:", transaction);
    try {
      const response = await fetch(`http://localhost:8081/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) {
        throw new Error('Transaction submission failed');
      }
      const result = await response.text();
      console.log('Transaction successful:', result);
    } catch (error) {
      console.error(error);
    }
   // await saveTransactions();
  };


  //HERE WE GO
  const handleFileTransactionSubmit = async (file) => {
    console.log("Submitting file", file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    try {
      const response = await fetch(`http://localhost:8081/transactions/bulk`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      const result = await response.text();
      console.log('File uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
   // await saveTransactions();   We dont want to call this while transactions are in buffer
  };

  //Save the transactions once user confirms in add transactions
  const saveTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:8081/transactions/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Transaction saving failed');
      }
      const result = await response.text();
      console.log('Transactions saved successfully:', result);
      setTransactionsToAdd([])
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };


  return (
      <div>
        {userId ? (
            showTransactionPage ? (
                <TransactionPage
                    userId={userId}
                    transactions={transactions} // All of users transactions
                    transactionsToAdd ={transactionsToAdd} //Buffered transaction list to add
                    onFileSubmit={handleFileTransactionSubmit}
                    handleFetchTransactions={handleFetchTransactions}
                    handleFetchBufferedTransactions={handleFetchBufferedTransactions}
                    saveTransactions = {saveTransactions}
                    onBack={() => setShowTransactionPage(false)} />
            ) : (
                <MainPage
                    userId={userId}
                    transactions={transactions}
                    onSingleSubmit={handleSingleTransactionSubmit}
                    onFileSubmit={handleFileTransactionSubmit}
                    handleFetchTransactions={handleFetchTransactions}
                    onLogout={handleLogout}
                    onViewTransactions={() => setShowTransactionPage(true)}
                />
            )
        ) : isSignup ? (
            <Signup onSwitch={toggleSignup} onSubmit={handleSignupSubmit} />
        ) : (
            <Login onSwitch={toggleSignup} onSubmit={handleLoginSubmit} />
        )}
      </div>
  );
}

export default App;