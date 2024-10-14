import logo from './logo.svg';
import './App.css';
import TitleBar from "./Components/TitleBar/TitleBar";
import LoginSignup from "./Components/LoginTab/LoginTab";
import React from "react";

function App() {
  return (
    <div>
      <TitleBar />
      <div>
        <LoginSignup />
      </div>
    </div>

  );
}

export default App;
