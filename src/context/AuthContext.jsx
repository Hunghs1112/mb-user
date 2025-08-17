import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(true); // Default to true
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedUser = localStorage.getItem('user');
        if (storedAuth === 'true' && storedUser) {
            const userData = JSON.parse(storedUser);
            setIsAuthenticated(true);
            setUser(userData);
            // Set isUnlocked based on locked field from user data
            const unlocked = userData.locked === 0; // 0 = unlocked, 1 = locked
            setIsUnlocked(unlocked);
            localStorage.setItem('isUnlocked', JSON.stringify(unlocked));
        }
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        const unlocked = userData.locked === 0; // 0 = unlocked, 1 = locked
        setIsUnlocked(unlocked);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isUnlocked', JSON.stringify(unlocked));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setIsUnlocked(true);
        setMessage('');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('isUnlocked');
    };

    const setAuthMessage = (msg) => {
        setMessage(msg);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isUnlocked, login, logout, message, setAuthMessage }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);