import { useState, useEffect } from 'react';
import API from "../api/api"

const RegisterUser = ({ setToken }) => {
    const [register, setRegister] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    async function registerAccount(email, password, firstName, lastName) {
        try {
            const response = await fetch(`${API}/users`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password, firstName, lastName}),
            });
            const result = await response.json();
            console.log("successfully logged in", result)
            return (
                result.token
            )
        } catch (error) {
            console.error(`User: ${email} already exists`);
        }
    }

    async function registerPage(e) {
        e.preventDefault();
        const APIResponse = await registerAccount(email, password, firstName, lastName);
        setRegister(APIResponse);
        localStorage.setItem("token", APIResponse)
        resetForm();
    };

    function resetForm () {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("")
    }

    return (
        <>
            <div className="register">
                <h2>Sign Up!</h2>
                {error && <p>{error}</p>}
                <form className="form" onSubmit={registerPage}>
                    <label className="label">
                        First Name: <input 
                            type="text" 
                            value={firstName}
                            placeholder="firstname"
                            onChange={(e) => {
                                setFirstName(e.target.value);
                            }}
                            />
                    </label>
                    <br />
                    <label>
                        Last Name: <input 
                            type="text" 
                            value={lastName}
                            placeholder="lastname"
                            onChange={(e) => {
                                setLastName(e.target.value);
                            }}
                            />
                    </label>
                    <br />
                    <label>
                        Email: <input 
                            type="text" 
                            value={email}
                            placeholder="email (required)"
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            required
                            />
                    </label>
                    <br />
                    <label>
                        Password: <input 
                            type="password" 
                            value={password}
                            placeholder="password (required)"
                            onChange={(e) => {
                                setPassword(e.target.value)}}
                            pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
                            title="Must contain at least one uppercase and lowercase letter, and at least 6 or more characters"
                            required
                            />
                    </label>
                    <br />
                    <button>Submit</button>
                </form>
            </div>                
        </>
    )
};

export default RegisterUser;