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
  return (
    <div>
      <TitleBar/>
      <div>
          {isSignup?(
              <Signup onSwitch={toggleSignup}/>
          ):(
              <Login onSwitch={toggleSignup}/>
          )
          }
      </div>
    </div>

  );
}

export default App;
