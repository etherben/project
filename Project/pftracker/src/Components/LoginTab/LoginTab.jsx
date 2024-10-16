import React from 'react'
import './LoginTab.css'
function LoginSignup(){
    return(
        <div className = "container">
            <div className="header">
                <div className="text">Sign Up</div>
            </div>
            <div className="inputs">
                <div className="input">
                    <input type="Email" placeholder = "Email"/>
                </div>
                <div className="input" >
                    <input type="Username" placeholder = "Username"/>
                </div>
                <div className="input">
                    <input type="Password" placeholder = "password"/>
                </div>
            </div>
            <div className="submit-container">
                <div className="submit">Sign Up</div>
                <div className="submit">Login </div>
            </div>
        </div>
    )
}

export default LoginSignup