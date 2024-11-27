import './App.css';
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import React, { useEffect, useState } from "react";
import MainPage from "./Components/MainPage/MainPage";

function App() {
  const [isSignup, setSignup] = useState(null);
  const toggleSignup = () => {
    setSignup(prev => !prev);
  };

  const [userId, setUserId] = useState(null);

  // Load userId from sessionStorage on mountk
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('id');
    if (storedUserId) {
      setUserId(storedUserId);
    }

  }, []);



  const handleSignupSubmit = async (userSignupData) => {
    try {
      const response = await fetch('http://localhost:8080/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userSignupData),
      });
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      const result = await response.json();
      console.log('User signed up:', result);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLoginSubmit = async (userLoginData) => {
    try {
      const response = await fetch('http://localhost:8080/users/login', {
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
      const response = await fetch('http://localhost:8080/transactions', {
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

    //instant saving for now
    try{
      const response = await fetch('http://localhost:8080/transactions/save', {
        method : 'POST',
        headers:{'Content-Type' : 'application/json'},
        //empty body to save
      });
      if (!response.ok){
        throw new Error('Transaction submittion failed');
      }
      const result = await response.text();
      console.log('Transaction successful:', result);
    }catch (error){
      console.error(error);
    }
  };

  return (
      <div>
        {userId ? (
            <MainPage userId={userId} onSubmit={handleSingleTransactionSubmit} />
        ) : isSignup ? (
            <Signup onSwitch={toggleSignup} onSubmit={handleSignupSubmit} />
        ) : (
            <Login onSwitch={toggleSignup} onSubmit={handleLoginSubmit} />
        )}
      </div>
  );
}

export default App;