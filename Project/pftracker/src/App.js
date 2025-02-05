import React, { useState, useEffect, useCallback } from "react";
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import MainPage from "./Components/MainPage/MainPage";
import TransactionPage from "./Components/TransactionPage/TransactionPage";

function App() {
  const [userId, setUserId] = useState(null);
  const [isSignup, setSignup] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState("main");  // Track page state

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('id');
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const toggleSignup = () => setSignup(prev => !prev);

  const handleLogout = () => {
    setUserId(null);
    setTransactions([]);
    sessionStorage.removeItem('id');
    setCurrentPage("main"); // Ensure reset
  };

  const handleFetchTransactions = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/transactions/${userId}`);
      if (!response.ok) throw new Error('Failed to retrieve transactions');
      const transactionsData = await response.json();
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  useEffect(() => {
    if (userId) handleFetchTransactions(userId);
  }, [userId, handleFetchTransactions]);

  const handleSignupSubmit = async (userSignupData) => {
    try {
      const response = await fetch(`http://localhost:8080/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userSignupData),
      });
      if (!response.ok) throw new Error('Signup failed');
      const result = await response.json();
      setUserId(result.id);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleLoginSubmit = async (userLoginData) => {
    try {
      const response = await fetch(`http://localhost:8080/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userLoginData),
      });
      if (!response.ok) throw new Error('Login failed');
      const result = await response.json();
      setUserId(result.id);
      sessionStorage.setItem('id', result.id);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
      <div>
        {userId ? (
            currentPage === "main" ? (
                <MainPage
                    userId={userId}
                    transactions={transactions}
                    onLogout={handleLogout}
                    onViewTransactions={() => setCurrentPage("transactions")}
                />
            ) : (
                <TransactionPage
                    transactions={transactions}
                    onBack={() => setCurrentPage("main")}
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
