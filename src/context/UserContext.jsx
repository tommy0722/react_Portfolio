import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const email = localStorage.getItem('user_email');
        const name = localStorage.getItem('user_name');
        if (email) setUserEmail(email);
        if (name) setUserName(name);
    }, []);

    const login = (email, name) => {
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_name', name);
        setUserEmail(email);
        setUserName(name);
    };

    const logout = () => {
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setUserEmail(null);
        setUserName(null);
    };

    return (
        <UserContext.Provider value={{ userEmail, userName, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
