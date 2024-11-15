import React, {useState} from 'react'
import './Login.css'
const Login = ({onSubmit, onSwitch}) => {
    const[username, setUsername] = useState('');
    const[password, setPassword]= useState('')

    const handleSubmit= async(e)=>{
        e.preventDefault()

        try{
            await onSubmit({username, password})
        }catch (error){
            console.error(error)
        }
    }

    return(
        <div className="container">
            <div className="header">
                <div className="text">Login</div>
            </div>
            <form onSubmit={handleSubmit} className="inputs">
                <div className="input">
                    <input
                        type="text"
                        id="login-username"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)} // Bind input value to state
                    />
                </div>
                <div className="input">
                    <input
                        type="password"
                        id="login-password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)} // Bind input value to state
                    />
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit">
                        Login
                    </button>
                </div>
            </form>
            <div className="switchLogin">
                Need an account? <span onClick={onSwitch}>Sign Up</span>
            </div>
        </div>
    )
}

export default Login
