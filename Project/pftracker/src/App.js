import './App.css';
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import React, {useState} from "react";

function App() {
  const[isSignup, setSignup] = useState(true)
  const toggleSignup=() =>{
    setSignup((prev) => !prev);
  }

  const handleSignupSubmit = async (userSignupData) => {
    try {
      const response = await fetch('http://localhost:8080/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSignupData),
      });

      if (!response.ok) {
        // Handle the response error
        const errorData = await response.json(); // use json() to parse error body
        throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }


      const result = await response.json();
      console.log('User signed up successfully:', result);
    } catch (error) {
      console.error(error);
    }
  };
  const handleLoginSubmit = async (userLoginData) =>{
    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userLoginData),
      });
      if (!response.ok){
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const result = await  response.json();
      console.log('Successful ', result)
    }catch (error){
      console.error(error)
    }
    }
  return (
      <div>
        <div>
          {isSignup?(
              <Signup onSwitch={toggleSignup} onSubmit={handleSignupSubmit}/>
          ):(
              <Login onSwitch={toggleSignup} onSubmit={handleLoginSubmit}/>
          )
          }
        </div>
      </div>

  );
}

export default App;

