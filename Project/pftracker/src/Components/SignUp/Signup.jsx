import React, {useState} from 'react'
import './Signup.css'
const Signup = ({onSubmit, onSwitch}) => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')



    const handleSubmit= async (e)=> {
        e.preventDefault();

        if (!username || !email || !password) {
            setError('Please enter a username, email, and password');
            return;
        }


        const userData = {
            email,username, password
        }
        try {
            await onSubmit(userData); // Pass userData to handleSignupSubmit
        } catch (error) {

            console.error('Error during signup:', error);
        }
    };
    return(
        <div className="container">
            <div className="header">
                <div className="text">Sign Up</div>
                {error && <div className="error-message">{error}</div>}
            </div>
            <form onSubmit={handleSubmit} className="inputs">
                <div className="input">
                    <input type="Email"
                           id="signup-email"
                           placeholder="Email"
                           onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="input">
                    <input type="Username"
                           id="signup-username"
                           placeholder="Username"
                           onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="input">
                    <input type="Password" id="signup-password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div className="submit-container">
                    <button type="submit" className="submit">Sign Up</button>
                </div>
            </form>
            <div className="switchLogin">
                Already have an account? <span onClick={onSwitch}>Login</span>
            </div>
        </div>
    )}

export default Signup
