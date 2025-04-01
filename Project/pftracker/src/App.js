import './App.css';
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import React, { useCallback, useEffect, useState } from "react";
import MainPage from "./Components/MainPage/MainPage";
import TransactionPage from "./Components/TransactionPage/TransactionPage";
import BudgetPage from "./Components/BudgetPage/BudgetPage";
import GraphPage from "./Components/GraphPage/GraphPage";

function App() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null)
  const [isSignup, setSignup] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [transactionsToAdd, setTransactionsToAdd] = useState([]);
  const [showTransactionPage, setShowTransactionPage] = useState(false);
  const [showBudgetPage, setShowBudgetPage] = useState(false);
  const [showGraphPage, setShowGraphPage] = useState(false);
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
    setUsername(null);
    setTransactions([]);
    sessionStorage.removeItem('id');
    console.log("Logged out Successfully");
  };

 //Function to get buffered transactions User hasnt yet saved
  const handleFetchBufferedTransactions = async () =>{
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
      setUsername(result.username);
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
      setUsername(result.username);
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
    formData.append('csv_file', file);
    formData.append('bank_name', 'Starling');   //Starling is only one mapped currently
    try {
      const mappingResponse = await fetch(`http://localhost:5000/map-bank-statement`, {
        method: 'POST',
        body: formData,            //Send to mapping
      });
      if (!mappingResponse.ok) {
        throw new Error('Failed to Map file');
      }

      const formattedCSVBlob = await mappingResponse.blob();  //Recieve from mapping
      const formattedCSVFile = new File([formattedCSVBlob], "transactions.csv", {
        type: 'text/csv',  //change back to correct type
      });

      const transactionFormData = new FormData();
      transactionFormData.append('file', formattedCSVFile);  //Create form of formatted data
      transactionFormData.append('userId', userId);

      const transactionResponse = await fetch('http://localhost:8081/transactions/bulk', {
        method: 'POST',
        body: transactionFormData,
      });


      if (!transactionResponse.ok) {
        throw new Error('Failed to upload formatted CSV to the transaction service');
      }
      const result = await transactionResponse.text();
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

  const deleteTransaction = async (transactionId) => {
    try {
      const response = await fetch(`http://localhost:8081/transactions/${transactionId}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
      });
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      console.log('Deleted Transaction')
    }catch (error){
      console.error(error)
    }
  };
  const handleEditTransaction = async (transactionId, updatedTransaction) => {
    try {
      const response = await fetch(`http://localhost:8081/transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTransaction),
      });
      if (!response.ok) {
        throw new Error('Failed to edit transaction');
      }
      console.log('Transaction updated successfully');
    } catch (error) {
      console.error('Error editing transaction:', error);
    }
  };

  const handleFilterTransactions = async (userId,filters) => {
    try {
      const queryParams = new URLSearchParams();

      // Always include userId
      queryParams.append('userId', userId);

      // Creating the query with the optional filters
      if (filters.merchant) queryParams.append('merchant', filters.merchant);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      console.log('Sending filter:', filters);

      const response = await fetch(`http://localhost:8081/transactions/filter?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch filtered transactions');
      }

      const data = await response.json();
      console.log('Filtered transactions:', data); // log to check for now
      setTransactions(data)
    } catch (error) {
      console.error('Error filtering transactions:', error);
    }
  };
  const handleSaveBudget = async (userId, category, amount) => {
    try {
      const response = await fetch(`http://localhost:8082/budget/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({category, amount}),
      });
      if (!response.ok) {
        throw new Error('Failed to save budget');
      }
      console.log('Budget updated successfully');
    } catch (error) {
      console.error('Error editing Budget:', error);
    }
  };
  const handleGetBudget = useCallback(async (userId, category) => {
    try {
      const response = await fetch(`http://localhost:8082/budget/${userId}/${category}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to get budget');
      }

      const data = await response.json()
      console.log('Budget retreived successfully:', data);
      return data.amount;

    } catch (error) {
      console.error('Error getting Budget:', error);
      return 0;
    }
  },[]);


  return (
      <div>
        {userId ? (
            showTransactionPage ? (
                <TransactionPage
                    userId={userId}
                    transactions={transactions} // All of users transactions
                    transactionsToAdd ={transactionsToAdd} //Buffered transaction list to add
                    onFileSubmit={handleFileTransactionSubmit}
                    onSingleSubmit={handleSingleTransactionSubmit}
                    handleFetchTransactions={handleFetchTransactions}
                    handleFetchBufferedTransactions={handleFetchBufferedTransactions}
                    saveTransactions = {saveTransactions}
                    handleDeleteTransaction={deleteTransaction}
                    onEditTransaction={handleEditTransaction}
                    handleFilterTransactions={handleFilterTransactions}
                    onBack={() => setShowTransactionPage(false)} />
            ) : showBudgetPage ? (
                <BudgetPage
                    userId={userId}
                    handleGetBudget={handleGetBudget}
                    handleSaveBudget={handleSaveBudget}
                    onBack={() => setShowBudgetPage(false)}
                />
            ) : showGraphPage ? (
                    <GraphPage
                        userId={userId}
                        handleGetBudget={handleGetBudget}
                        transactions={transactions}
                        handleFilterTransactions={handleFilterTransactions}
                        onBack={() => setShowGraphPage(false)}
                    />
                ):(
                <MainPage
                    userId={userId}
                    username={username}
                    transactions={transactions}
                    handleGetBudget={handleGetBudget}
                    onSingleSubmit={handleSingleTransactionSubmit}
                    onFileSubmit={handleFileTransactionSubmit}
                    handleFetchTransactions={handleFetchTransactions}
                    onLogout={handleLogout}
                    onViewTransactions={() => setShowTransactionPage(true)}
                    onViewBudget={() => setShowBudgetPage(true)}
                    onViewGraph={() => setShowGraphPage(true)}
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