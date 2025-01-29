import './App.css';
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import React, {useCallback, useEffect, useState} from "react";
import MainPage from "./Components/MainPage/MainPage";

function App() {
  const [userId, setUserId] = useState(null);
  const [isSignup, setSignup] = useState(true);
  const [transactions, setTransactions] = useState([]);

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
    sessionStorage.removeItem('id')
    console.log("Logged out Successfully");
  }

  // Load userId from sessionStorage on mount
  //will call fetch transactions at any point to check for new ones
  const handleFetchTransactions = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/transactions/${userId}`, {  // the API call to backend with userId
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve transactions');
      }

      const transactionsData = await response.json();
      console.log('Transactions fetched successfully:', transactionsData);

      // Update state with the fetched transactions
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      handleFetchTransactions(userId);
    }
  }, [userId, handleFetchTransactions]);

  const handleSignupSubmit = async (userSignupData) => {
    try {
      const response = await fetch(`http://localhost:8080/users/create`, {  //calls signup backend functions
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userSignupData),
      });
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      const result = await response.json();
      console.log('User signed up:', result);
      setUserId(result.id); //update userid
    } catch (error) {
      //console.error('Error:', error);
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

  const handleSingleTransactionSubmit = async(transaction) =>{
    console.log("Submitting transaction:", transaction);
    try{
      const response = await fetch(`http://localhost:8081/transactions`, {
        method : 'POST',
        headers:{'Content-Type' : 'application/json'},
        body :JSON.stringify(transaction),
      });
       if (!response.ok){
        throw new Error('Transaction submittion failed');
       }
       const result = await response.text();
       console.log('Transaction successful:', result);
      }catch (error){
      console.error(error);
    }
    await saveTransactions()
  };

  const handleFileTransactionSubmit = async (file) =>{
    console.log("Submitting file", file)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId)
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
   await saveTransactions()
  };

  const saveTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:8081/transactions/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Empty body for save
      });
      if (!response.ok) {
        throw new Error('Transaction saving failed');
      }
      const result = await response.text();
      console.log('Transactions saved successfully:', result);
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  return (
      <div>
        {userId ? (
            <MainPage userId={userId}
                      transactions={transactions}
                      onSingleSubmit={handleSingleTransactionSubmit}
                      onFileSubmit={handleFileTransactionSubmit}
                      handleFetchTransactions={handleFetchTransactions}
                      onLogout={handleLogout}/>
        ) : isSignup ? (
            <Signup onSwitch={toggleSignup} onSubmit={handleSignupSubmit} />
        ) : (
            <Login onSwitch={toggleSignup} onSubmit={handleLoginSubmit} />
        )}
      </div>
  );
}

export default App;