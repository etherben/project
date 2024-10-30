import React, {useState} from 'react'
import './Signup.css'
const Signup = ({onSubmit, onSwitch}) => {

    const userData = {
        username: document.getElementById("signup-username").value,
        email: document.getElementById("signup-email").value,
        password: document.getElementById("signup-password").value,
    }


              const handleSubmit= async (e)=> {
                  e.preventDefault();

                      const response = await fetch('http://localhost:8088/auth/signup', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(userData),
                      });
                      if (response.ok) {
                          const result = await response.json();
                          console.log('User signed up successfully:', result);
                          onSubmit(result); // Notify the parent component of the successful signup
                          return;
                      }else{
                          const errorData = await response.json();
                          console.error('Errpr response: ', errorData)
                      }

              };
    return(
        <div className="container">
            <div className="header">
                <div className="text">Sign Up</div>
            </div>
                <form onSubmit={handleSubmit} className="inputs">

                    <div className="input">
                        <input type="Email" id="signup-email" placeholder="Email"/>
                    </div>
                    <div className="input">
                        <input type="Username" id="signup-username" placeholder="Username"/>
                    </div>
                    <div className="input">
                        <input type="Password" id="signup-password" placeholder="Password"/>
                    </div>

                    <div className="submit-container">
                        <button type="submit" className="submit">Sign Up</button>
                    </div>
                </form>
                    <div className="switchLogin">Already have an account? <span onClick={onSwitch}>Login</span>
                    </div>
            </div>
)}

export default Signup

