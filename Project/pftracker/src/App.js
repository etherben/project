import logo from './logo.svg';
import './App.css';
import TitleBar from "./Components/TitleBar/TitleBar";
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import React, {useState} from "react";

function App() {
    const[isSignup, setSignup] = useState(true)
    const toggleSignup=() =>{
        setSignup((prev) => !prev);
    }

    const handleSignupSubmit = async (userData) => {
        try {
            const response = await fetch('http://localhost:8080/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('User signed up successfully:', result);
            // You can also handle successful signup here (e.g., redirect or show a success message)
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
    <div>
      <TitleBar/>
      <div>
          {isSignup?(
              <Signup onSwitch={toggleSignup} onSubmit={handleSignupSubmit}/>
          ):(
              <Login onSwitch={toggleSignup}/>
          )
          }
      </div>
    </div>

  );
}

export default App;
