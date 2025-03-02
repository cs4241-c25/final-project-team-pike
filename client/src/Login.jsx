import "./Login.css"
import React, { useState } from "react";
import { Link } from 'react-router-dom';

function Login() {
    const [loginText, setLoginText] = useState("")

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:3000/auth/github")
            const data = await res.json()
            console.log(data) 
        } catch (error) {
            console.error("Error logging in: ", error)
        }
    };

    return (
        <div className="loginPage">
            <h1>choremate login</h1>
            <div className="card">
                {/*<button><Link to="/chores">Log in with Github</Link></button>*/}
                 <a href="http://localhost:3000/auth/github"><button>Log in with Github</button></a>
                {/* <button onClick={handleLogin}>Log in with Github</button>*/}
            </div>
        </div>
    );
}

export default Login;
