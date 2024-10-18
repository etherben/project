import React, {useState} from 'react'
import './Login.css'
const Login = ({onSubmit, onSwitch}) => {
    const handleSubmit= ()=>{
        const username= document.getElementById("login-username")
        const password= document.getElementById("login-password")
        onSubmit({username, password})
    }
    const handleClick = () =>{

    }

    return(
        <div className = "container">
            <div className="header">
                <div className="text">Login</div>
            </div>
            <div className="inputs">
                <div className="input" >
                    <input type="Username" id ="login-username" placeholder = "Username"/>
                </div>
                <div className="input">
                    <input type="Password" id="login-password" placeholder = "Password"/>
                </div>
            </div>
            <div className="submit-container">
                <div className="submit">Login</div>
            </div>
            <div className="switchLogin">Need an account? <span onClick={onSwitch}>Sign Up</span>
            </div>
        </div>
    )
}

export default Login