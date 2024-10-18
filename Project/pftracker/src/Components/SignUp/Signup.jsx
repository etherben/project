import React, {useState} from 'react'
import './Signup.css'
const Signup = ({onSubmit}) => {
      const handleSubmit= ()=>{
          const email= document.getElementById("signup-email")
          const username= document.getElementById("signup-username")
          const password= document.getElementById("signup-password")
          onSubmit({email, username, password})
      }
    return(
        <div className = "container">
            <div className="header">
                <div className="text">Sign Up</div>
            </div>
            <div className="inputs">
                <div className="input">
                    <input type="Email" id = "signup-email" placeholder = "Email"/>
                </div>
                <div className="input" >
                    <input type="Username" id ="signup-username" placeholder = "Username"/>
                </div>
                <div className="input">
                    <input type="Password" id="signup-password" placeholder = "Password"/>
                </div>
            </div>
            <div className="submit-container">
                <div className="submit">Sign Up</div>
            </div>
            <div className="switchLogin">Already have an account? <span>Login</span>
            </div>
        </div>
    )
}

export default Signup