import { createContext, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = async (username, password) => {
        console.log("Login function called with:", { username });
        try {
            console.log("Logging in with:", { username });
            const response = await axios.post('http://localhost:5000/api/auth/login',
                {
                    username,
                    password
                });

            console.log("Server response:", response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            console.log("Setting user:", { username });
            setUser({ username });
            console.log("Setting token:", response.data.token);
            setToken(response.data.token);
            console.log("Login successful, token stored.");
            console.log("User logged in successfully");
        }
        catch {
            alert("Login failed.");
            console.error(err);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        window.location.href = '/';
        console.log("User logged out");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
