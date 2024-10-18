import logo from './logo.svg';
import './App.css';
import TitleBar from "./Components/TitleBar/TitleBar";
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import React from "react";

function App() {
  return (
    <div>
      <TitleBar/>
      <div>
        <Login/>

      </div>
    </div>

  );
}

export default App;
