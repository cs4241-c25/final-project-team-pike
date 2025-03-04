import "./Login.css"
import React, { useState } from "react";

function Login() {
    return (
        <div className="loginPage">
            <h1>choremate login</h1>
            <div className="card">
                 <a href="http://localhost:3000/auth/github"><button>Log in with Github</button></a>
            </div>
        </div>
    );
}

export default Login;
