import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    // 🔥 AXIOS INSTANCE WITH TOKEN
    const api = axios.create({
        baseURL: backendUrl
    });

    // 🔥 attach token automatically
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    // 🔥 check auth
    const getAuthState = async () => {
        try {
            const { data } = await api.get('/api/auth/is-auth');

            setIsLoggedin(true);
            getUserData();

        } catch (err) {
            setIsLoggedin(false);
        }
    };

    // 🔥 get user data
    const getUserData = async () => {
        try {
            const { data } = await api.get('/api/user/data');

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        api // 🔥 IMPORTANT EXPORT
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};